import React from 'react';
import { Club, Player } from '../../types';
import { BarChart3 } from 'lucide-react';

interface FullStatsTabProps {
  currentClub: Club;
  players: Player[];
}

export const FullStatsTab: React.FC<FullStatsTabProps> = ({ currentClub, players }) => {
  const clubPlayers = players
    .filter(p => p.clubId === currentClub.id)
    .sort((a, b) => (b.goals || 0) - (a.goals || 0));

  if (clubPlayers.length === 0) {
    return (
      <div className="fc-card p-10 rounded-2xl border-slate-200 text-center text-slate-500 text-sm font-tech">
        <BarChart3 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        {currentClub.name} todavía no tiene jugadores en la plantilla.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 fc-card">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-100 text-slate-600 font-tech uppercase text-[10px]">
          <tr>
            <th className="p-3">Jugador</th>
            <th className="p-3">Pos</th>
            <th className="p-3 text-center">OVR</th>
            <th className="p-3 text-center">PJ</th>
            <th className="p-3 text-center">Goles</th>
            <th className="p-3 text-center">Asist.</th>
            <th className="p-3 text-center">TA</th>
            <th className="p-3 text-center">TR</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 font-tech">
          {clubPlayers.map(player => (
            <tr key={player.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="p-3 font-bold text-slate-900">{player.name}</td>
              <td className="p-3">
                <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">{player.position}</span>
              </td>
              <td className="p-3 text-center font-mono font-bold text-slate-700">{player.rating}</td>
              <td className="p-3 text-center">{player.matchesPlayed || 0}</td>
              <td className="p-3 text-center font-display font-black text-emerald-700">{player.goals || 0}</td>
              <td className="p-3 text-center font-display font-black text-blue-700">{player.assists || 0}</td>
              <td className="p-3 text-center">
                <span className="font-mono font-bold text-amber-700">{player.yellowCards || 0}</span>
              </td>
              <td className="p-3 text-center">
                <span className="font-mono font-bold text-rose-700">{player.redCards || 0}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
