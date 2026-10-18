import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  Link2, 
  Activity, 
  ArrowUpRight, 
  QrCode, 
  ShieldAlert, 
  ExternalLink,
  Copy,
  Check,
  Calendar
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { api, API_BASE } from "../services/api";

export const OverviewPage: React.FC<{ onOpenCreate: () => void }> = ({ onOpenCreate }) => {
  const [data, setData] = useState<any | null>(null);
  const [range, setRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOverview();
  }, [range]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/analytics/overview?range=${range}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (code: string, id: string) => {
    navigator.clipboard.writeText(`${API_BASE}/r/${code}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const COLORS = ["#6366F1", "#06B6D4", "#EC4899", "#10B981", "#F59E0B"];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Platform Telemetry
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Real-Time
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real aggregated click activity, unique visitors, devices, and traffic origins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["7d", "30d", "90d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                range === r
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              Last {r.toUpperCase()}
            </button>
          ))}
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
          >
            <span>+ Shorten</span>
          </button>
        </div>
      </div>

      {/* KPI Spark Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Clicks</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{data?.summary?.totalClicks ?? "—"}</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-2">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>High precision redirect counter</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unique Visitors</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{data?.summary?.uniqueVisitors ?? "—"}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <span>Privacy-preserving daily IP hash</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Links</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Link2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{data?.summary?.activeLinks ?? "—"}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <span>Out of {data?.summary?.totalLinks ?? 0} total created</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">QR Code Scans</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <QrCode className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{data?.summary?.qrClicks ?? "—"}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <span>Verified mobile camera scans</span>
          </div>
        </div>
      </div>

      {/* Main Timeseries Chart */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Clicks & Traffic Dynamics</h2>
            <p className="text-xs text-slate-400">Total visits vs unique visitor volume</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              <span className="text-slate-300">Total Visits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Unique Visitors</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          {data?.timeseries && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeseries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorUniques" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B0F19",
                    borderColor: "#1E293B",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
                <Area type="monotone" dataKey="uniqueVisitors" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorUniques)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Grid: Device Breakdown & Top Performing Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device breakdown */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Device Breakdown</h2>
            <p className="text-xs text-slate-400 mb-4">Traffic category by client environment</p>
            <div className="h-48 w-full flex items-center justify-center">
              {data?.deviceBreakdown && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.deviceBreakdown}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={5}
                    >
                      {data.deviceBreakdown.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B0F19",
                        borderColor: "#1E293B",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-3 border-t border-slate-800/80">
            {data?.deviceBreakdown?.map((item: any, idx: number) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-100">{item.count} clicks</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top links */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Top Performing Links</h2>
              <p className="text-xs text-slate-400">High engagement destinations</p>
            </div>
          </div>

          <div className="space-y-3">
            {data?.topLinks?.map((link: any, index: number) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs shrink-0">
                    #{index + 1}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-200 truncate">{link.title}</p>
                    <span className="text-[11px] font-mono text-indigo-400">
                      linkpulse.io/r/{link.shortCode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-white px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700">
                    {link.clicks} clicks
                  </span>
                  <button
                    onClick={() => copyLink(link.shortCode, link.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
                    title="Copy Link"
                  >
                    {copiedId === link.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <a
                    href={`${API_BASE}/r/${link.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
                    title="Open Short Link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};