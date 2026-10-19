import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, Lock, Mail, User, AlertCircle, Zap, Shield, Activity, Eye, EyeOff, Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { sounds } from "../services/sounds";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("demo@linkpulse.io");
  const [password, setPassword] = useState("Demo@123456");
  const [name, setName] = useState("Sarah Chen");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMutedRef = useRef(false);

  // Background Audio loop with seamless last-3-seconds trim
  useEffect(() => {
    const tryStartAudio = () => {
      if (isMutedRef.current || !audioRef.current) return;
      audioRef.current.volume = 0.35;
      audioRef.current.play().then(() => {
        setIsAudioMuted(false);
      }).catch(() => {
        // Autoplay requires user interaction in modern browsers
        const unlock = () => {
          if (!isMutedRef.current && audioRef.current) {
            audioRef.current.volume = 0.35;
            audioRef.current.play().catch(() => {});
            setIsAudioMuted(false);
          }
          window.removeEventListener("click", unlock);
          window.removeEventListener("keydown", unlock);
          window.removeEventListener("touchstart", unlock);
        };
        window.addEventListener("click", unlock, { once: true });
        window.addEventListener("keydown", unlock, { once: true });
        window.addEventListener("touchstart", unlock, { once: true });
      });
    };

    tryStartAudio();

    // Loop interval trimming last 3 seconds for seamless continuous beat
    const checkAudioLoop = () => {
      if (isMutedRef.current) return;
      if (audioRef.current && !audioRef.current.paused) {
        const d = audioRef.current.duration;
        const c = audioRef.current.currentTime;
        if (d && d > 4 && c >= d - 3) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      }
    };
    const loopInterval = setInterval(checkAudioLoop, 50);

    return () => {
      clearInterval(loopInterval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!audioRef.current) return;

    if (isAudioMuted || audioRef.current.paused) {
      isMutedRef.current = false;
      setIsAudioMuted(false);
      audioRef.current.volume = 0.35;
      audioRef.current.play().catch(() => {});
    } else {
      isMutedRef.current = true;
      setIsAudioMuted(true);
      audioRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      if (duration && duration > 4 && currentTime >= duration - 3) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? { email, password, name } : { email, password };
      const res = await api.post(endpoint, payload);
      sounds.playSuccess();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      login(res.data.token, res.data.user);
    } catch (err: any) {
      console.error("Login attempt error:", err);
      sounds.playError();
      const serverError = err.response?.data?.error;
      const errorMsg = serverError || (err.message === "Network Error" ? "Backend server unreachable. Make sure backend is running on port 5000." : err.message || "Invalid email or password");
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (userEmail: string, userPass: string) => {
    sounds.playClick();
    setEmail(userEmail);
    setPassword(userPass);
    setIsRegister(false);
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden select-none bg-black font-sans">
      
      {/* Background Loop Audio */}
      <audio
        ref={audioRef}
        src="/bg-music.mp3"
        autoPlay
        preload="auto"
      />

      {/* 4K ULTRA-HD BACKGROUND VIDEO */}
      <video
        ref={videoRef}
        src="/login-bg.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none scale-[1.02]"
        style={{
          filter: "contrast(1.08) brightness(0.98) saturate(1.1)",
        }}
      />

      {/* REFINED CINEMATIC VIGNETTE OVERLAY */}
      <div 
        className="fixed inset-0 z-10 pointer-events-none bg-radial-[at_center_center] from-black/20 via-black/60 to-black/90"
      />

      {/* MINIMALIST SOUND TOGGLE (Top Right) */}
      <button
        onClick={toggleSound}
        className="fixed top-5 right-5 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 hover:bg-slate-900/80 backdrop-blur-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition text-xs font-semibold cursor-pointer shadow-lg active:scale-95"
        title="Toggle Ambient Audio"
      >
        {isAudioMuted ? (
          <>
            <VolumeX className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-400">Muted</span>
          </>
        ) : (
          <>
            <Volume2 className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[11px] text-cyan-300">Live Beat</span>
          </>
        )}
      </button>

      {/* MAIN AUTHENTICATION CONTAINER */}
      <div className="relative z-20 w-full max-w-md mx-auto my-auto animate-in fade-in zoom-in-95 duration-500">
        
        {/* Brand Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-cyan-300 text-xs font-semibold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>LinkPulse Edge v2.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            Link<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Pulse</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Next-Gen URL Shortener, Edge Redirects & Analytics
          </p>
        </div>

        {/* Sleek Frosted Glass Card */}
        <div className="w-full rounded-3xl bg-slate-950/65 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 text-white shadow-2xl shadow-black/90 relative overflow-hidden">
          
          {/* Subtle Top Glowing Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

          {/* Segmented Tab Switcher */}
          <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsRegister(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isRegister
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setIsRegister(true);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isRegister
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Chen"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition shadow-inner"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@linkpulse.io"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-cyan-500 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/25 transition active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : !isRegister ? "Sign In to Workspace" : "Create Account"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              <span>Quick Demo Access</span>
              <span className="text-cyan-400 font-normal">1-Click Auto Fill</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("demo@linkpulse.io", "Demo@123456")}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-left transition cursor-pointer active:scale-95 group"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 uppercase">
                  <User className="h-3 w-3" />
                  <span>Standard User</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">demo@linkpulse.io</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("admin@linkpulse.io", "Admin@123456")}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/40 text-left transition cursor-pointer active:scale-95 group"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 uppercase">
                  <Shield className="h-3 w-3" />
                  <span>Admin Shield</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate mt-0.5">admin@linkpulse.io</div>
              </button>
            </div>
          </div>

        </div>

        {/* Minimalist Trust Features Footer */}
        <div className="mt-5 flex items-center justify-center gap-6 text-[11px] text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>&lt;50ms Edge SLA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>SHA-256 IP Hash</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-indigo-400" />
            <span>Telemetry Ready</span>
          </div>
        </div>

      </div>
    </div>
  );
};