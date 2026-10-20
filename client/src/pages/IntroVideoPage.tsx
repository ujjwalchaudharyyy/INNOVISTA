import React, { useRef, useEffect, useState, useCallback } from "react";
import { Volume2, VolumeX, ArrowRight } from "lucide-react";

interface IntroVideoPageProps {
  onComplete: () => void;
}

export const IntroVideoPage: React.FC<IntroVideoPageProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Sound on by default!
  const hasCompletedRef = useRef(false);

  // Seamless zero-freeze transition to Login Page
  const handleComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    // Immediately stop video decoding to prevent GPU clash with Earth video
    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
      } catch (e) {}
    }

    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 150);
  }, [onComplete]);

  // Audio Toggle
  const toggleSound = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.volume = 1.0;
      video.play().catch(() => {});
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, []);

  // Timeupdate watchdog: fires smoothly as video plays.
  // When it reaches 0.25s before the end, smoothly complete! (Never stalls on last frame)
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration && video.duration > 2 && video.currentTime >= video.duration - 0.25) {
      handleComplete();
    }
  }, [handleComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playsInline = true;
    video.preload = "auto";
    video.defaultMuted = false;
    video.muted = false;
    video.volume = 1.0;

    // Direct sound playback: starts automatically with full audio!
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {
          // If browser policy temporarily pauses unmuted playback,
          // play with audio as soon as any subtle interaction occurs (mousemove, key, touch, scroll)
          const autoUnmuteOnActivity = () => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.volume = 1.0;
              videoRef.current.play().catch(() => {});
              setIsMuted(false);
            }
            ["mousemove", "pointerdown", "touchstart", "keydown", "scroll", "wheel"].forEach((evt) => {
              window.removeEventListener(evt, autoUnmuteOnActivity);
            });
          };

          ["mousemove", "pointerdown", "touchstart", "keydown", "scroll", "wheel"].forEach((evt) => {
            window.addEventListener(evt, autoUnmuteOnActivity, { passive: true, once: true });
          });

          // Play muted in the interim so video never stalls
          video.muted = true;
          video.play().catch(() => {});
        });
    }

    // Hard fallback safety timer (10.5 seconds max)
    const safetyTimer = setTimeout(() => {
      handleComplete();
    }, 10500);

    // Show skip button after 1s
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        handleComplete();
      } else if (e.code === "Space") {
        e.preventDefault();
        toggleSound();
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(safetyTimer);
      window.removeEventListener("keydown", handleKey);
      if (video) {
        try { video.pause(); } catch (e) {}
      }
    };
  }, [handleComplete, toggleSound]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center transition-opacity duration-200 select-none ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* High-Definition Master Video with Full Audio Enabled by Default */}
      <video
        ref={videoRef}
        src="/intro.mp4"
        autoPlay
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5-page"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleComplete}
        onError={handleComplete}
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          filter: "contrast(1.05) saturate(1.10) brightness(1.02)",
        }}
      />

      {/* Cinematic Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 75%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* TOP DECK: Clean Brand Badge & Audio Control (Safe-area padded for phones) */}
      <div 
        className="fixed top-3 left-3 right-3 sm:top-5 sm:left-6 sm:right-6 z-30 flex items-center justify-between pointer-events-none"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-white shadow-lg pointer-events-auto">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-cyan-300">
            LinkPulse
          </span>
        </div>

        <button
          type="button"
          onClick={toggleSound}
          onTouchEnd={toggleSound}
          className={`pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full backdrop-blur-xl border shadow-xl transition-all duration-200 cursor-pointer active:scale-95 ${
            isMuted
              ? "bg-slate-900/80 border-white/20 text-slate-300 hover:text-white"
              : "bg-cyan-500/20 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30"
          }`}
          title={isMuted ? "Audio Muted (Click to Unmute)" : "Audio Playing (Click to Mute)"}
        >
          {isMuted ? (
            <>
              <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400">Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
              <span className="text-[10px] sm:text-xs font-semibold text-cyan-300">Sound ON</span>
            </>
          )}
        </button>
      </div>

      {/* Skip Button (Responsive, thumb-friendly on mobile) */}
      {showSkip && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleComplete();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            handleComplete();
          }}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-30 flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white border border-white/25 bg-black/70 hover:bg-white/20 hover:border-cyan-400/60 backdrop-blur-xl shadow-2xl transition-all duration-200 active:scale-95 cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-300"
          style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <span>Skip to Login</span>
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-400" />
        </button>
      )}
    </div>
  );
};
