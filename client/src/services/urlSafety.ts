// LinkPulse AI Shield — Real-Time Fake & Malicious Link Detection Engine

export interface UrlSafetyResult {
  isSafe: boolean;
  riskLevel: "SAFE" | "SUSPICIOUS" | "MALICIOUS";
  score: number; // 0 to 100
  threats: string[];
  reasons: string[];
  domain: string;
}

// High-risk TLDs heavily abused for phishing, scams, and malware
const SUSPICIOUS_TLDS = new Set([
  "top", "xyz", "cc", "tk", "ml", "ga", "cf", "gq", 
  "buzz", "fit", "rest", "work", "click", "cam", "monster", 
  "vip", "icu", "country", "surf", "win", "bid", "racing", 
  "download", "stream", "accountant", "cricket", "science", "party"
]);

// Trusted major platforms
const TRUSTED_DOMAINS = new Set([
  "google.com", "youtube.com", "github.com", "microsoft.com", 
  "apple.com", "amazon.com", "linkedin.com", "twitter.com", 
  "x.com", "instagram.com", "facebook.com", "reddit.com", 
  "wikipedia.org", "openai.com", "netflix.com", "spotify.com", 
  "stackoverflow.com", "vercel.com", "linkpulse.io", "zoom.us", 
  "dropbox.com", "slack.com", "adobe.com", "figma.com", "medium.com"
]);

// Known malicious / phishing test domains
const KNOWN_MALICIOUS_DOMAINS = new Set([
  "malicious-phishing-gate.xyz",
  "crypto-wallet-drainer.cc",
  "free-giftcards-claim.top",
  "secure-login-account-update.xyz",
  "paypal-security-alert.top",
  "metamask-airdrop-claim.cc",
  "telegram-free-premium.xyz",
  "steam-trade-offers-gift.top",
  "account-recovery-verify.cc"
]);

// Brands commonly targeted by phishing impersonators
const TARGETED_BRANDS = [
  "paypal", "google", "apple", "microsoft", "amazon", 
  "netflix", "facebook", "instagram", "whatsapp", "telegram", 
  "binance", "coinbase", "metamask", "steam", "discord", 
  "chase", "bankofamerica", "wellsfargo", "twitter"
];

// High-risk trigger keywords in URL or hostname
const PHISHING_KEYWORDS = [
  "login-verify", "account-suspended", "confirm-identity", 
  "billing-update", "wallet-drain", "airdrop-claim", 
  "free-nitro", "free-robux", "gift-card-claim", 
  "credential-recovery", "verify-password", "claim-bonus", 
  "unlock-account", "security-alert-action", "unusual-activity-confirm"
];

/**
 * Analyzes any target URL to detect whether it is fake, phishing, or malicious.
 */
export function analyzeUrlSafety(rawUrl: string): UrlSafetyResult {
  const threats: string[] = [];
  const reasons: string[] = [];
  let score = 100;

  if (!rawUrl || rawUrl.trim() === "") {
    return {
      isSafe: true,
      riskLevel: "SAFE",
      score: 100,
      threats: [],
      reasons: ["Empty URL"],
      domain: "",
    };
  }

  // Prepend protocol if missing for URL parsing
  let normalized = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = "https://" + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return {
      isSafe: false,
      riskLevel: "MALICIOUS",
      score: 10,
      threats: ["Invalid URL Syntax"],
      reasons: ["Malformed URL format cannot be resolved safely"],
      domain: rawUrl,
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const fullPath = (parsed.pathname + parsed.search).toLowerCase();

  // 1. Check against trusted platform list
  const isTrusted = Array.from(TRUSTED_DOMAINS).some(
    (td) => hostname === td || hostname.endsWith("." + td)
  );

  if (isTrusted && !fullPath.includes("login-fake")) {
    return {
      isSafe: true,
      riskLevel: "SAFE",
      score: 99,
      threats: [],
      reasons: ["Verified authentic platform domain"],
      domain: hostname,
    };
  }

  // 2. Check against known malicious domain blocklist
  if (KNOWN_MALICIOUS_DOMAINS.has(hostname)) {
    threats.push("Known Malicious Domain");
    reasons.push("Domain is flagged in the global cybersecurity threat blocklist.");
    score -= 85;
  }

  // Also check admin shield local blocklist if stored in browser
  try {
    const rawBlocked = localStorage.getItem("linkpulse_mock_domains");
    if (rawBlocked) {
      const blockedList: any[] = JSON.parse(rawBlocked);
      if (blockedList.some((d) => d.domain?.toLowerCase() === hostname)) {
        threats.push("Admin Shield Blocklist");
        reasons.push("Domain has been explicitly blacklisted by security administrators.");
        score -= 90;
      }
    }
  } catch (e) {}

  // 3. Raw IP Address as Hostname Detection (e.g. http://192.168.1.5/...)
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.startsWith("[");
  if (isIpAddress) {
    threats.push("Raw IP Hostname");
    reasons.push("Destination uses an unmasked IP address instead of a verified domain name.");
    score -= 45;
  }

  // 4. Suspicious Top-Level Domain (TLD) Check
  const domainParts = hostname.split(".");
  const tld = domainParts[domainParts.length - 1];
  if (SUSPICIOUS_TLDS.has(tld)) {
    threats.push(`High-Risk TLD (.${tld})`);
    reasons.push(`The .${tld} extension has a statistically high correlation with disposable phishing sites.`);
    score -= 30;
  }

  // 5. Typosquatting & Brand Impersonation Check (e.g., paypa1, g00gle, netfl1x)
  for (const brand of TARGETED_BRANDS) {
    // Exact match is safe, but fake lookalikes are detected
    if (hostname.includes(brand) && !hostname.endsWith(`${brand}.com`)) {
      // e.g., paypal-security.xyz or account-update-google.net
      threats.push(`Brand Impersonation (${brand})`);
      reasons.push(`Domain contains brand name "${brand}" on an unauthorized host.`);
      score -= 50;
      break;
    }

    // Leetspeak replacements: 0 -> o, 1 -> l, etc.
    const deobfuscated = hostname
      .replace(/0/g, "o")
      .replace(/1/g, "l")
      .replace(/vv/g, "w")
      .replace(/rn/g, "m");

    if (deobfuscated.includes(brand) && !hostname.includes(brand)) {
      threats.push(`Typosquatting (${brand} spoof)`);
      reasons.push(`Homoglyph attack detected: character substitution spoofing "${brand}".`);
      score -= 60;
      break;
    }
  }

  // 6. Phishing & Scam Keyword Triggers
  for (const kw of PHISHING_KEYWORDS) {
    if (hostname.includes(kw) || fullPath.includes(kw)) {
      threats.push("Phishing Pattern Detected");
      reasons.push(`Contains high-risk credential-harvesting keyword: "${kw}".`);
      score -= 35;
      break;
    }
  }

  // 7. Excessive Subdomain / Multi-Hyphen Obfuscation
  if (domainParts.length > 4) {
    threats.push("Deep Subdomain Nesting");
    reasons.push("Excessive subdomains used to disguise the true destination domain.");
    score -= 20;
  }

  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    threats.push("Heavy Domain Hyphenation");
    reasons.push("Multiple hyphens frequently indicate automated scam domain generation.");
    score -= 25;
  }

  // Normalize final score (0 to 100)
  score = Math.max(5, Math.min(100, score));

  // Determine risk level
  let riskLevel: "SAFE" | "SUSPICIOUS" | "MALICIOUS" = "SAFE";
  if (score < 45 || threats.length >= 2) {
    riskLevel = "MALICIOUS";
  } else if (score < 80 || threats.length === 1) {
    riskLevel = "SUSPICIOUS";
  }

  return {
    isSafe: riskLevel === "SAFE",
    riskLevel,
    score,
    threats,
    reasons,
    domain: hostname,
  };
}
