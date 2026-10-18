import React from "react";
import { Search, Bell, Sun, Moon, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  onOpenCreate: () => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreate, isDark, setIsDark }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0B0F19]/80 backdrop-blur-md px-6 flex items-center justify-between z-20">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search links, aliases, destinations (Press ⌘K)..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80 transition"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="h-4 w-[1px] bg-slate-800 mx-1" />

        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300">Live Engine</span>
        </div>
      </div>
    </header>
  );
};