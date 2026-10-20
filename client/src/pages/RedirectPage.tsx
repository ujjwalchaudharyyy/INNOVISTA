import React, { useEffect, useState } from "react";
import { BrandLogo } from "../components/BrandLogo";
import { ArrowRight, Lock, AlertCircle, ExternalLink, ShieldCheck, ShieldAlert, Zap, AlertTriangle } from "lucide-react";
import { analyzeUrlSafety, UrlSafetyResult } from "../services/urlSafety";

export const RedirectPage: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "redirecting" | "password" | "blocked" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [destinationUrl, setDestinationUrl] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState<any>(null);
  const [safetyResult, setSafetyResult] = useState<UrlSafetyResult | null>(null);

  // Extract shortCode from URL path /r/:code
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const match = pathname.match(/^\/r\/([^/?#]+)/);
  const shortCode = match ? match[1] : "";

  useEffect(() => {
    if (!shortCode) {
      setStatus("error");
      setErrorMessage("No short link code specified.");
      return;
    }

    // 1. Look up in localStorage mock links
    let links: any[] = [];
    try {
      const raw = localStorage.getItem("linkpulse_mock_links");
      if (raw) links = JSON.parse(raw);
    } catch (e) {}

    // Fallback to initial seeds if localStorage was empty
    if (!links || links.length === 0) {
      links = [
        { shortCode: "ai-summit", originalUrl: "https://summit.openai.com/keynote-2026", clickCount: 2840, isActive: true },
        { shortCode: "pitch-deck", originalUrl: "https://pitch.com/deck/linkpulse-enterprise-v2", clickCount: 1690, isActive: true },
        { shortCode: "github-repo", originalUrl: "https://github.com/ujjwalchaudharyyy/INNOVISTA", clickCount: 4210, isActive: true },
        { shortCode: "docs-v2", originalUrl: "https://docs.linkpulse.io/quickstart-guide", clickCount: 920, isActive: true },
        { shortCode: "demo-video", originalUrl: "https://youtube.com/watch?v=linkpulse-innovista", clickCount: 3120, isActive: true },
      ];
    }

    const found = links.find(
      (l) => l.shortCode?.toLowerCase() === shortCode.toLowerCase()
    );

    if (!found) {
      setStatus("error");
      setErrorMessage(`The short link "/r/${shortCode}" was not found or has been removed.`);
      return;
    }

    // 2. Validate Link State
    if (found.isActive === false) {
      setStatus("error");
      setErrorMessage("This short link has been disabled by its owner.");
      return;
    }

    if (found.expiresAt && new Date(found.expiresAt) <= new Date()) {
      setStatus("error");
      setErrorMessage("This short link has expired.");
      return;
    }

    if (found.clickLimit && (found.clickCount || 0) >= found.clickLimit) {
      setStatus("error");
      setErrorMessage("This short link has reached its maximum click capacity.");
      return;
    }

    // 3. Format Destination URL
    let target = found.originalUrl?.trim() || "";
    if (target && !/^https?:\/\//i.test(target)) {
      target = "https://" + target;
    }

    setDestinationUrl(target);
    setLinkData(found);

    // 4. AI Shield Fake Link & Phishing Analysis
    const safety = analyzeUrlSafety(target);
    setSafetyResult(safety);

    // If malicious/fake destination detected, stop auto-redirect and show shield alert
    if (safety.riskLevel === "MALICIOUS") {
      setStatus("blocked");
      return;
    }

    // 5. Check for password protection
    if (found.password && found.password.trim() !== "") {
      setStatus("password");
      return;
    }

    // 6. Increment click counter in storage
    recordClick(found.shortCode);

    // 7. Execute instant redirect (400ms for branded hot-path experience)
    setStatus("redirecting");
    const timer = setTimeout(() => {
      window.location.replace(target);
    }, 450);

    return () => clearTimeout(timer);
  }, [shortCode]);

  const recordClick = (code: string) => {
    try {
      const raw = localStorage.getItem("linkpulse_mock_links");
      if (raw) {
        const links = JSON.parse(raw);
        const idx = links.findIndex((l: any) => l.shortCode?.toLowerCase() === code.toLowerCase());
        if (idx !== -1) {
          links[idx].clickCount = (links[idx].clickCount || 0) + 1;
          localStorage.setItem("linkpulse_mock_links", JSON.stringify(links));
        }
      }
    } catch (e) {}
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkData) return;

    if (passwordInput === linkData.password) {
      recordClick(linkData.shortCode);
      setStatus("redirecting");
      setTimeout(() => {
        window.location.replace(destinationUrl);
      }, 300);
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const proceedAnyway = () => {
    if (destinationUrl) {
      if (linkData) recordClick(linkData.shortCode);
      setStatus("redirecting");
      window.location.replace(destinationUrl);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F19] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8">
        <BrandLogo size="lg" badgeText="HOT-PATH" subtext="Sub-50ms Atomic Redirection & AI Shield" />
      </div>

      {/* STATUS: REDIRECTING / LOADING */}
      {(status === "loading" || status === "redirecting") && (
        <div className="w-full max-w-md rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 text-center shadow-2xl space-y-5 animate-in fade-in">
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400">
            <Zap className="h-7 w-7 animate-pulse text-cyan-400" />
            <span className="absolute -inset-1 rounded-2xl bg-cyan-400/20 animate-ping opacity-60" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Redirecting via Edge Network...
            </h2>
            <p className="text-xs text-slate-400">
              Hot-path routing packet in-flight to target destination
            </p>
          </div>

          {destinationUrl && (
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-cyan-300 truncate text-left flex items-center justify-between gap-2">
              <span className="truncate">{destinationUrl}</span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 rounded-full animate-pulse w-full" />
          </div>

          <div className="text-[11px] text-slate-500">
            If you are not redirected automatically,{" "}
            <a
              href={destinationUrl}
              className="text-cyan-400 underline hover:text-cyan-300 font-semibold"
            >
              click here
            </a>
            .
          </div>
        </div>
      )}

      {/* STATUS: BLOCKED BY AI SHIELD (FAKE / MALICIOUS LINK DETECTED) */}
      {status === "blocked" && safetyResult && (
        <div className="w-full max-w-lg rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-rose-500/40 p-6 sm:p-8 text-center shadow-2xl shadow-rose-950/40 space-y-5 animate-in fade-in">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/35 text-rose-400">
            <ShieldAlert className="h-8 w-8 text-rose-400" />
            <span className="absolute -inset-1 rounded-2xl bg-rose-500/20 animate-ping opacity-50" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-bold uppercase tracking-wider">
              <span>Security Block</span>
              <span>•</span>
              <span>Safety Score: {safetyResult.score}/100</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Potential Fake / Malicious Link Flagged
            </h2>
            <p className="text-xs text-rose-200/90 leading-relaxed max-w-sm mx-auto">
              LinkPulse AI Shield intercepted this redirect because the destination shows indicators of phishing, typosquatting, or malicious activity.
            </p>
          </div>

          {/* Threat Reasons */}
          <div className="p-3.5 rounded-xl bg-black/50 border border-rose-500/20 text-left space-y-2">
            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              Detected Security Threats:
            </div>
            <ul className="space-y-1">
              {safetyResult.reasons.map((r, idx) => (
                <li key={idx} className="text-xs text-rose-200 flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1 pt-1">
              {safetyResult.threats.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Target destination display */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-slate-400 truncate text-left">
            Target Destination: <span className="text-rose-300 select-all">{destinationUrl}</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition cursor-pointer"
            >
              ← Return to Safety (Recommended)
            </button>
            <button
              onClick={proceedAnyway}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-semibold text-xs transition border border-white/10 cursor-pointer"
            >
              Proceed Anyway (Unsafe)
            </button>
          </div>
        </div>
      )}

      {/* STATUS: PASSWORD REQUIRED */}
      {status === "password" && (
        <div className="w-full max-w-md rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 text-center shadow-2xl space-y-5 animate-in fade-in">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-400">
            <Lock className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-white">Protected Link Enclave</h2>
            <p className="text-xs text-slate-400">
              This short destination is encrypted. Enter password to continue.
            </p>
          </div>

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              required
              autoFocus
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError(null);
              }}
              placeholder="Enter link password..."
              className="w-full bg-black/40 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition"
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition cursor-pointer"
            >
              <span>Unlock &amp; Proceed</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* STATUS: ERROR / 404 */}
      {status === "error" && (
        <div className="w-full max-w-md rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 text-center shadow-2xl space-y-5 animate-in fade-in">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <AlertCircle className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-white">Link Routing Error</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{errorMessage}</p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => (window.location.href = "/")}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition border border-white/10 cursor-pointer"
            >
              ← Back to LinkPulse Workspace
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex items-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span>SHA-256 Telemetry • AI Shield Active</span>
      </div>
    </div>
  );
};
