import React from "react";
import { BrandLogo } from "./BrandLogo";
import { 
  LayoutDashboard, 
  Link2, 
  FolderKanban, 
  BarChart3, 
  QrCode, 
  UploadCloud, 
  ShieldAlert, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Layers,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  onOpenCreate: () => void;
  isDark?: boolean;
  setIsDark?: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  onOpenCreate,
  isDark = true,
  setIsDark,
}) => {
  const { user, logout } = useAuth();

  const navSections = [
    {
      title: "Core Engine",
      items: [
        { id: "overview", label: "Dashboard", icon: LayoutDashboard, badge: "Live", badgeColor: "emerald" },
        { id: "links", label: "My Links", icon: Link2, badge: "Active", badgeColor: "indigo" },
        { id: "campaigns", label: "Campaigns", icon: FolderKanban },
      ],
    },
    {
      title: "Intelligence & Tools",
      items: [
        { id: "analytics", label: "Analytics", icon: BarChart3, badge: "Realtime", badgeColor: "cyan" },
        { id: "qr", label: "QR Studio", icon: QrCode, badge: "Vector", badgeColor: "purple" },
        { id: "bulk", label: "Bulk CSV", icon: UploadCloud },
      ],
    },
  ];

  if (user?.role === "ADMIN") {
    navSections.push({
      title: "Governance",
      items: [
        { id: "admin", label: "Admin Shield", icon: ShieldAlert, badge: "Shield", badgeColor: "rose" },
      ],
    });
  }

  return (
    <aside
      className={`relative flex flex-col justify-between border-r border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl transition-all duration-300 z-30 select-none shadow-xl lg:shadow-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
          <div
            className="flex items-center gap-3 overflow-hidden cursor-pointer"
            onClick={() => setCurrentTab("overview")}
            title="LinkPulse Enterprise Dashboard"
          >
            <BrandLogo
              size="md"
              showText={!collapsed}
              subtext="Edge Cloud v2.4"
              badgeText="PRO"
            />
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Action Button: + New Short Link */}
        <div className="p-3 shrink-0">
          <button
            onClick={onOpenCreate}
            className={`w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold py-2.5 transition shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
              collapsed ? "px-0" : "px-4"
            }`}
            title="Create Short Link (⌘K)"
          >
            <span className="text-base font-bold leading-none">+</span>
            {!collapsed && (
              <span className="text-xs font-bold tracking-wide flex items-center gap-2">
                <span>New Short Link</span>
                <kbd className="hidden sm:inline-block text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded text-white/90">
                  ⌘K
                </kbd>
              </span>
            )}
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4 pt-1">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600 dark:border-indigo-500 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    } ${collapsed ? "justify-center px-0" : "justify-between"}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                        }`}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          item.badgeColor === "emerald"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : item.badgeColor === "cyan"
                            ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                            : item.badgeColor === "purple"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                            : item.badgeColor === "rose"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Live Quota Widget (when expanded) */}
        {!collapsed && (
          <div className="px-3 py-2 shrink-0">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-slate-100/80 to-cyan-500/5 dark:from-indigo-950/30 dark:via-slate-900/40 dark:to-cyan-950/30 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  Edge Routing
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  48% Used
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: "48%" }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>4,820 / 10,000 req</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  38ms Edge
                </span>
              </div>
            </div>
          </div>
        )}

        {/* User Card & Settings Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 shrink-0">
          <div
            className={`flex items-center gap-2.5 p-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0 uppercase shadow-sm">
                  {user?.name?.slice(0, 2) || "LP"}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0F172A]" />
              </div>

              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || "user@linkpulse.io"}
                  </p>
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="flex items-center gap-1 shrink-0">
                {setIsDark && (
                  <button
                    onClick={() => setIsDark(!isDark)}
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    {isDark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-indigo-500" />}
                  </button>
                )}
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};