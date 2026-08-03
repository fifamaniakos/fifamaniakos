import React from 'react';
import { Club, MatchResult } from '../../types';
import { ClubLogo } from '../ClubLogo';
import { CompetitionLogo } from '../competitions/CompetitionLogo';
import { CalendarClock } from 'lucide-react';

interface RecentGamesTabProps {
  currentClub: Club;
  clubs: Club[];
  matches: MatchResult[];
}

export const RecentGamesTab: React.FC<RecentGamesTabProps> = ({ currentClub, clubs, matches }) => {
  const recentMatches = matches
    .filter(m => m.status === 'CONFIRMADO' && (m.homeClubId === currentClub.id || m.awayClubId === currentClub.id))
    .sort((a, b) => b.matchday - a.matchday)
    .slice(0, 8);

  if (recentMatches.length === 0) {
    return (
      <div className="fc-card p-10 rounded-2xl border-slate-200 text-center text-slate-500 text-sm font-tech">
        <CalendarClock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        Todavía no hay partidos confirmados para {currentClub.name}.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentMatches.map(match => {
        const isHome = match.homeClubId === currentClub.id;
        const opponentId = isHome ? match.awayClubId : match.homeClubId;
        const opponent = clubs.find(c => c.id === opponentId);
        const ownGoals = isHome ? match.homeGoals : match.awayGoals;
        const opponentGoals = isHome ? match.awayGoals : match.homeGoals;

        const result: 'W' | 'D' | 'L' = ownGoals > opponentGoals ? 'W' : ownGoals < opponentGoals ? 'L' : 'D';
        const resultStyle = {
          W: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          D: 'bg-slate-100 text-slate-700 border-slate-300',
          L: 'bg-rose-100 text-rose-800 border-rose-300'
        }[result];
        const resultLabel = { W: 'GANÓ', D: 'EMPATÓ', L: 'PERDIÓ' }[result];

        return (
          <div
            key={match.id}
            className="fc-card p-4 rounded-2xl border-slate-200 flex items-center justify-between gap-4 flex-wrap"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-tech font-extrabold uppercase border shrink-0 ${resultStyle}`}>
                {resultLabel}
              </span>
              {match.competition && <CompetitionLogo competition={match.competition} size="sm" />}
              <div className="min-w-0">
                <p className="text-[10px] text-slate-500 font-tech uppercase">
                  Jornada {match.matchday} {match.competition ? `• ${match.competition}` : ''} • {isHome ? 'Local' : 'Visitante'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <ClubLogo src={opponent?.logoUrl} alt={opponent?.name || 'Rival'} className="w-6 h-6 rounded object-cover shrink-0" />
                  <span className="font-bold text-sm text-slate-900 truncate">vs {opponent?.name || 'Rival'}</span>
                </div>
              </div>
            </div>

            <div className="font-display font-black text-2xl text-slate-900 shrink-0">
              {isHome ? `${match.homeGoals} - ${match.awayGoals}` : `${match.awayGoals} - ${match.homeGoals}`}
            </div>
          </div>
        );
      })}
    </div>
  );
};
