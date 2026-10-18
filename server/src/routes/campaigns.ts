import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const campaignSchema = z.object({
  name: z.string().min(2, "Campaign name must be at least 2 characters"),
  description: z.string().optional().or(z.literal("")),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color code").optional(),
});

// GET /api/campaigns - List campaigns with link counts and click totals
router.get("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const campaigns = await prisma.campaign.findMany({
      where: { userId },
      include: {
        links: {
          select: { id: true, clickCount: true, isActive: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = campaigns.map((c) => {
      const totalClicks = c.links.reduce((acc, curr) => acc + curr.clickCount, 0);
      const activeLinks = c.links.filter((l) => l.isActive).length;
      return {
        id: c.id,
        name: c.name,
        description: c.description,
        color: c.color,
        createdAt: c.createdAt,
        totalLinks: c.links.length,
        activeLinks,
        totalClicks,
      };
    });

    res.json({ campaigns: formatted });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

// POST /api/campaigns - Create campaign
router.post("/", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parse = campaignSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: parse.error.errors[0].message });
      return;
    }

    const { name, description, color } = parse.data;
    const campaign = await prisma.campaign.create({
      data: {
        name,
        description: description || null,
        color: color || "#6366F1",
        userId: req.user!.id,
      },
    });

    res.status(201).json({ campaign });
  } catch (error) {
    res.status(500).json({ error: "Failed to create campaign" });
  }
});

// PUT /api/campaigns/:id - Update campaign
router.put("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parse = campaignSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: parse.error.errors[0].message });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const campaign = await prisma.campaign.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    const updated = await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        name: parse.data.name,
        description: parse.data.description || null,
        color: parse.data.color || campaign.color,
      },
    });

    res.json({ campaign: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update campaign" });
  }
});

// DELETE /api/campaigns/:id - Delete campaign
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const campaign = await prisma.campaign.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    await prisma.campaign.delete({ where: { id: campaign.id } });
    res.json({ message: "Campaign deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete campaign" });
  }
});

export default router;