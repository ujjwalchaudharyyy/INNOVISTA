import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, BarChart3, QrCode, Lock, Check, LogIn } from "lucide-react";
import { BrandLogo } from "../components/BrandLogo";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("demo@linkpulse.io");
  const [password, setPassword] = useState("Demo@123456");
  const [name, setName] = useState("Sarah Chen");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
      const payload = authMode === "login" ? { email, password } : { email, password, name };
      const res = await api.post(endpoint, payload);
      login(res.data.token, res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminQuickFill = () => {
    setEmail("admin@linkpulse.io");
    setPassword("Admin@123456");
    setAuthMode("login");
  };

  const handleUserQuickFill = () => {
    setEmail("demo@linkpulse.io");
    setPassword("Demo@123456");
    setAuthMode("login");
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#0B1026] flex flex-col justify-between selection:bg-[#00A8E8]/20 selection:text-[#0B1026]">
      {/* Header */}
      <header className="h-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 lg:px-16 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <BrandLogo size="md" badgeText="PRO" />

        <div className="flex items-center gap-3">
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1026] hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/10 transition"
          >
            <LogIn className="h-3.5 w-3.5 text-[#00A8E8]" />
            <span>Sign In / Register</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-16 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[#00A8E8] text-xs font-bold shadow-xs">
            <Zap className="h-3.5 w-3.5 text-[#00A8E8]" />
            <span>Tech4All Round 2 High-Speed Redirect Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0B1026] leading-tight">
            Shorten, Secure & Track <br />
            <span className="text-[#00A8E8]">Every Single Visit</span>
          </h1>

          <p className="text-base text-slate-600 max-w-xl leading-relaxed">
            LinkPulse delivers sub-50ms atomic link redirects, password barriers, dynamic QR code studio, campaign attribution, and domain safety blocklists.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
              <Check className="h-4 w-4 text-[#1FC8A4] shrink-0" />
              <span>Sub-50ms Hot Path</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
              <Check className="h-4 w-4 text-[#1FC8A4] shrink-0" />
              <span>Password Gates</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
              <Check className="h-4 w-4 text-[#1FC8A4] shrink-0" />
              <span>Vector QR Studio</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
              <Check className="h-4 w-4 text-[#1FC8A4] shrink-0" />
              <span>Privacy IP Hashes</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
              <Check className="h-4 w-4 text-[#1FC8A4] shrink-0" />
              <span>Bulk CSV Validator</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
              <Check className="h-4 w-4 text-[#1FC8A4] shrink-0" />
              <span>Admin Shield Blocklist</span>
            </div>
          </div>
        </div>

        {/* Quick Auth Box */}
        <div className="lg:col-span-5">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 text-[#0B1026] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00A8E8] via-[#7B61FF] to-[#1FC8A4]" />

            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-[#0B1026]">
                  {authMode === "login" ? "Fast Console Sign In" : "Register Account"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in to view link metrics and campaigns
                </p>
              </div>
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    authMode === "login" ? "bg-white text-[#0B1026] shadow-sm" : "text-slate-500"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    authMode === "register" ? "bg-white text-[#0B1026] shadow-sm" : "text-slate-500"
                  }`}
                >
                  Join
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-5">
              {authMode === "register" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Chen"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0B1026] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00A8E8]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@linkpulse.io"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0B1026] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00A8E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0B1026] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#00A8E8]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0B1026] hover:bg-slate-800 text-white font-bold text-xs shadow-lg shadow-slate-900/10 transition disabled:opacity-50"
              >
                <span>{loading ? "Authenticating..." : authMode === "login" ? "Sign In & Launch" : "Create Account"}</span>
                <ArrowRight className="h-4 w-4 text-[#00A8E8]" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Quick Demo Fill:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUserQuickFill}
                  className="text-[#00A8E8] hover:underline font-bold"
                >
                  user
                </button>
                <span>/</span>
                <button
                  type="button"
                  onClick={handleAdminQuickFill}
                  className="text-[#7B61FF] hover:underline font-bold"
                >
                  admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6 px-6 lg:px-16 text-center text-xs text-slate-500">
        © 2026 LinkPulse Inc. Built for university hackathon demonstration.
      </footer>
    </div>
  );
};