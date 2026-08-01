import React, { useState } from 'react';
import { ClubLogo } from '../ClubLogo';
import { Player, Club, PlayerPosition, FinancialTransaction, TransferItem, MatchResult } from '../../types';
import { Shield, UserPlus, Sparkles, X, PlayCircle, BarChart3, Users2, Landmark, CalendarDays, BarChart4, Wallet, FileText } from 'lucide-react';
import { SOFIFA_PLAYERS } from '../../data/sofifaData';
import { RecentGamesTab } from './RecentGamesTab';
import { TeamStatsTab } from './TeamStatsTab';
import { LineupTab } from './LineupTab';
import { StadiumTab } from './StadiumTab';
import { ScheduleStandingsTab } from './ScheduleStandingsTab';
import { FullStatsTab } from './FullStatsTab';
import { FinancesTab } from './FinancesTab';
import { TransactionsHistoryTab } from './TransactionsHistoryTab';

interface MiClubHubProps {
  currentClub: Club | null;
  clubs: Club[];
  matches: MatchResult[];
  players: Player[];
  transactions?: FinancialTransaction[];
  transfers?: TransferItem[];
  onAddPlayer: (player: Player) => void;
  onRemovePlayer: (playerId: string) => void;
  onToggleStarter: (playerId: string) => void;
  onUpdatePlayerValue?: (playerId: string, newValue: number) => void;
  onSetTransferPrice?: (player: Player, price: number) => void;
  onRemoveFromMarket?: (playerId: string) => void;
}

type MiClubTab = 'recientes' | 'stats-equipo' | 'alineaciones' | 'estadio' | 'calendario' | 'stats-completas' | 'financiero' | 'transacciones';

const TABS: { id: MiClubTab; label: string; icon: React.ElementType }[] = [
  { id: 'recientes', label: 'Juegos Recientes', icon: PlayCircle },
  { id: 'stats-equipo', label: 'Estadísticas de Equipo', icon: BarChart3 },
  { id: 'alineaciones', label: 'Alineaciones', icon: Users2 },
  { id: 'estadio', label: 'Estadio', icon: Landmark },
  { id: 'calendario', label: 'Calendario y Clasificación', icon: CalendarDays },
  { id: 'stats-completas', label: 'Estadísticas Completas', icon: BarChart4 },
  { id: 'financiero', label: 'Estado Financiero', icon: Wallet },
  { id: 'transacciones', label: 'Historial de Transacciones', icon: FileText }
];

export const MiClubHub: React.FC<MiClubHubProps> = ({
  currentClub,
  clubs,
  matches,
  players,
  transactions = [],
  transfers = [],
  onAddPlayer,
  onRemovePlayer,
  onToggleStarter,
  onUpdatePlayerValue,
  onSetTransferPrice,
  onRemoveFromMarket
}) => {
  const [activeMiClubTab, setActiveMiClubTab] = useState<MiClubTab>('recientes');
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

  const [sofifaClubSearch, setSofifaClubSearch] = useState<string>('');
  const [sofifaClubFilter, setSofifaClubFilter] = useState<string>('');
  const [sofifaSearchQuery, setSofifaSearchQuery] = useState<string>('');
  const [selectedSofifaPlayerId, setSelectedSofifaPlayerId] = useState<string>('');

  const sofifaClubNames = React.useMemo(
    () => Array.from(new Set(SOFIFA_PLAYERS.map(p => p.clubName).filter(Boolean))).sort() as string[],
    []
  );

  const filteredSofifaClubNames = React.useMemo(() => {
    const q = sofifaClubSearch.trim().toLowerCase();
    if (!q) return sofifaClubNames;
    return sofifaClubNames.filter(club => club.toLowerCase().includes(q));
  }, [sofifaClubNames, sofifaClubSearch]);

  const [name, setName] = useState('');
  const [position, setPosition] = useState<PlayerPosition>('DC');
  const [rating, setRating] = useState(85);
  const [cardType, setCardType] = useState<'Gold' | 'Special' | 'Icon' | 'Silver'>('Gold');
  const [value, setValue] = useState(25000000);
  const [photoUrl, setPhotoUrl] = useState('');
  const [pace, setPace] = useState(85);
  const [shooting, setShooting] = useState(82);
  const [passing, setPassing] = useState(80);
  const [dribbling, setDribbling] = useState(84);
  const [defending, setDefending] = useState(55);
  const [physical, setPhysical] = useState(78);

  const handleSelectSofifaPlayer = (playerId: string) => {
    setSelectedSofifaPlayerId(playerId);
    if (!playerId) return;

    const preset = SOFIFA_PLAYERS.find(p => p.id === playerId);
    if (preset) {
      setName(preset.name);
      setPosition(preset.position);
      setRating(preset.rating);
      setCardType(preset.cardType);
      setValue(preset.value);
      setPhotoUrl(preset.photoUrl);
      setPace(preset.stats.pace);
      setShooting(preset.stats.shooting);
      setPassing(preset.stats.passing);
      setDribbling(preset.stats.dribbling);
      setDefending(preset.stats.defending);
      setPhysical(preset.stats.physical);
    }
  };

  if (!currentClub) {
    return (
      <div className="p-8 text-center fc-card rounded-xl">
        <Shield className="w-12 h-12 text-[#02f59b] mx-auto mb-3" />
        <h2 className="font-display font-bold text-2xl text-white">Selecciona o Inscribe un Club</h2>
        <p className="text-xs text-slate-400 mt-1">Debes tener un club asignado para gestionar la plantilla.</p>
      </div>
    );
  }

  const clubPlayers = players.filter(p => p.clubId === currentClub.id);
  const starters = clubPlayers.filter(p => p.isStarter);
  const avgRating = starters.length > 0
    ? Math.round(starters.reduce((acc, p) => acc + p.rating, 0) / starters.length)
    : 0;

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      name,
      clubId: currentClub.id,
      position,
      rating: Number(rating),
      stats: {
        pace: Number(pace),
        shooting: Number(shooting),
        passing: Number(passing),
        dribbling: Number(dribbling),
        defending: Number(defending),
        physical: Number(physical)
      },
      cardType,
      value: Number(value),
      photoUrl: photoUrl || '',
      isStarter: clubPlayers.length < 11
    };

    onAddPlayer(newPlayer);
    setShowAddPlayerModal(false);
    setName('');
    setPhotoUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="fc-card p-6 rounded-2xl border-emerald-300 bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <ClubLogo src={currentClub.logoUrl} alt={currentClub.name} className="w-16 h-16 rounded-xl object-cover border-2 border-[#02f59b]" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-3xl text-white italic uppercase tracking-wider">
                {currentClub.name}
              </h1>
              <span className="bg-[#02f59b] text-black text-[10px] font-extrabold px-2 py-0.5 rounded font-mono uppercase">
                {currentClub.platform}
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-tech">
              Manager: <strong className="text-[#02f59b]">@{currentClub.manager}</strong> ({currentClub.gamertag}) • Estadio: {currentClub.stadium}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[10px] text-emerald-200 font-tech uppercase block">Media Plantilla</span>
            <span className="font-display font-black text-2xl text-[#02f59b]">{avgRating} OVR</span>
          </div>

          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[10px] text-emerald-200 font-tech uppercase block">Jugadores</span>
            <span className="font-display font-black text-2xl text-white">{clubPlayers.length}</span>
          </div>

          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[10px] text-emerald-200 font-tech uppercase block">Presupuesto</span>
            <span className="font-display font-black text-xl text-[#02f59b]">${(currentClub.budget / 1000000).toFixed(1)}M</span>
          </div>

          <button
            onClick={() => setShowAddPlayerModal(true)}
            className="fc-button-primary px-4 py-2.5 text-xs uppercase flex items-center gap-1.5 shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Añadir Jugador
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMiClubTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                activeMiClubTab === tab.id
                  ? 'bg-[#00ba68] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      {activeMiClubTab === 'recientes' && (
        <RecentGamesTab currentClub={currentClub} clubs={clubs} matches={matches} />
      )}
      {activeMiClubTab === 'stats-equipo' && (
        <TeamStatsTab currentClub={currentClub} players={players} />
      )}
      {activeMiClubTab === 'alineaciones' && (
        <LineupTab
          currentClub={currentClub}
          players={players}
          transfers={transfers}
          onRemovePlayer={onRemovePlayer}
          onToggleStarter={onToggleStarter}
          onUpdatePlayerValue={onUpdatePlayerValue}
          onSetTransferPrice={onSetTransferPrice}
          onRemoveFromMarket={onRemoveFromMarket}
        />
      )}
      {activeMiClubTab === 'estadio' && (
        <StadiumTab currentClub={currentClub} />
      )}
      {activeMiClubTab === 'calendario' && (
        <ScheduleStandingsTab currentClub={currentClub} clubs={clubs} matches={matches} />
      )}
      {activeMiClubTab === 'stats-completas' && (
        <FullStatsTab currentClub={currentClub} players={players} matches={matches} />
      )}
      {activeMiClubTab === 'financiero' && (
        <FinancesTab currentClub={currentClub} transactions={transactions} />
      )}
      {activeMiClubTab === 'transacciones' && (
        <TransactionsHistoryTab currentClub={currentClub} transactions={transactions} />
      )}

      {/* Modal: Crear / Editar Jugador */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-2xl w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <UserPlus className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Añadir Jugador
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">Registra o importa un jugador para {currentClub.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddPlayerModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlayer} className="space-y-4">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#02f59b] font-tech uppercase">
                    <Sparkles className="w-3.5 h-3.5" /> Búsqueda de Jugador Oficial
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-300 font-tech uppercase mb-1">
                    Buscar Club
                  </label>
                  <input
                    type="text"
                    value={sofifaClubSearch}
                    onChange={(e) => setSofifaClubSearch(e.target.value)}
                    placeholder="Ej: Real Madrid, Boca..."
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#02f59b] mb-2"
                  />
                  <select
                    value={sofifaClubFilter}
                    onChange={(e) => {
                      setSofifaClubFilter(e.target.value);
                      setSelectedSofifaPlayerId('');
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#02f59b] mb-2"
                  >
                    <option value="">-- Todos los Clubes ({filteredSofifaClubNames.length}) --</option>
                    {filteredSofifaClubNames.map(club => (
                      <option key={club} value={club}>{club}</option>
                    ))}
                  </select>

                  <label className="block text-[10px] text-slate-300 font-tech uppercase mb-1">
                    Buscar por Nombre
                  </label>
                  <input
                    type="text"
                    value={sofifaSearchQuery}
                    onChange={(e) => setSofifaSearchQuery(e.target.value)}
                    placeholder="Ej: Messi..."
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-[#02f59b] mb-2"
                  />
                  <select
                    value={selectedSofifaPlayerId}
                    onChange={(e) => handleSelectSofifaPlayer(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#02f59b]"
                  >
                    <option value="">
                      {sofifaClubFilter ? `-- Jugadores de ${sofifaClubFilter} --` : '-- Autocompletar con Jugador Oficial --'}
                    </option>
                    {SOFIFA_PLAYERS
                      .filter(p => {
                        if (sofifaClubFilter && p.clubName !== sofifaClubFilter) return false;
                        const q = sofifaSearchQuery.trim().toLowerCase();
                        if (!q) return true;
                        return p.name.toLowerCase().includes(q) || (p.clubName || '').toLowerCase().includes(q);
                      })
                      .sort((a, b) => b.rating - a.rating)
                      .slice(0, 500)
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          ⭐ {p.name} ({p.rating} OVR) — €{(p.value / 1000000).toFixed(0)}M [{p.clubName || 'Libre'}]
                        </option>
                      ))}
                  </select>
                  <p className="text-[10px] text-slate-500 font-tech mt-1">
                    Elegí un club para ver automáticamente su plantel, o buscá por nombre entre los +18.000 jugadores oficiales.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">Nombre del Jugador *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Jude Bellingham"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00ba68]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">Posición *</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as PlayerPosition)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00ba68]"
                  >
                    <option value="POR">POR - Portero</option>
                    <option value="DFC">DFC - Defensa Central</option>
                    <option value="LI">LI - Lateral Izquierdo</option>
                    <option value="LD">LD - Lateral Derecho</option>
                    <option value="MCD">MCD - Medio Defensivo</option>
                    <option value="MC">MC - Mediocentro</option>
                    <option value="MCO">MCO - Medio Ofensivo</option>
                    <option value="EI">EI - Extremo Izquierdo</option>
                    <option value="ED">ED - Extremo Derecho</option>
                    <option value="DC">DC - Delantero Centro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">Valoración OVR</label>
                  <input
                    type="number"
                    min="50"
                    max="99"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00ba68]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">Valor (€)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00ba68]"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-tech font-bold text-slate-500 uppercase">Atributos del Jugador (Valores Oficiales)</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Ritmo (PAC)</span>
                    <input type="number" value={pace} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Tiro (SHO)</span>
                    <input type="number" value={shooting} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Pase (PAS)</span>
                    <input type="number" value={passing} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Regate (DRI)</span>
                    <input type="number" value={dribbling} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Defensa (DEF)</span>
                    <input type="number" value={defending} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">Físico (PHY)</span>
                    <input type="number" value={physical} readOnly disabled className="w-full bg-slate-200/80 border border-slate-300 rounded px-2 py-1 text-slate-800 font-bold font-mono cursor-not-allowed text-center" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPlayerModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition"
                >
                  Guardar Jugador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
