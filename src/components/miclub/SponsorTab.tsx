import React from 'react';
import { Handshake, Check, Lock, Trophy } from 'lucide-react';
import { Club, ClubSponsorContract, MatchResult, Sponsor, SponsorObjective } from '../../types';
import { evaluateContract, eligibleSponsors } from '../../utils/sponsorEngine';

interface SponsorTabProps {
  currentClub: Club;
  clubs: Club[];
  matches: MatchResult[];
  sponsors: Sponsor[];
  sponsorObjectives: SponsorObjective[];
  sponsorContracts: ClubSponsorContract[];
  currentSeasonNumber: number;
  onSignSponsor: (sponsorId: string) => void;
}

const formatMillions = (amount: number) => `${(amount / 1_000_000).toFixed(0)} M €`;

export const SponsorTab: React.FC<SponsorTabProps> = ({
  currentClub,
  clubs,
  matches,
  sponsors,
  sponsorObjectives,
  sponsorContracts,
  currentSeasonNumber,
  onSignSponsor
}) => {
  const contract = sponsorContracts.find(
    c => c.clubId === currentClub.id && c.seasonNumber === currentSeasonNumber
  );

  // La temporada se considera arrancada apenas hay un partido confirmado: a
  // partir de ahi el contrato se bloquea, porque si no el manager cambiaria de
  // marca al final para maximizar el cobro.
  const seasonStarted = matches.some(m => m.status === 'CONFIRMADO');

  if (!contract) {
    const options = eligibleSponsors(currentClub, sponsors);

    if (seasonStarted) {
      return (
        <div className="fc-card p-10 rounded-3xl border border-slate-200 shadow-xl bg-white text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="font-display font-extrabold text-2xl text-slate-900 uppercase italic">
            Sin patrocinador esta temporada
          </h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            La temporada ya comenzo, asi que no se pueden firmar contratos nuevos.
            Vas a poder elegir marca al inicio de la Temporada {currentSeasonNumber + 1}.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="fc-card p-6 rounded-3xl border border-slate-200 shadow-xl bg-white">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-display font-extrabold text-slate-900 text-base uppercase italic flex items-center gap-2">
              <Handshake className="w-5 h-5 text-emerald-600" /> Elegi tu patrocinador
            </h3>
            <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              Temporada {currentSeasonNumber}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Una vez que arranque la temporada no vas a poder cambiarlo. Las marcas mas
            exigentes pagan mas.
          </p>
        </div>

        {options.length === 0 && (
          <div className="fc-card p-8 rounded-3xl border border-slate-200 shadow-xl bg-white text-center text-sm text-slate-500">
            No hay marcas disponibles para tu division todavia.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {options.map(sponsor => {
            const objectives = sponsorObjectives.filter(o => o.sponsorId === sponsor.id);
            const maxTotal = objectives.reduce((sum, o) => sum + o.rewardMillions, 0);

            return (
              <div
                key={sponsor.id}
                className="fc-card fc-card-hover p-6 rounded-3xl border border-slate-200 shadow-xl bg-white flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h4 className="font-display font-extrabold text-xl text-slate-900 uppercase italic">
                      {sponsor.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wide mt-0.5">
                      {sponsor.requirementDivision ?? 'Sin requisitos'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Hasta</p>
                    <p className="font-display font-black text-2xl text-emerald-600 leading-none">
                      {maxTotal} M €
                    </p>
                  </div>
                </div>

                <ul className="text-sm space-y-2 py-4 flex-1">
                  {objectives.map(o => (
                    <li key={o.id} className="flex justify-between gap-3 items-baseline">
                      <span className="text-slate-600">{o.label}</span>
                      <span className="text-slate-900 font-bold whitespace-nowrap">
                        +{o.rewardMillions} M
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSignSponsor(sponsor.id)}
                  className="mt-auto bg-emerald-500 hover:bg-emerald-600 text-white font-display font-extrabold text-sm uppercase italic tracking-wide rounded-xl py-3 transition-colors shadow-md shadow-emerald-500/20"
                >
                  Firmar con {sponsor.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const sponsor = sponsors.find(s => s.id === contract.sponsorId);
  const objectives = sponsorObjectives.filter(o => o.sponsorId === contract.sponsorId);
  const evaluation = evaluateContract(currentClub.id, clubs, matches, objectives);
  const byId = new Map<string, SponsorObjective>(objectives.map(o => [o.id, o]));
  const metCount = evaluation.lines.filter(l => l.met).length;

  return (
    <div className="space-y-6">
      <div className="fc-card p-6 rounded-3xl border border-slate-200 shadow-xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <Handshake className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-2xl text-slate-900 uppercase italic leading-none">
              {sponsor?.name ?? 'Patrocinador'}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5">
              Temporada {contract.seasonNumber} · {metCount} de {evaluation.lines.length} objetivos cumplidos
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Acumulado</p>
          <p className="font-display font-black text-4xl text-emerald-600 leading-none">
            {formatMillions(evaluation.totalAmount)}
          </p>
        </div>
      </div>

      <div className="fc-card rounded-3xl border border-slate-200 shadow-xl bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h4 className="font-display font-extrabold text-slate-900 text-base uppercase italic flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-600" /> Objetivos del contrato
          </h4>
        </div>

        {evaluation.lines.map(line => {
          const objective = byId.get(line.objectiveId);
          const percent = line.target > 0 ? Math.min(100, (line.current / line.target) * 100) : 0;

          return (
            <div
              key={line.objectiveId}
              className={`px-6 py-4 border-b border-slate-100 last:border-b-0 ${line.met ? 'bg-emerald-50/40' : ''}`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-700 flex items-center gap-2.5 font-medium">
                  {line.met ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
                  )}
                  {line.label}
                </span>
                <span
                  className={`font-display font-black text-lg whitespace-nowrap ${
                    line.met ? 'text-emerald-600' : 'text-slate-300'
                  }`}
                >
                  +{objective?.rewardMillions ?? 0} M €
                </span>
              </div>

              {line.target > 1 && !line.met && (
                <div className="mt-2.5 pl-[30px]">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                    Vas {line.current} de {line.target}
                  </p>
                </div>
              )}

              {!line.met && line.target <= 1 && (
                <p className="text-[11px] text-slate-400 mt-1 pl-[30px]">No alcanzado</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 text-center">
        Los premios se acreditan cuando el administrador cierra la temporada.
      </p>
    </div>
  );
};
