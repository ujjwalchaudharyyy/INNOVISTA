import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, Lock, Mail, User, AlertCircle, Zap, Shield, Activity, Globe2, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
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
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMutedRef = useRef(false);

  // Link khulte hi:
  // 1. Song immediately starts playing on loop
  // 2. 3 seconds baad AI intro voice start hoti hai
  useEffect(() => {
    let speechTimer: any = null;
    let hasTriggeredSpeech = false;

    const startIntroAfterDelay = () => {
      if (hasTriggeredSpeech || isMutedRef.current) return;
      hasTriggeredSpeech = true;

      speechTimer = setTimeout(() => {
        if (isMutedRef.current) return;
        const welcomeText =
          "Welcome to Link Pulse. I am your autonomous A.I. link infrastructure. " +
          "I power ultra-fast edge redirects, automated fraud defense, and deep real-time analytics. " +
          "Let's get started.";

        // Duck song slightly so AI intro voice is crystal clear
        if (audioRef.current && !isMutedRef.current) audioRef.current.volume = 0.16;

        sounds.speak(welcomeText, () => {
          if (audioRef.current && !isMutedRef.current) audioRef.current.volume = 0.38;
        });
      }, 3000); // 3 seconds after song starts
    };

    const removeGestureListeners = () => {
      window.removeEventListener("click", onUserGesture);
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
    };

    const tryStartAudio = () => {
      if (isMutedRef.current || !audioRef.current) return;
      audioRef.current.volume = 0.38;
      
      const playNow = () => {
        if (isMutedRef.current || !audioRef.current) return;
        const p = audioRef.current.play();
        if (p !== undefined) {
          p.then(() => {
            setIsAudioMuted(false);
            setAutoplayBlocked(false);
            startIntroAfterDelay();
            removeGestureListeners();
          }).catch(() => {
            // Autoplay blocked: wait for gesture
            setAutoplayBlocked(true);
          });
        }
      };

      if (audioRef.current.readyState >= 2) {
        playNow();
      } else {
        audioRef.current.addEventListener("canplay", playNow, { once: true });
        playNow();
      }
    };

    // 1. Shuru me hi song start karo
    tryStartAudio();

    // 2. High-precision 40ms interval: sound ke last ke 3 second trim karke loop lagao
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
    const loopInterval = setInterval(checkAudioLoop, 40);

    // 3. Agar browser ne bina click ke block kiya, pehle click/tap par turant chalu ho
    const onUserGesture = () => {
      if (isMutedRef.current) return;
      tryStartAudio();
      setAutoplayBlocked(false);
    };
    window.addEventListener("click", onUserGesture);
    window.addEventListener("pointerdown", onUserGesture);
    window.addEventListener("keydown", onUserGesture);
    window.addEventListener("touchstart", onUserGesture);

    return () => {
      if (speechTimer) clearTimeout(speechTimer);
      clearInterval(loopInterval);
      removeGestureListeners();
      sounds.stopSpeech();
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
      audioRef.current.volume = 0.38;
      audioRef.current.play().catch(() => {});
    } else {
      isMutedRef.current = true;
      setIsAudioMuted(true);
      audioRef.current.pause();
      sounds.stopSpeech();
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
    sounds.speak(isRegister ? "Creating your account. Please wait." : "Signing you in to your dashboard.");
    setLoading(true);
    setError(null);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? { email, password, name } : { email, password };
      const res = await api.post(endpoint, payload);
      sounds.playSuccess();
      sounds.stopSpeech();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      sounds.stopBgMusic();
      login(res.data.token, res.data.user);
    } catch (err: any) {
      console.error("Login attempt error:", err);
      sounds.playError();
      const serverError = err.response?.data?.error;
      const errorMsg = serverError || (err.message === "Network Error" ? "Backend server unreachable. Make sure backend is running on port 5000." : err.message || "Invalid email or password");
      sounds.speak(serverError ? "Authentication failed." : "Unable to reach server. Please retry.");
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = () => {
    sounds.playClick();
    sounds.speak("Filling demo user credentials.");
    setEmail("demo@linkpulse.io");
    setPassword("Demo@123456");
    setIsRegister(false);
    setError(null);
  };

  const setAdminUser = () => {
    sounds.playClick();
    sounds.speak("Filling admin credentials.");
    setEmail("admin@linkpulse.io");
    setPassword("Admin@123456");
    setIsRegister(false);
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto overflow-x-hidden select-none bg-black font-sans py-8">
      
      {/* Background Loop Audio (Last 3s Trimmed on every Loop) */}
      <audio
        ref={audioRef}
        src="/bg-music.mp3"
        autoPlay
        preload="auto"
        onTimeUpdate={() => {
          if (isMutedRef.current) return;
          if (audioRef.current && !audioRef.current.paused) {
            const d = audioRef.current.duration;
            const c = audioRef.current.currentTime;
            if (d && d > 4 && c >= d - 3) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
          }
        }}
      />

      {/* Chrome Autoplay Unblock Notification Banner */}
      {autoplayBlocked && (
        <div
          onClick={toggleSound}
          className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-500/30 backdrop-blur-xl border border-cyan-400 text-white shadow-2xl shadow-cyan-500/40 cursor-pointer animate-pulse"
        >
          <Volume2 className="h-4 w-4 text-cyan-300 animate-spin" style={{ animationDuration: "3s" }} />
          <span className="text-xs font-semibold tracking-wide">
            🎵 Tap anywhere to start Sound & AI Voice
          </span>
        </div>
      )}

      {/* 1. CRYSTAL 4K BACKGROUND VIDEO */}
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
          filter: "contrast(1.1) brightness(1.02) saturate(1.15)",
        }}
      />

      {/* 2. SUBTLE CINEMATIC GRADIENT */}
      <div 
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 45%, rgba(0, 0, 0, 0.85) 100%)"
        }}
      />

      {/* Sound Toggle Floating Button */}
      <button
        onClick={toggleSound}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-slate-300 hover:text-white transition text-xs font-semibold cursor-pointer shadow-lg active:scale-95"
        title="Toggle Background Music"
      >
        {isAudioMuted ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse" />}
        <span className="hidden sm:inline">{isAudioMuted ? "Sound Off" : "Beat Active"}</span>
      </button>

      {/* 3. CONTENT WRAPPER */}
      <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        
        {/* MOBILE COMPACT BRAND (shown only on < lg) */}
        <div className="lg:hidden text-center space-y-2 text-white pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-cyan-300 text-[10px] font-bold tracking-wider uppercase">
            <Globe2 className="h-3 w-3 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Autonomous Engine v2.0</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Link<span className="text-cyan-400">Pulse</span>
          </h1>
        </div>

        {/* LEFT COLUMN: Clean Futuristic Branding (Desktop only) */}
        <div className="hidden lg:block lg:col-span-7 space-y-6 text-white pl-2 sm:pl-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-cyan-300 text-xs font-semibold tracking-wider uppercase">
            <Globe2 className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span>LinkPulse Autonomous Engine v2.0</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white drop-shadow-2xl">
              Link<span className="text-cyan-400">Pulse</span>
            </h1>
            <p className="text-lg sm:text-xl font-medium text-slate-200 tracking-tight">
              Enterprise URL Shortener, Edge Redirects & Analytics
            </p>
          </div>

          <p className="text-sm text-slate-300 max-w-lg font-normal leading-relaxed">
            High-speed redirect hot-path (&lt;50ms) with atomic click caps, privacy-preserving IP telemetry, vector QR studio, and automated security shield.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200 hover:border-cyan-400/40 transition">
              <Zap className="h-4 w-4 text-cyan-400" />
              <span>Sub-50ms Hot-Path</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200 hover:border-emerald-400/40 transition">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Atomic Click Caps</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-slate-200 hover:border-purple-400/40 transition">
              <Activity className="h-4 w-4 text-purple-400" />
              <span>Privacy Telemetry</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Ultra-Clean Frosted Glass Login Card */}
        <div className="lg:col-span-5">
          <div className="w-full rounded-2xl bg-slate-950/45 backdrop-blur-xl border border-white/15 p-6 sm:p-8 text-white shadow-2xl shadow-black/80 relative">
            
            {/* Header Switcher */}
            <div className="flex border-b border-white/10 mb-6">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  sounds.speak("You tapped on Sign In.");
                  setIsRegister(false);
                  setError(null);
                }}
                className={`flex-1 pb-3 text-xs font-semibold tracking-wider uppercase transition-all relative ${
                  !isRegister
                    ? "text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-cyan-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  sounds.speak("You tapped on Create Account.");
                  setIsRegister(true);
                  setError(null);
                }}
                className={`flex-1 pb-3 text-xs font-semibold tracking-wider uppercase transition-all relative ${
                  isRegister
                    ? "text-cyan-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-cyan-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-5">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {!isRegister ? "Welcome back" : "Get started"}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {!isRegister ? "Sign in to access your links & live metrics" : "Create an account to start shortening"}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
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
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="demo@linkpulse.io"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
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
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 transition disabled:opacity-50 mt-2 cursor-pointer active:scale-[0.98]"
              >
                <span>{loading ? "Signing in..." : !isRegister ? "Sign In to Dashboard" : "Create Account"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Quick Demo Credentials
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={setDemoUser}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition active:scale-[0.98]"
                >
                  <div className="text-[9px] text-cyan-400 font-semibold uppercase">User</div>
                  <div className="text-xs font-medium text-slate-200 truncate">demo@linkpulse.io</div>
                </button>
                <button
                  type="button"
                  onClick={setAdminUser}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition active:scale-[0.98]"
                >
                  <div className="text-[9px] text-purple-400 font-semibold uppercase">Admin</div>
                  <div className="text-xs font-medium text-slate-200 truncate">admin@linkpulse.io</div>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};