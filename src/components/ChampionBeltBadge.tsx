import React from 'react';
import { Award, Shield, Sparkles } from 'lucide-react';

interface ChampionBeltBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  reignDays?: number;
  defensesCount?: number;
  currentReignDefenses?: number;
  championshipCount?: number;
  showDays?: boolean;
  className?: string;
  animate?: boolean;
}

/**
 * Custom vector Champion Belt (冠軍金腰帶) component
 * Crafted with pure SVG & CSS styling, with golden center medallion,
 * jewel studs, embossed eagle/crown insignias, and leather straps.
 */
export const ChampionBeltBadge: React.FC<ChampionBeltBadgeProps> = ({
  size = 'md',
  reignDays,
  defensesCount,
  currentReignDefenses,
  championshipCount,
  showDays = true,
  className = '',
  animate = false
}) => {
  // Determine effective defenses text
  const effectiveDefenses = currentReignDefenses !== undefined ? currentReignDefenses : defensesCount;

  // Dimensions based on size
  const config = {
    sm: { width: 44, height: 22, textClass: 'text-[9px]', iconSize: 12 },
    md: { width: 72, height: 36, textClass: 'text-[11px]', iconSize: 16 },
    lg: { width: 110, height: 54, textClass: 'text-xs', iconSize: 20 }
  }[size];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* SVG Belt Graphic */}
      <div className={`relative shrink-0 flex items-center justify-center ${animate ? 'hover:scale-105 transition-transform' : ''}`}>
        <svg
          width={config.width}
          height={config.height}
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          <defs>
            {/* Belt strap gradient (luxurious black leather with carbon trim) */}
            <linearGradient id="strapGrad" x1="0" y1="30" x2="120" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="25%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#090d16" />
              <stop offset="75%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Gold plate main gradient */}
            <linearGradient id="goldPlateGrad" x1="60" y1="6" x2="60" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="20%" stopColor="#f59e0b" />
              <stop offset="55%" stopColor="#d97706" />
              <stop offset="85%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Side plate gold gradient */}
            <linearGradient id="sideGoldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Ruby Gem Gradient */}
            <radialGradient id="rubyGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="70%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>

            {/* Sapphire Gem Gradient */}
            <radialGradient id="sapphireGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </radialGradient>
          </defs>

          {/* 1. Leather Strap Wings */}
          <path
            d="M 6 18 C 16 16, 26 15, 38 14 L 38 46 C 26 45, 16 44, 6 42 C 2 41, 0 38, 0 30 C 0 22, 2 19, 6 18 Z"
            fill="url(#strapGrad)"
            stroke="#b45309"
            strokeWidth="1.2"
          />
          <path
            d="M 114 18 C 104 16, 94 15, 82 14 L 82 46 C 94 45, 104 44, 114 42 C 118 41, 120 38, 120 30 C 120 22, 118 19, 114 18 Z"
            fill="url(#strapGrad)"
            stroke="#b45309"
            strokeWidth="1.2"
          />

          {/* Strap Gold Studs */}
          <circle cx="10" cy="24" r="2.2" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
          <circle cx="10" cy="36" r="2.2" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
          <circle cx="18" cy="22" r="2" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
          <circle cx="18" cy="38" r="2" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />

          <circle cx="110" cy="24" r="2.2" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
          <circle cx="110" cy="36" r="2.2" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
          <circle cx="102" cy="22" r="2" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
          <circle cx="102" cy="38" r="2" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />

          {/* 2. Side Gold Plates (Left & Right) */}
          <rect
            x="24"
            y="17"
            width="13"
            height="26"
            rx="3"
            fill="url(#sideGoldGrad)"
            stroke="#fef08a"
            strokeWidth="0.8"
          />
          <circle cx="30.5" cy="30" r="3" fill="url(#rubyGrad)" stroke="#fef08a" strokeWidth="0.5" />

          <rect
            x="83"
            y="17"
            width="13"
            height="26"
            rx="3"
            fill="url(#sideGoldGrad)"
            stroke="#fef08a"
            strokeWidth="0.8"
          />
          <circle cx="89.5" cy="30" r="3" fill="url(#sapphireGrad)" stroke="#fef08a" strokeWidth="0.5" />

          {/* 3. Center Massive Medallion Outer Border */}
          <path
            d="M 46 12 L 74 12 C 86 12, 90 20, 88 30 C 90 40, 86 48, 74 48 L 46 48 C 34 48, 30 40, 32 30 C 30 20, 34 12, 46 12 Z"
            fill="url(#goldPlateGrad)"
            stroke="#fef08a"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Inner Inscribed Oval Plate */}
          <ellipse
            cx="60"
            cy="30"
            rx="21"
            ry="14"
            fill="#78350f"
            stroke="#fef08a"
            strokeWidth="1"
          />

          {/* Globe & Eagle / Crown Emblem Silhouette */}
          <circle cx="60" cy="30" r="10" fill="#451a03" />
          {/* Latitude / Longitude lines */}
          <ellipse cx="60" cy="30" rx="9" ry="5" fill="none" stroke="#fbbf24" strokeWidth="0.7" />
          <line x1="60" y1="20" x2="60" y2="40" stroke="#fbbf24" strokeWidth="0.7" />

          {/* Crown symbol on top of globe */}
          <path
            d="M 54 28 L 56 23 L 60 25 L 64 23 L 66 28 Z"
            fill="#fef08a"
            stroke="#b45309"
            strokeWidth="0.6"
          />

          {/* Central Diamond Gem */}
          <polygon
            points="60,28 62.5,31 60,34 57.5,31"
            fill="#ffffff"
            stroke="#f59e0b"
            strokeWidth="0.5"
          />

          {/* Four Corner Plate Gems */}
          <circle cx="48" cy="18" r="1.8" fill="url(#rubyGrad)" />
          <circle cx="72" cy="18" r="1.8" fill="url(#rubyGrad)" />
          <circle cx="48" cy="42" r="1.8" fill="url(#sapphireGrad)" />
          <circle cx="72" cy="42" r="1.8" fill="url(#sapphireGrad)" />

          {/* Shiny Top Arc Reflection */}
          <path
            d="M 48 15 Q 60 18 72 15"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Belt Title / Reign Days Pill */}
      {showDays && reignDays !== undefined && (
        <div className="flex flex-col items-start leading-none">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] font-mono font-black uppercase text-amber-300 tracking-wider">
              {championshipCount && championshipCount > 1 ? `${championshipCount}度王者` : '世界金腰帶'}
            </span>
            {effectiveDefenses !== undefined && effectiveDefenses > 0 ? (
              <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono text-[9px] font-black border border-amber-500/40">
                衛冕 {effectiveDefenses} 次
              </span>
            ) : (
              <span className="px-1 py-0.2 rounded bg-sky-500/20 text-sky-400 font-mono text-[9px] font-bold border border-sky-500/30">
                新王登基
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-black text-slate-100 flex items-center gap-0.5 mt-0.5">
            <span className="text-flow-gold">{reignDays}</span>
            <span className="text-[10px] text-amber-400/80 font-serif">天統治</span>
          </span>
        </div>
      )}
    </div>
  );
};
