import React from 'react';
import { Club, MatchResult, Player } from '../../types';
import { CompetitionDetail } from './CompetitionDetail';

interface CompetitionsHubProps {
  clubs: Club[];
  matches: MatchResult[];
  players?: Player[];
  selectedCompetition: string;
  onSelectCompetition: (comp: string) => void;
  onAddMatchResult?: (match: MatchResult) => void;
}

const KNOWN_COMPETITIONS = ['1ra División', '2da División', 'UEFA Champions League', 'UEFA Europa League', 'Copa del Rey'];

export const CompetitionsHub: React.FC<CompetitionsHubProps> = ({
  clubs,
  matches,
  players = [],
  selectedCompetition,
  onAddMatchResult
}) => {
  const competition = KNOWN_COMPETITIONS.includes(selectedCompetition) ? selectedCompetition : '1ra División';

  return (
    <CompetitionDetail
      competition={competition}
      clubs={clubs}
      matches={matches}
      players={players}
      onAddMatchResult={onAddMatchResult}
    />
  );
};
