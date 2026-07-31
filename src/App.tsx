/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ForumModule } from './components/ForumModule';
import { InscripcionesModule } from './components/InscripcionesModule';
import { SquadBuilder } from './components/SquadBuilder';
import { CompetitionsHub } from './components/competitions/CompetitionsHub';
import { TransferMarket } from './components/TransferMarket';
import { RegistrationModal } from './components/RegistrationModal';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SofifaPlayersExplorer } from './components/SofifaPlayersExplorer';
import { DraftLotteryModule } from './components/DraftLotteryModule';
import { CompetitionSectionView } from './components/CompetitionSectionView';
import { MonetizationModule } from './components/MonetizationModule';
import { generateAllCompetitionsFixtures, generateFixtureForClubs } from './utils/fixtureGenerator';
import { generatePendingKnockoutMatches } from './utils/bracketGenerator';
import { useSupabaseTable } from './hooks/useSupabaseTable';
import { useAuth } from './contexts/AuthContext';
import { GET_OFFICIAL_SQUAD_BY_CLUB_NAME } from './data/officialCurrentSquads';



import {
  Club,
  Player,
  ForumTopic,
  ForumSectionTag,
  CompetitionSection,
  BudgetPackage,
  MatchResult,
  TransferItem,
  FinancialTransaction,
  ForumReply,
  TickerNewsItem,
  LeagueSettings
} from './types';

import {
  INITIAL_CLUBS,
  INITIAL_PLAYERS,
  INITIAL_TOPICS,
  INITIAL_MATCHES,
  INITIAL_TRANSFERS,
  INITIAL_TRANSACTIONS,
  INITIAL_TICKER_NEWS,
  INITIAL_COMPETITION_SECTIONS,
  INITIAL_BUDGET_PACKAGES,
  FC27_ADMIN_AVATAR
} from './data/initialData';
import { SOFIFA_PLAYERS, SOFIFA_CLUBS, SoFifaPlayerPreset } from './data/sofifaData';

import { Trophy, MessageSquare, Shield, DollarSign, PlusCircle, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('foro');
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // Admin Auth State: viene del rol real en la tabla `managers`, no de localStorage.
  const { profile } = useAuth();
  const isAdminLoggedIn = profile?.role === 'admin';
  const isFounder = profile?.is_owner === true;




  // Helper to ensure 1ra Division always has 36 clubs
  const ensure36FirstDivClubs = (loadedClubs: Club[]): Club[] => {
    const firstDivClubs = loadedClubs.filter(
      c => !c.division || c.division === '1ra División' || c.division === 'Primera División'
    );
    const otherDivClubs = loadedClubs.filter(
      c => c.division && c.division !== '1ra División' && c.division !== 'Primera División'
    );

    if (firstDivClubs.length >= 36) {
      return loadedClubs;
    }

    const paddedFirstDiv = [...firstDivClubs];
    const missingCount = 36 - firstDivClubs.length;

    for (let i = 1; i <= missingCount; i++) {
      // Un slot puede seguir teniendo el id `club-1ra-slot-N` aunque ya se le
      // haya asignado un club real (draft o edicion admin), que cambia el
      // nombre a algo que ya no matchea "Equipo N". Sin chequear tambien el
      // id, este slot se contaba como libre y se regeneraba un duplicado con
      // el mismo id, mostrando "Equipo N" vacante de nuevo pese a la asignacion.
      const existingNumSet = new Set(
        paddedFirstDiv
          .flatMap(c => {
            const nameMatch = c.name.match(/^Equipo\s+(\d+)$/i);
            const idMatch = c.id.match(/^club-1ra-slot-(\d+)$/);
            return [
              nameMatch ? parseInt(nameMatch[1], 10) : null,
              idMatch ? parseInt(idMatch[1], 10) : null
            ];
          })
          .filter((n): n is number => n !== null)
      );

      let nextNum = 1;
      while (existingNumSet.has(nextNum)) {
        nextNum++;
      }

      paddedFirstDiv.push({
        id: `club-1ra-slot-${nextNum}`,
        name: `Equipo ${nextNum}`,
        shortName: `EQ${nextNum}`,
        manager: 'Por Inscribir (Vacante)',
        gamertag: 'Pendiente',
        platform: 'PS5',
        stadium: `Estadio Equipo ${nextNum}`,
        logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
        division: '1ra División',
        budget: 100000000,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        form: []
      });
    }

    return [...paddedFirstDiv, ...otherDivClubs];
  };

  // Helper to recalculate standings for all clubs based on confirmed matches.
  // Puramente derivado a partir de `matches` (la fuente de verdad) — nunca se
  // persiste de vuelta en `clubs`, porque un manager solo tiene permiso RLS
  // para actualizar su propio club, no la fila de sus rivales.
  const recalculateStandings = (clubsList: Club[], matchesList: MatchResult[]): Club[] => {
    const confirmedMatches = matchesList.filter(m => m.status === 'CONFIRMADO');

    return clubsList.map(club => {
      const clubMatches = confirmedMatches.filter(
        m => m.homeClubId === club.id || m.awayClubId === club.id
      );

      let played = 0;
      let won = 0;
      let drawn = 0;
      let lost = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;
      let points = 0;
      const form: ('W' | 'D' | 'L')[] = [];

      // Reverse so newest matches come first for form calculation
      const sortedMatches = [...clubMatches].reverse();

      sortedMatches.forEach(m => {
        played += 1;
        const isHome = m.homeClubId === club.id;
        const myGoals = isHome ? m.homeGoals : m.awayGoals;
        const oppGoals = isHome ? m.awayGoals : m.homeGoals;

        goalsFor += myGoals;
        goalsAgainst += oppGoals;

        if (myGoals > oppGoals) {
          won += 1;
          points += 3;
          if (form.length < 5) form.push('W');
        } else if (myGoals === oppGoals) {
          drawn += 1;
          points += 1;
          if (form.length < 5) form.push('D');
        } else {
          lost += 1;
          if (form.length < 5) form.push('L');
        }
      });

      return {
        ...club,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        points,
        form
      };
    });
  };

  // Estado sincronizado con Supabase (Postgres + Realtime) en vez de localStorage.
  const [rawClubs, setClubs, clubsLoaded, clubsWriteError, clearClubsWriteError] = useSupabaseTable<Club>(
    'clubs',
    INITIAL_CLUBS,
    (c) => c.id
  );

  const sofifaClubsByName = new Map(SOFIFA_CLUBS.map(c => [c.name.toLowerCase(), c.logoUrl]));
  const initialClubsByName = new Map(INITIAL_CLUBS.map(c => [c.name.toLowerCase(), c.logoUrl]));
  const initialClubsById = new Map(INITIAL_CLUBS.map(c => [c.id, c.logoUrl]));

  const rawClubsWithLogos = rawClubs.map(club => {
    if (club.logoUrl && club.logoUrl.trim() !== '') return club;
    const logoUrl =
      sofifaClubsByName.get(club.name.toLowerCase()) ||
      initialClubsById.get(club.id) ||
      initialClubsByName.get(club.name.toLowerCase()) ||
      '';
    return { ...club, logoUrl };
  });

  const [matches, setMatches, , matchesWriteError, clearMatchesWriteError] = useSupabaseTable<MatchResult>(
    'matches',
    INITIAL_MATCHES,
    (m) => m.id
  );

  const dataWriteError = matchesWriteError ?? clubsWriteError;
  const clearDataWriteError = () => {
    clearMatchesWriteError();
    clearClubsWriteError();
  };

  const clubs = recalculateStandings(ensure36FirstDivClubs(rawClubsWithLogos), matches);

  // El club "activo" es el vinculado a la cuenta autenticada, no uno elegido libremente.
  const currentClubId = profile?.club_id ?? clubs[0]?.id ?? '';

  const [players, setPlayers] = useSupabaseTable<Player>(
    'players',
    INITIAL_PLAYERS,
    (p) => p.id
  );

  const [topics, setTopics] = useSupabaseTable<ForumTopic>(
    'forum_topics',
    INITIAL_TOPICS,
    (t) => t.id
  );

  const [rawCompetitionSections, setRawCompetitionSections] = useSupabaseTable<CompetitionSection>(
    'competition_sections',
    INITIAL_COMPETITION_SECTIONS,
    (s) => s.tag
  );

  // Garantizar que cada sección tenga su contenido inicial por defecto si está vacía
  const competitionSections = INITIAL_COMPETITION_SECTIONS.map(initSec => {
    const match = rawCompetitionSections.find(p => p.tag === initSec.tag);
    if (!match || !match.content.trim()) {
      return initSec;
    }
    return match;
  });

  const [activeSectionTag, setActiveSectionTag] = useState<ForumSectionTag | null>(null);

  const handleOpenForumSection = (sectionTag: ForumSectionTag) => {
    setActiveSectionTag(sectionTag);
    setActiveTab('competicion-seccion');
  };

  const handleSaveCompetitionSection = (tag: ForumSectionTag, title: string, content: string) => {
    setRawCompetitionSections(prev => {
      const base = prev.some(s => s.tag === tag) ? prev : [...prev, ...INITIAL_COMPETITION_SECTIONS.filter(s => s.tag === tag)];
      return base.map(s => s.tag === tag
        ? { ...s, title, content, updatedAt: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }) }
        : s
      );
    });
  };

  const [selectedCompetition, setSelectedCompetition] = useState<string>('1ra División');

  const [budgetPackages, setBudgetPackages] = useSupabaseTable<BudgetPackage>(
    'budget_packages',
    INITIAL_BUDGET_PACKAGES,
    (p) => p.id
  );

  const handleAddBudgetPackage = (pkg: BudgetPackage) => {
    setBudgetPackages(prev => [...prev, pkg]);
  };

  const handleEditBudgetPackage = (id: string, budgetMillions: number, priceUsd: number) => {
    setBudgetPackages(prev => prev.map(p => p.id === id ? { ...p, budgetMillions, priceUsd } : p));
  };

  const handleDeleteBudgetPackage = (id: string) => {
    setBudgetPackages(prev => prev.filter(p => p.id !== id));
  };

  const [tiendaExplanation, setTiendaExplanation] = useState<string>(() => {
    return localStorage.getItem('fc27_tienda_explanation') || '';
  });

  useEffect(() => {
    localStorage.setItem('fc27_tienda_explanation', tiendaExplanation);
  }, [tiendaExplanation]);

  const [transfers, setTransfers] = useSupabaseTable<TransferItem>(
    'transfers',
    INITIAL_TRANSFERS,
    (t) => t.id
  );

  const [transactions, setTransactions] = useSupabaseTable<FinancialTransaction>(
    'transactions',
    INITIAL_TRANSACTIONS,
    (t) => t.id
  );

  const [tickerNews, setTickerNews] = useSupabaseTable<TickerNewsItem>(
    'ticker_news',
    INITIAL_TICKER_NEWS,
    (n) => n.id
  );

  // Temporada 1 es gratis para todos; desde la Temporada 2 se cobra
  // suscripcion (ver MonetizationModule/AdminPanel). El numero de temporada
  // vive en la tabla `seasons` (unica fila, key 'current') para que sea el
  // mismo para todos los usuarios, no local a cada navegador.
  const [leagueSettings, setLeagueSettings] = useSupabaseTable<LeagueSettings>(
    'seasons',
    [{ id: 'current', currentSeasonNumber: 1 }],
    (s) => s.id
  );
  const currentSeasonNumber = leagueSettings.find(s => s.id === 'current')?.currentSeasonNumber ?? 1;
  const setCurrentSeasonNumber = (n: number) => setLeagueSettings([{ id: 'current', currentSeasonNumber: n }]);

  const subscriptionRequiredThisSeason = currentSeasonNumber >= 2;
  const hasActiveSubscription = profile?.subscription_status === 'active';
  const canUseGatedFeature = isAdminLoggedIn || !subscriptionRequiredThisSeason || hasActiveSubscription;
  const SUBSCRIPTION_REQUIRED_MESSAGE =
    'A partir de la Temporada 2, esta función requiere una suscripción activa (USD 8/mes). ' +
    'Contactá al administrador de la liga para activarla.';

  const currentClub = clubs.find(c => c.id === currentClubId) || clubs[0] || null;

  // Admin Handlers
  const { signOut } = useAuth();

  const handleAdminLoginSuccess = () => {
    setIsAdminModalOpen(false);
    // No se fuerza la navegacion a 'admin': el rol se refleja solo via
    // profile (async), y este mismo modal ahora tambien lo usan managers
    // comunes para iniciar sesion en una cuenta ya existente.
  };

  const handleLogoutAdmin = () => {
    signOut();
    if (activeTab === 'admin') {
      setActiveTab('foro');
    }
  };

  // Ticker News Handlers
  const handleAddTickerNews = (text: string) => {
    const newItem: TickerNewsItem = {
      id: `news-${Date.now()}`,
      text,
      active: true,
      createdAt: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
    };
    setTickerNews(prev => [newItem, ...prev]);
  };

  const handleToggleTickerNews = (id: string) => {
    setTickerNews(prev => prev.map(item => item.id === id ? { ...item, active: !item.active } : item));
  };

  const handleDeleteTickerNews = (id: string) => {
    setTickerNews(prev => prev.filter(item => item.id !== id));
  };

  const handleEditTickerNews = (id: string, text: string) => {
    setTickerNews(prev => prev.map(item => item.id === id ? { ...item, text } : item));
  };

  const handleDeleteTransfer = (transferId: string) => {
    setTransfers(prev => prev.filter(t => t.id !== transferId));
  };

  const handleEditTopic = (topicId: string, title: string, content: string) => {
    setTopics(prev => prev.map(t => t.id === topicId ? { ...t, title, content } : t));
  };

  const handleUpdateClub = (updatedClub: Club) => {
    // Igual que en el draft: si updatedClub es un slot virtual todavia no
    // persistido en Supabase, .map() no lo encuentra en prev y el update no
    // hace nada. Se agrega si falta.
    setClubs(prev => prev.some(c => c.id === updatedClub.id)
      ? prev.map(c => c.id === updatedClub.id ? updatedClub : c)
      : [...prev, updatedClub]
    );
  };

  const handleDeleteClub = (clubId: string) => {
    setClubs(prev => {
      const target = prev.find(c => c.id === clubId);
      if (!target) return prev;

      const isFirstDiv = !target.division || target.division === '1ra División' || target.division === 'Primera División';
      
      if (isFirstDiv) {
        // Reset slot to vacant placeholder instead of deleting to keep 36 teams
        return prev.map(c => {
          if (c.id === clubId) {
            // Determine team number if possible
            const match = c.name.match(/^Equipo\s+(\d+)$/i);
            const teamName = match ? c.name : `Equipo ${prev.indexOf(c) + 1}`;
            return {
              ...c,
              name: teamName,
              shortName: `EQ${prev.indexOf(c) + 1}`,
              manager: 'Por Inscribir (Vacante)',
              gamertag: 'Pendiente',
              platform: 'PS5',
              stadium: `Estadio ${teamName}`,
              logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
              budget: 100000000,
              played: 0,
              won: 0,
              drawn: 0,
              lost: 0,
              goalsFor: 0,
              goalsAgainst: 0,
              points: 0,
              form: []
            };
          }
          return c;
        });
      }

      return prev.filter(c => c.id !== clubId);
    });
  };

  const handleUpdateMatchResult = (
    matchId: string,
    status: 'CONFIRMADO' | 'RECHAZADO' | 'PENDIENTE',
    homeGoals?: number,
    awayGoals?: number,
    homeScorers?: string,
    awayScorers?: string
  ) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          status,
          homeGoals: homeGoals !== undefined ? homeGoals : m.homeGoals,
          awayGoals: awayGoals !== undefined ? awayGoals : m.awayGoals,
          homeScorers: homeScorers !== undefined ? homeScorers : m.homeScorers,
          awayScorers: awayScorers !== undefined ? awayScorers : m.awayScorers
        };
      }
      return m;
    }));
  };

  const handleDeleteMatchResult = (matchId: string) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const handleDeleteTopic = (topicId: string) => {
    setTopics(prev => prev.filter(t => t.id !== topicId));
  };

  const handleEditReply = (topicId: string, replyId: string, content: string) => {
    setTopics(prev => prev.map(t => t.id === topicId
      ? { ...t, replies: t.replies.map(r => r.id === replyId ? { ...r, content } : r) }
      : t
    ));
  };

  const handleDeleteReply = (topicId: string, replyId: string) => {
    setTopics(prev => prev.map(t => t.id === topicId
      ? { ...t, replies: t.replies.filter(r => r.id !== replyId) }
      : t
    ));
  };

  const handleTogglePinTopic = (topicId: string) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, isPinned: !t.isPinned };
      }
      return t;
    }));
  };

  const handleCreateOfficialAnnouncement = (title: string, content: string) => {
    const newTopic: ForumTopic = {
      id: `topic-announcement-${Date.now()}`,
      title: `🚨 [COMUNICADO OFICIAL] ${title}`,
      category: 'Anuncios',
      authorName: 'Admin_FIFAMANIAKOS',
      authorClub: 'Comisario de Liga',
      authorAvatar: FC27_ADMIN_AVATAR,
      content,
      createdAt: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
      views: 1,
      likes: 5,
      isPinned: true,
      replies: [],
      isFounderAuthor: isFounder
    };
    setTopics(prev => [newTopic, ...prev]);
  };

  // Handler: Register new club
  const handleRegisterClub = (newClub: Club) => {
    const isFirstDiv = !newClub.division || newClub.division === '1ra División' || newClub.division === 'Primera División';

    let registeredId = newClub.id;

    setClubs(prev => {
      if (isFirstDiv) {
        const vacantIndex = prev.findIndex(
          c => (!c.division || c.division === '1ra División' || c.division === 'Primera División') &&
               (c.manager.toLowerCase().includes('vacante') || c.manager.toLowerCase().includes('por inscribir'))
        );

        if (vacantIndex !== -1) {
          const updated = [...prev];
          const placeholder = updated[vacantIndex];
          registeredId = placeholder.id;
          updated[vacantIndex] = {
            ...placeholder,
            ...newClub,
            id: placeholder.id
          };
          return updated;
        }
      }
      return [newClub, ...prev];
    });

    return registeredId;
  };

  // Handler: Create forum topic
  const handleCreateTopic = (newTopic: ForumTopic) => {
    setTopics(prev => [newTopic, ...prev]);
  };

  // Handler: Add reply to forum topic
  const handleAddReply = (topicId: string, reply: ForumReply) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return {
          ...t,
          replies: [...t.replies, reply]
        };
      }
      return t;
    }));
  };

  // Handler: Like topic
  const handleLikeTopic = (topicId: string) => {
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, likes: t.likes + 1 };
      }
      return t;
    }));
  };

  const handleGenerateFixtures = (competitionName?: string) => {
    let newMatches: MatchResult[] = [];
    if (competitionName && competitionName !== 'TODAS') {
      const compClubs = clubs.filter(c => 
        competitionName === '2da División'
          ? (c.division === '2da División' || c.division === 'Segunda División')
          : (!c.division || c.division === '1ra División' || c.division === 'Primera División')
      );
      const generated = generateFixtureForClubs(compClubs.length >= 2 ? compClubs : clubs, competitionName);
      newMatches = [...matches.filter(m => m.competition !== competitionName), ...generated];
    } else {
      newMatches = generateAllCompetitionsFixtures(clubs);
    }
    setMatches(newMatches);
  };

  // Generar partidos de eliminatorias es una operacion de nivel admin (crea
  // partidos entre clubes que no son necesariamente el propio) — si corriera
  // para cualquier manager logueado, la escritura chocaria con RLS.
  useEffect(() => {
    if (!isAdminLoggedIn) return;
    setMatches(prev => {
      const newBracketMatches = generatePendingKnockoutMatches(clubs, prev).filter(
        nm => !prev.some(m => m.id === nm.id)
      );
      if (newBracketMatches.length === 0) return prev;
      return [...newBracketMatches, ...prev];
    });
  }, [matches, clubs, isAdminLoggedIn]);

  // Handler: Post Match Result (updates standings & rewards money)
  const handleAddMatchResult = (newMatch: MatchResult) => {
    // Los partidos del fixture ya existen como filas PENDIENTE: cargar un acta
    // es reemplazar esa fila, no agregar una nueva. Prependerla generaba claves
    // duplicadas en React y un upsert redundante.
    setMatches(prev => prev.some(m => m.id === newMatch.id)
      ? prev.map(m => m.id === newMatch.id ? newMatch : m)
      : [newMatch, ...prev]
    );

    // Record Prize Transaction & award budget if win and confirmed
    if (newMatch.status === 'CONFIRMADO') {
      if (newMatch.homeGoals > newMatch.awayGoals) {
        setClubs(prev => prev.map(c => c.id === newMatch.homeClubId ? { ...c, budget: c.budget + 3000000 } : c));
        setTransactions(prev => [
          {
            id: `tx-${Date.now()}`,
            clubId: newMatch.homeClubId,
            type: 'INGRESO',
            concept: `Premio Victoria Jornada ${newMatch.matchday}`,
            amount: 3000000,
            date: new Date().toLocaleDateString('es-ES')
          },
          ...prev
        ]);
      } else if (newMatch.awayGoals > newMatch.homeGoals) {
        setClubs(prev => prev.map(c => c.id === newMatch.awayClubId ? { ...c, budget: c.budget + 3000000 } : c));
        setTransactions(prev => [
          {
            id: `tx-${Date.now()}`,
            clubId: newMatch.awayClubId,
            type: 'INGRESO',
            concept: `Premio Victoria Jornada ${newMatch.matchday}`,
            amount: 3000000,
            date: new Date().toLocaleDateString('es-ES')
          },
          ...prev
        ]);
      }
    }
  };

  // Handler: Add player to squad
  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers(prev => [newPlayer, ...prev]);
  };

  // Handler: Remove player from squad
  const handleRemovePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  // Handler: Toggle starter status
  const handleToggleStarter = (playerId: string) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, isStarter: !p.isStarter };
      }
      return p;
    }));
  };

  // Handler: Buy player on Transfer Market
  const handleBuyPlayer = (transfer: TransferItem, buyerClub: Club) => {
    if (!canUseGatedFeature) {
      alert(SUBSCRIPTION_REQUIRED_MESSAGE);
      return;
    }
    // 1. Mark transfer as VENDIDO
    setTransfers(prev => prev.map(t => {
      if (t.id === transfer.id) {
        return { ...t, status: 'VENDIDO', buyerClubId: buyerClub.id };
      }
      return t;
    }));

    // 2. Transfer player to new club
    setPlayers(prev => prev.map(p => {
      if (p.id === transfer.player.id) {
        return { ...p, clubId: buyerClub.id, isStarter: false };
      }
      return p;
    }));

    // 3. Update budgets of both clubs
    setClubs(prev => prev.map(c => {
      if (c.id === buyerClub.id) {
        return { ...c, budget: c.budget - transfer.askingPrice };
      }
      if (c.id === transfer.sellerClubId) {
        return { ...c, budget: c.budget + transfer.askingPrice };
      }
      return c;
    }));

    // 4. Log transactions for both
    setTransactions(prev => [
      {
        id: `tx-${Date.now()}-1`,
        clubId: buyerClub.id,
        type: 'GASTO',
        concept: `Fichaje de ${transfer.player.name}`,
        amount: transfer.askingPrice,
        date: new Date().toLocaleDateString('es-ES')
      },
      {
        id: `tx-${Date.now()}-2`,
        clubId: transfer.sellerClubId,
        type: 'INGRESO',
        concept: `Venta de ${transfer.player.name}`,
        amount: transfer.askingPrice,
        date: new Date().toLocaleDateString('es-ES')
      },
      ...prev
    ]);
  };

  // Handler: List player for sale
  const handleListPlayerForSale = (player: Player, price: number) => {
    const newItem: TransferItem = {
      id: `tf-${Date.now()}`,
      playerId: player.id,
      player,
      sellerClubId: player.clubId,
      askingPrice: price,
      status: 'DISPONIBLE',
      createdAt: new Date().toLocaleDateString('es-ES')
    };

    setTransfers(prev => [newItem, ...prev]);
  };

  // Handler: Direct Transfer player between teams
  const handleDirectTransferPlayer = (player: Player, buyerClub: Club, sellerClub: Club, price: number) => {
    // 1. Transfer player to buyer club
    setPlayers(prev => prev.map(p => {
      if (p.id === player.id) {
        return { ...p, clubId: buyerClub.id, isStarter: false };
      }
      return p;
    }));

    // 2. Update budgets of both clubs
    setClubs(prev => prev.map(c => {
      if (c.id === buyerClub.id) {
        return { ...c, budget: c.budget - price };
      }
      if (c.id === sellerClub.id) {
        return { ...c, budget: c.budget + price };
      }
      return c;
    }));

    // 3. Log financial transactions
    setTransactions(prev => [
      {
        id: `tx-${Date.now()}-1`,
        clubId: buyerClub.id,
        type: 'GASTO',
        concept: `Fichaje directo de ${player.name} (${sellerClub.name})`,
        amount: price,
        date: new Date().toLocaleDateString('es-ES')
      },
      {
        id: `tx-${Date.now()}-2`,
        clubId: sellerClub.id,
        type: 'INGRESO',
        concept: `Venta directa de ${player.name} a ${buyerClub.name}`,
        amount: price,
        date: new Date().toLocaleDateString('es-ES')
      },
      ...prev
    ]);
  };

  // Handler: Cancel/Withdraw player from transfer market
  const handleCancelTransfer = (transferId: string) => {
    setTransfers(prev => prev.filter(t => t.id !== transferId));
  };

  // Handler: Update/Modify asking price or release clause of a transfer listing
  const handleUpdateTransferClause = (transferId: string, newAskingPrice: number) => {
    setTransfers(prev => prev.map(t => {
      if (t.id === transferId) {
        return { ...t, askingPrice: newAskingPrice };
      }
      return t;
    }));
  };

  // Handler: Update player's base release clause / value
  const handleUpdatePlayerClause = (playerId: string, newClause: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, releaseClause: newClause };
      }
      return p;
    }));
    // Also update active transfer list if exists
    setTransfers(prev => prev.map(t => {
      if (t.playerId === playerId) {
        return { ...t, askingPrice: newClause };
      }
      return t;
    }));
  };

  // Handler: Sign player from Free Agent Database
  const handleSignSofifaPlayer = (playerPreset: SoFifaPlayerPreset, buyerClub: Club, price: number) => {
    if (!canUseGatedFeature) {
      alert(SUBSCRIPTION_REQUIRED_MESSAGE);
      return;
    }
    const newPlayer: Player = {
      id: `pl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      clubId: buyerClub.id,
      name: playerPreset.name,
      position: playerPreset.position,
      rating: playerPreset.rating,
      cardType: playerPreset.cardType || 'Gold',
      value: price,
      releaseClause: 0,
      photoUrl: playerPreset.photoUrl,
      stats: playerPreset.stats,
      isStarter: false
    };

    // 1. Add player to players list
    setPlayers(prev => [newPlayer, ...prev]);

    // 2. Deduct budget from buyer club
    setClubs(prev => prev.map(c => {
      if (c.id === buyerClub.id) {
        return { ...c, budget: c.budget - price };
      }
      return c;
    }));

    // 3. Log financial transaction
    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        clubId: buyerClub.id,
        type: 'GASTO',
        concept: `Fichaje: ${playerPreset.name}`,
        amount: price,
        date: new Date().toLocaleDateString('es-ES')
      },
      ...prev
    ]);
  };

  // Handler: Populate an empty or reset club with official squad players
  const handlePopulateClubWithSofifa = (targetClub: Club) => {
    const officialSquad = GET_OFFICIAL_SQUAD_BY_CLUB_NAME(targetClub.name);
    let createdPlayers: Player[] = [];

    if (officialSquad && officialSquad.length > 0) {
      createdPlayers = officialSquad.map((sp, idx) => {
        const normName = sp.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        const matchedSofifa = SOFIFA_PLAYERS.find(p => p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() === normName);

        return {
          id: `pl-${targetClub.id}-${idx}-${Date.now()}`,
          clubId: targetClub.id,
          name: sp.name,
          position: (sp.position as any) || 'DC',
          rating: sp.rating || 80,
          cardType: (sp.rating >= 85 ? 'Gold' : sp.rating >= 75 ? 'Gold' : 'Silver') as any,
          value: matchedSofifa?.value || sp.rating * 500000,
          releaseClause: 0,
          photoUrl: matchedSofifa?.photoUrl || `https://cdn.sofifa.net/players/${sp.id.replace('eafc-p-', '')}/25_120.png`,
          stats: matchedSofifa?.stats || {
            pace: Math.min(99, sp.rating),
            shooting: Math.min(99, sp.rating - 2),
            passing: Math.min(99, sp.rating - 3),
            dribbling: Math.min(99, sp.rating - 1),
            defending: Math.min(99, sp.rating - 5),
            physical: Math.min(99, sp.rating - 4)
          },
          isStarter: idx < 11
        };
      });
    } else {
      const cleanTarget = targetClub.name.toLowerCase().replace(/\b(sk|fc|cf|rc|sad|sc|cd|ca|real|de|el|la|los|las)\b/gi, '').trim();
      let matched = SOFIFA_PLAYERS.filter(sp => {
        if (!sp.clubName) return false;
        const cleanSp = sp.clubName.toLowerCase().replace(/\b(sk|fc|cf|rc|sad|sc|cd|ca|real|de|el|la|los|las)\b/gi, '').trim();
        return cleanSp.includes(cleanTarget) || cleanTarget.includes(cleanSp);
      });

      if (matched.length === 0) {
        matched = SOFIFA_PLAYERS.slice(0, 11);
      }

      createdPlayers = matched.map((sp, idx) => ({
        id: `pl-${targetClub.id}-${idx}-${Date.now()}`,
        clubId: targetClub.id,
        name: sp.name,
        position: sp.position,
        rating: sp.rating,
        cardType: sp.cardType || 'Gold',
        value: sp.value,
        releaseClause: 0,
        photoUrl: sp.photoUrl,
        stats: sp.stats,
        isStarter: idx < 11
      }));
    }

    setPlayers(prev => [...prev.filter(p => p.clubId !== targetClub.id), ...createdPlayers]);
  };

  // Reset to default data handler
  const handleResetDemoData = () => {
    if (confirm('¿Vaciar todos los datos de la Liga FIFAMANIAKOS para empezar desde 0?')) {
      localStorage.clear();
      signOut();
      setClubs([]);
      setPlayers([]);
      setTopics([]);
      setMatches([]);
      setTransfers([]);
      setTransactions([]);
      setTickerNews([
        {
          id: `news-${Date.now()}`,
          text: '🔥 ¡Bienvenido a la Liga Oficial FIFAMANIAKOS FC 27! Sistema iniciado desde cero.',
          active: true,
          createdAt: new Date().toLocaleDateString('es-ES')
        }
      ]);
    }
  };

  if (!clubsLoaded) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-500 font-tech text-sm animate-pulse">Cargando Liga FIFAMANIAKOS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-[#02f59b] selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentClub={currentClub}
        onOpenRegister={() => setIsRegisterOpen(true)}
        clubs={clubs}
        onSelectClub={() => { /* el club activo viene de la cuenta autenticada (profile.club_id) */ }}
        isAdmin={isAdminLoggedIn}
        isLoggedIn={!!profile}
        loggedInLabel={profile?.gamertag}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
        tickerNews={tickerNews}
        onAddNewsItem={handleAddTickerNews}
        onOpenForumSection={handleOpenForumSection}
        onSelectCompetition={setSelectedCompetition}
      />

      {/* Main Workspace Container - Full Width */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 space-y-6">
        {dataWriteError && (
          <div className="flex items-start justify-between gap-4 p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-tech">
            <span>{dataWriteError}</span>
            <button
              onClick={clearDataWriteError}
              className="shrink-0 px-2 py-0.5 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded font-bold uppercase text-[10px]"
            >
              Cerrar
            </button>
          </div>
        )}
        {activeTab === 'foro' && (
          <ForumModule
            topics={topics}
            onCreateTopic={handleCreateTopic}
            onAddReply={handleAddReply}
            onLikeTopic={handleLikeTopic}
            currentClub={currentClub}
            registeredClubs={clubs}
            isAdmin={isAdminLoggedIn}
            isFounder={isFounder}
            onTogglePinTopic={handleTogglePinTopic}
            onDeleteTopic={handleDeleteTopic}
            onEditTopic={handleEditTopic}
            onEditReply={handleEditReply}
            onDeleteReply={handleDeleteReply}
            onOpenForumSection={handleOpenForumSection}
          />
        )}

        {activeTab === 'competicion-seccion' && activeSectionTag && (
          <CompetitionSectionView
            section={competitionSections.find(s => s.tag === activeSectionTag) || INITIAL_COMPETITION_SECTIONS.find(s => s.tag === activeSectionTag)!}
            isAdmin={isAdminLoggedIn}
            onBack={() => setActiveTab('foro')}
            onSave={(title, content) => handleSaveCompetitionSection(activeSectionTag, title, content)}
          />
        )}

        {activeTab === 'tienda' && (
          <MonetizationModule
            packages={budgetPackages}
            explanation={tiendaExplanation}
            isAdmin={isAdminLoggedIn}
            currentSeasonNumber={currentSeasonNumber}
            hasActiveSubscription={hasActiveSubscription}
            onAddPackage={handleAddBudgetPackage}
            onEditPackage={handleEditBudgetPackage}
            onDeletePackage={handleDeleteBudgetPackage}
            onSaveExplanation={setTiendaExplanation}
          />
        )}

        {activeTab === 'jugadores-sofifa' && (
          <SofifaPlayersExplorer
            currentClub={currentClub}
            onSignPlayer={(preset) => {
              if (currentClub) {
                if (!canUseGatedFeature) {
                  alert(SUBSCRIPTION_REQUIRED_MESSAGE);
                  return;
                }
                handleSignSofifaPlayer(preset, currentClub, preset.value);
                alert(`¡Has fichado a ${preset.name} para ${currentClub.name}!`);
              } else {
                alert('Selecciona un club en la barra superior para fichar este jugador.');
              }
            }}
          />
        )}

        {activeTab === 'sorteo' && (
          <DraftLotteryModule
            registeredClubs={clubs}
            isAdmin={isAdminLoggedIn}
            onAssignDraftClub={(clubId, preset) => {
              // clubId puede ser un slot virtual (club-1ra-slot-N) que
              // ensure36FirstDivClubs agrega solo para mostrar, y que todavia
              // no existe como fila real en Supabase. Si se lo busca con
              // .map() sobre la lista real (rawClubs), no aparece y el update
              // no hace nada, sin error. Por eso se busca la base en `clubs`
              // (la lista ya completada) y se agrega si prev no la tiene.
              setClubs(prev => {
                const base = clubs.find(c => c.id === clubId);
                if (!base) return prev;
                const updated = {
                  ...base,
                  name: preset.name,
                  shortName: preset.shortName,
                  logoUrl: preset.logoUrl,
                  stadium: preset.stadium,
                  budget: preset.defaultBudget
                };
                return prev.some(c => c.id === clubId)
                  ? prev.map(c => c.id === clubId ? updated : c)
                  : [...prev, updated];
              });
            }}
            onAssignDraftPlayer={(clubId, playerPreset) => {
              const newPlayer: Player = {
                id: `pl-draft-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                clubId: clubId,
                name: playerPreset.name,
                position: playerPreset.position,
                rating: playerPreset.rating,
                cardType: playerPreset.cardType || 'Gold',
                value: playerPreset.value || 25000000,
                photoUrl: playerPreset.photoUrl,
                stats: playerPreset.stats,
                isStarter: false
              };
              setPlayers(prev => [newPlayer, ...prev]);
            }}
            onAssignFullSquadDraft={(clubId, playerPresets) => {
              const newSquad: Player[] = playerPresets.map((preset, idx) => ({
                id: `pl-draft22-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
                clubId: clubId,
                name: preset.name,
                position: preset.position,
                rating: preset.rating,
                cardType: preset.cardType || 'Gold',
                value: preset.value || 25000000,
                photoUrl: preset.photoUrl,
                stats: preset.stats,
                isStarter: idx < 11
              }));
              setPlayers(prev => [...prev.filter(p => p.clubId !== clubId), ...newSquad]);
            }}
          />
        )}

        {activeTab === 'inscripciones' && (
          <InscripcionesModule
            clubs={clubs}
            players={players}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onSelectClub={() => { /* el club activo viene de la cuenta autenticada (profile.club_id) */ }}
            setActiveTab={setActiveTab}
            isAdmin={isAdminLoggedIn}
            onDeleteClub={handleDeleteClub}
          />
        )}

        {activeTab === 'clasificacion' && (
          <CompetitionsHub
            clubs={clubs}
            matches={matches}
            players={players}
            selectedCompetition={selectedCompetition}
            isAdmin={isAdminLoggedIn}
            currentClubId={profile?.club_id ?? undefined}
            canReportResults={canUseGatedFeature}
            subscriptionRequiredMessage={SUBSCRIPTION_REQUIRED_MESSAGE}
            onSelectCompetition={setSelectedCompetition}
            onAddMatchResult={handleAddMatchResult}
          />
        )}

        {activeTab === 'plantilla' && (
          <SquadBuilder
            currentClub={currentClub}
            players={players}
            transactions={transactions}
            transfers={transfers}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            onToggleStarter={handleToggleStarter}
            onUpdatePlayerClause={handleUpdatePlayerClause}
            onListPlayerForSale={handleListPlayerForSale}
          />
        )}

        {activeTab === 'fichajes' && (
          <TransferMarket
            currentClub={currentClub}
            clubs={clubs}
            transfers={transfers}
            transactions={transactions}
            onBuyPlayer={handleBuyPlayer}
            onListPlayerForSale={handleListPlayerForSale}
            onCancelTransfer={handleCancelTransfer}
            onUpdateTransferClause={handleUpdateTransferClause}
            onDirectTransferPlayer={handleDirectTransferPlayer}
            onSignSofifaPlayer={handleSignSofifaPlayer}
            onPopulateClubWithSofifa={handlePopulateClubWithSofifa}
            players={players}
          />
        )}

        {activeTab === 'admin' && (
          isAdminLoggedIn ? (
            <AdminPanel
              clubs={clubs}
              matches={matches}
              topics={topics}
              transfers={transfers}
              tickerNews={tickerNews}
              onAddTickerNews={handleAddTickerNews}
              onToggleTickerNews={handleToggleTickerNews}
              onDeleteTickerNews={handleDeleteTickerNews}
              onEditTickerNews={handleEditTickerNews}
              onAddClub={handleRegisterClub}
              onUpdateClub={handleUpdateClub}
              onDeleteClub={handleDeleteClub}
              onAddMatchResult={handleAddMatchResult}
              onUpdateMatchResult={handleUpdateMatchResult}
              onDeleteMatchResult={handleDeleteMatchResult}
              onDeleteTopic={handleDeleteTopic}
              onTogglePinTopic={handleTogglePinTopic}
              onEditTopic={handleEditTopic}
              onCreateOfficialAnnouncement={handleCreateOfficialAnnouncement}
              onDeleteTransfer={handleDeleteTransfer}
              onUpdateTransferClause={handleUpdateTransferClause}
              onGenerateFixtures={handleGenerateFixtures}
              onLogoutAdmin={handleLogoutAdmin}
              currentSeasonNumber={currentSeasonNumber}
              onSetCurrentSeasonNumber={setCurrentSeasonNumber}
            />
          ) : (
            <div className="fc-card p-8 md:p-12 rounded-2xl border-emerald-300 bg-slate-900 text-white text-center space-y-6 max-w-2xl mx-auto shadow-2xl animate-scale-up">
              <div className="w-16 h-16 bg-emerald-800 text-[#02f59b] rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-emerald-700">
                <ShieldCheck className="w-10 h-10 text-[#02f59b]" />
              </div>
              <div className="space-y-2">
                <span className="px-3 py-1 bg-emerald-800 text-[#02f59b] text-xs font-bold font-tech uppercase rounded border border-emerald-700">
                  Comisaría de Liga FIFAMANIAKOS
                </span>
                <h2 className="font-display font-black text-2xl md:text-3xl text-white uppercase italic">
                  Acceso Administrador Requerido
                </h2>
                <p className="text-xs text-slate-300 font-tech max-w-md mx-auto">
                  Para acceder al Panel de Administración de Clubes, Validación de Actas y Moderación necesitas la clave de Comisario (Clave demo: <code className="text-[#02f59b] font-mono font-bold">fifamaniakos</code>).
                </p>
              </div>
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="fc-button-primary px-8 py-3 text-sm font-extrabold uppercase shadow-xl inline-flex items-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" /> Abrir Modal de Administrador
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer - Full Width */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 md:px-8 lg:px-10 text-slate-500 text-xs font-tech">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-6 h-6 bg-[#00ba68] text-white font-display font-black text-xs flex items-center justify-center rounded fc-badge-triangle italic shadow-sm">
              FMK
            </div>
            <span className="font-display font-extrabold text-sm text-slate-800 uppercase">
              FIFAMANIAKOS - LIGA ONLINE FC 27
            </span>
            <span className="text-slate-400">• Comunidad de Fútbol Online & Gestión de Clubes</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span>© 2026 FIFAMANIAKOS Community</span>
            <span className="text-slate-400">• Creada y desarrollada por Dimenza, Juan Pablo</span>
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterClub={handleRegisterClub}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}

