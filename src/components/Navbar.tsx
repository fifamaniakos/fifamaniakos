import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MessageSquare, Trophy, Shield, DollarSign, UserPlus, FileSpreadsheet, PlusCircle, ShieldCheck, Megaphone, LogOut, Users, Shuffle, ChevronDown, Wallet, Scale, Coins, Gavel, Dice5 } from 'lucide-react';
import { Club, TickerNewsItem, ForumSectionTag } from '../types';



interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentClub: Club | null;
  onOpenRegister: () => void;
  clubs: Club[];
  onSelectClub: (clubId: string) => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onLogoutAdmin?: () => void;
  tickerNews: TickerNewsItem[];
  onAddNewsItem?: (text: string) => void;
  onOpenForumSection: (sectionTag: ForumSectionTag) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentClub,
  onOpenRegister,
  clubs,
  onSelectClub,
  isAdmin,
  onOpenAdminLogin,
  onLogoutAdmin,
  tickerNews,
  onAddNewsItem,
  onOpenForumSection
}) => {
  const [quickNewsInput, setQuickNewsInput] = useState('');
  const [showQuickNewsModal, setShowQuickNewsModal] = useState(false);
  const [showCompeticionesMenu, setShowCompeticionesMenu] = useState(false);
  const [competicionesMenuPos, setCompeticionesMenuPos] = useState({ top: 0, left: 0 });
  const competicionesButtonRef = useRef<HTMLButtonElement>(null);

  const [showMiClubMenu, setShowMiClubMenu] = useState(false);
  const [miClubMenuPos, setMiClubMenuPos] = useState({ top: 0, left: 0 });
  const miClubButtonRef = useRef<HTMLButtonElement>(null);

  const toggleCompeticionesMenu = () => {
    if (!showCompeticionesMenu && competicionesButtonRef.current) {
      const rect = competicionesButtonRef.current.getBoundingClientRect();
      setCompeticionesMenuPos({ top: rect.bottom + 6, left: rect.left });
    }
    setShowCompeticionesMenu(prev => !prev);
    setShowMiClubMenu(false);
  };

  const toggleMiClubMenu = () => {
    if (!showMiClubMenu && miClubButtonRef.current) {
      const rect = miClubButtonRef.current.getBoundingClientRect();
      setMiClubMenuPos({ top: rect.bottom + 6, left: rect.left });
    }
    setShowMiClubMenu(prev => !prev);
    setShowCompeticionesMenu(false);
  };

  const forumSections: { tag: ForumSectionTag; label: string }[] = [
    { tag: 'normas', label: 'Normas competiciones' },
    { tag: 'ganancias', label: 'Ganancias competiciones' },
    { tag: 'sanciones', label: 'Sanciones' },
    { tag: 'apuestas', label: 'Apuestas deportivas' }
  ];

  const isCompeticionesActive = activeTab === 'clasificacion' || activeTab === 'fichajes' || activeTab === 'sorteo' || activeTab === 'competicion-seccion';

  const activeNews = tickerNews.filter(n => n.active);

  const handleQuickAddNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickNewsInput.trim() && onAddNewsItem) {
      onAddNewsItem(quickNewsInput.trim());
      setQuickNewsInput('');
      setShowQuickNewsModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Ticker Bar with Moving Cartel / Marquee */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-emerald-100 py-1.5 px-4 sm:px-6 md:px-8 lg:px-10 text-[11px] font-tech flex justify-between items-center border-b border-emerald-800/80">
        <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
          <span className="px-2.5 py-0.5 bg-[#00ba68] text-white font-extrabold uppercase rounded text-[9px] tracking-wider shadow-sm shrink-0 flex items-center gap-1">
            <Megaphone className="w-3 h-3 text-white animate-pulse" />
            CARTEL DE NOTICIAS
          </span>

          {/* Scrolling Marquee Container */}
          <div className="overflow-hidden relative w-full flex items-center py-0.5">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-semibold text-emerald-200">
              {activeNews.length > 0 ? (
                // Duplicate items to make seamless marquee wrap
                [...activeNews, ...activeNews, ...activeNews].map((news, idx) => (
                  <span key={`${news.id}-${idx}`} className="inline-flex items-center gap-2">
                    <span className="text-[#02f59b] font-bold">•</span>
                    <span>{news.text}</span>
                  </span>
                ))
              ) : (
                <span className="text-slate-400">🔥 Liga Oficial FIFAMANIAKOS FC 27 • Mercado de Fichajes y Resultados en Vivo</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Status / Admin Connection Indicator */}
        <div className="hidden md:flex items-center gap-3 shrink-0 text-xs">
          {isAdmin ? (
            <div className="flex items-center gap-2 bg-emerald-950 border border-emerald-500/60 px-2.5 py-0.5 rounded-lg text-[10px] shadow-[0_0_10px_rgba(2,245,155,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[#02f59b] animate-ping" />
              <span className="text-[#02f59b] font-bold uppercase tracking-wide">
                ADMIN CONECTADO
              </span>
              <div className="flex items-center gap-1 pl-2 border-l border-emerald-800">
                {onAddNewsItem && (
                  <button
                    onClick={() => setShowQuickNewsModal(true)}
                    className="px-2 py-0.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[9px] font-bold uppercase transition-colors"
                    title="Agregar noticia al cartel"
                  >
                    + Noticias
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-2 py-0.5 bg-[#00ba68] hover:bg-emerald-600 text-white rounded text-[9px] font-bold uppercase transition-colors"
                >
                  Panel
                </button>
                {onLogoutAdmin && (
                  <button
                    onClick={onLogoutAdmin}
                    className="text-slate-400 hover:text-rose-400 p-0.5 transition-colors"
                    title="Cerrar sesión de administrador"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white rounded border border-emerald-700/50 text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00ba68]" />
              Acceso Admin
            </button>
          )}

        </div>
      </div>

      {/* Main Navigation - Full Width */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center justify-between">
          <div 
            onClick={() => setActiveTab('foro')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* EA Sports Triangular FC Badge */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#00ba68] to-emerald-900 text-white flex items-center justify-center font-display font-black text-xl italic tracking-tighter fc-badge-triangle shadow-md group-hover:scale-105 transition-transform">
              FMK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl uppercase tracking-wider text-slate-900 italic">
                  FIFA<span className="text-[#00ba68]">MANIAKOS</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.5 rounded border border-emerald-300 font-bold">
                  FC 27
                </span>
                {isAdmin && (
                  <span className="text-[9px] bg-emerald-800 text-[#02f59b] font-tech font-bold px-1.5 py-0.5 rounded border border-emerald-600 uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#02f59b]" /> Mode Admin
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-tech tracking-wider -mt-1 flex items-center gap-1.5 flex-wrap">
                <span className="uppercase">Liga Online, Resultados & Fichajes</span>
              </p>
            </div>
          </div>

          {/* Mobile Register CTA */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenRegister}
              className="p-2 bg-[#00ba68] text-white rounded font-tech font-bold text-xs uppercase flex items-center gap-1"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 font-display text-xs md:text-sm uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('foro')}
            className={`h-10 px-4 min-w-[130px] rounded-lg transition-all flex items-center justify-center gap-1.5 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'foro'
                ? 'bg-[#00ba68] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            Foro
          </button>

          <div className="relative shrink-0">
            <button
              ref={competicionesButtonRef}
              onClick={toggleCompeticionesMenu}
              className={`h-10 px-4 min-w-[130px] rounded-lg transition-all flex items-center justify-center gap-1.5 font-bold whitespace-nowrap ${
                isCompeticionesActive
                  ? 'bg-[#00ba68] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-4 h-4 shrink-0" />
              Competiciones
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${showCompeticionesMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showCompeticionesMenu && createPortal(
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowCompeticionesMenu(false)} />
              <div
                style={{ top: competicionesMenuPos.top, left: competicionesMenuPos.left }}
                className="fixed w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1.5 normal-case tracking-normal font-display text-xs md:text-sm max-h-[70vh] overflow-y-auto"
              >
                <button
                  onClick={() => { setActiveTab('clasificacion'); setShowCompeticionesMenu(false); }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-bold flex items-center gap-2.5 transition-colors ${
                    activeTab === 'clasificacion' ? 'bg-emerald-50 text-[#00ba68]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Trophy className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Tabla de Posiciones</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => { onOpenForumSection('normas'); setShowCompeticionesMenu(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs font-bold flex items-center gap-2.5 transition-colors text-slate-700 hover:bg-slate-50"
                >
                  <Scale className="w-4 h-4 shrink-0 text-blue-500" />
                  <span>Normas competiciones</span>
                </button>

                <button
                  onClick={() => { onOpenForumSection('ganancias'); setShowCompeticionesMenu(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs font-bold flex items-center gap-2.5 transition-colors text-slate-700 hover:bg-slate-50"
                >
                  <Coins className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>Ganancias competiciones</span>
                </button>

                <button
                  onClick={() => { onOpenForumSection('sanciones'); setShowCompeticionesMenu(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs font-bold flex items-center gap-2.5 transition-colors text-slate-700 hover:bg-slate-50"
                >
                  <Gavel className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>Sanciones</span>
                </button>

                <button
                  onClick={() => { onOpenForumSection('apuestas'); setShowCompeticionesMenu(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs font-bold flex items-center gap-2.5 transition-colors text-slate-700 hover:bg-slate-50"
                >
                  <Dice5 className="w-4 h-4 shrink-0 text-purple-500" />
                  <span>Apuestas deportivas</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => { setActiveTab('fichajes'); setShowCompeticionesMenu(false); }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-bold flex items-center gap-2.5 transition-colors ${
                    activeTab === 'fichajes' ? 'bg-emerald-50 text-[#00ba68]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <DollarSign className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Mercado de Fichajes</span>
                </button>

                <button
                  onClick={() => { setActiveTab('sorteo'); setShowCompeticionesMenu(false); }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-bold flex items-center gap-2.5 transition-colors ${
                    activeTab === 'sorteo' ? 'bg-emerald-50 text-[#00ba68]' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Shuffle className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>Sorteo Draft</span>
                </button>
              </div>
            </>,
            document.body
          )}

          <button
            onClick={() => setActiveTab('reportar')}
            className={`h-10 px-4 min-w-[130px] rounded-lg transition-all flex items-center justify-center gap-1.5 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'reportar'
                ? 'bg-[#00ba68] text-[#ffffff] shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            Resultados
          </button>

          {/* Pestaña 'Mi Club' con Portal Desplegable de Equipos */}
          <div className="relative shrink-0">
            <button
              ref={miClubButtonRef}
              onClick={() => {
                toggleMiClubMenu();
              }}
              className={`h-10 px-4 min-w-[130px] rounded-lg transition-all flex items-center justify-center gap-1.5 font-bold whitespace-nowrap shrink-0 ${
                activeTab === 'plantilla'
                  ? 'bg-[#00ba68] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Mi Club</span>
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${showMiClubMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showMiClubMenu && createPortal(
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMiClubMenu(false)} />
              <div
                style={{ top: miClubMenuPos.top, left: miClubMenuPos.left }}
                className="fixed w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 py-2 normal-case tracking-normal font-display text-xs md:text-sm max-h-[70vh] overflow-y-auto divide-y divide-slate-100 p-1.5 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase mb-1">
                  Seleccionar Club Activo ({clubs.length})
                </div>
                {clubs.map(club => {
                  const isSelected = club.id === currentClub?.id;
                  return (
                    <div
                      key={club.id}
                      onClick={() => {
                        onSelectClub(club.id);
                        setActiveTab('plantilla');
                        setShowMiClubMenu(false);
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={club.logoUrl || club.badgeUrl}
                          alt={club.name}
                          className="w-7 h-7 object-contain rounded-full bg-white p-0.5 border border-slate-200 shrink-0"
                        />
                        <div className="leading-tight">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold uppercase">{club.name}</span>
                            {club.platform && (
                              <span className="px-1 py-0.2 bg-slate-200 text-slate-700 text-[8px] font-black rounded font-mono">
                                {club.platform}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            ${((club.budget || 0) / 1000000).toFixed(1)}M • <span className="text-emerald-700 font-bold">@{club.manager}</span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#00ba68] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </>,
            document.body
          )}

          <button
            onClick={() => setActiveTab('tienda')}
            className={`h-10 px-4 min-w-[130px] rounded-lg transition-all flex items-center justify-center gap-1.5 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'tienda'
                ? 'bg-[#00ba68] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Wallet className="w-4 h-4 shrink-0 text-amber-500" />
            Tienda
          </button>

        </nav>

        {/* Registration Button */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={onOpenRegister}
            className="h-10 px-4 bg-[#00ba68] hover:bg-[#00d282] text-white text-xs font-display font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-lg shadow transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Inscribir Club
          </button>
        </div>
      </div>

      {/* Quick Add News Modal for Admin */}
      {showQuickNewsModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="fc-card max-w-lg w-full p-6 rounded-2xl border-emerald-300 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-display font-black text-lg text-slate-900 uppercase italic flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#00ba68]" /> Agregar Noticia al Cartel en Movimiento
              </h3>
              <button onClick={() => setShowQuickNewsModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleQuickAddNewsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase font-tech mb-1">
                  Texto de la Noticia o Anuncio
                </label>
                <textarea
                  value={quickNewsInput}
                  onChange={(e) => setQuickNewsInput(e.target.value)}
                  placeholder="Ej: 🔥 ¡Inscripciones abiertas para la Copa del Rey FIFAMANIAKOS!"
                  rows={3}
                  required
                  autoFocus
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00ba68]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickNewsModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-5 py-2 text-xs font-extrabold uppercase shadow"
                >
                  Publicar en Cartel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

