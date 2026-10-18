import crypto from "crypto";
import { UAParser } from "ua-parser-js";
import { prisma } from "../prisma";

export function generateShortCode(length: number = 6): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}

export function isValidUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function isDomainBlocked(urlStr: string): Promise<boolean> {
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();
    const blocked = await prisma.blockedDomain.findFirst({
      where: {
        domain: {
          equals: hostname,
        },
      },
    });
    return !!blocked;
  } catch {
    return true; // Block invalid formats
  }
}

export function parseVisitorInfo(userAgentString?: string, ip?: string) {
  const parser = new UAParser(userAgentString);
  const ua = parser.getResult();

  const browser = ua.browser.name || "Unknown Browser";
  const os = ua.os.name || "Unknown OS";
  
  // Categorize device type
  let device = ua.device.type || "desktop";
  if (!ua.device.type) {
    if (/Mobile|Android|iP(hone|od)/i.test(userAgentString || "")) {
      device = "mobile";
    } else if (/iPad|Tablet/i.test(userAgentString || "")) {
      device = "tablet";
    } else {
      device = "desktop";
    }
  }

  // Detect bots
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgentString || "");

  // Daily privacy salt for IP hashing to respect GDPR & privacy
  const today = new Date().toISOString().slice(0, 10);
  const ipHash = crypto
    .createHash("sha256")
    .update(`${ip || "127.0.0.1"}-${today}-privacy-salt`)
    .digest("hex")
    .slice(0, 16);

  return {
    browser,
    os,
    device,
    isBot,
    ipHash,
    userAgent: userAgentString ? userAgentString.slice(0, 250) : null,
  };
}