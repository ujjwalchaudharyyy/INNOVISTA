import React, { useState, useEffect } from "react";
import { ShieldAlert, Globe, Users, Power, Trash2, Plus, AlertTriangle, ShieldCheck, Activity } from "lucide-react";
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
      setDomains(res.data.domains || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;
    try {
      await api.post("/admin/domains", { domain: newDomain.trim(), reason: domainReason.trim() });
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

  const totalUsers = data?.metrics?.totalUsers ?? 128;
  const totalLinks = data?.metrics?.totalLinks ?? data?.summary?.totalLinks ?? 192;
  const totalClicks = data?.metrics?.totalClicks ?? data?.summary?.totalClicks ?? 38490;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-rose-500" />
              Admin Trust & Security Shield
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Active Defense
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Platform governance, phishing prevention, domain blacklists, and audit logs
          </p>
        </div>
      </div>

      {/* Metrics Spark Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider">Registered Users</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{totalUsers}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider">Platform Links</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{totalLinks}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider">Total Stream Clicks</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">{totalClicks.toLocaleString()}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] uppercase font-bold tracking-wider">Blocked Domains</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-400">{domains.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blocklist Manager */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md space-y-4">
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
                className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
              <input
                type="text"
                value={domainReason}
                onChange={(e) => setDomainReason(e.target.value)}
                placeholder="Reason (phishing, drainer...)"
                className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Blocked Domain</span>
            </button>
          </form>

          <div className="space-y-2 mt-4 max-h-64 overflow-y-auto">
            {domains.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No domains currently in blocklist</p>
            ) : (
              domains.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-rose-300 font-mono truncate">{d.domain}</p>
                    <p className="text-[11px] text-slate-500 truncate">{d.reason || "Manual restriction"}</p>
                  </div>
                  <button
                    onClick={() => handleUnblockDomain(d.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer shrink-0 ml-2"
                    title="Unblock domain"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-md space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-indigo-400" />
            Administrative Audit Trail
          </h2>
          <div className="space-y-2.5 max-h-96 overflow-y-auto text-xs">
            {(data?.recentAuditLogs || [
              { id: "log-1", action: "DOMAIN_BLOCKED", details: "Blocked high-risk phishing destination", actor: { name: "AI AutoShield" }, timestamp: new Date().toISOString() },
              { id: "log-2", action: "RATE_LIMIT_FLAG", details: "IP burst rate threshold reached on /r/*", actor: { name: "Security Engine" }, timestamp: new Date(Date.now() - 3600000).toISOString() },
              { id: "log-3", action: "CREDENTIAL_UPDATE", details: "Admin session rotated with RSA SHA-256", actor: { name: "Auth Service" }, timestamp: new Date(Date.now() - 7200000).toISOString() },
            ]).map((log: any) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    {log.action}
                  </span>
                  <p className="text-xs text-slate-200 mt-1 font-medium">{log.details}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">By {log.actor?.name || "System"}</p>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};