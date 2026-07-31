import React, { useState, useMemo } from 'react';
import { ClubLogo } from './ClubLogo';
import { Club, Player, TransferItem, FinancialTransaction } from '../types';
import { SOFIFA_PLAYERS, SoFifaPlayerPreset } from '../data/sofifaData';
import { SofifaPlayersExplorer } from './SofifaPlayersExplorer';
import { DollarSign, ShoppingBag, Tag, Shield, Search, ArrowRight, Wallet, RefreshCw, AlertCircle, Sparkles, UserPlus, Edit3, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TransferMarketProps {
  currentClub: Club | null;
  clubs: Club[];
  transfers: TransferItem[];
  transactions: FinancialTransaction[];
  onBuyPlayer: (transfer: TransferItem, buyerClub: Club) => void;
  onListPlayerForSale: (player: Player, price: number) => void;
  onCancelTransfer?: (transferId: string) => void;
  onUpdateTransferClause?: (transferId: string, newAskingPrice: number) => void;
  onDirectTransferPlayer: (player: Player, buyerClub: Club, sellerClub: Club, price: number) => void;
  onSignSofifaPlayer?: (playerPreset: SoFifaPlayerPreset, buyerClub: Club, price: number) => void;
  onPopulateClubWithSofifa?: (targetClub: Club) => void;
  players: Player[];
}

export const TransferMarket: React.FC<TransferMarketProps> = ({
  currentClub,
  clubs,
  transfers,
  onBuyPlayer,
  onListPlayerForSale,
  onCancelTransfer,
  onUpdateTransferClause,
  onDirectTransferPlayer,
  onSignSofifaPlayer,
  onPopulateClubWithSofifa,
  players
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'libres' | 'comprar' | 'mercado'>('libres');

  // Modals state
  const [showListModal, setShowListModal] = useState(false);
  const [selectedPlayerForSaleId, setSelectedPlayerForSaleId] = useState('');
  const [askingPrice, setAskingPrice] = useState(30000000);

  // Edit Transfer Clause Modal state
  const [selectedEditClauseTransfer, setSelectedEditClauseTransfer] = useState<TransferItem | null>(null);
  const [newClausePrice, setNewClausePrice] = useState<number>(30000000);

  // Direct transfer modal state
  const [selectedPlayerForDirectBuy, setSelectedPlayerForDirectBuy] = useState<Player | null>(null);
  const [directBuyerClubId, setDirectBuyerClubId] = useState<string>(currentClub?.id || '');
  const [directTransferPrice, setDirectTransferPrice] = useState<number>(0);

  // Free agent Sign Modal state
  const [selectedSofifaPreset, setSelectedSofifaPreset] = useState<SoFifaPlayerPreset | null>(null);
  const [sofifaBuyerClubId, setSofifaBuyerClubId] = useState<string>(currentClub?.id || '');
  const [sofifaSignPrice, setSofifaSignPrice] = useState<number>(0);

  // Market Clause Buy Modal State
  const [selectedMarketTransfer, setSelectedMarketTransfer] = useState<TransferItem | null>(null);
  const [marketBuyerClubId, setMarketBuyerClubId] = useState<string>(currentClub?.id || '');

  // Filters for SOFIFA Buscador
  const [sofifaSearch, setSofifaSearch] = useState('');
  const [sofifaPosFilter, setSofifaPosFilter] = useState('ALL');
  const [sofifaClubFilter, setSofifaClubFilter] = useState('ALL');

  // Filters for Comprar Jugador de Club
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubFilter, setSelectedClubFilter] = useState<string>('ALL');
  const [selectedPosFilter, setSelectedPosFilter] = useState<string>('ALL');

  if (!currentClub) {
    return (
      <div className="p-8 text-center fc-card rounded-xl">
        <DollarSign className="w-12 h-12 text-[#00ba68] mx-auto mb-3" />
        <h2 className="font-display font-bold text-2xl text-slate-900">Selecciona o Inscribe un Club</h2>
        <p className="text-xs text-slate-500 mt-1">Debes tener un club asignado para operar en el Mercado de Fichajes.</p>
      </div>
    );
  }

  const myClubPlayers = players.filter(p => p.clubId === currentClub.id);

  // SOFIFA Buy Modal Trigger
  const openSofifaBuyModal = (preset: SoFifaPlayerPreset) => {
    setSelectedSofifaPreset(preset);
    setSofifaBuyerClubId(currentClub.id);
    setSofifaSignPrice(preset.value);
  };

  const handleConfirmSofifaSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSofifaPreset) return;

    const buyerClub = clubs.find(c => c.id === sofifaBuyerClubId);
    if (!buyerClub) {
      alert('Selecciona un club comprador válido.');
      return;
    }

    if (buyerClub.budget < sofifaSignPrice) {
      alert(`Presupuesto insuficiente. El saldo del ${buyerClub.name} es $${(buyerClub.budget / 1000000).toFixed(1)}M y el precio es $${(sofifaSignPrice / 1000000).toFixed(1)}M.`);
      return;
    }

    const newPlayer: Player = {
      id: `pl-sofifa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      clubId: buyerClub.id,
      name: selectedSofifaPreset.name,
      position: selectedSofifaPreset.position,
      rating: selectedSofifaPreset.rating,
      cardType: selectedSofifaPreset.cardType || 'Gold',
      value: sofifaSignPrice,
      photoUrl: selectedSofifaPreset.photoUrl,
      stats: selectedSofifaPreset.stats,
      isStarter: false
    };

    if (onSignSofifaPlayer) {
      onSignSofifaPlayer(selectedSofifaPreset, buyerClub, sofifaSignPrice);
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    alert(`¡Fichaje completado! ${selectedSofifaPreset.name} ahora forma parte del ${buyerClub.name}. Se han descontado $${(sofifaSignPrice / 1000000).toFixed(1)}M del presupuesto.`);

    setSelectedSofifaPreset(null);
  };

  // Direct buy handler setup
  const openDirectBuyModal = (player: Player) => {
    setSelectedPlayerForDirectBuy(player);
    setDirectBuyerClubId(currentClub.id);
    setDirectTransferPrice(player.value || 25000000);
  };

  const handleConfirmDirectBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerForDirectBuy) return;

    const buyerClub = clubs.find(c => c.id === directBuyerClubId);
    const sellerClub = clubs.find(c => c.id === selectedPlayerForDirectBuy.clubId);

    if (!buyerClub || !sellerClub) {
      alert('Error al identificar los equipos involucrados.');
      return;
    }

    if (buyerClub.id === sellerClub.id) {
      alert('El equipo comprador y el equipo vendedor no pueden ser el mismo.');
      return;
    }

    if (buyerClub.budget < directTransferPrice) {
      alert(`El presupuesto del ${buyerClub.name} (€${(buyerClub.budget / 1000000).toFixed(1)}M) es insuficiente para completar el fichaje de €${(directTransferPrice / 1000000).toFixed(1)}M.`);
      return;
    }

    onDirectTransferPlayer(selectedPlayerForDirectBuy, buyerClub, sellerClub, Number(directTransferPrice));

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });

    alert(`¡Traspaso realizado con éxito! ${selectedPlayerForDirectBuy.name} ha sido transferido del ${sellerClub.name} al ${buyerClub.name} por €${(directTransferPrice / 1000000).toFixed(1)}M.`);

    setSelectedPlayerForDirectBuy(null);
  };

  // List player for sale handler
  const handleListPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const playerToList = myClubPlayers.find(p => p.id === selectedPlayerForSaleId);
    if (!playerToList) return;

    onListPlayerForSale(playerToList, Number(askingPrice));
    setShowListModal(false);
    setSelectedPlayerForSaleId('');
  };

  // Edit Clause Handlers
  const openEditClauseModal = (transfer: TransferItem) => {
    setSelectedEditClauseTransfer(transfer);
    setNewClausePrice(transfer.askingPrice);
  };

  const handleConfirmEditClause = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEditClauseTransfer) return;

    if (onUpdateTransferClause) {
      onUpdateTransferClause(selectedEditClauseTransfer.id, Number(newClausePrice));
      alert(`¡Cláusula actualizada! La nueva cláusula para ${selectedEditClauseTransfer.player.name} es €${(Number(newClausePrice) / 1000000).toFixed(1)}M.`);
    }

    setSelectedEditClauseTransfer(null);
  };

  // Market Clause Buy Handlers
  const openMarketBuyModal = (transfer: TransferItem) => {
    setSelectedMarketTransfer(transfer);
    const defaultBuyer = transfer.sellerClubId === currentClub.id
      ? (clubs.find(c => c.id !== currentClub.id)?.id || '')
      : currentClub.id;
    setMarketBuyerClubId(defaultBuyer);
  };

  const handleConfirmMarketBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMarketTransfer) return;

    const buyerClub = clubs.find(c => c.id === marketBuyerClubId);
    if (!buyerClub) {
      alert('Selecciona un equipo comprador válido.');
      return;
    }

    if (buyerClub.id === selectedMarketTransfer.sellerClubId) {
      alert('El equipo vendedor y el equipo comprador no pueden ser el mismo.');
      return;
    }

    if (buyerClub.budget < selectedMarketTransfer.askingPrice) {
      alert(`El presupuesto del ${buyerClub.name} (€${(buyerClub.budget / 1000000).toFixed(1)}M) es insuficiente para pagar la cláusula de €${(selectedMarketTransfer.askingPrice / 1000000).toFixed(1)}M.`);
      return;
    }

    onBuyPlayer(selectedMarketTransfer, buyerClub);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    alert(`¡Fichaje completado por cláusula! ${selectedMarketTransfer.player.name} pasa a formar parte del ${buyerClub.name}.`);

    setSelectedMarketTransfer(null);
  };

  // Filtered SOFIFA Players
  const filteredSofifaPlayers = SOFIFA_PLAYERS.filter(sp => {
    if (sofifaPosFilter !== 'ALL' && sp.position !== sofifaPosFilter) return false;
    if (sofifaClubFilter !== 'ALL' && sp.clubName !== sofifaClubFilter) return false;
    if (sofifaSearch.trim()) {
      const q = sofifaSearch.toLowerCase().trim();
      return sp.name.toLowerCase().includes(q) || (sp.clubName && sp.clubName.toLowerCase().includes(q)) || sp.nationality.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtered clubs for "Traspasos entre Clubes"
  const visibleClubs = clubs.filter(c => selectedClubFilter === 'ALL' || c.id === selectedClubFilter);

  // Unique SOFIFA Club Names for filter
  const sofifaClubNames = Array.from(new Set(SOFIFA_PLAYERS.map(sp => sp.clubName).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header Budget Bar */}
      <div className="fc-card p-6 rounded-2xl border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#02f59b] to-[#00a362] rounded-2xl flex items-center justify-center text-black shadow-md shrink-0">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-tech font-bold uppercase text-slate-500">Presupuesto Disponible del Club</span>
            <h1 className="font-display font-black text-3xl text-emerald-600">
              €{(currentClub.budget / 1000000).toFixed(2)}M
            </h1>
            <span className="text-[11px] text-slate-500 font-mono">
              Club: <strong className="text-slate-800">{currentClub.name}</strong> • Manager: @{currentClub.manager}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => setActiveSubTab('libres')}
            className={`px-4 py-2.5 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-2 ${
              activeSubTab === 'libres'
                ? 'bg-[#00ba68] text-white shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Jugadores Libres / Base de Datos
          </button>

          <button
            onClick={() => setActiveSubTab('comprar')}
            className={`px-4 py-2.5 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-2 ${
              activeSubTab === 'comprar'
                ? 'bg-[#00ba68] text-white shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Traspasos entre Clubes
          </button>

          <button
            onClick={() => setActiveSubTab('mercado')}
            className={`px-4 py-2.5 rounded-xl font-display font-extrabold text-xs uppercase transition-all flex items-center gap-2 ${
              activeSubTab === 'mercado'
                ? 'bg-[#00ba68] text-white shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <RefreshCw className="w-4 h-4" /> Mercado de Cláusulas
          </button>

          <button
            onClick={() => setShowListModal(true)}
            className="fc-button-primary px-4 py-2.5 text-xs uppercase flex items-center gap-1.5 shadow-md"
          >
            <Tag className="w-4 h-4" /> Vender Jugador
          </button>
        </div>
      </div>

      {/* VIEW 1: BASE DE DATOS DE JUGADORES (VISTA EN FILAS/TABLA) */}
      {activeSubTab === 'libres' && (
        <div className="pt-2">
          <SofifaPlayersExplorer
            currentClub={currentClub}
            signedPlayers={players}
            onSignPlayer={(preset) => {
              if (currentClub) {
                onSignSofifaPlayer?.(preset, currentClub, preset.value);
              } else {
                alert('Selecciona un club en la barra superior para fichar este jugador.');
              }
            }}
          />
        </div>
      )}

      {/* VIEW 2: TRASPASOS DIRECTOS ENTRE CLUBES */}
      {activeSubTab === 'comprar' && (
        <div className="space-y-6">
          <div className="fc-card p-5 rounded-2xl border-slate-200 space-y-4 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900 uppercase italic tracking-wider flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" /> Plantillas de Equipos de la Liga
                </h2>
                <p className="text-xs text-slate-600">
                  Explora las plantillas de los clubes de la liga y realiza ofertas de compra directas por sus jugadores.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar jugador..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#00ba68] w-48 font-medium"
                  />
                </div>

                <select
                  value={selectedClubFilter}
                  onChange={(e) => setSelectedClubFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:border-[#00ba68]"
                >
                  <option value="ALL">Todos los Equipos ({clubs.length})</option>
                  {clubs.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={selectedPosFilter}
                  onChange={(e) => setSelectedPosFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:border-[#00ba68]"
                >
                  <option value="ALL">Todas las Posiciones</option>
                  <option value="POR">POR - Portero</option>
                  <option value="DFC">DFC - Defensa Central</option>
                  <option value="LI">LI - Lateral Izquierdo</option>
                  <option value="LD">LD - Lateral Derecho</option>
                  <option value="MCD">MCD - Mediocentro Defensivo</option>
                  <option value="MC">MC - Mediocentro</option>
                  <option value="MCO">MCO - Mediocentro Ofensivo</option>
                  <option value="EI">EI - Extremo Izquierdo</option>
                  <option value="ED">ED - Extremo Derecho</option>
                  <option value="DC">DC - Delantero Centro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Teams Roster Cards */}
          <div className="space-y-6">
            {visibleClubs.map(club => {
              const clubRoster = players.filter(p => {
                if (p.clubId !== club.id) return false;
                if (selectedPosFilter !== 'ALL' && p.position !== selectedPosFilter) return false;
                if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) return false;
                return true;
              });

              const isMyClub = club.id === currentClub.id;

              return (
                <div key={club.id} className="fc-card p-5 rounded-2xl border-slate-200 space-y-4 shadow-md bg-white">
                  {/* Team Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <ClubLogo src={club.logoUrl} alt={club.name} className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-extrabold text-lg text-slate-900 uppercase italic">{club.name}</h3>
                          {isMyClub && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 uppercase">
                              Tu Club
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-600 font-mono">
                          Manager: @{club.manager} • Presupuesto: €{(club.budget / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {clubRoster.length} Jugadores
                      </span>
                    </div>
                  </div>

                  {/* Players Grid or Empty Callout */}
                  {clubRoster.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {clubRoster.map(player => {
                        const transferItem = transfers.find(t => (t.player.id === player.id || t.player.name === player.name) && t.status === 'DISPONIBLE');

                        return (
                          <div
                            key={player.id}
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all group ${
                              transferItem
                                ? 'bg-amber-50/90 border-amber-300 hover:border-amber-500 shadow-xs'
                                : 'bg-slate-50 border-slate-200 hover:border-emerald-500'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-lg font-display font-black text-[10px] flex items-center justify-center shrink-0 border shadow-xs ${
                                transferItem
                                  ? 'bg-amber-400 text-slate-950 border-amber-500'
                                  : 'bg-slate-900 text-[#02f59b] border-slate-700'
                              }`}>
                                {player.position}
                              </div>

                              <div className="min-w-0">
                                <h4 className="font-display font-extrabold text-sm text-slate-900 truncate uppercase group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                                  <span>{player.name}</span>
                                </h4>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  <span className="text-[9px] bg-slate-900 text-[#02f59b] px-1.5 py-0.2 rounded font-bold font-mono">
                                    {player.position}
                                  </span>
                                  <span className="text-[10px] text-amber-700 font-mono font-bold">
                                    {player.rating} OVR
                                  </span>
                                  {transferItem && (
                                    <span className="text-[9px] bg-amber-400 text-slate-950 font-black uppercase px-1.5 py-0.5 rounded border border-amber-500 flex items-center gap-0.5 animate-pulse">
                                      <Tag className="w-2.5 h-2.5" /> EN VENTA
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {transferItem ? (
                                    <span className="text-[10px] text-amber-800 font-extrabold font-mono">
                                      Cláusula: €{(transferItem.askingPrice / 1000000).toFixed(1)}M
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-mono font-semibold">
                                      Sin Cláusula
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 flex flex-col gap-1 items-end">
                              {transferItem ? (
                                isMyClub ? (
                                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black uppercase font-mono px-2 py-1 rounded border border-amber-500">
                                    En Venta
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => openMarketBuyModal(transferItem)}
                                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] py-1.5 px-2.5 font-black uppercase rounded flex items-center gap-1 shadow border border-amber-600 transition-all scale-105"
                                  >
                                    <ShoppingBag className="w-3 h-3" /> Cláusula (€{(transferItem.askingPrice / 1000000).toFixed(1)}M)
                                  </button>
                                )
                              ) : isMyClub ? (
                                <span className="text-[9px] text-slate-500 uppercase font-mono font-bold px-2 py-1 bg-slate-200 rounded border border-slate-300">
                                  En Plantilla
                                </span>
                              ) : (
                                <button
                                  onClick={() => openDirectBuyModal(player)}
                                  className="fc-button-primary text-[10px] py-1.5 px-2.5 font-bold uppercase flex items-center gap-1 shadow"
                                >
                                  Fichar
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                      <p className="text-slate-600 text-xs font-tech italic">
                        Este equipo no tiene jugadores asignados actualmente en su plantilla.
                      </p>
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        {onPopulateClubWithSofifa && (
                          <button
                            onClick={() => onPopulateClubWithSofifa(club)}
                            className="px-3.5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 shadow-sm"
                          >
                            <Sparkles className="w-4 h-4" /> Cargar Plantilla Oficial
                          </button>
                        )}
                        <button
                          onClick={() => setActiveSubTab('libres')}
                          className="px-3.5 py-2 bg-slate-200 text-slate-800 hover:bg-slate-300 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 border border-slate-300"
                        >
                          <Search className="w-4 h-4 text-emerald-700" /> Buscar Jugadores Libres
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {visibleClubs.length === 0 && (
              <div className="p-12 text-center fc-card rounded-2xl">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 text-sm font-tech">No hay equipos registrados en la liga aún.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: MERCADO DE TRASPASOS (Puestos a la venta) */}
      {activeSubTab === 'mercado' && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-slate-900 uppercase italic tracking-wider flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-600" /> Jugadores Puestos a la Venta en el Mercado
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {transfers.filter(t => t.status === 'DISPONIBLE').map(transfer => {
              const sellerClub = clubs.find(c => c.id === transfer.sellerClubId);

              return (
                <div key={transfer.id} className="fc-card fc-card-hover p-5 rounded-2xl border-slate-200 space-y-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#02f59b] font-display font-black text-xs flex items-center justify-center shrink-0 border border-slate-700">
                        {transfer.player.position}
                      </div>
                      <div>
                        <span className="font-display font-black text-base text-slate-900 block leading-tight">
                          {transfer.player.name}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold font-mono border border-emerald-200">
                          {transfer.player.position} • {transfer.player.rating} OVR
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-tech block uppercase">Vendedor</span>
                      <span className="font-bold text-white">{sellerClub?.name || 'Club'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-tech block uppercase">Cláusula de Venta</span>
                      <span className="font-display font-black text-[#02f59b] text-lg">
                        €{(transfer.askingPrice / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => openMarketBuyModal(transfer)}
                      className="w-full py-2.5 rounded-lg font-display font-extrabold text-xs uppercase transition-all fc-button-primary flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {transfer.sellerClubId === currentClub.id ? 'Fichar con otro equipo' : `Fichar por €${(transfer.askingPrice / 1000000).toFixed(1)}M`}
                    </button>

                    {transfer.sellerClubId === currentClub.id && onCancelTransfer && (
                      <button
                        onClick={() => {
                          if (confirm(`¿Retirar a ${transfer.player.name} del mercado de fichajes?`)) {
                            onCancelTransfer(transfer.id);
                          }
                        }}
                        className="w-full py-2 px-3 rounded-lg font-display font-extrabold text-xs uppercase transition-all bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                      >
                        Retirar del Mercado
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {transfers.filter(t => t.status === 'DISPONIBLE').length === 0 && (
              <div className="col-span-full text-center py-12 fc-card rounded-xl">
                <Tag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 text-sm font-tech">No hay jugadores puestos a la venta actualmente.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Fichar Jugador de SOFIFA */}
      {selectedSofifaPreset && (() => {
        const buyerClub = clubs.find(c => c.id === sofifaBuyerClubId) || currentClub;
        const isBudgetValid = buyerClub ? buyerClub.budget >= sofifaSignPrice : false;

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative bg-white border border-slate-200 max-w-lg w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                    <Sparkles className="w-6 h-6 text-[#02f59b]" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                      Confirmar Fichaje
                    </h2>
                    <p className="text-xs text-slate-500 font-tech">Importar jugador oficial</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSofifaPreset(null)} 
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Player Card Preview in Modal */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-[#02f59b] font-display font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500">
                  {selectedSofifaPreset.position}
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-white uppercase leading-tight">
                    {selectedSofifaPreset.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-[#02f59b] text-black font-bold px-1.5 py-0.5 rounded font-mono">
                      {selectedSofifaPreset.position}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {selectedSofifaPreset.rating} OVR
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      Nacionalidad: {selectedSofifaPreset.nationality}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleConfirmSofifaSign} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                    Equipo Comprador *
                  </label>
                  <select
                    value={sofifaBuyerClubId}
                    onChange={(e) => setSofifaBuyerClubId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] transition"
                  >
                    {clubs.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Presupuesto: €{(c.budget / 1000000).toFixed(1)}M)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                    Precio del Fichaje (€) *
                  </label>
                  <input
                    type="number"
                    value={sofifaSignPrice}
                    onChange={(e) => setSofifaSignPrice(Number(e.target.value))}
                    step="1000000"
                    min="1000000"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#00ba68] font-display font-extrabold focus:outline-none focus:bg-white focus:border-[#00ba68] transition"
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    Monto a descontar del presupuesto: €{(sofifaSignPrice / 1000000).toFixed(2)}M
                  </span>
                </div>

                {!isBudgetValid && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-tech">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>Presupuesto insuficiente. Saldo actual: €{(buyerClub ? buyerClub.budget / 1000000 : 0).toFixed(1)}M</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedSofifaPreset(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!isBudgetValid}
                    className={`fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5 ${
                      !isBudgetValid ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <UserPlus className="w-4 h-4" /> Confirmar y Fichar
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* MODAL 2: Direct Transfer entre Equipos */}
      {selectedPlayerForDirectBuy && (() => {
        const sellerClub = clubs.find(c => c.id === selectedPlayerForDirectBuy.clubId);
        const buyerClub = clubs.find(c => c.id === directBuyerClubId);
        const isBudgetValid = buyerClub ? buyerClub.budget >= directTransferPrice : false;

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative bg-white border border-slate-200 max-w-lg w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                    <ShoppingBag className="w-6 h-6 text-[#02f59b]" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                      Traspaso Directo
                    </h2>
                    <p className="text-xs text-slate-500 font-tech">Transferencia entre clubes de la liga</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPlayerForDirectBuy(null)} 
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-[#02f59b] font-display font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500">
                  {selectedPlayerForDirectBuy.position}
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-white uppercase leading-tight">
                    {selectedPlayerForDirectBuy.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-[#02f59b] text-black font-bold px-1.5 py-0.5 rounded font-mono">
                      {selectedPlayerForDirectBuy.position}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {selectedPlayerForDirectBuy.rating} OVR
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleConfirmDirectBuy} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-500 font-tech uppercase block">Equipo Vendedor (Origen)</span>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-500" />
                      {sellerClub?.name || 'Club'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-tech uppercase mb-1">Equipo Comprador (Destino)</label>
                    <select
                      value={directBuyerClubId}
                      onChange={(e) => setDirectBuyerClubId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:border-[#00ba68]"
                    >
                      {clubs.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} (Saldo: €{(c.budget / 1000000).toFixed(1)}M)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                    Precio Acordado del Traspaso (€) *
                  </label>
                  <input
                    type="number"
                    value={directTransferPrice}
                    onChange={(e) => setDirectTransferPrice(Number(e.target.value))}
                    step="1000000"
                    min="1000000"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-[#00ba68] font-display font-extrabold focus:outline-none focus:bg-white focus:border-[#00ba68] transition"
                  />
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    Equivalente a: €{(directTransferPrice / 1000000).toFixed(2)}M
                  </span>
                </div>

                {!isBudgetValid && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-tech">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>Presupuesto insuficiente. Saldo actual: €{(buyerClub ? buyerClub.budget / 1000000 : 0).toFixed(1)}M</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedPlayerForDirectBuy(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!isBudgetValid}
                    className={`fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5 ${
                      !isBudgetValid ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" /> Confirmar y Traspasar
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* MODAL 3: Vender Jugador en el Mercado */}
      {showListModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-md w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <Tag className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Poner a la Venta
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">Publica en la lista de transferibles</p>
                </div>
              </div>
              <button 
                onClick={() => setShowListModal(false)} 
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleListPlayer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                  Selecciona Jugador ({currentClub.name}) *
                </label>
                <select
                  value={selectedPlayerForSaleId}
                  onChange={(e) => setSelectedPlayerForSaleId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] transition"
                >
                  <option value="">-- Seleccionar Jugador --</option>
                  {myClubPlayers.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.position} - {p.rating} OVR) — Valor: €{(p.value / 1000000).toFixed(1)}M
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                  Precio de Salida / Cláusula (€) *
                </label>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  step="1000000"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowListModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition"
                >
                  Publicar en Mercado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Fichar Jugador del Mercado de Cláusulas */}
      {selectedMarketTransfer && (() => {
        const sellerClub = clubs.find(c => c.id === selectedMarketTransfer.sellerClubId);
        const buyerClub = clubs.find(c => c.id === marketBuyerClubId);
        const isBudgetValid = buyerClub ? buyerClub.budget >= selectedMarketTransfer.askingPrice : false;
        const availableBuyerClubs = clubs.filter(c => c.id !== selectedMarketTransfer.sellerClubId);

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative bg-white border border-slate-200 max-w-lg w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                    <RefreshCw className="w-6 h-6 text-[#02f59b]" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                      Fichar por Cláusula
                    </h2>
                    <p className="text-xs text-slate-500 font-tech">Pago directo de rescisión</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMarketTransfer(null)} 
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-[#02f59b] font-display font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500">
                  {selectedMarketTransfer.player.position}
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-white uppercase leading-tight">
                    {selectedMarketTransfer.player.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-[#02f59b] text-black font-bold px-1.5 py-0.5 rounded font-mono">
                      {selectedMarketTransfer.player.position}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {selectedMarketTransfer.player.rating} OVR
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      Vendedor: {sellerClub?.name || 'Club'}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleConfirmMarketBuy} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-500 font-tech uppercase block">Equipo Vendedor</span>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-500" />
                      {sellerClub?.name || 'Club'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-tech uppercase mb-1">Equipo Comprador</label>
                    <select
                      value={marketBuyerClubId}
                      onChange={(e) => setMarketBuyerClubId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:border-[#00ba68]"
                    >
                      {availableBuyerClubs.length > 0 ? (
                        availableBuyerClubs.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} (Saldo: €{(c.budget / 1000000).toFixed(1)}M)
                          </option>
                        ))
                      ) : (
                        <option value="">No hay otros equipos disponibles</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-tech uppercase">Cláusula de Rescisión</span>
                  <span className="font-display font-black text-[#02f59b] text-xl">
                    €{(selectedMarketTransfer.askingPrice / 1000000).toFixed(1)}M
                  </span>
                </div>

                {!isBudgetValid && buyerClub && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-tech">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>Presupuesto insuficiente. Saldo actual de {buyerClub.name}: €{(buyerClub.budget / 1000000).toFixed(1)}M</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedMarketTransfer(null)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!isBudgetValid || !buyerClub}
                    className={`fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5 ${
                      !isBudgetValid || !buyerClub ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" /> Pagar Cláusula y Fichar
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* MODAL 5: Modificar Cláusula de Rescisión */}
      {selectedEditClauseTransfer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-md w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <Edit3 className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Modificar Cláusula
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">Actualizar precio de rescisión</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEditClauseTransfer(null)} 
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 text-white">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-[#02f59b] font-display font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500">
                {selectedEditClauseTransfer.player.position}
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white uppercase leading-tight">
                  {selectedEditClauseTransfer.player.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-[#02f59b] text-black font-bold px-1.5 py-0.5 rounded font-mono">
                    {selectedEditClauseTransfer.player.position}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {selectedEditClauseTransfer.player.rating} OVR
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmEditClause} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                  Nueva Cláusula / Precio de Rescisión (€) *
                </label>
                <input
                  type="number"
                  value={newClausePrice}
                  onChange={(e) => setNewClausePrice(Number(e.target.value))}
                  step="1000000"
                  min="1000000"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-display font-extrabold text-[#00ba68] focus:outline-none focus:bg-white focus:border-[#00ba68] transition"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Equivalente en M: €{(newClausePrice / 1000000).toFixed(2)}M
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedEditClauseTransfer(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> Guardar Nueva Cláusula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
