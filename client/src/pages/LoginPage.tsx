import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  AlertCircle, 
  Zap, 
  Shield, 
  Activity, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Globe, 
  CheckCircle2, 
  Server, 
  Cpu, 
  Radio, 
  Key, 
  Check, 
  Info, 
  ChevronRight,
  Terminal
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { sounds } from "../services/sounds";
import { BrandLogo } from "../components/BrandLogo";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("demo@linkpulse.io");
  const [password, setPassword] = useState("Demo@123456");
  const [name, setName] = useState("Sarah Chen");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  // Simulated live edge telemetry node hop
  const [activeHopIndex, setActiveHopIndex] = useState(0);
  const edgeHops = [
    { code: "SFO-1", city: "San Francisco", latency: "14ms" },
    { code: "LHR-4", city: "London Edge", latency: "34ms" },
    { code: "NRT-2", city: "Tokyo Cluster", latency: "41ms" },
    { code: "SIN-1", city: "Singapore Hub", latency: "28ms" },
  ];

  // DOM element refs for non-re-rendering high-performance updates
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const isMutedRef = useRef(false);

  // High performance direct spotlight update (0 React re-renders)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(650px circle at ${e.clientX}px ${e.clientY}px, rgba(6, 182, 212, 0.12), transparent 70%)`;
    }
  }, []);

  // 1. ROCK-SOLID EARTH VIDEO PLAYBACK (No freeze on remount, no disappear on logout)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const playVideo = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // If browser policy blocks auto-playback, unlock on first interaction
          const unlock = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
            window.removeEventListener("click", unlock);
            window.removeEventListener("touchstart", unlock);
            window.removeEventListener("keydown", unlock);
          };
          window.addEventListener("click", unlock, { once: true, passive: true });
          window.addEventListener("touchstart", unlock, { once: true, passive: true });
          window.addEventListener("keydown", unlock, { once: true, passive: true });
        });
      }
    };

    playVideo();

    return () => {
      // Free hardware decoder when unmounting
      if (video) {
        video.pause();
      }
    };
  }, []);

  // 2. STARFIELD ANIMATION ENGINE WITH CLEAN LIFECYCLE (Zero CPU leaks, stops cleanly on login)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isCancelled = false;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const starColors = [
      [255, 255, 255],
      [165, 243, 252],
      [224, 231, 255],
      [129, 140, 248],
      [254, 243, 199],
    ];

    interface Star {
      x: number; y: number; z: number; size: number;
      speed: number; offset: number; color: number[];
      driftX: number; driftY: number;
    }
    const stars: Star[] = [];
    for (let i = 0; i < 140; i++) {
      let x: number, y: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
      } while (Math.sqrt(x * x + y * y) < 0.52);

      stars.push({
        x, y,
        z: Math.random(),
        size: Math.random() * 1.5 + 0.2,
        speed: Math.random() * 0.008 + 0.002,
        offset: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        driftX: (Math.random() - 0.5) * 0.00008,
        driftY: (Math.random() - 0.5) * 0.00008,
      });
    }

    let t = 0;
    const render = () => {
      if (isCancelled) return;
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (const star of stars) {
        star.x += star.driftX;
        star.y += star.driftY;
        if (star.x > 1.1) star.x = -1.1;
        if (star.x < -1.1) star.x = 1.1;
        if (star.y > 1.1) star.y = -1.1;
        if (star.y < -1.1) star.y = 1.1;

        const sx = cx + star.x * cx;
        const sy = cy + star.y * cy;
        const dist = Math.sqrt((sx - cx) ** 2 + (sy - cy) ** 2);
        if (dist < Math.min(cx, cy) * 0.48) continue;

        const depth = 0.3 + star.z * 0.7;
        const sz = star.size * depth;
        const twinkle = 0.5 + 0.5 * Math.sin(t * star.speed + star.offset);
        const alpha = twinkle * depth * 0.75;
        const [r, g, b] = star.color;

        ctx.beginPath();
        ctx.arc(sx, sy, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        if (sz > 0.8) {
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sz * 4);
          grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.25})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(sx, sy, sz * 4, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // 3. BACKGROUND AUDIO LOOP WITH CLEAN LIFECYCLE
  useEffect(() => {
    let started = false;
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;

    const startAudio = () => {
      if (started || isMutedRef.current || !audioRef.current) return;
      audioRef.current.volume = 0.35;
      audioRef.current.play().then(() => {
        started = true;
        setIsAudioMuted(false);
        cleanup();
      }).catch(() => {});
    };

    startAudio();

    const events = ["click", "touchstart", "keydown", "mousedown", "scroll", "pointerdown"];
    events.forEach(e => window.addEventListener(e, startAudio, { passive: true }));

    const cleanup = () => {
      events.forEach(e => window.removeEventListener(e, startAudio));
    };

    return () => {
      cleanup();
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // 4. TELEMETRY HOP ROTATION
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHopIndex((prev) => (prev + 1) % edgeHops.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [edgeHops.length]);

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
    // Seamless hardware-accelerated video loop protection
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      if (duration && duration > 4 && currentTime >= duration - 0.25) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
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

  // Password strength calculation for registration mode
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "Too weak", color: "bg-slate-700" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500" };
    if (score <= 3) return { score: 2, label: "Good", color: "bg-amber-400" };
    return { score: 3, label: "Strong", color: "bg-emerald-400" };
  };

  const strength = getPasswordStrength();

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center overflow-y-auto overflow-x-hidden select-none bg-black font-sans"
    >
      
      {/* Background Loop Audio */}
      <audio
        ref={audioRef}
        src="/bg-music.mp3"
        autoPlay
        loop
        preload="auto"
      />

      {/* BACKGROUND VIDEO — Hardware accelerated Earth Loop (100% reliable on remount) */}
      <video
        ref={videoRef}
        src="/login-bg.mp4"
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          filter: "contrast(1.06) saturate(1.08) brightness(1.02)",
        }}
      />

      {/* HORIZONTAL VIGNETTE OVERLAY WITH DEEP CYBER GRADIENT */}
      <div 
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, rgba(2, 6, 23, 0.94) 0%, rgba(2, 6, 23, 0.6) 25%, rgba(0, 0, 0, 0.15) 50%, rgba(2, 6, 23, 0.6) 75%, rgba(2, 6, 23, 0.94) 100%)",
        }}
      />

      {/* DYNAMIC INTERACTIVE MOUSE SPOTLIGHT AURA (Updated via DOM ref, 0 React re-renders) */}
      <div
        ref={spotlightRef}
        className="fixed inset-0 pointer-events-none z-[6] transition-opacity duration-300 hidden md:block"
        style={{
          background: "radial-gradient(650px circle at 50% 50%, rgba(6, 182, 212, 0.08), transparent 70%)",
        }}
      />

      {/* 3D STAR FIELD CANVAS (Managed by clean useEffect, zero thread lock) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[5] pointer-events-none"
      />

      {/* TOP NAVIGATION / STATUS BAR — Mobile & Desktop optimized */}
      <div className="fixed top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 z-30 flex items-center justify-between pointer-events-none gap-2">
        
        {/* Live Cluster PoPs Pill */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-lg text-slate-300 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-slate-200">
            32 Edge PoPs <span className="hidden sm:inline">Online</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-mono hidden md:inline">
            • 38ms SLA
          </span>
        </div>

        {/* Audio Equalizer Deck in Top-Right */}
        <div className="pointer-events-auto shrink-0">
          <button
            onClick={toggleSound}
            className="group flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900/90 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-white transition text-xs font-semibold cursor-pointer shadow-lg active:scale-95"
            title="Toggle Ambient Audio Deck"
          >
            {isAudioMuted ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[10px] sm:text-[11px] text-slate-400">Muted</span>
              </>
            ) : (
              <>
                {/* 4 Animated Audio Frequency Bars */}
                <div className="flex items-end gap-[2px] h-3.5 w-3">
                  <span className="w-[2px] h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDuration: "500ms" }} />
                  <span className="w-[2px] h-3.5 bg-cyan-300 rounded-full animate-pulse" style={{ animationDuration: "350ms" }} />
                  <span className="w-[2px] h-1.5 bg-sky-400 rounded-full animate-pulse" style={{ animationDuration: "600ms" }} />
                  <span className="w-[2px] h-3 bg-indigo-400 rounded-full animate-pulse" style={{ animationDuration: "420ms" }} />
                </div>
                <span className="text-[10px] sm:text-[11px] text-cyan-300 font-medium">Ambient Beat</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* MAIN VIEWPORT SPLIT LAYOUT (Earth centered in between) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12 pt-20 pb-12 sm:py-16">
        
        {/* ── LEFT SIDE: Futuristic Command Deck & Brand Showcase ── */}
        <div className="w-full lg:max-w-xl space-y-4 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start animate-in fade-in slide-in-from-left-6 duration-700">
          
          {/* Brand Logo with Glowing Aura */}
          <div className="pt-2">
            <BrandLogo
              size="lg"
              badgeText="ENTERPRISE"
              subtext="Autonomous Edge Routing & Global Hot-Path v2.4"
              animated={true}
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15] drop-shadow-2xl">
              Sub-50ms Atomic Redirection.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 block sm:inline mt-1 sm:mt-0">
                Deep Edge Intelligence.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-lg">
              Next-generation short link management engineered for global performance with zero-cookie SHA-256 IP telemetry, vector QR codes, and AI fraud protection.
            </p>
          </div>

          {/* Interactive Live Telemetry Hop Card (Responsive 2x2 grid on mobile, 4 columns on sm+) */}
          <div className="w-full p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition shadow-xl">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Radio className="h-3.5 w-3.5 animate-pulse" />
                Live Edge Hop Telemetry
              </span>
              <span className="font-mono text-emerald-400 text-[10px]">In-Flight</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {edgeHops.map((hop, idx) => {
                const isActive = activeHopIndex === idx;
                return (
                  <div
                    key={hop.code}
                    className={`p-2 sm:p-2.5 rounded-xl border transition-all text-center ${
                      isActive
                        ? "bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.02]"
                        : "bg-white/[0.02] border-white/5 opacity-70"
                    }`}
                  >
                    <div className="text-[11px] font-mono font-bold text-white flex items-center justify-center gap-1">
                      {hop.code}
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">{hop.city}</div>
                    <div className={`text-[10px] font-mono font-bold mt-1 ${isActive ? "text-cyan-300" : "text-slate-500"}`}>
                      {hop.latency}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4 Sleek Feature Capability Chips */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-semibold text-slate-200 hover:border-cyan-400/40 hover:bg-white/[0.08] transition">
              <Zap className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">&lt;50ms Hot-Path</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-semibold text-slate-200 hover:border-emerald-400/40 hover:bg-white/[0.08] transition">
              <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">SHA-256 IP Hash</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-semibold text-slate-200 hover:border-indigo-400/40 hover:bg-white/[0.08] transition">
              <Cpu className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">AI Bot Defense</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-semibold text-slate-200 hover:border-sky-400/40 hover:bg-white/[0.08] transition">
              <Activity className="h-3.5 w-3.5 text-sky-400 shrink-0" />
              <span className="truncate">99.999% SLA</span>
            </div>
          </div>

          {/* Architecture Status Badges */}
          <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Clusters Synced</span>
            </div>
            <span>•</span>
            <span>Zero Data Leak</span>
            <span>•</span>
            <span className="font-mono text-cyan-400">Quantum Fast</span>
          </div>

        </div>

        {/* ── RIGHT SIDE: Next-Gen Glowing Cyber Glass Login Card ── */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end animate-in fade-in slide-in-from-right-6 duration-700">
          
          <div className="w-full max-w-[420px] rounded-3xl bg-slate-950/75 hover:bg-slate-950/90 backdrop-blur-2xl border border-white/15 hover:border-cyan-400/50 p-5 sm:p-7 md:p-8 text-white shadow-2xl shadow-black/95 hover:shadow-[0_0_60px_-10px_rgba(6,182,212,0.35)] transition-all duration-300 group relative overflow-hidden">
            
            {/* Top Interactive Animated Gradient Light Beam */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400 via-indigo-500 to-transparent opacity-75 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Card Header with Mini Logo & Cluster Security Badge */}
            <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-white/10 mb-4 sm:mb-5">
              <BrandLogo size="sm" showBadge={false} />
              
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>TLS 1.3 Verified</span>
              </div>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 mb-4 sm:mb-5 group-hover:border-white/20 transition">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsRegister(false);
                  setError(null);
                  setResetNotice(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isRegister
                    ? "bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 font-extrabold"
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
                  setResetNotice(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isRegister
                    ? "bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 font-extrabold"
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

            {/* Password Reset Notice */}
            {resetNotice && (
              <div className="mb-4 p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs flex items-center gap-2 animate-in fade-in">
                <Info className="h-4 w-4 shrink-0 text-cyan-400" />
                <span className="text-xs leading-tight">{resetNotice}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative group/field">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/field:text-cyan-400 transition" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah Chen"
                      className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.12] border border-white/10 hover:border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition shadow-inner"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group/field">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/field:text-cyan-400 transition" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="demo@linkpulse.io"
                    className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.12] border border-white/10 hover:border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => setResetNotice("Demo Environment: Use 1-Click Access below or login with Sarah Chen's credentials.")}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative group/field">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/field:text-cyan-400 transition" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.12] border border-white/10 hover:border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Meter in Registration Mode */}
                {isRegister && (
                  <div className="mt-2 space-y-1 animate-in fade-in">
                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
                      <span>Password Security</span>
                      <span className={strength.score === 3 ? "text-emerald-400" : strength.score === 2 ? "text-amber-400" : "text-rose-400"}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 h-1">
                      <div className={`rounded-full transition-all ${strength.score >= 1 ? strength.color : "bg-white/10"}`} />
                      <div className={`rounded-full transition-all ${strength.score >= 2 ? strength.color : "bg-white/10"}`} />
                      <div className={`rounded-full transition-all ${strength.score >= 3 ? strength.color : "bg-white/10"}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Remember Me Toggle */}
              {!isRegister && (
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0 h-3.5 w-3.5"
                    />
                    <span className="text-[11px] text-slate-300">Remember this workstation</span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:via-sky-500 hover:to-indigo-500 hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:brightness-110 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 mt-1 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{!isRegister ? "Sign In to Workspace" : "Launch Edge Account"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Demo Logins */}
            <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <Key className="h-3 w-3 text-cyan-400" />
                  1-Click Instant Access
                </span>
                <span className="text-cyan-400 font-mono text-[9px]">Zero-Typing</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials("demo@linkpulse.io", "Demo@123456")}
                  className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-cyan-400/50 text-left transition cursor-pointer active:scale-95 group/btn shadow-xs min-w-0 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide truncate">
                      Sarah Chen
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 group-hover/btn:animate-ping shrink-0 ml-1" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-slate-200 truncate mt-0.5">demo@linkpulse.io</div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">Hot-Path User</div>
                </button>

                <button
                  type="button"
                  onClick={() => fillCredentials("admin@linkpulse.io", "Admin@123456")}
                  className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-indigo-400/50 text-left transition cursor-pointer active:scale-95 group/btn shadow-xs min-w-0 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide truncate">
                      Alex Mercer
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 group-hover/btn:animate-ping shrink-0 ml-1" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-slate-200 truncate mt-0.5">admin@linkpulse.io</div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">Edge Admin</div>
                </button>
              </div>
            </div>

            {/* Security Guarantee Footer */}
            <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] text-slate-400 text-center">
              <Shield className="h-3 w-3 text-emerald-400 shrink-0" />
              <span className="truncate">256-bit AES Edge-Encrypted • Autonomous Engine</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
