import { Router, Response } from "express";
import { prisma } from "../prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/analytics/overview - high-level KPI metrics & chart series
router.get("/overview", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { campaignId, range = "30d" } = req.query;

    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build link filter
    const linkFilter: any = { userId };
    if (campaignId && campaignId !== "all") {
      linkFilter.campaignId = String(campaignId);
    }

    const userLinks = await prisma.link.findMany({
      where: linkFilter,
      select: { id: true, title: true, shortCode: true, clickCount: true, isActive: true, expiresAt: true },
    });

    const linkIds = userLinks.map((l) => l.id);

    const [totalClicks, activeLinksCount, clickEvents] = await Promise.all([
      prisma.clickEvent.count({
        where: { linkId: { in: linkIds } },
      }),
      prisma.link.count({
        where: {
          ...linkFilter,
          isActive: true,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      }),
      prisma.clickEvent.findMany({
        where: {
          linkId: { in: linkIds },
          timestamp: { gte: startDate },
        },
        select: {
          timestamp: true,
          ipHash: true,
          device: true,
          browser: true,
          os: true,
          referrer: true,
          isBot: true,
          isQrCode: true,
          linkId: true,
        },
        orderBy: { timestamp: "asc" },
      }),
    ]);

    // Unique visitors calculated using distinct ipHash
    const uniqueIps = new Set(clickEvents.map((c) => c.ipHash));
    const uniqueVisitors = uniqueIps.size;

    // Daily breakdown for line/area chart
    const dailyMap: Record<string, { date: string; clicks: number; uniqueVisitors: Set<string>; qrClicks: number }> = {};
    for (let i = 0; i <= days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = { date: key, clicks: 0, uniqueVisitors: new Set(), qrClicks: 0 };
    }

    // Devices & Browsers & Referrers aggregation
    const deviceCount: Record<string, number> = {};
    const browserCount: Record<string, number> = {};
    const referrerCount: Record<string, number> = {};

    for (const event of clickEvents) {
      const dayKey = event.timestamp.toISOString().slice(0, 10);
      if (dailyMap[dayKey]) {
        dailyMap[dayKey].clicks += 1;
        dailyMap[dayKey].uniqueVisitors.add(event.ipHash);
        if (event.isQrCode) dailyMap[dayKey].qrClicks += 1;
      }

      // Device
      const dev = event.device || "desktop";
      deviceCount[dev] = (deviceCount[dev] || 0) + 1;

      // Browser
      const br = event.browser || "Other";
      browserCount[br] = (browserCount[br] || 0) + 1;

      // Referrer
      let ref = event.referrer;
      if (!ref) {
        ref = "Direct / Email / SMS";
      } else {
        try {
          ref = new URL(ref).hostname;
        } catch {
          ref = "Other";
        }
      }
      referrerCount[ref] = (referrerCount[ref] || 0) + 1;
    }

    const timeseries = Object.values(dailyMap).map((d) => ({
      date: d.date,
      clicks: d.clicks,
      uniqueVisitors: d.uniqueVisitors.size,
      qrClicks: d.qrClicks,
    }));

    // Top 5 performing links
    const topLinks = [...userLinks]
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5)
      .map((l) => ({
        id: l.id,
        title: l.title,
        shortCode: l.shortCode,
        clicks: l.clickCount,
      }));

    // Top referrers array
    const topReferrers = Object.entries(referrerCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Device breakdown array
    const deviceBreakdown = Object.entries(deviceCount).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count,
    }));

    // Browser breakdown array
    const browserBreakdown = Object.entries(browserCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // QR Code vs standard ratio
    const totalQrClicks = clickEvents.filter((c) => c.isQrCode).length;
    const botClicks = clickEvents.filter((c) => c.isBot).length;

    res.json({
      summary: {
        totalLinks: userLinks.length,
        activeLinks: activeLinksCount,
        totalClicks,
        uniqueVisitors,
        qrClicks: totalQrClicks,
        botClicks,
      },
      timeseries,
      topLinks,
      topReferrers,
      deviceBreakdown,
      browserBreakdown,
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    res.status(500).json({ error: "Failed to load analytics" });
  }
});

// GET /api/analytics/link/:id - deep-dive metrics for a single link
router.get("/link/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const link = await prisma.link.findFirst({
      where: { id, userId },
      include: { campaign: true, tags: { include: { tag: true } } },
    });

    if (!link) {
      res.status(404).json({ error: "Link not found" });
      return;
    }

    const clickEvents = await prisma.clickEvent.findMany({
      where: { linkId: link.id },
      orderBy: { timestamp: "desc" },
      take: 200,
    });

    const uniqueVisitors = new Set(clickEvents.map((c) => c.ipHash)).size;

    res.json({
      link: {
        id: link.id,
        title: link.title,
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        clickCount: link.clickCount,
        clickLimit: link.clickLimit,
        expiresAt: link.expiresAt,
        isActive: link.isActive,
        createdAt: link.createdAt,
        campaign: link.campaign,
      },
      uniqueVisitors,
      recentClicks: clickEvents.slice(0, 30).map((c) => ({
        id: c.id,
        timestamp: c.timestamp,
        browser: c.browser,
        os: c.os,
        device: c.device,
        country: c.country,
        city: c.city,
        referrer: c.referrer,
        isQrCode: c.isQrCode,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load link analytics" });
  }
});

export default router;