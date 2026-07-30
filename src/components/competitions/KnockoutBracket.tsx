import React from 'react';
import { Trophy } from 'lucide-react';
import { Club, MatchResult } from '../../types';
import { BracketMatchSlot, BracketSlotTeam, getKnockoutBracketData } from '../../utils/bracketGenerator';
import { ClubLogo } from '../ClubLogo';

interface KnockoutBracketProps {
  clubs: Club[];
  matches: MatchResult[];
  competition: string;
}

const TeamRow: React.FC<{ team: BracketSlotTeam; align?: 'left' | 'right' }> = ({ team, align = 'left' }) => (
  <div
    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-tech font-bold ${
      team.isWinner ? 'bg-white/15 border-[#38BDF8]/60 text-white' : 'bg-white/5 border-white/10 text-slate-300'
    } ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}
  >
    {team.club ? (
      <>
        <ClubLogo src={team.club.logoUrl} alt={team.club.name} className="w-5 h-5 rounded object-cover shrink-0" />
        <span className="truncate max-w-[110px]">{team.club.name}</span>
      </>
    ) : (
      <span className="text-slate-500">—</span>
    )}
  </div>
);

const MatchCard: React.FC<{ slot: BracketMatchSlot; align?: 'left' | 'right' }> = ({ slot, align = 'left' }) => (
  <div className="flex flex-col gap-1">
    <TeamRow team={slot.home} align={align} />
    <TeamRow team={slot.away} align={align} />
  </div>
);

const RoundLabel: React.FC<{ children: React.ReactNode; gold?: boolean }> = ({ children, gold }) => (
  <div className={`text-[10px] font-tech uppercase tracking-wider text-center ${gold ? 'text-amber-400' : 'text-indigo-300/80'}`}>
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

  return (
    <div className="fc-card rounded-2xl overflow-hidden border-slate-800 shadow-xl bg-gradient-to-br from-[#0a1a3f] to-[#142a5c] p-5">
      <div className="hidden md:grid grid-cols-5 gap-4 items-center">
        <div className="space-y-10">
          <RoundLabel>Cuartos</RoundLabel>
          <MatchCard slot={quarterfinals[0]} />
          <MatchCard slot={quarterfinals[3]} />
        </div>
        <div className="space-y-10">
          <RoundLabel>Semis</RoundLabel>
          <div className="h-16" />
          <MatchCard slot={semifinals[0]} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <RoundLabel gold>Final</RoundLabel>
          <Trophy className="w-9 h-9 text-amber-400" />
          <MatchCard slot={final} />
        </div>
        <div className="space-y-10">
          <RoundLabel>Semis</RoundLabel>
          <div className="h-16" />
          <MatchCard slot={semifinals[1]} align="right" />
        </div>
        <div className="space-y-10">
          <RoundLabel>Cuartos</RoundLabel>
          <MatchCard slot={quarterfinals[1]} align="right" />
          <MatchCard slot={quarterfinals[2]} align="right" />
        </div>
      </div>

      <div className="md:hidden space-y-5">
        <div>
          <RoundLabel>Cuartos de Final</RoundLabel>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {quarterfinals.map((slot, i) => (
              <MatchCard key={i} slot={slot} />
            ))}
          </div>
        </div>
        <div>
          <RoundLabel>Semifinal</RoundLabel>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {semifinals.map((slot, i) => (
              <MatchCard key={i} slot={slot} />
            ))}
          </div>
        </div>
        <div>
          <RoundLabel gold>Final</RoundLabel>
          <div className="mt-2">
            <MatchCard slot={final} />
          </div>
        </div>
      </div>
    </div>
  );
};
