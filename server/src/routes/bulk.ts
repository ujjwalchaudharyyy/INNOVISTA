import { Router, Response } from "express";
import { prisma } from "../prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { isValidUrl, isDomainBlocked, generateShortCode } from "../utils/analytics";

const router = Router();

interface CsvRow {
  title: string;
  originalUrl: string;
  customAlias?: string;
  campaignId?: string;
}

// POST /api/bulk/validate - Dry run preview of uploaded rows
router.post("/validate", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rows } = req.body as { rows: CsvRow[] };
    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(400).json({ error: "No rows provided for validation" });
      return;
    }

    if (rows.length > 250) {
      res.status(400).json({ error: "Batch size exceeds limit of 250 rows per file." });
      return;
    }

    const validatedRows = [];
    const aliasSet = new Set<string>();

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const errors: string[] = [];

      if (!row.title || !row.title.trim()) {
        errors.push("Missing title");
      }

      if (!row.originalUrl || !row.originalUrl.trim()) {
        errors.push("Missing destination URL");
      } else if (!isValidUrl(row.originalUrl.trim())) {
        errors.push("Invalid URL scheme (must be http:// or https://)");
      } else if (await isDomainBlocked(row.originalUrl.trim())) {
        errors.push("Destination domain is on platform safety blocklist");
      }

      const alias = row.customAlias?.trim();
      if (alias) {
        if (!/^[a-zA-Z0-9-_]{3,30}$/.test(alias)) {
          errors.push("Alias must be 3-30 alphanumeric characters");
        } else if (aliasSet.has(alias.toLowerCase())) {
          errors.push("Duplicate alias within this CSV batch");
        } else {
          aliasSet.add(alias.toLowerCase());
          const existing = await prisma.link.findFirst({
            where: { OR: [{ shortCode: alias }, { customAlias: alias }] },
          });
          if (existing) {
            errors.push("Alias already taken in database");
          }
        }
      }

      validatedRows.push({
        rowIndex: index + 1,
        title: row.title || "",
        originalUrl: row.originalUrl || "",
        customAlias: alias || "",
        isValid: errors.length === 0,
        errors,
      });
    }

    const validCount = validatedRows.filter((r) => r.isValid).length;
    res.json({
      total: validatedRows.length,
      validCount,
      invalidCount: validatedRows.length - validCount,
      rows: validatedRows,
    });
  } catch (error) {
    console.error("Bulk validate error:", error);
    res.status(500).json({ error: "Failed to validate CSV rows" });
  }
});

// POST /api/bulk/import - Execute verified batch import
router.post("/import", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rows } = req.body as { rows: CsvRow[] };
    const userId = req.user!.id;

    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(400).json({ error: "No rows provided" });
      return;
    }

    const createdLinks = [];
    for (const r of rows) {
      if (!isValidUrl(r.originalUrl)) continue;
      if (await isDomainBlocked(r.originalUrl)) continue;

      let code = r.customAlias?.trim() ? r.customAlias.trim() : generateShortCode(6);
      const existing = await prisma.link.findFirst({
        where: { OR: [{ shortCode: code }, { customAlias: code }] },
      });
      if (existing) {
        if (r.customAlias?.trim()) continue; // skip conflicting custom aliases
        code = generateShortCode(7);
      }

      const created = await prisma.link.create({
        data: {
          title: r.title || "Imported Link",
          originalUrl: r.originalUrl,
          shortCode: code,
          customAlias: r.customAlias?.trim() ? r.customAlias.trim() : null,
          campaignId: r.campaignId || null,
          userId,
        },
      });
      createdLinks.push(created);
    }

    await prisma.auditLog.create({
      data: {
        actorId: userId,
        action: "BULK_IMPORT_LINKS",
        targetType: "Link",
        details: `Imported ${createdLinks.length} links via CSV batch`,
      },
    });

    res.json({
      importedCount: createdLinks.length,
      message: `Successfully imported ${createdLinks.length} links`,
    });
  } catch (error) {
    res.status(500).json({ error: "Bulk import failed" });
  }
});

// GET /api/bulk/export - Export links as CSV
router.get("/export", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const links = await prisma.link.findMany({
      where: { userId },
      include: { campaign: true },
      orderBy: { createdAt: "desc" },
    });

    const headers = ["Title", "Short URL", "Original URL", "Clicks", "Campaign", "Status", "Created At"];
    const baseUrl = process.env.BASE_SHORT_URL || "http://localhost:5000/r";
    const csvLines = [headers.join(",")];

    for (const l of links) {
      const shortUrl = `${baseUrl}/${l.shortCode}`;
      const status = !l.isActive ? "Disabled" : l.expiresAt && new Date(l.expiresAt) <= new Date() ? "Expired" : "Active";
      const campaign = l.campaign ? l.campaign.name.replace(/"/g, '""') : "";
      const title = (l.title || "").replace(/"/g, '""');
      const original = (l.originalUrl || "").replace(/"/g, '""');

      csvLines.push(`"${title}","${shortUrl}","${original}",${l.clickCount},"${campaign}","${status}","${l.createdAt.toISOString()}"`);
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="linkpulse-links-export.csv"');
    res.send(csvLines.join("\n"));
  } catch (error) {
    res.status(500).json({ error: "CSV Export failed" });
  }
});

export default router;