import React, { useState, useEffect } from "react";
import { QrCode, Download, ExternalLink, Sliders, Palette, Check } from "lucide-react";
import { api, API_BASE } from "../services/api";

export const QrStudioPage: React.FC = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [selectedLink, setSelectedLink] = useState<any | null>(null);
  const [color, setColor] = useState("#0F172A");
  const [format, setFormat] = useState<"png" | "svg">("png");

  useEffect(() => {
    api.get("/links?limit=50").then((res) => {
      const list = res.data.links || [];
      setLinks(list);
      if (list.length > 0) setSelectedLink(list[0]);
    });
  }, []);

  const downloadQr = () => {
    if (!selectedLink) return;
    const url = `${API_BASE}/api/links/${selectedLink.id}/qr?format=${format}&color=${encodeURIComponent(color)}`;
    window.open(url, "_blank");
  };

  const shortUrl = selectedLink ? `${API_BASE}/r/${selectedLink.shortCode}?src=qr` : "";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Dynamic QR Code Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate, customize, and export high-resolution scan codes with mobile scan attribution
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-indigo-400" />
            QR Configuration
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Short Link</label>
            <select
              value={selectedLink?.id || ""}
              onChange={(e) => {
                const found = links.find((l) => l.id === e.target.value);
                if (found) setSelectedLink(found);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {links.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} ({l.shortCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">QR Code Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-12 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="font-mono text-xs text-slate-300 uppercase">{color}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Export Vector / Image Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat("png")}
                className={`py-2 text-xs font-semibold rounded-xl border transition ${
                  format === "png"
                    ? "bg-indigo-600/15 border-indigo-500 text-indigo-400"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                PNG Raster (600px)
              </button>
              <button
                type="button"
                onClick={() => setFormat("svg")}
                className={`py-2 text-xs font-semibold rounded-xl border transition ${
                  format === "svg"
                    ? "bg-indigo-600/15 border-indigo-500 text-indigo-400"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                SVG Vector
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={downloadQr}
              disabled={!selectedLink}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Download {format.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-6 rounded-2xl bg-white shadow-xl shadow-black/40 border border-slate-200 inline-block mb-4">
            {selectedLink ? (
              <img
                src={`${API_BASE}/api/links/${selectedLink.id}/qr?format=png&color=${encodeURIComponent(color)}`}
                alt="QR Code"
                className="h-56 w-56 object-contain"
              />
            ) : (
              <div className="h-56 w-56 flex items-center justify-center text-slate-400 text-xs">
                No link selected
              </div>
            )}
          </div>

          <h3 className="font-bold text-white text-base mt-2">
            {selectedLink?.title || "Short Link"}
          </h3>
          <p className="font-mono text-xs text-indigo-400 mt-1">{shortUrl}</p>
          <p className="text-[11px] text-slate-400 max-w-sm mt-3">
            Dynamic QR destination can be updated anytime without reprinting physical collateral or marketing packaging.
          </p>
        </div>
      </div>
    </div>
  );
};