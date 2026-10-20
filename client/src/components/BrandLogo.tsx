import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  subtext?: string;
  className?: string;
  animated?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showText = true,
  showBadge = true,
  badgeText = "PRO",
  subtext,
  className = "",
  animated = true,
}) => {
  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9 sm:h-10 sm:w-10",
    lg: "h-11 w-11 sm:h-12 sm:w-12",
    xl: "h-12 w-12 sm:h-16 sm:w-16",
  };

  const textSizes = {
    sm: "text-xs sm:text-sm",
    md: "text-sm sm:text-base",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* ── Custom High-Tech SVG Emblem ── */}
      <div className={`relative ${iconSizes[size]} shrink-0 group`}>
        {/* Ambient Backglow */}
        {animated && (
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
        )}

        {/* Squircle Glass Canvas */}
        <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-[1.5px] shadow-xl shadow-cyan-500/20">
          <div className="h-full w-full rounded-[14px] bg-gradient-to-br from-slate-900/90 via-[#0B1229]/95 to-slate-950/90 backdrop-blur-xl flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-cyan-400/50 transition-colors">
            
            {/* Custom Modern LinkPulse Vector: Linked Geometric Infinity Pulse */}
            <svg
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[72%] h-[72%] transition-transform duration-300 group-hover:scale-110"
            >
              <defs>
                <linearGradient id="lp-grad-pulse" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00F2FE" />
                  <stop offset="45%" stopColor="#4FACFE" />
                  <stop offset="75%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
                <linearGradient id="lp-glow-core" x1="12" y1="20" x2="28" y2="20" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
                <filter id="lp-neon-bloom" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Interlocking Link Node Left */}
              <path
                d="M17 13H13C9.686 13 7 15.686 7 19C7 22.314 9.686 25 13 25H17"
                stroke="url(#lp-grad-pulse)"
                strokeWidth="2.8"
                strokeLinecap="round"
                filter="url(#lp-neon-bloom)"
              />

              {/* Interlocking Link Node Right */}
              <path
                d="M23 15H27C30.314 15 33 17.686 33 21C33 24.314 30.314 27 27 27H23"
                stroke="url(#lp-grad-pulse)"
                strokeWidth="2.8"
                strokeLinecap="round"
                filter="url(#lp-neon-bloom)"
              />

              {/* Central Electric Pulse Wave connecting both nodes */}
              <path
                d="M12 20H16L19 14L22 26L25 20H28"
                stroke="url(#lp-glow-core)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Quantum Photon Core Beacon */}
              <circle cx="20.5" cy="20" r="1.6" fill="#FFFFFF" className={animated ? "animate-ping origin-center" : ""} opacity="0.9" />
              <circle cx="20.5" cy="20" r="1.2" fill="#00F2FE" />
            </svg>
          </div>
        </div>

        {/* Top-Right Neon Status Beacon */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-tr from-cyan-400 to-emerald-400 ring-2 ring-slate-950"></span>
        </span>
      </div>

      {/* ── Brand Typography & Badge ── */}
      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className={`${textSizes[size]} font-black tracking-tight text-slate-900 dark:text-white flex items-center leading-none`}>
              Link
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Pulse
              </span>
            </span>

            {showBadge && (
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-xs shadow-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {badgeText}
              </span>
            )}
          </div>

          {subtext && (
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate tracking-tight mt-0.5">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
