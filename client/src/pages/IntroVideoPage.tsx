import React, { useState, useRef, useEffect } from "react";
import { BrandLogo } from "../components/BrandLogo";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  ArrowRight, 
  Sparkles, 
  Film,
  RotateCcw
} from "lucide-react";

interface IntroVideoPageProps {
  onComplete: () => void;
}

export const IntroVideoPage: React.FC<IntroVideoPageProps> = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("0:00");
  const [durationStr, setDurationStr] = useState("0:00");
  const [isFading, setIsFading] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start playback reliably
    video.playsInline = true;
    video.muted = false;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {
          // If unmuted autoplay blocked by browser, start muted and allow 1-click sound unlock
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        handleSkip();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m" || e.key === "M") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const cur = video.currentTime;
    const dur = video.duration || 1;
    setProgress((cur / dur) * 100);
    setCurrentTimeStr(formatTime(cur));
    setDurationStr(formatTime(dur));
  };

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 350);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none font-sans transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* ── 4K HARDWARE-ACCELERATED VIDEO CANVAS ── */}
      <video
        ref={videoRef}
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          setVideoLoaded(true);
          if (videoRef.current) {
            setDurationStr(formatTime(videoRef.current.duration));
          }
        }}
        onEnded={handleSkip}
        className="absolute inset-0 w-full h-full object-cover z-0 cursor-pointer"
        onClick={togglePlay}
        style={{
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          // 4K Ultra-HD Crisp Sharpening & Color Recovery (recovers quality lost from compression)
          filter: "contrast(1.10) saturate(1.15) brightness(1.03)",
          imageRendering: "-webkit-optimize-contrast" as any,
        }}
      >
        {/* Primary intro video (Save your video as client/public/intro.mp4) */}
        <source src="/intro.mp4" type="video/mp4" />
        <source src="/intro-video.mp4" type="video/mp4" />
        {/* Resilient fallback to existing videos so it never displays a broken screen */}
        <source src="/login-bg.mp4" type="video/mp4" />
        <source src="/sounds.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Top & Bottom Vignette Overlays */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 15%, transparent 35%, transparent 65%, rgba(0,0,0,0.4) 85%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* Center Play/Pause Indicator Pulse when paused */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="relative z-20 flex h-20 w-20 items-center justify-center rounded-full bg-slate-950/70 border border-white/20 text-white backdrop-blur-md cursor-pointer hover:scale-110 transition shadow-2xl animate-in zoom-in-90"
        >
          <Play className="h-8 w-8 ml-1 text-cyan-400" />
        </div>
      )}

      {/* ── TOP BAR CONTROLS ── */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 z-30 flex items-center justify-between gap-3 pointer-events-auto">
        
        {/* Brand Header with 4K HDR Badge */}
        <div className="flex items-center gap-3">
          <BrandLogo size="md" showBadge={false} />
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-[10px] font-black tracking-wider text-cyan-300 uppercase shadow-lg">
            <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span>4K Ultra-HD Teaser</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/70 hover:bg-slate-900/90 text-white backdrop-blur-xl border border-white/15 hover:border-cyan-400/50 text-xs font-semibold transition cursor-pointer shadow-lg active:scale-95"
            title={isMuted ? "Unmute Audio (M)" : "Mute Audio (M)"}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-4 w-4 text-rose-400" />
                <span className="text-[11px] text-slate-300">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span className="text-[11px] text-cyan-300">Sound ON</span>
              </>
            )}
          </button>

          {/* Skip to Login Button */}
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] text-white text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-xl shadow-cyan-500/25"
          >
            <span>Skip to Login</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* ── BOTTOM CINEMATIC CONTROLS & TIMELINE ── */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 z-30 space-y-2 pointer-events-auto">
        
        {/* Interactive Scrubbing Bar */}
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            if (videoRef.current && videoRef.current.duration) {
              videoRef.current.currentTime = clickPos * videoRef.current.duration;
            }
          }}
          className="group relative w-full h-2 bg-white/15 hover:h-3 rounded-full cursor-pointer backdrop-blur-md transition-all overflow-hidden"
        >
          {/* Active progress */}
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 rounded-full transition-all duration-100 relative"
            style={{ width: `${progress}%` }}
          >
            {/* Glowing Head */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#38bdf8] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Timeline Status Bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-cyan-400" />}
            </button>
            <button
              onClick={handleReplay}
              className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
              title="Replay from start"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <span className="font-semibold text-white">{currentTimeStr}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{durationStr}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Space</kbd> to pause</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Enter</kbd> to enter workspace</span>
          </div>

          <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-semibold">
            <Film className="h-3 w-3" />
            <span className="hidden xs:inline">LinkPulse Autonomous Engine v2.4</span>
          </div>
        </div>

      </div>

    </div>
  );
};
