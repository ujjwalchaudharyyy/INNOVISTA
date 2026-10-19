import React, { useState, useEffect } from "react";
import { QrCode, Download, Sliders, Palette, Check, Copy, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { api, API_BASE } from "../services/api";

export const QrStudioPage: React.FC = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [selectedLink, setSelectedLink] = useState<any | null>(null);
  const [color, setColor] = useState("#000000");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrError, setQrError] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/links?limit=50").then((res) => {
      const list = res.data.links || res.data || [];
      setLinks(list);
      if (list.length > 0) setSelectedLink(list[0]);
    }).catch(() => {
      // fallback demo link so QR always renders something
      const demo = { id: "demo", title: "LinkPulse Demo", shortCode: "demo", originalUrl: "https://linkpulse.io" };
      setLinks([demo]);
      setSelectedLink(demo);
    }).finally(() => setLoading(false));
  }, []);

  // Build a clean public-facing short URL
  // In mock/dev mode, API_BASE is empty — use a placeholder domain so QR generates properly
  const getShortUrl = () => {
    if (!selectedLink) return "";
    const base = API_BASE && API_BASE !== "" ? API_BASE : "https://lnkpls.io";
    return `${base}/r/${selectedLink.shortCode}?src=qr`;
  };

  const shortUrl = getShortUrl();

  // Dynamic resilient QR URL
  const cleanHexColor = color.replace("#", "");
  const qrImageUrl = shortUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encodeURIComponent(shortUrl)}&color=${cleanHexColor}&bgcolor=FFFFFF&margin=15&qzone=2`
    : "";

  const handleDownload = async () => {
    if (!shortUrl) return;
    try {
      const res = await fetch(qrImageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${selectedLink?.shortCode || "linkpulse"}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(qrImageUrl, "_blank");
    }
  };

  const copyShortUrl = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQrLoad = () => {
    setQrError(false);
    setQrLoaded(true);
  };

  const handleQrError = () => {
    setQrError(true);
    setQrLoaded(false);
  };

  // Reset QR load state when URL changes
  useEffect(() => {
    setQrLoaded(false);
    setQrError(false);
  }, [qrImageUrl]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
              Dynamic QR Code Studio
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              High Res Vector
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate, customize, and export high-resolution scan codes with mobile scan attribution
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Panel */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            QR Configuration
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Short Link Target</label>
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2.5 px-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Loading links…
              </div>
            ) : (
              <select
                value={selectedLink?.id || ""}
                onChange={(e) => {
                  const found = links.find((l) => l.id === e.target.value);
                  if (found) setSelectedLink(found);
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                {links.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title || l.shortCode} ({l.shortCode})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <Palette className="inline h-3.5 w-3.5 mr-1" />
              Pixel Contrast Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-16 rounded-xl cursor-pointer bg-transparent border-0"
              />
              <div className="flex flex-wrap gap-2">
                {["#000000", "#4F46E5", "#06B6D4", "#EC4899", "#10B981"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-7 w-7 rounded-lg border-2 transition hover:scale-110 shadow-sm ${color === c ? "border-indigo-500 scale-110" : "border-slate-300 dark:border-slate-700"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Short URL preview */}
          {shortUrl && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">QR Target URL</p>
              <p className="font-mono text-xs text-indigo-600 dark:text-cyan-400 break-all">{shortUrl}</p>
            </div>
          )}

          <div className="pt-1 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDownload}
              disabled={!selectedLink || !qrLoaded}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download High-Res PNG</span>
            </button>

            <button
              onClick={copyShortUrl}
              disabled={!selectedLink}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition active:scale-95 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Copied!" : "Copy URL"}</span>
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-6 rounded-3xl bg-white shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 inline-block mb-4 transition hover:scale-105 duration-300 relative">
            {qrImageUrl ? (
              <>
                {!qrLoaded && !qrError && (
                  <div className="h-52 w-52 sm:h-64 sm:w-64 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
                  </div>
                )}
                {qrError && (
                  <div className="h-52 w-52 sm:h-64 sm:w-64 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <AlertCircle className="h-8 w-8 text-rose-400" />
                    <p className="text-xs">QR generation failed</p>
                    <button
                      onClick={() => { setQrError(false); setQrLoaded(false); }}
                      className="text-xs text-indigo-500 underline"
                    >Retry</button>
                  </div>
                )}
                <img
                  src={qrImageUrl}
                  alt="Dynamic QR Code"
                  className={`h-52 w-52 sm:h-64 sm:w-64 object-contain transition-opacity duration-300 ${qrLoaded ? "opacity-100" : "opacity-0 absolute"}`}
                  onLoad={handleQrLoad}
                  onError={handleQrError}
                />
              </>
            ) : (
              <div className="h-52 w-52 sm:h-64 sm:w-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                <QrCode className="h-12 w-12 text-slate-300" />
                <p className="text-xs">No link selected</p>
              </div>
            )}
          </div>

          <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg mt-2">
            {selectedLink?.title || "Short Route Destination"}
          </h3>
          <p className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-semibold mt-1 max-w-md truncate">{shortUrl}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mt-3 leading-relaxed">
            Scan with any native iOS or Android camera app. Traffic routes through atomic telemetry counter before redirecting.
          </p>

          {/* QR Color indicator */}
          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
            <span
              className="inline-block h-3 w-3 rounded-full border border-slate-200"
              style={{ backgroundColor: color }}
            />
            <span>Color: {color.toUpperCase()}</span>
            <span className="mx-1">·</span>
            <Sparkles className="h-3 w-3" />
            <span>450×450px Vector</span>
          </div>
        </div>
      </div>
    </div>
  );
};