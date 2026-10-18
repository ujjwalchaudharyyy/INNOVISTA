import React, { useState, useEffect } from "react";
import { 
  X, 
  ArrowRight, 
  Check, 
  Copy, 
  QrCode, 
  Lock, 
  Calendar, 
  Clock, 
  Tag, 
  FolderKanban, 
  Sliders, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { api, API_BASE } from "../services/api";

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateLinkModal: React.FC<CreateLinkModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [password, setPassword] = useState("");
  const [clickLimit, setClickLimit] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [campaignId, setCampaignId] = useState<string>("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Campaigns list
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // Created Result
  const [createdLink, setCreatedLink] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get("/campaigns").then((res) => setCampaigns(res.data.campaigns || [])).catch(() => {});
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setOriginalUrl("");
    setCustomAlias("");
    setPassword("");
    setClickLimit("");
    setExpiresAt("");
    setCampaignId("");
    setTags([]);
    setError(null);
    setCreatedLink(null);
    setCopied(false);
  };

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCreate = async () => {
    setError(null);
    setLoading(true);

    try {
      const payload: any = {
        title: title || originalUrl,
        originalUrl,
        customAlias: customAlias.trim() || undefined,
        password: password.trim() || undefined,
        clickLimit: clickLimit ? parseInt(clickLimit, 10) : null,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        campaignId: campaignId || null,
        tags,
      };

      const res = await api.post("/links", payload);
      setCreatedLink(res.data.link);
      setStep(3);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create short link");
    } finally {
      setLoading(false);
    }
  };

  const fullShortUrl = createdLink ? `${API_BASE}/r/${createdLink.shortCode}` : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-100">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-bold text-sm">
              {step === 3 ? "✓" : `0${step}`}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {step === 1 && "Destination & Link Code"}
                {step === 2 && "Advanced Protection & Targeting"}
                {step === 3 && "Short Link Published!"}
              </h2>
              <p className="text-xs text-slate-400">
                {step === 1 && "Configure target URL and custom branded vanity alias"}
                {step === 2 && "Set password lock, expiration, click caps, or campaign"}
                {step === 3 && "Your link is active, fast, and collecting click telemetry"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Destination */}
        {step === 1 && (
          <div className="space-y-4 pt-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Destination URL <span className="text-rose-400">*</span>
              </label>
              <input
                type="url"
                required
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/long-landing-page-url..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Link Title / Label
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Product Hunt Q4 Special Offer"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Custom Alias (Optional)
              </label>
              <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden transition">
                <span className="px-3.5 py-2.5 bg-slate-800/60 text-slate-400 text-xs font-mono border-r border-slate-800">
                  linkpulse.io/r/
                </span>
                <input
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="custom-slug"
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Leave empty to generate a random 6-character code.</p>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!originalUrl.trim()}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/30"
              >
                <span>Configure Rules</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Options & Safety */}
        {step === 2 && (
          <div className="space-y-4 pt-5 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderKanban className="h-3.5 w-3.5 text-indigo-400" />
                  Assign Campaign
                </label>
                <select
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="">None (Independent Link)</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-cyan-400" />
                  Password Protection
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Optional access password"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-purple-400" />
                  Expiration Date
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-amber-400" />
                  Click Cap Limit
                </label>
                <input
                  type="number"
                  min="1"
                  value={clickLimit}
                  onChange={(e) => setClickLimit(e.target.value)}
                  placeholder="e.g. 100 max visits"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-emerald-400" />
                Tags (Press Enter to add)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-400 hover:text-rose-400 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="promo, twitter, launch (Press Enter)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleCreate}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Create Short Link"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Result */}
        {step === 3 && createdLink && (
          <div className="space-y-5 pt-5 text-center">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Your Short Link is Live!</h3>
              <p className="text-xs text-slate-400 mt-1">Ready for campaigns, social shares, and QR codes.</p>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <span className="font-mono text-sm text-indigo-400 truncate text-left">{fullShortUrl}</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition shrink-0"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <a
                href={fullShortUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Test Redirect</span>
              </a>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};