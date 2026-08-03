import React from 'react';
import { Trophy, Crown, Sparkles, Swords, Zap, CheckCircle2, Shield } from 'lucide-react';
import { Club, MatchResult } from '../../types';
import { BracketMatchSlot, BracketSlotTeam, getKnockoutBracketData } from '../../utils/bracketGenerator';
import { ClubLogo } from '../ClubLogo';
import { CompetitionLogo } from './CompetitionLogo';

interface KnockoutBracketProps {
  clubs: Club[];
  matches: MatchResult[];
  competition: string;
}

const TeamRow: React.FC<{ team: BracketSlotTeam; align?: 'left' | 'right' }> = ({ team, align = 'left' }) => {
  const isWinner = team.isWinner;
  const hasClub = !!team.club;
  const hasScore = typeof team.score === 'number';

  return (
    <div
      className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl border text-xs transition-all duration-300 ${
        isWinner
          ? 'bg-gradient-to-r from-emerald-500/15 via-emerald-100/70 to-white border-emerald-500 text-emerald-950 font-extrabold shadow-xs ring-1 ring-emerald-500/30'
          : hasClub
          ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/80'
          : 'bg-slate-50/60 border-slate-200/80 text-slate-400'
      } ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}
    >
      <div className={`flex items-center gap-2.5 min-w-0 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        {team.club ? (
          <>
            <div className="relative shrink-0">
              <ClubLogo
                src={team.club.logoUrl}
                alt={team.club.name}
                className="w-6.5 h-6.5 rounded-lg object-cover bg-white border border-slate-200 shadow-xs"
              />
              {isWinner && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-xs">
                  <Crown className="w-2.5 h-2.5 fill-amber-400 text-slate-950" />
                </span>
              )}
            </div>
            <span className="truncate max-w-[125px] font-display font-extrabold uppercase tracking-wide text-[11px] sm:text-xs text-slate-900">
              {team.club.name}
            </span>
          </>
        ) : (
          <span className="text-slate-400 font-mono text-xs italic">Por Definir</span>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-1.5">
        {hasScore ? (
          <span
            className={`px-2 py-0.5 rounded-md font-mono font-black text-xs shadow-xs ${
              isWinner
                ? 'bg-[#00ba68] text-white'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {team.score}
          </span>
        ) : (
          <span className="text-[10px] font-mono text-slate-400 uppercase px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
            VS
          </span>
        )}
      </div>
    </div>
  );
};

const MatchCard: React.FC<{ slot: BracketMatchSlot; title?: string; align?: 'left' | 'right' }> = ({
  slot,
  title,
  align = 'left'
}) => {
  const isConfirmed = slot.status === 'CONFIRMADO';

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-2.5 shadow-sm space-y-1.5 transition-all duration-300 hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 relative group">
      {title && (
        <div className="flex items-center justify-between px-1 text-[10px] font-tech font-bold uppercase tracking-wider text-slate-500">
          <span>{title}</span>
          {isConfirmed ? (
            <span className="text-[#00ba68] flex items-center gap-1 font-extrabold">
              <CheckCircle2 className="w-3 h-3 text-[#00ba68]" /> Finalizado
            </span>
          ) : (
            <span className="text-slate-400">Pendiente</span>
          )}
        </div>
      )}
      <TeamRow team={slot.home} align={align} />
      <TeamRow team={slot.away} align={align} />
    </div>
  );
};

const RoundLabel: React.FC<{ children: React.ReactNode; gold?: boolean }> = ({ children, gold }) => (
  <div
    className={`text-xs font-tech font-extrabold uppercase tracking-widest text-center px-3.5 py-1 rounded-full border shadow-xs inline-block mx-auto ${
      gold
        ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-amber-100'
        : 'bg-slate-100 border-slate-200 text-slate-700 shadow-slate-100'
    }`}
  >
    {children}
  </div>
);

export const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ clubs, matches, competition }) => {
  const data = getKnockoutBracketData(clubs, matches, competition);

  if (!data) {
    return (
      <div className="fc-card p-10 text-center border-dashed border-slate-300 bg-white text-slate-500 text-sm font-tech">
        Todavía no hay 8 clubes clasificados en 1ra División para armar el cuadro de {competition}.
      </div>
    );
  }

  const { quarterfinals, semifinals, final } = data;
  const finalWinner = final.status === 'CONFIRMADO' ? (final.home.isWinner ? final.home.club : final.away.isWinner ? final.away.club : null) : null;

  return (
    <div className="fc-card rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white p-6 md:p-8 space-y-8 relative">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-b from-emerald-50/60 via-slate-50/40 to-transparent pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <CompetitionLogo competition={competition} size="xl" className="shadow-md" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-[#00ba68] text-white text-[10px] font-tech font-extrabold uppercase rounded tracking-wider shadow-xs">
                FASE FINAL ELIMINATORIAS
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono rounded border border-emerald-200 font-bold">
                CUADRO OFICIAL FC 27
              </span>
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 uppercase italic tracking-wide mt-1">
              {competition}
            </h2>
          </div>
        </div>

        {finalWinner && (
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-100/50 to-amber-50 border border-amber-300 p-3 rounded-2xl flex items-center gap-3 shadow-md">
            <Trophy className="w-8 h-8 text-amber-500 filter drop-shadow-xs animate-bounce" />
            <div>
              <div className="text-[10px] font-tech font-extrabold uppercase text-amber-800 tracking-wider">
                CAMPEÓN OFICIAL
              </div>
              <div className="font-display font-black text-lg text-slate-900 uppercase italic">
                {finalWinner.name}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop 5-Column Bracket Grid */}
      <div className="hidden lg:grid grid-cols-5 gap-4 items-center relative z-10 py-4">
        {/* SVG Connector Lines Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" strokeWidth="2">
          {/* QF Left -> SF Left */}
          <path d="M 18% 28% H 24% V 48% H 30%" stroke="#00ba68" fill="none" strokeDasharray="4 2" />
          <path d="M 18% 72% H 24% V 48% H 30%" stroke="#00ba68" fill="none" strokeDasharray="4 2" />

          {/* QF Right -> SF Right */}
          <path d="M 82% 28% H 76% V 48% H 70%" stroke="#00ba68" fill="none" strokeDasharray="4 2" />
          <path d="M 82% 72% H 76% V 48% H 70%" stroke="#00ba68" fill="none" strokeDasharray="4 2" />

          {/* SF Left & SF Right -> Final Center */}
          <path d="M 38% 48% H 44%" stroke="#d97706" fill="none" strokeWidth="2.5" />
          <path d="M 62% 48% H 56%" stroke="#d97706" fill="none" strokeWidth="2.5" />
        </svg>

        {/* Col 1: Cuartos (Izquierda) */}
        <div className="space-y-12 z-10">
          <div className="text-center">
            <RoundLabel>Cuartos 1 & 4</RoundLabel>
          </div>
          <MatchCard slot={quarterfinals[0]} title="Llave 1" />
          <MatchCard slot={quarterfinals[3]} title="Llave 4" />
        </div>

        {/* Col 2: Semifinal (Izquierda) */}
        <div className="space-y-6 z-10">
          <div className="text-center">
            <RoundLabel>Semifinal A</RoundLabel>
          </div>
          <MatchCard slot={semifinals[0]} title="Semi 1" />
        </div>

        {/* Col 3: Center Stage - Gran Final Showcase */}
        <div className="z-10 flex flex-col items-center justify-center space-y-4">
          <RoundLabel gold>LA GRAN FINAL</RoundLabel>

          <div className="w-full bg-gradient-to-b from-amber-50/80 via-white to-slate-50/90 border border-amber-300 rounded-3xl p-5 shadow-lg text-center space-y-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />

            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-md border border-amber-300 transform group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-10 h-10 text-slate-950 filter drop-shadow-sm" />
            </div>

            <div>
              <span className="text-[10px] font-tech font-extrabold uppercase text-amber-800 tracking-widest block">
                TROFEO DE CAMPEÓN
              </span>
              <h3 className="font-display font-black text-xl text-slate-900 uppercase italic">
                {competition}
              </h3>
            </div>

            <MatchCard slot={final} title="Gran Final" />
          </div>
        </div>

        {/* Col 4: Semifinal (Derecha) */}
        <div className="space-y-6 z-10">
          <div className="text-center">
            <RoundLabel>Semifinal B</RoundLabel>
          </div>
          <MatchCard slot={semifinals[1]} title="Semi 2" align="right" />
        </div>

        {/* Col 5: Cuartos (Derecha) */}
        <div className="space-y-12 z-10">
          <div className="text-center">
            <RoundLabel>Cuartos 2 & 3</RoundLabel>
          </div>
          <MatchCard slot={quarterfinals[1]} title="Llave 2" align="right" />
          <MatchCard slot={quarterfinals[2]} title="Llave 3" align="right" />
        </div>
      </div>

      {/* Mobile Stacked View */}
      <div className="lg:hidden space-y-6 relative z-10">
        <div className="space-y-3">
          <div className="text-center">
            <RoundLabel>Cuartos de Final</RoundLabel>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quarterfinals.map((slot, i) => (
              <MatchCard key={i} slot={slot} title={`Llave ${i + 1}`} />
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="text-center">
            <RoundLabel>Semifinales</RoundLabel>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {semifinals.map((slot, i) => (
              <MatchCard key={i} slot={slot} title={`Semifinal ${i + 1}`} />
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="text-center">
            <RoundLabel gold>La Gran Final</RoundLabel>
          </div>
          <MatchCard slot={final} title="Final por el Título" />
        </div>
      </div>
    </div>
  );
};
