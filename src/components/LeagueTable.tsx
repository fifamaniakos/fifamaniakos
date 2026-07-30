import React, { useState } from 'react';
import { Club, MatchResult, Player } from '../types';
import { Trophy, Calendar, CheckCircle2, Shield, Eye, Flame, Award, ChevronRight, Image as ImageIcon, Target, Zap, AlertTriangle, Search, Filter, Sparkles, User, Star, Globe } from 'lucide-react';
import { EuropeanCupsHub } from './EuropeanCupsHub';

interface LeagueTableProps {
  clubs: Club[];
  matches: MatchResult[];
  players?: Player[];
}

interface PlayerStatsAggregate {
  id: string;
  name: string;
  position: string;
  rating: number;
  clubName: string;
  clubLogo: string;
  photoUrl: string;
  cardType?: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  disciplinaryPoints: number;
}

export const LeagueTable: React.FC<LeagueTableProps> = ({ clubs, matches, players = [] }) => {
  const [activeTab, setActiveTab] = useState<'tabla' | 'copas' | 'goleadores' | 'asistencias' | 'tarjetas' | 'calendario'>('tabla');
  const [divisionTab, setDivisionTab] = useState<'1ra División' | '2da División' | 'TODAS'>('1ra División');
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [filterMatchday, setFilterMatchday] = useState<number | 'TODAS'>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [clubFilter, setClubFilter] = useState('TODOS');

  // Sort clubs by Points, Goal Difference, Goals For
  const sortedClubs = [...clubs].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffB = b.goalsFor - b.goalsAgainst;
    const diffA = a.goalsFor - a.goalsAgainst;
    if (diffB !== diffA) return diffB - diffA;
    return b.goalsFor - a.goalsFor;
  });

  const filteredClubsByDivision = sortedClubs.filter(c => {
    if (divisionTab === '1ra División') {
      return !c.division || c.division === '1ra División' || c.division === 'Primera División';
    }
    if (divisionTab === '2da División') {
      return c.division === '2da División' || c.division === 'Segunda División';
    }
    return true;
  });

  const filteredMatches = matches.filter(m => filterMatchday === 'TODAS' || m.matchday === filterMatchday);

  // Aggregate stats across players array and match playerEvents
  const playerStatsMap: Record<string, PlayerStatsAggregate> = {};

  // 1. Initialize from existing players array
  players.forEach(p => {
    const club = clubs.find(c => c.id === p.clubId);
    playerStatsMap[p.id] = {
      id: p.id,
      name: p.name,
      position: p.position,
      rating: p.rating,
      clubName: club ? club.name : 'Agente Libre',
      clubLogo: club ? club.logoUrl : '',
      photoUrl: p.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      cardType: p.cardType,
      goals: p.goals || 0,
      assists: p.assists || 0,
      yellowCards: p.yellowCards || 0,
      redCards: p.redCards || 0,
      disciplinaryPoints: (p.yellowCards || 0) * 1 + (p.redCards || 0) * 3
    };
  });

  // 2. Aggregate from confirmed match events if any
  matches.filter(m => m.status === 'CONFIRMADO').forEach(match => {
    if (match.playerEvents && match.playerEvents.length > 0) {
      match.playerEvents.forEach(ev => {
        const key = ev.playerId || `${ev.playerName}-${ev.clubId}`;
        if (!playerStatsMap[key]) {
          const club = clubs.find(c => c.id === ev.clubId);
          playerStatsMap[key] = {
            id: key,
            name: ev.playerName,
            position: 'DC',
            rating: 80,
            clubName: club ? club.name : 'Club',
            clubLogo: club ? club.logoUrl : '',
            photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            disciplinaryPoints: 0
          };
        }

        if (ev.type === 'GOAL') playerStatsMap[key].goals += ev.count;
        if (ev.type === 'ASSIST') playerStatsMap[key].assists += ev.count;
        if (ev.type === 'YELLOW_CARD') playerStatsMap[key].yellowCards += ev.count;
        if (ev.type === 'RED_CARD') playerStatsMap[key].redCards += ev.count;
        playerStatsMap[key].disciplinaryPoints = (playerStatsMap[key].yellowCards * 1) + (playerStatsMap[key].redCards * 3);
      });
    }
  });

  const allPlayerStats = Object.values(playerStatsMap);

  // Filtered stats for tables
  const filteredPlayerStats = allPlayerStats.filter(ps => {
    const matchesSearch = !searchQuery || ps.name.toLowerCase().includes(searchQuery.toLowerCase()) || ps.clubName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClub = clubFilter === 'TODOS' || ps.clubName === clubFilter;
    return matchesSearch && matchesClub;
  });

  // Leaderboard Rankings
  const topScorers = [...filteredPlayerStats]
    .filter(p => p.goals > 0 || players.length > 0)
    .sort((a, b) => b.goals - a.goals || b.rating - a.rating);

  const topAssists = [...filteredPlayerStats]
    .filter(p => p.assists > 0 || players.length > 0)
    .sort((a, b) => b.assists - a.assists || b.rating - a.rating);

  const topCards = [...filteredPlayerStats]
    .filter(p => p.yellowCards > 0 || p.redCards > 0 || players.length > 0)
    .sort((a, b) => b.disciplinaryPoints - a.disciplinaryPoints || b.redCards - a.redCards || b.yellowCards - a.yellowCards);

  return (
    <div className="space-y-6">
      {/* Header Navigation Tabs Bar */}
      <div className="fc-card p-3 rounded-2xl border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('tabla')}
              className={`px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'tabla'
                  ? 'bg-[#00ba68] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Trophy className="w-4 h-4" /> Clasificación Liga
            </button>

            <button
              onClick={() => setActiveTab('copas')}
              className={`px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'copas'
                  ? 'bg-blue-600 text-white shadow-md border border-blue-400'
                  : 'bg-slate-900 text-blue-300 hover:bg-slate-800'
              }`}
            >
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" /> Copas Europeas
            </button>

            <button
              onClick={() => setActiveTab('goleadores')}
              className={`px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'goleadores'
                  ? 'bg-[#00ba68] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Target className="w-4 h-4 text-amber-300" /> Goleadores
            </button>

            <button
              onClick={() => setActiveTab('asistencias')}
              className={`px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'asistencias'
                  ? 'bg-[#00ba68] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-4 h-4 text-cyan-300" /> Asistencias
            </button>

            <button
              onClick={() => setActiveTab('tarjetas')}
              className={`px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'tarjetas'
                  ? 'bg-[#00ba68] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span className="flex items-center gap-0.5">
                <span className="w-2.5 h-3.5 bg-amber-400 rounded-xs inline-block shadow-xs" />
                <span className="w-2.5 h-3.5 bg-rose-600 rounded-xs inline-block shadow-xs" />
              </span>
              Tarjetas
            </button>

            <button
              onClick={() => setActiveTab('calendario')}
              className={`px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'calendario'
                  ? 'bg-[#00ba68] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" /> Partidos ({matches.length})
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Champions League</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Europa League</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS (For Stats Tabs) */}
      {(activeTab === 'goleadores' || activeTab === 'asistencias' || activeTab === 'tarjetas') && (
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
      )}

      {/* COPAS EUROPEAS TAB */}
      {activeTab === 'copas' && (
        <EuropeanCupsHub clubs={clubs} matches={matches} />
      )}

      {/* 1. STANDINGS TABLE TAB */}
      {activeTab === 'tabla' && (
        <div className="space-y-4">
          {/* Division Switcher Sub-Bar */}
          <div className="fc-card p-3 rounded-2xl border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 font-tech">
              <span className="text-xs font-bold uppercase text-slate-500 mr-1">División:</span>
              <button
                onClick={() => setDivisionTab('1ra División')}
                className={`px-3 py-1.5 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1 ${
                  divisionTab === '1ra División'
                    ? 'bg-[#00ba68] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                ⚽ 1ra División
              </button>

              <button
                onClick={() => setDivisionTab('2da División')}
                className={`px-3 py-1.5 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1 ${
                  divisionTab === '2da División'
                    ? 'bg-[#00ba68] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                ⚽ 2da División
              </button>

              <button
                onClick={() => setDivisionTab('TODAS')}
                className={`px-3 py-1.5 rounded-xl font-display font-extrabold text-xs uppercase transition-all ${
                  divisionTab === 'TODAS'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                Todas ({clubs.length})
              </button>
            </div>

            {/* Division Legend */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 flex-wrap">
              {divisionTab === '1ra División' ? (
                <>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Pos 1-8: Octavos Directos</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" /> Pos 9-24: Playoff Dieciseisavos</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500" /> Pos 25-36: Eliminados</span>
                </>
              ) : divisionTab === '2da División' ? (
                <>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Ascenso Directo</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Play-off Ascenso</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="fc-card rounded-2xl overflow-hidden border-slate-200 shadow-md bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-tech font-extrabold text-xs uppercase border-b border-slate-200 tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">Pos</th>
                  <th className="py-3.5 px-4">Club / Manager</th>
                  <th className="py-3.5 px-3 text-center">PJ</th>
                  <th className="py-3.5 px-3 text-center">PG</th>
                  <th className="py-3.5 px-3 text-center">PE</th>
                  <th className="py-3.5 px-3 text-center">PP</th>
                  <th className="py-3.5 px-3 text-center">GF</th>
                  <th className="py-3.5 px-3 text-center">GC</th>
                  <th className="py-3.5 px-3 text-center">DG</th>
                  <th className="py-3.5 px-4 text-center">PTS</th>
                  <th className="py-3.5 px-4 text-center hidden md:table-cell">Racha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-sans">
                {filteredClubsByDivision.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-500 font-tech">
                      No hay clubes registrados en {divisionTab}. Puedes modificar la división de un club en el panel o al registrarlo.
                    </td>
                  </tr>
                ) : (
                  filteredClubsByDivision.map((club, idx) => {
                    const pos = idx + 1;
                    const isFirstDiv = divisionTab === '1ra División' || club.division === '1ra División' || club.division === 'Primera División';
                    
                    const isDirectOctavos = isFirstDiv && pos <= 8;
                    const isPlayoff16 = isFirstDiv && pos >= 9 && pos <= 24;
                    const isEliminated = isFirstDiv && pos >= 25;

                    const isDirectPromotion = !isFirstDiv && pos <= 2;
                    const isPlayoffPromotion = !isFirstDiv && (pos === 3 || pos === 4);

                    return (
                      <tr
                        key={club.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isDirectOctavos || isDirectPromotion ? 'border-l-4 border-l-emerald-500 bg-emerald-50/40' :
                          isPlayoff16 || isPlayoffPromotion ? 'border-l-4 border-l-blue-500 bg-blue-50/30' :
                          isEliminated ? 'border-l-4 border-l-rose-500 bg-rose-50/20' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center font-display font-black text-sm">
                          <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center ${
                            pos === 1 ? 'bg-amber-400 text-black' :
                            pos === 2 ? 'bg-slate-300 text-black' :
                            pos === 3 ? 'bg-amber-700 text-white' : 'text-slate-500'
                          }`}>
                            {pos}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img src={club.logoUrl} alt={club.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                            <div>
                              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                {club.name}
                                <span className="text-[9px] bg-slate-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                                  {club.platform}
                                </span>
                                <span className="text-[9px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">
                                  {club.division || '1ra Div'}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-tech">@{club.manager}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-center font-mono text-slate-700">{club.played}</td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-700">{club.won}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-500">{club.drawn}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-rose-600">{club.lost}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-700">{club.goalsFor}</td>
                        <td className="py-3.5 px-3 text-center font-mono text-slate-500">{club.goalsAgainst}</td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">
                          {(club.goalsFor - club.goalsAgainst) > 0 ? `+${club.goalsFor - club.goalsAgainst}` : club.goalsFor - club.goalsAgainst}
                        </td>

                        <td className="py-3.5 px-4 text-center font-display font-black text-lg text-[#00ba68]">
                          {club.points}
                        </td>

                        <td className="py-3.5 px-4 text-center hidden md:table-cell">
                          <div className="flex items-center justify-center gap-1 font-mono text-[10px] font-bold">
                            {club.form.map((res, i) => (
                              <span
                                key={i}
                                className={`w-4 h-4 rounded flex items-center justify-center ${
                                  res === 'W' ? 'bg-[#00ba68] text-white' :
                                  res === 'D' ? 'bg-amber-400 text-black' : 'bg-rose-500 text-white'
                                }`}
                              >
                                {res}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

          {/* Recent Matches */}
          <div className="fc-card p-6 rounded-2xl border-slate-200 space-y-4 shadow-md bg-white">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900 uppercase italic flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00ba68]" /> Últimos Partidos Registrados
                </h3>
                <p className="text-xs text-slate-500 font-tech">Resultados validados en la competición.</p>
              </div>

              <button
                onClick={() => setActiveTab('calendario')}
                className="text-xs font-tech font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 uppercase"
              >
                Ver Calendario <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {matches.length === 0 ? (
              <p className="text-xs text-slate-500 font-tech text-center py-6">
                No hay resultados cargados todavía. Ve a la pestaña "Reportar Resultados" para ingresar un partido.
              </p>
            ) : (
              <div className="space-y-2.5">
                {matches.slice(0, 5).map(match => {
                  const home = clubs.find(c => c.id === match.homeClubId);
                  const away = clubs.find(c => c.id === match.awayClubId);

                  return (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs font-tech font-bold text-slate-700">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px]">
                          Jornada {match.matchday}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{match.createdAt}</span>
                      </div>

                      <div className="flex items-center justify-center gap-3 flex-1 max-w-sm">
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <span className="font-bold text-xs text-slate-900 truncate">{home?.name || 'Local'}</span>
                          {home && <img src={home.logoUrl} alt={home.name} className="w-6 h-6 rounded object-cover border border-slate-200 shrink-0" />}
                        </div>

                        <div className="px-2.5 py-0.5 bg-slate-900 rounded text-emerald-400 font-display font-black text-sm shrink-0 border border-emerald-500/40">
                          {match.homeGoals} - {match.awayGoals}
                        </div>

                        <div className="flex items-center gap-2 flex-1 justify-start">
                          {away && <img src={away.logoUrl} alt={away.name} className="w-6 h-6 rounded object-cover border border-slate-200 shrink-0" />}
                          <span className="font-bold text-xs text-slate-900 truncate">{away?.name || 'Visitante'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-tech text-emerald-700 font-bold uppercase flex items-center gap-0.5">
                          Ver Acta <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. TABLA DE GOLEADORES (TOP SCORERS) */}
      {activeTab === 'goleadores' && (
        <div className="space-y-6">
          {/* Header Banner - Goleadores */}
          <div className="p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="px-2.5 py-0.5 bg-amber-400 text-black text-[10px] font-black font-tech uppercase rounded tracking-wider inline-block shadow-sm">
                Trofeo Pichichi FC 27
              </span>
              <h2 className="font-display font-black text-2xl uppercase italic tracking-wide flex items-center gap-2 justify-center md:justify-start text-white">
                <Target className="w-6 h-6 text-amber-400" /> Tabla de Goleadores
              </h2>
              <p className="text-xs text-amber-200/90 max-w-md font-sans">
                Máximos anotadores oficiales de la liga. Registra goles en cada partido para subir en el ranking.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/30 shrink-0 shadow-inner">
              <Trophy className="w-10 h-10 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-tech font-bold text-amber-300 block">Líder Goleador</span>
                <span className="font-display font-black text-base text-white block">
                  {topScorers[0] ? topScorers[0].name : 'Sin anotaciones'}
                </span>
                <span className="text-xs text-amber-400 font-bold font-mono">
                  {topScorers[0] ? `${topScorers[0].goals} Goles` : '0 Goles'}
                </span>
              </div>
            </div>
          </div>

          {/* Podium Top 3 */}
          {topScorers.length > 0 && topScorers.some(p => p.goals > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topScorers.slice(0, 3).map((player, idx) => (
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

                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-tech font-bold uppercase text-slate-500 block">
                      {player.clubName}
                    </span>
                    <h4 className="font-display font-extrabold text-sm text-slate-900 truncate uppercase">
                      {player.name}
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded inline-block mt-0.5">
                      {player.position} • {player.rating} OVR
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-display font-black text-2xl text-slate-900 block leading-none">
                      {player.goals}
                    </span>
                    <span className="text-[9px] font-tech uppercase text-slate-600 font-bold">
                      Goles
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full Scorers Table */}
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
                    <th className="py-3 px-4 text-center">Goles Anotados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-sans">
                  {topScorers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500 font-tech">
                        No hay jugadores registrados o aún no se han marcado goles.
                      </td>
                    </tr>
                  ) : (
                    topScorers.map((player, idx) => (
                      <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-center font-display font-black text-xs text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-[#02f59b] font-display font-black text-[10px] flex items-center justify-center border border-slate-700 shrink-0">
                              {player.position}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">{player.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">
                          {player.clubName}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="bg-slate-100 text-slate-800 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                            {player.position}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-amber-700">
                          {player.rating}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-display font-black text-base text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 inline-block min-w-12">
                            ⚽ {player.goals}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. TABLA DE ASISTENCIAS (TOP ASSISTS) */}
      {activeTab === 'asistencias' && (
        <div className="space-y-6">
          {/* Header Banner - Asistencias */}
          <div className="p-6 rounded-2xl border border-teal-500/40 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="px-2.5 py-0.5 bg-teal-400 text-slate-950 text-[10px] font-black font-tech uppercase rounded tracking-wider inline-block shadow-sm">
                Líderes de Pases de Gol
              </span>
              <h2 className="font-display font-black text-2xl uppercase italic tracking-wide flex items-center gap-2 justify-center md:justify-start text-white">
                <Zap className="w-6 h-6 text-teal-400" /> Tabla de Asistencias
              </h2>
              <p className="text-xs text-teal-100 max-w-md font-sans">
                Jugadores con mayor número de pases decisivos de gol en la liga.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-teal-500/30 shrink-0 shadow-inner">
              <Zap className="w-10 h-10 text-teal-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-tech font-bold text-teal-300 block">Líder Asistente</span>
                <span className="font-display font-black text-base text-white block">
                  {topAssists[0] ? topAssists[0].name : 'Sin asistencias'}
                </span>
                <span className="text-xs text-teal-300 font-bold font-mono">
                  {topAssists[0] ? `${topAssists[0].assists} Asistencias` : '0 Asistencias'}
                </span>
              </div>
            </div>
          </div>

          {/* Full Assists Table */}
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
                    <th className="py-3 px-4 text-center">Asistencias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-sans">
                  {topAssists.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500 font-tech">
                        No hay registros de asistencias por el momento.
                      </td>
                    </tr>
                  ) : (
                    topAssists.map((player, idx) => (
                      <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-center font-display font-black text-xs text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-[#02f59b] font-display font-black text-[10px] flex items-center justify-center border border-slate-700 shrink-0">
                              {player.position}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">{player.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">
                          {player.clubName}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="bg-slate-100 text-slate-800 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                            {player.position}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-cyan-800">
                          {player.rating}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-display font-black text-base text-cyan-800 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200 inline-block min-w-12">
                            👟 {player.assists}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TABLA DE TARJETAS (AMARILLAS Y ROJAS / DISCIPLINARIO) */}
      {activeTab === 'tarjetas' && (
        <div className="space-y-6">
          {/* Header Banner - Tarjetas */}
          <div className="p-6 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="px-2.5 py-0.5 bg-rose-500 text-white text-[10px] font-black font-tech uppercase rounded tracking-wider inline-block shadow-sm">
                Control Disciplinario y Fair Play
              </span>
              <h2 className="font-display font-black text-2xl uppercase italic tracking-wide flex items-center gap-2 justify-center md:justify-start text-white">
                <span className="flex items-center gap-1">
                  <span className="w-3.5 h-5 bg-amber-400 rounded-xs inline-block shadow-md" />
                  <span className="w-3.5 h-5 bg-rose-600 rounded-xs inline-block shadow-md" />
                </span>
                Tarjetas Amarillas y Rojas
              </h2>
              <p className="text-xs text-rose-100 max-w-md font-sans">
                Registro de amonestaciones y expulsiones. (3 Amarillas = 1 Partido de Sanción / 1 Roja = Expulsión Directa).
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-xl border border-rose-500/30 shrink-0 shadow-inner">
              <div className="text-center">
                <span className="w-3.5 h-5 bg-amber-400 rounded-xs inline-block shadow-sm" />
                <span className="text-[10px] uppercase font-tech font-bold text-amber-200 block">Total Amarillas</span>
                <span className="font-display font-black text-lg text-amber-300">
                  {allPlayerStats.reduce((acc, p) => acc + p.yellowCards, 0)}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div className="text-center">
                <span className="w-3.5 h-5 bg-rose-600 rounded-xs inline-block shadow-sm" />
                <span className="text-[10px] uppercase font-tech font-bold text-rose-300 block">Total Rojas</span>
                <span className="font-display font-black text-lg text-rose-400">
                  {allPlayerStats.reduce((acc, p) => acc + p.redCards, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Cards Table */}
          <div className="fc-card rounded-2xl overflow-hidden border-slate-200 bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-tech font-extrabold text-xs uppercase border-b border-slate-200 tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Jugador</th>
                    <th className="py-3 px-4">Club</th>
                    <th className="py-3 px-3 text-center">Amarillas (🟨)</th>
                    <th className="py-3 px-3 text-center">Rojas (🟥)</th>
                    <th className="py-3 px-4 text-center">Puntos Disciplina</th>
                    <th className="py-3 px-4 text-center">Estado / Sanción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-sans">
                  {topCards.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500 font-tech">
                        No hay tarjetas acumuladas en el sistema.
                      </td>
                    </tr>
                  ) : (
                    topCards.map((player, idx) => {
                      const isSuspended = player.redCards > 0 || player.yellowCards >= 3;
                      const yellowWarning = player.yellowCards === 2;

                      return (
                        <tr key={player.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 text-center font-display font-black text-xs text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-slate-900 text-[#02f59b] font-display font-black text-[10px] flex items-center justify-center border border-slate-700 shrink-0">
                                {player.position}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 text-sm block">{player.name}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-700">
                            {player.clubName}
                          </td>
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
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                            {player.disciplinaryPoints} pts
                          </td>
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
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. RESULTADOS Y JORNADAS TAB */}
      {activeTab === 'calendario' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold uppercase font-tech text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" /> Filtrar Calendario por Jornada
            </span>
            <select
              value={filterMatchday}
              onChange={(e) => setFilterMatchday(e.target.value === 'TODAS' ? 'TODAS' : Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#00ba68]"
            >
              <option value="TODAS">Todas las Jornadas ({matches.length})</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(j => (
                <option key={j} value={j}>Jornada {j}</option>
              ))}
            </select>
          </div>

          {filteredMatches.length === 0 ? (
            <div className="fc-card p-10 text-center space-y-3 border-dashed border-slate-300 bg-white">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs font-tech font-bold text-slate-600">
                {matches.length === 0
                  ? 'Aún no se han cargado resultados en esta temporada.'
                  : 'No se encontraron partidos reportados para esta jornada.'}
              </p>
            </div>
          ) : (
            filteredMatches.map(match => {
              const home = clubs.find(c => c.id === match.homeClubId);
              const away = clubs.find(c => c.id === match.awayClubId);

              return (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="fc-card fc-card-hover p-4 rounded-2xl cursor-pointer border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-xs font-tech font-bold text-emerald-800 uppercase">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-300">
                      Jornada {match.matchday}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{match.createdAt}</span>
                  </div>

                  {/* Scoreboard */}
                  <div className="flex items-center justify-center gap-6 flex-1 max-w-lg w-full">
                    {/* Home */}
                    <div className="flex items-center gap-3 text-right flex-1 justify-end">
                      <span className="font-display font-extrabold text-sm text-slate-900">{home?.name || 'Local'}</span>
                      {home && <img src={home.logoUrl} alt={home.name} className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0" />}
                    </div>

                    {/* Result Score */}
                    <div className="px-4 py-1.5 bg-slate-900 rounded-lg border border-emerald-500 font-display font-black text-xl text-[#02f59b] tracking-wider shrink-0 flex items-center gap-2 shadow-sm">
                      <span>{match.homeGoals}</span>
                      <span className="text-slate-500 text-sm">-</span>
                      <span>{match.awayGoals}</span>
                    </div>

                    {/* Away */}
                    <div className="flex items-center gap-3 text-left flex-1 justify-start">
                      {away && <img src={away.logoUrl} alt={away.name} className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0" />}
                      <span className="font-display font-extrabold text-sm text-slate-900">{away?.name || 'Visitante'}</span>
                    </div>
                  </div>

                  {/* Proof badge & View detail */}
                  <div className="flex items-center gap-3 text-xs font-mono">
                    {match.proofImageUrl && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md flex items-center gap-1 text-[10px] font-tech font-bold">
                        <ImageIcon className="w-3 h-3 text-emerald-700" /> Captura Validada
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Match Proof Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fc-card max-w-lg w-full p-6 rounded-2xl border-emerald-300 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="font-display font-bold text-lg text-slate-900 uppercase italic flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00ba68]" /> Acta de Partido Jornada {selectedMatch.matchday}
              </h2>
              <button onClick={() => setSelectedMatch(null)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>

            <div className="text-center space-y-2 py-2">
              <div className="font-display font-black text-3xl text-slate-900">
                {selectedMatch.homeGoals} - {selectedMatch.awayGoals}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {selectedMatch.createdAt}
              </div>
            </div>

            <div className="space-y-2 text-xs font-sans bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <p><strong className="text-emerald-700">Goleadores Local:</strong> {selectedMatch.homeScorers}</p>
              <p><strong className="text-emerald-700">Goleadores Visitante:</strong> {selectedMatch.awayScorers}</p>
              {selectedMatch.homeAssists && <p><strong className="text-cyan-700">Asistencias Local:</strong> {selectedMatch.homeAssists}</p>}
              {selectedMatch.awayAssists && <p><strong className="text-cyan-700">Asistencias Visitante:</strong> {selectedMatch.awayAssists}</p>}
              {selectedMatch.homeYellowCards && <p><strong className="text-amber-700">T. Amarillas Local:</strong> {selectedMatch.homeYellowCards}</p>}
              {selectedMatch.awayYellowCards && <p><strong className="text-amber-700">T. Amarillas Visitante:</strong> {selectedMatch.awayYellowCards}</p>}
              {selectedMatch.homeRedCards && <p><strong className="text-rose-700">T. Rojas Local:</strong> {selectedMatch.homeRedCards}</p>}
              {selectedMatch.awayRedCards && <p><strong className="text-rose-700">T. Rojas Visitante:</strong> {selectedMatch.awayRedCards}</p>}
              {selectedMatch.notes && <p className="text-slate-600 italic mt-2 border-t pt-2">"{selectedMatch.notes}"</p>}
            </div>

            {selectedMatch.proofImageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                <img src={selectedMatch.proofImageUrl} alt="Prueba de Partido FC 27" className="w-full object-cover max-h-72" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
