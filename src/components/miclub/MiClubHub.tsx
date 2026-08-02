import React, { useState } from 'react';
import { ClubLogo } from '../ClubLogo';
import { Player, Club, FinancialTransaction, TransferItem, MatchResult, Sponsor, SponsorObjective, ClubSponsorContract } from '../../types';
import { Shield, PlayCircle, BarChart3, Users2, Landmark, CalendarDays, BarChart4, Wallet, FileText, Handshake } from 'lucide-react';
import { RecentGamesTab } from './RecentGamesTab';
import { TeamStatsTab } from './TeamStatsTab';
import { LineupTab } from './LineupTab';
import { StadiumTab } from './StadiumTab';
import { ScheduleStandingsTab } from './ScheduleStandingsTab';
import { FullStatsTab } from './FullStatsTab';
import { FinancesTab } from './FinancesTab';
import { TransactionsHistoryTab } from './TransactionsHistoryTab';
import { SponsorTab } from './SponsorTab';

interface MiClubHubProps {
  currentClub: Club | null;
  clubs: Club[];
  matches: MatchResult[];
  players: Player[];
  transactions?: FinancialTransaction[];
  transfers?: TransferItem[];
  onRemovePlayer: (playerId: string) => void;
  onToggleStarter: (playerId: string) => void;
  onUpdatePlayerValue?: (playerId: string, newValue: number) => void;
  onSetTransferPrice?: (player: Player, price: number) => void;
  onRemoveFromMarket?: (playerId: string) => void;
  sponsors?: Sponsor[];
  sponsorObjectives?: SponsorObjective[];
  sponsorContracts?: ClubSponsorContract[];
  currentSeasonNumber?: number;
  onSignSponsor?: (sponsorId: string) => void;
}

type MiClubTab = 'recientes' | 'stats-equipo' | 'alineaciones' | 'estadio' | 'calendario' | 'stats-completas' | 'financiero' | 'transacciones' | 'patrocinador';

const TABS: { id: MiClubTab; label: string; icon: React.ElementType }[] = [
  { id: 'recientes', label: 'Juegos Recientes', icon: PlayCircle },
  { id: 'stats-equipo', label: 'Estadisticas de Equipo', icon: BarChart3 },
  { id: 'alineaciones', label: 'Alineaciones', icon: Users2 },
  { id: 'estadio', label: 'Estadio', icon: Landmark },
  { id: 'calendario', label: 'Calendario y Clasificacion', icon: CalendarDays },
  { id: 'stats-completas', label: 'Estadisticas Completas', icon: BarChart4 },
  { id: 'financiero', label: 'Estado Financiero', icon: Wallet },
  { id: 'transacciones', label: 'Historial de Transacciones', icon: FileText },
  { id: 'patrocinador', label: 'Patrocinador', icon: Handshake }
];

export const MiClubHub: React.FC<MiClubHubProps> = ({
  currentClub,
  clubs,
  matches,
  players,
  transactions = [],
  transfers = [],
  onRemovePlayer,
  onToggleStarter,
  onUpdatePlayerValue,
  onSetTransferPrice,
  onRemoveFromMarket,
  sponsors = [],
  sponsorObjectives = [],
  sponsorContracts = [],
  currentSeasonNumber = 1,
  onSignSponsor
}) => {
  const [activeMiClubTab, setActiveMiClubTab] = useState<MiClubTab>('recientes');

  if (!currentClub) {
    return (
      <div className="p-8 text-center fc-card rounded-xl">
        <Shield className="w-12 h-12 text-[#02f59b] mx-auto mb-3" />
        <h2 className="font-display font-bold text-2xl text-white">Selecciona o Inscribe un Club</h2>
        <p className="text-xs text-slate-400 mt-1">Debes tener un club asignado para gestionar la plantilla.</p>
      </div>
    );
  }

  const clubPlayers = players.filter(p => p.clubId === currentClub.id);
  const starters = clubPlayers.filter(p => p.isStarter);
  const avgRating = starters.length > 0
    ? Math.round(starters.reduce((acc, p) => acc + p.rating, 0) / starters.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="fc-card p-6 rounded-2xl border-emerald-300 bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <ClubLogo src={currentClub.logoUrl} alt={currentClub.name} className="w-16 h-16 rounded-xl object-cover border-2 border-[#02f59b]" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-3xl text-white italic uppercase tracking-wider">
                {currentClub.name}
              </h1>
              <span className="bg-[#02f59b] text-black text-[10px] font-extrabold px-2 py-0.5 rounded font-mono uppercase">
                {currentClub.platform}
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-tech">
              Manager: <strong className="text-[#02f59b]">@{currentClub.manager}</strong> ({currentClub.gamertag}) - Estadio: {currentClub.stadium}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[10px] text-emerald-200 font-tech uppercase block">Media Plantilla</span>
            <span className="font-display font-black text-2xl text-[#02f59b]">{avgRating} OVR</span>
          </div>

          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[10px] text-emerald-200 font-tech uppercase block">Jugadores</span>
            <span className="font-display font-black text-2xl text-white">{clubPlayers.length}</span>
          </div>

          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <span className="text-[10px] text-emerald-200 font-tech uppercase block">Presupuesto</span>
            <span className="font-display font-black text-xl text-[#02f59b]">${(currentClub.budget / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMiClubTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                activeMiClubTab === tab.id
                  ? 'bg-[#00ba68] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeMiClubTab === 'recientes' && (
        <RecentGamesTab currentClub={currentClub} clubs={clubs} matches={matches} />
      )}
      {activeMiClubTab === 'stats-equipo' && (
        <TeamStatsTab currentClub={currentClub} players={players} />
      )}
      {activeMiClubTab === 'alineaciones' && (
        <LineupTab
          currentClub={currentClub}
          players={players}
          transfers={transfers}
          onRemovePlayer={onRemovePlayer}
          onToggleStarter={onToggleStarter}
          onUpdatePlayerValue={onUpdatePlayerValue}
          onSetTransferPrice={onSetTransferPrice}
          onRemoveFromMarket={onRemoveFromMarket}
        />
      )}
      {activeMiClubTab === 'estadio' && (
        <StadiumTab currentClub={currentClub} />
      )}
      {activeMiClubTab === 'calendario' && (
        <ScheduleStandingsTab currentClub={currentClub} clubs={clubs} matches={matches} />
      )}
      {activeMiClubTab === 'stats-completas' && (
        <FullStatsTab currentClub={currentClub} players={players} matches={matches} />
      )}
      {activeMiClubTab === 'financiero' && (
        <FinancesTab currentClub={currentClub} transactions={transactions} />
      )}
      {activeMiClubTab === 'transacciones' && (
        <TransactionsHistoryTab currentClub={currentClub} transactions={transactions} />
      )}
      {activeMiClubTab === 'patrocinador' && (
        <SponsorTab
          currentClub={currentClub}
          clubs={clubs}
          matches={matches}
          sponsors={sponsors}
          sponsorObjectives={sponsorObjectives}
          sponsorContracts={sponsorContracts}
          currentSeasonNumber={currentSeasonNumber}
          onSignSponsor={onSignSponsor ?? (() => {})}
        />
      )}
    </div>
  );
};
