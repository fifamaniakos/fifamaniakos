import React, { useState } from 'react';
import { UserPlus, Search, Shield, Monitor, MapPin, Users, DollarSign, ExternalLink, Trophy, Filter, LayoutGrid, List, Trash2, Edit, CheckCircle } from 'lucide-react';
import { Club, Player } from '../types';
import { FC27_STANDARD_LOGO } from '../data/initialData';

interface InscripcionesModuleProps {
  clubs: Club[];
  players: Player[];
  onOpenRegister: () => void;
  onSelectClub: (clubId: string) => void;
  setActiveTab: (tab: string) => void;
  isAdmin?: boolean;
  onDeleteClub?: (clubId: string) => void;
}

export const InscripcionesModule: React.FC<InscripcionesModuleProps> = ({
  clubs,
  players,
  onOpenRegister,
  onSelectClub,
  setActiveTab,
  isAdmin = false,
  onDeleteClub
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'TODAS' | 'PS5' | 'Xbox Series X' | 'PC'>('TODAS');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [clubToDelete, setClubToDelete] = useState<Club | null>(null);

  // Filtered Clubs
  const filteredClubs = clubs.filter(club => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.gamertag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.shortName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = platformFilter === 'TODAS' || club.platform === platformFilter;

    return matchesSearch && matchesPlatform;
  });

  const getSquadCount = (clubId: string) => {
    return players.filter(p => p.clubId === clubId).length;
  };

  return (
    <div className="space-[#12] space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-emerald-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#00ba68] text-white text-[10px] font-tech font-extrabold uppercase rounded tracking-wider flex items-center gap-1 shadow-sm">
                <CheckCircle className="w-3.5 h-3.5" /> REGISTRO OFICIAL FC 27
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-900/80 text-emerald-300 text-[10px] font-mono rounded border border-emerald-700 font-bold">
                {clubs.length} Clubes Registrados
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase italic tracking-wider text-white">
              INSCRIPCIONES <span className="text-[#02f59b]">FIFAMANIAKOS</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-tech max-w-2xl leading-relaxed">
              Directorio oficial de clubes inscriptos y Directores Técnicos (DT) para la Temporada FC 27. Consulta participantes, plataformas, gamertags y presupuestos iniciales.
            </p>
          </div>

          <button
            onClick={onOpenRegister}
            className="fc-button-primary px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-transform shrink-0"
          >
            <UserPlus className="w-5 h-5 text-white" />
            Inscribir Mi Club
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-800/60 text-xs font-tech">
          <div className="bg-slate-900/60 border border-emerald-800/50 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-emerald-900/60 text-[#02f59b] rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Estructura 1ra Div</div>
              <div className="font-extrabold text-base text-white">
                {clubs.filter(c => !c.manager.toLowerCase().includes('vacante') && !c.manager.toLowerCase().includes('por inscribir')).length} / 36 Registrados
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-emerald-800/50 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-emerald-900/60 text-[#02f59b] rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Slots Vacantes</div>
              <div className="font-extrabold text-base text-amber-300">
                {clubs.filter(c => c.manager.toLowerCase().includes('vacante') || c.manager.toLowerCase().includes('por inscribir')).length} Disponibles
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-emerald-800/50 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-emerald-900/60 text-[#02f59b] rounded-lg">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Crossplay FC 27</div>
              <div className="font-extrabold text-base text-white">PS5 • Xbox • PC</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-emerald-800/50 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-emerald-900/60 text-[#02f59b] rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase">Presupuesto Inicial</div>
              <div className="font-extrabold text-base text-white">€100M Mínimo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & View Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por Club, DT, Gamertag EA ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-tech text-slate-800 focus:outline-none focus:border-[#00ba68]"
          />
        </div>

        {/* Platform Filter Buttons & View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-tech">
            {(['TODAS', 'PS5', 'Xbox Series X', 'PC'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-1.5 rounded-md font-bold uppercase transition-all ${
                  platformFilter === p
                    ? 'bg-[#00ba68] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              title="Vista en Tarjetas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              title="Vista en Tabla"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredClubs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 bg-emerald-50 text-[#00ba68] rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-black text-xl text-slate-900 uppercase">
              {searchQuery ? 'No se encontraron clubes' : '¡Aún no hay clubes inscriptos!'}
            </h3>
            <p className="text-xs text-slate-500 font-tech">
              {searchQuery
                ? 'Intenta cambiar el término de búsqueda o limpia los filtros.'
                : 'Sé el primer Director Técnico en inscribir tu club para disputar la temporada en FIFAMANIAKOS.'}
            </p>
          </div>
          <button
            onClick={onOpenRegister}
            className="fc-button-primary px-6 py-2.5 text-xs font-bold uppercase inline-flex items-center gap-2 shadow-md"
          >
            <UserPlus className="w-4 h-4" /> Inscribir Club Ahora
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredClubs.map(club => {
            const squadCount = getSquadCount(club.id);

            return (
              <div
                key={club.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col justify-between"
              >
                {/* Card Top Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-4 text-white relative">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-emerald-900/80 text-[#02f59b] font-mono text-[9px] font-bold rounded border border-emerald-700/60 uppercase">
                      {club.division || 'Primera División'}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800/90 text-slate-200 font-tech text-[10px] font-bold rounded border border-slate-700 flex items-center gap-1">
                      <Monitor className="w-3 h-3 text-[#02f59b]" />
                      {club.platform}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mt-3">
                    <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md border-2 border-[#00ba68] shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                      <img
                        src={club.logoUrl || FC27_STANDARD_LOGO}
                        alt={club.name}
                        className="w-full h-full object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FC27_STANDARD_LOGO;
                        }}
                      />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-display font-black text-lg text-white uppercase italic tracking-wide truncate">
                        {club.name}
                      </h3>
                      <p className="text-[11px] text-emerald-300 font-tech font-bold -mt-0.5 flex items-center gap-1">
                        TAG: <span className="text-white font-mono">{club.shortName}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-4 space-y-3 font-tech text-xs bg-slate-50/50 flex-1">
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
                    <div className="flex justify-between items-center text-slate-500 text-[11px]">
                      <span>Director Técnico (DT):</span>
                      <strong className="text-slate-900 font-bold uppercase">{club.manager}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 text-[11px]">
                      <span>EA ID / Gamertag:</span>
                      <strong className="text-emerald-700 font-mono font-bold">{club.gamertag}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 text-[11px]">
                      <span>Estadio:</span>
                      <span className="text-slate-700 truncate max-w-[140px] font-medium">{club.stadium || 'Estadio Municipal'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl">
                      <div className="text-[10px] text-emerald-800 uppercase font-bold">Presupuesto</div>
                      <div className="font-extrabold text-emerald-900 text-sm">
                        €{(club.budget / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div className="bg-slate-100 border border-slate-200 p-2 rounded-xl">
                      <div className="text-[10px] text-slate-600 uppercase font-bold">Plantilla</div>
                      <div className="font-extrabold text-slate-900 text-sm">
                        {squadCount} Jugadores
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onSelectClub(club.id);
                      setActiveTab('plantilla');
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-[#00ba68] text-white text-xs font-tech font-extrabold uppercase rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Ver Plantilla
                  </button>

                  {isAdmin && onDeleteClub && (
                    <button
                      onClick={() => setClubToDelete(club)}
                      className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-colors border border-rose-200"
                      title="Eliminar Inscripción"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-tech text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-200 uppercase font-display text-[11px] tracking-wider border-b border-slate-800">
                  <th className="p-3.5 pl-5">Club</th>
                  <th className="p-3.5">Director Técnico</th>
                  <th className="p-3.5">EA ID / Gamertag</th>
                  <th className="p-3.5">Plataforma</th>
                  <th className="p-3.5">Presupuesto</th>
                  <th className="p-3.5">Plantilla</th>
                  <th className="p-3.5 text-right pr-5">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filteredClubs.map(club => {
                  const squadCount = getSquadCount(club.id);

                  return (
                    <tr key={club.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 pl-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={club.logoUrl || FC27_STANDARD_LOGO}
                            alt={club.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-300 shadow-sm shrink-0"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = FC27_STANDARD_LOGO;
                            }}
                          />
                          <div>
                            <div className="font-display font-bold uppercase text-slate-900 text-sm">
                              {club.name} <span className="text-xs font-mono text-emerald-600 font-bold">[{club.shortName}]</span>
                            </div>
                            <div className="text-[10px] text-slate-500">{club.stadium || 'Estadio Municipal'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-slate-900 uppercase">
                        {club.manager}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-700">
                        {club.gamertag}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded text-[10px] border border-slate-300">
                          {club.platform}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-800">
                        €{(club.budget / 1000000).toFixed(1)}M
                      </td>
                      <td className="p-3 font-bold text-slate-700">
                        {squadCount} Jugadores
                      </td>
                      <td className="p-3 pr-5 text-right space-x-2">
                        <button
                          onClick={() => {
                            onSelectClub(club.id);
                            setActiveTab('plantilla');
                          }}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-[#00ba68] text-white text-[11px] font-bold uppercase rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Ver Club
                        </button>

                        {isAdmin && onDeleteClub && (
                          <button
                            onClick={() => setClubToDelete(club)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Eliminar Inscripción"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {clubToDelete && (
        <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-rose-300 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900 uppercase">¿Eliminar Inscripción?</h3>
                <p className="text-xs text-slate-500 font-tech">Esta acción retirará permanentemente al club de la liga.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-800 font-tech">"{clubToDelete.name}"</p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                DT: {clubToDelete.manager} • {clubToDelete.platform} • EA ID: {clubToDelete.gamertag}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setClubToDelete(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-xl hover:bg-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteClub) {
                    onDeleteClub(clubToDelete.id);
                  }
                  setClubToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-tech font-extrabold uppercase rounded-xl shadow-md transition-colors"
              >
                Sí, Eliminar Inscripción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
