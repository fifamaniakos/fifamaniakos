import React from 'react';
import { Handshake, Check, Lock, Trophy, ChevronRight } from 'lucide-react';
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

// El tier es la unica jerarquia real entre marcas, asi que es lo que manda el
// diseño: cuanto mas alto el tier, mas oscura y densa la tarjeta. Tier 1 se
// dibuja como panel oscuro para que se lea como el contrato de elite.
const TIER_LABEL: Record<number, string> = {
  1: 'Elite',
  2: 'Premium',
  3: 'Consolidado',
  4: 'Emergente',
  5: 'Inicial'
};

const tierRail = (tier: number) => {
  switch (tier) {
    case 1: return 'bg-[#02f59b]';
    case 2: return 'bg-[#00ba68]';
    case 3: return 'bg-emerald-500/70';
    case 4: return 'bg-emerald-500/45';
    default: return 'bg-emerald-500/25';
  }
};

const MAX_VISIBLE_OBJECTIVES = 3;

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

  const ceilingOf = (sponsorId: string) =>
    sponsorObjectives
      .filter(o => o.sponsorId === sponsorId)
      .reduce((sum, o) => sum + o.rewardMillions, 0);

  if (!contract) {
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

    const signable = eligibleSponsors(currentClub, sponsors);
    const signableIds = new Set(signable.map(s => s.id));
    // Las marcas bloqueadas tambien se muestran: sin verlas, el manager no sabe
    // que hay una escalera que subir ni que le falta para llegar.
    const board = sponsors
      .filter(s => s.active)
      .slice()
      .sort((a, b) => a.tier - b.tier);

    const bestCeiling = board.reduce((max, s) => Math.max(max, ceilingOf(s.id)), 0);

    return (
      <div className="space-y-5">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-tech text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
              Temporada {currentSeasonNumber} · Mesa de contratos
            </p>
            <h3 className="font-display font-black text-3xl md:text-4xl text-slate-900 uppercase italic leading-none mt-1">
              Elegi tu patrocinador
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Un contrato por temporada. Se cierra apenas se confirme el primer partido,
              y las marcas mas exigentes son las que mejor pagan.
            </p>
          </div>
          <div className="text-right">
            <p className="font-tech text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Tope de la mesa
            </p>
            <p className="font-display font-black text-3xl text-slate-900 leading-none">
              {bestCeiling} M €
            </p>
          </div>
        </header>

        {board.length === 0 && (
          <div className="fc-card p-8 rounded-3xl border border-slate-200 shadow-xl bg-white text-center text-sm text-slate-500">
            No hay marcas disponibles para tu division todavia.
          </div>
        )}

        <div className="space-y-4">
          {board.map(sponsor => {
            const objectives = sponsorObjectives
              .filter(o => o.sponsorId === sponsor.id)
              .slice()
              .sort((a, b) => b.rewardMillions - a.rewardMillions);
            const ceiling = objectives.reduce((sum, o) => sum + o.rewardMillions, 0);
            const locked = !signableIds.has(sponsor.id);
            const visible = objectives.slice(0, MAX_VISIBLE_OBJECTIVES);
            const hidden = objectives.length - visible.length;
            const elite = sponsor.tier === 1;
            const share = bestCeiling > 0 ? Math.round((ceiling / bestCeiling) * 100) : 0;

            return (
              <article
                key={sponsor.id}
                className={`relative flex overflow-hidden rounded-3xl shadow-xl transition-colors ${
                  elite && !locked
                    ? 'bg-[#05130d] border border-emerald-500/30'
                    : 'bg-white border border-slate-200'
                } ${locked ? 'opacity-60' : ''}`}
              >
                {/* El riel de la izquierda codifica el tier: mas alto, mas solido. */}
                <div
                  className={`w-1.5 shrink-0 ${locked ? 'bg-slate-300' : tierRail(sponsor.tier)}`}
                  aria-hidden="true"
                />

                <div className="flex-1 p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                    <div className="min-w-0">
                      <p
                        className={`font-tech text-[10px] font-bold uppercase tracking-[0.22em] ${
                          elite && !locked ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        Tier {sponsor.tier} · {TIER_LABEL[sponsor.tier] ?? 'Contrato'}
                      </p>
                      {/* Las marcas no tienen logo cargado, asi que la tipografia
                          hace de wordmark. */}
                      <h4
                        className={`font-display font-black text-3xl md:text-4xl uppercase italic tracking-tight leading-none mt-1 ${
                          elite && !locked ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {sponsor.name}
                      </h4>
                      <p
                        className={`text-xs mt-1.5 ${
                          elite && !locked ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {sponsor.requirementDivision
                          ? `Requiere ${sponsor.requirementDivision}`
                          : 'Abierto a todas las divisiones'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={`font-tech text-[10px] font-bold uppercase tracking-widest ${
                          elite && !locked ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        Pago maximo
                      </p>
                      <p
                        className={`font-display font-black text-4xl leading-none ${
                          elite && !locked ? 'text-[#02f59b]' : 'text-emerald-600'
                        }`}
                      >
                        {ceiling} M €
                      </p>
                      <p
                        className={`font-tech text-[10px] uppercase tracking-wider mt-0.5 ${
                          elite && !locked ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        {share}% del tope
                      </p>
                    </div>
                  </div>

                  <ul
                    className={`mt-4 pt-4 border-t grid gap-x-6 gap-y-2 sm:grid-cols-2 ${
                      elite && !locked ? 'border-white/10' : 'border-slate-100'
                    }`}
                  >
                    {visible.map(o => (
                      <li key={o.id} className="flex items-baseline justify-between gap-3 text-sm">
                        <span className={elite && !locked ? 'text-slate-300' : 'text-slate-600'}>
                          {o.label}
                        </span>
                        <span
                          className={`font-display font-black whitespace-nowrap ${
                            elite && !locked ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          +{o.rewardMillions} M
                        </span>
                      </li>
                    ))}
                    {hidden > 0 && (
                      <li
                        className={`text-xs font-tech font-bold uppercase tracking-wider self-center ${
                          elite && !locked ? 'text-emerald-400' : 'text-emerald-600'
                        }`}
                      >
                        + {hidden} objetivos mas en el contrato
                      </li>
                    )}
                  </ul>

                  <div className="mt-5">
                    {locked ? (
                      <p className="inline-flex items-center gap-2 text-xs font-tech font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5">
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        Bloqueado · jugas en {currentClub.division}
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSignSponsor(sponsor.id)}
                        className={`group inline-flex items-center gap-2 rounded-xl px-5 py-3 font-display font-extrabold text-sm uppercase italic tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 ${
                          elite
                            ? 'bg-[#02f59b] hover:bg-[#00e086] text-[#04140d] focus-visible:ring-offset-[#05130d]'
                            : 'bg-slate-900 hover:bg-emerald-600 text-white'
                        }`}
                      >
                        Firmar con {sponsor.name}
                        <ChevronRight
                          className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </article>
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
  const ceiling = objectives.reduce((sum, o) => sum + o.rewardMillions, 0);
  const earnedMillions = evaluation.totalAmount / 1_000_000;
  const payoutPercent = ceiling > 0 ? Math.min(100, (earnedMillions / ceiling) * 100) : 0;

  // Las cumplidas arriba: lo cobrado es lo que el manager viene a mirar.
  const orderedLines = evaluation.lines.slice().sort((a, b) => {
    if (a.met !== b.met) return a.met ? -1 : 1;
    return (byId.get(b.objectiveId)?.rewardMillions ?? 0) - (byId.get(a.objectiveId)?.rewardMillions ?? 0);
  });

  return (
    <div className="space-y-5">
      {/* El contrato firmado se lee como panel de marca, no como tarjeta mas. */}
      <div className="relative overflow-hidden rounded-3xl bg-[#05130d] border border-emerald-500/25 shadow-xl p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Handshake className="w-7 h-7 text-[#02f59b]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-tech text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-400">
                Contrato firmado · Temporada {contract.seasonNumber}
              </p>
              <h3 className="font-display font-black text-3xl md:text-4xl text-white uppercase italic tracking-tight leading-none mt-1">
                {sponsor?.name ?? 'Patrocinador'}
              </h3>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="font-tech text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Acumulado
            </p>
            <p className="font-display font-black text-5xl text-[#02f59b] leading-none">
              {formatMillions(evaluation.totalAmount)}
            </p>
            <p className="font-tech text-[11px] uppercase tracking-wider text-slate-400 mt-1">
              de {ceiling} M € posibles
            </p>
          </div>
        </div>

        {/* Medidor de cobro: el dato central de la temporada. */}
        <div className="mt-6">
          <div
            className="h-2 rounded-full bg-white/10 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(payoutPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Cobrado ${Math.round(earnedMillions)} de ${ceiling} millones`}
          >
            <div
              className="h-full rounded-full bg-[#02f59b] transition-all duration-500"
              style={{ width: `${payoutPercent}%` }}
            />
          </div>
          <p className="font-tech text-[11px] uppercase tracking-wider text-slate-400 mt-2">
            {metCount} de {evaluation.lines.length} objetivos cumplidos
          </p>
        </div>
      </div>

      <div className="fc-card rounded-3xl border border-slate-200 shadow-xl bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h4 className="font-display font-extrabold text-slate-900 text-base uppercase italic flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-600" aria-hidden="true" /> Objetivos del contrato
          </h4>
        </div>

        {orderedLines.map(line => {
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
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} aria-hidden="true" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" aria-hidden="true" />
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
                  <div
                    className="h-1.5 bg-slate-100 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={line.current}
                    aria-valuemin={0}
                    aria-valuemax={line.target}
                    aria-label={line.label}
                  >
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
