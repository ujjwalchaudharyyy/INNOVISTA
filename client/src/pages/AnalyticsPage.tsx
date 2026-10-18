import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { BarChart3, Globe, Compass, Monitor, Sparkles, Filter } from "lucide-react";
import { api } from "../services/api";

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [range, setRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/analytics/overview?range=${range}`).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [range]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Traffic Intelligence & Click Stream
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deep dive into visitor geography, referring origins, and client hardware
          </p>
        </div>
        <div className="flex gap-2">
          {["7d", "30d", "90d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                range === r
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Referrers */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="h-4 w-4 text-indigo-400" />
              Traffic Sources & Referrers
            </h2>
            <span className="text-[11px] text-slate-500">Domain Origins</span>
          </div>

          <div className="space-y-3">
            {data?.topReferrers?.map((ref: any) => (
              <div key={ref.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{ref.name}</span>
                  <span className="font-mono text-indigo-400">{ref.count} visits</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    style={{
                      width: `${Math.min(100, (ref.count / (data.summary.totalClicks || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              Client Browsers
            </h2>
            <span className="text-[11px] text-slate-500">User Agents</span>
          </div>

          <div className="space-y-3">
            {data?.browserBreakdown?.map((b: any) => (
              <div key={b.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{b.name}</span>
                  <span className="font-mono text-cyan-400">{b.count} visits</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (b.count / (data.summary.totalClicks || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};