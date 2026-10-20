import React, { useRef, useEffect, useState, useCallback } from "react";
import { Volume2, VolumeX, ArrowRight } from "lucide-react";

interface IntroVideoPageProps {
  onComplete: () => void;
}

export const IntroVideoPage: React.FC<IntroVideoPageProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const hasCompletedRef = useRef(false);

  // Seamless zero-freeze transition to Login Page
  const handleComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    // Immediately stop video decoding to free hardware decoder
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
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, []);

  // Unmute on first screen interaction
  const enableSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      video.muted = false;
      video.volume = 1.0;
      setIsMuted(false);
    }
  }, []);

  // Timeupdate watchdog: fires continuously as video plays.
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

    // Attempt unmuted playback first; if browser blocks, fallback to muted autoplay
    video.muted = false;
    video.volume = 1.0;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
        })
        .catch(() => {
          // Browser requires user interaction for audio
          video.muted = true;
          setIsMuted(true);
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
      onClick={enableSound}
      onTouchStart={enableSound}
      className={`fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center transition-opacity duration-200 select-none cursor-pointer ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ touchAction: "manipulation" }}
    >
      {/* 4K Master Video (3840x2160 UHD Lanczos) */}
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
          imageRendering: "-webkit-optimize-contrast",
          filter: "contrast(1.08) saturate(1.18) brightness(1.02)",
        }}
      />

      {/* Cinematic Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 70%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* TOP DECK: Live 4K Tag & Audio Control */}
      <div className="fixed top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-white shadow-lg pointer-events-auto">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-cyan-300">
            LinkPulse 4K
          </span>
        </div>

        <button
          type="button"
          onClick={toggleSound}
          onTouchEnd={toggleSound}
          className={`pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-xl border shadow-xl transition-all duration-200 cursor-pointer active:scale-95 ${
            isMuted
              ? "bg-amber-500/20 border-amber-400/40 text-amber-300 animate-pulse hover:bg-amber-500/30"
              : "bg-black/60 border-cyan-400/50 text-cyan-300 hover:bg-black/80"
          }`}
          title={isMuted ? "Tap to Unmute Audio" : "Audio Active"}
        >
          {isMuted ? (
            <>
              <VolumeX className="h-4 w-4 text-amber-300" />
              <span className="text-[11px] sm:text-xs font-semibold">Tap for Sound 🔊</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-cyan-400" />
              <span className="text-[11px] sm:text-xs font-semibold">Sound ON</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Center Audio Prompt (disappears when sound is unmuted) */}
      {isMuted && (
        <div className="fixed bottom-24 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white shadow-2xl">
            <Volume2 className="h-4 w-4 text-cyan-400 animate-bounce" />
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              Tap anywhere for sound 🔊
            </span>
          </div>
        </div>
      )}

      {/* Skip Button */}
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
          className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-30 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white border border-white/25 bg-black/60 hover:bg-white/20 hover:border-cyan-400/60 backdrop-blur-xl shadow-2xl transition-all duration-200 active:scale-95 cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          <span>Skip to Login</span>
          <ArrowRight className="h-4 w-4 text-cyan-400" />
        </button>
      )}
    </div>
  );
};
