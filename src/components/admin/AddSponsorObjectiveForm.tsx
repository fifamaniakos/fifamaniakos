import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { MatchPhase, Sponsor, SponsorObjective, SponsorObjectiveKind } from '../../types';

interface AddSponsorObjectiveFormProps {
  sponsor: Sponsor;
  // Las competiciones que ya se usan en la liga, para no depender de que el
  // admin escriba el nombre igual que el resto del sistema.
  competitions: string[];
  onCancel: () => void;
  onCreate: (objective: SponsorObjective) => void;
}

const KIND_LABEL: Record<SponsorObjectiveKind, string> = {
  CHAMPION: 'Salir campeon de una competicion',
  RUNNER_UP: 'Salir subcampeon de una competicion',
  REACH_PHASE: 'Llegar a una fase',
  LEAGUE_WINS: 'Ganar N partidos de liga',
  TOP_SCORER: 'Tener al goleador de una competicion',
  ASSISTS_THRESHOLD: 'Tener un jugador con N asistencias'
};

const PHASES: MatchPhase[] = ['GRUPOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'];

const PHASE_LABEL: Record<MatchPhase, string> = {
  GRUPOS: 'Fase de grupos',
  OCTAVOS: 'Octavos de final',
  CUARTOS: 'Cuartos de final',
  SEMIFINAL: 'Semifinal',
  FINAL: 'Final'
};

// Que campos pide cada tipo. El engine compara `competition` por string exacto y
// lee `threshold` segun el kind, asi que pedir de menos deja un premio que nunca
// se puede cumplir y nadie se entera hasta la liquidacion.
const needsCompetition = (kind: SponsorObjectiveKind) =>
  kind === 'CHAMPION' || kind === 'RUNNER_UP' || kind === 'REACH_PHASE' || kind === 'TOP_SCORER';

const optionalCompetition = (kind: SponsorObjectiveKind) => kind === 'ASSISTS_THRESHOLD';

const needsPhase = (kind: SponsorObjectiveKind) => kind === 'REACH_PHASE';

const needsThreshold = (kind: SponsorObjectiveKind) =>
  kind === 'LEAGUE_WINS' || kind === 'ASSISTS_THRESHOLD';

const optionalThreshold = (kind: SponsorObjectiveKind) => kind === 'TOP_SCORER';

const suggestLabel = (
  kind: SponsorObjectiveKind,
  competition: string,
  phase: MatchPhase,
  threshold: string
): string => {
  const n = threshold.trim();
  switch (kind) {
    case 'CHAMPION':
      return competition ? `Campeon ${competition}` : '';
    case 'RUNNER_UP':
      return competition ? `Subcampeon ${competition}` : '';
    case 'REACH_PHASE':
      return competition ? `${PHASE_LABEL[phase]} de ${competition}` : '';
    case 'LEAGUE_WINS':
      return n ? `Ganar ${n} partidos de liga` : '';
    case 'TOP_SCORER':
      if (!competition) return '';
      return n && Number(n) > 0
        ? `Goleador de ${competition} con +${n} goles`
        : `Goleador de ${competition}`;
    case 'ASSISTS_THRESHOLD':
      if (!n) return '';
      return competition
        ? `+${n} asistencias en ${competition} (un solo jugador)`
        : `+${n} asistencias (un jugador en una competicion)`;
    default:
      return '';
  }
};

const fieldClass =
  'w-full bg-white text-slate-900 text-sm rounded-lg px-3 py-2 border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20';

const labelClass = 'block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5';

export const AddSponsorObjectiveForm: React.FC<AddSponsorObjectiveFormProps> = ({
  sponsor,
  competitions,
  onCancel,
  onCreate
}) => {
  const [kind, setKind] = useState<SponsorObjectiveKind>('CHAMPION');
  const [competition, setCompetition] = useState(competitions[0] ?? '');
  const [phase, setPhase] = useState<MatchPhase>('SEMIFINAL');
  const [threshold, setThreshold] = useState('');
  const [reward, setReward] = useState('');
  const [labelDraft, setLabelDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  const suggested = useMemo(
    () => suggestLabel(kind, competition, phase, threshold),
    [kind, competition, phase, threshold]
  );

  // El label es lo unico que ve el manager, asi que se sugiere solo pero el
  // admin puede pisarlo.
  const finalLabel = labelDraft.trim() || suggested;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const rewardMillions = Number(reward);
    if (!rewardMillions || rewardMillions <= 0) {
      setError('Poné un premio mayor a 0 millones.');
      return;
    }

    if (needsCompetition(kind) && !competition) {
      setError('Elegí la competicion.');
      return;
    }

    const thresholdValue = Number(threshold);
    if (needsThreshold(kind) && (!thresholdValue || thresholdValue <= 0)) {
      setError('Poné cuántos hacen falta para cumplirlo.');
      return;
    }

    if (!finalLabel) {
      setError('Escribí el texto que va a ver el manager.');
      return;
    }

    const objective: SponsorObjective = {
      id: `obj-${sponsor.id.replace(/^sponsor-/, '')}-${Date.now()}`,
      sponsorId: sponsor.id,
      kind,
      rewardMillions,
      label: finalLabel,
      ...(needsCompetition(kind) || (optionalCompetition(kind) && competition)
        ? { competition }
        : {}),
      ...(needsPhase(kind) ? { phase } : {}),
      ...(needsThreshold(kind) || optionalThreshold(kind)
        ? { threshold: thresholdValue || 0 }
        : {})
    };

    onCreate(objective);
  };

  return (
    <form
      onSubmit={submit}
      className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-display font-extrabold text-sm text-slate-900 uppercase italic">
          Nuevo premio para {sponsor.name}
        </p>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar formulario"
          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div>
        <label className={labelClass} htmlFor={`kind-${sponsor.id}`}>
          Que tiene que lograr el club
        </label>
        <select
          id={`kind-${sponsor.id}`}
          value={kind}
          onChange={e => {
            setKind(e.target.value as SponsorObjectiveKind);
            setError(null);
          }}
          className={fieldClass}
        >
          {(Object.keys(KIND_LABEL) as SponsorObjectiveKind[]).map(k => (
            <option key={k} value={k}>
              {KIND_LABEL[k]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {(needsCompetition(kind) || optionalCompetition(kind)) && (
          <div>
            <label className={labelClass} htmlFor={`comp-${sponsor.id}`}>
              Competicion {optionalCompetition(kind) && '(opcional)'}
            </label>
            <select
              id={`comp-${sponsor.id}`}
              value={competition}
              onChange={e => setCompetition(e.target.value)}
              className={fieldClass}
            >
              {optionalCompetition(kind) && <option value="">Cualquier competicion</option>}
              {competitions.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {needsPhase(kind) && (
          <div>
            <label className={labelClass} htmlFor={`phase-${sponsor.id}`}>
              Fase a alcanzar
            </label>
            <select
              id={`phase-${sponsor.id}`}
              value={phase}
              onChange={e => setPhase(e.target.value as MatchPhase)}
              className={fieldClass}
            >
              {PHASES.map(p => (
                <option key={p} value={p}>
                  {PHASE_LABEL[p]}
                </option>
              ))}
            </select>
          </div>
        )}

        {(needsThreshold(kind) || optionalThreshold(kind)) && (
          <div>
            <label className={labelClass} htmlFor={`thr-${sponsor.id}`}>
              {kind === 'LEAGUE_WINS' && 'Partidos a ganar'}
              {kind === 'ASSISTS_THRESHOLD' && 'Asistencias necesarias'}
              {kind === 'TOP_SCORER' && 'Goles minimos (0 = sin minimo)'}
            </label>
            <input
              id={`thr-${sponsor.id}`}
              type="number"
              min={optionalThreshold(kind) ? 0 : 1}
              value={threshold}
              onChange={e => {
                setThreshold(e.target.value);
                setError(null);
              }}
              placeholder={optionalThreshold(kind) ? '0' : 'Ej: 20'}
              className={fieldClass}
            />
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor={`reward-${sponsor.id}`}>
            Premio en millones de €
          </label>
          <input
            id={`reward-${sponsor.id}`}
            type="number"
            min={1}
            value={reward}
            onChange={e => {
              setReward(e.target.value);
              setError(null);
            }}
            placeholder="Ej: 15"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor={`label-${sponsor.id}`}>
          Texto que ve el manager
        </label>
        <input
          id={`label-${sponsor.id}`}
          type="text"
          value={labelDraft}
          onChange={e => setLabelDraft(e.target.value)}
          placeholder={suggested || 'Ej: Campeon Champions'}
          className={fieldClass}
        />
        {suggested && !labelDraft.trim() && (
          <p className="text-[11px] text-slate-500 mt-1">
            Se va a guardar como <span className="font-bold text-slate-700">{suggested}</span>
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-sm uppercase italic tracking-wide rounded-xl px-5 py-2.5 transition-colors shadow-md shadow-emerald-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500"
        >
          Agregar premio
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-bold text-slate-500 px-4 py-2.5 hover:text-slate-900 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
