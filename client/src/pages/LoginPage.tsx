import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, Lock, Mail, User, AlertCircle, Zap, Shield, Activity, Eye, EyeOff, Volume2, VolumeX, Globe } from "lucide-react";
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

  // Background Audio — auto-start on first user interaction (browser policy)
  useEffect(() => {
    let started = false;

    const startAudio = () => {
      if (started || isMutedRef.current || !audioRef.current) return;
      audioRef.current.volume = 0.35;
      audioRef.current.play().then(() => {
        started = true;
        setIsAudioMuted(false);
        // Remove all listeners once audio starts
        cleanup();
      }).catch(() => {});
    };

    // Try autoplay immediately (works if user already interacted with page)
    startAudio();

    // Listen to ALL possible user interactions to unlock audio
    const events = ["click", "touchstart", "keydown", "mousedown", "scroll", "pointerdown"];
    events.forEach(e => window.addEventListener(e, startAudio, { passive: true }));

    const cleanup = () => {
      events.forEach(e => window.removeEventListener(e, startAudio));
    };

    // Seamless loop: jump back before track ends
    const loopInterval = setInterval(() => {
      if (isMutedRef.current || !audioRef.current || audioRef.current.paused) return;
      const d = audioRef.current.duration;
      const c = audioRef.current.currentTime;
      if (d && d > 4 && c >= d - 3) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }, 50);

    return () => {
      cleanup();
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-y-auto overflow-x-hidden select-none bg-black font-sans">
      
      {/* Background Loop Audio */}
      <audio
        ref={audioRef}
        src="/bg-music.mp3"
        autoPlay
        preload="auto"
      />

      {/* SVG Sharpen Filter — unsharp mask to maximize perceived clarity */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="lp-sharpen" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feConvolveMatrix
              order="3"
              kernelMatrix="0 -0.4 0  -0.4 2.6 -0.4  0 -0.4 0"
              divisor="1"
              preserveAlpha="true"
            />
          </filter>
        </defs>
      </svg>

      {/* BACKGROUND VIDEO — GPU rendered + SVG unsharp mask sharpening */}
      <video
        ref={videoRef}
        src="/login-bg.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          filter: "url(#lp-sharpen) contrast(1.06) saturate(1.08)",
        }}
      />

      {/* HORIZONTAL VIGNETTE OVERLAY */}
      <div 
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.45) 20%, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0) 65%, rgba(0, 0, 0, 0.45) 80%, rgba(0, 0, 0, 0.85) 100%)",
        }}
      />

      {/* 3D STAR FIELD — edges only, Earth center 100% clear */}
      <canvas
        ref={(canvas) => {
          if (!canvas || (canvas as any).__stars_init) return;
          (canvas as any).__stars_init = true;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          };
          resize();
          window.addEventListener("resize", resize);

          // Color palette for realistic stars
          const starColors = [
            [255, 255, 255],   // pure white
            [200, 220, 255],   // cool blue
            [255, 240, 220],   // warm yellow
            [180, 200, 255],   // icy blue
            [255, 210, 180],   // soft orange
          ];

          // Generate stars — ONLY in edge zones, never near center
          interface Star {
            x: number; y: number; z: number; size: number;
            speed: number; offset: number; color: number[];
            driftX: number; driftY: number;
          }
          const stars: Star[] = [];
          for (let i = 0; i < 120; i++) {
            let x: number, y: number;
            // Keep generating until star is far from center
            do {
              x = Math.random() * 2 - 1;
              y = Math.random() * 2 - 1;
            } while (Math.sqrt(x * x + y * y) < 0.55); // 55% exclusion = Earth fully clear

            stars.push({
              x, y,
              z: Math.random(),
              size: Math.random() * 1.4 + 0.2,
              speed: Math.random() * 0.008 + 0.002,
              offset: Math.random() * Math.PI * 2,
              color: starColors[Math.floor(Math.random() * starColors.length)],
              driftX: (Math.random() - 0.5) * 0.00008,
              driftY: (Math.random() - 0.5) * 0.00008,
            });
          }

          let t = 0;
          const render = () => {
            t++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            for (const star of stars) {
              // Gentle drift
              star.x += star.driftX;
              star.y += star.driftY;
              // Wrap around edges
              if (star.x > 1.1) star.x = -1.1;
              if (star.x < -1.1) star.x = 1.1;
              if (star.y > 1.1) star.y = -1.1;
              if (star.y < -1.1) star.y = 1.1;

              const sx = cx + star.x * cx;
              const sy = cy + star.y * cy;

              // Double-check: skip if somehow drifted into center
              const dist = Math.sqrt((sx - cx) ** 2 + (sy - cy) ** 2);
              if (dist < Math.min(cx, cy) * 0.5) continue;

              const depth = 0.3 + star.z * 0.7;
              const sz = star.size * depth;
              // Smooth sine twinkle
              const twinkle = 0.5 + 0.5 * Math.sin(t * star.speed + star.offset);
              const alpha = twinkle * depth * 0.7;
              const [r, g, b] = star.color;

              // Star core
              ctx.beginPath();
              ctx.arc(sx, sy, sz, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
              ctx.fill();

              // Soft glow halo for brighter stars
              if (sz > 0.8) {
                const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sz * 4);
                grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.2})`);
                grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
                ctx.beginPath();
                ctx.arc(sx, sy, sz * 4, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
              }
            }
            requestAnimationFrame(render);
          };
          render();
        }}
        className="fixed inset-0 z-[5] pointer-events-none"
      />

      {/* TOP RIGHT CONTROLS: AUDIO ONLY */}
      <div className="fixed top-5 right-5 z-30">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 hover:bg-slate-900/90 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-white transition text-xs font-semibold cursor-pointer shadow-lg active:scale-95"
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
      </div>

      {/* MAIN VIEWPORT SPLIT LAYOUT (Earth centered in between) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-14 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-10 py-12">
        
        {/* ── LEFT SIDE OF EARTH: Bold, Stylish Modern Branding ── */}
        <div className="w-full lg:max-w-lg space-y-6 text-left animate-in fade-in slide-in-from-left-6 duration-700">
          
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/15 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wider text-cyan-300 uppercase">
              Autonomous Edge Engine v2.0
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] drop-shadow-2xl">
              Link<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Pulse</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-200">
              Instant Global Redirection & Deep Edge Intelligence.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-md">
            Ultra-fast atomic routing across 32 distributed edge clusters with zero-cookie SHA-256 IP telemetry, dynamic vector QR codes, and AI fraud protection.
          </p>

          {/* 3 Sleek Feature Pills */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-200 hover:border-cyan-400/40 hover:bg-white/10 transition">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>&lt;50ms Hot-Path</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-200 hover:border-emerald-400/40 hover:bg-white/10 transition">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>SHA-256 IP Hash</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-200 hover:border-indigo-400/40 hover:bg-white/10 transition">
              <Activity className="h-3.5 w-3.5 text-indigo-400" />
              <span>Zero-Log Telemetry</span>
            </div>
          </div>

          {/* Live Telemetry Ping Status */}
          <div className="pt-2 flex items-center gap-3 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>32 PoPs Active</span>
            </div>
            <span>•</span>
            <span>99.99% Edge SLA</span>
            <span>•</span>
            <span className="font-mono text-cyan-400">38ms Global</span>
          </div>

        </div>

        {/* ── RIGHT SIDE OF EARTH: Compact, Interactive Glowing Login Card ── */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-6 duration-700">
          
          <div className="w-full max-w-[400px] rounded-3xl bg-slate-950/65 hover:bg-slate-950/85 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/50 p-7 sm:p-8 text-white shadow-2xl shadow-black/90 hover:shadow-[0_0_50px_-5px_rgba(6,182,212,0.35)] transition-all duration-300 group relative overflow-hidden">
            
            {/* Top Interactive Cyan Accent Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Segmented Tab Switcher */}
            <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 mb-6 group-hover:border-white/20 transition">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsRegister(false);
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isRegister
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25"
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
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span className="text-xs leading-tight">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah Chen"
                      className="w-full bg-white/[0.04] hover:bg-white/[0.08] focus:bg-white/[0.12] border border-white/10 hover:border-white/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition shadow-inner"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="demo@linkpulse.io"
                    className="w-full bg-white/[0.04] hover:bg-white/[0.08] focus:bg-white/[0.12] border border-white/10 hover:border-white/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] hover:bg-white/[0.08] focus:bg-white/[0.12] border border-white/10 hover:border-white/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-cyan-500 hover:from-cyan-400 hover:to-indigo-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-cyan-500/25 transition active:scale-[0.98] disabled:opacity-50 mt-1 cursor-pointer"
              >
                <span>{loading ? "Authenticating..." : !isRegister ? "Sign In to Workspace" : "Create Account"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Quick 1-Click Demo Logins */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Quick Demo Access</span>
                <span className="text-cyan-400 font-normal">1-Click Auto Fill</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials("demo@linkpulse.io", "Demo@123456")}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-cyan-400/50 text-left transition cursor-pointer active:scale-95 group/btn"
                >
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-cyan-400 uppercase">
                    <User className="h-3 w-3" />
                    <span>User</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-200 truncate mt-0.5">demo@linkpulse.io</div>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("admin@linkpulse.io", "Admin@123456")}
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-indigo-400/50 text-left transition cursor-pointer active:scale-95 group/btn"
                >
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-400 uppercase">
                    <Shield className="h-3 w-3" />
                    <span>Admin</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-200 truncate mt-0.5">admin@linkpulse.io</div>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};