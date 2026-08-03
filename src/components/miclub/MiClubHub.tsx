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
      {/* Banner Principal del Club con Estilo EA FC 27 eSports */}
      <div className="fc-card p-6 md:p-8 rounded-3xl border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#02f59b]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#02f59b] to-emerald-500 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition" />
            <ClubLogo src={currentClub.logoUrl} alt={currentClub.name} className="relative w-20 h-20 rounded-2xl object-cover border-2 border-[#02f59b] bg-slate-900 shadow-xl" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-[#02f59b]/20 border border-[#02f59b]/40 text-[#02f59b] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {currentClub.platform}
              </span>
              <span className="text-[10px] text-slate-400 font-tech uppercase tracking-wide">
                Estadio: <strong className="text-white">{currentClub.stadium}</strong>
              </span>
            </div>

            <h1 className="font-display font-black text-3xl md:text-4xl text-white italic uppercase tracking-wider mt-1 drop-shadow-md">
              {currentClub.name}
            </h1>

            <p className="text-xs text-slate-300 font-tech flex items-center gap-1.5 mt-0.5">
              <span>Manager:</span>
              <strong className="text-[#02f59b] font-mono font-bold">@{currentClub.manager}</strong>
              <span className="text-slate-500">({currentClub.gamertag})</span>
            </p>
          </div>
        </div>

        {/* Bloques de Estadísticas KPI */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto relative z-10">
          <div className="bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-800/80 shadow-inner text-center">
            <span className="text-[10px] text-slate-400 font-tech uppercase tracking-wider block">Media Plantilla</span>
            <span className="font-display font-black text-2xl md:text-3xl text-[#02f59b] tracking-tight">{avgRating} <span className="text-xs font-mono">OVR</span></span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-800/80 shadow-inner text-center">
            <span className="text-[10px] text-slate-400 font-tech uppercase tracking-wider block">Plantilla</span>
            <span className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">{clubPlayers.length} <span className="text-xs font-mono text-slate-400">JUG</span></span>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-800/80 shadow-inner text-center">
            <span className="text-[10px] text-slate-400 font-tech uppercase tracking-wider block">Presupuesto</span>
            <span className="font-display font-black text-xl md:text-2xl text-emerald-400 tracking-tight">${(currentClub.budget / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </div>

      {/* Tira de Navegación por Pestañas eSports */}
      <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800/80 shadow-xl overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeMiClubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMiClubTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-tech font-extrabold uppercase transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-[#02f59b] text-slate-950 shadow-[0_0_15px_rgba(2,245,155,0.4)] font-black'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800/90 border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-[#02f59b]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
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
