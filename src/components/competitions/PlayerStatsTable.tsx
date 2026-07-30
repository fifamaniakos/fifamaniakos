import React, { useState } from 'react';
import { Club, MatchResult, Player } from '../../types';
import { Search, Filter, Target, Zap, AlertTriangle } from 'lucide-react';
import { computePlayerStatsForCompetition } from '../../utils/competitionStats';

type StatType = 'goals' | 'assists' | 'cards';

const getInitials = (name: string) => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map(w => w[0])
  .join('')
  .toUpperCase();

const PlayerAvatar: React.FC<{ name: string; photoUrl: string; className: string }> = ({ name, photoUrl, className }) => (
  photoUrl ? (
    <img src={photoUrl} alt={name} className={`${className} object-cover`} />
  ) : (
    <div className={`${className} bg-slate-800 text-[#02f59b] font-display font-black flex items-center justify-center`}>
      {getInitials(name)}
    </div>
  )
);

interface PlayerStatsTableProps {
  statType: StatType;
  clubs: Club[];
  players: Player[];
  matches: MatchResult[];
  competition: string;
}

const STAT_META: Record<StatType, {
  banner: string;
  badge: string;
  badgeText: string;
  title: string;
  icon: React.ElementType;
  iconColor: string;
  tagline: string;
}> = {
  goals: {
    banner: 'border-amber-500/40 from-slate-900 via-amber-950 to-slate-900',
    badge: 'bg-amber-400 text-black',
    badgeText: 'Trofeo Pichichi FC 27',
    title: 'Tabla de Goleadores',
    icon: Target,
    iconColor: 'text-amber-400',
    tagline: 'Máximos anotadores oficiales de la competición.'
  },
  assists: {
    banner: 'border-teal-500/40 from-slate-900 via-teal-950 to-slate-900',
    badge: 'bg-teal-400 text-slate-950',
    badgeText: 'Líderes de Pases de Gol',
    title: 'Tabla de Asistencias',
    icon: Zap,
    iconColor: 'text-teal-400',
    tagline: 'Jugadores con mayor número de pases decisivos de gol.'
  },
  cards: {
    banner: 'border-rose-500/40 from-slate-900 via-rose-950 to-slate-900',
    badge: 'bg-rose-500 text-white',
    badgeText: 'Control Disciplinario y Fair Play',
    title: 'Tarjetas Amarillas y Rojas',
    icon: AlertTriangle,
    iconColor: 'text-rose-400',
    tagline: '3 Amarillas = 1 Partido de Sanción / 1 Roja = Expulsión Directa.'
  }
};

export const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({ statType, clubs, players, matches, competition }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [clubFilter, setClubFilter] = useState('TODOS');

  const meta = STAT_META[statType];
  const Icon = meta.icon;

  const allStats = computePlayerStatsForCompetition(clubs, players, matches, competition);

  const filteredStats = allStats.filter(ps => {
    const matchesSearch = !searchQuery || ps.name.toLowerCase().includes(searchQuery.toLowerCase()) || ps.clubName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClub = clubFilter === 'TODOS' || ps.clubName === clubFilter;
    const isRelevant = statType === 'goals'
      ? ps.goals > 0
      : statType === 'assists'
        ? ps.assists > 0
        : ps.yellowCards > 0 || ps.redCards > 0;
    return matchesSearch && matchesClub && isRelevant;
  });

  const sorted = [...filteredStats].sort((a, b) => {
    if (statType === 'goals') return b.goals - a.goals || b.rating - a.rating;
    if (statType === 'assists') return b.assists - a.assists || b.rating - a.rating;
    return b.disciplinaryPoints - a.disciplinaryPoints || b.redCards - a.redCards || b.yellowCards - a.yellowCards;
  });

  const leaderLabel = statType === 'goals'
    ? (sorted[0] ? `${sorted[0].goals} Goles` : '0 Goles')
    : statType === 'assists'
      ? (sorted[0] ? `${sorted[0].assists} Asistencias` : '0 Asistencias')
      : (sorted[0] ? `${sorted[0].disciplinaryPoints} pts` : '0 pts');

  return (
    <div className="space-y-6">
      <div className="fc-card p-4 rounded-xl border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar jugador o equipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#00ba68]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-tech font-bold uppercase text-slate-600">Filtrar por Equipo:</span>
          <select
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 px-3 py-1.5 focus:outline-none focus:border-[#00ba68]"
          >
            <option value="TODOS">Todos los Equipos</option>
            {clubs.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={`p-6 rounded-2xl border bg-gradient-to-r text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl ${meta.banner}`}>
        <div className="space-y-1.5 text-center md:text-left">
          <span className={`px-2.5 py-0.5 text-[10px] font-black font-tech uppercase rounded tracking-wider inline-block shadow-sm ${meta.badge}`}>
            {meta.badgeText}
          </span>
          <h2 className="font-display font-black text-2xl uppercase italic tracking-wide flex items-center gap-2 justify-center md:justify-start text-white">
            <Icon className={`w-6 h-6 ${meta.iconColor}`} /> {meta.title}
          </h2>
          <p className="text-xs text-slate-300 max-w-md font-sans">{meta.tagline}</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-700 shrink-0 shadow-inner">
          <Icon className={`w-10 h-10 shrink-0 ${meta.iconColor}`} />
          <div>
            <span className="text-[10px] uppercase font-tech font-bold text-slate-300 block">Líder</span>
            <span className="font-display font-black text-base text-white block">
              {sorted[0] ? sorted[0].name : 'Sin registros'}
            </span>
            <span className="text-xs font-bold font-mono text-slate-200">{leaderLabel}</span>
          </div>
        </div>
      </div>

      {statType === 'goals' && sorted.length > 0 && sorted.some(p => p.goals > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sorted.slice(0, 3).map((player, idx) => (
            <div
              key={player.id}
              className={`fc-card p-4 rounded-2xl border relative overflow-hidden flex items-center gap-3 shadow-md ${
                idx === 0 ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-400' :
                idx === 1 ? 'bg-gradient-to-br from-slate-50 to-slate-200 border-slate-300' :
                'bg-gradient-to-br from-orange-50 to-amber-50 border-amber-700/40'
              }`}
            >
              <div className={`w-10 h-10 rounded-full font-display font-black text-lg flex items-center justify-center shrink-0 shadow ${
                idx === 0 ? 'bg-amber-400 text-black' :
                idx === 1 ? 'bg-slate-300 text-black' :
                'bg-amber-700 text-white'
              }`}>
                #{idx + 1}
              </div>
              <PlayerAvatar name={player.name} photoUrl={player.photoUrl} className="w-10 h-10 rounded-full border-2 border-white shadow shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-tech font-bold uppercase text-slate-500 block">{player.clubName}</span>
                <h4 className="font-display font-extrabold text-sm text-slate-900 truncate uppercase">{player.name}</h4>
                <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded inline-block mt-0.5">
                  {player.position} • {player.rating} OVR
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-display font-black text-2xl text-slate-900 block leading-none">{player.goals}</span>
                <span className="text-[9px] font-tech uppercase text-slate-600 font-bold">Goles</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fc-card rounded-2xl overflow-hidden border-slate-200 bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-tech font-extrabold text-xs uppercase border-b border-slate-200 tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Jugador</th>
                <th className="py-3 px-4">Club</th>
                <th className="py-3 px-3 text-center">Posición</th>
                <th className="py-3 px-3 text-center">Media (OVR)</th>
                {statType === 'goals' && <th className="py-3 px-4 text-center">Goles Anotados</th>}
                {statType === 'assists' && <th className="py-3 px-4 text-center">Asistencias</th>}
                {statType === 'cards' && (
                  <>
                    <th className="py-3 px-3 text-center">Amarillas (🟨)</th>
                    <th className="py-3 px-3 text-center">Rojas (🟥)</th>
                    <th className="py-3 px-4 text-center">Puntos Disciplina</th>
                    <th className="py-3 px-4 text-center">Estado / Sanción</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={statType === 'cards' ? 9 : 6} className="text-center py-8 text-slate-500 font-tech">
                    No hay registros disponibles en {competition}.
                  </td>
                </tr>
              ) : (
                sorted.map((player, idx) => {
                  const isSuspended = player.redCards > 0 || player.yellowCards >= 3;
                  const yellowWarning = player.yellowCards === 2;

                  return (
                    <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-center font-display font-black text-xs text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <PlayerAvatar name={player.name} photoUrl={player.photoUrl} className="w-8 h-8 rounded-full border border-slate-200 shrink-0 text-[10px]" />
                          <span className="font-bold text-slate-900 text-sm block">{player.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">{player.clubName}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="bg-slate-100 text-slate-800 font-mono font-bold px-2 py-0.5 rounded text-[10px]">{player.position}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-amber-700">{player.rating}</td>

                      {statType === 'goals' && (
                        <td className="py-3 px-4 text-center">
                          <span className="font-display font-black text-base text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 inline-block min-w-12">
                            ⚽ {player.goals}
                          </span>
                        </td>
                      )}

                      {statType === 'assists' && (
                        <td className="py-3 px-4 text-center">
                          <span className="font-display font-black text-base text-cyan-800 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200 inline-block min-w-12">
                            👟 {player.assists}
                          </span>
                        </td>
                      )}

                      {statType === 'cards' && (
                        <>
                          <td className="py-3 px-3 text-center">
                            <span className="font-display font-black text-sm text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1">
                              <span className="w-2.5 h-3.5 bg-amber-400 rounded-xs inline-block" /> {player.yellowCards}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-display font-black text-sm text-rose-900 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-lg inline-flex items-center gap-1">
                              <span className="w-2.5 h-3.5 bg-rose-600 rounded-xs inline-block" /> {player.redCards}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">{player.disciplinaryPoints} pts</td>
                          <td className="py-3 px-4 text-center">
                            {isSuspended ? (
                              <span className="px-2.5 py-1 bg-rose-600 text-white font-tech font-extrabold text-[10px] uppercase rounded-lg inline-flex items-center gap-1 animate-pulse shadow-sm">
                                <AlertTriangle className="w-3 h-3" /> SANCTIONED
                              </span>
                            ) : yellowWarning ? (
                              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 font-tech font-extrabold text-[10px] uppercase rounded-lg inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600" /> A 1 Amarilla de Sanción
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-tech font-bold text-[10px] uppercase rounded-lg inline-block">
                                Habilitado
                              </span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
