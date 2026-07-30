import React from 'react';
import { MatchResult } from '../../types';
import { Calendar, ChevronRight, Trophy } from 'lucide-react';
import { groupFixtureIntoRounds } from '../../utils/competitionStats';

interface FixtureJornadaListProps {
  matches: MatchResult[];
  competition: string;
  onSelectRound: (roundKey: string) => void;
}

export const FixtureJornadaList: React.FC<FixtureJornadaListProps> = ({ matches, competition, onSelectRound }) => {
  const rounds = groupFixtureIntoRounds(matches, competition);

  if (rounds.length === 0) {
    return (
      <div className="fc-card p-10 text-center space-y-3 border-dashed border-slate-300 bg-white">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
        <p className="text-xs font-tech font-bold text-slate-600">
          Aún no se han generado jornadas para {competition}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rounds.map(round => {
        const isKnockout = !round.key.startsWith('J');
        return (
          <button
            key={round.key}
            onClick={() => onSelectRound(round.key)}
            className={`w-full fc-card fc-card-hover p-4 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all text-left ${
              isKnockout ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl font-display font-black text-sm flex items-center justify-center shrink-0 shadow-inner ${
                isKnockout ? 'bg-amber-500 text-white' : 'bg-slate-900 text-[#02f59b]'
              }`}>
                {isKnockout ? <Trophy className="w-5 h-5" /> : round.badge}
              </div>
              <div>
                <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase italic">
                  {round.label}
                </h3>
                <span className="text-[11px] font-mono text-slate-400">{round.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] font-tech font-bold text-slate-600 uppercase">
                {round.matches.length} partidos
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-tech font-bold uppercase">
                {round.confirmedCount} confirmados
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
