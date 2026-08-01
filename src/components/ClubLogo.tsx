import React, { useEffect, useState } from 'react';

interface ClubLogoProps {
  src?: string;
  alt?: string;
  className?: string;
}

export const ClubLogo: React.FC<ClubLogoProps> = ({
  src,
  alt = 'Club Logo',
  className = 'w-8 h-8 rounded-lg object-cover border border-slate-200'
}) => {
  const [hasError, setHasError] = useState(false);
  const fallbackText = alt
    .replace(/club logo/gi, '')
    .replace(/[^A-Za-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map(word => word[0])
    .join('')
    .toUpperCase() || 'FM';

  // Sin esto, una vez que una URL fallaba (ej: por referrer policy o un logo
  // roto), el componente quedaba mostrando el escudo de reemplazo para
  // siempre, aunque despues llegara un logoUrl distinto y valido -- el
  // componente no se remonta al cambiar el src, solo cambia la prop. Por eso
  // hacia falta F5 para que el escudo volviera a aparecer.
  useEffect(() => {
    setHasError(false);
  }, [src]);

  // Fallback if src is missing or image fails to load
  if (!src || hasError || src.trim() === '') {
    return (
      <div
        className={`relative flex items-center justify-center shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 border border-emerald-500/50 shadow-sm ${className}`}
        title={alt}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <defs>
            <linearGradient id="fm-shield-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ba68" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
            <linearGradient id="fm-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="50%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <path d="M50 8 L85 20 L80 68 C80 82 50 92 50 92 C50 92 20 82 20 68 L15 20 Z" fill="url(#fm-shield-bg)" stroke="#02f59b" strokeWidth="2.5" />
          <path d="M36 30 L64 30 L60 52 C60 60 40 60 40 52 Z" fill="url(#fm-gold)" />
          <rect x="46" y="56" width="8" height="8" fill="url(#fm-gold)" />
          <rect x="37" y="64" width="26" height="6" fill="url(#fm-gold)" rx="2" />
          <text x="50" y="84" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="sans-serif">{fallbackText}</text>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
};
