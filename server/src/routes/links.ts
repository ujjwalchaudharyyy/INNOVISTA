import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import QRCode from "qrcode";
import { prisma } from "../prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { generateShortCode, isValidUrl, isDomainBlocked } from "../utils/analytics";

const router = Router();

const linkCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  originalUrl: z.string().url("Must be a valid URL"),
  customAlias: z.string().regex(/^[a-zA-Z0-9-_]{3,30}$/, "Custom alias must be 3-30 alphanumeric characters, hyphens or underscores").optional().or(z.literal("")),
  password: z.string().optional().or(z.literal("")),
  clickLimit: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  campaignId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

// GET /api/links - list links for current user with search, filter, pagination
router.get("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { search, status, campaignId, sort, page = "1", limit = "10" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * pageSize;

    const where: any = { userId };

    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { shortCode: { contains: String(search) } },
        { customAlias: { contains: String(search) } },
        { originalUrl: { contains: String(search) } },
      ];
    }

    if (campaignId && campaignId !== "all") {
      where.campaignId = String(campaignId);
    }

    const now = new Date();
    if (status === "active") {
      where.isActive = true;
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gt: now } },
      ];
    } else if (status === "expired") {
      where.expiresAt = { lte: now };
    } else if (status === "disabled") {
      where.isActive = false;
    } else if (status === "protected") {
      where.passwordHash = { not: null };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "clicks_desc") orderBy = { clickCount: "desc" };
    else if (sort === "clicks_asc") orderBy = { clickCount: "asc" };
    else if (sort === "created_asc") orderBy = { createdAt: "asc" };
    else if (sort === "expiry") orderBy = { expiresAt: "asc" };

    const [total, links] = await Promise.all([
      prisma.link.count({ where }),
      prisma.link.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
        include: {
          campaign: { select: { id: true, name: true, color: true } },
          tags: { include: { tag: true } },
          _count: { select: { clicks: true } },
        },
      }),
    ]);

    res.json({
      links: links.map((link) => ({
        ...link,
        hasPassword: !!link.passwordHash,
        passwordHash: undefined, // never expose password hash
        isExpired: link.expiresAt ? new Date(link.expiresAt) <= now : false,
        tags: link.tags.map((t) => t.tag.name),
      })),
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("List links error:", error);
    res.status(500).json({ error: "Failed to fetch links" });
  }
});

// POST /api/links - create new link
router.post("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parseResult = linkCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const {
      title,
      originalUrl,
      customAlias,
      password,
      clickLimit,
      expiresAt,
      campaignId,
      tags = [],
    } = parseResult.data;

    if (!isValidUrl(originalUrl)) {
      res.status(400).json({ error: "Destination URL must start with http:// or https://" });
      return;
    }

    if (await isDomainBlocked(originalUrl)) {
      res.status(400).json({ error: "This domain is restricted by platform security policy." });
      return;
    }

    let shortCode = customAlias?.trim() ? customAlias.trim() : generateShortCode(6);

    // Check alias conflict
    const existing = await prisma.link.findFirst({
      where: {
        OR: [{ shortCode }, { customAlias: shortCode }],
      },
    });

    if (existing) {
      if (customAlias) {
        res.status(400).json({ error: "Custom alias is already in use. Please choose another." });
        return;
      }
      // retry once with longer code
      shortCode = generateShortCode(7);
    }

    let passwordHash: string | null = null;
    if (password && password.trim().length > 0) {
      passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    const link = await prisma.link.create({
      data: {
        title,
        originalUrl,
        shortCode,
        customAlias: customAlias?.trim() ? customAlias.trim() : null,
        passwordHash,
        clickLimit: clickLimit || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        campaignId: campaignId || null,
        userId: req.user!.id,
      },
    });

    // Handle tags
    if (tags.length > 0) {
      for (const tagName of tags) {
        const cleanName = tagName.trim().toLowerCase();
        if (!cleanName) continue;
        const tag = await prisma.tag.upsert({
          where: { name: cleanName },
          update: {},
          create: { name: cleanName },
        });
        await prisma.linkTag.create({
          data: {
            linkId: link.id,
            tagId: tag.id,
          },
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        action: "CREATE_LINK",
        targetType: "Link",
        targetId: link.id,
        details: `Created short link ${shortCode} for ${originalUrl}`,
      },
    });

    res.status(201).json({
      link: {
        ...link,
        hasPassword: !!passwordHash,
        passwordHash: undefined,
      },
    });
  } catch (error) {
    console.error("Create link error:", error);
    res.status(500).json({ error: "Failed to create short link" });
  }
});

// GET /api/links/:id - get link details
router.get("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const link = await prisma.link.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      include: {
        campaign: true,
        tags: { include: { tag: true } },
      },
    });

    if (!link) {
      res.status(404).json({ error: "Link not found" });
      return;
    }

    res.json({
      link: {
        ...link,
        hasPassword: !!link.passwordHash,
        passwordHash: undefined,
        tags: link.tags.map((t: any) => t.tag.name),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch link" });
  }
});

// PUT /api/links/:id - update link
router.put("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const link = await prisma.link.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!link) {
      res.status(404).json({ error: "Link not found" });
      return;
    }

    const {
      title,
      originalUrl,
      isActive,
      clickLimit,
      expiresAt,
      password,
      campaignId,
      tags,
    } = req.body;

    if (originalUrl) {
      if (!isValidUrl(originalUrl)) {
        res.status(400).json({ error: "Invalid original URL" });
        return;
      }
      if (await isDomainBlocked(originalUrl)) {
        res.status(400).json({ error: "Destination domain is blocked" });
        return;
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (originalUrl !== undefined) updateData.originalUrl = originalUrl;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (clickLimit !== undefined) updateData.clickLimit = clickLimit ? parseInt(clickLimit, 10) : null;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (campaignId !== undefined) updateData.campaignId = campaignId || null;

    if (password !== undefined) {
      if (password && password.trim().length > 0) {
        updateData.passwordHash = await bcrypt.hash(password.trim(), 10);
      } else {
        updateData.passwordHash = null; // remove password
      }
    }

    const updated = await prisma.link.update({
      where: { id: link.id },
      data: updateData,
      include: {
        campaign: true,
        tags: { include: { tag: true } },
      },
    });

    if (tags && Array.isArray(tags)) {
      await prisma.linkTag.deleteMany({ where: { linkId: link.id } });
      for (const t of tags) {
        const clean = t.trim().toLowerCase();
        if (!clean) continue;
        const tag = await prisma.tag.upsert({
          where: { name: clean },
          update: {},
          create: { name: clean },
        });
        await prisma.linkTag.create({
          data: { linkId: link.id, tagId: tag.id },
        });
      }
    }

    res.json({
      link: {
        ...updated,
        hasPassword: !!updated.passwordHash,
        passwordHash: undefined,
      },
    });
  } catch (error) {
    console.error("Update link error:", error);
    res.status(500).json({ error: "Failed to update link" });
  }
});

// DELETE /api/links/:id - delete link
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const link = await prisma.link.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!link) {
      res.status(404).json({ error: "Link not found" });
      return;
    }

    await prisma.link.delete({
      where: { id: link.id },
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        action: "DELETE_LINK",
        targetType: "Link",
        targetId: link.id,
        details: `Deleted link ${link.shortCode}`,
      },
    });

    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete link" });
  }
});

// GET /api/links/:id/qr - QR code image download
router.get("/:id/qr", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      res.status(404).json({ error: "Link not found" });
      return;
    }

    const baseUrl = process.env.BASE_SHORT_URL || "http://localhost:5000/r";
    const shortUrl = `${baseUrl}/${link.shortCode}?src=qr`;
    const format = req.query.format === "svg" ? "svg" : "png";
    const darkColor = (req.query.color as string) || "#0F172A";
    const lightColor = "#FFFFFF";

    if (format === "svg") {
      const svg = await QRCode.toString(shortUrl, {
        type: "svg",
        color: { dark: darkColor, light: lightColor },
        margin: 2,
      });
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Content-Disposition", `attachment; filename="${link.shortCode}-qr.svg"`);
      res.send(svg);
    } else {
      const buffer = await QRCode.toBuffer(shortUrl, {
        type: "png",
        width: 600,
        color: { dark: darkColor, light: lightColor },
        margin: 2,
      });
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `attachment; filename="${link.shortCode}-qr.png"`);
      res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

export default router;