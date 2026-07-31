import React, { useState } from 'react';
import { ClubLogo } from './ClubLogo';
import { Player, Club, PlayerPosition, FinancialTransaction, TransferItem } from '../types';
import { Shield, Plus, DollarSign, Award, Users, Trash2, Edit, Edit3, Star, Zap, UserPlus, Sparkles, Check, Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, FileText, Tag, X } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { SOFIFA_PLAYERS } from '../data/sofifaData';

interface SquadBuilderProps {
  currentClub: Club | null;
  players: Player[];
  transactions?: FinancialTransaction[];
  transfers?: TransferItem[];
  onAddPlayer: (player: Player) => void;
  onRemovePlayer: (playerId: string) => void;
  onToggleStarter: (playerId: string) => void;
  onUpdatePlayerClause?: (playerId: string, newClause: number) => void;
}

const FORMATIONS = [
  { name: '4-3-3', positions: ['POR', 'LI', 'DFC', 'DFC', 'LD', 'MC', 'MCD', 'MC', 'EI', 'DC', 'ED'] },
  { name: '4-2-3-1', positions: ['POR', 'LI', 'DFC', 'DFC', 'LD', 'MCD', 'MCD', 'EI', 'MCO', 'ED', 'DC'] },
  { name: '4-4-2', positions: ['POR', 'LI', 'DFC', 'DFC', 'LD', 'EI', 'MC', 'MC', 'ED', 'DC', 'DC'] },
  { name: '3-5-2', positions: ['POR', 'DFC', 'DFC', 'DFC', 'MCD', 'MCD', 'EI', 'MCO', 'ED', 'DC', 'DC'] }
];

export const SquadBuilder: React.FC<SquadBuilderProps> = ({
  currentClub,
  players,
  transactions = [],
  transfers = [],
  onAddPlayer,
  onRemovePlayer,
  onToggleStarter,
  onUpdatePlayerClause
}) => {
  const [formation, setFormation] = useState('4-3-3');
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);

  // Edit Clause Modal state
  const [clauseEditPlayer, setClauseEditPlayer] = useState<Player | null>(null);
  const [newClauseInput, setNewClauseInput] = useState<number>(30000000);

  // SoFIFA Player preset state
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

  // New player state
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
  const substitutes = clubPlayers.filter(p => !p.isStarter);

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

  // Financial metrics for current club
  const clubTransactions = transactions.filter(t => t.clubId === currentClub.id);
  const totalIncome = clubTransactions
    .filter(t => t.type === 'INGRESO')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = clubTransactions
    .filter(t => t.type === 'GASTO')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

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

        {/* Squad Metrics */}
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

      {/* Formation Selector & Pitch View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pitch Display (2 cols) */}
        <div className="lg:col-span-2 pitch-bg rounded-2xl p-6 border-2 border-emerald-600/40 shadow-2xl relative min-h-[520px] flex flex-col justify-between overflow-hidden">
          {/* Pitch Lines Decor */}
          <div className="absolute inset-x-0 top-0 h-24 border-b-2 border-white/20 rounded-b-full w-2/3 mx-auto pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 border-t-2 border-white/20 rounded-t-full w-2/3 mx-auto pointer-events-none" />
          <div className="absolute inset-y-1/2 inset-x-0 border-t-2 border-white/20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full pointer-events-none" />

          {/* Formation bar top */}
          <div className="relative z-10 flex justify-between items-center bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 mb-2">
            <span className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#02f59b]" /> Táctica & Alineación Titular
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-tech uppercase">Formación:</span>
              <select
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
                className="bg-[#080d0a] text-xs font-bold text-[#02f59b] border border-emerald-500/40 px-2.5 py-1 rounded focus:outline-none"
              >
                {FORMATIONS.map(f => (
                  <option key={f.name} value={f.name}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tactical Pitch Layout strictly 11 starters matching formation rows */}
          {(() => {
            // Limitar estrictamente a los 11 titulares activos
            const elevenStarters = starters.slice(0, 11);

            // 1. Portero (1)
            const gks = elevenStarters.filter(p => ['POR', 'GK'].includes(p.position));
            const gk = gks[0] || elevenStarters[0];
            const outfield = elevenStarters.filter(p => p.id !== gk?.id);

            // Categorización Estricta por Posición Natural de la tarjeta
            const naturalDefs = outfield.filter(p => ['DFC', 'LD', 'LI', 'CAD', 'CAI'].includes(p.position));
            const naturalMids = outfield.filter(p => ['MC', 'MCD', 'MCO', 'MI', 'MD'].includes(p.position));
            const naturalFwds = outfield.filter(p => ['DC', 'EI', 'ED', 'SD'].includes(p.position));
            const others = outfield.filter(p => 
              !['DFC', 'LD', 'LI', 'CAD', 'CAI', 'MC', 'MCD', 'MCO', 'MI', 'MD', 'DC', 'EI', 'ED', 'SD'].includes(p.position)
            );

            let lines: { title: string; players: Player[] }[] = [];

            if (formation === '4-2-3-1') {
              // 4 Defensas abajo / 2 MCD / 3 CAM / 1 ST
              const lineDEF = naturalDefs.slice(0, 4);
              const remainingDefs = naturalDefs.slice(4);

              const lineCDM = naturalMids.filter(p => ['MCD', 'MC'].includes(p.position)).slice(0, 2);
              const usedCdmIds = new Set(lineCDM.map(p => p.id));
              const remainingMids = naturalMids.filter(p => !usedCdmIds.has(p.id));

              const lineCAM = remainingMids.slice(0, 3);
              const usedCamIds = new Set(lineCAM.map(p => p.id));
              const unusedMids = remainingMids.filter(p => !usedCamIds.has(p.id));

              const poolST = [...naturalFwds, ...unusedMids, ...remainingDefs, ...others];
              const lineST = poolST.slice(0, 1);
              const usedStId = lineST[0]?.id;

              // Rellenar si faltaba alguno en las líneas manteniendo defensores ABAJO
              const unusedPool = poolST.filter(p => p.id !== usedStId);

              while (lineDEF.length < 4 && unusedPool.length > 0) {
                lineDEF.push(unusedPool.pop()!);
              }

              lines = [
                { title: 'Delantero Centro (1)', players: lineST },
                { title: 'Medias Puntas / Extremos (3)', players: lineCAM },
                { title: 'Pivotes Defensivos (2)', players: lineCDM },
                { title: 'Defensas (4)', players: lineDEF },
                { title: 'Portero (1)', players: gk ? [gk] : [] }
              ];
            } else {
              // Formaciones estándar (4-3-3, 4-4-2, 3-5-2)
              let targetCounts = { fwds: 3, mids: 3, defs: 4 }; // 4-3-3
              if (formation === '4-4-2') targetCounts = { fwds: 2, mids: 4, defs: 4 };
              if (formation === '3-5-2') targetCounts = { fwds: 2, mids: 5, defs: 3 };

              // Asignar defensores estrictamente a la línea defensiva
              let lineDEF = naturalDefs.slice(0, targetCounts.defs);
              let remDefs = naturalDefs.slice(targetCounts.defs);

              // Asignar delanteros estrictamente a la línea de ataque
              let lineFWD = naturalFwds.slice(0, targetCounts.fwds);
              let remFwds = naturalFwds.slice(targetCounts.fwds);

              // Mediocampistas van al centro
              let lineMID = [...naturalMids, ...remFwds, ...others];

              // Si faltan defensores o delanteros para cumplir la cuota del dibujo táctico:
              while (lineDEF.length < targetCounts.defs && remDefs.length > 0) {
                lineDEF.push(remDefs.shift()!);
              }
              while (lineFWD.length < targetCounts.fwds && lineMID.length > targetCounts.mids) {
                lineFWD.push(lineMID.pop()!);
              }

              lines = [
                { title: 'Delanteros', players: lineFWD },
                { title: 'Mediocampistas', players: lineMID.slice(0, targetCounts.mids) },
                { title: 'Defensas', players: lineDEF },
                { title: 'Portero', players: gk ? [gk] : [] }
              ];
            }

            const renderCard = (player: Player) => {
              const transferItem = transfers.find(t => (t.player.id === player.id || t.player.name === player.name) && t.status === 'DISPONIBLE');
              return (
                <div
                  key={player.id}
                  onClick={() => onToggleStarter(player.id)}
                  className="relative group cursor-pointer transition-all hover:scale-105 hover:z-30"
                >
                  {/* Compact Card with Visible Face */}
                  <div className={`p-1.5 rounded-xl text-center shadow-lg border transition-all ${
                    player.cardType === 'Special' ? 'fc-special-card text-black border-amber-300' :
                    player.cardType === 'Gold' ? 'fc-gold-card text-black border-amber-400' :
                    'bg-slate-900 border-slate-700 text-white'
                  }`}>
                    <div className="flex justify-between items-center font-display font-extrabold text-[10px] px-1">
                      <span className="text-xs font-mono leading-none">{player.rating}</span>
                      <span className="uppercase text-[9px] bg-black/40 text-white px-1 py-0.5 rounded">{player.position}</span>
                    </div>

                    {/* Foto / Cara del Jugador */}
                    <div className="w-10 h-10 rounded-lg bg-black/20 border border-black/30 mx-auto my-1 flex items-center justify-center overflow-hidden shadow-inner relative">
                      {player.photoUrl ? (
                        <img
                          src={player.photoUrl}
                          alt={player.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="font-display font-black text-xs">{player.position}</span>
                      )}
                    </div>

                    <h4 className="font-display font-extrabold text-[10px] truncate uppercase tracking-tight text-slate-950">
                      {player.name}
                    </h4>

                    {transferItem && (
                      <div className="mt-0.5 bg-amber-400 text-slate-950 font-display font-black text-[8px] px-1 py-0.2 rounded shadow uppercase truncate">
                        🏷️ €{(transferItem.askingPrice / 1000000).toFixed(1)}M
                      </div>
                    )}
                  </div>
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[8px] px-1 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity z-40">
                    Banca
                  </span>
                </div>
              );
            };

            return (
              <div className="relative z-10 flex flex-col justify-between h-full min-h-[500px] py-2 space-y-2">
                {starters.length === 0 ? (
                  <div className="my-auto text-center py-12 text-white font-tech bg-black/40 p-4 rounded-xl border border-white/10">
                    No hay titulares asignados. Haz clic en los jugadores de la derecha para llenar el 11 titular.
                  </div>
                ) : (
                  lines.map((line, lIdx) => (
                    <div key={lIdx} className="flex justify-around items-center gap-2 sm:gap-6 px-4">
                      {line.players.map(player => (
                        <div key={player.id} className="w-24 sm:w-28 flex-1 max-w-[125px]">
                          {renderCard(player)}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            );
          })()}
        </div>

        {/* Squad Roster List / Substitutes (1 col) */}
        <div className="fc-card p-5 rounded-2xl border-slate-200 space-y-4 shadow-md">
          <h3 className="font-display font-bold text-lg uppercase text-slate-900 flex items-center justify-between border-b border-slate-200 pb-2">
            <span>Suplentes & Plantilla ({substitutes.length})</span>
            <span className="text-xs text-slate-500 font-tech">Haz clic para alternar titular</span>
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {clubPlayers.map((player) => {
              const transferItem = transfers.find(t => (t.player.id === player.id || t.player.name === player.name) && t.status === 'DISPONIBLE');

              return (
                <div
                  key={player.id}
                  className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                    transferItem
                      ? 'bg-amber-50/80 border-amber-300'
                      : player.isStarter
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-display font-extrabold text-xs text-black shrink-0 ${
                      player.cardType === 'Special' ? 'bg-[#02f59b]' : 'bg-amber-400'
                    }`}>
                      {player.rating}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5 flex-wrap">
                        <span>{player.name}</span>
                        <span className="text-[9px] font-mono text-slate-600 bg-slate-200 px-1 rounded">
                          {player.position}
                        </span>
                        {transferItem && (
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-display font-black uppercase px-1.5 py-0.5 rounded border border-amber-500 shadow-xs flex items-center gap-1 animate-pulse">
                            <Tag className="w-2.5 h-2.5 shrink-0" /> EN VENTA
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {player.value && player.value > 0 ? (
                          <span className="text-[10px] text-[#00ba68] font-tech font-bold">
                            Cláusula: €{(player.value / 1000000).toFixed(1)}M
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-tech font-semibold">
                            Sin Cláusula
                          </span>
                        )}
                        {transferItem && (
                          <span className="text-[10px] text-amber-800 font-extrabold font-mono bg-amber-100 px-1 rounded">
                            En Mercado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onUpdatePlayerClause && (
                      <button
                        onClick={() => {
                          setClauseEditPlayer(player);
                          setNewClauseInput(player.value > 0 ? player.value : 0);
                        }}
                        className="px-2 py-1 rounded text-[10px] font-extrabold font-tech uppercase bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 flex items-center gap-1 transition-colors"
                        title="Modificar cláusula de rescisión de este jugador"
                      >
                        <Edit3 className="w-3 h-3 text-emerald-600" /> Cláusula
                      </button>
                    )}

                    <button
                      onClick={() => onToggleStarter(player.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold font-tech uppercase transition-colors ${
                        player.isStarter
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                    >
                      {player.isStarter ? '11 Titular' : 'Hacer Titular'}
                    </button>

                    <button
                      onClick={() => onRemovePlayer(player.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section: Presupuesto & Libro de Cuentas del Club */}
      <div className="fc-card p-6 rounded-2xl border-slate-200 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-display font-extrabold text-xl text-slate-900 uppercase italic flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#00ba68]" /> Estado Financiero y Movimientos de Dinero
            </h2>
            <p className="text-xs text-slate-500 font-tech">Resumen contable y registro de fichajes/ventas del {currentClub.name}.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-tech text-slate-500 uppercase">Presupuesto Actual:</span>
            <span className="font-display font-black text-2xl text-[#00ba68] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              €{(currentClub.budget / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>

        {/* Finance Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-tech uppercase text-emerald-800 font-bold block">Total Ingresos (Ventas)</span>
              <span className="font-display font-black text-lg text-emerald-700">
                +${(totalIncome / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>

          <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500 text-white rounded-lg flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-tech uppercase text-rose-800 font-bold block">Total Gastos (Fichajes)</span>
              <span className="font-display font-black text-lg text-rose-700">
                -${(totalExpenses / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              netBalance >= 0 ? 'bg-slate-800 text-[#02f59b]' : 'bg-rose-800 text-rose-200'
            }`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-tech uppercase text-slate-500 font-bold block">Balance Neto</span>
              <span className={`font-display font-black text-lg ${
                netBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                {netBalance >= 0 ? '+' : ''}${(netBalance / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>
        </div>

        {/* Transactions History Table */}
        <div className="space-y-3">
          <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-500" /> Historial de Transacciones Financieras
          </h3>

          {clubTransactions.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-tech uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Concepto / Detalle</th>
                    <th className="p-3 text-right">Monto ($)</th>
                    <th className="p-3 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-tech">
                  {clubTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        {tx.type === 'INGRESO' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                            <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> INGRESO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-300">
                            <ArrowUpRight className="w-3 h-3 text-rose-600" /> GASTO
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-800">{tx.concept}</td>
                      <td className={`p-3 text-right font-display font-black text-sm ${
                        tx.type === 'INGRESO' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {tx.type === 'INGRESO' ? '+' : '-'}${(tx.amount / 1000000).toFixed(2)}M
                      </td>
                      <td className="p-3 text-right text-slate-500 font-mono text-[11px]">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs font-tech italic">
              No hay movimientos de dinero registrados aún para tu club.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Crear / Editar Jugador */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-2xl w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            {/* Header */}
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
              {/* Player Preset Select */}
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

              {/* Stats Grid (Read-Only from SOFIFA) */}
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

      {/* MODAL: Modificar Cláusula de Rescisión de Jugador en Mi Club */}
      {clauseEditPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-md w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <Edit3 className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Cláusula de Rescisión
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">{currentClub.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setClauseEditPlayer(null)} 
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Player Banner */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 text-white shadow-inner">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-[#02f59b] font-display font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500">
                {clauseEditPlayer.position}
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-black text-lg text-white uppercase leading-tight truncate">
                  {clauseEditPlayer.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-[#02f59b] text-black font-extrabold px-1.5 py-0.5 rounded font-mono">
                    {clauseEditPlayer.position}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {clauseEditPlayer.rating} OVR
                  </span>
                  <span className="text-[10px] text-slate-400 font-tech">
                    {currentClub.name}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (onUpdatePlayerClause && clauseEditPlayer) {
                onUpdatePlayerClause(clauseEditPlayer.id, Number(newClauseInput));
                alert(`¡Cláusula actualizada! La cláusula de rescisión de ${clauseEditPlayer.name} es ahora €${(Number(newClauseInput) / 1000000).toFixed(1)}M.`);
              }
              setClauseEditPlayer(null);
            }} className="space-y-4">

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                  Nueva Cláusula de Rescisión (€ Euros) *
                </label>
                <input
                  type="number"
                  value={newClauseInput}
                  onChange={(e) => setNewClauseInput(Number(e.target.value))}
                  step="1000000"
                  min="1000000"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-display font-black text-[#00ba68] focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
                <span className="text-xs font-display font-bold text-[#00ba68] mt-1 block">
                  Valor asignado: €{(newClauseInput / 1000000).toFixed(1)}M Millones
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-tech font-bold uppercase text-slate-500 block">Valores Rápidos:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[15000000, 30000000, 50000000, 80000000, 100000000, 150000000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNewClauseInput(val)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-colors ${
                        newClauseInput === val
                          ? 'bg-[#00ba68] text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                      }`}
                    >
                      €{val / 1000000}M
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed font-tech">
                💡 <strong>Nota del Club:</strong> Esta cláusula de rescisión sólo puede ser configurada por el manager de tu equipo. Si otro club desea fichar a {clauseEditPlayer.name}, deberá depositar esta suma.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setClauseEditPlayer(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> Guardar Cláusula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
