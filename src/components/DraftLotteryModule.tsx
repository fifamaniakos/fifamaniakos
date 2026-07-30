import React, { useState, useEffect } from 'react';
import { ClubLogo } from './ClubLogo';
import { Club, Player } from '../types';
import { DRAFT_BOMBO_TEAMS } from '../data/initialData';
import { SOFIFA_PLAYERS, SoFifaPlayerPreset } from '../data/sofifaData';
import { Shuffle, Sparkles, Trophy, Globe, CheckCircle, RefreshCw, Dices, Award, Users, Play, Shield, UserCheck, Filter, Star, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DraftLotteryModuleProps {
  registeredClubs: Club[];
  isAdmin?: boolean;
  onAssignDraftClub?: (registeredClubId: string, assignedPreset: any) => void;
  onAssignDraftPlayer?: (registeredClubId: string, playerPreset: SoFifaPlayerPreset) => void;
  onAssignFullSquadDraft?: (registeredClubId: string, playerPresets: SoFifaPlayerPreset[]) => void;
}

export const DraftLotteryModule: React.FC<DraftLotteryModuleProps> = ({
  registeredClubs,
  isAdmin = false,
  onAssignDraftClub,
  onAssignDraftPlayer,
  onAssignFullSquadDraft
}) => {
  // Pestaña activa: 'teams' (Draft de Equipos) o 'players' (Draft de Jugadores Top Stats)
  const [draftMode, setDraftMode] = useState<'teams' | 'players'>('players');

  // Estado del Draft de Equipos
  const [bomboTeams, setBomboTeams] = useState<any[]>(DRAFT_BOMBO_TEAMS);
  const [highlightedPreset, setHighlightedPreset] = useState<any | null>(null);

  // Estado del Draft de Jugadores (Top Stats)
  const [minRating, setMinRating] = useState<number>(85);
  const [selectedPosition, setSelectedPosition] = useState<string>('TODAS');
  const [availablePlayers, setAvailablePlayers] = useState<SoFifaPlayerPreset[]>([]);
  const [highlightedPlayer, setHighlightedPlayer] = useState<SoFifaPlayerPreset | null>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [lotteryHistory, setLotteryHistory] = useState<Array<{ type: 'team' | 'player'; title: string; manager: string; subtext: string; imgUrl: string; badge?: string }>>([]);

  const [targetManagerId, setTargetManagerId] = useState<string>(registeredClubs[0]?.id || '');
  const [assignedDTName, setAssignedDTName] = useState<string>('');

  useEffect(() => {
    if (registeredClubs.length > 0 && !targetManagerId) {
      setTargetManagerId(registeredClubs[0].id);
    }
  }, [registeredClubs]);

  // Actualizar bombo de jugadores top cuando cambien los filtros de rating o posición
  useEffect(() => {
    let filtered = SOFIFA_PLAYERS.filter(p => (p.rating || 0) >= minRating);
    if (selectedPosition !== 'TODAS') {
      filtered = filtered.filter(p => {
        if (selectedPosition === 'DEL') return ['DC', 'EI', 'ED', 'SD'].includes(p.position);
        if (selectedPosition === 'MED') return ['MC', 'MCD', 'MCO', 'MI', 'MD'].includes(p.position);
        if (selectedPosition === 'DEF') return ['DFC', 'LD', 'LI', 'CAD', 'CAI'].includes(p.position);
        if (selectedPosition === 'POR') return ['POR', 'GK'].includes(p.position);
        return p.position === selectedPosition;
      });
    }
    setAvailablePlayers(filtered);
  }, [minRating, selectedPosition]);

  // Ejecutar sorteo de equipos
  const handleStartTeamDraw = () => {
    if (bomboTeams.length === 0) {
      alert('¡Se han sorteado todos los equipos disponibles del bombo!');
      return;
    }

    if (!targetManagerId) {
      alert('Por favor selecciona un DT / Participante para sortearle equipo.');
      return;
    }

    const managerObj = registeredClubs.find(c => c.id === targetManagerId);
    const finalManagerName = managerObj ? `${managerObj.manager} (${managerObj.gamertag})` : 'DT Participante';

    setIsSpinning(true);
    let counter = 0;
    const maxSpins = 25;
    const speed = 80;

    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * bomboTeams.length);
      setHighlightedPreset(bomboTeams[randomIdx]);
      counter++;

      if (counter >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);

        const winnerIdx = Math.floor(Math.random() * bomboTeams.length);
        const finalWinner = bomboTeams[winnerIdx];
        setHighlightedPreset(finalWinner);
        setAssignedDTName(finalManagerName);

        setBomboTeams(prev => prev.filter((_, idx) => idx !== winnerIdx));

        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });

        setLotteryHistory(prev => [
          {
            type: 'team',
            title: finalWinner.name,
            manager: finalManagerName,
            subtext: `Estadio: ${finalWinner.stadium}`,
            imgUrl: finalWinner.logoUrl,
            badge: 'Equipo Asignado'
          },
          ...prev
        ]);

        if (targetManagerId && onAssignDraftClub) {
          onAssignDraftClub(targetManagerId, {
            name: finalWinner.name,
            shortName: finalWinner.shortName,
            logoUrl: finalWinner.logoUrl,
            stadium: finalWinner.stadium,
            defaultBudget: finalWinner.defaultBudget
          });
        }
      }
    }, speed);
  };

  // Ejecutar sorteo de jugadores con Stats Altos
  const handleStartPlayerDraw = () => {
    if (availablePlayers.length === 0) {
      alert('No hay jugadores disponibles en el bombo con los filtros seleccionados.');
      return;
    }

    if (!targetManagerId) {
      alert('Por favor selecciona un DT / Participante para el Draft de Jugador.');
      return;
    }

    const managerObj = registeredClubs.find(c => c.id === targetManagerId);
    const finalManagerName = managerObj ? `${managerObj.manager} (${managerObj.gamertag})` : 'DT Participante';

    setIsSpinning(true);
    let counter = 0;
    const maxSpins = 25;
    const speed = 80;

    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * availablePlayers.length);
      setHighlightedPlayer(availablePlayers[randomIdx]);
      counter++;

      if (counter >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);

        const winnerIdx = Math.floor(Math.random() * availablePlayers.length);
        const finalPlayer = availablePlayers[winnerIdx];
        setHighlightedPlayer(finalPlayer);
        setAssignedDTName(finalManagerName);

        // Remover al jugador obtenido del bombo de disponibles para evitar repetidos
        setAvailablePlayers(prev => prev.filter(p => p.id !== finalPlayer.id));

        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 }
        });

        setLotteryHistory(prev => [
          {
            type: 'player',
            title: `${finalPlayer.name} (${finalPlayer.rating} OVR)`,
            manager: finalManagerName,
            subtext: `${finalPlayer.position} • ${finalPlayer.nationality}`,
            imgUrl: finalPlayer.photoUrl,
            badge: `⭐ Top Stat ${finalPlayer.rating}`
          },
          ...prev
        ]);

        if (targetManagerId && onAssignDraftPlayer) {
          onAssignDraftPlayer(targetManagerId, finalPlayer);
        }
      }
    }, speed);
  };
  // Estado para la última plantilla de 22 jugadores sorteada de golpe
  const [maxTopPlayers, setMaxTopPlayers] = useState<number>(3);
  const [lastSquadGenerated, setLastSquadGenerated] = useState<{ managerName: string; players: SoFifaPlayerPreset[]; topCount: number } | null>(null);

  // Generar borrador instantáneo de plantilla equilibrada de 22 jugadores con TOPE DE CRACKS TOP
  const handleGenerateFullSquadDraft = () => {
    if (!targetManagerId) {
      alert('Por favor selecciona un DT / Participante para sortearle la plantilla.');
      return;
    }

    const managerObj = registeredClubs.find(c => c.id === targetManagerId);
    const finalManagerName = managerObj ? `${managerObj.manager} (${managerObj.gamertag})` : 'DT Participante';

    // 1. Definir Cracks Top Elite (OVR >= 86 o minRating) y Jugadores Estándar (78 <= OVR <= 85)
    const eliteThreshold = Math.max(minRating, 86);
    const topElitesPool = SOFIFA_PLAYERS.filter(p => (p.rating || 0) >= eliteThreshold);
    const standardPool = SOFIFA_PLAYERS.filter(p => (p.rating || 0) >= 78 && (p.rating || 0) < eliteThreshold);

    // Mezclar aleatoriamente bolsas
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());
    const shuffledElites = shuffle(topElitesPool);
    const shuffledStandards = shuffle(standardPool);

    // Seleccionar máximo N Top Cracks (por defecto 3)
    const selectedTopCracks = shuffledElites.slice(0, maxTopPlayers);

    // Bolsa disponible combinada priorizando no repetir
    const selectedIds = new Set(selectedTopCracks.map(p => p.id));
    const remainingStandards = shuffledStandards.filter(p => !selectedIds.has(p.id));

    // Necesitamos completar hasta 22 respetando posiciones (2 POR, 7 DEF, 7 MED, 6 DEL)
    const combinedPool = [...selectedTopCracks, ...remainingStandards];

    const porters = combinedPool.filter(p => ['POR', 'GK'].includes(p.position));
    const defense = combinedPool.filter(p => ['DFC', 'LD', 'LI', 'CAD', 'CAI'].includes(p.position));
    const midfielders = combinedPool.filter(p => ['MC', 'MCD', 'MCO', 'MI', 'MD'].includes(p.position));
    const forwards = combinedPool.filter(p => ['DC', 'EI', 'ED', 'SD'].includes(p.position));

    // Asegurar exactamente la distribución 2 POR, 7 DEF, 7 MED, 6 DEL
    // Colocando primero a los Top Cracks seleccionados en sus posiciones
    const finalPor = porters.slice(0, 2);
    const finalDef = defense.slice(0, 7);
    const finalMed = midfielders.slice(0, 7);
    const finalDel = forwards.slice(0, 6);

    const fullSquad = [...finalPor, ...finalDef, ...finalMed, ...finalDel];

    if (fullSquad.length < 22) {
      alert('No hay suficientes jugadores en la base de datos para completar los 22 puestos.');
      return;
    }

    const actualTopCount = fullSquad.filter(p => (p.rating || 0) >= eliteThreshold).length;

    setLastSquadGenerated({
      managerName: finalManagerName,
      players: fullSquad,
      topCount: actualTopCount
    });

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });

    setLotteryHistory(prev => [
      {
        type: 'player',
        title: `Plantilla Equilibrada (Máx. ${maxTopPlayers} Top Cracks)`,
        manager: finalManagerName,
        subtext: `${actualTopCount} Top Elite (${eliteThreshold}+ OVR) • 19 Medios`,
        imgUrl: fullSquad[0].photoUrl,
        badge: '⚡ Draft 22 Equitativo'
      },
      ...prev
    ]);

    if (targetManagerId && onAssignFullSquadDraft) {
      onAssignFullSquadDraft(targetManagerId, fullSquad);
    }
  };

  // Reiniciar estado del Draft (solo accesible para Admin)
  const handleResetDraft = () => {
    if (confirm('⚠️ ¿Reiniciar todo el historial de Draft y restablecer los bombos de sorteo?')) {
      setBomboTeams(DRAFT_BOMBO_TEAMS);
      setHighlightedPreset(null);
      setHighlightedPlayer(null);
      setLastSquadGenerated(null);
      setLotteryHistory([]);
      alert('¡El Draft ha sido reiniciado con éxito!');
    }
  };

  // Identificar si un jugador es considerado Top Crack Elite
  const isTopCrack = (player: SoFifaPlayerPreset) => (player.rating || 0) >= Math.max(minRating, 86);

  // Renderizar fila individual de jugador con distintivo dorado para Top Cracks
  const renderPlayerRow = (p: SoFifaPlayerPreset, idx: number) => {
    const isCrack = isTopCrack(p);
    return (
      <div
        key={idx}
        className={`flex items-center justify-between gap-3 p-2.5 rounded-lg border transition ${
          isCrack
            ? 'bg-gradient-to-r from-amber-50 via-yellow-50/70 to-amber-50 border-amber-300 shadow-sm ring-1 ring-amber-300/60'
            : 'bg-white border-slate-200 shadow-xs hover:border-emerald-400'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={p.photoUrl} alt={p.name} className="w-9 h-9 object-cover rounded-md bg-slate-100 border border-slate-200" />
            {isCrack && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-xs">
                <Star className="w-3 h-3 fill-slate-950" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <strong className="text-slate-900 block text-xs font-extrabold">{p.name}</strong>
              {isCrack && (
                <span className="px-1.5 py-0.5 bg-amber-200 text-amber-900 border border-amber-400 text-[9px] font-black rounded uppercase font-mono tracking-wider flex items-center gap-1">
                  ⭐ TOP ELITE
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{p.position} • {p.nationality} • {p.clubName || 'Agente Libre'}</span>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-black font-mono border ${
          isCrack
            ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-500 shadow-xs'
            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
        }`}>
          {p.rating} OVR
        </span>
      </div>
    );
  };

  const [showGuide, setShowGuide] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Banner Draft */}
      <div className="fc-card p-6 md:p-8 rounded-2xl border-emerald-300 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#02f59b] to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
              <Dices className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#02f59b]/20 border border-[#02f59b]/40 text-[#02f59b] text-[10px] font-mono font-bold uppercase tracking-wider">
                  Sorteo & Draft en Vivo
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-mono font-bold uppercase">
                    Modo Admin
                  </span>
                )}
              </div>
              <h2 className="font-display font-black text-2xl md:text-3xl text-white uppercase italic tracking-wide mt-1">
                Draft Oficial de la Liga Online
              </h2>
              <p className="text-xs text-slate-300 font-tech mt-0.5">
                Sortea aleatoriamente Equipos Oficiales o Plantillas de Jugadores Equitativas (Máx 3 Cracks)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto">
            {/* Botón Reset exclusivo para Admin */}
            {isAdmin && (
              <button
                onClick={handleResetDraft}
                className="px-3.5 py-2 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase transition border border-rose-400/40 shadow-md flex items-center gap-1.5 shrink-0"
                title="Reiniciar todos los resultados y bombos del draft"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Draft
              </button>
            )}

            {/* Selector de Modo de Draft */}
            <div className="flex items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/80 flex-1 md:flex-initial">
              <button
                onClick={() => setDraftMode('players')}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition flex items-center justify-center gap-2 ${
                  draftMode === 'players'
                    ? 'bg-[#02f59b] text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Star className="w-4 h-4" /> Draft Jugadores Top
              </button>
              <button
                onClick={() => setDraftMode('teams')}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition flex items-center justify-center gap-2 ${
                  draftMode === 'teams'
                    ? 'bg-[#02f59b] text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" /> Draft de Equipos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guía Explicativa del Sistema de Draft */}
      <div className="fc-card p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm text-slate-900 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-display font-black text-sm text-slate-900 uppercase italic flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            📖 ¿Cómo funciona el Sistema de Draft FIFAMANIAKOS?
          </h3>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            {showGuide ? 'Ocultar Guía' : 'Ver Guía Completa'}
          </button>
        </div>

        {showGuide && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-tech pt-1">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-emerald-800 font-bold flex items-center gap-1.5">
                ⚡ 1. Draft Equitativo (22 Jugadores)
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Seleccionas a un DT y presionas el botón de Draft Instantáneo. El sistema genera una plantilla realista de 22 jugadores distribuida por líneas: <strong>2 POR, 7 DEF, 7 MED y 6 DEL</strong>.
              </p>
            </div>

            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-1">
              <strong className="text-amber-900 font-bold flex items-center gap-1.5">
                ⭐ 2. Regla de Equidad (Máx 3 Cracks)
              </strong>
              <p className="text-amber-950 text-[11px] leading-relaxed">
                Para evitar descompensaciones entre los equipos de la liga, se garantiza que cada manager reciba un <strong>máximo de 3 Cracks Top Elite (⭐ (+86 OVR))</strong> resaltados en dorado, acompañados de 19 jugadores de nivel competitivo medio (78-85 OVR).
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-emerald-800 font-bold flex items-center gap-1.5">
                🛡️ 3. Asignación Directa a la Liga
              </strong>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Al realizar el sorteo, todos los 22 jugadores se integran automáticamente en la plantilla del club del DT seleccionado, dejando los 11 mejores pre-alineados como titulares para sus próximos partidos.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Configuración e Inicio del Sorteo */}
        <div className="fc-card p-6 rounded-2xl bg-white border-slate-200 shadow-md space-y-5 h-auto">
          <h3 className="font-display font-black text-lg text-slate-900 uppercase italic flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shuffle className="w-5 h-5 text-emerald-600" />
            {draftMode === 'players' ? 'Draft de Jugadores Top Stats' : 'Configuración de Equipos'}
          </h3>

          {/* Manager Participante y Tarjeta Unificada de Club */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" /> Seleccionar DT / Participante ({registeredClubs.length})
            </label>

            {(() => {
              const [isOpen, setIsOpen] = useState(false);
              const dropdownRef = React.useRef<HTMLDivElement>(null);
              const currentSelectedClub = registeredClubs.find(c => c.id === targetManagerId) || registeredClubs[0];

              // Cerrar dropdown al hacer click afuera
              useEffect(() => {
                const handleClickOutside = (e: MouseEvent) => {
                  if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                    setIsOpen(false);
                  }
                };
                document.addEventListener('mousedown', handleClickOutside);
                return () => document.removeEventListener('mousedown', handleClickOutside);
              }, []);

              return (
                <div className="relative" ref={dropdownRef}>
                  {/* Botón Principal Custom (Tarjeta) */}
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-between p-2.5 bg-slate-50 border rounded-xl shadow-xs transition-all cursor-pointer ${
                      isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white' : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-100/80'
                    }`}
                  >
                    {currentSelectedClub ? (
                      <div className="flex items-center gap-2.5">
                        <ClubLogo
                          src={currentSelectedClub.logoUrl || currentSelectedClub.badgeUrl}
                          alt={currentSelectedClub.name}
                          className="w-9 h-9 object-cover rounded-full border border-slate-200 shadow-xs shrink-0"
                        />
                        <div className="leading-tight">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-slate-900 uppercase tracking-tight">
                              {currentSelectedClub.name || 'Sin equipo'}
                            </span>
                            {currentSelectedClub.platform && (
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded font-mono">
                                {currentSelectedClub.platform}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            ${((currentSelectedClub.budget || 0) / 1000000).toFixed(1)}M • <span className="text-emerald-700 font-bold">@{currentSelectedClub.manager}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-bold">Seleccionar Club...</span>
                    )}

                    <div className={`p-1.5 rounded-lg transition-transform duration-200 ${isOpen ? 'rotate-180 bg-emerald-100 text-emerald-800' : 'bg-slate-200/60 text-slate-600'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Menú Desplegable Custom */}
                  {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 p-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                      {registeredClubs.map(c => {
                        const isSelected = c.id === targetManagerId;
                        return (
                          <div
                            key={c.id}
                            onClick={() => {
                              setTargetManagerId(c.id);
                              setIsOpen(false);
                            }}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                                : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <ClubLogo
                                src={c.logoUrl || c.badgeUrl}
                                alt={c.name}
                                className="w-8 h-8 object-cover rounded-full border border-slate-200 shadow-xs shrink-0"
                              />
                              <div className="leading-tight">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold uppercase">{c.name || 'Sin equipo'}</span>
                                  {c.platform && (
                                    <span className="px-1 py-0.2 bg-slate-200 text-slate-700 text-[8px] font-black rounded font-mono">
                                      {c.platform}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  ${((c.budget || 0) / 1000000).toFixed(1)}M • <span className="text-emerald-700 font-bold">@{c.manager}</span>
                                </div>
                              </div>
                            </div>

                            {isSelected && (
                              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Filtros Exclusivos para Draft de Jugadores */}
          {draftMode === 'players' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5 text-slate-500" /> Rating Mínimo (OVR)</span>
                  <span className="text-emerald-600 font-extrabold text-sm">+{minRating} OVR</span>
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00ba68]"
                >
                  <option value={88}>Top World Elite (+88 OVR)</option>
                  <option value={86}>Top Crack (+86 OVR)</option>
                  <option value={84}>Destacados (+84 OVR)</option>
                  <option value={80}>Standard (+80 OVR)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                  Posición Preferida
                </label>
                <div className="grid grid-cols-5 gap-1 text-[11px] font-bold">
                  {['TODAS', 'DEL', 'MED', 'DEF', 'POR'].map(pos => (
                    <button
                      key={pos}
                      onClick={() => setSelectedPosition(pos)}
                      className={`py-1.5 rounded-lg border transition text-center ${
                        selectedPosition === pos
                          ? 'bg-slate-900 border-slate-900 text-[#02f59b]'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs font-tech text-emerald-900 flex items-center justify-between">
                <span>Jugadores en el Bombo:</span>
                <span className="font-bold text-emerald-800 text-sm">{availablePlayers.length} cracks</span>
              </div>
            </div>
          )}

          {draftMode === 'teams' && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-tech text-slate-600 flex items-center justify-between">
              <span>Equipos Restantes en Bombo:</span>
              <span className="font-bold text-emerald-700 text-sm">{bomboTeams.length} disponibles</span>
            </div>
          )}

          {draftMode === 'players' && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1 flex items-center justify-between">
                  <span>Tope de Cracks Elite por Plantilla</span>
                  <span className="text-emerald-700 font-black text-xs bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    Máx. {maxTopPlayers} Top Cracks
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-bold font-mono">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setMaxTopPlayers(num)}
                      className={`py-1.5 rounded-lg border transition text-center ${
                        maxTopPlayers === num
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num} {num === 1 ? 'Crack' : 'Cracks'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateFullSquadDraft}
                disabled={isSpinning}
                className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-[#00ba68] text-white py-3.5 px-4 rounded-xl text-xs font-black uppercase shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-102 transition border border-emerald-400/40"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                ⚡ Draft Equitativo (22 Jugadores • Máx {maxTopPlayers} Top)
              </button>
              <p className="text-[10px] text-slate-500 font-tech text-center">
                Garantiza equidad: Máx {maxTopPlayers} Cracks (+86 OVR) + 19 Jugadores Competitivos (78-85 OVR)
              </p>
            </div>
          )}

          <button
            onClick={draftMode === 'players' ? handleStartPlayerDraw : handleStartTeamDraw}
            disabled={isSpinning || (draftMode === 'players' ? availablePlayers.length === 0 : bomboTeams.length === 0)}
            className="w-full fc-button-primary py-3 text-xs font-extrabold uppercase shadow-md flex items-center justify-center gap-2 hover:scale-102 transition disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning
              ? (draftMode === 'players' ? 'Sorteando Jugador...' : 'Sorteando Equipo...')
              : (draftMode === 'players' ? 'Sortear 1 Jugador Individual' : 'Sortear 1 Equipo')}
          </button>

          {/* Insignia / Banner Oficial FIFAMANIAKOS FC 27 para rellenar el espacio inferior */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-md relative overflow-hidden flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00ba68] to-emerald-800 text-white flex items-center justify-center font-display font-black text-xl italic tracking-tighter fc-badge-triangle shadow-lg mb-2">
                FMK
              </div>
              <h4 className="font-display font-black text-sm uppercase italic tracking-wide text-white">
                FIFAMANIAKOS <span className="text-[#02f59b]">FC 27</span>
              </h4>
              <p className="text-[10px] text-slate-300 font-tech">
                Liga Online Oficial & Draft System
              </p>
            </div>
          </div>
        </div>

        {/* Resultado del Draft (Tema Claro & Vista por Filas) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Muestra de Plantilla Completa de 22 Jugadores Sorteada (Tema Claro) */}
          {draftMode === 'players' && lastSquadGenerated && (
            <div className="fc-card p-6 rounded-2xl bg-white border-2 border-emerald-500 text-slate-900 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    ⚡ Draft Completo Generado
                  </span>
                  <h3 className="font-display font-black text-xl text-slate-900 uppercase italic tracking-wide mt-1">
                    Plantilla Asignada a: {lastSquadGenerated.managerName}
                  </h3>
                </div>
                <div className="text-xs font-tech text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  Total: 22 Jugadores (+{minRating} OVR)
                </div>
              </div>

              <div className="space-y-4 text-xs font-tech max-h-[520px] overflow-y-auto pr-2 border-t border-slate-100 pt-3">
                {/* 2 PORTEROS */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-emerald-800 uppercase text-[11px] mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                    🧤 Porteros (2)
                  </h4>
                  <div className="flex flex-col gap-2">
                    {lastSquadGenerated.players.filter(p => ['POR', 'GK'].includes(p.position)).map((p, idx) => renderPlayerRow(p, idx))}
                  </div>
                </div>

                {/* 7 DEFENSAS */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-emerald-800 uppercase text-[11px] mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                    🛡️ Defensas (7)
                  </h4>
                  <div className="flex flex-col gap-2">
                    {lastSquadGenerated.players.filter(p => ['DFC', 'LD', 'LI', 'CAD', 'CAI'].includes(p.position)).map((p, idx) => renderPlayerRow(p, idx))}
                  </div>
                </div>

                {/* 7 MEDIOCAMPISTAS */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-emerald-800 uppercase text-[11px] mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                    ⚙️ Mediocampistas (7)
                  </h4>
                  <div className="flex flex-col gap-2">
                    {lastSquadGenerated.players.filter(p => ['MC', 'MCD', 'MCO', 'MI', 'MD'].includes(p.position)).map((p, idx) => renderPlayerRow(p, idx))}
                  </div>
                </div>

                {/* 6 DELANTEROS */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-emerald-800 uppercase text-[11px] mb-2 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                    ⚽ Delanteros (6)
                  </h4>
                  <div className="flex flex-col gap-2">
                    {lastSquadGenerated.players.filter(p => ['DC', 'EI', 'ED', 'SD'].includes(p.position)).map((p, idx) => renderPlayerRow(p, idx))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Animación/Ruleta Individual (Solo visible cuando se gira la ruleta o hay selección individual) */}
          {(isSpinning || (draftMode === 'players' ? highlightedPlayer : highlightedPreset)) && (
            <div className="fc-card p-6 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-lg text-center space-y-4 relative overflow-hidden flex flex-col justify-center items-center">
              <span className="text-xs font-tech text-emerald-600 uppercase tracking-widest font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Resultado Sorteo Individual
              </span>

              {/* Resultado Modo Jugadores */}
              {draftMode === 'players' && highlightedPlayer && (
                <div className={`space-y-3 transition-all duration-150 ${isSpinning ? 'scale-95 opacity-80 blur-xs' : 'scale-100 opacity-100'}`}>
                  <div className="w-28 h-28 mx-auto rounded-2xl bg-slate-100 border-2 border-emerald-500 p-2 shadow-md flex items-center justify-center relative overflow-hidden">
                    <img
                      src={highlightedPlayer.photoUrl}
                      alt={highlightedPlayer.name}
                      className="max-h-full max-w-full object-cover rounded-xl"
                    />
                    <div className="absolute top-1 left-1 bg-emerald-600 px-2 py-0.5 rounded text-[11px] font-black text-white">
                      {highlightedPlayer.rating}
                    </div>
                  </div>

                  <div>
                    <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                      {highlightedPlayer.name}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold border border-emerald-300">
                        {highlightedPlayer.position}
                      </span>
                      <span className="text-xs text-slate-600 font-tech">
                        {highlightedPlayer.nationality} • {highlightedPlayer.clubName || 'Agente Libre'}
                      </span>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-tech font-bold text-xs">
                      👤 Asignado a: <span className="text-slate-900 font-black uppercase">{assignedDTName || 'DT Participante'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resultado Modo Equipos */}
              {draftMode === 'teams' && highlightedPreset && (
                <div className={`space-y-3 transition-all duration-150 ${isSpinning ? 'scale-95 opacity-80 blur-xs' : 'scale-100 opacity-100'}`}>
                  <div className="w-28 h-28 mx-auto rounded-2xl bg-slate-50 border-2 border-emerald-500 p-3 shadow-md flex items-center justify-center">
                    <ClubLogo
                      src={highlightedPreset.logoUrl}
                      alt={highlightedPreset.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                      {highlightedPreset.name}
                    </h2>
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-tech font-bold text-xs">
                      👤 Asignado a: <span className="text-slate-900 font-black uppercase">{assignedDTName || 'DT Participante'}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-tech block mt-1">
                      🏟️ Estadio: {highlightedPreset.stadium} • Presupuesto: €{(highlightedPreset.budget || 100000000).toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Historial de Asignaciones Recientes */}
          {lotteryHistory.length > 0 && (
            <div className="fc-card p-5 rounded-2xl bg-white border-slate-200 shadow-md space-y-3">
              <h4 className="font-display font-black text-sm text-slate-900 uppercase italic flex items-center gap-2 border-b border-slate-100 pb-2">
                <Award className="w-4 h-4 text-emerald-600" /> Historial de Asignaciones Recientes
              </h4>

              <div className="divide-y divide-slate-100 text-xs font-tech">
                {lotteryHistory.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.imgUrl} alt={item.title} className="w-8 h-8 object-contain rounded" />
                      <div>
                        <strong className="text-slate-900 font-bold">{item.title}</strong>
                        <span className="block text-[10px] text-slate-500">Para: @{item.manager} ({item.subtext})</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold rounded text-[10px]">
                      {item.badge || 'Sorteado'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

