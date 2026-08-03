import React, { useMemo, useState } from 'react';
import { Handshake, Play, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Club, ClubSponsorContract, MatchResult, Sponsor, SponsorObjective, SponsorPayout } from '../../types';
import { evaluateContract } from '../../utils/sponsorEngine';
import { supabase } from '../../lib/supabaseClient';
import { AddSponsorObjectiveForm } from './AddSponsorObjectiveForm';

// Competiciones fijas de la liga. El engine compara `competition` por string
// exacto, asi que el alta de premios ofrece esta lista en vez de texto libre:
// un premio con el nombre mal escrito no se puede cumplir nunca.
const KNOWN_COMPETITIONS = [
  '1ra División',
  '2da División',
  'UEFA Champions League',
  'UEFA Europa League',
  'UEFA Conference League',
  'Supercopa de Europa',
  'Supercopa de Liga',
  'Mundial de Clubes'
];

interface SponsorsAdminSectionProps {
  clubs: Club[];
  matches: MatchResult[];
  sponsors: Sponsor[];
  sponsorObjectives: SponsorObjective[];
  sponsorContracts: ClubSponsorContract[];
  sponsorPayouts: SponsorPayout[];
  currentSeasonNumber: number;
  onUpdateObjective: (objective: SponsorObjective) => void;
  onAddObjective: (objective: SponsorObjective) => void;
  onDeleteObjective: (objectiveId: string) => void;
}

interface PreviewRow {
  clubId: string;
  clubName: string;
  sponsorName: string;
  objectiveId: string;
  label: string;
  amount: number;
  alreadyPaid: boolean;
}

const formatMillions = (amount: number) => `${(amount / 1_000_000).toFixed(0)} M €`;

export const SponsorsAdminSection: React.FC<SponsorsAdminSectionProps> = ({
  clubs,
  matches,
  sponsors,
  sponsorObjectives,
  sponsorContracts,
  sponsorPayouts,
  currentSeasonNumber,
  onUpdateObjective,
  onAddObjective,
  onDeleteObjective
}) => {
  const [preview, setPreview] = useState<PreviewRow[] | null>(null);
  const [settling, setSettling] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [objectiveToDelete, setObjectiveToDelete] = useState<SponsorObjective | null>(null);

  // Se suman las competiciones que ya aparecen en premios cargados a mano, para
  // no perder ninguna que se haya creado antes de esta lista.
  const competitions = useMemo(() => {
    const extra = sponsorObjectives
      .map(o => o.competition)
      .filter((c): c is string => !!c && !KNOWN_COMPETITIONS.includes(c));
    return [...KNOWN_COMPETITIONS, ...Array.from(new Set(extra))];
  }, [sponsorObjectives]);

  const buildPreview = (): PreviewRow[] => {
    const rows: PreviewRow[] = [];

    sponsorContracts
      .filter(contract => contract.seasonNumber === currentSeasonNumber)
      .forEach(contract => {
        const club = clubs.find(c => c.id === contract.clubId);
        const sponsor = sponsors.find(s => s.id === contract.sponsorId);
        if (!club || !sponsor) return;

        const objectives = sponsorObjectives.filter(o => o.sponsorId === sponsor.id);
        const evaluation = evaluateContract(club.id, clubs, matches, objectives);

        evaluation.lines
          .filter(line => line.met)
          .forEach(line => {
            rows.push({
              clubId: club.id,
              clubName: club.name,
              sponsorName: sponsor.name,
              objectiveId: line.objectiveId,
              label: line.label,
              amount: line.amount,
              alreadyPaid: sponsorPayouts.some(
                p =>
                  p.clubId === club.id &&
                  p.seasonNumber === currentSeasonNumber &&
                  p.objectiveId === line.objectiveId
              )
            });
          });
      });

    return rows;
  };

  const settle = async () => {
    if (!preview) return;
    setSettling(true);
    setResult(null);

    let paid = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of preview) {
      // Solo se mandan identificadores: el monto y el concepto los resuelve la
      // RPC leyendo el contrato y la clausula de la base. Si el cliente pudiera
      // mandar el monto, quien tuviera la consola abierta elegiria cuanto cobrar.
      const { data, error } = await supabase.rpc('settle_sponsor_payout', {
        p_club_id: row.clubId,
        p_season_number: currentSeasonNumber,
        p_objective_id: row.objectiveId
      });

      if (error) {
        errors.push(`${row.clubName} / ${row.label}: ${error.message}`);
      } else if (data === true) {
        paid += 1;
      } else {
        skipped += 1;
      }
    }

    setSettling(false);
    setPreview(null);
    setResult(
      errors.length > 0
        ? `Pagados: ${paid}. Ya estaban pagados: ${skipped}. Errores: ${errors.join(' | ')}`
        : `Listo. Pagados: ${paid}. Ya estaban pagados: ${skipped}.`
    );
  };

  const pendingTotal = (preview ?? [])
    .filter(row => !row.alreadyPaid)
    .reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="space-y-6">
      <div className="fc-card p-6 rounded-3xl border border-slate-200 shadow-xl bg-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <Handshake className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-2xl text-slate-900 uppercase italic leading-none">
                Patrocinadores
              </h3>
              <p className="text-xs text-slate-500 mt-1.5">
                Temporada {currentSeasonNumber} ·{' '}
                {sponsorContracts.filter(c => c.seasonNumber === currentSeasonNumber).length} contratos firmados
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fc-card rounded-3xl border border-slate-200 shadow-xl bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h4 className="font-display font-extrabold text-slate-900 text-base uppercase italic">
            Premios por marca
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Los cambios se guardan solos y afectan la proxima liquidacion.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {sponsors.map(sponsor => {
            const objectives = sponsorObjectives.filter(o => o.sponsorId === sponsor.id);
            const ceiling = objectives.reduce((sum, o) => sum + o.rewardMillions, 0);

            return (
              <div key={sponsor.id} className="px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <p className="font-display font-extrabold text-sm text-emerald-600 uppercase italic">
                    {sponsor.name}
                    <span className="ml-2 text-slate-400 not-italic font-bold">
                      tope {ceiling} M €
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setAddingFor(addingFor === sponsor.id ? null : sponsor.id)}
                    aria-expanded={addingFor === sponsor.id}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    Agregar premio
                  </button>
                </div>

                <div className="space-y-2">
                  {objectives.length === 0 && (
                    <p className="text-sm text-slate-400">
                      Esta marca todavia no tiene premios cargados.
                    </p>
                  )}
                  {objectives.map(objective => (
                    <div key={objective.id} className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-600">{objective.label}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          value={objective.rewardMillions}
                          aria-label={`Premio de ${objective.label} en millones`}
                          onChange={e =>
                            onUpdateObjective({ ...objective, rewardMillions: Number(e.target.value) || 0 })
                          }
                          className="w-20 bg-white text-slate-900 text-sm font-bold text-right rounded-lg px-2 py-1.5 border border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <span className="text-xs text-slate-400 font-bold">M €</span>
                        <button
                          type="button"
                          onClick={() => setObjectiveToDelete(objective)}
                          aria-label={`Eliminar premio ${objective.label}`}
                          className="w-8 h-8 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {addingFor === sponsor.id && (
                  <AddSponsorObjectiveForm
                    sponsor={sponsor}
                    competitions={competitions}
                    onCancel={() => setAddingFor(null)}
                    onCreate={objective => {
                      onAddObjective(objective);
                      setAddingFor(null);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="fc-card rounded-3xl border border-slate-200 shadow-xl bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h4 className="font-display font-extrabold text-slate-900 text-base uppercase italic">
            Liquidacion
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Revisa la vista previa antes de acreditar. Los pagos ya hechos se saltean solos.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {!preview && (
            <button
              onClick={() => setPreview(buildPreview())}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-sm uppercase italic tracking-wide rounded-xl px-5 py-2.5 transition-colors shadow-md shadow-emerald-500/20"
            >
              Ver vista previa de pagos
            </button>
          )}

          {preview && (
            <>
              {preview.length === 0 && (
                <p className="text-sm text-slate-500">Ningun club cumplio objetivos todavia.</p>
              )}

              {preview.length > 0 && (
                <div>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    {preview.map(row => (
                      <div
                        key={`${row.clubId}-${row.objectiveId}`}
                        className="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-100 last:border-b-0 odd:bg-slate-50/50"
                      >
                        <span className="text-sm text-slate-700">
                          <span className="font-bold text-slate-900">{row.clubName}</span>
                          <span className="text-slate-500"> — {row.sponsorName}: {row.label}</span>
                        </span>
                        <span
                          className={`font-display font-black text-base whitespace-nowrap ${
                            row.alreadyPaid ? 'text-slate-300 line-through' : 'text-emerald-600'
                          }`}
                        >
                          {formatMillions(row.amount)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-4">
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">
                      Total a acreditar
                    </span>
                    <span className="font-display font-black text-3xl text-emerald-600 leading-none">
                      {formatMillions(pendingTotal)}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      Esto suma dinero al presupuesto de cada club y crea las transacciones.
                      Los tachados ya se pagaron y se saltean.
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={settle}
                  disabled={settling || preview.length === 0}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-sm uppercase italic tracking-wide rounded-xl px-5 py-2.5 transition-colors shadow-md shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {settling ? 'Liquidando...' : 'Confirmar y acreditar'}
                </button>
                <button
                  onClick={() => setPreview(null)}
                  disabled={settling}
                  className="text-sm font-bold text-slate-500 px-4 py-2.5 hover:text-slate-900 transition-colors disabled:opacity-40"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}

          {result && (
            <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
              {result}
            </p>
          )}
        </div>
      </div>

      {objectiveToDelete && (
        <div
          className="fixed inset-0 z-[110] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-objective-title"
        >
          <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-rose-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 rounded-xl shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" aria-hidden="true" />
              </div>
              <div>
                <h3
                  id="delete-objective-title"
                  className="font-display font-extrabold text-base text-slate-900 uppercase"
                >
                  ¿Eliminar este premio?
                </h3>
                <p className="text-xs text-slate-500">
                  Desaparece de los contratos de todas las marcas que lo tengan.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-sm font-bold text-slate-800">{objectiveToDelete.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {objectiveToDelete.rewardMillions} M €
              </p>
            </div>

            {sponsorPayouts.some(p => p.objectiveId === objectiveToDelete.id) && (
              <div className="flex items-start gap-2.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
                <span>
                  Este premio ya se pago al menos una vez. El dinero acreditado no se
                  devuelve, pero el historial va a quedar apuntando a un premio que ya no existe.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setObjectiveToDelete(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteObjective(objectiveToDelete.id);
                  setObjectiveToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors"
              >
                Si, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
