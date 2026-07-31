import React, { useState, useMemo } from 'react';
import { SOFIFA_PLAYERS_DATABASE, SoFifaPlayerPreset } from '../data/sofifaPlayersDatabase';
import { Search, Filter, Shield, User, Sparkles, Award, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Club, Player } from '../types';

interface SofifaPlayersExplorerProps {
  currentClub?: Club | null;
  onSignPlayer?: (playerPreset: SoFifaPlayerPreset) => void;
  signedPlayers?: Player[];
}

export const SofifaPlayersExplorer: React.FC<SofifaPlayersExplorerProps> = ({
  currentClub,
  onSignPlayer,
  signedPlayers = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedNation, setSelectedNation] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'rating' | 'value' | 'name' | 'age'>('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 36;

  // Extraer listas para los selectores
  const leaguesList = useMemo(() => {
    const set = new Set<string>();
    SOFIFA_PLAYERS_DATABASE.forEach(p => { if (p.league) set.add(p.league); });
    return Array.from(set).sort();
  }, []);

  const nationsList = useMemo(() => {
    const set = new Set<string>();
    SOFIFA_PLAYERS_DATABASE.forEach(p => { if (p.nationality) set.add(p.nationality); });
    return Array.from(set).sort();
  }, []);

  // Filtrado y ordenado optimizado
  const filteredPlayers = useMemo(() => {
    return SOFIFA_PLAYERS_DATABASE.filter(player => {
      const matchSearch = !searchTerm || 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (player.clubName && player.clubName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchPos = !selectedPosition || player.position === selectedPosition;
      const matchLeague = !selectedLeague || player.league === selectedLeague;
      const matchNation = !selectedNation || player.nationality === selectedNation;
      const matchRating = player.rating >= minRating;

      return matchSearch && matchPos && matchLeague && matchNation && matchRating;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'age') return (a.age || 0) - (b.age || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchTerm, selectedPosition, selectedLeague, selectedNation, minRating, sortBy]);

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage) || 1;
  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPlayers.slice(start, start + itemsPerPage);
  }, [filteredPlayers, currentPage]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  };

  // Build a lookup map from signed players (live state) by lowercase name
  // so we can show the manager-set clause (releaseClause)
  const signedPlayerClauseMap = useMemo(() => {
    const map = new Map<string, number>();
    signedPlayers.forEach(p => {
      if (p.name && p.releaseClause && p.releaseClause > 0) {
        map.set(p.name.toLowerCase(), p.releaseClause);
      }
    });
    return map;
  }, [signedPlayers]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="fc-card p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-slate-800 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-[#02f59b] flex items-center justify-center shrink-0 shadow-inner">
              <Zap className="w-8 h-8 text-[#02f59b] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#02f59b]/20 border border-[#02f59b]/40 text-[#02f59b] text-[10px] font-mono font-bold uppercase tracking-wider">
                  Base de Datos Oficial EA FC 27
                </span>
              </div>
              <h2 className="font-display font-black text-2xl md:text-3xl text-white uppercase italic tracking-wide mt-1">
                Base de Datos de Jugadores ({SOFIFA_PLAYERS_DATABASE.length.toLocaleString('es-ES')})
              </h2>
              <p className="text-xs text-slate-300 font-tech mt-0.5">
                Explora las estadísticas oficiales, medias y posiciones de los jugadores
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel: Buscador & Filtros */}
      <div className="fc-card p-5 rounded-2xl bg-white border-slate-200 shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por nombre de jugador o club..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00ba68] focus:bg-white transition"
            />
          </div>

          {/* Posición Filter */}
          <div>
            <select
              value={selectedPosition}
              onChange={(e) => { setSelectedPosition(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00ba68] transition"
            >
              <option value="">⚽ Todas las Posiciones</option>
              <option value="POR">🧤 Arquero (POR)</option>
              <option value="DFC">🛡️ Defensor Central (DFC)</option>
              <option value="LI">🏃 Lateral Izquierdo (LI)</option>
              <option value="LD">🏃 Lateral Derecho (LD)</option>
              <option value="MCD">🔒 Mediocentro Defensivo (MCD)</option>
              <option value="MC">⚙️ Mediocentro (MC)</option>
              <option value="MCO">🎨 Mediocentro Ofensivo (MCO)</option>
              <option value="ED">🔥 Extremo Derecho (ED)</option>
              <option value="EI">🔥 Extremo Izquierdo (EI)</option>
              <option value="DC">🎯 Delantero Centro (DC)</option>
            </select>
          </div>

          {/* Ordenar Por */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00ba68] transition"
            >
              <option value="rating">🌟 Mayor Rating (Overall)</option>
              <option value="age">👶 Más Joven</option>
              <option value="name">🔤 Orden Alfabético</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] text-slate-500 font-tech font-bold uppercase mb-1">Liga Oficial</label>
            <select
              value={selectedLeague}
              onChange={(e) => { setSelectedLeague(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#00ba68]"
            >
              <option value="">🏆 Todas las Ligas ({leaguesList.length})</option>
              {leaguesList.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-tech font-bold uppercase mb-1">Nacionalidad</label>
            <select
              value={selectedNation}
              onChange={(e) => { setSelectedNation(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#00ba68]"
            >
              <option value="">🌍 Todos los Países ({nationsList.length})</option>
              {nationsList.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-tech font-bold uppercase mb-1">
              Rating Mínimo: <span className="text-emerald-700 font-bold">{minRating} OVR</span>
            </label>
            <input
              type="range"
              min="50"
              max="95"
              value={minRating}
              onChange={(e) => { setMinRating(Number(e.target.value)); setCurrentPage(1); }}
              className="w-full accent-[#00ba68]"
            />
          </div>
        </div>
      </div>

      {/* Counter & Pagination Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-tech text-slate-600 px-1">
        <span>
          Mostrando <strong>{paginatedPlayers.length}</strong> de <strong>{filteredPlayers.length.toLocaleString('es-ES')}</strong> jugadores encontrados
        </span>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-900">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Players List (Table Row View) */}
      <div className="fc-card rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-tech uppercase text-[11px] tracking-wider border-b border-slate-800">
                <th className="py-3 px-4 font-bold">OVR</th>
                <th className="py-3 px-4 font-bold">Jugador</th>
                <th className="py-3 px-4 font-bold">Posición</th>
                <th className="py-3 px-4 font-bold">Club Oficial</th>
                <th className="py-3 px-4 font-bold">Liga / País</th>
                <th className="py-3 px-4 font-bold text-center">Stats (PAC | SHO | PAS | DRI | DEF | PHY)</th>
                <th className="py-3 px-4 font-bold text-right">Valor Mercado</th>
                <th className="py-3 px-4 font-bold text-right">Cláusula</th>
                {onSignPlayer && <th className="py-3 px-4 font-bold text-center">Acción</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800 font-medium">
              {paginatedPlayers.map((player, idx) => {
                const isSpecial = player.rating >= 85;
                const isGold = player.rating >= 75;

                return (
                  <tr 
                    key={player.id} 
                    className={`hover:bg-emerald-50/60 transition ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    {/* OVR Rating Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded font-display font-black text-sm italic inline-block text-center min-w-[42px] ${
                        isSpecial 
                          ? 'bg-[#00ba68] text-white shadow-xs' 
                          : isGold 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-slate-200 text-slate-800'
                      }`}>
                        {player.rating}
                      </span>
                    </td>

                    {/* Jugador (Foto + Nombre + Edad) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{player.name}</h4>
                          <span className="text-[10px] text-slate-500 font-tech block">
                            {player.age} años • {player.preferredFoot || 'Pie Der.'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Posición */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-mono font-bold text-[11px] rounded border border-slate-300">
                        {player.position}
                      </span>
                    </td>

                    {/* Club */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 text-xs">
                        ⚽ {player.clubName || 'Agente Libre'}
                      </span>
                    </td>

                    {/* Liga / Nacionalidad */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="block text-slate-700 text-xs">{player.league || 'Liga EA FC'}</span>
                      <span className="text-[10px] text-slate-500 font-tech block">🚩 {player.nationality}</span>
                    </td>

                    {/* Stats Compactas */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 text-slate-700">
                        <span title="Pace"><strong className="text-emerald-700">{player.stats.pace}</strong> PAC</span> •
                        <span title="Shooting"><strong className="text-emerald-700">{player.stats.shooting}</strong> SHO</span> •
                        <span title="Passing"><strong className="text-emerald-700">{player.stats.passing}</strong> PAS</span> •
                        <span title="Dribbling"><strong className="text-emerald-700">{player.stats.dribbling}</strong> DRI</span> •
                        <span title="Defending"><strong className="text-emerald-700">{player.stats.defending}</strong> DEF</span> •
                        <span title="Physical"><strong className="text-emerald-700">{player.stats.physical}</strong> PHY</span>
                      </div>
                    </td>

                    {/* Valor de Mercado (SOFIFA) */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <span className="font-mono text-xs text-slate-500 font-semibold">
                        {formatMoney(player.value)}
                      </span>
                    </td>

                    {/* Cláusula de Rescisión (Establecida por Manager) */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      {(() => {
                        const managerClause = signedPlayerClauseMap.get(player.name.toLowerCase());
                        return managerClause ? (
                          <span className="font-mono font-bold text-xs text-[#00ba68]">
                            {formatMoney(managerClause)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                            Sin Cláusula
                          </span>
                        );
                      })()}
                    </td>

                    {/* Acción de Fichaje */}
                    {onSignPlayer && (
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => onSignPlayer(player)}
                          className="fc-button-primary px-3 py-1.5 text-[11px] font-extrabold uppercase rounded shadow-xs hover:scale-105 transition"
                        >
                          Fichar
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      {/* Bottom Pagination */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <span className="text-xs text-slate-500 font-tech">
          Página {currentPage} de {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
