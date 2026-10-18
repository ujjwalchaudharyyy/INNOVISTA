import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
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
  Download,
  AlertCircle
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

  useEffect(() => {
    fetchLinks();
  }, [search, status, page]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/links", {
        params: { search, status, page, limit: 10 },
      });
      setLinks(res.data.links);
      setTotalPages(res.data.pagination.totalPages);
      setTotalLinks(res.data.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = (shortCode: string, id: string) => {
    navigator.clipboard.writeText(`${API_BASE}/r/${shortCode}`);
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">My Short Links</h1>
          <p className="text-xs text-slate-400 mt-1">Manage, filter, monitor and secure your published URLs ({totalLinks} Total)</p>
        </div>
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
        >
          <span>+ Create Link</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search links, aliases or URLs..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Links" },
            { id: "active", label: "Active" },
            { id: "expired", label: "Expired" },
            { id: "disabled", label: "Disabled" },
            { id: "protected", label: "Password Lock" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatus(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                status === tab.id
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Links Data Table */}
      <div className="rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Link Details</th>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Clicks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading links telemetry...
                  </td>
                </tr>
              ) : links.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No short links matching query. Click "+ Create Link" to start.
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 truncate">{link.title}</span>
                        {link.hasPassword && (
                          <span title="Password Protected" className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Lock className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-indigo-400 text-xs">
                          {link.shortCode}
                        </span>
                        <span className="text-slate-500">→</span>
                        <span className="text-slate-400 truncate text-[11px] max-w-[200px]" title={link.originalUrl}>
                          {link.originalUrl}
                        </span>
                      </div>
                      {link.tags && link.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {link.tags.map((t: string) => (
                            <span key={t} className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {link.campaign ? (
                        <span
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                          style={{
                            backgroundColor: `${link.campaign.color}20`,
                            color: link.campaign.color,
                            border: `1px solid ${link.campaign.color}40`,
                          }}
                        >
                          {link.campaign.name}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{link.clickCount}</div>
                      {link.clickLimit && (
                        <div className="text-[10px] text-slate-400">Cap: {link.clickLimit}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {!link.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Disabled
                        </span>
                      ) : link.isExpired ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => copyUrl(link.shortCode, link.id)}
                          title="Copy Link"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                          {copiedId === link.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                        </button>

                        <a
                          href={`${API_BASE}/r/${link.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Visit Short URL"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>

                        <button
                          onClick={() => downloadQr(link.id, link.shortCode)}
                          title="Download QR Code"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => toggleLinkStatus(link)}
                          title={link.isActive ? "Deactivate Link" : "Activate Link"}
                          className={`p-1.5 rounded-lg transition ${
                            link.isActive ? "text-emerald-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-800"
                          }`}
                        >
                          <Power className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => deleteLink(link.id)}
                          title="Delete Link"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};