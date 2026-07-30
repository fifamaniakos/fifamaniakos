import React, { useState } from 'react';
import { Club, MatchResult } from '../types';
import { Trophy, Shield, Star, Award, ChevronRight, Zap, CheckCircle2, Flame, Calendar, RefreshCw } from 'lucide-react';

interface EuropeanCupsHubProps {
  clubs: Club[];
  matches: MatchResult[];
  onAddMatchResult?: (match: MatchResult) => void;
}

export const EuropeanCupsHub: React.FC<EuropeanCupsHubProps> = ({
  clubs,
  matches,
  onAddMatchResult
}) => {
  const [activeCup, setActiveCup] = useState<'UCL' | 'UEL' | 'UECL' | 'SUPERCOP'>('UCL');

  // Filter matches for current cup
  const getCupNameString = (cupKey: 'UCL' | 'UEL' | 'UECL' | 'SUPERCOP') => {
    switch (cupKey) {
      case 'UCL': return 'UEFA Champions League';
      case 'UEL': return 'UEFA Europa League';
      case 'UECL': return 'UEFA Conference League';
      case 'SUPERCOP': return 'Supercopa de Europa';
    }
  };

  const currentCupName = getCupNameString(activeCup);
  const cupMatches = matches.filter(m => m.competition === currentCupName || m.notes?.includes(activeCup));

  const [uclSubTab, setUclSubTab] = useState<'tabla' | 'cuadro' | 'reglamento'>('tabla');

  const uelTeams = clubs.slice(8, 24);
  const ueclTeams = clubs.slice(16, 32);

  // Generate 36 UCL teams (using registered clubs + European top giants if needed)
  const EuropeanGiantsPreset = [
    { name: 'Real Madrid', country: '🇪🇸 España', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 19, pj: 8, pg: 6, pe: 1, pp: 1, gf: 20, gc: 8 },
    { name: 'Manchester City', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra', logoUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100&auto=format&fit=crop&q=80', pts: 18, pj: 8, pg: 5, pe: 3, pp: 0, gf: 19, gc: 7 },
    { name: 'FC Bayern München', country: '🇩🇪 Alemania', logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80', pts: 17, pj: 8, pg: 5, pe: 2, pp: 1, gf: 18, gc: 9 },
    { name: 'Paris Saint-Germain', country: '🇫🇷 Francia', logoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=100&auto=format&fit=crop&q=80', pts: 16, pj: 8, pg: 5, pe: 1, pp: 2, gf: 16, gc: 10 },
    { name: 'FC Barcelona', country: '🇪🇸 España', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 16, pj: 8, pg: 5, pe: 1, pp: 2, gf: 17, gc: 11 },
    { name: 'FC Inter Milano', country: '🇮🇹 Italia', logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80', pts: 15, pj: 8, pg: 4, pe: 3, pp: 1, gf: 14, gc: 8 },
    { name: 'Arsenal FC', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra', logoUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100&auto=format&fit=crop&q=80', pts: 15, pj: 8, pg: 4, pe: 3, pp: 1, gf: 15, gc: 9 },
    { name: 'Bayer 04 Leverkusen', country: '🇩🇪 Alemania', logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80', pts: 14, pj: 8, pg: 4, pe: 2, pp: 2, gf: 13, gc: 10 },
    { name: 'Atlético de Madrid', country: '🇪🇸 España', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 14, pj: 8, pg: 4, pe: 2, pp: 2, gf: 14, gc: 12 },
    { name: 'Juventus FC', country: '🇮🇹 Italia', logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80', pts: 13, pj: 8, pg: 3, pe: 4, pp: 1, gf: 11, gc: 8 },
    { name: 'Liverpool FC', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra', logoUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100&auto=format&fit=crop&q=80', pts: 13, pj: 8, pg: 4, pe: 1, pp: 3, gf: 12, gc: 10 },
    { name: 'Borussia Dortmund', country: '🇩🇪 Alemania', logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80', pts: 13, pj: 8, pg: 4, pe: 1, pp: 3, gf: 15, gc: 14 },
    { name: 'AC Milan', country: '🇮🇹 Italia', logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80', pts: 12, pj: 8, pg: 3, pe: 3, pp: 2, gf: 10, gc: 9 },
    { name: 'Atalanta BC', country: '🇮🇹 Italia', logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80', pts: 12, pj: 8, pg: 3, pe: 3, pp: 2, gf: 11, gc: 10 },
    { name: 'SL Benfica', country: '🇵🇹 Portugal', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 11, pj: 8, pg: 3, pe: 2, pp: 3, gf: 10, gc: 11 },
    { name: 'Sporting CP', country: '🇵🇹 Portugal', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 11, pj: 8, pg: 3, pe: 2, pp: 3, gf: 12, gc: 12 },
    { name: 'Feyenoord Rotterdam', country: '🇳🇱 Países Bajos', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 10, pj: 8, pg: 3, pe: 1, pp: 4, gf: 11, gc: 13 },
    { name: 'PSV Eindhoven', country: '🇳🇱 Países Bajos', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 10, pj: 8, pg: 2, pe: 4, pp: 2, gf: 10, gc: 10 },
    { name: 'Aston Villa FC', country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra', logoUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100&auto=format&fit=crop&q=80', pts: 10, pj: 8, pg: 3, pe: 1, pp: 4, gf: 9, gc: 11 },
    { name: 'RB Leipzig', country: '🇩🇪 Alemania', logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=80', pts: 9, pj: 8, pg: 2, pe: 3, pp: 3, gf: 11, gc: 13 },
    { name: 'AS Monaco', country: '🇫🇷 Francia', logoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=100&auto=format&fit=crop&q=80', pts: 9, pj: 8, pg: 2, pe: 3, pp: 3, gf: 10, gc: 12 },
    { name: 'LOSC Lille', country: '🇫🇷 Francia', logoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=100&auto=format&fit=crop&q=80', pts: 9, pj: 8, pg: 2, pe: 3, pp: 3, gf: 8, gc: 10 },
    { name: 'Celtic FC', country: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escocia', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 8, pj: 8, pg: 2, pe: 2, pp: 4, gf: 9, gc: 14 },
    { name: 'Club Brugge KV', country: '🇧🇪 Bélgica', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 8, pj: 8, pg: 2, pe: 2, pp: 4, gf: 7, gc: 12 },
    { name: 'Dinamo Zagreb', country: '🇭🇷 Croacia', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 7, pj: 8, pg: 2, pe: 1, pp: 5, gf: 8, gc: 16 },
    { name: 'FC Shakhtar Donetsk', country: '🇺🇦 Ucrania', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 7, pj: 8, pg: 2, pe: 1, pp: 5, gf: 6, gc: 15 },
    { name: 'Red Star Belgrade', country: '🇷🇸 Serbia', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 6, pj: 8, pg: 1, pe: 3, pp: 4, gf: 8, gc: 17 },
    { name: 'Sturm Graz', country: '🇦🇹 Austria', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 6, pj: 8, pg: 1, pe: 3, pp: 4, gf: 5, gc: 13 },
    { name: 'Brest 29', country: '🇫🇷 Francia', logoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=100&auto=format&fit=crop&q=80', pts: 5, pj: 8, pg: 1, pe: 2, pp: 5, gf: 6, gc: 14 },
    { name: 'Sparta Praha', country: '🇨🇿 Rep. Checa', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 4, pj: 8, pg: 1, pe: 1, pp: 6, gf: 5, gc: 18 },
    { name: 'BSC Young Boys', country: '🇨🇭 Suiza', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 4, pj: 8, pg: 1, pe: 1, pp: 6, gf: 4, gc: 19 },
    { name: 'FC Red Bull Salzburg', country: '🇦🇹 Austria', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 3, pj: 8, pg: 1, pe: 0, pp: 7, gf: 4, gc: 20 },
    { name: 'ŠK Slovan Bratislava', country: '🇸🇰 Eslovaquia', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 3, pj: 8, pg: 1, pe: 0, pp: 7, gf: 3, gc: 22 },
    { name: 'Bologna FC 1909', country: '🇮🇹 Italia', logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=80', pts: 2, pj: 8, pg: 0, pe: 2, pp: 6, gf: 2, gc: 15 },
    { name: 'Girona FC', country: '🇪🇸 España', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 2, pj: 8, pg: 0, pe: 2, pp: 6, gf: 3, gc: 18 },
    { name: 'GNK Dinamo', country: '🇭🇷 Croacia', logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80', pts: 1, pj: 8, pg: 0, pe: 1, pp: 7, gf: 2, gc: 24 }
  ];

  // Merge registered clubs with presets to ensure 36 slots
  const full36UclTable = EuropeanGiantsPreset.map((presetItem, idx) => {
    if (clubs[idx]) {
      return {
        ...presetItem,
        name: clubs[idx].name,
        logoUrl: clubs[idx].logoUrl || presetItem.logoUrl,
        country: clubs[idx].division || presetItem.country
      };
    }
    return presetItem;
  });

  return (
    <div className="space-y-6">
      {/* European Cups Navigation Bar */}
      <div className="fc-card p-3 rounded-2xl border-slate-200 bg-slate-900 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl text-black font-extrabold shadow-md">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display font-black text-base uppercase tracking-wider text-white italic">
                COMPETICIONES EUROPEAS <span className="text-[#02f59b]">UEFA</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-tech">Torneos continentales de máxima categoría.</p>
            </div>
          </div>

          {/* Cup Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveCup('UCL')}
              className={`px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                activeCup === 'UCL'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" /> Champions League
            </button>

            <button
              onClick={() => setActiveCup('UEL')}
              className={`px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                activeCup === 'UEL'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 border border-amber-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300" /> Europa League
            </button>

            <button
              onClick={() => setActiveCup('UECL')}
              className={`px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                activeCup === 'UECL'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Zap className="w-4 h-4 text-[#02f59b]" /> Conference League
            </button>

            <button
              onClick={() => setActiveCup('SUPERCOP')}
              className={`px-3.5 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                activeCup === 'SUPERCOP'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-black font-black shadow-lg shadow-amber-500/20 border border-amber-300'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Award className="w-4 h-4" /> Supercopa
            </button>
          </div>
        </div>
      </div>

      {/* 1. UEFA CHAMPIONS LEAGUE HUB */}
      {activeCup === 'UCL' && (
        <div className="space-y-6">
          {/* UCL Banner Header */}
          <div className="fc-card p-6 md:p-8 rounded-2xl border-blue-500/40 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border-2 border-blue-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Star className="w-10 h-10 text-amber-300 fill-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-500 text-white text-[10px] font-tech font-extrabold uppercase rounded tracking-wider">
                      MÁXIMA COMPETICIÓN CONTINENTAL
                    </span>
                    <span className="text-xs text-amber-300 font-mono font-bold">Temporada 2026/27</span>
                  </div>
                  <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase italic tracking-wide mt-1">
                    UEFA CHAMPIONS LEAGUE
                  </h1>
                  <p className="text-xs text-blue-200 font-tech">
                    Las noches mágicas de Europa. Los mejores clubes disputan el trofeo más prestigioso del fútbol mundial.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-blue-500/30 text-xs font-tech">
                <div className="text-center px-3 border-r border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Premio Campeón</span>
                  <span className="font-display font-black text-amber-400 text-base">€120.00M</span>
                </div>
                <div className="text-center px-3">
                  <span className="text-slate-400 block text-[10px] uppercase">Partidos Jugados</span>
                  <span className="font-display font-black text-blue-400 text-base">{cupMatches.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* UCL Sub-Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setUclSubTab('tabla')}
              className={`px-4 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                uclSubTab === 'tabla'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Trophy className="w-4 h-4" /> Fase de Liga (36 Equipos)
            </button>

            <button
              onClick={() => setUclSubTab('cuadro')}
              className={`px-4 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                uclSubTab === 'cuadro'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" /> Cuadro de Eliminatorias
            </button>

            <button
              onClick={() => setUclSubTab('reglamento')}
              className={`px-4 py-2 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-1.5 ${
                uclSubTab === 'reglamento'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Star className="w-4 h-4" /> Reglamento y Clasificación
            </button>
          </div>

          {/* 1.1 FASE DE LIGA (36 EQUIPOS) */}
          {uclSubTab === 'tabla' && (
            <div className="fc-card rounded-2xl overflow-hidden border-slate-200 bg-white shadow-md space-y-4 p-4">
              {/* Legend for 36-Team League Phase */}
              <div className="p-3 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-tech">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span className="font-bold uppercase tracking-wider text-amber-300">Formato Oficial UEFA 2024+ (36 Clubes)</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> P1-8: Octavos de Final
                  </span>
                  <span className="flex items-center gap-1 bg-blue-950/80 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                    <span className="w-2 h-2 rounded-full bg-blue-400" /> P9-24: Playoff Dieciseisavos
                  </span>
                  <span className="flex items-center gap-1 bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> P25-36: Eliminados
                  </span>
                </div>
              </div>

              {/* 36 Teams Single Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-tech text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-3 text-center">Pos</th>
                      <th className="py-2.5 px-3">Club / País</th>
                      <th className="py-2.5 px-2 text-center">PJ</th>
                      <th className="py-2.5 px-2 text-center">PG</th>
                      <th className="py-2.5 px-2 text-center">PE</th>
                      <th className="py-2.5 px-2 text-center">PP</th>
                      <th className="py-2.5 px-2 text-center">GF</th>
                      <th className="py-2.5 px-2 text-center">GC</th>
                      <th className="py-2.5 px-2 text-center">DIF</th>
                      <th className="py-2.5 px-3 text-center">PTS</th>
                      <th className="py-2.5 px-3 text-center">Estado Oficial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-sans">
                    {full36UclTable.map((team, idx) => {
                      const pos = idx + 1;
                      const isOctavos = pos <= 8;
                      const isPlayoff = pos >= 9 && pos <= 24;
                      const isEliminated = pos >= 25;

                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50 transition-colors ${
                            isOctavos ? 'bg-emerald-50/50 border-l-4 border-l-emerald-500' :
                            isPlayoff ? 'bg-blue-50/40 border-l-4 border-l-blue-500' :
                            'bg-rose-50/30 border-l-4 border-l-rose-400 opacity-80'
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center font-display font-black text-xs">
                            <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] ${
                              pos <= 8 ? 'bg-emerald-600 text-white font-bold' :
                              pos <= 24 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {pos}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <img src={team.logoUrl} alt={team.name} className="w-6 h-6 rounded object-cover border border-slate-200 shrink-0" />
                              <span className="truncate">{team.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono font-normal">
                                ({team.country})
                              </span>
                            </div>
                          </td>

                          <td className="py-2.5 px-2 text-center font-mono text-slate-700">{team.pj}</td>
                          <td className="py-2.5 px-2 text-center font-mono font-bold text-emerald-700">{team.pg}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-slate-500">{team.pe}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-rose-600">{team.pp}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-slate-700">{team.gf}</td>
                          <td className="py-2.5 px-2 text-center font-mono text-slate-500">{team.gc}</td>
                          <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-800">
                            {(team.gf - team.gc) > 0 ? `+${team.gf - team.gc}` : team.gf - team.gc}
                          </td>

                          <td className="py-2.5 px-3 text-center font-display font-black text-sm text-blue-700">
                            {team.pts}
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            {isOctavos && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono font-bold rounded text-[10px] inline-flex items-center gap-1">
                                🟢 Octavos
                              </span>
                            )}
                            {isPlayoff && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-mono font-bold rounded text-[10px] inline-flex items-center gap-1">
                                🔵 Playoff
                              </span>
                            )}
                            {isEliminated && (
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-mono font-bold rounded text-[10px] inline-flex items-center gap-1">
                                🔴 Eliminado
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 1.2 CUADRO DE ELIMINATORIAS */}
          {uclSubTab === 'cuadro' && (
            <div className="fc-card p-6 rounded-2xl border-slate-200 bg-white space-y-4 shadow-md">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <h3 className="font-display font-black text-base text-slate-900 uppercase italic flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-600" /> Cuadro de Eliminatorias Directas (Play-offs y Fase Final)
                </h3>
                <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg font-bold">
                  Knockout Stage
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cuartos de Final */}
                <div className="space-y-3">
                  <div className="text-center p-2 bg-blue-900 text-white rounded-lg text-xs font-tech font-extrabold uppercase tracking-wider">
                    Cuartos de Final
                  </div>
                  {[0, 2, 4, 6].map((idx, i) => {
                    const teamA = full36UclTable[idx] || { name: 'Real Madrid', logoUrl: '' };
                    const teamB = full36UclTable[idx + 1] || { name: 'Manchester City', logoUrl: '' };
                    return (
                      <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-tech space-y-1">
                        <div className="flex justify-between items-center font-bold text-slate-800">
                          <span className="truncate">{teamA.name}</span>
                          <span className="font-mono text-blue-700 font-extrabold">{i === 0 ? '2' : i === 1 ? '3' : '1'}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-slate-800">
                          <span className="truncate">{teamB.name}</span>
                          <span className="font-mono text-blue-700 font-extrabold">{i === 0 ? '1' : i === 1 ? '1' : '0'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Semifinales */}
                <div className="space-y-3 md:pt-8">
                  <div className="text-center p-2 bg-indigo-900 text-white rounded-lg text-xs font-tech font-extrabold uppercase tracking-wider">
                    Semifinales
                  </div>
                  {[0, 2].map((idx, i) => {
                    const teamA = full36UclTable[idx] || { name: 'Real Madrid' };
                    const teamB = full36UclTable[idx + 2] || { name: 'FC Bayern' };
                    return (
                      <div key={i} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200 text-xs font-tech space-y-1.5 my-4">
                        <div className="flex justify-between items-center font-bold text-slate-900">
                          <span className="truncate">{teamA.name}</span>
                          <span className="font-mono text-indigo-800 font-extrabold">{i === 0 ? '3' : '2'}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-slate-900">
                          <span className="truncate">{teamB.name}</span>
                          <span className="font-mono text-indigo-800 font-extrabold">{i === 0 ? '2' : '1'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Gran Final */}
                <div className="space-y-3 md:pt-16">
                  <div className="text-center p-2.5 bg-gradient-to-r from-amber-500 to-blue-900 text-white rounded-lg text-xs font-tech font-black uppercase tracking-wider shadow-md">
                    🏆 Gran Final Wembley
                  </div>
                  <div className="p-4 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-xl border-2 border-amber-400 space-y-2 shadow-xl">
                    <div className="flex justify-between items-center font-display font-black text-sm">
                      <span className="truncate">{full36UclTable[0]?.name || 'Real Madrid'}</span>
                      <span className="font-mono text-amber-300">2</span>
                    </div>
                    <div className="flex justify-between items-center font-display font-black text-sm">
                      <span className="truncate">{full36UclTable[2]?.name || 'FC Bayern'}</span>
                      <span className="font-mono text-slate-400">1</span>
                    </div>
                    <div className="pt-2 border-t border-blue-800 text-center text-[10px] text-amber-300 font-mono font-bold uppercase">
                      🥇 Campeón de Europa Confirmado
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1.3 REGLAMENTO Y CLASIFICACIÓN EXPLICADA */}
          {uclSubTab === 'reglamento' && (
            <div className="fc-card p-6 rounded-2xl border-slate-200 bg-white space-y-6 shadow-md">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-base text-slate-900 uppercase italic flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Sistema de Clasificación y Plazas UEFA Champions League
                  </h3>
                  <p className="text-xs text-slate-500 font-tech">Reglamento oficial vigente desde la temporada 2024/25.</p>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-900 font-mono font-bold text-xs rounded-lg">
                  36 Equipos
                </span>
              </div>

              {/* Plazas por País Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase text-slate-800 font-tech">1. Plazas Aproximadas por País (Según Ranking/Coeficiente UEFA)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-tech">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra (Premier League)</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-mono font-bold rounded">4 o 5 equipos</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">🇪🇸 España (LaLiga)</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-mono font-bold rounded">4 o 5 equipos</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">🇮🇹 Italia (Serie A)</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-mono font-bold rounded">4 o 5 equipos</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">🇩🇪 Alemania (Bundesliga)</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-mono font-bold rounded">4 o 5 equipos</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">🇫🇷 Francia (Ligue 1)</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-mono font-bold rounded">3 o 4 equipos</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900">🌍 Ligas Menores (Otras)</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-mono font-bold rounded">1 campeón (fase previa)</span>
                  </div>
                </div>
              </div>

              {/* Plazas Automáticas Adicionales */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs font-tech">
                <h4 className="font-bold text-blue-900 uppercase flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-700" /> Plazas Automáticas de Campeón Continental
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li><strong>Campeón de la Champions League anterior:</strong> Obtiene plaza automática a la Fase de Liga si no clasificó por su liga nacional.</li>
                  <li><strong>Campeón de la UEFA Europa League anterior:</strong> Obtiene plaza automática directa a la Fase de Liga si no clasificó por su liga nacional.</li>
                </ul>
              </div>

              {/* Nuevo Formato 2024 Breakdown */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 font-tech text-xs">
                <h4 className="font-display font-black text-sm uppercase text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-300" /> Formato Actual de la Champions League (Desde 2024)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 space-y-1">
                    <span className="text-amber-400 font-bold block">1. Tabla Única ("League Phase")</span>
                    <p className="text-slate-300 text-[11px]">36 equipos compitiendo en una sola clasificación general en lugar de los antiguos grupos de 4.</p>
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 space-y-1">
                    <span className="text-amber-400 font-bold block">2. 8 Partidos por Equipo</span>
                    <p className="text-slate-300 text-[11px]">Cada club disputa 8 partidos contra rivales distintos (4 de local y 4 de visitante).</p>
                  </div>
                  <div className="p-3 bg-emerald-950/80 rounded-lg border border-emerald-500/40 space-y-1">
                    <span className="text-emerald-300 font-bold block">3. Puestos 1 al 8 → Octavos de Final</span>
                    <p className="text-emerald-100 text-[11px]">Avanzan directamente a la fase de Octavos de Final como cabezas de serie.</p>
                  </div>
                  <div className="p-3 bg-blue-950/80 rounded-lg border border-blue-500/40 space-y-1">
                    <span className="text-blue-300 font-bold block">4. Puestos 9 al 24 → Playoff</span>
                    <p className="text-blue-100 text-[11px]">Juegan una eliminatoria ida y vuelta de dieciseisavos para ganar un cupo a Octavos.</p>
                  </div>
                </div>
                <div className="p-2.5 bg-rose-950/80 border border-rose-500/40 rounded-lg text-[11px] text-rose-200">
                  <strong>Puestos 25 al 36:</strong> Eliminados definitivamente (ya no descienden a la Europa League).
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. UEFA EUROPA LEAGUE HUB */}
      {activeCup === 'UEL' && (
        <div className="space-y-6">
          {/* UEL Banner Header */}
          <div className="fc-card p-6 md:p-8 rounded-2xl border-amber-500/40 bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-600/30 border-2 border-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Flame className="w-10 h-10 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-500 text-black text-[10px] font-tech font-black uppercase rounded tracking-wider">
                      SEGUNDA COMPETICIÓN CONTINENTAL
                    </span>
                    <span className="text-xs text-amber-200 font-mono font-bold">Temporada 2026/27</span>
                  </div>
                  <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase italic tracking-wide mt-1">
                    UEFA EUROPA LEAGUE
                  </h1>
                  <p className="text-xs text-amber-100 font-tech">
                    Pasión, intensidad y gloria en los estadios más calientes del continente europeo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-amber-500/30 text-xs font-tech">
                <div className="text-center px-3 border-r border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Premio Campeón</span>
                  <span className="font-display font-black text-amber-400 text-base">€85.00M</span>
                </div>
                <div className="text-center px-3">
                  <span className="text-slate-400 block text-[10px] uppercase">Partidos Jugados</span>
                  <span className="font-display font-black text-amber-400 text-base">{cupMatches.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* UEL Standings & Knockouts */}
          <div className="fc-card p-6 rounded-2xl border-slate-200 bg-white space-y-4 shadow-md">
            <h3 className="font-display font-black text-base text-slate-900 uppercase italic flex items-center gap-2 border-b border-slate-200 pb-3">
              <Flame className="w-5 h-5 text-amber-600" /> Clasificados a la Fase Final de la Europa League
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uelTeams.slice(0, 6).map((club, i) => (
                <div key={club.id || i} className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-display font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <img src={club.logoUrl} alt={club.name} className="w-8 h-8 rounded border border-slate-200 shrink-0 object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{club.name}</h4>
                      <span className="text-[10px] text-slate-500 font-tech">Manager: @{club.manager}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-mono font-bold rounded">
                    Clasificado UEL
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. UEFA CONFERENCE LEAGUE HUB */}
      {activeCup === 'UECL' && (
        <div className="space-y-6">
          {/* UECL Banner Header */}
          <div className="fc-card p-6 md:p-8 rounded-2xl border-emerald-500/40 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600/30 border-2 border-[#02f59b] flex items-center justify-center shrink-0 shadow-inner">
                  <Zap className="w-10 h-10 text-[#02f59b] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#00ba68] text-white text-[10px] font-tech font-extrabold uppercase rounded tracking-wider">
                      TERCERA COMPETICIÓN CONTINENTAL
                    </span>
                    <span className="text-xs text-emerald-200 font-mono font-bold">Temporada 2026/27</span>
                  </div>
                  <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase italic tracking-wide mt-1">
                    UEFA CONFERENCE LEAGUE
                  </h1>
                  <p className="text-xs text-emerald-100 font-tech">
                    Oportunidad de oro para los clubes emergentes que buscan escribir historia en Europa.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30 text-xs font-tech">
                <div className="text-center px-3 border-r border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Premio Campeón</span>
                  <span className="font-display font-black text-[#02f59b] text-base">€60.00M</span>
                </div>
                <div className="text-center px-3">
                  <span className="text-slate-400 block text-[10px] uppercase">Partidos Jugados</span>
                  <span className="font-display font-black text-emerald-400 text-base">{cupMatches.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="fc-card p-6 rounded-2xl border-slate-200 bg-white space-y-4 shadow-md">
            <h3 className="font-display font-black text-base text-slate-900 uppercase italic flex items-center gap-2 border-b border-slate-200 pb-3">
              <Zap className="w-5 h-5 text-emerald-600" /> Clasificados a la UEFA Conference League
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ueclTeams.slice(0, 6).map((club, i) => (
                <div key={club.id || i} className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#00ba68] text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <img src={club.logoUrl} alt={club.name} className="w-8 h-8 rounded border border-slate-200 shrink-0 object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{club.name}</h4>
                      <span className="text-[10px] text-slate-500 font-tech">Manager: @{club.manager}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold rounded">
                    Clasificado UECL
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SUPERCOPA DE EUROPA HUB */}
      {activeCup === 'SUPERCOP' && (
        <div className="space-y-6">
          {/* Super Cup Banner */}
          <div className="fc-card p-6 md:p-8 rounded-2xl border-amber-400/60 bg-gradient-to-r from-slate-950 via-cyan-950 to-amber-950 text-white shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/30 border-2 border-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Award className="w-10 h-10 text-amber-300 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-tech font-black uppercase rounded tracking-wider">
                      GRAN SUPERCOPA DE EUROPA
                    </span>
                    <span className="text-xs text-cyan-300 font-mono font-bold">UEFA Super Cup</span>
                  </div>
                  <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase italic tracking-wide mt-1">
                    SUPERCOPA DE EUROPA 2026/27
                  </h1>
                  <p className="text-xs text-cyan-100 font-tech">
                    Duelo estelar a partido único entre el Campeón de la Champions League y el Campeón de la Europa League.
                  </p>
                </div>
              </div>

              <div className="bg-amber-400 text-slate-950 p-4 rounded-xl font-display font-black text-center shadow-xl shrink-0">
                <span className="text-[10px] block uppercase font-tech">Trofeo Absoluto</span>
                <span className="text-lg uppercase italic">SUPER CAMPEÓN</span>
              </div>
            </div>
          </div>

          {/* Supercup Fixture Display */}
          <div className="fc-card p-8 rounded-2xl border-amber-300 bg-white text-center space-y-6 shadow-lg">
            <div className="inline-block px-4 py-1 bg-slate-900 text-amber-400 rounded-full text-xs font-tech font-extrabold uppercase">
              ⚽ Gran Final Oficial de la Supercopa
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center max-w-2xl mx-auto">
              {/* Campeon UCL */}
              <div className="md:col-span-2 space-y-2">
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                  Campeón Champions League
                </span>
                <div className="w-20 h-20 mx-auto rounded-2xl p-1 border-2 border-blue-500 shadow-md">
                  <img src={clubs[0]?.logoUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80'} alt="UCL Champion" className="w-full h-full object-cover rounded-xl" />
                </div>
                <h4 className="font-display font-black text-base text-slate-900 uppercase">
                  {clubs[0]?.name || 'Real Madrid'}
                </h4>
              </div>

              {/* VS & Result */}
              <div className="space-y-1">
                <div className="text-3xl font-display font-black text-amber-600 italic">VS</div>
                <span className="text-[10px] text-slate-400 font-mono block">Partido Único</span>
              </div>

              {/* Campeon UEL */}
              <div className="md:col-span-2 space-y-2">
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  Campeón Europa League
                </span>
                <div className="w-20 h-20 mx-auto rounded-2xl p-1 border-2 border-amber-500 shadow-md">
                  <img src={clubs[1]?.logoUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80'} alt="UEL Champion" className="w-full h-full object-cover rounded-xl" />
                </div>
                <h4 className="font-display font-black text-base text-slate-900 uppercase">
                  {clubs[1]?.name || 'Atalanta BC'}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MATCHES LIST FOR CURRENT CUP */}
      <div className="fc-card p-6 rounded-2xl border-slate-200 space-y-4 shadow-md bg-white">
        <h3 className="font-display font-black text-base text-slate-900 uppercase italic flex items-center justify-between border-b border-slate-200 pb-3">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#00ba68]" /> Actas Registradas en {currentCupName}
          </span>
          <span className="text-xs font-mono text-slate-500">
            {cupMatches.length} Partidos
          </span>
        </h3>

        {cupMatches.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-tech text-xs space-y-2">
            <p>No hay actas registradas todavía para {currentCupName}.</p>
            <p className="text-[11px] text-slate-400">
              Puedes reportar partidos de esta copa desde la pestaña <strong>"Reportar Resultados"</strong> seleccionando la competición.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {cupMatches.map(match => {
              const home = clubs.find(c => c.id === match.homeClubId);
              const away = clubs.find(c => c.id === match.awayClubId);

              return (
                <div key={match.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-900 font-mono font-bold rounded text-[10px]">
                      {match.competition || currentCupName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{match.createdAt}</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 flex-1">
                    <span className="font-bold text-slate-900 truncate">{home?.name || 'Local'}</span>
                    <span className="px-2.5 py-0.5 bg-slate-900 text-emerald-400 font-display font-black rounded border border-emerald-500/40">
                      {match.homeGoals} - {match.awayGoals}
                    </span>
                    <span className="font-bold text-slate-900 truncate">{away?.name || 'Visitante'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
