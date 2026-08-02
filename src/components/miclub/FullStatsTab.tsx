import React, { useState, useMemo } from 'react';
import { Club, MatchResult, Player } from '../../types';
import { computeClubPlayerStats } from '../../utils/competitionStats';
import { BarChart4, Search, Award, Flame, UserCheck, ArrowUpDown, ChevronUp, ChevronDown, Trophy, Shield } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';

interface FullStatsTabProps {
  currentClub: Club;
  players: Player[];
  matches: MatchResult[];
}

type SortField = 'name' | 'position' | 'rating' | 'matchesPlayed' | 'goals' | 'assists' | 'yellowCards' | 'redCards' | 'gpg';
type SortOrder = 'asc' | 'desc';

export const FullStatsTab: React.FC<FullStatsTabProps> = ({ currentClub, players, matches }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [posFilter, setPosFilter] = useState<'ALL' | 'POR' | 'DEF' | 'MED' | 'DEL'>('ALL');
  const [sortField, setSortField] = useState<SortField>('goals');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const clubPlayers = useMemo(() => {
    return computeClubPlayerStats(currentClub.id, players, matches);
  }, [currentClub.id, players, matches]);

  // Leaderboard Highlights
  const topScorer = useMemo(() => {
    if (clubPlayers.length === 0) return null;
    return [...clubPlayers].sort((a, b) => b.goals - a.goals || b.matchesPlayed - a.matchesPlayed)[0];
  }, [clubPlayers]);

  const topAssister = useMemo(() => {
    if (clubPlayers.length === 0) return null;
    return [...clubPlayers].sort((a, b) => b.assists - a.assists || b.matchesPlayed - a.matchesPlayed)[0];
  }, [clubPlayers]);

  const topApp = useMemo(() => {
    if (clubPlayers.length === 0) return null;
    return [...clubPlayers].sort((a, b) => b.matchesPlayed - a.matchesPlayed || b.rating - a.rating)[0];
  }, [clubPlayers]);

  // Positional helper
  const getPosGroup = (pos: string): 'POR' | 'DEF' | 'MED' | 'DEL' => {
    const p = pos.toUpperCase();
    if (['POR', 'GK'].includes(p)) return 'POR';
    if (['DF', 'DEF', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'LD', 'LI'].includes(p)) return 'DEF';
    if (['MC', 'MED', 'MID', 'CDM', 'CAM', 'CM', 'LM', 'RM', 'MCD', 'MCO'].includes(p)) return 'MED';
    return 'DEL';
  };

  const getPosBadgeColor = (pos: string) => {
    const group = getPosGroup(pos);
    switch (group) {
      case 'POR':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'DEF':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'MED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'DEL':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  // Filtering & Sorting
  const filteredAndSortedPlayers = useMemo(() => {
    return clubPlayers
      .filter(player => {
        const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
        const group = getPosGroup(player.position);
        const matchesPos = posFilter === 'ALL' || group === posFilter;
        return matchesSearch && matchesPos;
      })
      .sort((a, b) => {
        let valA: any = a[sortField as keyof typeof a];
        let valB: any = b[sortField as keyof typeof b];

        if (sortField === 'gpg') {
          valA = a.matchesPlayed > 0 ? a.goals / a.matchesPlayed : 0;
          valB = b.matchesPlayed > 0 ? b.goals / b.matchesPlayed : 0;
        }

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [clubPlayers, searchTerm, posFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  if (clubPlayers.length === 0) {
    return (
      <div className="fc-card p-12 rounded-3xl border border-slate-200 text-center bg-white shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <BarChart4 className="w-8 h-8" />
        </div>
        <h3 className="font-display font-black text-slate-900 text-lg uppercase italic">Sin estadísticas disponibles</h3>
        <p className="text-xs text-slate-500 font-tech max-w-md mx-auto">
          {currentClub.name} todavía no tiene jugadores registrados con datos de partidos disputados en la liga.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Leaderboard Highlights (Top 3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Scorer Card */}
        {topScorer && (
          <div className="fc-card p-5 rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/20 shadow-lg relative overflow-hidden flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <Trophy className="w-7 h-7 fill-slate-950 stroke-[1.5]" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-tech uppercase font-bold text-amber-800 tracking-wider block">
                ⚽ Máximo Goleador
              </span>
              <h4 className="font-display font-black text-slate-900 text-base truncate">{topScorer.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-display font-black text-emerald-600 text-sm">{topScorer.goals} Goles</span>
                <span className="text-[10px] font-tech text-slate-400">({topScorer.matchesPlayed} PJ)</span>
              </div>
            </div>
          </div>
        )}

        {/* Top Assister Card */}
        {topAssister && (
          <div className="fc-card p-5 rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/20 shadow-lg relative overflow-hidden flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 shrink-0">
              <Flame className="w-7 h-7 fill-white stroke-[1.5]" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-tech uppercase font-bold text-blue-800 tracking-wider block">
                🅰️ Máximo Asistente
              </span>
              <h4 className="font-display font-black text-slate-900 text-base truncate">{topAssister.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-display font-black text-blue-600 text-sm">{topAssister.assists} Asistencias</span>
                <span className="text-[10px] font-tech text-slate-400">({topAssister.matchesPlayed} PJ)</span>
              </div>
            </div>
          </div>
        )}

        {/* Top Appearances Card */}
        {topApp && (
          <div className="fc-card p-5 rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/20 shadow-lg relative overflow-hidden flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 shrink-0">
              <UserCheck className="w-7 h-7 stroke-[2]" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-tech uppercase font-bold text-emerald-800 tracking-wider block">
                👕 Más Partidos
              </span>
              <h4 className="font-display font-black text-slate-900 text-base truncate">{topApp.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-display font-black text-slate-800 text-sm">{topApp.matchesPlayed} Partidos</span>
                <span className="text-[10px] font-tech text-slate-400">({topApp.rating} OVR)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Control Card: Search & Filters */}
      <div className="fc-card p-6 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-display font-extrabold text-xl text-slate-900 uppercase italic flex items-center gap-2">
              <BarChart4 className="w-5 h-5 text-emerald-600" /> Estadísticas Completas del Plantel
            </h2>
            <p className="text-xs text-slate-500 font-tech">
              Tabla acumulada computada directamente desde las actas oficiales de partidos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-tech text-slate-400 uppercase">Plantilla:</span>
            <span className="font-display font-black text-lg text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
              {clubPlayers.length} Jugadores
            </span>
          </div>
        </div>

        {/* Search & Position Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre de jugador..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-tech text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Positional Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {(['ALL', 'POR', 'DEF', 'MED', 'DEL'] as const).map(pos => (
              <button
                key={pos}
                onClick={() => setPosFilter(pos)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-tech font-bold uppercase transition-all ${
                  posFilter === pos
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {pos === 'ALL' ? 'Todos' : pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Data Table */}
      {filteredAndSortedPlayers.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 shadow-xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300 font-tech uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3.5 px-4 font-bold cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Jugador
                      {sortField === 'name' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-emerald-400" /> : <ChevronDown className="w-3 h-3 text-emerald-400" />)}
                    </div>
                  </th>
                  <th className="py-3.5 px-3 font-bold text-center">Pos</th>
                  <th
                    onClick={() => handleSort('rating')}
                    className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      OVR
                      {sortField === 'rating' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-emerald-400" /> : <ChevronDown className="w-3 h-3 text-emerald-400" />)}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('matchesPlayed')}
                    className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      PJ
                      {sortField === 'matchesPlayed' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-emerald-400" /> : <ChevronDown className="w-3 h-3 text-emerald-400" />)}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('goals')}
                    className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1 text-emerald-400">
                      Goles
                      {sortField === 'goals' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('assists')}
                    className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1 text-blue-400">
                      Asist.
                      {sortField === 'assists' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('gpg')}
                    className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1">
                      G/P
                      {sortField === 'gpg' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-emerald-400" /> : <ChevronDown className="w-3 h-3 text-emerald-400" />)}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('yellowCards')}
                    className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1 text-amber-400">
                      TA
                      {sortField === 'yellowCards' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('redCards')}
                    className="py-3.5 px-3 font-bold text-center cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1 text-rose-400">
                      TR
                      {sortField === 'redCards' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-tech">
                {filteredAndSortedPlayers.map(player => {
                  const gpg = player.matchesPlayed > 0 ? (player.goals / player.matchesPlayed).toFixed(2) : '0.00';
                  return (
                    <tr key={player.id} className="hover:bg-slate-50/90 transition-colors group">
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {player.photoUrl ? (
                            <ImageWithFallback
                              src={player.photoUrl}
                              alt={player.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 font-bold text-slate-600 flex items-center justify-center text-xs shrink-0">
                              {player.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-slate-900 text-sm block group-hover:text-emerald-700 transition-colors">
                              {player.name}
                            </span>
                            {player.isStarter && (
                              <span className="text-[9px] font-tech text-emerald-600 font-bold uppercase">Titular 11</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${getPosBadgeColor(player.position)}`}>
                          {player.position}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-800 text-sm whitespace-nowrap">
                        {player.rating || '—'}
                      </td>
                      <td className="p-3.5 text-center font-mono font-bold text-slate-700 whitespace-nowrap">
                        {player.matchesPlayed}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className={`font-display font-black text-sm ${player.goals > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {player.goals}
                        </span>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className={`font-display font-black text-sm ${player.assists > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                          {player.assists}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-mono text-slate-500 whitespace-nowrap">
                        {gpg}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className={`font-mono font-bold ${player.yellowCards > 0 ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200' : 'text-slate-400'}`}>
                          {player.yellowCards}
                        </span>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className={`font-mono font-bold ${player.redCards > 0 ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200' : 'text-slate-400'}`}>
                          {player.redCards}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-lg space-y-3">
          <h4 className="font-display font-bold text-slate-700 text-sm uppercase">Sin resultados</h4>
          <p className="text-xs text-slate-500 font-tech italic">
            No se encontraron jugadores que coincidan con la búsqueda o filtro seleccionado.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setPosFilter('ALL');
            }}
            className="text-xs font-tech font-bold text-emerald-600 hover:text-emerald-700 underline"
          >
            Restablecer filtros
          </button>
        </div>
      )}
    </div>
  );
};

