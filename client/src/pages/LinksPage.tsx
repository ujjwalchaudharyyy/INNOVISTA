import React, { useState, useEffect } from "react";
import { 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  QrCode, 
  Lock, 
  Calendar, 
  Power,
  ChevronLeft,
  ChevronRight,
  Plus,
  Link2,
  TrendingUp,
  Tag,
  Sparkles,
  ShieldAlert,
  Clock,
  Layers,
  Share2,
  X
} from "lucide-react";
import { api, API_BASE } from "../services/api";

export const LinksPage: React.FC<{ onOpenCreate: () => void }> = ({ onOpenCreate }) => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharingLink, setSharingLink] = useState<any | null>(null);

  useEffect(() => {
    fetchLinks();
  }, [search, status, page]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/links", {
        params: { search, status, page, limit: 12 },
      });
      const fetchedLinks = res?.data?.links || [];
      setLinks(fetchedLinks);
      setTotalPages(res?.data?.pagination?.totalPages || 1);
      setTotalLinks(res?.data?.pagination?.total || fetchedLinks.length);
    } catch (err) {
      console.error("Error fetching links:", err);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = (shortCode: string, id: string) => {
    const fullUrl = `${API_BASE}/r/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleLinkStatus = async (link: any) => {
    try {
      await api.put(`/links/${link.id}`, { isActive: !link.isActive });
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLink = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this short link?")) {
      try {
        await api.delete(`/links/${id}`);
        fetchLinks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const downloadQr = (id: string, code: string) => {
    window.open(`${API_BASE}/api/links/${id}/qr?format=png`, "_blank");
  };

  // Safe tag extraction helper (handles { tag: { name } }, { name }, or string)
  const extractTagName = (t: any): string => {
    if (!t) return "";
    if (typeof t === "string") return t;
    if (t.tag?.name) return String(t.tag.name);
    if (t.name) return String(t.name);
    return "";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Link2 className="h-6 w-6 text-indigo-400" />
              My Short Links
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {totalLinks} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time redirect management, atomic click metrics, and vanity routing rules
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Short Link</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search titles, short alias, or destination URLs..."
            className="w-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition shadow-sm"
          />
        </div>

        {/* Status filter pills (horizontal scrollable on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Links" },
            { id: "active", label: "Active" },
            { id: "inactive", label: "Disabled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatus(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                status === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500"
                  : "bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content View: Responsive Cards on Mobile / Clean Table on Desktop */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800/80">
          <div className="inline-block h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading links telemetry...</p>
        </div>
      ) : links.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800/80 space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-500/20">
            <Link2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No short links found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {search ? "No links matched your search filter." : "Get started by generating your first high-speed shortened link."}
          </p>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Link Now</span>
          </button>
        </div>
      ) : (
        <>
          {/* 1. MOBILE CARD VIEW (visible on small/medium screens < lg) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {links.map((link) => {
              const tagsList: string[] = Array.isArray(link.tags)
                ? (link.tags.map(extractTagName).filter(Boolean) as string[])
                : [];
              const campaignName = link.campaign?.name || (typeof link.campaign === "string" ? link.campaign : null);
              const campaignColor = link.campaign?.color || "#6366F1";

              return (
                <div
                  key={link.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{link.title || link.shortCode}</h3>
                        {link.hasPassword && (
                          <span title="Password Protected" className="p-1 rounded bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
                            <Lock className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5" title={link.originalUrl}>
                        {link.originalUrl}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        link.isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {link.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>

                  {/* Short Link display pill */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-cyan-400 truncate">
                      linkpulse.io/r/{link.shortCode}
                    </span>
                    <button
                      onClick={() => copyUrl(link.shortCode, link.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition shrink-0 cursor-pointer"
                    >
                      {copiedId === link.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Metadata Row: Clicks + Campaign + Tags */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white font-bold">
                      <TrendingUp className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                      <span>{link.clickCount || 0} Clicks</span>
                    </div>

                    {campaignName && (
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${campaignColor}15`,
                          color: campaignColor,
                          border: `1px solid ${campaignColor}30`,
                        }}
                      >
                        {campaignName}
                      </span>
                    )}

                    {tagsList.slice(0, 2).map((t: string, idx: number) => (
                      <span key={`${t}-${idx}`} className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Mobile Actions Toolbar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <span className="text-[10px] text-slate-500 font-medium">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSharingLink(link)}
                        className="p-2 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 transition"
                        title="Share link"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <a
                        href={`${API_BASE}/r/${link.shortCode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Visit destination"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => downloadQr(link.id, link.shortCode)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Download QR"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleLinkStatus(link)}
                        className={`p-2 rounded-lg transition ${
                          link.isActive ? "text-emerald-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-800"
                        }`}
                        title={link.isActive ? "Deactivate" : "Activate"}
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Delete link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. DESKTOP TABLE VIEW (visible on lg screens) */}
          <div className="hidden lg:block rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Link Details & Short Route</th>
                    <th className="py-3.5 px-4">Campaign</th>
                    <th className="py-3.5 px-4">Clicks</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Created</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {links.map((link) => {
                    const tagsList: string[] = Array.isArray(link.tags)
                      ? (link.tags.map(extractTagName).filter(Boolean) as string[])
                      : [];
                    const campaignName = link.campaign?.name || (typeof link.campaign === "string" ? link.campaign : null);
                    const campaignColor = link.campaign?.color || "#6366F1";

                    return (
                      <tr key={link.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                        <td className="py-4 px-4 max-w-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">{link.title || link.shortCode}</span>
                            {link.hasPassword && (
                              <span title="Password Protected" className="p-1 rounded bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
                                <Lock className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-indigo-600 dark:text-cyan-400 font-semibold text-xs">
                              {link.shortCode}
                            </span>
                            <span className="text-slate-400 dark:text-slate-600">→</span>
                            <span className="text-slate-500 dark:text-slate-400 truncate text-[11px] max-w-[220px]" title={link.originalUrl}>
                              {link.originalUrl}
                            </span>
                          </div>
                          {tagsList.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {tagsList.map((t: string, idx: number) => (
                                <span key={`${t}-${idx}`} className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 px-1.5 py-0.5 rounded">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {campaignName ? (
                            <span
                              className="px-2.5 py-1 rounded-md text-[11px] font-semibold"
                              style={{
                                backgroundColor: `${campaignColor}15`,
                                color: campaignColor,
                                border: `1px solid ${campaignColor}35`,
                              }}
                            >
                              {campaignName}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 text-[11px]">—</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-extrabold text-slate-900 dark:text-white text-sm">{link.clickCount || 0}</div>
                          {link.clickLimit && (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">Cap: {link.clickLimit}</div>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              link.isActive
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {link.isActive ? "Active" : "Disabled"}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSharingLink(link)}
                              title="Share on Social Media"
                              className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => copyUrl(link.shortCode, link.id)}
                              title="Copy Short URL"
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                              {copiedId === link.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                            </button>

                            <a
                              href={`${API_BASE}/r/${link.shortCode}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Visit Destination"
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>

                            <button
                              onClick={() => downloadQr(link.id, link.shortCode)}
                              title="Download QR Code"
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                              <QrCode className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => toggleLinkStatus(link)}
                              title={link.isActive ? "Deactivate Link" : "Activate Link"}
                              className={`p-2 rounded-xl transition cursor-pointer ${
                                link.isActive ? "text-emerald-500 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800" : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <Power className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => deleteLink(link.id)}
                              title="Delete Link"
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
          <span>
            Page <strong className="text-slate-900 dark:text-white">{page}</strong> of <strong className="text-slate-900 dark:text-white">{totalPages}</strong>
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Social Share Modal */}
      {sharingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-800 dark:text-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Share Short Link</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[240px]">{sharingLink.title || sharingLink.shortCode}</p>
                </div>
              </div>
              <button
                onClick={() => setSharingLink(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Short Link Bar */}
            <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-cyan-400 truncate">
                {`${API_BASE}/r/${sharingLink.shortCode}`}
              </span>
              <button
                onClick={() => copyUrl(sharingLink.shortCode, `share-${sharingLink.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shrink-0 cursor-pointer"
              >
                {copiedId === `share-${sharingLink.id}` ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* 1-Click Social Broadcast Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                Broadcast Directly
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Check this out: ${API_BASE}/r/${sharingLink.shortCode}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold transition"
                >
                  <span className="text-base">💬</span>
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Check out this link: ${API_BASE}/r/${sharingLink.shortCode}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 text-xs font-semibold transition"
                >
                  <span className="text-base">🐦</span>
                  <span>Twitter / X</span>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    `${API_BASE}/r/${sharingLink.shortCode}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 text-xs font-semibold transition"
                >
                  <span className="text-base">💼</span>
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    `${API_BASE}/r/${sharingLink.shortCode}`
                  )}&text=${encodeURIComponent(sharingLink.title || "Check this link")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-semibold transition"
                >
                  <span className="text-base">✈️</span>
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            {/* QR Preview & Download */}
            <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                    `${API_BASE}/r/${sharingLink.shortCode}`
                  )}&color=6366f1`}
                  alt="QR Code"
                  className="h-12 w-12 rounded-lg bg-white p-1 border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">Instant QR Code</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Scannable on all phone cameras</span>
                </div>
              </div>
              <button
                onClick={() => downloadQr(sharingLink.id, sharingLink.shortCode)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-medium transition shrink-0 cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};