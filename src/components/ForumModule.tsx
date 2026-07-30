import React, { useState } from 'react';
import { ForumTopic, ForumCategory, ForumReply, Club } from '../types';
import { MessageSquare, Plus, Eye, Heart, Pin, Share2, Search, CornerDownRight, Shield, User, Image as ImageIcon, ArrowLeft, Clock, Trash2, X, Edit3, Scale, Coins, Gavel, Dice5 } from 'lucide-react';

interface ForumModuleProps {
  topics: ForumTopic[];
  onCreateTopic: (topic: ForumTopic) => void;
  onAddReply: (topicId: string, reply: ForumReply) => void;
  onLikeTopic: (topicId: string) => void;
  currentClub: Club | null;
  registeredClubs?: Club[];
  isAdmin?: boolean;
  onTogglePinTopic?: (topicId: string) => void;
  onDeleteTopic?: (topicId: string) => void;
  onEditTopic?: (topicId: string, title: string, content: string) => void;
  onEditReply?: (topicId: string, replyId: string, content: string) => void;
  onDeleteReply?: (topicId: string, replyId: string) => void;
}

const CATEGORIES: (ForumCategory | 'Todos')[] = [
  'Todos',
  'Anuncios',
  'Quejas y sugerencias'
];

export const ForumModule: React.FC<ForumModuleProps> = ({
  topics,
  onCreateTopic,
  onAddReply,
  onLikeTopic,
  currentClub,
  registeredClubs = [],
  isAdmin,
  onTogglePinTopic,
  onDeleteTopic,
  onEditTopic,
  onEditReply,
  onDeleteReply
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<ForumTopic | null>(null);
  const [topicToEdit, setTopicToEdit] = useState<ForumTopic | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [replyToDelete, setReplyToDelete] = useState<ForumReply | null>(null);
  const [replyToEdit, setReplyToEdit] = useState<ForumReply | null>(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  const ADMIN_ONLY_CATEGORIES: ForumCategory[] = ['Anuncios'];

  const availableCategories: ForumCategory[] = [
    'Anuncios',
    'Quejas y sugerencias'
  ].filter(cat => isAdmin || !ADMIN_ONLY_CATEGORIES.includes(cat as ForumCategory)) as ForumCategory[];

  // New Topic Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumCategory>(availableCategories[0] || 'Quejas y sugerencias');
  const [newContent, setNewContent] = useState('');

  // Reply Form State
  const [replyContent, setReplyContent] = useState('');

  // Filter topics
  const filteredTopics = topics.filter(t => {
    const matchesCategory = selectedCategory === 'Todos' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Solo el Administrador de la liga está autorizado para crear nuevos temas en el foro.');
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) return;

    if (ADMIN_ONLY_CATEGORIES.includes(newCategory) && !isAdmin) {
      alert(`La categoría "${newCategory}" es exclusiva para Administradores de la liga.`);
      return;
    }

    const topic: ForumTopic = {
      id: `topic-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      authorName: currentClub ? currentClub.manager : 'Manager_Anon',
      authorClub: currentClub ? currentClub.name : 'Libre',
      authorAvatar: currentClub ? currentClub.logoUrl : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      content: newContent,
      createdAt: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
      views: 1,
      likes: 0,
      replies: []
    };

    onCreateTopic(topic);
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || !replyContent.trim()) return;

    const reply: ForumReply = {
      id: `reply-${Date.now()}`,
      authorName: currentClub ? currentClub.manager : 'Manager_Anon',
      authorClub: currentClub ? currentClub.name : 'Libre',
      authorAvatar: currentClub ? currentClub.logoUrl : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      content: replyContent,
      createdAt: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
      likes: 0
    };

    onAddReply(activeTopic.id, reply);

    // Update local active topic view state
    setActiveTopic(prev => prev ? {
      ...prev,
      replies: [...prev.replies, reply]
    } : null);

    setReplyContent('');
  };

  return (
    <div className="space-y-6">
      {/* Detail View of a Topic */}
      {activeTopic ? (
        <div className="space-y-6 animate-fade-in">
          {/* Back Button */}
          <button
            onClick={() => setActiveTopic(null)}
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-tech font-bold text-sm uppercase"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al foro de temas
          </button>

          {/* Main Topic Card */}
          <div className="fc-card p-6 rounded-2xl border-slate-200 shadow-md space-y-6">
            {/* Banner Oficial si el tema coincide con secciones reglamentarias */}
            {activeTopic.title.toLowerCase().includes('normas') && (
              <div className="relative rounded-xl p-5 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white border border-blue-500/40 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-blue-300">
                    <Scale className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-extrabold uppercase rounded font-tech">
                      REGLAMENTO OFICIAL
                    </span>
                    <h2 className="font-display font-black text-xl text-white uppercase italic tracking-wide">
                      Normas Oficiales de Competición
                    </h2>
                  </div>
                </div>
              </div>
            )}

            {activeTopic.title.toLowerCase().includes('ganancia') && (
              <div className="relative rounded-xl p-5 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white border border-amber-500/40 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-600/30 border border-amber-400/50 flex items-center justify-center text-amber-300">
                    <Coins className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-extrabold uppercase rounded font-tech">
                      ECONOMÍA DE LIGA
                    </span>
                    <h2 className="font-display font-black text-xl text-white uppercase italic tracking-wide">
                      Ganancias y Premios de Competición
                    </h2>
                  </div>
                </div>
              </div>
            )}

            {activeTopic.title.toLowerCase().includes('sancion') && (
              <div className="relative rounded-xl p-5 bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 text-white border border-rose-500/40 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-600/30 border border-rose-400/50 flex items-center justify-center text-rose-300">
                    <Gavel className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-rose-600 text-white text-[9px] font-extrabold uppercase rounded font-tech">
                      DISCIPLINA DEPORTIVA
                    </span>
                    <h2 className="font-display font-black text-xl text-white uppercase italic tracking-wide">
                      Código Disciplinario y Sanciones
                    </h2>
                  </div>
                </div>
              </div>
            )}

            {activeTopic.title.toLowerCase().includes('apuesta') && (
              <div className="relative rounded-xl p-5 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white border border-purple-500/40 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300">
                    <Dice5 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 bg-purple-600 text-white text-[9px] font-extrabold uppercase rounded font-tech">
                      CASA DE APUESTAS
                    </span>
                    <h2 className="font-display font-black text-xl text-white uppercase italic tracking-wide">
                      Reglamento de Apuestas Deportivas
                    </h2>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <span className={`px-3 py-1 rounded text-xs font-bold font-tech uppercase ${
                activeTopic.category === 'Anuncios' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                activeTopic.category === 'Resultados' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                activeTopic.category === 'Fichajes' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                'bg-blue-100 text-blue-800 border border-blue-300'
              }`}>
                {activeTopic.category}
              </span>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {activeTopic.createdAt}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-400" /> {activeTopic.views} vistas</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <h1 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 tracking-wide">
                {activeTopic.title}
              </h1>
              {(isAdmin || (activeTopic.category !== 'Anuncios' && currentClub && activeTopic.authorName === currentClub.manager)) && (
                <button
                  onClick={() => {
                    setTopicToEdit(activeTopic);
                    setEditTitle(activeTopic.title);
                    setEditContent(activeTopic.content);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-tech font-bold uppercase flex items-center gap-1.5 border border-slate-200 transition-colors shrink-0"
                >
                  <Edit3 className="w-4 h-4 text-emerald-600" /> Editar Título / Contenido
                </button>
              )}
            </div>

            {/* Author Profile Bar */}
            <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <img src={activeTopic.authorAvatar} alt={activeTopic.authorName} className="w-10 h-10 rounded-full object-cover border-2 border-[#00ba68]" />
                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    {activeTopic.authorName}
                    <span className="text-[10px] bg-slate-200 text-slate-800 font-mono px-2 py-0.5 rounded">
                      {activeTopic.authorClub}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-tech">Manager de la Liga FC 27</span>
                </div>
              </div>
            </div>

            {/* Main Topic Body Content */}
            <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-sans">
              {activeTopic.content}
            </div>

            {/* Si el tema trata sobre Inscripciones, renderizar la lista completa de Equipos Inscritos */}
            {(activeTopic.title.toLowerCase().includes('inscripc') || activeTopic.content.toLowerCase().includes('inscripc')) && registeredClubs && registeredClubs.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-emerald-200 shadow-sm space-y-4 mt-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#00ba68] text-white flex items-center justify-center font-bold">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-base text-slate-900 uppercase italic">
                        Equipos Inscritos Oficiales ({registeredClubs.length})
                      </h3>
                      <p className="text-[11px] text-slate-500 font-tech">
                        Lista oficial actualizada en vivo para la temporada FC 27
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-black rounded-full border border-emerald-300">
                    {registeredClubs.length} / 36 Clubs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {registeredClubs.map((club) => (
                    <div
                      key={club.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3 hover:border-emerald-400 transition-all shadow-xs"
                    >
                      <img
                        src={club.logoUrl || club.badgeUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80'}
                        alt={club.name}
                        className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1 leading-tight">
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-xs text-slate-900 uppercase truncate">
                            {club.name || 'Por Asignar'}
                          </h4>
                          {club.platform && (
                            <span className="px-1 py-0.2 bg-emerald-100 text-emerald-800 text-[8px] font-black rounded font-mono shrink-0">
                              {club.platform}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-emerald-700 font-bold block truncate mt-0.5">
                          👤 {club.manager}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                          {club.gamertag || '@' + club.manager}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Topic Image Attachment */}
            {activeTopic.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-[500px] flex items-center justify-center">
                <img src={activeTopic.imageUrl} alt="Adjunto del tema" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          {/* Replies Thread */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xl uppercase tracking-wide text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00ba68]" /> Respuestas de los Managers ({activeTopic.replies.length})
            </h3>

            {activeTopic.replies.map((reply) => (
              <div key={reply.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2.5">
                    <img src={reply.authorAvatar} alt={reply.authorName} className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                    <div>
                      <span className="font-bold text-xs text-slate-900">{reply.authorName}</span>
                      <span className="text-[10px] text-emerald-700 font-mono ml-2">({reply.authorClub})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{reply.createdAt}</span>
                    {(isAdmin || (currentClub && reply.authorName === currentClub.manager)) && (
                      <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                        {onEditReply && (
                          <button
                            onClick={() => {
                              setReplyToEdit(reply);
                              setEditReplyContent(reply.content);
                            }}
                            className="p-1 rounded bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors"
                            title="Editar respuesta"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteReply && (
                          <button
                            onClick={() => setReplyToDelete(reply)}
                            className="p-1 rounded bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Eliminar respuesta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{reply.content}</p>
                {reply.imageUrl && (
                  <div className="rounded-lg overflow-hidden border border-slate-200 max-h-80 bg-slate-900 mt-2">
                    <img src={reply.imageUrl} alt="Adjunto de respuesta" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="fc-card p-5 rounded-2xl border-slate-200 space-y-4">
              <h4 className="font-display font-bold text-base uppercase text-slate-900 flex items-center gap-2">
                <CornerDownRight className="w-4 h-4 text-[#00ba68]" /> Responder como {currentClub ? currentClub.manager : 'Manager'}
              </h4>

              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta al tema, análisis o propuesta de partido..."
                rows={3}
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="fc-button-primary px-5 py-2.5 text-xs uppercase"
                >
                  Publicar Respuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Forum Overview / List of Topics */
        <div className="space-y-6">
          {/* Forum Header Banner */}
          <div className="relative rounded-2xl overflow-hidden p-6 md:p-8 border border-emerald-300 bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white shadow-xl">
            <div className="relative z-10 max-w-3xl space-y-3">
              <span className="px-2.5 py-1 bg-[#02f59b] text-black text-[10px] font-bold font-tech uppercase rounded tracking-wider">
                Foro Oficial FIFAMANIAKOS FC 27
              </span>
              <h1 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-wide leading-none italic">
                Comunidad, Debates & Fichajes
              </h1>
              <p className="text-xs text-emerald-100 font-sans leading-relaxed">
                El punto de encuentro oficial de los managers de FC 27. Publica tus análisis, coordina partidos, negocia traspasos y comparte capturas de tus victorias.
              </p>

              {isAdmin && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="fc-button-primary px-5 py-2.5 text-xs font-bold uppercase flex items-center gap-2 mt-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Crear Nuevo Tema
                </button>
              )}
            </div>
          </div>

          {/* Controls: Category Filter + Search */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-tech font-bold uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-[#00ba68] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar temas, palabras clave o autor..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
              />
            </div>
          </div>



          {/* Topics List */}
          <div className="space-y-3">
            {filteredTopics.map(topic => (
              <div
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className="fc-card fc-card-hover p-4 rounded-2xl cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-slate-200"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <img src={topic.authorAvatar} alt={topic.authorName} className="w-10 h-10 rounded-full object-cover border border-[#00ba68] shrink-0 mt-1 md:mt-0" />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {topic.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-bold font-tech uppercase px-2 py-0.5 rounded border border-amber-300">
                          <Pin className="w-3 h-3" /> Fijado
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-tech uppercase ${
                        topic.category === 'Anuncios' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        topic.category === 'Resultados' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        topic.category === 'Fichajes' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                        'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {topic.category}
                      </span>
                      {topic.imageUrl && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
                          <ImageIcon className="w-3 h-3" /> Imagen
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-lg text-slate-900 hover:text-[#00ba68] transition-colors truncate">
                      {topic.title}
                    </h3>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-tech">
                      <span>Por <strong className="text-slate-800">{topic.authorName}</strong> ({topic.authorClub})</span>
                      <span>•</span>
                      <span>{topic.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Topic Stats & Admin Actions */}
                <div className="flex items-center gap-3 text-xs font-mono text-slate-600 shrink-0 self-end md:self-center border-t md:border-t-0 border-slate-200 pt-2 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> {topic.replies.length}
                  </span>
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Eye className="w-3.5 h-3.5 text-slate-400" /> {topic.views}
                  </span>

                  {(isAdmin || (topic.category !== 'Anuncios' && currentClub && topic.authorName === currentClub.manager)) && (
                    <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTopicToEdit(topic);
                          setEditTitle(topic.title);
                          setEditContent(topic.content);
                        }}
                        className="p-1.5 rounded bg-slate-100 text-slate-500 hover:text-emerald-600 transition-colors"
                        title="Editar título o contenido"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {isAdmin && onTogglePinTopic && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePinTopic(topic.id);
                          }}
                          className={`p-1.5 rounded transition-colors ${
                            topic.isPinned ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 hover:text-amber-600'
                          }`}
                          title={topic.isPinned ? 'Desfijar' : 'Fijar'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {(isAdmin || (topic.category !== 'Anuncios' && currentClub && topic.authorName === currentClub.manager)) && onDeleteTopic && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTopicToDelete(topic);
                          }}
                          className="p-1.5 rounded bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar tema"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredTopics.length === 0 && (
              <div className="text-center py-12 fc-card rounded-2xl">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-tech">No se encontraron temas en esta categoría.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Crear Nuevo Tema */}
      {showCreateModal && isAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-xl w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <Plus className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide flex items-center gap-2">
                    <span className="text-[#00ba68]">+</span> CREAR NUEVO TEMA EN EL FORO
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">Publica tu mensaje en la comunidad del Foro</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5">
                  TÍTULO DEL TEMA *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: [OFICIAL] Propuesta de amistosos para el fin de semana"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5">
                  CATEGORÍA *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ForumCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] transition"
                >
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat} {ADMIN_ONLY_CATEGORIES.includes(cat) ? '🔒 (Solo Admin)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5">
                  CONTENIDO DEL MENSAJE *
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={5}
                  placeholder="Escribe el mensaje completo de tu publicación..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition"
                >
                  PUBLICAR TEMA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación Tema */}
      {topicToDelete && (
        <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-rose-300 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900 uppercase">¿Eliminar Tema?</h3>
                <p className="text-xs text-slate-500 font-tech">Esta acción es permanente y no se podrá deshacer.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-800 font-tech">"{topicToDelete.title}"</p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Publicado por {topicToDelete.authorName} • {topicToDelete.replies.length} respuestas
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTopicToDelete(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-xl hover:bg-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteTopic) {
                    onDeleteTopic(topicToDelete.id);
                  }
                  if (activeTopic?.id === topicToDelete.id) {
                    setActiveTopic(null);
                  }
                  setTopicToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-tech font-extrabold uppercase rounded-xl shadow-md transition-colors"
              >
                Sí, Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Editar Tema */}
      {topicToEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-xl w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <Edit3 className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Editar Tema del Foro
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">Modifica el título o contenido de tu publicación</p>
                </div>
              </div>
              <button
                onClick={() => setTopicToEdit(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editTitle.trim() || !editContent.trim()) return;
              if (onEditTopic) {
                onEditTopic(topicToEdit.id, editTitle.trim(), editContent.trim());
              }
              if (activeTopic?.id === topicToEdit.id) {
                setActiveTopic(prev => prev ? { ...prev, title: editTitle.trim(), content: editContent.trim() } : null);
              }
              setTopicToEdit(null);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5">
                  TÍTULO DEL TEMA *
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5">
                  CONTENIDO DEL MENSAJE *
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={6}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTopicToEdit(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> GUARDAR CAMBIOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación Respuesta */}
      {replyToDelete && (
        <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-rose-300 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900 uppercase">¿Eliminar Respuesta?</h3>
                <p className="text-xs text-slate-500 font-tech">Esta acción es permanente y no se podrá deshacer.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-700 line-clamp-3">"{replyToDelete.content}"</p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Publicado por {replyToDelete.authorName}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReplyToDelete(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-xl hover:bg-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeTopic && onDeleteReply) {
                    onDeleteReply(activeTopic.id, replyToDelete.id);
                    setActiveTopic(prev => prev ? {
                      ...prev,
                      replies: prev.replies.filter(r => r.id !== replyToDelete.id)
                    } : null);
                  }
                  setReplyToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-tech font-extrabold uppercase rounded-xl shadow-md transition-colors"
              >
                Sí, Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Respuesta */}
      {replyToEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-xl w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <Edit3 className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Editar Respuesta
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">Modifica el contenido de la respuesta</p>
                </div>
              </div>
              <button
                onClick={() => setReplyToEdit(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!editReplyContent.trim() || !activeTopic) return;
              if (onEditReply) {
                onEditReply(activeTopic.id, replyToEdit.id, editReplyContent.trim());
              }
              setActiveTopic(prev => prev ? {
                ...prev,
                replies: prev.replies.map(r => r.id === replyToEdit.id ? { ...r, content: editReplyContent.trim() } : r)
              } : null);
              setReplyToEdit(null);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5">
                  CONTENIDO DE LA RESPUESTA *
                </label>
                <textarea
                  value={editReplyContent}
                  onChange={(e) => setEditReplyContent(e.target.value)}
                  rows={5}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReplyToEdit(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> GUARDAR CAMBIOS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
