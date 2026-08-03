import React, { useState, useMemo } from 'react';
import { SOFIFA_PLAYERS_DATABASE, SoFifaPlayerPreset } from '../data/sofifaPlayersDatabase';
import { Search, Filter, Shield, User, Sparkles, Award, ChevronLeft, ChevronRight, Zap, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { Club, Player } from '../types';

interface SofifaPlayersExplorerProps {
  currentClub?: Club | null;
  onSignPlayer?: (playerPreset: SoFifaPlayerPreset) => void;
  signedPlayers?: Player[];
  // Cuando se usa embebido dentro de otra pantalla que ya tiene su propio
  // banner (ej: Mercado de Fichajes), se oculta el banner propio para no
  // mostrar dos carteles apilados diciendo básicamente lo mismo.
  compact?: boolean;
}

export const SofifaPlayersExplorer: React.FC<SofifaPlayersExplorerProps> = ({
  currentClub,
  onSignPlayer,
  signedPlayers = [],
  compact = false
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

  const normalizeName = (s: string) =>
    s ? s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() : '';

  // Build a lookup map from signed players (live state) by normalized name
  // Checks releaseClause set explicitly by manager
  const signedPlayerClauseMap = useMemo(() => {
    const map = new Map<string, number>();
    signedPlayers.forEach(p => {
      const norm = normalizeName(p.name);
      if (norm && p.releaseClause && p.releaseClause > 0) {
        map.set(norm, p.releaseClause);
      }
    });
    return map;
  }, [signedPlayers]);

  // Un jugador ya fichado en esta liga puede tener su Valor de Mercado
  // editado a mano desde Mi Club -- sin este mapa, la columna "Valor
  // Mercado" siempre mostraba el dato estatico de la base SOFIFA, ignorando
  // el valor real que el manager le puso al jugador que ya tiene en su
  // plantilla.
  const signedPlayerValueMap = useMemo(() => {
    const map = new Map<string, number>();
    signedPlayers.forEach(p => {
      const norm = normalizeName(p.name);
      if (norm && p.value && p.value > 0) {
        map.set(norm, p.value);
      }
    });
    return map;
  }, [signedPlayers]);

  // Set de jugadores ya fichados en algun club de la liga, para no ofrecer
  // "Fichar" de nuevo sobre alguien que ya esta en una plantilla real (eso
  // creaba un jugador duplicado y descontaba presupuesto otra vez).
  const signedPlayerNames = useMemo(() => {
    const set = new Set<string>();
    signedPlayers.forEach(p => {
      const norm = normalizeName(p.name);
      if (norm) set.add(norm);
    });
    return set;
  }, [signedPlayers]);

  return (
    <div className="space-y-6">
      {/* Header Banner (se oculta en modo compact, cuando ya hay un banner arriba) */}
      {!compact && (
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
      )}

      {/* Control Panel: Buscador & Filtros Tácticos eSports */}
      <div className="fc-card p-5 md:p-6 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl space-y-5 relative overflow-hidden">
        {/* Cabecera del Panel de Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#02f59b]" />
            <h3 className="font-display font-black text-sm text-white uppercase italic tracking-wider">
              Panel de Filtros & Búsqueda Táctica
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-tech text-slate-400">
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-[11px] font-mono text-[#02f59b]">
              {filteredPlayers.length.toLocaleString('es-ES')} resultados
            </span>

            {(searchTerm || selectedPosition || selectedLeague || selectedNation || minRating > 50) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPosition('');
                  setSelectedLeague('');
                  setSelectedNation('');
                  setMinRating(50);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-[10px] font-bold uppercase transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Restablecer
              </button>
            )}
          </div>
        </div>

        {/* Fila Principal: Buscador + Posición + Ordenar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Buscador de Nombre/Club */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-[#02f59b] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Buscar por nombre de jugador o club..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#02f59b] focus:ring-1 focus:ring-[#02f59b] transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Posición Filter */}
          <div>
            <select
              value={selectedPosition}
              onChange={(e) => { setSelectedPosition(e.target.value); setCurrentPage(1); }}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#02f59b] transition cursor-pointer"
            >
              <option value="" className="bg-slate-950 text-white">⚽ Todas las Posiciones</option>
              <option value="POR" className="bg-slate-950 text-white">🧤 Arquero (POR)</option>
              <option value="DFC" className="bg-slate-950 text-white">🛡️ Defensor Central (DFC)</option>
              <option value="LI" className="bg-slate-950 text-white">🏃 Lateral Izquierdo (LI)</option>
              <option value="LD" className="bg-slate-950 text-white">🏃 Lateral Derecho (LD)</option>
              <option value="MCD" className="bg-slate-950 text-white">🔒 Mediocentro Defensivo (MCD)</option>
              <option value="MC" className="bg-slate-950 text-white">⚙️ Mediocentro (MC)</option>
              <option value="MCO" className="bg-slate-950 text-white">🎨 Mediocentro Ofensivo (MCO)</option>
              <option value="ED" className="bg-slate-950 text-white">🔥 Extremo Derecho (ED)</option>
              <option value="EI" className="bg-slate-950 text-white">🔥 Extremo Izquierdo (EI)</option>
              <option value="DC" className="bg-slate-950 text-white">🎯 Delantero Centro (DC)</option>
            </select>
          </div>

          {/* Ordenar Por */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#02f59b] transition cursor-pointer"
            >
              <option value="rating" className="bg-slate-950 text-white">🌟 Mayor Rating (Overall)</option>
              <option value="age" className="bg-slate-950 text-white">👶 Más Joven</option>
              <option value="name" className="bg-slate-950 text-white">🔤 Orden Alfabético</option>
            </select>
          </div>
        </div>

        {/* Fila Secundaria: Liga + País + Slider de Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80">
          <div>
            <label className="block text-[10px] text-slate-400 font-tech font-extrabold uppercase tracking-wider mb-1">Liga Oficial</label>
            <select
              value={selectedLeague}
              onChange={(e) => { setSelectedLeague(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#02f59b] transition cursor-pointer"
            >
              <option value="" className="bg-slate-950 text-white">🏆 Todas las Ligas ({leaguesList.length})</option>
              {leaguesList.map(l => <option key={l} value={l} className="bg-slate-950 text-white">{l}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 font-tech font-extrabold uppercase tracking-wider mb-1">Nacionalidad</label>
            <select
              value={selectedNation}
              onChange={(e) => { setSelectedNation(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#02f59b] transition cursor-pointer"
            >
              <option value="" className="bg-slate-950 text-white">🌍 Todos los Países ({nationsList.length})</option>
              {nationsList.map(n => <option key={n} value={n} className="bg-slate-950 text-white">{n}</option>)}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] text-slate-400 font-tech font-extrabold uppercase tracking-wider">Rating Mínimo</label>
              <span className="text-xs font-mono font-black text-[#02f59b] bg-[#02f59b]/10 border border-[#02f59b]/30 px-2 py-0.5 rounded">
                {minRating > 50 ? `${minRating}+ OVR` : 'TODAS LAS MEDIAS'}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={minRating}
              onChange={(e) => { setMinRating(Number(e.target.value)); setCurrentPage(1); }}
              className="w-full accent-[#02f59b] h-2 bg-slate-800 rounded-lg cursor-pointer transition-all"
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

                    {/* Valor de Mercado (SOFIFA, o el valor editado por el manager si ya esta fichado) */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <span className="font-mono text-xs text-slate-500 font-semibold">
                        {formatMoney(signedPlayerValueMap.get(normalizeName(player.name)) ?? player.value)}
                      </span>
                    </td>

                    {/* Cláusula de Rescisión (Establecida por Manager) */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      {(() => {
                        const managerClause = signedPlayerClauseMap.get(normalizeName(player.name));
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
                        {signedPlayerNames.has(normalizeName(player.name)) ? (
                          <span
                            className="inline-block px-3 py-1.5 text-[10px] font-extrabold uppercase rounded bg-slate-200 text-slate-600 border border-slate-300"
                            title="Este jugador ya está en la plantilla de un club de la liga"
                          >
                            Ya Fichado
                          </span>
                        ) : (
                          <button
                            onClick={() => onSignPlayer(player)}
                            className="fc-button-primary px-3 py-1.5 text-[11px] font-extrabold uppercase rounded shadow-xs hover:scale-105 transition"
                          >
                            Fichar
                          </button>
                        )}
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
