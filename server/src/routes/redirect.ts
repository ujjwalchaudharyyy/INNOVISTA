import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { parseVisitorInfo, isDomainBlocked } from "../utils/analytics";

const router = Router();

// GET /r/:code - Main high-speed redirect endpoint
router.get("/:code", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawCode = req.params.code;
    const code = Array.isArray(rawCode) ? rawCode[0] : rawCode;
    const isQrSource = req.query.src === "qr";

    // 1. Find link by shortCode or customAlias
    const link = await prisma.link.findFirst({
      where: {
        OR: [{ shortCode: code }, { customAlias: code }],
      },
    });

    // 2. Return 404 Interstitial if unknown
    if (!link) {
      renderStatusPage(
        res,
        404,
        "Link Not Found",
        `The requested short link "<strong>${code}</strong>" does not exist or has been removed.`,
        "Check that you typed the address correctly or contact the person who shared it."
      );
      return;
    }

    // 3. Check if link is disabled
    if (!link.isActive) {
      renderStatusPage(
        res,
        403,
        "Link Disabled",
        `This short link has been disabled by its owner or the administrator.`,
        "This destination is temporarily unreachable."
      );
      return;
    }

    // 4. Check expiration
    if (link.expiresAt && new Date(link.expiresAt) <= new Date()) {
      renderStatusPage(
        res,
        410,
        "Link Expired",
        `This link expired on ${new Date(link.expiresAt).toUTCString()}.`,
        "The campaign or access window for this URL has ended."
      );
      return;
    }

    // 5. Enforce click limit
    if (link.clickLimit !== null && link.clickCount >= link.clickLimit) {
      renderStatusPage(
        res,
        429,
        "Click Limit Reached",
        `This short link had a maximum access limit of ${link.clickLimit} clicks, which has been exhausted.`,
        "Please request a new link from the sender."
      );
      return;
    }

    // 6. Check destination security policy
    if (await isDomainBlocked(link.originalUrl)) {
      renderStatusPage(
        res,
        403,
        "Security Alert — Blocked Destination",
        `Access to this destination has been blocked due to safety and security violations.`,
        "LinkPulse protects users against malware, phishing, and abusive domains."
      );
      return;
    }

    // 7. Check if password-protected
    if (link.passwordHash) {
      renderPasswordChallenge(res, link.shortCode, link.title);
      return;
    }

    // 8. Record valid click event & atomically increment counter
    await recordClickAndRedirect(req, res, link, isQrSource);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).send("Internal server error handling redirect");
  }
});

// POST /r/:code/verify - Verify password for protected link
router.post("/:code/verify", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawCode = req.params.code;
    const code = Array.isArray(rawCode) ? rawCode[0] : rawCode;
    const { password } = req.body;
    const isQrSource = req.query.src === "qr";

    const link = await prisma.link.findFirst({
      where: {
        OR: [{ shortCode: code }, { customAlias: code }],
      },
    });

    if (!link || !link.passwordHash) {
      res.status(404).json({ error: "Link not found or not protected" });
      return;
    }

    const isMatch = await bcrypt.compare(password || "", link.passwordHash);
    if (!isMatch) {
      renderPasswordChallenge(res, link.shortCode, link.title, "Incorrect password. Please try again.");
      return;
    }

    // Re-check constraints
    if (!link.isActive || (link.expiresAt && new Date(link.expiresAt) <= new Date()) || (link.clickLimit !== null && link.clickCount >= link.clickLimit)) {
      res.redirect(`/r/${link.shortCode}`);
      return;
    }

    await recordClickAndRedirect(req, res, link, isQrSource);
  } catch (error) {
    res.status(500).send("Verification error");
  }
});

async function recordClickAndRedirect(req: Request, res: Response, link: any, isQrCode: boolean) {
  const visitorIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "";
  const referrer = req.headers["referer"] || (req.headers["referrer"] as string) || null;

  const visitor = parseVisitorInfo(userAgent, visitorIp);

  // Atomic database update using transaction
  await prisma.$transaction([
    prisma.link.update({
      where: { id: link.id },
      data: { clickCount: { increment: 1 } },
    }),
    prisma.clickEvent.create({
      data: {
        linkId: link.id,
        ipHash: visitor.ipHash,
        userAgent: visitor.userAgent,
        browser: visitor.browser,
        os: visitor.os,
        device: visitor.device,
        referrer: referrer ? referrer.slice(0, 300) : null,
        isBot: visitor.isBot,
        isQrCode: isQrCode,
        country: "United States", // fallback or geo resolver
      },
    }),
  ]);

  // Fast 302 redirect to original URL
  res.redirect(302, link.originalUrl);
}

function renderStatusPage(res: Response, statusCode: number, title: string, message: string, suggestion: string) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — LinkPulse</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      background: #0B0F19;
      color: #F8FAFC;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .card {
      background: #111827;
      border: 1px solid #1F2937;
      border-radius: 16px;
      max-width: 480px;
      width: 100%;
      padding: 40px;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      background: rgba(239, 68, 68, 0.15);
      color: #EF4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 20px;
    }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #FFFFFF; }
    p { font-size: 15px; color: #94A3B8; line-height: 1.6; margin-bottom: 16px; }
    .suggestion { font-size: 13px; color: #64748B; background: #0B0F19; padding: 12px 16px; border-radius: 8px; border: 1px solid #1E293B; }
    .btn {
      display: inline-block;
      margin-top: 28px;
      padding: 12px 24px;
      background: #6366F1;
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .btn:hover { background: #4F46E5; }
    .logo { font-size: 13px; font-weight: 600; color: #475569; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">HTTP ${statusCode}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <div class="suggestion">${suggestion}</div>
    <a href="http://localhost:5173" class="btn">Return to LinkPulse Home</a>
    <div class="logo">⚡ Powered by LinkPulse Link Management</div>
  </div>
</body>
</html>`;
  res.status(statusCode).send(html);
}

function renderPasswordChallenge(res: Response, code: string, title: string, errorMessage?: string) {
  const errorHtml = errorMessage ? `<div class="error-box">${errorMessage}</div>` : "";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Required — LinkPulse</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      background: #0B0F19;
      color: #F8FAFC;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .card {
      background: #111827;
      border: 1px solid #1F2937;
      border-radius: 16px;
      max-width: 440px;
      width: 100%;
      padding: 40px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .icon {
      width: 48px;
      height: 48px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      color: #818CF8;
      font-size: 20px;
    }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 8px; color: #FFFFFF; }
    p { font-size: 14px; color: #94A3B8; margin-bottom: 24px; line-height: 1.5; }
    .error-box {
      background: rgba(239, 68, 68, 0.15);
      color: #EF4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 13px;
      margin-bottom: 16px;
    }
    label { display: block; font-size: 13px; font-weight: 600; color: #CBD5E1; margin-bottom: 6px; }
    input[type="password"] {
      width: 100%;
      padding: 12px 14px;
      background: #0B0F19;
      border: 1px solid #374151;
      border-radius: 8px;
      color: #FFFFFF;
      font-size: 15px;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="password"]:focus {
      border-color: #6366F1;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }
    button {
      margin-top: 20px;
      width: 100%;
      padding: 12px;
      background: #6366F1;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #4F46E5; }
    .footer { margin-top: 24px; font-size: 12px; text-align: center; color: #475569; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔒</div>
    <h1>Password Protected</h1>
    <p>The link <strong>"${title}"</strong> requires a password to access.</p>
    ${errorHtml}
    <form method="POST" action="/r/${code}/verify">
      <label for="password">Enter Link Password</label>
      <input type="password" id="password" name="password" required autofocus placeholder="••••••••" />
      <button type="submit">Unlock & Continue &rarr;</button>
    </form>
    <div class="footer">Protected by LinkPulse Security Shield</div>
  </div>
</body>
</html>`;
  res.status(200).send(html);
}

export default router;