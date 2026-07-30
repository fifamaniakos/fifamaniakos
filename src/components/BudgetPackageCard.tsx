import React, { useRef, useState } from 'react';
import { BudgetPackage } from '../types';
import { Coins, MessageCircle, Edit3, Trash2 } from 'lucide-react';

const FEATURED_PLAYERS: Record<number, { name: string; photo: string }> = {
  100: { name: 'Cristiano Ronaldo', photo: 'https://cdn.sofifa.net/players/020/801/25_120.png' },
  200: { name: 'Kylian Mbappé', photo: 'https://cdn.sofifa.net/players/231/747/25_120.png' },
  400: { name: 'Lionel Messi', photo: 'https://cdn.sofifa.net/players/158/023/25_120.png' }
};

interface BudgetPackageCardProps {
  pkg: BudgetPackage;
  whatsappHref: string;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const PARTICLE_POSITIONS: { top: string; left?: string; right?: string; x: number; y: number }[] = [
  { top: '20%', left: '15%', x: 1, y: -1 },
  { top: '65%', right: '15%', x: -1, y: -1 },
  { top: '15%', left: '55%', x: 0.5, y: 1 },
  { top: '80%', right: '45%', x: -0.5, y: 1 },
  { top: '35%', left: '75%', x: 1, y: 0.5 },
  { top: '70%', right: '70%', x: -1, y: 0.5 }
];

export const BudgetPackageCard: React.FC<BudgetPackageCardProps> = ({
  pkg,
  whatsappHref,
  isAdmin,
  onEdit,
  onDelete
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovering, setHovering] = useState(false);

  const featuredPlayer = FEATURED_PLAYERS[pkg.budgetMillions];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ rx: (0.5 - py) * 18, ry: (px - 0.5) * 18 });
  };

  const handleLeave = () => {
    setHovering(false);
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div className="cc-container">
      <div
        ref={cardRef}
        className={`cc-card min-h-[440px] ${hovering ? 'cc-hover' : ''}`}
        onMouseEnter={() => setHovering(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleLeave}
        style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
      >
        <div className="cc-glare" />
        <div className="cc-scanline" />
        <div className="cc-glow-1" />
        <div className="cc-glow-2" />
        <div className="cc-corner">
          <span /><span /><span /><span />
        </div>
        <div className="cc-particles">
          {PARTICLE_POSITIONS.map((p, i) => (
            <span
              key={i}
              style={{ top: p.top, left: p.left, right: p.right, ['--x' as any]: p.x, ['--y' as any]: p.y }}
            />
          ))}
        </div>

        {isAdmin && (
          <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 rounded bg-black/40 text-slate-300 hover:text-emerald-400 transition-colors"
              title="Editar paquete"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 rounded bg-black/40 text-slate-300 hover:text-rose-400 transition-colors"
              title="Eliminar paquete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-5 pt-14 pb-8 gap-4">
          {featuredPlayer && (
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl scale-125" />
              <img
                src={featuredPlayer.photo}
                alt={featuredPlayer.name}
                referrerPolicy="no-referrer"
                className="relative w-32 h-32 object-contain drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[10px] font-tech font-bold uppercase tracking-widest text-emerald-300">
            <Coins className="w-3.5 h-3.5" /> Presupuesto Extra
          </div>

          <div className="font-display font-black text-5xl tracking-wide text-white [text-shadow:0_0_18px_rgba(2,245,155,0.65),0_0_4px_rgba(255,255,255,0.4)]">
            €{pkg.budgetMillions}M
          </div>

          <div className="px-4 py-1.5 rounded-md bg-[#00ba68] shadow-[0_0_16px_rgba(0,186,104,0.45)]">
            <span className="text-xs font-tech font-extrabold uppercase tracking-wider text-white">
              {pkg.priceUsd} USD
            </span>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-1 fc-button-primary px-5 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" /> Quiero Este
          </a>
        </div>
      </div>
    </div>
  );
};
