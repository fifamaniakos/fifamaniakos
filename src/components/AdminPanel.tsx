import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { supabase } from '../lib/supabaseClient';
import { ClubLogo } from './ClubLogo';
import {
  Club,
  MatchResult,
  ForumTopic,
  TransferItem,
  TickerNewsItem
} from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Trophy,
  MessageSquare,
  DollarSign,
  Trash2,
  Edit3,
  PlusCircle,
  Pin,
  CheckCircle2,
  XCircle,
  Megaphone,
  Save,
  Plus,
  Radio,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Globe,
  Users
} from 'lucide-react';
import { 
  SOFIFA_CLUBS, 
  GET_SOFIFA_COUNTRIES, 
  GET_SOFIFA_LEAGUES_BY_COUNTRY, 
  GET_SOFIFA_CLUBS_BY_FILTER 
} from '../data/sofifaData';

interface ManagerRow {
  user_id: string;
  email: string;
  gamertag: string;
  platform: string;
  club_id: string | null;
  role: 'admin' | 'manager';
  is_owner: boolean;
  created_at: string;
}

interface AdminPanelProps {
  clubs: Club[];
  matches: MatchResult[];
  topics: ForumTopic[];
  transfers: TransferItem[];
  tickerNews: TickerNewsItem[];
  onAddTickerNews: (text: string) => void;
  onToggleTickerNews: (id: string) => void;
  onDeleteTickerNews: (id: string) => void;
  onEditTickerNews: (id: string, text: string) => void;
  onAddClub: (newClub: Club) => void;
  onUpdateClub: (updatedClub: Club) => void;
  onDeleteClub: (clubId: string) => void;
  onResetAllClubs?: () => void;
  onAddMatchResult: (newMatch: MatchResult) => void;
  onUpdateMatchResult: (matchId: string, status: 'CONFIRMADO' | 'RECHAZADO' | 'PENDIENTE', homeGoals?: number, awayGoals?: number) => void;
  onDeleteMatchResult: (matchId: string) => void;
  onDeleteTopic: (topicId: string) => void;
  onTogglePinTopic: (topicId: string) => void;
  onEditTopic?: (topicId: string, title: string, content: string) => void;
  onCreateOfficialAnnouncement: (title: string, content: string) => void;
  onDeleteTransfer?: (transferId: string) => void;
  onUpdateTransferClause?: (transferId: string, newAskingPrice: number) => void;
  onGenerateFixtures?: (competitionName?: string) => void;
  onLogoutAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  clubs,
  matches,
  topics,
  transfers,
  tickerNews,
  onAddTickerNews,
  onToggleTickerNews,
  onDeleteTickerNews,
  onEditTickerNews,
  onAddClub,
  onUpdateClub,
  onDeleteClub,
  onResetAllClubs,
  onAddMatchResult,
  onUpdateMatchResult,
  onDeleteMatchResult,
  onDeleteTopic,
  onTogglePinTopic,
  onEditTopic,
  onCreateOfficialAnnouncement,
  onDeleteTransfer,
  onUpdateTransferClause,
  onGenerateFixtures,
  onLogoutAdmin
}) => {
  const [adminTab, setAdminTab] = useState<'cartel' | 'clubes' | 'partidos' | 'foro' | 'fichajes' | 'anuncios' | 'cuentas'>('cartel');

  const [managers, setManagers] = useState<ManagerRow[]>([]);
  const [managersLoaded, setManagersLoaded] = useState(false);
  const [managerActionError, setManagerActionError] = useState<string | null>(null);

  const fetchManagers = async () => {
    const { data, error } = await supabase
      .from('managers')
      .select('user_id, email, gamertag, platform, club_id, role, is_owner, created_at')
      .order('created_at', { ascending: true });
    if (error) {
      setManagerActionError(error.message);
    } else if (data) {
      setManagers(data as ManagerRow[]);
    }
    setManagersLoaded(true);
  };

  useEffect(() => {
    if (adminTab === 'cuentas' && !managersLoaded) {
      fetchManagers();
    }
  }, [adminTab, managersLoaded]);

  const handleToggleManagerRole = async (manager: ManagerRow) => {
    const newRole = manager.role === 'admin' ? 'manager' : 'admin';
    setManagerActionError(null);
    const { error } = await supabase
      .from('managers')
      .update({ role: newRole })
      .eq('user_id', manager.user_id);
    if (error) {
      setManagerActionError(error.message);
      return;
    }
    setManagers(prev => prev.map(m => m.user_id === manager.user_id ? { ...m, role: newRole } : m));
  };

  const handleDeleteManager = async (manager: ManagerRow) => {
    if (!confirm(`¿Eliminar la cuenta de ${manager.email} (${manager.gamertag})? Esta acción no se puede deshacer.`)) {
      return;
    }
    setManagerActionError(null);
    const { error } = await supabase.rpc('admin_delete_manager', { target_user_id: manager.user_id });
    if (error) {
      setManagerActionError(error.message);
      return;
    }
    setManagers(prev => prev.filter(m => m.user_id !== manager.user_id));
  };

  // Ticker News State
  const [newNewsText, setNewNewsText] = useState('');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editingNewsText, setEditingNewsText] = useState('');

  // Add Club Form State
  const [showAddClubModal, setShowAddClubModal] = useState(false);
  const [adminSofifaCountry, setAdminSofifaCountry] = useState('');
  const [adminSofifaLeague, setAdminSofifaLeague] = useState('');
  const [adminSofifaClubId, setAdminSofifaClubId] = useState('');
  const [newClubName, setNewClubName] = useState('');
  const [newClubShort, setNewClubShort] = useState('');
  const [newClubManager, setNewClubManager] = useState('');
  const [newClubGamertag, setNewClubGamertag] = useState('');
  const [newClubPlatform, setNewClubPlatform] = useState<'PS5' | 'Xbox Series X' | 'PC'>('PS5');
  const [newClubBudget, setNewClubBudget] = useState<number>(100000000);
  const [newClubStadium, setNewClubStadium] = useState('');
  const [newClubLogoUrl, setNewClubLogoUrl] = useState('');

  const adminCountries = GET_SOFIFA_COUNTRIES();
  const adminAvailableLeagues = GET_SOFIFA_LEAGUES_BY_COUNTRY(adminSofifaCountry);
  const adminFilteredClubs = GET_SOFIFA_CLUBS_BY_FILTER(adminSofifaCountry, adminSofifaLeague);

  const handleAdminCountryChange = (country: string) => {
    setAdminSofifaCountry(country);
    setAdminSofifaLeague('');
    setAdminSofifaClubId('');
  };

  const handleAdminLeagueChange = (league: string) => {
    setAdminSofifaLeague(league);
    setAdminSofifaClubId('');
  };

  const handleSelectAdminSofifaClub = (id: string) => {
    setAdminSofifaClubId(id);
    if (!id) return;
    const preset = SOFIFA_CLUBS.find(c => c.id === id);
    if (preset) {
      setNewClubName(preset.name);
      setNewClubShort(preset.shortName);
      setNewClubStadium(preset.stadium);
      setNewClubBudget(preset.defaultBudget);
      setNewClubLogoUrl(preset.logoUrl);
      if (!adminSofifaCountry) setAdminSofifaCountry(preset.country);
      if (!adminSofifaLeague) setAdminSofifaLeague(preset.league);
    }
  };

  // Bulk Import SoFIFA Clubs
  const handleBulkImportSofifaClubs = () => {
    const existingNames = new Set(clubs.map(c => c.name.toLowerCase()));
    let importedCount = 0;

    SOFIFA_CLUBS.slice(0, 10).forEach(preset => {
      if (!existingNames.has(preset.name.toLowerCase())) {
        const newClub: Club = {
          id: `club-sofifa-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: preset.name,
          shortName: preset.shortName,
          manager: `Manager_${preset.shortName}`,
          gamertag: `@${preset.shortName}_ID`,
          platform: 'PS5',
          logoUrl: preset.logoUrl,
          budget: preset.defaultBudget,
          division: 'Primera División',
          stadium: preset.stadium,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          form: []
        };
        onAddClub(newClub);
        importedCount++;
      }
    });

    if (importedCount > 0) {
      alert(`¡Se importaron ${importedCount} equipos oficiales correctamente!`);
    } else {
      alert('Los equipos oficiales ya están inscriptos en la liga.');
    }
  };

  // Club Editing State
  const [editingClubId, setEditingClubId] = useState<string | null>(null);
  const [editBudget, setEditBudget] = useState<number>(0);
  const [editManager, setEditManager] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editGamertag, setEditGamertag] = useState<string>('');
  const [editDivision, setEditDivision] = useState<string>('1ra División');
  const [editLogoUrl, setEditLogoUrl] = useState<string>('');

  // Add Match Form State
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [addMatchHomeId, setAddMatchHomeId] = useState(clubs[0]?.id || '');
  const [addMatchAwayId, setAddMatchAwayId] = useState(clubs[1]?.id || clubs[0]?.id || '');
  const [addMatchday, setAddMatchday] = useState<number>(2);
  const [addHomeGoals, setAddHomeGoals] = useState<number>(0);
  const [addAwayGoals, setAddAwayGoals] = useState<number>(0);
  const [addHomeScorers, setAddHomeScorers] = useState('');
  const [addAwayScorers, setAddAwayScorers] = useState('');

  // Match Editing State
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [editHomeGoals, setEditHomeGoals] = useState<number>(0);
  const [editAwayGoals, setEditAwayGoals] = useState<number>(0);
  const [editHomeScorers, setEditHomeScorers] = useState<string>('');
  const [editAwayScorers, setEditAwayScorers] = useState<string>('');

  // Topic Editing State
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicTitle, setEditTopicTitle] = useState('');
  const [editTopicContent, setEditTopicContent] = useState('');

  const [adminMatchStatusFilter, setAdminMatchStatusFilter] = useState<'CONFIRMADO' | 'PENDIENTE' | 'TODOS'>('CONFIRMADO');
  const [adminMatchLimit, setAdminMatchLimit] = useState<number>(25);

  // Delete Modal Confirmation State
  const [deleteModal, setDeleteModal] = useState<{
    type: 'news' | 'club' | 'match' | 'topic' | 'transfer';
    id: string;
    name: string;
  } | null>(null);

  const handleExecuteDelete = () => {
    if (!deleteModal) return;
    if (deleteModal.type === 'news') onDeleteTickerNews(deleteModal.id);
    if (deleteModal.type === 'club') onDeleteClub(deleteModal.id);
    if (deleteModal.type === 'match') onDeleteMatchResult(deleteModal.id);
    if (deleteModal.type === 'topic') onDeleteTopic(deleteModal.id);
    if (deleteModal.type === 'transfer' && onDeleteTransfer) onDeleteTransfer(deleteModal.id);
    setDeleteModal(null);
  };

  // Announcement State
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceContent, setAnnounceContent] = useState('');
  const [announceSent, setAnnounceSent] = useState(false);

  // Handlers
  const handleAddTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsText.trim()) return;
    onAddTickerNews(newNewsText.trim());
    setNewNewsText('');
  };

  const startEditNews = (item: TickerNewsItem) => {
    setEditingNewsId(item.id);
    setEditingNewsText(item.text);
  };

  const saveNewsEdit = (id: string) => {
    if (editingNewsText.trim()) {
      onEditTickerNews(id, editingNewsText.trim());
    }
    setEditingNewsId(null);
  };

  const handleCreateClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClubName.trim() || !newClubManager.trim()) return;

    const newClub: Club = {
      id: `club-${Date.now()}`,
      name: newClubName.trim(),
      shortName: (newClubShort || newClubName.substring(0, 3)).toUpperCase(),
      manager: newClubManager.trim(),
      gamertag: newClubGamertag.trim() || `${newClubManager}_Tag`,
      platform: newClubPlatform,
      logoUrl: newClubLogoUrl || `https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80`,
      budget: newClubBudget,
      division: 'Primera División',
      stadium: newClubStadium.trim() || 'Estadio Municipal FC27',
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      form: []
    };

    onAddClub(newClub);
    setShowAddClubModal(false);
    setAdminSofifaClubId('');
    setNewClubName('');
    setNewClubShort('');
    setNewClubManager('');
    setNewClubGamertag('');
    setNewClubLogoUrl('');
  };

  const startEditClub = (club: Club) => {
    setEditingClubId(club.id);
    setEditBudget(club.budget);
    setEditManager(club.manager);
    setEditName(club.name);
    setEditGamertag(club.gamertag);
    setEditDivision(club.division || '1ra División');
    setEditLogoUrl(club.logoUrl);
  };

  const saveClubEdit = (club: Club) => {
    onUpdateClub({
      ...club,
      name: editName,
      manager: editManager,
      gamertag: editGamertag,
      budget: editBudget,
      division: editDivision,
      logoUrl: editLogoUrl || club.logoUrl
    });
    setEditingClubId(null);
  };

  const handleCreateMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addMatchHomeId === addMatchAwayId) {
      alert('El equipo local y visitante no pueden ser el mismo.');
      return;
    }

    const newMatch: MatchResult = {
      id: `match-${Date.now()}`,
      matchday: addMatchday,
      homeClubId: addMatchHomeId,
      awayClubId: addMatchAwayId,
      homeGoals: addHomeGoals,
      awayGoals: addAwayGoals,
      homeScorers: addHomeScorers,
      awayScorers: addAwayScorers,
      status: 'CONFIRMADO',
      createdAt: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
    };

    onAddMatchResult(newMatch);
    setShowAddMatchModal(false);
    setAddHomeGoals(0);
    setAddAwayGoals(0);
    setAddHomeScorers('');
    setAddAwayScorers('');
  };

  const startEditMatch = (match: MatchResult) => {
    setEditingMatchId(match.id);
    setEditHomeGoals(match.homeGoals);
    setEditAwayGoals(match.awayGoals);
    setEditHomeScorers(match.homeScorers || '');
    setEditAwayScorers(match.awayScorers || '');
  };

  const saveMatchEdit = (matchId: string) => {
    onUpdateMatchResult(matchId, 'CONFIRMADO', editHomeGoals, editAwayGoals, editHomeScorers, editAwayScorers);
    setEditingMatchId(null);
  };

  const startEditTopic = (topic: ForumTopic) => {
    setEditingTopicId(topic.id);
    setEditTopicTitle(topic.title);
    setEditTopicContent(topic.content);
  };

  const saveTopicEdit = (topicId: string) => {
    if (onEditTopic) {
      onEditTopic(topicId, editTopicTitle, editTopicContent);
    }
    setEditingTopicId(null);
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announceTitle || !announceContent) return;
    onCreateOfficialAnnouncement(announceTitle, announceContent);
    setAnnounceTitle('');
    setAnnounceContent('');
    setAnnounceSent(true);
    setTimeout(() => setAnnounceSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="fc-card p-6 rounded-2xl border-emerald-300 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#00ba68] text-white rounded-xl shadow-lg font-display font-black">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#02f59b] text-black text-[10px] font-extrabold font-tech uppercase rounded flex items-center gap-1 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping" />
                Comisaría General FIFAMANIAKOS
              </span>
              <span className="text-xs text-emerald-300 font-tech font-bold">Modo Administrador Activo</span>
            </div>
            <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase italic tracking-wide mt-1">
              Panel de Control Completo
            </h1>
            <p className="text-xs text-slate-300 font-tech">
              Control total de noticias en movimiento, clubes, actas, temas de foro y mercado de fichajes.
            </p>
          </div>
        </div>

        <button
          onClick={onLogoutAdmin}
          className="px-4 py-2 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-tech font-bold uppercase rounded-lg shadow transition-colors flex items-center gap-1.5 shrink-0"
        >
          <ShieldAlert className="w-4 h-4" /> Desconectar Admin
        </button>
      </div>

      {/* Admin Sub-navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setAdminTab('cartel')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase font-tech flex items-center gap-2 transition-all ${
            adminTab === 'cartel'
              ? 'bg-[#00ba68] text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <Radio className="w-4 h-4" /> Cartel en Movimiento ({tickerNews.length})
        </button>

        <button
          onClick={() => setAdminTab('clubes')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase font-tech flex items-center gap-2 transition-all ${
            adminTab === 'clubes'
              ? 'bg-[#00ba68] text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4" /> Clubes ({clubs.length})
        </button>

        <button
          onClick={() => setAdminTab('partidos')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase font-tech flex items-center gap-2 transition-all ${
            adminTab === 'partidos'
              ? 'bg-[#00ba68] text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <Trophy className="w-4 h-4" /> Actas ({matches.length})
        </button>

        <button
          onClick={() => setAdminTab('foro')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase font-tech flex items-center gap-2 transition-all ${
            adminTab === 'foro'
              ? 'bg-[#00ba68] text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Moderación Foro ({topics.length})
        </button>

        <button
          onClick={() => setAdminTab('fichajes')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase font-tech flex items-center gap-2 transition-all ${
            adminTab === 'fichajes'
              ? 'bg-[#00ba68] text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Mercado ({transfers.length})
        </button>

        <button
          onClick={() => setAdminTab('anuncios')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase font-tech flex items-center gap-2 transition-all ${
            adminTab === 'anuncios'
              ? 'bg-[#00ba68] text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Anuncio Oficial
        </button>

        <button
          onClick={() => setAdminTab('cuentas')}
          className={`px-4 py-2.5 rounded-t-xl text-xs font-bold uppercase font-tech flex items-center gap-2 transition-all ${
            adminTab === 'cuentas'
              ? 'bg-[#00ba68] text-white shadow-md'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <Users className="w-4 h-4" /> Cuentas ({managers.length})
        </button>
      </div>

      {/* TAB 1: CARTEL DE NOTICIAS EN MOVIMIENTO */}
      {adminTab === 'cartel' && (
        <div className="fc-card p-6 rounded-2xl border-slate-200 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-display font-extrabold text-lg text-slate-900 uppercase italic flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#00ba68] animate-pulse" /> Gestión del Cartel en Movimiento (Marquee Banner)
              </h2>
              <p className="text-xs text-slate-500 font-tech">
                Las noticias activas van desplazándose en vivo en el encabezado superior de la aplicación.
              </p>
            </div>
            <span className="text-xs text-emerald-800 bg-emerald-100 font-tech font-bold px-2.5 py-1 rounded border border-emerald-300">
              {tickerNews.filter(n => n.active).length} Noticia(s) en Pantalla
            </span>
          </div>

          {/* Form to Add New Ticker News */}
          <form onSubmit={handleAddTickerSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-900 uppercase italic flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#00ba68]" /> Agregar Nueva Noticia o Anuncio al Encabezado
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newNewsText}
                onChange={(e) => setNewNewsText(e.target.value)}
                placeholder="Ej: 🔥 Mercado de Invierno Abierto • Nuevos Premios de €10M para el Top 3 de la Liga"
                required
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
              <button
                type="submit"
                className="fc-button-primary px-5 py-2.5 text-xs font-extrabold uppercase shrink-0 shadow"
              >
                + Publicar Noticia
              </button>
            </div>
          </form>

          {/* List of Ticker Items */}
          <div className="space-y-3">
            {tickerNews.map((news) => {
              const isEditing = editingNewsId === news.id;

              return (
                <div
                  key={news.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                    news.active ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-100 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleTickerNews(news.id)}
                      className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                        news.active ? 'text-[#00ba68]' : 'text-slate-400'
                      }`}
                      title={news.active ? 'Desactivar del cartel' : 'Activar en cartel'}
                    >
                      {news.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingNewsText}
                            onChange={(e) => setEditingNewsText(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                          />
                          <button
                            onClick={() => saveNewsEdit(news.id)}
                            className="px-3 py-1.5 bg-[#00ba68] text-white text-xs font-bold uppercase rounded-lg"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingNewsId(null)}
                            className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-lg"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-bold text-slate-900 font-tech">
                            {news.text}
                          </p>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {news.active ? '🟢 VISIBLE EN CARTEL' : '🔴 OCULTO'} {news.createdAt ? `• ${news.createdAt}` : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => startEditNews(news)}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-tech font-bold uppercase flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Editar
                      </button>

                      <button
                        onClick={() => setDeleteModal({ type: 'news', id: news.id, name: news.text })}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Eliminar Noticia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CLUBES & FINANZAS */}
      {adminTab === 'clubes' && (
        <div className="fc-card p-6 rounded-2xl border-slate-200 space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-display font-extrabold text-lg text-slate-900 uppercase italic flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" /> Gestión de Clubes y Presupuestos
              </h2>
              <p className="text-xs text-slate-500 font-tech">Inscribe nuevos clubes, edita balances económicos o elimina equipos.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleBulkImportSofifaClubs}
                className="px-3.5 py-2 bg-slate-900 border border-emerald-500 text-[#02f59b] hover:bg-slate-800 text-xs font-bold font-tech uppercase rounded-xl flex items-center gap-1.5 shadow transition-colors"
                title="Carga automáticamente los 10 mejores equipos oficiales en la liga"
              >
                <Sparkles className="w-4 h-4 text-[#02f59b]" /> Cargar Equipos Oficiales
              </button>

              <button
                onClick={() => setShowAddClubModal(true)}
                className="fc-button-primary px-4 py-2 text-xs font-extrabold uppercase flex items-center gap-1.5 shadow transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Inscribir Club
              </button>

              <button
                onClick={() => {
                  if (confirm('⚠️ ¿DESEAS VACIAR Y RESETEAR TODAS LAS INSCRIPCIONES?\n\nEsta acción eliminará todos los clubes inscritos para empezar desde cero.')) {
                    if (onResetAllClubs) {
                      onResetAllClubs();
                    } else {
                      clubs.forEach(c => onDeleteClub(c.id));
                    }
                  }
                }}
                className="px-3.5 py-2 bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold font-tech uppercase rounded-xl flex items-center gap-1.5 shadow transition-colors"
                title="Elimina todas las inscripciones para empezar de nuevo"
              >
                <Trash2 className="w-4 h-4" /> Vaciar / Resetear Inscripciones
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map((club) => {
              const isEditing = editingClubId === club.id;

              return (
                <div
                  key={club.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {isEditing ? (
                      <div className="space-y-1 shrink-0">
                        <ClubLogo
                          src={editLogoUrl || club.logoUrl}
                          alt={club.name}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-emerald-500 shadow-sm"
                        />
                        <div className="w-12 text-center">
                          <label className="text-[9px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-1 py-0.5 rounded cursor-pointer block border border-emerald-300">
                            Cambiar
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    if (ev.target?.result) {
                                      setEditLogoUrl(ev.target.result as string);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <ClubLogo
                        src={club.logoUrl}
                        alt={club.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-300 shrink-0"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900"
                            placeholder="Nombre del club"
                          />
                          <input
                            type="text"
                            value={editManager}
                            onChange={(e) => setEditManager(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-700"
                            placeholder="Nombre Manager"
                          />
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={editGamertag}
                              onChange={(e) => setEditGamertag(e.target.value)}
                              className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-[11px] text-slate-700 font-mono"
                              placeholder="Gamertag"
                            />
                            <select
                              value={editDivision}
                              onChange={(e) => setEditDivision(e.target.value)}
                              className="px-2 py-1 bg-white border border-slate-300 rounded text-[11px] font-bold text-emerald-800"
                            >
                              <option value="1ra División">1ra Div</option>
                              <option value="2da División">2da Div</option>
                            </select>
                          </div>
                          <input
                            type="text"
                            value={editLogoUrl}
                            onChange={(e) => setEditLogoUrl(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-[10px] text-slate-600 font-mono"
                            placeholder="URL de imagen (https://...)"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-display font-black text-sm text-slate-900 truncate">
                              {club.name} ({club.shortName})
                            </h3>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                              {club.division || '1ra División'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-tech">
                            Manager: <strong className="text-slate-800">{club.manager}</strong>
                          </p>
                          <p className="text-[10px] text-emerald-800 font-mono font-bold">
                            {club.platform} • ID: {club.gamertag}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Budget & Stats */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-tech font-bold">Presupuesto Actual:</span>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono text-emerald-700">€</span>
                          <input
                            type="number"
                            value={editBudget}
                            onChange={(e) => setEditBudget(Number(e.target.value))}
                            className="w-28 px-2 py-0.5 bg-slate-50 border border-slate-300 rounded text-xs font-bold font-mono text-emerald-800"
                          />
                        </div>
                      ) : (
                        <span className="font-display font-bold text-emerald-800 text-sm">
                          €{(club.budget / 1000000).toFixed(1)}M
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-[10px] text-center text-slate-600 font-tech border-t border-slate-100 pt-1.5">
                      <div>PJ: <strong>{club.played}</strong></div>
                      <div>PG: <strong>{club.won}</strong></div>
                      <div>PE: <strong>{club.drawn}</strong></div>
                      <div>PTS: <strong className="text-emerald-700 font-extrabold">{club.points}</strong></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => saveClubEdit(club)}
                          className="flex-1 py-1.5 bg-emerald-700 text-white rounded text-xs font-bold uppercase flex items-center justify-center gap-1 hover:bg-emerald-800"
                        >
                          <Save className="w-3.5 h-3.5" /> Guardar
                        </button>
                        <button
                          onClick={() => setEditingClubId(null)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs font-bold uppercase"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditClub(club)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-tech font-bold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-700" /> Editar Datos
                        </button>

                        <button
                          onClick={() => setDeleteModal({ type: 'club', id: club.id, name: club.name })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar club"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ACTAS Y PARTIDOS */}
      {adminTab === 'partidos' && (
        <div className="fc-card p-6 rounded-2xl border-slate-200 space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-display font-extrabold text-lg text-slate-900 uppercase italic flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-700" /> Validación y Registro de Partidos
              </h2>
              <p className="text-xs text-slate-500 font-tech">Registra resultados oficiales o edita marcadores y estado de actas.</p>
            </div>

            <button
              onClick={() => setShowAddMatchModal(true)}
              className="fc-button-primary px-4 py-2 text-xs font-extrabold uppercase flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="w-4 h-4" /> + Registrar Partido Directo
            </button>
          </div>

          {/* Generador de Fixtures por Competencia */}
          {onGenerateFixtures && (
            <div className="bg-slate-900 text-white p-4 rounded-xl border border-emerald-500/40 shadow-lg space-y-3">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-black text-sm uppercase text-[#02f59b] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> CREAR Y GENERAR FIXTURE AUTOMÁTICO DE COMPETICIONES
                  </h3>
                  <p className="text-[11px] text-slate-300 font-tech">
                    Genera el calendario completo de jornadas (Ida y Vuelta) para 1ra División y 2da División. Los cuadros de Champions League, Europa League y Conference League se arman solos según la posición en 1ra División.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm('¿Deseas generar automáticamente el fixture completo para todas las competiciones del sistema?')) {
                        onGenerateFixtures('TODAS');
                      }
                    }}
                    className="fc-button-primary px-4 py-2 text-xs uppercase font-extrabold flex items-center gap-1.5 shadow-md"
                  >
                    <Trophy className="w-4 h-4" /> Generar Fixtures Completo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filtro Rápido de Estado para Rendimiento Ultra Rápido */}
          {(() => {
            const filteredMatches = matches.filter(match => {
              if (adminMatchStatusFilter === 'CONFIRMADO') return match.status === 'CONFIRMADO';
              if (adminMatchStatusFilter === 'PENDIENTE') return match.status === 'PENDIENTE';
              return true;
            });
            const visibleMatches = filteredMatches.slice(0, adminMatchLimit);

            return (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <button
                      onClick={() => { setAdminMatchStatusFilter('CONFIRMADO'); setAdminMatchLimit(25); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-tech uppercase transition-all ${
                        adminMatchStatusFilter === 'CONFIRMADO'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ⚽ Solo Actas Cargadas ({matches.filter(m => m.status === 'CONFIRMADO').length})
                    </button>
                    <button
                      onClick={() => { setAdminMatchStatusFilter('PENDIENTE'); setAdminMatchLimit(25); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-tech uppercase transition-all ${
                        adminMatchStatusFilter === 'PENDIENTE'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ⏳ Fixture Pendiente ({matches.filter(m => m.status === 'PENDIENTE').length})
                    </button>
                    <button
                      onClick={() => { setAdminMatchStatusFilter('TODOS'); setAdminMatchLimit(25); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-tech uppercase transition-all ${
                        adminMatchStatusFilter === 'TODOS'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      📋 Todos ({matches.length})
                    </button>
                  </div>
                  <span className="text-[11px] font-tech text-slate-500 px-2 font-bold">
                    Mostrando {visibleMatches.length} de {filteredMatches.length} partidos
                  </span>
                </div>

                {visibleMatches.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-tech font-bold uppercase">
                      {adminMatchStatusFilter === 'CONFIRMADO'
                        ? 'Aún no hay actas de partidos cargadas por los usuarios.'
                        : 'No hay partidos pendientes en esta vista.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visibleMatches.map((match) => {
                      const homeClub = clubs.find((c) => c.id === match.homeClubId);
                      const awayClub = clubs.find((c) => c.id === match.awayClubId);
                      const isEditingMatch = editingMatchId === match.id;

                      return (
                        <div
                          key={match.id}
                          className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 text-[11px] font-tech">
                              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-bold rounded">
                                Jornada {match.matchday}
                              </span>
                              <span className="text-slate-400">• {match.createdAt}</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  match.status === 'CONFIRMADO'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : match.status === 'RECHAZADO'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}
                              >
                                {match.status}
                              </span>
                            </div>

                            {/* Scoreline */}
                            <div className="flex items-center gap-4 text-slate-900 font-display font-black text-lg">
                              <span>{homeClub?.name || 'Local'}</span>
                              {isEditingMatch ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={editHomeGoals}
                                    onChange={(e) => setEditHomeGoals(Number(e.target.value))}
                                    className="w-12 p-1 bg-white border border-slate-300 rounded text-center text-sm font-bold text-emerald-700"
                                  />
                                  <span>-</span>
                                  <input
                                    type="number"
                                    value={editAwayGoals}
                                    onChange={(e) => setEditAwayGoals(Number(e.target.value))}
                                    className="w-12 p-1 bg-white border border-slate-300 rounded text-center text-sm font-bold text-slate-900"
                                  />
                                </div>
                              ) : (
                                <span className="text-[#00ba68]">
                                  {match.homeGoals} - {match.awayGoals}
                                </span>
                              )}
                              <span>{awayClub?.name || 'Visitante'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isEditingMatch ? (
                              <>
                                <button
                                  onClick={() => saveMatchEdit(match.id)}
                                  className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold uppercase flex items-center gap-1 shadow-sm"
                                >
                                  <Save className="w-3.5 h-3.5" /> Guardar
                                </button>
                                <button
                                  onClick={() => setEditingMatchId(null)}
                                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs font-bold uppercase"
                                >
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                {match.status !== 'CONFIRMADO' && (
                                  <button
                                    onClick={() => onUpdateMatchResult(match.id, 'CONFIRMADO')}
                                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-tech font-bold uppercase rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Validar
                                  </button>
                                )}

                                {match.status !== 'RECHAZADO' && (
                                  <button
                                    onClick={() => onUpdateMatchResult(match.id, 'RECHAZADO')}
                                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-tech font-bold uppercase rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                                  >
                                    <XCircle className="w-3.5 h-3.5" /> Rechazar
                                  </button>
                                )}

                                <button
                                  onClick={() => startEditMatch(match)}
                                  className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-tech font-bold rounded-lg flex items-center gap-1"
                                  title="Editar Marcador"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => setDeleteModal({ type: 'match', id: match.id, name: `Jornada ${match.matchday}: ${homeClub?.name || 'Local'} vs ${awayClub?.name || 'Visitante'}` })}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                                  title="Eliminar Acta"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {filteredMatches.length > adminMatchLimit && (
                      <div className="text-center pt-2">
                        <button
                          onClick={() => setAdminMatchLimit(prev => prev + 25)}
                          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-tech font-bold uppercase rounded-xl shadow transition-colors"
                        >
                          + Cargar Más Actas ({filteredMatches.length - adminMatchLimit} restantes)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: MODERACIÓN DEL FORO */}
      {adminTab === 'foro' && (
        <div className="fc-card p-6 rounded-2xl border-slate-200 space-y-4 shadow-md">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h2 className="font-display font-extrabold text-lg text-slate-900 uppercase italic flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-700" /> Moderación de Temas del Foro
            </h2>
            <span className="text-xs text-slate-500 font-tech">Temas Activos: {topics.length}</span>
          </div>

          <div className="space-y-3">
            {topics.map((topic) => {
              const isEditing = editingTopicId === topic.id;

              return (
                <div
                  key={topic.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {topic.isPinned && (
                        <span className="px-2 py-0.5 bg-emerald-800 text-white text-[10px] font-bold uppercase rounded flex items-center gap-1">
                          <Pin className="w-3 h-3" /> FIJADO
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold uppercase rounded">
                        {topic.category}
                      </span>
                      <span className="text-xs text-slate-400 font-tech">• {topic.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onTogglePinTopic(topic.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-tech font-bold uppercase flex items-center gap-1 transition-colors ${
                          topic.isPinned
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        <Pin className="w-3.5 h-3.5" />
                        {topic.isPinned ? 'Desfijar' : 'Fijar arriba'}
                      </button>

                      {!isEditing && (
                        <button
                          onClick={() => startEditTopic(topic)}
                          className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-tech font-bold rounded-lg flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Editar
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteModal({ type: 'topic', id: topic.id, name: topic.title })}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Eliminar tema del foro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 pt-2 bg-white p-3 rounded-lg border border-slate-300">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Título del Tema</label>
                        <input
                          type="text"
                          value={editTopicTitle}
                          onChange={(e) => setEditTopicTitle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-600 mb-1">Contenido del Tema</label>
                        <textarea
                          value={editTopicContent}
                          onChange={(e) => setEditTopicContent(e.target.value)}
                          rows={3}
                          className="w-full p-3 bg-slate-50 border border-slate-300 rounded text-xs"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingTopicId(null)}
                          className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => saveTopicEdit(topic.id)}
                          className="px-4 py-1 bg-[#00ba68] text-white text-xs font-bold uppercase rounded"
                        >
                          Guardar Cambios
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-tech mt-1 whitespace-pre-line line-clamp-2">
                        {topic.content}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-2">
                        Autor: {topic.authorName} ({topic.authorClub}) • {topic.replies.length} respuestas • {topic.likes} Me gusta
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: MERCADO DE FICHAJES */}
      {adminTab === 'fichajes' && (
        <div className="fc-card p-6 rounded-2xl border-slate-200 space-y-4 shadow-md">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h2 className="font-display font-extrabold text-lg text-slate-900 uppercase italic flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-700" /> Moderación del Mercado de Fichajes
            </h2>
            <span className="text-xs text-slate-500 font-tech">Fichajes en lista: {transfers.length}</span>
          </div>

          <div className="space-y-3">
            {transfers.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6 font-tech">No hay jugadores transferibles en el mercado actualmente.</p>
            ) : (
              transfers.map((tf) => {
                const sellerClub = clubs.find(c => c.id === tf.sellerClubId);

                return (
                  <div
                    key={tf.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-[#02f59b] font-display font-black text-[10px] flex items-center justify-center shrink-0 border border-slate-700">
                        {tf.player.position}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-sm text-slate-900">{tf.player.name}</h3>
                          <span className="text-[10px] bg-slate-200 font-bold px-1.5 py-0.5 rounded">{tf.player.position}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">GRL {tf.player.rating}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-tech">
                          Vendedor: <strong>{sellerClub?.name || 'Club'}</strong> • Precio: <strong className="text-emerald-700">€{(tf.askingPrice / 1000000).toFixed(1)}M</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        tf.status === 'VENDIDO' ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {tf.status}
                      </span>

                      {onUpdateTransferClause && (
                        <button
                          onClick={() => {
                            const currentInM = (tf.askingPrice / 1000000).toFixed(1);
                            const val = prompt(`Ingresa la nueva cláusula para ${tf.player.name} en millones de euros (€):`, currentInM);
                            if (val !== null) {
                              const numVal = parseFloat(val);
                              if (!isNaN(numVal) && numVal > 0) {
                                onUpdateTransferClause(tf.id, Math.round(numVal * 1000000));
                              }
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Modificar Cláusula"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                      {onDeleteTransfer && (
                        <button
                          onClick={() => setDeleteModal({ type: 'transfer', id: tf.id, name: tf.player.name })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar de Mercado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 6: COMUNICADO OFICIAL ADMIN */}
      {adminTab === 'anuncios' && (
        <div className="fc-card p-6 md:p-8 rounded-2xl border-slate-200 space-y-6 shadow-md">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-display font-extrabold text-xl text-slate-900 uppercase italic flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-emerald-700" /> Emitir Comunicado Oficial de la Liga
            </h2>
            <p className="text-xs text-slate-500 font-tech mt-1">
              Se publicará directamente fijado en la sección de Anuncios Oficiales del Foro con sello de Administrador.
            </p>
          </div>

          <form onSubmit={handlePostAnnouncement} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                Título del Comunicado
              </label>
              <input
                type="text"
                value={announceTitle}
                onChange={(e) => setAnnounceTitle(e.target.value)}
                placeholder="Ej: 🚨 Sanciones de la Jornada 3 & Apertura del Mercado de Invierno"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                Contenido Detallado
              </label>
              <textarea
                value={announceContent}
                onChange={(e) => setAnnounceContent(e.target.value)}
                rows={5}
                placeholder="Escribe los detalles oficiales de la Liga FIFAMANIAKOS..."
                required
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>

            {announceSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-tech flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Comunicado publicado con éxito en el Foro de la Liga FIFAMANIAKOS!</span>
              </div>
            )}

            <button
              type="submit"
              className="fc-button-primary px-6 py-3 text-xs font-extrabold uppercase shadow-md flex items-center gap-2"
            >
              <Megaphone className="w-4 h-4" /> Publicar Comunicado Pinned
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: CUENTAS DE MANAGERS */}
      {adminTab === 'cuentas' && (
        <div className="fc-card p-6 rounded-2xl border-slate-200 space-y-6 shadow-md">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-display font-extrabold text-xl text-slate-900 uppercase italic flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-700" /> Cuentas de DTs Registrados
            </h2>
            <p className="text-xs text-slate-500 font-tech mt-1">
              Gestioná el rol de los managers registrados. La cuenta del Fundador de la
              liga está protegida y no puede modificarse desde aquí.
            </p>
          </div>

          {managerActionError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-tech">
              {managerActionError}
            </div>
          )}

          {!managersLoaded ? (
            <p className="text-xs text-slate-500 font-tech">Cargando cuentas...</p>
          ) : managers.length === 0 ? (
            <p className="text-xs text-slate-500 font-tech">Todavía no hay DTs registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-tech">
                <thead>
                  <tr className="text-left text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Gamertag</th>
                    <th className="py-2 pr-3">Plataforma</th>
                    <th className="py-2 pr-3">Club</th>
                    <th className="py-2 pr-3">Rol</th>
                    <th className="py-2 pr-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map(manager => {
                    const linkedClub = clubs.find(c => c.id === manager.club_id);
                    return (
                      <tr key={manager.user_id} className="border-b border-slate-100">
                        <td className="py-2 pr-3 font-semibold text-slate-800">{manager.email}</td>
                        <td className="py-2 pr-3">{manager.gamertag}</td>
                        <td className="py-2 pr-3">{manager.platform}</td>
                        <td className="py-2 pr-3">{linkedClub?.name ?? '—'}</td>
                        <td className="py-2 pr-3 uppercase">{manager.role}</td>
                        <td className="py-2 pr-3">
                          {manager.is_owner ? (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold uppercase text-[10px]">
                              Fundador
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleManagerRole(manager)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-bold uppercase"
                              >
                                {manager.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                              </button>
                              <button
                                onClick={() => handleDeleteManager(manager)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold uppercase flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Eliminar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Inscribir Nuevo Club (Admin) */}
      {showAddClubModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="fc-card max-w-lg w-full p-6 rounded-2xl border-emerald-300 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-display font-black text-lg text-slate-900 uppercase italic flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#00ba68]" /> Inscribir Nuevo Club en la Liga
              </h3>
              <button onClick={() => setShowAddClubModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateClubSubmit} className="space-y-3">
              {/* Preset Selector con País y Liga */}
              <div className="bg-slate-900 p-3 rounded-xl border border-emerald-800 text-white space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#02f59b] font-tech uppercase">
                  <Sparkles className="w-3.5 h-3.5" /> Búsqueda por País y Liga
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-300 font-tech uppercase mb-1">
                      1. País
                    </label>
                    <select
                      value={adminSofifaCountry}
                      onChange={(e) => handleAdminCountryChange(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-800 border border-emerald-700/70 rounded-lg text-xs text-white focus:outline-none"
                    >
                      <option value="">🌍 Todos ({adminCountries.length})</option>
                      {adminCountries.map(country => (
                        <option key={country} value={country}>🚩 {country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-300 font-tech uppercase mb-1">
                      2. Liga
                    </label>
                    <select
                      value={adminSofifaLeague}
                      onChange={(e) => handleAdminLeagueChange(e.target.value)}
                      disabled={!adminSofifaCountry && adminAvailableLeagues.length === 0}
                      className="w-full px-2 py-1 bg-slate-800 border border-emerald-700/70 rounded-lg text-xs text-white focus:outline-none disabled:opacity-50"
                    >
                      <option value="">🏆 Todas</option>
                      {adminAvailableLeagues.map(league => (
                        <option key={league} value={league}>🏆 {league}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-300 font-tech uppercase mb-1">
                    3. Equipo Oficial
                  </label>
                  <select
                    value={adminSofifaClubId}
                    onChange={(e) => handleSelectAdminSofifaClub(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-800 border border-emerald-600 rounded-lg text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="">-- Autocompletar ({adminFilteredClubs.length} clubes) --</option>
                    {adminFilteredClubs.map(club => (
                      <option key={club.id} value={club.id}>
                        ⚽ {club.name} — {club.league} ({club.country})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase font-tech">Nombre del Club</label>
                <input
                  type="text"
                  value={newClubName}
                  onChange={(e) => setNewClubName(e.target.value)}
                  placeholder="Ej: Paris Saint-Germain Cyber"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase font-tech">Abreviatura (3 Letras)</label>
                  <input
                    type="text"
                    value={newClubShort}
                    onChange={(e) => setNewClubShort(e.target.value)}
                    placeholder="Ej: PSG"
                    maxLength={3}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs uppercase font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase font-tech">Plataforma</label>
                  <select
                    value={newClubPlatform}
                    onChange={(e) => setNewClubPlatform(e.target.value as 'PS5' | 'Xbox Series X' | 'PC')}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                  >
                    <option value="PS5">PS5</option>
                    <option value="Xbox Series X">Xbox Series X</option>
                    <option value="PC">PC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase font-tech">Nombre Manager</label>
                  <input
                    type="text"
                    value={newClubManager}
                    onChange={(e) => setNewClubManager(e.target.value)}
                    placeholder="Ej: Lucas_Gamer"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase font-tech">Gamertag / ID PSN</label>
                  <input
                    type="text"
                    value={newClubGamertag}
                    onChange={(e) => setNewClubGamertag(e.target.value)}
                    placeholder="Ej: Lucas_Gamer_PSN"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase font-tech">Presupuesto Inicial (€)</label>
                  <input
                    type="number"
                    value={newClubBudget}
                    onChange={(e) => setNewClubBudget(Number(e.target.value))}
                    step={1000000}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold font-mono text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase font-tech">Estadio Oficial</label>
                  <input
                    type="text"
                    value={newClubStadium}
                    onChange={(e) => setNewClubStadium(e.target.value)}
                    placeholder="Ej: Parc des Princes FC27"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddClubModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-5 py-2 text-xs font-extrabold uppercase shadow"
                >
                  Guardar e Inscribir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inscribir Club (Admin) */}
      <Modal
        isOpen={showAddClubModal}
        onClose={() => setShowAddClubModal(false)}
        title="Inscribir Nuevo Club"
        subtitle="Agrega un club manualmente o búscalo por país y liga oficial"
        badgeText="GESTIÓN DE CLUBES"
        icon={<Building2 className="w-5 h-5 text-[#02f59b]" />}
        maxWidth="xl"
      >
        <form onSubmit={handleCreateClubSubmit} className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/40 text-white space-y-3">
            <h4 className="text-xs font-bold font-tech uppercase text-[#02f59b] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" /> Búsqueda por País y Liga
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-300 font-tech uppercase mb-1">
                  1. País
                </label>
                <select
                  value={adminSofifaCountry}
                  onChange={(e) => handleAdminCountryChange(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-800 border border-emerald-700/70 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="">🌍 Todos ({adminCountries.length})</option>
                  {adminCountries.map(country => (
                    <option key={country} value={country}>🚩 {country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-300 font-tech uppercase mb-1">
                  2. Liga
                </label>
                <select
                  value={adminSofifaLeague}
                  onChange={(e) => handleAdminLeagueChange(e.target.value)}
                  disabled={!adminSofifaCountry && adminAvailableLeagues.length === 0}
                  className="w-full px-2 py-1.5 bg-slate-800 border border-emerald-700/70 rounded-lg text-xs text-white focus:outline-none disabled:opacity-50"
                >
                  <option value="">🏆 Todas</option>
                  {adminAvailableLeagues.map(league => (
                    <option key={league} value={league}>🏆 {league}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-300 font-tech uppercase mb-1">
                3. Equipo Oficial
              </label>
              <select
                value={adminSofifaClubId}
                onChange={(e) => handleSelectAdminSofifaClub(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-800 border border-emerald-600 rounded-lg text-xs font-bold text-white focus:outline-none"
              >
                <option value="">-- Autocompletar ({adminFilteredClubs.length} clubes) --</option>
                {adminFilteredClubs.map(club => (
                  <option key={club.id} value={club.id}>
                    ⚽ {club.name} — {club.league} ({club.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">Nombre del Club</label>
            <input
              type="text"
              value={newClubName}
              onChange={(e) => setNewClubName(e.target.value)}
              placeholder="Ej: Paris Saint-Germain Cyber"
              required
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00ba68]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">Abreviatura (3 Letras)</label>
              <input
                type="text"
                value={newClubShort}
                onChange={(e) => setNewClubShort(e.target.value)}
                placeholder="Ej: PSG"
                maxLength={3}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs uppercase font-bold text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">Plataforma</label>
              <select
                value={newClubPlatform}
                onChange={(e) => setNewClubPlatform(e.target.value as 'PS5' | 'Xbox Series X' | 'PC')}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00ba68]"
              >
                <option value="PS5">PS5</option>
                <option value="Xbox Series X">Xbox Series X</option>
                <option value="PC">PC</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">Nombre Manager</label>
              <input
                type="text"
                value={newClubManager}
                onChange={(e) => setNewClubManager(e.target.value)}
                placeholder="Ej: Lucas_Gamer"
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-[#00ba68]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">Gamertag / ID PSN</label>
              <input
                type="text"
                value={newClubGamertag}
                onChange={(e) => setNewClubGamertag(e.target.value)}
                placeholder="Ej: Lucas_Gamer_PSN"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-[#00ba68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">Presupuesto Inicial (€)</label>
              <input
                type="number"
                value={newClubBudget}
                onChange={(e) => setNewClubBudget(Number(e.target.value))}
                step={1000000}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono text-emerald-800 focus:outline-none focus:border-[#00ba68]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">Estadio Oficial</label>
              <input
                type="text"
                value={newClubStadium}
                onChange={(e) => setNewClubStadium(e.target.value)}
                placeholder="Ej: Parc des Princes FC27"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddClubModal(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="fc-button-primary px-6 py-2.5 text-xs font-extrabold uppercase shadow-lg"
            >
              Guardar e Inscribir
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Registrar Partido Directo (Admin) */}
      <Modal
        isOpen={showAddMatchModal}
        onClose={() => setShowAddMatchModal(false)}
        title="Registrar Resultado de Partido"
        subtitle="Registra el marcador oficial y goleadores del partido"
        badgeText="VALIDACIÓN Y ACTAS"
        icon={<Trophy className="w-5 h-5 text-[#02f59b]" />}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateMatchSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">
              Número de Jornada
            </label>
            <input
              type="number"
              value={addMatchday}
              onChange={(e) => setAddMatchday(Number(e.target.value))}
              min={1}
              max={38}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#00ba68]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">
                Equipo Local
              </label>
              <select
                value={addMatchHomeId}
                onChange={(e) => setAddMatchHomeId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00ba68]"
              >
                {clubs.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">
                Equipo Visitante
              </label>
              <select
                value={addMatchAwayId}
                onChange={(e) => setAddMatchAwayId(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00ba68]"
              >
                {clubs.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">
                Goles Local
              </label>
              <input
                type="number"
                value={addHomeGoals}
                onChange={(e) => setAddHomeGoals(Number(e.target.value))}
                min={0}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-center font-display font-black text-2xl text-emerald-700 focus:outline-none focus:border-[#00ba68]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">
                Goles Visitante
              </label>
              <input
                type="number"
                value={addAwayGoals}
                onChange={(e) => setAddAwayGoals(Number(e.target.value))}
                min={0}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-center font-display font-black text-2xl text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">
                Goleadores Local (Opcional)
              </label>
              <input
                type="text"
                value={addHomeScorers}
                onChange={(e) => setAddHomeScorers(e.target.value)}
                placeholder="Ej: Mbappé (2), Vinicius"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase font-tech mb-1">
                Goleadores Visitante (Opcional)
              </label>
              <input
                type="text"
                value={addAwayScorers}
                onChange={(e) => setAddAwayScorers(e.target.value)}
                placeholder="Ej: Lewandowski, Yamal"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddMatchModal(false)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="fc-button-primary px-6 py-2.5 text-xs font-extrabold uppercase shadow-lg"
            >
              Guardar Resultado
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirmar Eliminación Admin */}
      <Modal
        isOpen={Boolean(deleteModal)}
        onClose={() => setDeleteModal(null)}
        title="¿Confirmar Eliminación?"
        subtitle="Esta acción eliminará el elemento seleccionado de forma permanente"
        badgeText="ZONA DANGER"
        icon={<Trash2 className="w-5 h-5 text-rose-500" />}
        maxWidth="md"
      >
        {deleteModal && (
          <div className="space-y-4">
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
              <p className="text-sm font-bold text-rose-900 font-tech">"{deleteModal.name}"</p>
              <p className="text-[11px] text-rose-700 font-mono uppercase mt-1">
                Tipo: {deleteModal.type === 'news' ? 'Noticia de Cartel' : deleteModal.type === 'club' ? 'Club Inscrito' : deleteModal.type === 'match' ? 'Acta de Partido' : deleteModal.type === 'topic' ? 'Tema de Foro' : 'Jugador en Mercado'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-tech font-extrabold uppercase rounded-xl shadow-md transition-colors"
              >
                Sí, Eliminar Definitivamente
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
