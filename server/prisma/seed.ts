import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

function getIpHash(ip: string, date: string): string {
  return crypto.createHash("sha256").update(`${ip}-${date}-salt`).digest("hex").slice(0, 16);
}

async function main() {
  console.log("Cleaning old records...");
  await prisma.clickEvent.deleteMany();
  await prisma.linkTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.abuseReport.deleteMany();
  await prisma.blockedDomain.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.link.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding accounts...");
  const adminPasswordHash = await bcrypt.hash("Admin@123456", 10);
  const userPasswordHash = await bcrypt.hash("Demo@123456", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@linkpulse.io",
      name: "Alex Vance (Admin)",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: "demo@linkpulse.io",
      name: "Sarah Chen",
      passwordHash: userPasswordHash,
      role: "USER",
    },
  });

  console.log("Seeding campaigns...");
  const blackFridayCampaign = await prisma.campaign.create({
    data: {
      name: "Q4 Black Friday & Cyber Week",
      description: "Omni-channel marketing links for product launches and holiday discounts",
      color: "#6366F1",
      userId: demoUser.id,
    },
  });

  const developerLaunchCampaign = await prisma.campaign.create({
    data: {
      name: "API & Dev Ecosystem 2.0",
      description: "Developer portal documentation, Discord invites and GitHub repo links",
      color: "#06B6D4",
      userId: demoUser.id,
    },
  });

  const enterpriseCampaign = await prisma.campaign.create({
    data: {
      name: "Enterprise Sales Outbound",
      description: "Pitch decks, calendar meeting invites, and executive summaries",
      color: "#EC4899",
      userId: demoUser.id,
    },
  });

  console.log("Seeding tags...");
  const tagProduct = await prisma.tag.create({ data: { name: "product" } });
  const tagPromo = await prisma.tag.create({ data: { name: "promotion" } });
  const tagDocs = await prisma.tag.create({ data: { name: "documentation" } });
  const tagSecret = await prisma.tag.create({ data: { name: "confidential" } });

  console.log("Seeding links...");
  const protectedPassword = await bcrypt.hash("secret2026", 10);

  const link1 = await prisma.link.create({
    data: {
      title: "LinkPulse Product Hunt Launch Page",
      originalUrl: "https://www.producthunt.com/posts/linkpulse-analytics",
      shortCode: "ph-launch",
      customAlias: "ph-launch",
      userId: demoUser.id,
      campaignId: blackFridayCampaign.id,
      tags: { create: [{ tagId: tagProduct.id }, { tagId: tagPromo.id }] },
    },
  });

  const link2 = await prisma.link.create({
    data: {
      title: "Modern API Docs & Developer Guide",
      originalUrl: "https://docs.github.com/en/rest",
      shortCode: "api-v2",
      customAlias: "api-v2",
      userId: demoUser.id,
      campaignId: developerLaunchCampaign.id,
      tags: { create: [{ tagId: tagDocs.id }] },
    },
  });

  const link3 = await prisma.link.create({
    data: {
      title: "Confidential Q4 Financial Forecast",
      originalUrl: "https://investor.stripe.com",
      shortCode: "q4-finance",
      customAlias: "q4-finance",
      passwordHash: protectedPassword,
      userId: demoUser.id,
      campaignId: enterpriseCampaign.id,
      tags: { create: [{ tagId: tagSecret.id }] },
    },
  });

  const link4 = await prisma.link.create({
    data: {
      title: "Limited Flash Deal (Capped at 50 clicks)",
      originalUrl: "https://stripe.com/pricing",
      shortCode: "flash-50",
      customAlias: "flash-50",
      clickLimit: 50,
      clickCount: 18,
      userId: demoUser.id,
      campaignId: blackFridayCampaign.id,
      tags: { create: [{ tagId: tagPromo.id }] },
    },
  });

  console.log("Generating 120+ realistic click events...");
  const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
  const osList = ["Windows", "macOS", "Linux", "iOS", "Android"];
  const devices = ["desktop", "mobile", "tablet"];
  const referrers = [
    "https://twitter.com/t.co",
    "https://linkedin.com/feed",
    "https://news.ycombinator.com",
    "https://github.com",
    "direct",
  ];
  const countries = ["United States", "Germany", "United Kingdom", "India", "Canada"];

  const sampleLinks = [link1, link2, link3, link4];
  const clicksToInsert = [];

  for (let daysAgo = 13; daysAgo >= 0; daysAgo--) {
    const clicksToday = Math.floor(Math.random() * 10) + 6;
    for (let i = 0; i < clicksToday; i++) {
      const selectedLink = sampleLinks[Math.floor(Math.random() * sampleLinks.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const browser = browsers[Math.floor(Math.random() * browsers.length)];
      const os = osList[Math.floor(Math.random() * osList.length)];
      const device = os === "iOS" || os === "Android" ? "mobile" : devices[Math.floor(Math.random() * devices.length)];
      const referrer = referrers[Math.floor(Math.random() * referrers.length)];
      const isBot = Math.random() < 0.04;
      const isQrCode = Math.random() < 0.25;

      const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 + Math.floor(Math.random() * 86400000));
      const fakeIp = `192.168.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 255)}`;

      clicksToInsert.push({
        linkId: selectedLink.id,
        timestamp: date,
        ipHash: getIpHash(fakeIp, date.toISOString().slice(0, 10)),
        userAgent: `Mozilla/5.0 (${os}; LinkPulseBot/1.0)`,
        browser,
        os,
        device,
        country,
        city: "San Francisco",
        referrer: referrer === "direct" ? null : referrer,
        isBot,
        isQrCode,
      });
    }
  }

  await prisma.clickEvent.createMany({ data: clicksToInsert });

  for (const l of sampleLinks) {
    const total = await prisma.clickEvent.count({ where: { linkId: l.id } });
    await prisma.link.update({ where: { id: l.id }, data: { clickCount: total } });
  }

  console.log("Seeding domain blacklist & audit logs...");
  await prisma.blockedDomain.createMany({
    data: [
      { domain: "phishing-bank-login.com", reason: "Known credential harvesting domain" },
      { domain: "crypto-free-giveaway.xyz", reason: "Cryptocurrency scam domain" },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: admin.id,
        action: "ADD_BLOCKED_DOMAIN",
        targetType: "BlockedDomain",
        details: "Blocked domain phishing-bank-login.com",
      },
    ],
  });

  console.log("Seeded successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());