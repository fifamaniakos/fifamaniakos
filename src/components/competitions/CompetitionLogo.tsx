import React from 'react';

interface CompetitionLogoProps {
  competition: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CompetitionLogo: React.FC<CompetitionLogoProps> = ({
  competition,
  className = '',
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 min-w-[28px]',
    md: 'w-9 h-9 min-w-[36px]',
    lg: 'w-12 h-12 min-w-[48px]',
    xl: 'w-16 h-16 min-w-[64px]'
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // ⚽ LIGA 1RA DIVISIÓN (LaLiga EA Sports Lux)
  if (competition === '1ra División' || competition === 'Primera División') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 shadow-lg rounded-xl overflow-hidden ring-1 ring-white/20 ${currentSize} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="laliga1-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF1744" />
              <stop offset="50%" stopColor="#D50000" />
              <stop offset="100%" stopColor="#880000" />
            </linearGradient>
            <linearGradient id="laliga1-ribbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0E0E0" />
            </linearGradient>
            <filter id="glow-l1" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>
          <rect width="100" height="100" rx="24" fill="url(#laliga1-bg)" />
          <g filter="url(#glow-l1)">
            <path d="M22 20 L44 20 L44 80 L22 80 Z" fill="url(#laliga1-ribbon)" />
            <path d="M44 50 L78 20 L78 40 L54 62 Z" fill="url(#laliga1-ribbon)" />
            <path d="M54 50 L78 80 L54 80 Z" fill="url(#laliga1-ribbon)" />
          </g>
          <text x="82" y="88" textAnchor="end" fill="#FFD700" fontSize="18" fontWeight="900" fontFamily="sans-serif">1ª</text>
        </svg>
      </div>
    );
  }

  // ⚽ LIGA 2DA DIVISIÓN (LaLiga Hypermotion Lux)
  if (competition === '2da División' || competition === 'Segunda División') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 shadow-lg rounded-xl overflow-hidden ring-1 ring-cyan-300/30 ${currentSize} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="laliga2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#00B0FF" />
              <stop offset="100%" stopColor="#006064" />
            </linearGradient>
            <filter id="glow-l2" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>
          <rect width="100" height="100" rx="24" fill="url(#laliga2-bg)" />
          <g filter="url(#glow-l2)">
            <path d="M22 20 L44 20 L44 80 L22 80 Z" fill="#FFFFFF" />
            <path d="M44 50 L78 20 L78 40 L54 62 Z" fill="#FFFFFF" />
            <path d="M54 50 L78 80 L54 80 Z" fill="#FFFFFF" />
          </g>
          <text x="82" y="88" textAnchor="end" fill="#FFFFFF" fontSize="18" fontWeight="900" fontFamily="sans-serif">2ª</text>
        </svg>
      </div>
    );
  }

  // ⭐ UEFA CHAMPIONS LEAGUE (Galaxy VIP Starball & Trophy)
  if (competition === 'UEFA Champions League') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 shadow-xl rounded-xl overflow-hidden ring-1 ring-indigo-400/40 ${currentSize} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <defs>
            <radialGradient id="ucl-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="60%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <linearGradient id="trophy-metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <filter id="ucl-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38BDF8" floodOpacity="0.8" />
            </filter>
          </defs>
          <rect width="100" height="100" rx="24" fill="url(#ucl-bg)" />
          {/* Starball Outer Ring */}
          <circle cx="50" cy="50" r="42" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.6" />
          {/* 8 Stars */}
          <g fill="#38BDF8" filter="url(#ucl-glow)">
            <polygon points="50,13 52.5,20 59,20 54,24.5 56,31 50,27 44,31 46,24.5 41,20 47.5,20" fill="#FFFFFF" />
            <polygon points="73,23 75.5,30 82,30 77,34.5 79,41 73,37 67,41 69,34.5 64,30 70.5,30" />
            <polygon points="83,47 85.5,54 92,54 87,58.5 89,65 83,61 77,65 79,58.5 74,54 80.5,54" />
            <polygon points="73,71 75.5,78 82,78 77,82.5 79,89 73,85 67,89 69,82.5 64,78 70.5,78" />
            <polygon points="50,79 52.5,86 59,86 54,90.5 56,97 50,93 44,97 46,90.5 41,86 47.5,86" fill="#FFFFFF" />
            <polygon points="27,71 29.5,78 36,78 31,82.5 33,89 27,85 21,89 23,82.5 18,78 24.5,78" />
            <polygon points="17,47 19.5,54 26,54 21,58.5 23,65 17,61 11,65 13,58.5 8,54 14.5,54" />
            <polygon points="27,23 29.5,30 36,30 31,34.5 33,41 27,37 21,41 23,34.5 18,30 24.5,30" />
          </g>
          {/* Trophy Silhouette */}
          <path d="M41 36 Q50 34 59 36 L57 52 Q57 60 50 60 Q43 60 43 52 Z" fill="url(#trophy-metal)" />
          <path d="M37 38 C33 38 33 46 39 47" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
          <path d="M63 38 C67 38 67 46 61 47" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
          <rect x="47" y="60" width="6" height="7" fill="url(#trophy-metal)" />
          <rect x="41" y="67" width="18" height="4" fill="url(#trophy-metal)" rx="1" />
        </svg>
      </div>
    );
  }

  // 🌍 UEFA EUROPA LEAGUE (Faceted Amber Gold Trophy)
  if (competition === 'UEFA Europa League') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 shadow-xl rounded-xl overflow-hidden ring-1 ring-amber-400/40 ${currentSize} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="uel-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="50%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#431407" />
            </linearGradient>
            <linearGradient id="uel-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="24" fill="url(#uel-bg)" />
          {/* Waves */}
          <path d="M10 85 Q50 10 90 85" stroke="#FFFFFF" strokeWidth="4" fill="none" opacity="0.3" />
          <path d="M20 90 Q50 20 80 90" stroke="#FFFFFF" strokeWidth="6" fill="none" opacity="0.2" />
          {/* Trophy Body */}
          <path d="M37 26 L63 26 L58 62 L42 62 Z" fill="url(#uel-gold)" />
          <path d="M42 62 L38 76 L62 76 L58 62 Z" fill="#E2E8F0" />
          <rect x="35" y="76" width="30" height="7" fill="#FFFFFF" rx="1.5" />
          <path d="M47 26 L53 26 L51 62 L49 62 Z" fill="#EA580C" />
        </svg>
      </div>
    );
  }

  // 🛡️ UEFA CONFERENCE LEAGUE (Emerald Shield Trophy)
  if (competition === 'UEFA Conference League') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 shadow-xl rounded-xl overflow-hidden ring-1 ring-emerald-400/40 ${currentSize} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="uecl-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#022C22" />
            </linearGradient>
            <linearGradient id="uecl-shield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#D1FAE5" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </linearGradient>
            <filter id="uecl-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#34D399" floodOpacity="0.7" />
            </filter>
          </defs>
          <rect width="100" height="100" rx="24" fill="url(#uecl-bg)" />
          <g filter="url(#uecl-glow)">
            <path d="M50 18 L76 28 L76 52 C76 70 50 84 50 84 C50 84 24 70 24 52 L24 28 Z" fill="url(#uecl-shield)" />
          </g>
          <path d="M40 50 L47 58 L62 40" stroke="#059669" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  // DEFAULT
  return (
    <div className={`relative flex items-center justify-center shrink-0 shadow-lg rounded-xl overflow-hidden ring-1 ring-emerald-300/40 ${currentSize} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <defs>
          <linearGradient id="def-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="24" fill="url(#def-bg)" />
        <path d="M30 25 L70 25 L65 55 C65 65 35 65 35 55 Z" fill="#FCD34D" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M24 30 C14 30 14 45 32 45 M76 30 C86 30 86 45 68 45" stroke="#FCD34D" strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="46" y="63" width="8" height="12" fill="#FCD34D" />
        <rect x="35" y="75" width="30" height="10" fill="#FCD34D" rx="2" />
      </svg>
    </div>
  );
};
