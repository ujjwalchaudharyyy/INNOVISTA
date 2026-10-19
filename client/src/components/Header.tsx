import React, { useState } from "react";
import { Search, Sun, Moon, Menu, X, Plus, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  onOpenCreate: () => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenCreate, 
  isDark, 
  setIsDark, 
  onOpenMobileMenu 
}) => {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-14 sm:h-16 border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-20 gap-2 shrink-0">

      {/* Left: Mobile Menu Toggle & Brand Logo */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Mobile menu hamburger toggle */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
          title="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* LinkPulse logo — visible only on mobile */}
        <div 
          onClick={onOpenMobileMenu}
          className="flex lg:hidden items-center gap-2 shrink-0 cursor-pointer"
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-black text-white tracking-tight">LinkPulse</span>
        </div>

        {/* Search Bar — Desktop full, mobile toggleable */}
        <div className={`relative transition-all duration-200 ${searchOpen ? "flex-1" : "hidden sm:flex flex-1 max-w-md ml-2"}`}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search links, aliases, destinations..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition"
          />
          {searchOpen && (
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 sm:hidden p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Search icon button on mobile to expand */}
        {!searchOpen && (
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Quick New Link button on mobile */}
        <button
          onClick={onOpenCreate}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30 active:scale-95 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80 transition cursor-pointer"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Live Engine badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">Live Engine</span>
        </div>

        {/* User Avatar */}
        <button
          onClick={logout}
          title={`Sign out ${user?.name || ""}`}
          className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0 active:scale-95 transition shadow-sm border border-white/10 cursor-pointer"
        >
          {user?.name?.slice(0, 2) || "LP"}
        </button>
      </div>
    </header>
  );
};