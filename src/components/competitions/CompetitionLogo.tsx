import React, { useEffect, useState } from 'react';

interface CompetitionLogoProps {
  competition: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface CompetitionConfig {
  primaryUrl: string;
  secondaryUrl: string;
  title: string;
  bgClass: string;
  renderSvgFallback: () => React.ReactNode;
}

const COMPETITION_CONFIGS: Record<string, CompetitionConfig> = {
  '1ra División': {
    primaryUrl: 'https://cdn.sofifa.net/leagues/53/120.png',
    secondaryUrl: 'https://cdn.sofifa.net/leagues/53/60.png',
    title: 'LaLiga EA Sports (1ra División)',
    bgClass: 'bg-slate-950 border-rose-600/50 shadow-rose-950/40',
    renderSvgFallback: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <rect width="100" height="100" rx="20" fill="#0F172A" />
        <path d="M25 20 L48 20 L48 80 L25 80 Z" fill="#FF1744" />
        <path d="M48 50 L80 20 L80 40 L58 62 Z" fill="#FF1744" />
        <path d="M58 50 L80 80 L58 80 Z" fill="#FF1744" />
        <text x="82" y="88" textAnchor="end" fill="#FFD700" fontSize="18" fontWeight="900" fontFamily="sans-serif">1ª</text>
      </svg>
    )
  },
  'Primera División': {
    primaryUrl: 'https://cdn.sofifa.net/leagues/53/120.png',
    secondaryUrl: 'https://cdn.sofifa.net/leagues/53/60.png',
    title: 'LaLiga EA Sports (1ra División)',
    bgClass: 'bg-slate-950 border-rose-600/50 shadow-rose-950/40',
    renderSvgFallback: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <rect width="100" height="100" rx="20" fill="#0F172A" />
        <path d="M25 20 L48 20 L48 80 L25 80 Z" fill="#FF1744" />
        <path d="M48 50 L80 20 L80 40 L58 62 Z" fill="#FF1744" />
        <path d="M58 50 L80 80 L58 80 Z" fill="#FF1744" />
        <text x="82" y="88" textAnchor="end" fill="#FFD700" fontSize="18" fontWeight="900" fontFamily="sans-serif">1ª</text>
      </svg>
    )
  },
  '2da División': {
    primaryUrl: 'https://cdn.sofifa.net/leagues/54/120.png',
    secondaryUrl: 'https://cdn.sofifa.net/leagues/54/60.png',
    title: 'LaLiga Hypermotion (2da División)',
    bgClass: 'bg-slate-950 border-cyan-500/50 shadow-cyan-950/40',
    renderSvgFallback: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <rect width="100" height="100" rx="20" fill="#0F172A" />
        <path d="M25 20 L48 20 L48 80 L25 80 Z" fill="#00E5FF" />
        <path d="M48 50 L80 20 L80 40 L58 62 Z" fill="#00E5FF" />
        <path d="M58 50 L80 80 L58 80 Z" fill="#00E5FF" />
        <text x="82" y="88" textAnchor="end" fill="#FFFFFF" fontSize="18" fontWeight="900" fontFamily="sans-serif">2ª</text>
      </svg>
    )
  },
  'Segunda División': {
    primaryUrl: 'https://cdn.sofifa.net/leagues/54/120.png',
    secondaryUrl: 'https://cdn.sofifa.net/leagues/54/60.png',
    title: 'LaLiga Hypermotion (2da División)',
    bgClass: 'bg-slate-950 border-cyan-500/50 shadow-cyan-950/40',
    renderSvgFallback: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <rect width="100" height="100" rx="20" fill="#0F172A" />
        <path d="M25 20 L48 20 L48 80 L25 80 Z" fill="#00E5FF" />
        <path d="M48 50 L80 20 L80 40 L58 62 Z" fill="#00E5FF" />
        <path d="M58 50 L80 80 L58 80 Z" fill="#00E5FF" />
        <text x="82" y="88" textAnchor="end" fill="#FFFFFF" fontSize="18" fontWeight="900" fontFamily="sans-serif">2ª</text>
      </svg>
    )
  },
  'UEFA Champions League': {
    primaryUrl: 'https://cdn.sofifa.net/leagues/2156/120.png',
    secondaryUrl: 'https://cdn.sofifa.net/leagues/2156/60.png',
    title: 'UEFA Champions League',
    bgClass: 'bg-slate-950 border-indigo-500/50 shadow-indigo-950/40',
    renderSvgFallback: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <rect width="100" height="100" rx="20" fill="#030712" />
        <circle cx="50" cy="50" r="40" stroke="#38BDF8" strokeWidth="2" opacity="0.8" />
        <g fill="#FFFFFF">
          <polygon points="50,15 52.5,22 59,22 54,26.5 56,33 50,29 44,33 46,26.5 41,22 47.5,22" />
          <polygon points="72,25 74.5,32 81,32 76,36.5 78,43 72,39 66,43 68,36.5 63,32 69.5,32" />
          <polygon points="81,48 83.5,55 90,55 85,59.5 87,66 81,62 75,66 77,59.5 72,55 78.5,55" />
          <polygon points="72,71 74.5,78 81,78 76,82.5 78,89 72,85 66,89 68,82.5 63,78 69.5,78" />
          <polygon points="50,78 52.5,85 59,85 54,89.5 56,96 50,92 44,96 46,89.5 41,85 47.5,85" />
          <polygon points="28,71 30.5,78 37,78 32,82.5 34,89 28,85 22,89 24,82.5 19,78 25.5,78" />
          <polygon points="19,48 21.5,55 28,55 23,59.5 25,66 19,62 13,66 15,59.5 10,55 16.5,55" />
          <polygon points="28,25 30.5,32 37,32 32,36.5 34,43 28,39 22,43 24,36.5 19,32 25.5,32" />
        </g>
      </svg>
    )
  },
  'UEFA Europa League': {
    primaryUrl: 'https://cdn.sofifa.net/leagues/2157/120.png',
    secondaryUrl: 'https://cdn.sofifa.net/leagues/2157/60.png',
    title: 'UEFA Europa League',
    bgClass: 'bg-slate-950 border-amber-500/50 shadow-amber-950/40',
    renderSvgFallback: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <rect width="100" height="100" rx="20" fill="#431407" />
        <path d="M38 25 L62 25 L57 62 L43 62 Z" fill="#F59E0B" />
        <path d="M43 62 L39 76 L61 76 L57 62 Z" fill="#FFFFFF" />
        <rect x="36" y="76" width="28" height="6" fill="#F59E0B" rx="1" />
      </svg>
    )
  },
  'UEFA Conference League': {
    primaryUrl: 'https://cdn.sofifa.net/leagues/2158/120.png',
    secondaryUrl: 'https://cdn.sofifa.net/leagues/2158/60.png',
    title: 'UEFA Conference League',
    bgClass: 'bg-slate-950 border-emerald-500/50 shadow-emerald-950/40',
    renderSvgFallback: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <rect width="100" height="100" rx="20" fill="#022C22" />
        <path d="M50 18 L76 28 L76 52 C76 70 50 84 50 84 C50 84 24 70 24 52 L24 28 Z" fill="#10B981" />
        <path d="M40 50 L47 58 L62 40" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  'Supercopa de Europa': {
    primaryUrl: 'https://cdn.sofifa.net/leagues/2155/120.png',
    secondaryUrl: 'https://cdn.sofifa.net/leagues/2155/60.png',
    title: 'UEFA Super Cup',
    bgClass: 'bg-slate-950 border-blue-500/50 shadow-blue-950/40',
    renderSvgFallback: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <rect width="100" height="100" rx="20" fill="#1E3A8A" />
        <circle cx="50" cy="50" r="35" stroke="#FFFFFF" strokeWidth="4" />
      </svg>
    )
  },
  'Mundial de Clubes': {
    primaryUrl: 'https://cdn.sofifa.net/leagues/2159/120.png',
    secondaryUrl: 'https://cdn.sofifa.net/leagues/2159/60.png',
    title: 'FIFA Club World Cup',
    bgClass: 'bg-slate-950 border-yellow-500/50 shadow-yellow-950/40',
    renderSvgFallback: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <rect width="100" height="100" rx="20" fill="#713F12" />
        <circle cx="50" cy="50" r="35" stroke="#EAB308" strokeWidth="4" />
      </svg>
    )
  },
  'Supercopa de Liga': {
    primaryUrl: 'https://cdn.sofifa.net/leagues/53/120.png',
    secondaryUrl: 'https://cdn.sofifa.net/leagues/53/60.png',
    title: 'Supercopa / Copa de Liga',
    bgClass: 'bg-slate-950 border-rose-500/50 shadow-rose-950/40',
    renderSvgFallback: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <rect width="100" height="100" rx="20" fill="#880000" />
        <path d="M30 25 L70 25 L65 55 C65 65 35 65 35 55 Z" fill="#FFD700" />
      </svg>
    )
  }
};

export const CompetitionLogo: React.FC<CompetitionLogoProps> = ({
  competition,
  className = '',
  size = 'md'
}) => {
  const [imgState, setImgState] = useState<'primary' | 'secondary' | 'error'>('primary');

  useEffect(() => {
    setImgState('primary');
  }, [competition]);

  const sizeMap = {
    sm: 'w-7 h-7 min-w-[28px] p-0.5 rounded-lg',
    md: 'w-9 h-9 min-w-[36px] p-1 rounded-xl',
    lg: 'w-12 h-12 min-w-[48px] p-1.5 rounded-xl',
    xl: 'w-16 h-16 min-w-[64px] p-2 rounded-2xl'
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const config = COMPETITION_CONFIGS[competition] || {
    primaryUrl: 'https://cdn.sofifa.net/leagues/53/120.png',
    secondaryUrl: 'https://cdn.sofifa.net/leagues/53/60.png',
    title: competition,
    bgClass: 'bg-slate-950 border-emerald-500/50 shadow-emerald-950/40',
    renderSvgFallback: () => (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <rect width="100" height="100" rx="20" fill="#090D16" />
        <path d="M30 25 L70 25 L65 55 C65 65 35 65 35 55 Z" fill="#02f59b" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M24 30 C14 30 14 45 32 45 M76 30 C86 30 86 45 68 45" stroke="#02f59b" strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="46" y="63" width="8" height="12" fill="#02f59b" />
        <rect x="35" y="75" width="30" height="10" fill="#02f59b" rx="2" />
      </svg>
    )
  };

  const currentUrl = imgState === 'primary' ? config.primaryUrl : config.secondaryUrl;

  if (imgState === 'error' || !currentUrl) {
    return (
      <div
        className={`relative flex items-center justify-center shrink-0 shadow-md border ${config.bgClass} ${currentSize} ${className}`}
        title={config.title}
      >
        {config.renderSvgFallback()}
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 shadow-md border border-slate-700/60 bg-slate-900/90 backdrop-blur-xs ${currentSize} ${className}`}
      title={config.title}
    >
      <img
        src={currentUrl}
        alt={config.title}
        className="w-full h-full object-contain filter drop-shadow-md"
        referrerPolicy="no-referrer"
        onError={() => {
          if (imgState === 'primary' && config.secondaryUrl) {
            setImgState('secondary');
          } else {
            setImgState('error');
          }
        }}
      />
    </div>
  );
};
