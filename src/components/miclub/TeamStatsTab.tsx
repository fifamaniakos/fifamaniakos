import React from 'react';
import { Club, Player } from '../../types';
import { Trophy, TrendingUp, TrendingDown, Minus, Shield, Swords, Target, Activity, Zap, Star, ShieldAlert, Award } from 'lucide-react';

interface TeamStatsTabProps {
  currentClub: Club;
  players: Player[];
}

export const TeamStatsTab: React.FC<TeamStatsTabProps> = ({ currentClub, players }) => {
  const starters = players.filter(p => p.clubId === currentClub.id && p.isStarter);
  const avgRating = starters.length > 0
    ? Math.round(starters.reduce((acc, p) => acc + p.rating, 0) / starters.length)
    : (players.length > 0 ? Math.round(players.reduce((acc, p) => acc + p.rating, 0) / players.length) : 0);

  const goalDifference = currentClub.goalsFor - currentClub.goalsAgainst;
  const played = currentClub.played || 0;
  const winRate = played > 0 ? Math.round((currentClub.won / played) * 100) : 0;
  const avgGoalsFor = played > 0 ? (currentClub.goalsFor / played).toFixed(1) : '0.0';
  const avgGoalsAgainst = played > 0 ? (currentClub.goalsAgainst / played).toFixed(1) : '0.0';

  const statsList = [
    { label: 'Partidos Jugados', value: currentClub.played, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { label: 'Victorias', value: currentClub.won, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { label: 'Empates', value: currentClub.drawn, icon: Minus, color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
    { label: 'Derrotas', value: currentClub.lost, icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
    { label: 'Goles a Favor', value: currentClub.goalsFor, icon: Target, color: 'text-emerald-700', bg: 'bg-emerald-50/70 border-emerald-200' },
    { label: 'Goles en Contra', value: currentClub.goalsAgainst, icon: ShieldAlert, color: 'text-rose-700', bg: 'bg-rose-50/70 border-rose-200' },
    {
      label: 'Diferencia de Gol',
      value: goalDifference > 0 ? `+${goalDifference}` : goalDifference,
      icon: Swords,
      color: goalDifference >= 0 ? 'text-emerald-600' : 'text-rose-600',
      bg: goalDifference >= 0 ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
    },
    { label: 'Puntos Totales', value: currentClub.points, icon: Trophy, color: 'text-[#00ba68]', bg: 'bg-emerald-100/50 border-emerald-300' }
  ];

  const formIcon = { W: TrendingUp, D: Minus, L: TrendingDown };
  const formStyle = {
    W: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/30',
    D: 'bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-slate-500/30',
    L: 'bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-rose-500/30'
  };

  const formLabels = { W: 'Victoria', D: 'Empate', L: 'Derrota' };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators Summary Card */}
      <div className="fc-card p-5 rounded-3xl border border-slate-200 bg-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-base uppercase italic">
              Rendimiento Global de Temporada
            </h3>
            <p className="text-xs text-slate-500 font-tech">
              Resumen de efectividad y nivel general del plantel en la competición.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {/* Win Rate Circular Widget */}
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-600 transition-all duration-700"
                  strokeDasharray={`${winRate}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-display font-black text-xs text-emerald-700">{winRate}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold font-tech uppercase text-slate-400 block">Efectividad</span>
              <span className="font-display font-black text-sm text-slate-800">{currentClub.won}G - {currentClub.drawn}E - {currentClub.lost}P</span>
            </div>
          </div>

          {/* OVR Rating Widget */}
          <div className="bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200/80 flex items-center gap-3">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            <div>
              <span className="text-[10px] font-bold font-tech uppercase text-amber-800 block">Media Titular</span>
              <span className="font-display font-black text-lg text-amber-700">{avgRating} OVR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Efficiency Comparison Bar */}
      <div className="fc-card p-6 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="font-display font-extrabold text-slate-900 text-sm uppercase italic flex items-center gap-2">
            <Swords className="w-4 h-4 text-emerald-600" /> Balance Ofensivo vs Defensivo
          </h3>
          <div className="flex items-center gap-4 text-xs font-tech">
            <span className="text-emerald-700 font-bold">Promedio GF: {avgGoalsFor} / pjo</span>
            <span className="text-rose-700 font-bold">Promedio GC: {avgGoalsAgainst} / pjo</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-tech font-bold text-slate-700">
            <span className="text-emerald-700 flex items-center gap-1">
              ⚽ Goles a Favor ({currentClub.goalsFor})
            </span>
            <span className="text-rose-700 flex items-center gap-1">
              🛡️ Goles en Contra ({currentClub.goalsAgainst})
            </span>
          </div>

          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-l-full transition-all duration-500"
              style={{
                width: `${
                  currentClub.goalsFor + currentClub.goalsAgainst > 0
                    ? (currentClub.goalsFor / (currentClub.goalsFor + currentClub.goalsAgainst)) * 100
                    : 50
                }%`
              }}
            />
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-r-full transition-all duration-500"
              style={{
                width: `${
                  currentClub.goalsFor + currentClub.goalsAgainst > 0
                    ? (currentClub.goalsAgainst / (currentClub.goalsFor + currentClub.goalsAgainst)) * 100
                    : 50
                }%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid of 8 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsList.map(stat => {
          const IconComp = stat.icon;
          return (
            <div
              key={stat.label}
              className={`fc-card p-4 rounded-2xl border shadow-md bg-white hover:shadow-lg transition-all flex flex-col justify-between group ${stat.bg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-tech font-bold uppercase text-slate-500">{stat.label}</span>
                <IconComp className={`w-4 h-4 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <span className={`font-display font-black text-2xl md:text-3xl ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Racha Reciente (Recent Form) */}
      <div className="fc-card p-6 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-display font-extrabold text-slate-900 text-sm uppercase italic flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Racha Reciente en la Liga
          </h3>
          <span className="text-[10px] font-tech font-bold uppercase text-slate-400">Últimos 5 Partidos</span>
        </div>

        {currentClub.form && currentClub.form.length > 0 ? (
          <div className="flex items-center gap-3">
            {currentClub.form.map((result, idx) => {
              const Icon = formIcon[result] || Minus;
              const label = formLabels[result] || 'Resultado';
              return (
                <div key={idx} className="flex flex-col items-center gap-1 group">
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md shrink-0 transition-transform group-hover:scale-110 ${formStyle[result]}`}
                    title={label}
                  >
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </span>
                  <span className="text-[9px] font-tech font-bold uppercase text-slate-400">{result}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-xs font-tech italic text-center">
            Sin partidos jugados todavía en el fixture oficial.
          </div>
        )}
      </div>
    </div>
  );
};

