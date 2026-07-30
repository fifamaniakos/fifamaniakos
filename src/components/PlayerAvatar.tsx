import React, { useState } from 'react';

const getInitials = (name: string) => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map(w => w[0])
  .join('')
  .toUpperCase();

interface PlayerAvatarProps {
  name: string;
  photoUrl: string;
  className: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ name, photoUrl, className }) => {
  const [hasError, setHasError] = useState(false);
  return photoUrl && !hasError ? (
    <img src={photoUrl} alt={name} className={`${className} object-cover`} onError={() => setHasError(true)} />
  ) : (
    <div className={`${className} bg-slate-800 text-[#02f59b] font-display font-black flex items-center justify-center shrink-0`}>
      {getInitials(name)}
    </div>
  );
};
