import React, { useState } from 'react';
import { Club, MatchResult, Player } from '../types';
import { GET_OFFICIAL_SQUAD_BY_CLUB_NAME } from '../data/officialCurrentSquads';
import { FileSpreadsheet, CheckCircle2, Shield, Upload, Trophy, AlertCircle, Calendar, Eye, Image as ImageIcon, ArrowRight, Plus, X } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import confetti from 'canvas-confetti';

interface MatchReporterProps {
  clubs: Club[];
  matches?: MatchResult[];
  players?: Player[];
  onAddMatchResult: (result: MatchResult) => void;
  currentClub: Club | null;
  onNavigateToTab?: (tab: string) => void;
}

export const MatchReporter: React.FC<MatchReporterProps> = ({
  clubs,
  matches = [],
  players = [],
  onAddMatchResult,
  currentClub,
  onNavigateToTab
}) => {
  const [matchday, setMatchday] = useState(1);
  const [competition, setCompetition] = useState<string>('1ra División');
  const [homeClubId, setHomeClubId] = useState(currentClub ? currentClub.id : (clubs[0]?.id || ''));
  const [awayClubId, setAwayClubId] = useState(clubs[1]?.id || '');
  const [homeGoals, setHomeGoals] = useState(0);
  const [awayGoals, setAwayGoals] = useState(0);
  const [homeScorers, setHomeScorers] = useState('');
  const [awayScorers, setAwayScorers] = useState('');
  const [homeAssists, setHomeAssists] = useState('');
  const [awayAssists, setAwayAssists] = useState('');
  const [homeYellowCards, setHomeYellowCards] = useState('');
  const [awayYellowCards, setAwayYellowCards] = useState('');
  const [homeRedCards, setHomeRedCards] = useState('');
  const [awayRedCards, setAwayRedCards] = useState('');
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [filterMatchday, setFilterMatchday] = useState<number | 'TODAS'>('TODAS');

  const homeClub = clubs.find(c => c.id === homeClubId) || clubs[0];
  const awayClub = clubs.find(c => c.id === awayClubId) || clubs[1];

  // Obtener lista de jugadores de la plantilla ACTUAL (EA FC 27) según el club seleccionado
  const getClubPlayersList = (club?: Club) => {
    if (!club) return [];

    // 1. Jugadores fichados o registrados en la plantilla del club
    const clubSquadPlayers = players.filter(p => p.clubId === club.id);
    if (clubSquadPlayers.length > 0) {
      return clubSquadPlayers.map(p => ({ name: p.name, pos: p.position }));
    }

    // 2. Plantilla Oficial Actual EA FC 27
    const officialSquad = GET_OFFICIAL_SQUAD_BY_CLUB_NAME(club.name);
    if (officialSquad.length > 0) {
      return officialSquad.map(sp => ({ name: sp.name, pos: sp.position }));
    }

    return [];
  };

  const homeSquad = getClubPlayersList(homeClub);
  const awaySquad = getClubPlayersList(awayClub);

  // Helper para añadir jugador a un campo de texto
  const appendPlayerToField = (
    currentText: string,
    setText: (val: string) => void,
    playerName: string,
    withMinute: boolean = true
  ) => {
    if (!playerName) return;
    const formatted = withMinute ? `${playerName} (min ')'` : `${playerName} (1)`;
    if (!currentText.trim()) {
      setText(formatted);
    } else {
      setText(`${currentText}, ${formatted}`);
    }
  };


  // Helper para extraer eventos detallados por jugador a partir del texto ingresado
  const parseTextToEvents = (text: string, clubId: string, eventType: 'GOAL' | 'ASSIST' | 'YELLOW_CARD' | 'RED_CARD') => {
    if (!text || text === '-') return [];
    const events: Array<{ clubId: string; playerName: string; type: 'GOAL' | 'ASSIST' | 'YELLOW_CARD' | 'RED_CARD'; count: number }> = [];
    const items = text.split(',');

    items.forEach(item => {
      const clean = item.trim();
      if (!clean) return;
      // Extraer nombre eliminando formato (min ') o (1)
      const name = clean.split('(')[0].trim();
      if (name) {
        events.push({
          clubId,
          playerName: name,
          type: eventType,
          count: 1
        });
      }
    });

    return events;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeClubId || !awayClubId || homeClubId === awayClubId) {
      alert('Por favor selecciona dos clubes diferentes para el partido.');
      return;
    }

    // Generar playerEvents de manera automática para acumular en tablas
    const playerEvents = [
      ...parseTextToEvents(homeScorers, homeClubId, 'GOAL'),
      ...parseTextToEvents(awayScorers, awayClubId, 'GOAL'),
      ...parseTextToEvents(homeAssists, homeClubId, 'ASSIST'),
      ...parseTextToEvents(awayAssists, awayClubId, 'ASSIST'),
      ...parseTextToEvents(homeYellowCards, homeClubId, 'YELLOW_CARD'),
      ...parseTextToEvents(awayYellowCards, awayClubId, 'YELLOW_CARD'),
      ...parseTextToEvents(homeRedCards, homeClubId, 'RED_CARD'),
      ...parseTextToEvents(awayRedCards, awayClubId, 'RED_CARD')
    ];

    const newMatch: MatchResult = {
      id: `match-${Date.now()}`,
      matchday: Number(matchday),
      competition,
      homeClubId,
      awayClubId,
      homeGoals: Number(homeGoals),
      awayGoals: Number(awayGoals),
      homeScorers: homeScorers || '-',
      awayScorers: awayScorers || '-',
      homeAssists: homeAssists || undefined,
      awayAssists: awayAssists || undefined,
      homeYellowCards: homeYellowCards || undefined,
      awayYellowCards: awayYellowCards || undefined,
      homeRedCards: homeRedCards || undefined,
      awayRedCards: awayRedCards || undefined,
      proofImageUrl: proofImageUrl || undefined,
      playerEvents,
      status: 'CONFIRMADO',
      createdAt: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
      notes
    };

    onAddMatchResult(newMatch);


    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setHomeGoals(0);
      setAwayGoals(0);
      setHomeScorers('');
      setAwayScorers('');
      setHomeAssists('');
      setAwayAssists('');
      setHomeYellowCards('');
      setAwayYellowCards('');
      setHomeRedCards('');
      setAwayRedCards('');
      setProofImageUrl('');
      setNotes('');
    }, 3500);
  };


  const filteredMatches = matches.filter(m => filterMatchday === 'TODAS' || m.matchday === filterMatchday);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="fc-card p-6 md:p-8 rounded-2xl border-emerald-300 bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white text-center space-y-2 shadow-xl">
        <span className="px-3 py-1 bg-[#02f59b] text-black text-xs font-bold font-tech uppercase rounded tracking-wider inline-block">
          Acta Oficial de Partido FIFAMANIAKOS
        </span>
        <h1 className="font-display font-black text-3xl text-white uppercase italic tracking-wide">
          Reportar Resultado de Partido
        </h1>
        <p className="text-xs text-emerald-100 max-w-lg mx-auto">
          Ingresa los goles, goleadores y opcionalmente adjunta una imagen o captura en caso de disputas o dudas para actualizar la tabla de posiciones en tiempo real.
        </p>
      </div>

      {submitted ? (
        <div className="fc-card p-8 rounded-2xl border-[#00ba68] bg-emerald-50/50 text-center space-y-4 animate-scale-up">
          <CheckCircle2 className="w-16 h-16 text-[#00ba68] mx-auto animate-bounce" />
          <h2 className="font-display font-extrabold text-2xl text-slate-900 uppercase italic">
            ¡Resultado Publicado y Validado!
          </h2>
          <p className="text-xs text-slate-700 max-w-md mx-auto">
            El partido ha sido registrado exitosamente en la Liga FC 27. La tabla de clasificación y estadísticas se han actualizado en tiempo real y ya es visible en la lista de abajo.
          </p>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('clasificacion')}
              className="px-6 py-2.5 bg-[#00ba68] hover:bg-emerald-700 text-white font-tech font-extrabold text-xs uppercase rounded-xl inline-flex items-center gap-2 shadow-md transition-colors"
            >
              <Trophy className="w-4 h-4" /> Ir a Ver Tabla de Clasificación <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="fc-card p-6 md:p-8 rounded-2xl border-slate-200 space-y-6 shadow-md">
          {/* Competition & Matchday Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase font-tech text-slate-700">Competición:</span>
              <select
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                className="bg-white border border-slate-300 text-xs font-extrabold text-slate-900 px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#00ba68]"
              >
                <option value="1ra División">⚽ 1ra División</option>
                <option value="2da División">⚽ 2da División</option>
                <option value="UEFA Champions League">⭐ UEFA Champions League</option>
                <option value="UEFA Europa League">🟠 UEFA Europa League</option>
                <option value="UEFA Conference League">🟢 UEFA Conference League</option>
                <option value="Supercopa de Europa">🏆 Supercopa de Europa</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase font-tech text-slate-700">Jornada / Fase:</span>
              <select
                value={matchday}
                onChange={(e) => setMatchday(Number(e.target.value))}
                className="bg-white border border-slate-300 text-xs font-bold text-emerald-800 px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#00ba68]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(j => (
                  <option key={j} value={j}>Jornada {j}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Teams Scoreboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center bg-slate-50 p-5 rounded-2xl border border-slate-200">
            {/* Home Team */}
            <div className="md:col-span-2 text-center space-y-3">
              <label className="block text-xs font-bold font-tech uppercase text-slate-600">Club Local</label>
              <select
                value={homeClubId}
                onChange={(e) => setHomeClubId(e.target.value)}
                className="w-full bg-white border border-slate-300 text-xs font-bold text-slate-900 p-2 rounded-lg focus:outline-none focus:border-[#00ba68]"
              >
                {clubs.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.manager})</option>
                ))}
              </select>

              {homeClub && (
                <div className="flex flex-col items-center gap-2">
                  <img src={homeClub.logoUrl} alt={homeClub.name} className="w-16 h-16 rounded-xl object-cover border-2 border-[#00ba68]" />
                  <span className="font-display font-extrabold text-sm text-slate-900">{homeClub.name}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] text-slate-500 font-mono mb-1">Goles Local</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={homeGoals}
                  onChange={(e) => setHomeGoals(Number(e.target.value))}
                  className="w-20 mx-auto text-center font-display font-black text-3xl bg-white border-2 border-[#00ba68] text-emerald-700 rounded-lg p-1"
                />
              </div>
            </div>

            {/* VS Badge */}
            <div className="text-center font-display font-black text-2xl text-slate-400 italic my-2 md:my-0">
              VS
            </div>

            {/* Away Team */}
            <div className="md:col-span-2 text-center space-y-3">
              <label className="block text-xs font-bold font-tech uppercase text-slate-600">Club Visitante</label>
              <select
                value={awayClubId}
                onChange={(e) => setAwayClubId(e.target.value)}
                className="w-full bg-white border border-slate-300 text-xs font-bold text-slate-900 p-2 rounded-lg focus:outline-none focus:border-[#00ba68]"
              >
                {clubs.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.manager})</option>
                ))}
              </select>

              {awayClub && (
                <div className="flex flex-col items-center gap-2">
                  <img src={awayClub.logoUrl} alt={awayClub.name} className="w-16 h-16 rounded-xl object-cover border-2 border-slate-300" />
                  <span className="font-display font-extrabold text-sm text-slate-900">{awayClub.name}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] text-slate-500 font-mono mb-1">Goles Visitante</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={awayGoals}
                  onChange={(e) => setAwayGoals(Number(e.target.value))}
                  className="w-20 mx-auto text-center font-display font-black text-3xl bg-white border-2 border-slate-300 text-slate-900 rounded-lg p-1"
                />
              </div>
            </div>
          </div>

          {/* Scorers details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold font-tech uppercase text-slate-700">
                  ⚽ Goleadores (Local)
                </label>
                {homeSquad.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        appendPlayerToField(homeScorers, setHomeScorers, e.target.value, true);
                        e.target.value = '';
                      }
                    }}
                    className="text-[11px] bg-[#00ba68]/10 text-emerald-800 font-bold border border-emerald-300 rounded px-2 py-0.5 focus:outline-none"
                  >
                    <option value="">+ Elegir Goleador ({homeClub?.shortName})</option>
                    {homeSquad.map((p, i) => (
                      <option key={i} value={p.name}>⚽ {p.name} ({p.pos})</option>
                    ))}
                  </select>
                )}
              </div>
              <input
                type="text"
                value={homeScorers}
                onChange={(e) => setHomeScorers(e.target.value)}
                placeholder="Ej: Mbappé (12', 88'), Vinícius (45')"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold font-tech uppercase text-slate-700">
                  ⚽ Goleadores (Visitante)
                </label>
                {awaySquad.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        appendPlayerToField(awayScorers, setAwayScorers, e.target.value, true);
                        e.target.value = '';
                      }
                    }}
                    className="text-[11px] bg-[#00ba68]/10 text-emerald-800 font-bold border border-emerald-300 rounded px-2 py-0.5 focus:outline-none"
                  >
                    <option value="">+ Elegir Goleador ({awayClub?.shortName})</option>
                    {awaySquad.map((p, i) => (
                      <option key={i} value={p.name}>⚽ {p.name} ({p.pos})</option>
                    ))}
                  </select>
                )}
              </div>
              <input
                type="text"
                value={awayScorers}
                onChange={(e) => setAwayScorers(e.target.value)}
                placeholder="Ej: Lewandowski (30'), Lamine (65')"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>
          </div>

          {/* Assists details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold font-tech uppercase text-slate-700">
                  👟 Asistencias (Local)
                </label>
                {homeSquad.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        appendPlayerToField(homeAssists, setHomeAssists, e.target.value, false);
                        e.target.value = '';
                      }
                    }}
                    className="text-[11px] bg-slate-200 text-slate-800 font-bold border border-slate-300 rounded px-2 py-0.5 focus:outline-none"
                  >
                    <option value="">+ Elegir Asistente ({homeClub?.shortName})</option>
                    {homeSquad.map((p, i) => (
                      <option key={i} value={p.name}>👟 {p.name} ({p.pos})</option>
                    ))}
                  </select>
                )}
              </div>
              <input
                type="text"
                value={homeAssists}
                onChange={(e) => setHomeAssists(e.target.value)}
                placeholder="Ej: Bellingham (1), Modric (1)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold font-tech uppercase text-slate-700">
                  👟 Asistencias (Visitante)
                </label>
                {awaySquad.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        appendPlayerToField(awayAssists, setAwayAssists, e.target.value, false);
                        e.target.value = '';
                      }
                    }}
                    className="text-[11px] bg-slate-200 text-slate-800 font-bold border border-slate-300 rounded px-2 py-0.5 focus:outline-none"
                  >
                    <option value="">+ Elegir Asistente ({awayClub?.shortName})</option>
                    {awaySquad.map((p, i) => (
                      <option key={i} value={p.name}>👟 {p.name} ({p.pos})</option>
                    ))}
                  </select>
                )}
              </div>
              <input
                type="text"
                value={awayAssists}
                onChange={(e) => setAwayAssists(e.target.value)}
                placeholder="Ej: Pedri (1), Raphinha (1)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>
          </div>

          {/* Cards details (Yellow & Red) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
            {/* Home Cards */}
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold font-tech uppercase text-amber-900 flex items-center gap-1">
                    <span className="w-2.5 h-3.5 bg-amber-400 rounded-xs inline-block" /> Tarjetas Amarillas (Local)
                  </label>
                  {homeSquad.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          appendPlayerToField(homeYellowCards, setHomeYellowCards, e.target.value, true);
                          e.target.value = '';
                        }
                      }}
                      className="text-[10px] bg-amber-200 text-amber-900 font-bold rounded px-1.5 py-0.5"
                    >
                      <option value="">+ Amarilla ({homeClub?.shortName})</option>
                      {homeSquad.map((p, i) => (
                        <option key={i} value={p.name}>🟨 {p.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <input
                  type="text"
                  value={homeYellowCards}
                  onChange={(e) => setHomeYellowCards(e.target.value)}
                  placeholder="Ej: Carvajal (25'), Bellingham (70')"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold font-tech uppercase text-rose-900 flex items-center gap-1">
                    <span className="w-2.5 h-3.5 bg-rose-600 rounded-xs inline-block" /> Tarjetas Rojas (Local)
                  </label>
                  {homeSquad.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          appendPlayerToField(homeRedCards, setHomeRedCards, e.target.value, true);
                          e.target.value = '';
                        }
                      }}
                      className="text-[10px] bg-rose-200 text-rose-900 font-bold rounded px-1.5 py-0.5"
                    >
                      <option value="">+ Roja ({homeClub?.shortName})</option>
                      {homeSquad.map((p, i) => (
                        <option key={i} value={p.name}>🟥 {p.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <input
                  type="text"
                  value={homeRedCards}
                  onChange={(e) => setHomeRedCards(e.target.value)}
                  placeholder="Ej: Rüdiger (88')"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Away Cards */}
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold font-tech uppercase text-amber-900 flex items-center gap-1">
                    <span className="w-2.5 h-3.5 bg-amber-400 rounded-xs inline-block" /> Tarjetas Amarillas (Visitante)
                  </label>
                  {awaySquad.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          appendPlayerToField(awayYellowCards, setAwayYellowCards, e.target.value, true);
                          e.target.value = '';
                        }
                      }}
                      className="text-[10px] bg-amber-200 text-amber-900 font-bold rounded px-1.5 py-0.5"
                    >
                      <option value="">+ Amarilla ({awayClub?.shortName})</option>
                      {awaySquad.map((p, i) => (
                        <option key={i} value={p.name}>🟨 {p.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <input
                  type="text"
                  value={awayYellowCards}
                  onChange={(e) => setAwayYellowCards(e.target.value)}
                  placeholder="Ej: Gavi (40'), Araujo (80')"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold font-tech uppercase text-rose-900 flex items-center gap-1">
                    <span className="w-2.5 h-3.5 bg-rose-600 rounded-xs inline-block" /> Tarjetas Rojas (Visitante)
                  </label>
                  {awaySquad.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          appendPlayerToField(awayRedCards, setAwayRedCards, e.target.value, true);
                          e.target.value = '';
                        }
                      }}
                      className="text-[10px] bg-rose-200 text-rose-900 font-bold rounded px-1.5 py-0.5"
                    >
                      <option value="">+ Roja ({awayClub?.shortName})</option>
                      {awaySquad.map((p, i) => (
                        <option key={i} value={p.name}>🟥 {p.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <input
                  type="text"
                  value={awayRedCards}
                  onChange={(e) => setAwayRedCards(e.target.value)}
                  placeholder="Ej: De Jong (90')"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>


          {/* Image Upload Proof (Optional for Disputes) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold font-tech text-slate-700 uppercase">
              <Upload className="w-4 h-4 text-emerald-600" /> Captura o Imagen de Prueba (Opcional - En caso de disputa o duda)
            </div>
            <p className="text-[11px] text-slate-500 font-tech">
              Solo adjunta una imagen si requieres dejar constancia visual para resolver cualquier desacuerdo o duda sobre el partido.
            </p>
            <ImageUploader
              value={proofImageUrl}
              onChange={setProofImageUrl}
              label="Adjuntar imagen de prueba (Opcional)"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold font-tech uppercase text-slate-700 mb-1">
              Notas adicionales o incidencias (Opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Partido sin tarjetas rojas. Buena conexión sin lag."
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
            />
          </div>

          <button
            type="submit"
            className="w-full fc-button-primary py-3 text-sm font-extrabold uppercase shadow-md hover:brightness-105"
          >
            Enviar y Validar Resultado en la Liga
          </button>
        </form>
      )}

      {/* Reported Matches List Section */}
      <div className="fc-card p-6 md:p-8 rounded-2xl border-slate-200 space-y-6 shadow-md bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-display font-extrabold text-xl text-slate-900 uppercase italic flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-[#00ba68]" /> Actas y Resultados Registrados ({matches.length})
            </h2>
            <p className="text-xs text-slate-500 font-tech">
              Historial en vivo de todos los partidos reportados y convalidados en la liga.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-tech">
              <span className="text-slate-600 font-bold uppercase">Filtrar:</span>
              <select
                value={filterMatchday}
                onChange={(e) => setFilterMatchday(e.target.value === 'TODAS' ? 'TODAS' : Number(e.target.value))}
                className="bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 px-3 py-1.5 rounded-lg focus:outline-none"
              >
                <option value="TODAS">Todas las Jornadas</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(j => (
                  <option key={j} value={j}>Jornada {j}</option>
                ))}
              </select>
            </div>

            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('clasificacion')}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-[#02f59b] font-tech font-extrabold text-xs uppercase rounded-lg inline-flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Trophy className="w-4 h-4" /> Ver Tabla
              </button>
            )}
          </div>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-xs font-tech text-slate-600 font-bold">
              {matches.length === 0
                ? 'Aún no se han registrado partidos en la liga.'
                : 'No hay partidos registrados para la jornada seleccionada.'}
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Utiliza el formulario superior para enviar el resultado de tu partido y actualizar la tabla de clasificación.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMatches.map(match => {
              const home = clubs.find(c => c.id === match.homeClubId);
              const away = clubs.find(c => c.id === match.awayClubId);

              return (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="fc-card fc-card-hover p-4 rounded-xl cursor-pointer border-slate-200 bg-slate-50/50 hover:bg-white flex flex-col md:flex-row items-center justify-between gap-4 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2 text-xs font-tech font-bold text-emerald-800">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-300 uppercase">
                      Jornada {match.matchday}
                    </span>
                    <span className="text-slate-400 text-[11px] font-mono">{match.createdAt}</span>
                  </div>

                  {/* Scoreboard */}
                  <div className="flex items-center justify-center gap-4 flex-1 max-w-md w-full">
                    {/* Home */}
                    <div className="flex items-center gap-2 text-right flex-1 justify-end">
                      <span className="font-display font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {home?.name || 'Local'}
                      </span>
                      {home && <img src={home.logoUrl} alt={home.name} className="w-7 h-7 rounded object-cover border border-slate-200 shrink-0" />}
                    </div>

                    {/* Result Score */}
                    <div className="px-3.5 py-1 bg-slate-900 rounded-lg border border-emerald-500 font-display font-black text-lg text-[#02f59b] tracking-wider shrink-0 flex items-center gap-2 shadow-sm">
                      <span>{match.homeGoals}</span>
                      <span className="text-slate-500 text-xs">-</span>
                      <span>{match.awayGoals}</span>
                    </div>

                    {/* Away */}
                    <div className="flex items-center gap-2 text-left flex-1 justify-start">
                      {away && <img src={away.logoUrl} alt={away.name} className="w-7 h-7 rounded object-cover border border-slate-200 shrink-0" />}
                      <span className="font-display font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {away?.name || 'Visitante'}
                      </span>
                    </div>
                  </div>

                  {/* Proof badge & View detail */}
                  <div className="flex items-center gap-2 shrink-0">
                    {match.proofImageUrl && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md flex items-center gap-1 text-[10px] font-tech font-bold">
                        <ImageIcon className="w-3 h-3 text-emerald-700" /> Captura Adjunta
                      </span>
                    )}

                    <span className="px-2.5 py-1 bg-slate-200 text-slate-800 hover:bg-slate-300 text-[11px] font-tech font-bold uppercase rounded-lg flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Detalle
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Match Proof Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-lg w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <CheckCircle2 className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Acta Oficial
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">Jornada {selectedMatch.matchday} • {selectedMatch.competition}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMatch(null)} 
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2 py-2 bg-slate-50 rounded-xl border border-slate-100 p-4">
              <div className="font-display font-black text-4xl text-slate-900 tracking-tight">
                {selectedMatch.homeGoals} - {selectedMatch.awayGoals}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Fecha de Registro: {selectedMatch.createdAt}
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-sans bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><strong className="text-[#00ba68]">Goleadores Local:</strong> {selectedMatch.homeScorers}</p>
              <p><strong className="text-[#00ba68]">Goleadores Visitante:</strong> {selectedMatch.awayScorers}</p>
              {selectedMatch.notes && <p className="text-slate-600 italic">"{selectedMatch.notes}"</p>}
            </div>

            {selectedMatch.proofImageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                <img src={selectedMatch.proofImageUrl} alt="Prueba de Partido FC 27" className="w-full object-cover max-h-72" />
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedMatch(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

