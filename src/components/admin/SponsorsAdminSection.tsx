import React, { useState } from 'react';
import { Handshake, Play, AlertTriangle } from 'lucide-react';
import { Club, ClubSponsorContract, MatchResult, Sponsor, SponsorObjective, SponsorPayout } from '../../types';
import { evaluateContract } from '../../utils/sponsorEngine';
import { supabase } from '../../lib/supabaseClient';

interface SponsorsAdminSectionProps {
  clubs: Club[];
  matches: MatchResult[];
  sponsors: Sponsor[];
  sponsorObjectives: SponsorObjective[];
  sponsorContracts: ClubSponsorContract[];
  sponsorPayouts: SponsorPayout[];
  currentSeasonNumber: number;
  onUpdateObjective: (objective: SponsorObjective) => void;
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
  onUpdateObjective
}) => {
  const [preview, setPreview] = useState<PreviewRow[] | null>(null);
  const [settling, setSettling] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
      const { data, error } = await supabase.rpc('settle_sponsor_payout', {
        p_club_id: row.clubId,
        p_season_number: currentSeasonNumber,
        p_objective_id: row.objectiveId,
        p_amount: row.amount,
        p_concept: `Bonus ${row.sponsorName} - ${row.label}`
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
      <div className="fc-card p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <Handshake className="w-6 h-6 text-[#02f59b]" />
          <h3 className="font-display font-bold text-xl text-white">Patrocinadores</h3>
        </div>
        <p className="text-xs text-slate-400">
          Temporada {currentSeasonNumber}. {sponsorContracts.filter(c => c.seasonNumber === currentSeasonNumber).length} contratos firmados.
        </p>
      </div>

      <div className="fc-card p-6 rounded-xl space-y-4">
        <h4 className="font-display font-bold text-lg text-white">Premios por marca</h4>
        {sponsors.map(sponsor => (
          <div key={sponsor.id} className="space-y-2">
            <p className="text-sm font-bold text-[#02f59b]">{sponsor.name}</p>
            {sponsorObjectives
              .filter(o => o.sponsorId === sponsor.id)
              .map(objective => (
                <div key={objective.id} className="flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-300">{objective.label}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={objective.rewardMillions}
                      onChange={e =>
                        onUpdateObjective({ ...objective, rewardMillions: Number(e.target.value) || 0 })
                      }
                      className="w-20 bg-slate-800 text-white text-xs rounded px-2 py-1 border border-white/10"
                    />
                    <span className="text-xs text-slate-500">M €</span>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="fc-card p-6 rounded-xl space-y-4">
        <h4 className="font-display font-bold text-lg text-white">Liquidacion</h4>

        {!preview && (
          <button
            onClick={() => setPreview(buildPreview())}
            className="bg-[#02f59b] text-slate-900 font-bold text-sm rounded-lg px-4 py-2 hover:brightness-110"
          >
            Ver vista previa de pagos
          </button>
        )}

        {preview && (
          <>
            {preview.length === 0 && (
              <p className="text-xs text-slate-400">Ningun club cumplio objetivos todavia.</p>
            )}

            {preview.length > 0 && (
              <div className="space-y-1">
                {preview.map(row => (
                  <div
                    key={`${row.clubId}-${row.objectiveId}`}
                    className="flex items-center justify-between gap-3 text-xs border-b border-white/5 py-2"
                  >
                    <span className="text-white">
                      {row.clubName} <span className="text-slate-500">— {row.sponsorName}: {row.label}</span>
                    </span>
                    <span className={row.alreadyPaid ? 'text-slate-500 line-through' : 'text-[#02f59b] font-bold'}>
                      {formatMillions(row.amount)}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 text-sm">
                  <span className="text-slate-300">Total a acreditar</span>
                  <span className="font-display font-black text-xl text-[#02f59b]">{formatMillions(pendingTotal)}</span>
                </div>

                <div className="flex items-start gap-2 text-[11px] text-amber-400 pt-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Esto suma dinero al presupuesto de cada club y crea las transacciones. Los tachados ya se pagaron y se saltean.</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={settle}
                disabled={settling || preview.length === 0}
                className="bg-[#02f59b] text-slate-900 font-bold text-sm rounded-lg px-4 py-2 disabled:opacity-40 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                {settling ? 'Liquidando...' : 'Confirmar y acreditar'}
              </button>
              <button
                onClick={() => setPreview(null)}
                disabled={settling}
                className="text-slate-400 text-sm px-4 py-2 hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        {result && <p className="text-xs text-slate-300">{result}</p>}
      </div>
    </div>
  );
};
