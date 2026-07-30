import React from 'react';
import { Club, MatchResult } from '../../types';
import { computeDomesticQualificationZones } from '../../utils/competitionStats';
import { Star, Globe, Shield } from 'lucide-react';
import { KnockoutBracket } from './KnockoutBracket';
import { ClubLogo } from '../ClubLogo';

interface StandingsTableProps {
  clubs: Club[];
  matches: MatchResult[];
  competition: string;
}

const DOMESTIC_COMPETITIONS = ['1ra División', '2da División'];
const BRACKET_COMPETITIONS = ['UEFA Champions League', 'UEFA Europa League', 'UEFA Conference League'];

export const StandingsTable: React.FC<StandingsTableProps> = ({ clubs, matches, competition }) => {
  if (DOMESTIC_COMPETITIONS.includes(competition)) {
    return <DomesticStandings clubs={clubs} competition={competition} />;
  }

  if (BRACKET_COMPETITIONS.includes(competition)) {
    return <KnockoutBracket clubs={clubs} matches={matches} competition={competition} />;
  }

  return (
    <div className="fc-card p-10 text-center border-dashed border-slate-300 bg-white text-slate-500 text-sm font-tech">
      No hay clasificación disponible para {competition}.
    </div>
  );
};

const DomesticStandings: React.FC<{ clubs: Club[]; competition: string }> = ({ clubs, competition }) => {
  const isFirstDiv = competition === '1ra División';

  const sortedClubs = [...clubs]
    .filter(c => {
      if (isFirstDiv) {
        return !c.division || c.division === '1ra División' || c.division === 'Primera División';
      }
      return c.division === '2da División' || c.division === 'Segunda División';
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffB = b.goalsFor - b.goalsAgainst;
      const diffA = a.goalsFor - a.goalsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.goalsFor - a.goalsFor;
    });

  const qualificationZones = isFirstDiv ? computeDomesticQualificationZones(sortedClubs) : {};

  return (
    <div className="space-y-4">
      <div className="fc-card p-3 rounded-2xl border-slate-200 bg-slate-50 flex items-center gap-3 text-[10px] font-mono text-slate-600 flex-wrap">
        {isFirstDiv ? (
          <>
            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-indigo-600 fill-indigo-600" /> Pos 1-8: UEFA Champions League</span>
            <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-amber-600" /> Pos 9-16: UEFA Europa League</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-600" /> Pos 17-24: UEFA Conference League</span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Ascenso Directo</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-500" /> Play-off Ascenso</span>
          </>
        )}
      </div>

      <div className="fc-card rounded-2xl overflow-hidden border-slate-200 shadow-md bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-tech font-extrabold text-xs uppercase border-b border-slate-200 tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">Pos</th>
                <th className="py-3.5 px-4">Club / Manager</th>
                <th className="py-3.5 px-3 text-center">PJ</th>
                <th className="py-3.5 px-3 text-center">PG</th>
                <th className="py-3.5 px-3 text-center">PE</th>
                <th className="py-3.5 px-3 text-center">PP</th>
                <th className="py-3.5 px-3 text-center">GF</th>
                <th className="py-3.5 px-3 text-center">GC</th>
                <th className="py-3.5 px-3 text-center">DG</th>
                <th className="py-3.5 px-4 text-center">PTS</th>
                <th className="py-3.5 px-4 text-center hidden md:table-cell">Racha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-sans">
              {sortedClubs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-500 font-tech">
                    No hay clubes registrados en {competition}.
                  </td>
                </tr>
              ) : (
                sortedClubs.map((club, idx) => {
                  const pos = idx + 1;
                  const zoneInfo = qualificationZones[club.id];
                  const isDirectPromotion = !isFirstDiv && pos <= 2;
                  const isPlayoffPromotion = !isFirstDiv && (pos === 3 || pos === 4);

                  return (
                    <tr
                      key={club.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        zoneInfo?.zone === 'CHAMPIONS' || isDirectPromotion ? 'border-l-4 border-l-indigo-500 bg-indigo-50/40' :
                        zoneInfo?.zone === 'EUROPA' || isPlayoffPromotion ? 'border-l-4 border-l-amber-500 bg-amber-50/30' :
                        zoneInfo?.zone === 'CONFERENCE' ? 'border-l-4 border-l-emerald-500 bg-emerald-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-display font-black text-sm">
                        <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center ${
                          pos === 1 ? 'bg-amber-400 text-black' :
                          pos === 2 ? 'bg-slate-300 text-black' :
                          pos === 3 ? 'bg-amber-700 text-white' : 'text-slate-500'
                        }`}>
                          {pos}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <ClubLogo src={club.logoUrl} alt={club.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                          <div>
                            <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                              {club.name}
                              <span className="text-[9px] bg-slate-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">
                                {club.platform}
                              </span>
                              {zoneInfo?.zone === 'CHAMPIONS' && (
                                <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-0.5">
                                  <Star className="w-2.5 h-2.5 fill-indigo-700 text-indigo-700" /> UCL
                                </span>
                              )}
                              {zoneInfo?.zone === 'EUROPA' && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-0.5">
                                  <Globe className="w-2.5 h-2.5" /> UEL
                                </span>
                              )}
                              {zoneInfo?.zone === 'CONFERENCE' && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-0.5">
                                  <Shield className="w-2.5 h-2.5" /> UECL
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-tech">@{club.manager}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono text-slate-700">{club.played}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-emerald-700">{club.won}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-500">{club.drawn}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-rose-600">{club.lost}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-700">{club.goalsFor}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-500">{club.goalsAgainst}</td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">
                        {(club.goalsFor - club.goalsAgainst) > 0 ? `+${club.goalsFor - club.goalsAgainst}` : club.goalsFor - club.goalsAgainst}
                      </td>

                      <td className="py-3.5 px-4 text-center font-display font-black text-lg text-[#00ba68]">
                        {club.points}
                      </td>

                      <td className="py-3.5 px-4 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1 font-mono text-[10px] font-bold">
                          {club.form.map((res, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 rounded flex items-center justify-center ${
                                res === 'W' ? 'bg-[#00ba68] text-white' :
                                res === 'D' ? 'bg-amber-400 text-black' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
