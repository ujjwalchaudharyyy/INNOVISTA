import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { CreateLinkModal } from "./components/CreateLinkModal";
import { LoginPage } from "./pages/LoginPage";
import { OverviewPage } from "./pages/OverviewPage";
import { LinksPage } from "./pages/LinksPage";
import { CampaignsPage } from "./pages/CampaignsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { QrStudioPage } from "./pages/QrStudioPage";
import { BulkImportPage } from "./pages/BulkImportPage";
import { AdminShieldPage } from "./pages/AdminShieldPage";
import {
  LayoutDashboard,
  Link2,
  FolderKanban,
  BarChart3,
  QrCode,
  UploadCloud,
  ShieldAlert,
  Plus,
  Menu,
  X,
  LogOut,
  Sparkles,
  ChevronRight
} from "lucide-react";

export const App: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-300">Starting LinkPulse Engine...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleLinkCreated = () => setRefreshKey((prev) => prev + 1);

  const allNavTabs = [
    { id: "overview",   label: "Dashboard",       icon: LayoutDashboard, desc: "Real-time telemetry & metrics" },
    { id: "links",      label: "My Links",        icon: Link2,           desc: "Route management & click counters" },
    { id: "campaigns",  label: "Campaigns",       icon: FolderKanban,    desc: "Multi-channel funnel attribution" },
    { id: "analytics",  label: "Analytics",       icon: BarChart3,       desc: "Geo, browser & referrer insights" },
    { id: "qr",         label: "QR Studio",       icon: QrCode,          desc: "Vector code generator & styling" },
    { id: "bulk",       label: "Bulk CSV Import", icon: UploadCloud,     desc: "Batch link generation & export" },
  ];

  if (user?.role === "ADMIN") {
    allNavTabs.push({
      id: "admin",
      label: "Admin Shield",
      icon: ShieldAlert,
      desc: "Malware domain blocklist & fraud controls"
    });
  }

  const handleTabSelect = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen flex bg-[#0B0F19] text-slate-100 ${isDark ? "dark" : "light"}`}>

      {/* ── Desktop Sidebar (hidden on mobile, visible lg+) ── */}
      <div className="hidden lg:flex">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onOpenCreate={() => setCreateModalOpen(true)}
        />
      </div>

      {/* ── Main Viewport ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          onOpenCreate={() => setCreateModalOpen(true)}
          isDark={isDark}
          setIsDark={setIsDark}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Page Content: pb-28 on mobile ensures nothing is cut off by bottom bar */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === "overview"   && <OverviewPage key={refreshKey} onOpenCreate={() => setCreateModalOpen(true)} />}
            {currentTab === "links"      && <LinksPage key={refreshKey} onOpenCreate={() => setCreateModalOpen(true)} />}
            {currentTab === "campaigns"  && <CampaignsPage key={refreshKey} />}
            {currentTab === "analytics"  && <AnalyticsPage key={refreshKey} />}
            {currentTab === "qr"         && <QrStudioPage key={refreshKey} />}
            {currentTab === "bulk"       && <BulkImportPage key={refreshKey} />}
            {currentTab === "admin"      && <AdminShieldPage key={refreshKey} />}
          </div>
        </main>
      </div>

      {/* ── Mobile Slide-Over Drawer Navigation ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" 
          />

          {/* Drawer content panel */}
          <div className="relative w-4/5 max-w-sm h-full bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between p-5 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white flex items-center gap-1.5">
                      LinkPulse
                      <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30">
                        PRO
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400">Enterprise Infrastructure</p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Create Short Link CTA */}
              <div className="py-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCreateModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Short Link</span>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1 overflow-y-auto max-h-[50vh]">
                {allNavTabs.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabSelect(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition text-left cursor-pointer ${
                        isActive
                          ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                        <div>
                          <p className="text-xs font-bold">{item.label}</p>
                          <p className="text-[10px] text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-600" />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom: User Card & Sign Out */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
                    {user?.name?.slice(0, 2) || "LP"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Navigation Bar (Fixed 5-Action Dock) ── */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2"
        style={{
          background: "rgba(11, 15, 25, 0.95)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(20px)",
          paddingTop: "6px",
          paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        }}
      >
        {/* Tab 1: Dashboard */}
        <button
          onClick={() => setCurrentTab("overview")}
          className="flex flex-col items-center gap-1 min-w-[54px] py-1 cursor-pointer transition active:scale-95"
        >
          <div className={`p-1.5 rounded-xl transition ${currentTab === "overview" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-400"}`}>
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className={`text-[10px] font-bold ${currentTab === "overview" ? "text-indigo-400" : "text-slate-500"}`}>
            Home
          </span>
        </button>

        {/* Tab 2: My Links */}
        <button
          onClick={() => setCurrentTab("links")}
          className="flex flex-col items-center gap-1 min-w-[54px] py-1 cursor-pointer transition active:scale-95"
        >
          <div className={`p-1.5 rounded-xl transition ${currentTab === "links" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-400"}`}>
            <Link2 className="h-4 w-4" />
          </div>
          <span className={`text-[10px] font-bold ${currentTab === "links" ? "text-indigo-400" : "text-slate-500"}`}>
            Links
          </span>
        </button>

        {/* Center: FAB Create Link */}
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex flex-col items-center gap-1 -mt-5 cursor-pointer transition active:scale-90"
        >
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/40 text-white border-2 border-[#0B0F19]">
            <Plus className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black text-cyan-400">
            Create
          </span>
        </button>

        {/* Tab 3: Analytics */}
        <button
          onClick={() => setCurrentTab("analytics")}
          className="flex flex-col items-center gap-1 min-w-[54px] py-1 cursor-pointer transition active:scale-95"
        >
          <div className={`p-1.5 rounded-xl transition ${currentTab === "analytics" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-400"}`}>
            <BarChart3 className="h-4 w-4" />
          </div>
          <span className={`text-[10px] font-bold ${currentTab === "analytics" ? "text-indigo-400" : "text-slate-500"}`}>
            Analytics
          </span>
        </button>

        {/* Tab 4: More / All Pages Menu */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 min-w-[54px] py-1 cursor-pointer transition active:scale-95"
        >
          <div className={`p-1.5 rounded-xl transition ${mobileMenuOpen ? "bg-indigo-500/20 text-indigo-400" : "text-slate-400"}`}>
            <Menu className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            Menu
          </span>
        </button>
      </nav>

      {/* Multi-step Create Short Link Modal */}
      <CreateLinkModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleLinkCreated}
      />
    </div>
  );
};

export default App;