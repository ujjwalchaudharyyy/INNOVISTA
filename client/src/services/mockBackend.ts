// LinkPulse Autonomous Client-Side Engine & Resilient Mock Backend
// Ensures 100% uptime, zero 405/CORS errors, and instant interactive SaaS demo on Vercel or offline

export interface MockLink {
  id: string;
  title: string;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  isActive: boolean;
  createdAt: string;
  tags?: { tag: { id: string; name: string } }[];
  campaign?: { id: string; name: string; color: string } | null;
  campaignId?: string | null;
}

export interface MockCampaign {
  id: string;
  name: string;
  description: string;
  color: string;
  linksCount: number;
  clicksCount: number;
  createdAt: string;
}

export interface MockDomain {
  id: string;
  domain: string;
  reason: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  USER: "linkpulse_user",
  TOKEN: "linkpulse_token",
  LINKS: "linkpulse_mock_links",
  CAMPAIGNS: "linkpulse_mock_campaigns",
  DOMAINS: "linkpulse_mock_domains",
};

// Seed initial realistic enterprise links
const DEFAULT_LINKS: MockLink[] = [
  {
    id: "link-ai-summit",
    title: "AI Summit 2026 Keynote & Workshops",
    shortCode: "ai-summit",
    originalUrl: "https://summit.openai.com/keynote-2026",
    clickCount: 2840,
    isActive: true,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    tags: [{ tag: { id: "t1", name: "AI" } }, { tag: { id: "t2", name: "Events" } }],
    campaign: { id: "c1", name: "Q4 Tech Launch", color: "#6366F1" },
    campaignId: "c1",
  },
  {
    id: "link-pitch-deck",
    title: "Innovista LinkPulse Enterprise Pitch Deck",
    shortCode: "pitch-deck",
    originalUrl: "https://pitch.com/deck/linkpulse-enterprise-v2",
    clickCount: 1690,
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    tags: [{ tag: { id: "t3", name: "Investors" } }],
    campaign: { id: "c1", name: "Q4 Tech Launch", color: "#6366F1" },
    campaignId: "c1",
  },
  {
    id: "link-github-repo",
    title: "Innovista GitHub Source Repository",
    shortCode: "github-repo",
    originalUrl: "https://github.com/ujjwalchaudharyyy/INNOVISTA",
    clickCount: 4210,
    isActive: true,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    tags: [{ tag: { id: "t4", name: "Dev" } }, { tag: { id: "t5", name: "OpenSource" } }],
    campaign: { id: "c2", name: "Developer Community", color: "#06B6D4" },
    campaignId: "c2",
  },
  {
    id: "link-docs-v2",
    title: "Platform API Documentation & SDK Guides",
    shortCode: "docs-v2",
    originalUrl: "https://docs.linkpulse.io/quickstart-guide",
    clickCount: 920,
    isActive: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    tags: [{ tag: { id: "t6", name: "Docs" } }],
    campaign: { id: "c2", name: "Developer Community", color: "#06B6D4" },
    campaignId: "c2",
  },
  {
    id: "link-demo-video",
    title: "LinkPulse UI & Voice Walkthrough Video",
    shortCode: "demo-video",
    originalUrl: "https://youtube.com/watch?v=linkpulse-innovista",
    clickCount: 3120,
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    tags: [{ tag: { id: "t7", name: "Video" } }],
    campaign: { id: "c3", name: "Social Media", color: "#EC4899" },
    campaignId: "c3",
  },
  {
    id: "link-mobile-app",
    title: "LinkPulse Mobile Companion App Preview",
    shortCode: "mobile-app",
    originalUrl: "https://testflight.apple.com/join/linkpulse",
    clickCount: 780,
    isActive: true,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    tags: [{ tag: { id: "t8", name: "Mobile" } }],
    campaign: { id: "c3", name: "Social Media", color: "#EC4899" },
    campaignId: "c3",
  },
];

const DEFAULT_CAMPAIGNS: MockCampaign[] = [
  {
    id: "c1",
    name: "Q4 Tech Launch",
    description: "Global promotion across ProductHunt, HackerNews, and Twitter tech spaces",
    color: "#6366F1",
    linksCount: 2,
    clicksCount: 4530,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "c2",
    name: "Developer Community",
    description: "GitHub README, Discord lounge, and developer documentation pipeline",
    color: "#06B6D4",
    linksCount: 2,
    clicksCount: 5130,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "c3",
    name: "Social Media",
    description: "YouTube demo videos, LinkedIn carousels, and X/Twitter virality loops",
    color: "#EC4899",
    linksCount: 2,
    clicksCount: 3900,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const DEFAULT_DOMAINS: MockDomain[] = [
  {
    id: "dom-1",
    domain: "malicious-phishing-gate.xyz",
    reason: "Zero-day credential harvest attempt flagged by AI Shield",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "dom-2",
    domain: "crypto-wallet-drainer.cc",
    reason: "High-risk web3 smart contract drainer honeypot",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "dom-3",
    domain: "free-giftcards-claim.top",
    reason: "High velocity spam clickbot origin",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

function getStoredLinks(): MockLink[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LINKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(DEFAULT_LINKS));
  return DEFAULT_LINKS;
}

function saveStoredLinks(links: MockLink[]) {
  localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
}

function getStoredCampaigns(): MockCampaign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(DEFAULT_CAMPAIGNS));
  return DEFAULT_CAMPAIGNS;
}

function saveStoredCampaigns(campaigns: MockCampaign[]) {
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
}

function getStoredDomains(): MockDomain[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOMAINS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(STORAGE_KEYS.DOMAINS, JSON.stringify(DEFAULT_DOMAINS));
  return DEFAULT_DOMAINS;
}

function saveStoredDomains(domains: MockDomain[]) {
  localStorage.setItem(STORAGE_KEYS.DOMAINS, JSON.stringify(domains));
}

export function handleMockRequest(config: {
  url?: string;
  method?: string;
  data?: any;
  params?: any;
}): { status: number; data: any } | null {
  const method = (config.method || "get").toLowerCase();
  let url = config.url || "";
  // Strip baseURL prefix if present
  url = url.replace(/^https?:\/\/[^/]+/, "").replace(/^\/api/, "");
  if (!url.startsWith("/")) url = "/" + url;

  let body = config.data;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {}
  }

  // 1. AUTH: LOGIN & REGISTER
  if ((url === "/auth/login" || url === "/auth/register") && method === "post") {
    const email = body?.email || "demo@linkpulse.io";
    const cleanEmail = email.toLowerCase().trim();
    const rawName = body?.name || cleanEmail.split("@")[0].replace(/[._-]/g, " ");
    const displayName = rawName
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const role = cleanEmail.includes("admin") ? "ADMIN" : "USER";
    const user = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      name: displayName || "Innovista Member",
      role,
    };
    const token = "lp_jwt_" + btoa(JSON.stringify(user)) + "_" + Date.now();

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return {
      status: 200,
      data: {
        token,
        user,
      },
    };
  }

  // 2. AUTH: ME
  if (url === "/auth/me" && method === "get") {
    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
    } catch (e) {}
    if (!savedUser) {
      savedUser = {
        id: "usr_default_demo",
        email: "innovista@linkpulse.io",
        name: "Innovista User",
        role: "USER",
      };
    }
    return {
      status: 200,
      data: { user: savedUser },
    };
  }

  // 3. ANALYTICS OVERVIEW
  if (url.startsWith("/analytics/overview") && method === "get") {
    const links = getStoredLinks();
    const totalClicks = links.reduce((sum, l) => sum + l.clickCount, 0);
    const activeLinks = links.filter((l) => l.isActive).length;

    // Generate timeseries for charts
    const timeseries = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const baseMultiplier = 1 + Math.sin(i / 3) * 0.4;
      const clicks = Math.round(180 * baseMultiplier + (i % 5) * 45);
      const unique = Math.round(clicks * 0.72);
      const qr = Math.round(clicks * 0.18);
      timeseries.push({
        date: dateStr,
        clicks,
        uniqueVisitors: unique,
        qrClicks: qr,
      });
    }

    const topLinks = [...links]
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5)
      .map((l) => ({
        id: l.id,
        title: l.title,
        shortCode: l.shortCode,
        clicks: l.clickCount,
      }));

    return {
      status: 200,
      data: {
        summary: {
          totalLinks: links.length,
          activeLinks,
          totalClicks,
          uniqueVisitors: Math.round(totalClicks * 0.74),
          qrClicks: Math.round(totalClicks * 0.16),
          botClicks: 142,
        },
        timeseries,
        topLinks,
        topReferrers: [
          { name: "Twitter / X", count: Math.round(totalClicks * 0.38) },
          { name: "Direct / QR Scan", count: Math.round(totalClicks * 0.24) },
          { name: "LinkedIn Feed", count: Math.round(totalClicks * 0.18) },
          { name: "GitHub Readme", count: Math.round(totalClicks * 0.12) },
          { name: "Google Search", count: Math.round(totalClicks * 0.08) },
        ],
        deviceBreakdown: [
          { name: "Mobile", count: Math.round(totalClicks * 0.58) },
          { name: "Desktop", count: Math.round(totalClicks * 0.36) },
          { name: "Tablet", count: Math.round(totalClicks * 0.06) },
        ],
        browserBreakdown: [
          { name: "Chrome", count: Math.round(totalClicks * 0.55) },
          { name: "Safari", count: Math.round(totalClicks * 0.25) },
          { name: "Firefox", count: Math.round(totalClicks * 0.12) },
          { name: "Edge", count: Math.round(totalClicks * 0.08) },
        ],
      },
    };
  }

  // 4. LINKS: GET LIST
  if (url === "/links" && method === "get") {
    const links = getStoredLinks();
    const search = (config.params?.search || "").toLowerCase();
    const status = config.params?.status || "all";

    let filtered = links.filter((l) => {
      if (search && !l.title.toLowerCase().includes(search) && !l.shortCode.toLowerCase().includes(search) && !l.originalUrl.toLowerCase().includes(search)) {
        return false;
      }
      if (status === "active" && !l.isActive) return false;
      if (status === "inactive" && l.isActive) return false;
      return true;
    });

    return {
      status: 200,
      data: {
        links: filtered,
        pagination: {
          page: 1,
          limit: 50,
          total: filtered.length,
          totalPages: 1,
        },
      },
    };
  }

  // 5. LINKS: CREATE LINK
  if (url === "/links" && method === "post") {
    const links = getStoredLinks();
    const shortCode = body?.customAlias?.trim() || Math.random().toString(36).substring(2, 8);
    
    // Normalize target URL with https:// if protocol was omitted
    let targetUrl = body?.originalUrl?.trim() || "";
    if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
    }

    const newLink: MockLink = {
      id: "link_" + Math.random().toString(36).substring(2, 9),
      title: body?.title || targetUrl,
      shortCode,
      originalUrl: targetUrl,
      clickCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      tags: (body?.tags || []).map((t: string) => ({ tag: { id: "tag_" + t, name: t } })),
      campaign: body?.campaignId ? getStoredCampaigns().find((c) => c.id === body.campaignId) || null : null,
      campaignId: body?.campaignId || null,
    };

    links.unshift(newLink);
    saveStoredLinks(links);

    return {
      status: 201,
      data: { link: newLink },
    };
  }

  // 6. LINKS: TOGGLE / UPDATE
  if (url.match(/^\/links\/[^/]+$/) && method === "put") {
    const id = url.split("/")[2];
    const links = getStoredLinks();
    const index = links.findIndex((l) => l.id === id);
    if (index !== -1) {
      if (typeof body?.isActive === "boolean") {
        links[index].isActive = body.isActive;
      }
      saveStoredLinks(links);
      return { status: 200, data: { link: links[index] } };
    }
  }

  // 7. LINKS: DELETE
  if (url.match(/^\/links\/[^/]+$/) && method === "delete") {
    const id = url.split("/")[2];
    const links = getStoredLinks().filter((l) => l.id !== id);
    saveStoredLinks(links);
    return { status: 200, data: { message: "Link deleted successfully" } };
  }

  // 8. CAMPAIGNS: GET LIST
  if (url === "/campaigns" && method === "get") {
    return {
      status: 200,
      data: { campaigns: getStoredCampaigns() },
    };
  }

  // 9. CAMPAIGNS: CREATE
  if (url === "/campaigns" && method === "post") {
    const campaigns = getStoredCampaigns();
    const newCampaign: MockCampaign = {
      id: "c_" + Math.random().toString(36).substring(2, 8),
      name: body?.name || "New Marketing Campaign",
      description: body?.description || "",
      color: body?.color || "#6366F1",
      linksCount: 0,
      clicksCount: 0,
      createdAt: new Date().toISOString(),
    };
    campaigns.push(newCampaign);
    saveStoredCampaigns(campaigns);
    return { status: 201, data: { campaign: newCampaign } };
  }

  // 10. CAMPAIGNS: DELETE
  if (url.match(/^\/campaigns\/[^/]+$/) && method === "delete") {
    const id = url.split("/")[2];
    const campaigns = getStoredCampaigns().filter((c) => c.id !== id);
    saveStoredCampaigns(campaigns);
    return { status: 200, data: { message: "Campaign deleted" } };
  }

  // 11. ADMIN: OVERVIEW
  if (url === "/admin/overview" && method === "get") {
    return {
      status: 200,
      data: {
        summary: {
          totalLinks: getStoredLinks().length + 84,
          totalClicks: 38490,
          flaggedLinks: 3,
          blockedDomains: getStoredDomains().length,
        },
        flaggedLinks: [
          {
            id: "fl-1",
            title: "Urgent Security Verification Login",
            shortCode: "sec-verify",
            originalUrl: "http://malicious-phishing-gate.xyz/verify",
            clickCount: 14,
            isMalicious: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            user: { email: "attacker@suspicious.cc" },
          },
        ],
      },
    };
  }

  // 12. ADMIN: DOMAINS
  if (url === "/admin/domains" && method === "get") {
    return {
      status: 200,
      data: { domains: getStoredDomains() },
    };
  }

  if (url === "/admin/domains" && method === "post") {
    const domains = getStoredDomains();
    const newDomain: MockDomain = {
      id: "dom_" + Math.random().toString(36).substring(2, 8),
      domain: body?.domain || "badsite.com",
      reason: body?.reason || "Flagged domain",
      createdAt: new Date().toISOString(),
    };
    domains.unshift(newDomain);
    saveStoredDomains(domains);
    return { status: 201, data: { domain: newDomain } };
  }

  if (url.match(/^\/admin\/domains\/[^/]+$/) && method === "delete") {
    const id = url.split("/")[3];
    const domains = getStoredDomains().filter((d) => d.id !== id);
    saveStoredDomains(domains);
    return { status: 200, data: { message: "Domain unblocked" } };
  }

  // 13. BULK VALIDATE & IMPORT
  if (url === "/bulk/validate" && method === "post") {
    const rows = (body?.rows || []).map((r: any, idx: number) => ({
      ...r,
      index: idx + 1,
      isValid: Boolean(r.originalUrl && (r.originalUrl.startsWith("http://") || r.originalUrl.startsWith("https://"))),
      error: !r.originalUrl ? "Missing URL" : null,
    }));
    return {
      status: 200,
      data: {
        rows,
        validCount: rows.filter((r: any) => r.isValid).length,
        invalidCount: rows.filter((r: any) => !r.isValid).length,
      },
    };
  }

  if (url === "/bulk/import" && method === "post") {
    const links = getStoredLinks();
    const rows = body?.rows || [];
    rows.forEach((r: any) => {
      links.unshift({
        id: "bulk_" + Math.random().toString(36).substring(2, 8),
        title: r.title || r.originalUrl,
        shortCode: r.customAlias || Math.random().toString(36).substring(2, 8),
        originalUrl: r.originalUrl,
        clickCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      });
    });
    saveStoredLinks(links);
    return {
      status: 200,
      data: { message: `Successfully imported ${rows.length} links` },
    };
  }

  // Fallback default response
  return {
    status: 200,
    data: { success: true },
  };
}
