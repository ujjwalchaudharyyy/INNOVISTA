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

export const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center text-slate-500 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#00A8E8] border-t-transparent animate-spin" />
          <span className="font-semibold text-[#0B1026]">Starting LinkPulse Engine...</span>
        </div>
      </div>
    );
  }

  // DIRECT LOGIN PAGE AS THE FIRST & DEFAULT SCREEN
  if (!user) {
    return <LoginPage />;
  }

  const handleLinkCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className={`min-h-screen flex bg-[#0B0F19] text-slate-100 ${isDark ? "dark" : "light"}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onOpenCreate={() => setCreateModalOpen(true)}
      />

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          onOpenCreate={() => setCreateModalOpen(true)}
          isDark={isDark}
          setIsDark={setIsDark}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === "overview" && (
              <OverviewPage key={refreshKey} onOpenCreate={() => setCreateModalOpen(true)} />
            )}
            {currentTab === "links" && (
              <LinksPage key={refreshKey} onOpenCreate={() => setCreateModalOpen(true)} />
            )}
            {currentTab === "campaigns" && <CampaignsPage key={refreshKey} />}
            {currentTab === "analytics" && <AnalyticsPage key={refreshKey} />}
            {currentTab === "qr" && <QrStudioPage key={refreshKey} />}
            {currentTab === "bulk" && <BulkImportPage key={refreshKey} />}
            {currentTab === "admin" && <AdminShieldPage key={refreshKey} />}
          </div>
        </main>
      </div>

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