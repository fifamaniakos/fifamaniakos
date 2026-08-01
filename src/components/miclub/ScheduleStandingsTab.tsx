import React from 'react';
import { Club, MatchResult } from '../../types';
import { StandingsTable } from '../competitions/StandingsTable';
import { ClubLogo } from '../ClubLogo';
import { CompetitionLogo } from '../competitions/CompetitionLogo';
import { CalendarDays, ListOrdered } from 'lucide-react';

interface ScheduleStandingsTabProps {
  currentClub: Club;
  clubs: Club[];
  matches: MatchResult[];
}

export const ScheduleStandingsTab: React.FC<ScheduleStandingsTabProps> = ({ currentClub, clubs, matches }) => {
  const clubMatches = matches
    .filter(m => m.homeClubId === currentClub.id || m.awayClubId === currentClub.id)
    .sort((a, b) => a.matchday - b.matchday);

  const statusStyle: Record<MatchResult['status'], string> = {
    CONFIRMADO: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    PENDIENTE: 'bg-amber-100 text-amber-800 border-amber-300',
    RECHAZADO: 'bg-rose-100 text-rose-800 border-rose-300'
  };

  return (
    <div className="space-y-6">
      <div className="fc-card p-5 rounded-2xl border-slate-200 space-y-3">
        <h3 className="font-display font-bold text-sm uppercase text-slate-800 flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-blue-500" /> Calendario de {currentClub.name}
        </h3>

        {clubMatches.length === 0 ? (
          <p className="text-xs text-slate-400 font-tech italic py-4 text-center">No hay partidos programados todavía.</p>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {clubMatches.map(match => {
              const isHome = match.homeClubId === currentClub.id;
              const opponent = clubs.find(c => c.id === (isHome ? match.awayClubId : match.homeClubId));
              return (
                <div key={match.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    {match.competition && <CompetitionLogo competition={match.competition} size="sm" />}
                    <span className="text-[10px] font-tech text-slate-500 uppercase shrink-0">J{match.matchday}</span>
                    <ClubLogo src={opponent?.logoUrl} alt={opponent?.name || 'Rival'} className="w-6 h-6 rounded object-cover shrink-0" />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {isHome ? 'vs' : '@'} {opponent?.name || 'Rival'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {match.status === 'CONFIRMADO' && (
                      <span className="font-display font-black text-sm text-slate-900">
                        {match.homeGoals} - {match.awayGoals}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[9px] font-tech font-extrabold uppercase border ${statusStyle[match.status]}`}>
                      {match.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-display font-bold text-sm uppercase text-slate-800 flex items-center gap-1.5">
          <ListOrdered className="w-4 h-4 text-emerald-600" /> Clasificación — {currentClub.division || '1ra División'}
        </h3>
        <StandingsTable clubs={clubs} matches={matches} competition={currentClub.division || '1ra División'} />
      </div>
    </div>
  );
};
