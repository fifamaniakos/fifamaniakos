import React from 'react';
import { Handshake, Check, Lock } from 'lucide-react';
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
        <div className="fc-card p-8 rounded-xl text-center">
          <Lock className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="font-display font-bold text-xl text-white">Sin patrocinador esta temporada</h3>
          <p className="text-xs text-slate-400 mt-2">
            La temporada ya comenzo, asi que no se pueden firmar contratos nuevos. Vas a poder elegir marca al inicio de la Temporada {currentSeasonNumber + 1}.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="fc-card p-6 rounded-xl">
          <h3 className="font-display font-bold text-xl text-white">Elegi tu patrocinador</h3>
          <p className="text-xs text-slate-400 mt-1">
            Una vez que arranque la temporada no vas a poder cambiarlo. Las marcas mas exigentes pagan mas.
          </p>
        </div>

        {options.length === 0 && (
          <div className="fc-card p-6 rounded-xl text-center text-sm text-slate-400">
            No hay marcas disponibles para tu division todavia.
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {options.map(sponsor => {
            const objectives = sponsorObjectives.filter(o => o.sponsorId === sponsor.id);
            const maxTotal = objectives.reduce((sum, o) => sum + o.rewardMillions, 0);

            return (
              <div key={sponsor.id} className="fc-card p-5 rounded-xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-lg text-white">{sponsor.name}</h4>
                  <span className="text-xs text-[#02f59b] font-bold">Hasta {maxTotal} M €</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1">
                  {objectives.map(o => (
                    <li key={o.id} className="flex justify-between gap-3">
                      <span>{o.label}</span>
                      <span className="text-slate-400 whitespace-nowrap">+{o.rewardMillions} M</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onSignSponsor(sponsor.id)}
                  className="mt-auto bg-[#02f59b] text-slate-900 font-bold text-sm rounded-lg py-2 hover:brightness-110"
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

  return (
    <div className="space-y-4">
      <div className="fc-card p-6 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Handshake className="w-8 h-8 text-[#02f59b]" />
          <div>
            <h3 className="font-display font-bold text-xl text-white">{sponsor?.name ?? 'Patrocinador'}</h3>
            <p className="text-xs text-slate-400">Temporada {contract.seasonNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Acumulado</p>
          <p className="font-display font-black text-2xl text-[#02f59b]">{formatMillions(evaluation.totalAmount)}</p>
        </div>
      </div>

      <div className="fc-card rounded-xl overflow-hidden">
        {evaluation.lines.map(line => {
          const objective = byId.get(line.objectiveId);
          const percent = line.target > 0 ? Math.min(100, (line.current / line.target) * 100) : 0;

          return (
            <div key={line.objectiveId} className="p-4 border-b border-white/5 last:border-b-0">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-white flex items-center gap-2">
                  {line.met && <Check className="w-4 h-4 text-[#02f59b]" />}
                  {line.label}
                </span>
                <span className={`text-sm font-bold whitespace-nowrap ${line.met ? 'text-[#02f59b]' : 'text-slate-500'}`}>
                  +{objective?.rewardMillions ?? 0} M €
                </span>
              </div>

              {line.target > 1 && !line.met && (
                <div className="mt-2">
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#02f59b]" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Vas {line.current} de {line.target}</p>
                </div>
              )}

              {!line.met && line.target <= 1 && (
                <p className="text-[11px] text-slate-500 mt-1">No alcanzado</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-500 text-center">
        Los premios se acreditan cuando el administrador cierra la temporada.
      </p>
    </div>
  );
};
