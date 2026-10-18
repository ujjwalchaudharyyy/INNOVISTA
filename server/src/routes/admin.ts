import { Router, Response } from "express";
import { prisma } from "../prisma";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/admin/overview - platform-wide system metrics
router.get("/overview", requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalLinks, totalClicks, abuseReportsCount, blockedDomainsCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.link.count(),
        prisma.clickEvent.count(),
        prisma.abuseReport.count({ where: { status: "PENDING" } }),
        prisma.blockedDomain.count(),
      ]);

    const recentUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    const recentAuditLogs = await prisma.auditLog.findMany({
      include: { actor: { select: { name: true, email: true } } },
      orderBy: { timestamp: "desc" },
      take: 12,
    });

    const pendingReports = await prisma.abuseReport.findMany({
      where: { status: "PENDING" },
      include: { link: { select: { id: true, shortCode: true, originalUrl: true, isActive: true } } },
      orderBy: { reportedAt: "desc" },
      take: 10,
    });

    res.json({
      metrics: {
        totalUsers,
        totalLinks,
        totalClicks,
        pendingReports: abuseReportsCount,
        blockedDomains: blockedDomainsCount,
      },
      recentUsers,
      recentAuditLogs,
      pendingReports,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load admin overview" });
  }
});

// GET /api/admin/domains - list blocked domains
router.get("/domains", requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const domains = await prisma.blockedDomain.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ domains });
  } catch (error) {
    res.status(500).json({ error: "Failed to load domains" });
  }
});

// POST /api/admin/domains - add domain to blacklist
router.post("/domains", requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { domain, reason } = req.body;
    if (!domain || !domain.trim()) {
      res.status(400).json({ error: "Domain name required" });
      return;
    }

    const cleanDomain = String(domain).trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const created = await prisma.blockedDomain.create({
      data: {
        domain: cleanDomain,
        reason: reason ? String(reason) : "Manual administrator restriction",
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        action: "ADD_BLOCKED_DOMAIN",
        targetType: "BlockedDomain",
        details: `Blocked domain ${cleanDomain}`,
      },
    });

    res.status(201).json({ domain: created });
  } catch (error) {
    res.status(500).json({ error: "Failed to block domain or domain already blocked" });
  }
});

// DELETE /api/admin/domains/:id - unblock domain
router.delete("/domains/:id", requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await prisma.blockedDomain.findUnique({ where: { id } });
    if (!item) {
      res.status(404).json({ error: "Domain entry not found" });
      return;
    }

    await prisma.blockedDomain.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        action: "REMOVE_BLOCKED_DOMAIN",
        targetType: "BlockedDomain",
        details: `Removed block on domain ${item.domain}`,
      },
    });

    res.json({ message: "Domain removed from blocklist" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove domain" });
  }
});

// PUT /api/admin/links/:id/toggle - admin force disable/enable abusive link
router.put("/links/:id/toggle", requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link) {
      res.status(404).json({ error: "Link not found" });
      return;
    }

    const updated = await prisma.link.update({
      where: { id: link.id },
      data: { isActive: !link.isActive },
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        action: updated.isActive ? "ADMIN_ENABLE_LINK" : "ADMIN_DISABLE_LINK",
        targetType: "Link",
        targetId: link.id,
        details: `${updated.isActive ? "Re-activated" : "Disabled"} link ${link.shortCode}`,
      },
    });

    res.json({ link: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle link status" });
  }
});

export default router;