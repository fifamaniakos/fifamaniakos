import React, { useState } from 'react';
import { Club, MatchResult, Player, PlayerMatchEvent } from '../../types';
import { GET_OFFICIAL_SQUAD_BY_CLUB_NAME } from '../../data/officialCurrentSquads';
import { PHASE_LABELS } from '../../utils/competitionStats';
import { ArrowLeft, ChevronRight, Image as ImageIcon, CheckCircle2, PlusCircle, Upload, X } from 'lucide-react';
import { ImageUploader } from '../ImageUploader';
import { CompetitionLogo } from './CompetitionLogo';
import { Modal } from '../Modal';
import { ClubLogo } from '../ClubLogo';
import { ImageWithFallback } from '../ImageWithFallback';

interface FixtureJornadaDetailProps {
  clubs: Club[];
  players: Player[];
  matches: MatchResult[];
  roundLabel: string;
  competition: string;
  isAdmin?: boolean;
  currentClubId?: string;
  onAddMatchResult?: (match: MatchResult) => void;
  onBack: () => void;
}

const getClubPlayersList = (club: Club | undefined, players: Player[]) => {
  if (!club) return [];

  const clubSquadPlayers = players.filter(p => p.clubId === club.id);
  if (clubSquadPlayers.length > 0) {
    return clubSquadPlayers.map(p => ({ name: p.name, pos: p.position }));
  }

  const officialSquad = GET_OFFICIAL_SQUAD_BY_CLUB_NAME(club.name);
  if (officialSquad.length > 0) {
    return officialSquad.map(sp => ({ name: sp.name, pos: sp.position }));
  }

  return [];
};

const appendPlayerToField = (
  currentText: string,
  setText: (val: string) => void,
  playerName: string,
  withMinute: boolean
) => {
  if (!playerName) return;
  const formatted = withMinute ? `${playerName} (min ')'` : `${playerName} (1)`;
  if (!currentText.trim()) {
    setText(formatted);
  } else {
    setText(`${currentText}, ${formatted}`);
  }
};

const parseTextToEvents = (
  text: string,
  clubId: string,
  eventType: 'GOAL' | 'ASSIST' | 'YELLOW_CARD' | 'RED_CARD'
): PlayerMatchEvent[] => {
  if (!text || text === '-') return [];
  const events: PlayerMatchEvent[] = [];

  text.split(',').forEach(item => {
    const clean = item.trim();
    if (!clean) return;
    const name = clean.split('(')[0].trim();
    if (name) {
      events.push({ clubId, playerName: name, type: eventType, count: 1 });
    }
  });

  return events;
};

const matchRoundLabel = (match: MatchResult): string =>
  match.phase && match.phase !== 'GRUPOS' ? PHASE_LABELS[match.phase] : `Jornada ${match.matchday}`;

export const FixtureJornadaDetail: React.FC<FixtureJornadaDetailProps> = ({
  clubs,
  players,
  matches,
  roundLabel,
  competition,
  isAdmin = false,
  currentClubId,
  onAddMatchResult,
  onBack
}) => {
  // Un manager solo puede cargar el acta de sus propios partidos: la politica
  // RLS manager_update_own_pending_matches rechaza cualquier otro, asi que
  // mostrar el boton para partidos ajenos solo produce errores 403.
  const canReportMatch = (match: MatchResult) =>
    isAdmin ||
    (!!currentClubId &&
      (match.homeClubId === currentClubId || match.awayClubId === currentClubId));
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [reportingMatch, setReportingMatch] = useState<MatchResult | null>(null);
  const [reportHomeClubId, setReportHomeClubId] = useState<string>('');
  const [reportAwayClubId, setReportAwayClubId] = useState<string>('');
  const [reportHomeGoals, setReportHomeGoals] = useState<number>(0);
  const [reportAwayGoals, setReportAwayGoals] = useState<number>(0);
  const [reportHomeScorers, setReportHomeScorers] = useState<string>('');
  const [reportAwayScorers, setReportAwayScorers] = useState<string>('');
  const [reportHomeAssists, setReportHomeAssists] = useState<string>('');
  const [reportAwayAssists, setReportAwayAssists] = useState<string>('');
  const [reportHomeYellowCards, setReportHomeYellowCards] = useState<string>('');
  const [reportAwayYellowCards, setReportAwayYellowCards] = useState<string>('');
  const [reportHomeRedCards, setReportHomeRedCards] = useState<string>('');
  const [reportAwayRedCards, setReportAwayRedCards] = useState<string>('');
  const [reportProofImage, setReportProofImage] = useState<string>('');
  const [reportNotes, setReportNotes] = useState<string>('');
  const [reportPenaltyWinnerClubId, setReportPenaltyWinnerClubId] = useState<string>('');
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [formError, setFormError] = useState<string>('');
  const [successResult, setSuccessResult] = useState<{ homeGoals: number; awayGoals: number } | null>(null);

  const jornadaMatches = matches;
  const isKnockoutMatch = !!reportingMatch?.phase && reportingMatch.phase !== 'GRUPOS';
  const isDrawNeedingPenalties = isKnockoutMatch && reportHomeGoals === reportAwayGoals;

  const reportHomeClub = clubs.find(c => c.id === reportHomeClubId);
  const reportAwayClub = clubs.find(c => c.id === reportAwayClubId);
  const reportHomeSquad = getClubPlayersList(reportHomeClub, players);
  const reportAwaySquad = getClubPlayersList(reportAwayClub, players);

  const openReportModalForMatch = (match: MatchResult, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReportingMatch(match);
    setReportHomeClubId(match.homeClubId);
    setReportAwayClubId(match.awayClubId);
    setReportHomeGoals(match.homeGoals || 0);
    setReportAwayGoals(match.awayGoals || 0);
    setReportHomeScorers(match.homeScorers || '');
    setReportAwayScorers(match.awayScorers || '');
    setReportHomeAssists(match.homeAssists || '');
    setReportAwayAssists(match.awayAssists || '');
    setReportHomeYellowCards(match.homeYellowCards || '');
    setReportAwayYellowCards(match.awayYellowCards || '');
    setReportHomeRedCards(match.homeRedCards || '');
    setReportAwayRedCards(match.awayRedCards || '');
    setReportProofImage(match.proofImageUrl || '');
    setReportNotes(match.notes || '');
    setReportPenaltyWinnerClubId(match.penaltyWinnerClubId || '');
    setShowImageUploader(!!match.proofImageUrl);
    setFormError('');
  };

  const handleConfirmReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingMatch) return;

    if (!reportHomeClubId || !reportAwayClubId || reportHomeClubId === reportAwayClubId) {
      setFormError('Por favor selecciona dos clubes diferentes para el partido.');
      return;
    }

    if (isDrawNeedingPenalties && !reportPenaltyWinnerClubId) {
      setFormError('Es una eliminatoria a partido único: indicá quién ganó por penales para desempatar.');
      return;
    }

    const playerEvents = [
      ...parseTextToEvents(reportHomeScorers, reportHomeClubId, 'GOAL'),
      ...parseTextToEvents(reportAwayScorers, reportAwayClubId, 'GOAL'),
      ...parseTextToEvents(reportHomeAssists, reportHomeClubId, 'ASSIST'),
      ...parseTextToEvents(reportAwayAssists, reportAwayClubId, 'ASSIST'),
      ...parseTextToEvents(reportHomeYellowCards, reportHomeClubId, 'YELLOW_CARD'),
      ...parseTextToEvents(reportAwayYellowCards, reportAwayClubId, 'YELLOW_CARD'),
      ...parseTextToEvents(reportHomeRedCards, reportHomeClubId, 'RED_CARD'),
      ...parseTextToEvents(reportAwayRedCards, reportAwayClubId, 'RED_CARD')
    ];

    const updated: MatchResult = {
      ...reportingMatch,
      homeClubId: reportHomeClubId,
      awayClubId: reportAwayClubId,
      homeGoals: reportHomeGoals,
      awayGoals: reportAwayGoals,
      homeScorers: reportHomeScorers || '-',
      awayScorers: reportAwayScorers || '-',
      homeAssists: reportHomeAssists || undefined,
      awayAssists: reportAwayAssists || undefined,
      homeYellowCards: reportHomeYellowCards || undefined,
      awayYellowCards: reportAwayYellowCards || undefined,
      homeRedCards: reportHomeRedCards || undefined,
      awayRedCards: reportAwayRedCards || undefined,
      proofImageUrl: reportProofImage || undefined,
      notes: reportNotes || undefined,
      penaltyWinnerClubId: isDrawNeedingPenalties ? reportPenaltyWinnerClubId : undefined,
      playerEvents,
      reportedAt: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
      // Un admin puede confirmar el resultado directo; un manager solo puede
      // dejarlo en PENDIENTE (la politica RLS de manager_update_own_pending_matches
      // rechaza cualquier otro estado) a la espera de que un admin lo confirme
      // desde el Panel de Administracion.
      status: isAdmin ? 'CONFIRMADO' : 'PENDIENTE',
      createdAt: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
    };

    if (onAddMatchResult) {
      onAddMatchResult(updated);
    }
    setReportingMatch(null);
    setSuccessResult({ homeGoals: updated.homeGoals, awayGoals: updated.awayGoals });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-tech font-bold text-xs uppercase"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a Jornadas
      </button>

      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-md flex items-center gap-3">
        <CompetitionLogo competition={competition} size="md" />
        <div>
          <span className="text-[10px] font-bold uppercase font-tech text-[#02f59b] block">
            {competition}
          </span>
          <h2 className="text-lg font-display font-black uppercase italic text-white">
            {roundLabel}
          </h2>
        </div>
      </div>

      {jornadaMatches.length === 0 ? (
        <div className="fc-card p-10 text-center space-y-3 border-dashed border-slate-300 bg-white">
          <p className="text-xs font-tech font-bold text-slate-600">No hay partidos cargados para esta ronda.</p>
        </div>
      ) : (
        jornadaMatches.map(match => {
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
                  {matchRoundLabel(match)}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{match.createdAt}</span>
              </div>

              <div className="flex items-center justify-center gap-6 flex-1 max-w-lg w-full">
                <div className="flex items-center gap-3 text-right flex-1 justify-end">
                  <span className="font-display font-extrabold text-sm text-slate-900">{home?.name || 'Local'}</span>
                  <ClubLogo src={home?.logoUrl} alt={home?.name} className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0" />
                </div>

                <div className="px-4 py-1.5 bg-slate-900 rounded-lg border border-emerald-500 font-display font-black text-xl text-[#02f59b] tracking-wider shrink-0 flex items-center gap-2 shadow-sm">
                  <span>{match.homeGoals}</span>
                  <span className="text-slate-500 text-sm">-</span>
                  <span>{match.awayGoals}</span>
                </div>

                <div className="flex items-center gap-3 text-left flex-1 justify-start">
                  <ClubLogo src={away?.logoUrl} alt={away?.name} className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0" />
                  <span className="font-display font-extrabold text-sm text-slate-900">{away?.name || 'Visitante'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                {canReportMatch(match) && (
                  <button
                    onClick={(e) => openReportModalForMatch(match, e)}
                    className="px-3 py-1.5 bg-[#00ba68] hover:bg-[#00d282] text-white font-tech font-extrabold text-xs uppercase rounded-lg shadow flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" /> Reportar Resultado
                  </button>
                )}

                {match.proofImageUrl && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md flex items-center gap-1 text-[10px] font-tech font-bold hidden sm:flex">
                    <ImageIcon className="w-3 h-3 text-emerald-700" /> Captura Validada
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          );
        })
      )}

      {/* Modal Reportar Resultado */}
      <Modal
        isOpen={Boolean(reportingMatch)}
        onClose={() => setReportingMatch(null)}
        title={reportingMatch ? `Reportar Resultado · ${matchRoundLabel(reportingMatch)}` : ''}
        subtitle="Publica el marcador oficial y eventos del partido"
        badgeText="ACTA OFICIAL FIFAMANIAKOS"
        icon={<CheckCircle2 className="w-5 h-5 text-[#02f59b]" />}
        maxWidth="4xl"
      >
        {reportingMatch && (
            <form onSubmit={handleConfirmReport} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="md:col-span-2 flex items-center gap-3">
                  <ClubLogo src={reportHomeClub?.logoUrl} alt={reportHomeClub?.name} className="w-12 h-12 rounded-lg object-cover border-2 border-[#00ba68] shrink-0" />
                  <select
                    value={reportHomeClubId}
                    onChange={(e) => setReportHomeClubId(e.target.value)}
                    className="flex-1 min-w-0 bg-white border border-slate-300 text-sm font-bold text-slate-900 p-2.5 rounded-lg focus:outline-none focus:border-[#00ba68]"
                  >
                    {clubs.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.manager})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={reportHomeGoals}
                    onChange={(e) => setReportHomeGoals(Number(e.target.value))}
                    className="w-16 text-center font-display font-black text-2xl bg-white border-2 border-[#00ba68] text-emerald-700 rounded-lg p-1.5 shrink-0"
                  />
                </div>

                <div className="text-center font-display font-black text-base text-slate-400 italic">
                  VS
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={reportAwayGoals}
                    onChange={(e) => setReportAwayGoals(Number(e.target.value))}
                    className="w-16 text-center font-display font-black text-2xl bg-white border-2 border-slate-300 text-slate-900 rounded-lg p-1.5 shrink-0"
                  />
                  <select
                    value={reportAwayClubId}
                    onChange={(e) => setReportAwayClubId(e.target.value)}
                    className="flex-1 min-w-0 bg-white border border-slate-300 text-sm font-bold text-slate-900 p-2.5 rounded-lg focus:outline-none focus:border-[#00ba68]"
                  >
                    {clubs.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.manager})</option>
                    ))}
                  </select>
                  <ClubLogo src={reportAwayClub?.logoUrl} alt={reportAwayClub?.name} className="w-12 h-12 rounded-lg object-cover border-2 border-slate-300 shrink-0" />
                </div>
              </div>

              {isDrawNeedingPenalties && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                  <p className="text-[11px] font-bold font-tech uppercase text-indigo-800">
                    Empate en eliminatoria a partido único · ¿Quién ganó por penales?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReportPenaltyWinnerClubId(reportHomeClubId)}
                      className={`px-3 py-2 rounded-lg text-xs font-tech font-bold uppercase border transition-colors ${
                        reportPenaltyWinnerClubId === reportHomeClubId
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'
                      }`}
                    >
                      {reportHomeClub?.name || 'Local'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportPenaltyWinnerClubId(reportAwayClubId)}
                      className={`px-3 py-2 rounded-lg text-xs font-tech font-bold uppercase border transition-colors ${
                        reportPenaltyWinnerClubId === reportAwayClubId
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'
                      }`}
                    >
                      {reportAwayClub?.name || 'Visitante'}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[11px] font-bold font-tech uppercase text-slate-700">⚽ Goleadores (Local)</label>
                    {reportHomeSquad.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            appendPlayerToField(reportHomeScorers, setReportHomeScorers, e.target.value, false);
                            e.target.value = '';
                          }
                        }}
                        className="text-[10px] bg-emerald-100 text-emerald-800 font-bold rounded px-1.5 py-0.5"
                      >
                        <option value="">+ Seleccionar de Plantilla</option>
                        {reportHomeSquad.map((p, i) => (
                          <option key={i} value={p.name}>{p.name} ({p.pos})</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <input
                    type="text"
                    value={reportHomeScorers}
                    onChange={(e) => setReportHomeScorers(e.target.value)}
                    placeholder="Ej: Mbappé (2), Vinicius"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#00ba68]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[11px] font-bold font-tech uppercase text-slate-700">⚽ Goleadores (Visitante)</label>
                    {reportAwaySquad.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            appendPlayerToField(reportAwayScorers, setReportAwayScorers, e.target.value, false);
                            e.target.value = '';
                          }
                        }}
                        className="text-[10px] bg-emerald-100 text-emerald-800 font-bold rounded px-1.5 py-0.5"
                      >
                        <option value="">+ Seleccionar de Plantilla</option>
                        {reportAwaySquad.map((p, i) => (
                          <option key={i} value={p.name}>{p.name} ({p.pos})</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <input
                    type="text"
                    value={reportAwayScorers}
                    onChange={(e) => setReportAwayScorers(e.target.value)}
                    placeholder="Ej: Lewandowski, Yamal"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#00ba68]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[11px] font-bold font-tech uppercase text-blue-900 flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-600 rounded-full inline-block" /> Asistencias (Local)
                    </label>
                    {reportHomeSquad.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            appendPlayerToField(reportHomeAssists, setReportHomeAssists, e.target.value, false);
                            e.target.value = '';
                          }
                        }}
                        className="text-[10px] bg-blue-100 text-blue-900 font-bold rounded px-1.5 py-0.5"
                      >
                        <option value="">+ Asistente</option>
                        {reportHomeSquad.map((p, i) => (
                          <option key={i} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <input
                    type="text"
                    value={reportHomeAssists}
                    onChange={(e) => setReportHomeAssists(e.target.value)}
                    placeholder="Ej: Kroos (2)"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[11px] font-bold font-tech uppercase text-blue-900 flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-600 rounded-full inline-block" /> Asistencias (Visitante)
                    </label>
                    {reportAwaySquad.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            appendPlayerToField(reportAwayAssists, setReportAwayAssists, e.target.value, false);
                            e.target.value = '';
                          }
                        }}
                        className="text-[10px] bg-blue-100 text-blue-900 font-bold rounded px-1.5 py-0.5"
                      >
                        <option value="">+ Asistente</option>
                        {reportAwaySquad.map((p, i) => (
                          <option key={i} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <input
                    type="text"
                    value={reportAwayAssists}
                    onChange={(e) => setReportAwayAssists(e.target.value)}
                    placeholder="Ej: Pedri"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[10px] font-bold font-tech uppercase text-amber-900 flex items-center gap-1">
                        <span className="w-2 h-3 bg-amber-500 rounded-xs inline-block" /> Amarillas (Local)
                      </label>
                      {reportHomeSquad.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              appendPlayerToField(reportHomeYellowCards, setReportHomeYellowCards, e.target.value, true);
                              e.target.value = '';
                            }
                          }}
                          className="text-[10px] bg-amber-100 text-amber-900 font-bold rounded px-1.5 py-0.5"
                        >
                          <option value="">+ Amarilla</option>
                          {reportHomeSquad.map((p, i) => (
                            <option key={i} value={p.name}>🟨 {p.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <input
                      type="text"
                      value={reportHomeYellowCards}
                      onChange={(e) => setReportHomeYellowCards(e.target.value)}
                      placeholder="Ej: Carvajal (25')"
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[10px] font-bold font-tech uppercase text-rose-900 flex items-center gap-1">
                        <span className="w-2 h-3 bg-rose-600 rounded-xs inline-block" /> Rojas (Local)
                      </label>
                      {reportHomeSquad.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              appendPlayerToField(reportHomeRedCards, setReportHomeRedCards, e.target.value, true);
                              e.target.value = '';
                            }
                          }}
                          className="text-[10px] bg-rose-100 text-rose-900 font-bold rounded px-1.5 py-0.5"
                        >
                          <option value="">+ Roja</option>
                          {reportHomeSquad.map((p, i) => (
                            <option key={i} value={p.name}>🟥 {p.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <input
                      type="text"
                      value={reportHomeRedCards}
                      onChange={(e) => setReportHomeRedCards(e.target.value)}
                      placeholder="Ej: Rüdiger (88')"
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[10px] font-bold font-tech uppercase text-amber-900 flex items-center gap-1">
                        <span className="w-2 h-3 bg-amber-500 rounded-xs inline-block" /> Amarillas (Visitante)
                      </label>
                      {reportAwaySquad.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              appendPlayerToField(reportAwayYellowCards, setReportAwayYellowCards, e.target.value, true);
                              e.target.value = '';
                            }
                          }}
                          className="text-[10px] bg-amber-100 text-amber-900 font-bold rounded px-1.5 py-0.5"
                        >
                          <option value="">+ Amarilla</option>
                          {reportAwaySquad.map((p, i) => (
                            <option key={i} value={p.name}>🟨 {p.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <input
                      type="text"
                      value={reportAwayYellowCards}
                      onChange={(e) => setReportAwayYellowCards(e.target.value)}
                      placeholder="Ej: Gavi (40')"
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[10px] font-bold font-tech uppercase text-rose-900 flex items-center gap-1">
                        <span className="w-2 h-3 bg-rose-600 rounded-xs inline-block" /> Rojas (Visitante)
                      </label>
                      {reportAwaySquad.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              appendPlayerToField(reportAwayRedCards, setReportAwayRedCards, e.target.value, true);
                              e.target.value = '';
                            }
                          }}
                          className="text-[10px] bg-rose-100 text-rose-900 font-bold rounded px-1.5 py-0.5"
                        >
                          <option value="">+ Roja</option>
                          {reportAwaySquad.map((p, i) => (
                            <option key={i} value={p.name}>🟥 {p.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <input
                      type="text"
                      value={reportAwayRedCards}
                      onChange={(e) => setReportAwayRedCards(e.target.value)}
                      placeholder="Ej: De Jong (90')"
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setShowImageUploader(v => !v)}
                  className="flex items-center gap-1.5 text-[11px] font-bold font-tech text-slate-700 uppercase hover:text-emerald-700"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  {showImageUploader ? 'Ocultar captura de prueba' : '+ Adjuntar captura de prueba (opcional)'}
                </button>
              </div>

              {showImageUploader && (
                <ImageUploader
                  value={reportProofImage}
                  onChange={setReportProofImage}
                  label=""
                />
              )}

              <div>
                <input
                  type="text"
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Notas adicionales o incidencias (opcional)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#00ba68]"
                />
              </div>

              {formError && (
                <div className="px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-tech font-bold rounded-lg">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReportingMatch(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg"
                >
                  Cancelar
                </button>
                <button type="submit" className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-lg">
                  Publicar Resultado Oficial
                </button>
              </div>
            </form>
        )}
      </Modal>

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
              <div className="text-xs text-slate-500 font-mono">{selectedMatch.createdAt}</div>
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
                <ImageWithFallback src={selectedMatch.proofImageUrl} alt="Prueba de Partido FC 27" className="w-full object-cover max-h-72" />
              </div>
            )}
          </div>
        </div>
      )}

      {successResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-200 max-w-sm w-full p-6 rounded-2xl shadow-2xl text-center space-y-4 animate-scale-up">
            <CheckCircle2 className="w-14 h-14 text-[#00ba68] mx-auto animate-bounce" />
            <h2 className="font-display font-black text-xl text-slate-900 uppercase italic">
              ¡Resultado Publicado!
            </h2>
            <p className="text-sm text-slate-600">
              {isAdmin
                ? `${successResult.homeGoals} - ${successResult.awayGoals} registrado exitosamente. La tabla de posiciones y las estadísticas se actualizaron.`
                : `${successResult.homeGoals} - ${successResult.awayGoals} enviado para revisión. Un administrador debe confirmarlo antes de que se refleje en la tabla de posiciones.`}
            </p>
            <button
              onClick={() => setSuccessResult(null)}
              className="fc-button-primary w-full py-2.5 text-xs font-extrabold uppercase shadow-lg"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
