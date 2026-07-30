import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || src.trim() === '' || hasError) {
    return (
      <div className={`${className} bg-slate-100 text-slate-400 flex items-center justify-center shrink-0`} title={alt}>
        <ImageOff className="w-1/3 h-1/3" />
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />;
};
