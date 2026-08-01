import React from 'react';
import { Club, Player } from '../../types';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TeamStatsTabProps {
  currentClub: Club;
  players: Player[];
}

export const TeamStatsTab: React.FC<TeamStatsTabProps> = ({ currentClub, players }) => {
  const starters = players.filter(p => p.clubId === currentClub.id && p.isStarter);
  const avgRating = starters.length > 0
    ? Math.round(starters.reduce((acc, p) => acc + p.rating, 0) / starters.length)
    : 0;
  const goalDifference = currentClub.goalsFor - currentClub.goalsAgainst;

  const stats: { label: string; value: string | number; accent?: string }[] = [
    { label: 'Partidos Jugados', value: currentClub.played },
    { label: 'Ganados', value: currentClub.won, accent: 'text-emerald-700' },
    { label: 'Empatados', value: currentClub.drawn, accent: 'text-slate-700' },
    { label: 'Perdidos', value: currentClub.lost, accent: 'text-rose-700' },
    { label: 'Goles a Favor', value: currentClub.goalsFor },
    { label: 'Goles en Contra', value: currentClub.goalsAgainst },
    { label: 'Diferencia de Gol', value: goalDifference > 0 ? `+${goalDifference}` : goalDifference, accent: goalDifference >= 0 ? 'text-emerald-700' : 'text-rose-700' },
    { label: 'Puntos', value: currentClub.points, accent: 'text-[#00ba68]' }
  ];

  const formIcon = { W: TrendingUp, D: Minus, L: TrendingDown };
  const formStyle = {
    W: 'bg-emerald-500 text-white',
    D: 'bg-slate-400 text-white',
    L: 'bg-rose-500 text-white'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(stat => (
          <div key={stat.label} className="fc-card p-4 rounded-2xl border-slate-200 text-center">
            <span className="text-[10px] font-tech uppercase text-slate-500 block mb-1">{stat.label}</span>
            <span className={`font-display font-black text-2xl ${stat.accent || 'text-slate-900'}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="fc-card p-5 rounded-2xl border-slate-200 space-y-3">
        <h3 className="font-display font-bold text-sm uppercase text-slate-800 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" /> Racha Reciente
        </h3>
        {currentClub.form.length > 0 ? (
          <div className="flex items-center gap-2">
            {currentClub.form.map((result, idx) => {
              const Icon = formIcon[result];
              return (
                <span
                  key={idx}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${formStyle[result]}`}
                  title={result === 'W' ? 'Ganado' : result === 'D' ? 'Empatado' : 'Perdido'}
                >
                  <Icon className="w-4 h-4" />
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-tech italic">Sin partidos jugados todavía.</p>
        )}
      </div>

      <div className="fc-card p-5 rounded-2xl border-slate-200 flex items-center justify-between">
        <span className="text-xs font-tech font-bold uppercase text-slate-500">Media de Plantilla (11 Titular)</span>
        <span className="font-display font-black text-3xl text-[#00ba68]">{avgRating} OVR</span>
      </div>
    </div>
  );
};
