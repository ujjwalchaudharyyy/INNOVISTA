import React, { useRef, useEffect, useState, useCallback } from "react";

interface IntroVideoPageProps {
  onComplete: () => void;
}

export const IntroVideoPage: React.FC<IntroVideoPageProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleComplete = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const tryPlay = () => {
      video.play().catch(() => {
        const unlock = () => {
          video.play().catch(() => {});
          window.removeEventListener("click", unlock);
          window.removeEventListener("touchstart", unlock);
        };
        window.addEventListener("click", unlock, { once: true, passive: true });
        window.addEventListener("touchstart", unlock, { once: true, passive: true });
      });
    };

    tryPlay();

    // Show skip button after 1.5s
    const skipTimer = setTimeout(() => setShowSkip(true), 1500);

    // Listen for Escape or Enter to skip
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") handleComplete();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      clearTimeout(skipTimer);
      window.removeEventListener("keydown", handleKey);
      if (video) video.pause();
    };
  }, [handleComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* 4K Enhanced Video */}
      <video
        ref={videoRef}
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleComplete}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: "translate3d(0, 0, 0) scale(1.02)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          // 4K quality enhancement filters
          filter: "contrast(1.25) saturate(1.40) brightness(1.12)",
          imageRendering: "auto",
        }}
      />

      {/* Subtle vignette edges */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Skip Button */}
      {showSkip && (
        <button
          onClick={handleComplete}
          className="absolute bottom-8 right-8 z-20 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white border border-white/30 bg-black/40 backdrop-blur-md hover:bg-white/20 hover:border-white/60 transition-all duration-200 active:scale-95 cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-500"
          style={{ letterSpacing: "0.05em" }}
        >
          Skip &nbsp;→
        </button>
      )}
    </div>
  );
};
