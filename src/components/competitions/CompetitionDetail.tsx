import React, { useState } from 'react';
import { Club, MatchResult, Player } from '../../types';
import { Trophy, Calendar, Target, Zap, Star, Globe, Crown } from 'lucide-react';
import { StandingsTable } from './StandingsTable';
import { PlayerStatsTable } from './PlayerStatsTable';
import { FixtureJornadaList } from './FixtureJornadaList';
import { FixtureJornadaDetail } from './FixtureJornadaDetail';
import { groupFixtureIntoRounds } from '../../utils/competitionStats';

interface CompetitionDetailProps {
  competition: string;
  clubs: Club[];
  matches: MatchResult[];
  players: Player[];
  isAdmin?: boolean;
  currentClubId?: string;
  canReportResults?: boolean;
  subscriptionRequiredMessage?: string;
  onAddMatchResult?: (match: MatchResult) => void;
}

type CompetitionTab = 'tabla' | 'fixture' | 'goleadores' | 'asistencias' | 'tarjetas';

const CardsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <span className={`flex items-center gap-0.5 ${className || ''}`}>
    <span className="w-2.5 h-3.5 bg-amber-400 rounded-xs inline-block shadow-xs" />
    <span className="w-2.5 h-3.5 bg-rose-600 rounded-xs inline-block shadow-xs" />
  </span>
);

import { CompetitionLogo } from './CompetitionLogo';

const CompetitionBadge: React.FC<{ competition: string; className?: string }> = ({ competition, className }) => {
  return <CompetitionLogo competition={competition} className={className} size="lg" />;
};

export const CompetitionDetail: React.FC<CompetitionDetailProps> = ({
  competition,
  clubs,
  matches,
  players,
  isAdmin = false,
  currentClubId,
  canReportResults = true,
  subscriptionRequiredMessage,
  onAddMatchResult
}) => {
  const [activeTab, setActiveTab] = useState<CompetitionTab>('tabla');
  const [selectedRoundKey, setSelectedRoundKey] = useState<string | null>(null);

  const competitionMatches = matches.filter(m => m.competition === competition);

  const rounds = activeTab === 'fixture' ? groupFixtureIntoRounds(competitionMatches, competition) : [];
  const activeRound = rounds.find(r => r.key === selectedRoundKey) || null;

  const tabs: { id: CompetitionTab; label: string; icon: React.ElementType }[] = [
    { id: 'tabla', label: 'Clasificación', icon: Trophy },
    { id: 'fixture', label: 'Fixture', icon: Calendar },
    { id: 'goleadores', label: 'Goleadores', icon: Target },
    { id: 'asistencias', label: 'Asistencias', icon: Zap },
    { id: 'tarjetas', label: 'Tarjetas', icon: CardsIcon }
  ];

  const handleSelectTab = (tab: CompetitionTab) => {
    setActiveTab(tab);
    setSelectedRoundKey(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CompetitionLogo competition={competition} size="lg" />
            <div>
              <span className="px-2 py-0.5 bg-[#02f59b] text-black text-[9px] font-bold font-tech uppercase rounded tracking-wider">
                COMPETICIONES FIFAMANIAKOS FC 27
              </span>
              <h1 className="font-display font-black text-xl md:text-2xl text-white uppercase italic tracking-wide">
                {competition}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="fc-card p-3 rounded-2xl border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#00ba68] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'tabla' && (
        <StandingsTable
          clubs={clubs}
          matches={competitionMatches}
          competition={competition}
        />
      )}

      {activeTab === 'fixture' && (
        activeRound === null ? (
          <FixtureJornadaList
            matches={competitionMatches}
            competition={competition}
            onSelectRound={setSelectedRoundKey}
          />
        ) : (
          <FixtureJornadaDetail
            clubs={clubs}
            players={players}
            matches={activeRound.matches}
            roundLabel={activeRound.label}
            competition={competition}
            isAdmin={isAdmin}
            currentClubId={currentClubId}
            canReportResults={canReportResults}
            subscriptionRequiredMessage={subscriptionRequiredMessage}
            onAddMatchResult={onAddMatchResult}
            onBack={() => setSelectedRoundKey(null)}
          />
        )
      )}

      {activeTab === 'goleadores' && (
        <PlayerStatsTable statType="goals" clubs={clubs} players={players} matches={competitionMatches} competition={competition} />
      )}

      {activeTab === 'asistencias' && (
        <PlayerStatsTable statType="assists" clubs={clubs} players={players} matches={competitionMatches} competition={competition} />
      )}

      {activeTab === 'tarjetas' && (
        <PlayerStatsTable statType="cards" clubs={clubs} players={players} matches={competitionMatches} competition={competition} />
      )}
    </div>
  );
};
