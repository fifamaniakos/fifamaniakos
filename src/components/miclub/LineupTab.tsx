import React, { useState } from 'react';
import { Player, Club, TransferItem } from '../../types';
import { Trash2, Edit3, Tag, X, Shield, UserCheck, UserPlus, Star, ArrowLeftRight } from 'lucide-react';

interface LineupTabProps {
  currentClub: Club;
  players: Player[];
  transfers: TransferItem[];
  onRemovePlayer: (playerId: string) => void;
  onToggleStarter: (playerId: string) => void;
  onUpdatePlayerValue?: (playerId: string, newValue: number) => void;
  onSetTransferPrice?: (player: Player, price: number) => void;
  onRemoveFromMarket?: (playerId: string) => void;
}

export const LineupTab: React.FC<LineupTabProps> = ({
  currentClub,
  players,
  transfers,
  onRemovePlayer,
  onToggleStarter,
  onUpdatePlayerValue,
  onSetTransferPrice,
  onRemoveFromMarket
}) => {
  const [transferPriceEditPlayer, setTransferPriceEditPlayer] = useState<Player | null>(null);
  const [newTransferPriceInput, setNewTransferPriceInput] = useState<number>(30000000);

  const [valueEditPlayer, setValueEditPlayer] = useState<Player | null>(null);
  const [newValueInput, setNewValueInput] = useState<number>(25000000);

  const clubPlayers = players.filter(p => p.clubId === currentClub.id);
  const starters = clubPlayers.filter(p => p.isStarter);
  const substitutes = clubPlayers.filter(p => !p.isStarter);

  const startersAvgRating = starters.length > 0
    ? Math.round(starters.reduce((acc, p) => acc + p.rating, 0) / starters.length)
    : 0;

  const renderPlayerCard = (player: Player, isStarterCard: boolean) => {
    const transferItem = transfers.find(t => (t.player.id === player.id || t.player.name === player.name) && t.status === 'DISPONIBLE');
    const isSpecial = player.cardType === 'Special';
    const isGold = player.cardType === 'Gold' || player.rating >= 78;
    const isFichable = Boolean(player.releaseClause && player.releaseClause > 0);

    return (
      <div
        key={player.id}
        className={`relative flex flex-col justify-between rounded-xl border transition-all shadow-sm hover:shadow-md ${
          isStarterCard
            ? 'bg-white border-emerald-300/80 hover:border-emerald-400 ring-1 ring-emerald-500/10'
            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Cabecera de la tarjeta: Badge Posición + OVR Rating */}
        <div className="p-3 pb-2 border-b border-slate-100 flex items-center justify-between gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase tracking-wide ${
            isSpecial
              ? 'bg-slate-900 text-[#02f59b] border border-slate-700'
              : 'bg-slate-200 text-slate-800'
          }`}>
            {player.position}
          </span>

          <div className="flex items-center gap-1.5">
            {isFichable && (
              <span className="bg-amber-400 text-slate-950 font-display font-black text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-xs animate-pulse">
                <Tag className="w-2.5 h-2.5" /> FICHABLE
              </span>
            )}
            <span className={`px-2 py-0.5 rounded font-display font-black text-xs shadow-xs ${
              isSpecial
                ? 'bg-[#02f59b] text-slate-950'
                : isGold
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-900 text-white'
            }`}>
              {player.rating}
            </span>
          </div>
        </div>

        {/* Cuerpo de la tarjeta: Foto + Información */}
        <div className="p-3.5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-200/80 border border-slate-300 overflow-hidden shrink-0 shadow-inner relative flex items-center justify-center">
            <img
              src={player.photoUrl || `https://cdn.sofifa.net/players/231/747/25_120.png`}
              alt={player.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-display font-extrabold text-sm text-slate-900 truncate uppercase tracking-tight" title={player.name}>
              {player.name}
            </h4>
            
            <div className="mt-1 space-y-0.5 text-[11px] font-tech">
              <p className="text-slate-500 font-semibold truncate">
                Valor: <strong className="font-mono text-slate-800">€{((player.value || 0) / 1000000).toFixed(1)}M</strong>
              </p>
              {isFichable ? (
                <p className="text-[#00ba68] font-bold truncate">
                  Cláusula: <strong className="font-mono">€{(player.releaseClause! / 1000000).toFixed(1)}M</strong>
                </p>
              ) : (
                <p className="text-slate-400 italic text-[10px]">No transferible</p>
              )}
            </div>
          </div>
        </div>

        {/* Pie de tarjeta: Botón principal (Toggle Starter) + Acciones rápidas */}
        <div className="p-2.5 bg-slate-100/60 rounded-b-xl border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Botón Principal para cambiar de Grid */}
          <button
            onClick={() => onToggleStarter(player.id)}
            className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs font-tech font-extrabold uppercase transition-all flex items-center justify-center gap-1.5 shadow-xs ${
              isStarterCard
                ? 'bg-slate-200 text-slate-800 hover:bg-amber-100 hover:text-amber-900 hover:border-amber-300 border border-slate-300'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20'
            }`}
            title={isStarterCard ? 'Mover a la banca de suplentes' : 'Asignar al 11 Titular'}
          >
            {isStarterCard ? (
              <>
                <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600" />
                <span>Mover a Suplentes</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Hacer Titular</span>
              </>
            )}
          </button>

          {/* Menú de Acciones Secundarias */}
          <div className="flex items-center gap-1 shrink-0">
            {onSetTransferPrice && (
              <button
                onClick={() => {
                  setTransferPriceEditPlayer(player);
                  setNewTransferPriceInput(player.releaseClause && player.releaseClause > 0 ? player.releaseClause : (player.value || 25000000));
                }}
                className={`p-1.5 rounded-md text-xs font-bold transition-colors border ${
                  isFichable
                    ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={isFichable ? 'Editar precio de traspaso en Mercado' : 'Poner fichable en Mercado de Fichajes'}
              >
                <Tag className="w-3.5 h-3.5 text-amber-600" />
              </button>
            )}

            {onUpdatePlayerValue && (
              <button
                onClick={() => {
                  setValueEditPlayer(player);
                  setNewValueInput(player.value || 25000000);
                }}
                className="p-1.5 rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Editar valor referencial de mercado"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}

            {onRemoveFromMarket && isFichable && (
              <button
                onClick={() => {
                  if (confirm(`¿Quitar a ${player.name} del Mercado de Fichajes? Ya no será fichable por otros clubes.`)) {
                    onRemoveFromMarket(player.id);
                  }
                }}
                className="p-1.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                title="Quitar del Mercado de Fichajes"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => {
                if (confirm(`¿Eliminar a ${player.name} de la plantilla?`)) {
                  onRemovePlayer(player.id);
                }
              }}
              className="p-1.5 rounded-md bg-white text-slate-400 border border-slate-200 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
              title="Desvincular jugador del club"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* GRID 1: 11 TITULAR */}
      <div className="fc-card p-5 md:p-6 rounded-2xl border-slate-200 space-y-4 shadow-md bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
          <div>
            <h3 className="font-display font-black text-xl uppercase text-slate-900 flex items-center gap-2 tracking-wide">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>11 Titular ({starters.length}/11)</span>
            </h3>
            <p className="text-xs text-slate-500 font-tech mt-0.5">
              Jugadores que inician en el campo de juego en los partidos del club.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {starters.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-tech font-bold text-emerald-800 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Media OVR Titulares: <strong>{startersAvgRating}</strong></span>
              </div>
            )}
          </div>
        </div>

        {starters.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <UserPlus className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="font-display font-bold text-base text-slate-700 uppercase">Sin titulares asignados</h4>
            <p className="text-xs text-slate-500 font-tech mt-1 max-w-md mx-auto">
              Haz clic en <strong>"Hacer Titular"</strong> en cualquiera de los jugadores del grid de suplentes para conformar tu 11 inicial.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {starters.map(player => renderPlayerCard(player, true))}
          </div>
        )}
      </div>

      {/* GRID 2: SUPLENTES Y RESERVAS */}
      <div className="fc-card p-5 md:p-6 rounded-2xl border-slate-200 space-y-4 shadow-md bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
          <div>
            <h3 className="font-display font-black text-xl uppercase text-slate-900 flex items-center gap-2 tracking-wide">
              <span className="w-3 h-3 rounded-full bg-slate-400 inline-block"></span>
              <span>Suplentes & Reservas ({substitutes.length})</span>
            </h3>
            <p className="text-xs text-slate-500 font-tech mt-0.5">
              Jugadores disponibles en la banca para ingresar o rotar.
            </p>
          </div>
        </div>

        {substitutes.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Shield className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="font-display font-bold text-base text-slate-700 uppercase">No hay suplentes en banca</h4>
            <p className="text-xs text-slate-500 font-tech mt-1 max-w-md mx-auto">
              Toda tu plantilla ({clubPlayers.length} jugadores) está actualmente asignada en el 11 titular.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {substitutes.map(player => renderPlayerCard(player, false))}
          </div>
        )}
      </div>

      {/* MODAL: Precio de Traspaso (une Cláusula + Vender en un solo paso) */}
      {transferPriceEditPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-md w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <Tag className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Precio de Traspaso
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">{currentClub.name}</p>
                </div>
              </div>
              <button
                onClick={() => setTransferPriceEditPlayer(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 text-white shadow-inner">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-[#02f59b] font-display font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500">
                {transferPriceEditPlayer.position}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-black text-lg text-white uppercase leading-tight truncate">
                  {transferPriceEditPlayer.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-[10px] bg-[#02f59b] text-black font-extrabold px-1.5 py-0.5 rounded font-mono">
                    {transferPriceEditPlayer.position}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {transferPriceEditPlayer.rating} OVR
                  </span>
                  <span className="text-[10px] text-slate-400 font-tech">
                    {currentClub.name}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (onSetTransferPrice && transferPriceEditPlayer) {
                onSetTransferPrice(transferPriceEditPlayer, Number(newTransferPriceInput));
                alert(`¡Listo! ${transferPriceEditPlayer.name} ya es fichable por cualquier club de la liga pagando €${(Number(newTransferPriceInput) / 1000000).toFixed(1)}M. Aparece en el Mercado de Fichajes.`);
              }
              setTransferPriceEditPlayer(null);
            }} className="space-y-4">

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                  Precio de Traspaso (€ Euros) *
                </label>
                <input
                  type="number"
                  value={newTransferPriceInput}
                  onChange={(e) => setNewTransferPriceInput(Number(e.target.value))}
                  step="1000000"
                  min="1000000"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-display font-black text-[#00ba68] focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
                <span className="text-xs font-display font-bold text-[#00ba68] mt-1 block">
                  Valor asignado: €{(newTransferPriceInput / 1000000).toFixed(1)}M Millones
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-tech font-bold uppercase text-slate-500 block">Valores Rápidos:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[15000000, 30000000, 50000000, 80000000, 100000000, 150000000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNewTransferPriceInput(val)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-colors ${
                        newTransferPriceInput === val
                          ? 'bg-[#00ba68] text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                      }`}
                    >
                      €{val / 1000000}M
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed font-tech">
                💡 <strong>Cómo funciona:</strong> apenas guardes, cualquier club de la liga va a poder ver y fichar a{' '}
                {transferPriceEditPlayer.name} en el Mercado de Fichajes pagando exactamente este monto — no hace
                falta que negocies ni que aceptes nada, el fichaje se confirma solo.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTransferPriceEditPlayer(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5"
                >
                  <Tag className="w-4 h-4" /> Guardar y Poner Fichable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Modificar Valor de Mercado de Jugador en Mi Club */}
      {valueEditPlayer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-md w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-[#02f59b] font-display font-black text-xl flex items-center justify-center rounded-xl italic shadow-md border border-slate-800">
                  <Edit3 className="w-6 h-6 text-[#02f59b]" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 uppercase italic tracking-wide">
                    Valor de Mercado
                  </h2>
                  <p className="text-xs text-slate-500 font-tech">{currentClub.name}</p>
                </div>
              </div>
              <button
                onClick={() => setValueEditPlayer(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4 text-white shadow-inner">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-[#02f59b] font-display font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500">
                {valueEditPlayer.position}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-black text-lg text-white uppercase leading-tight truncate">
                  {valueEditPlayer.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-[10px] bg-[#02f59b] text-black font-extrabold px-1.5 py-0.5 rounded font-mono">
                    {valueEditPlayer.position}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {valueEditPlayer.rating} OVR
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (onUpdatePlayerValue && valueEditPlayer) {
                onUpdatePlayerValue(valueEditPlayer.id, Number(newValueInput));
                alert(`¡Valor actualizado! El valor de mercado de ${valueEditPlayer.name} es ahora €${(Number(newValueInput) / 1000000).toFixed(1)}M.`);
              }
              setValueEditPlayer(null);
            }} className="space-y-4">

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1">
                  Nuevo Valor de Mercado (€ Euros) *
                </label>
                <input
                  type="number"
                  value={newValueInput}
                  onChange={(e) => setNewValueInput(Number(e.target.value))}
                  step="1000000"
                  min="1000000"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-display font-black text-[#00ba68] focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
                <span className="text-xs font-display font-bold text-[#00ba68] mt-1 block">
                  Valor asignado: €{(newValueInput / 1000000).toFixed(1)}M Millones
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-tech font-bold uppercase text-slate-500 block">Valores Rápidos:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[10000000, 25000000, 50000000, 80000000, 120000000, 180000000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNewValueInput(val)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-colors ${
                        newValueInput === val
                          ? 'bg-[#00ba68] text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                      }`}
                    >
                      €{val / 1000000}M
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-tech">
                💡 <strong>Nota:</strong> Este es el precio de referencia que se usa como oferta por defecto cuando otro club quiere fichar a {valueEditPlayer.name} directamente (fuera de una cláusula). No afecta la cláusula de rescisión.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setValueEditPlayer(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-4 h-4" /> Guardar Valor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
