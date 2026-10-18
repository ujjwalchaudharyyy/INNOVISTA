import React from "react";
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
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  onOpenCreate: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  onOpenCreate,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "links", label: "My Links", icon: Link2 },
    { id: "campaigns", label: "Campaigns", icon: FolderKanban },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "qr", label: "QR Studio", icon: QrCode },
    { id: "bulk", label: "Bulk CSV", icon: UploadCloud },
  ];

  if (user?.role === "ADMIN") {
    navItems.push({ id: "admin", label: "Admin Shield", icon: ShieldAlert });
  }

  return (
    <aside
      className={`relative flex flex-col justify-between border-r border-slate-800 bg-[#0F172A]/90 backdrop-blur-md transition-all duration-300 z-30 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div>
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setCurrentTab("overview")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  LinkPulse
                  <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30">
                    PRO
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Link Infrastructure</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={onOpenCreate}
            className={`w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 transition shadow-lg shadow-indigo-600/25 ${
              collapsed ? "px-0" : "px-4"
            }`}
            title="Create Short Link"
          >
            <span className="text-lg font-bold leading-none">+</span>
            {!collapsed && <span className="text-sm font-semibold tracking-wide">New Short Link</span>}
          </button>
        </div>

        <nav className="space-y-1 px-3 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800/80">
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800 ${collapsed ? "justify-center" : ""}`}>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0 uppercase">
            {user?.name?.slice(0, 2) || "LP"}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              title="Sign Out"
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};