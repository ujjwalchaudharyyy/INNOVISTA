import React, { useState, useEffect } from "react";
import { ShieldAlert, Globe, Users, Power, Trash2, Plus, AlertTriangle } from "lucide-react";
import { api } from "../services/api";

export const AdminShieldPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [domainReason, setDomainReason] = useState("");
  const [domains, setDomains] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminOverview();
    fetchDomains();
  }, []);

  const fetchAdminOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/overview");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDomains = async () => {
    try {
      const res = await api.get("/admin/domains");
      setDomains(res.data.domains);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/admin/domains", { domain: newDomain, reason: domainReason });
      setNewDomain("");
      setDomainReason("");
      fetchDomains();
      fetchAdminOverview();
    } catch (err: any) {
      alert(err.response?.data?.error || "Error blocking domain");
    }
  };

  const handleUnblockDomain = async (id: string) => {
    if (window.confirm("Remove domain from blocklist?")) {
      try {
        await api.delete(`/admin/domains/${id}`);
        fetchDomains();
        fetchAdminOverview();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleLink = async (id: string) => {
    try {
      await api.put(`/admin/links/${id}/toggle`);
      fetchAdminOverview();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Admin Trust & Security Center
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Admin Shield Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform governance, phishing prevention, domain blacklists, and audit logs
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Registered Users</span>
          <p className="text-3xl font-extrabold text-white mt-2">{data?.metrics?.totalUsers ?? "—"}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Platform Links</span>
          <p className="text-3xl font-extrabold text-white mt-2">{data?.metrics?.totalLinks ?? "—"}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Click Stream</span>
          <p className="text-3xl font-extrabold text-white mt-2">{data?.metrics?.totalClicks ?? "—"}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Blocked Domains</span>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">{domains.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blocklist Manager */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="h-4 w-4 text-rose-400" />
            Security Domain Blocklist
          </h2>
          <p className="text-xs text-slate-400">
            Prevent malicious phishing or malware domains from being shortened or redirected platform-wide.
          </p>

          <form onSubmit={handleBlockDomain} className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="malicious-site.com"
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
              <input
                type="text"
                value={domainReason}
                onChange={(e) => setDomainReason(e.target.value)}
                placeholder="Reason (phishing, malware...)"
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-md shadow-rose-600/30 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Blocked Domain</span>
            </button>
          </form>

          <div className="space-y-2 mt-4 max-h-60 overflow-y-auto">
            {domains.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
              >
                <div>
                  <p className="font-semibold text-rose-300 font-mono">{d.domain}</p>
                  <p className="text-[11px] text-slate-500">{d.reason || "Manual restriction"}</p>
                </div>
                <button
                  onClick={() => handleUnblockDomain(d.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition"
                  title="Unblock domain"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-indigo-400" />
            Administrative Audit Trail
          </h2>
          <div className="space-y-2.5 max-h-80 overflow-y-auto text-xs">
            {data?.recentAuditLogs?.map((log: any) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {log.action}
                  </span>
                  <p className="text-xs text-slate-300 mt-1">{log.details}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">By {log.actor?.name || "System"}</p>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};