import React, { useState } from 'react';
import { Player, Club, TransferItem } from '../../types';
import { Trash2, Edit3, Tag, X } from 'lucide-react';

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
  const substitutes = clubPlayers.filter(p => !p.isStarter);

  return (
    <div className="space-y-6">
        <div className="fc-card p-5 rounded-2xl border-slate-200 space-y-4 shadow-md">
          <h3 className="font-display font-bold text-lg uppercase text-slate-900 flex items-center justify-between border-b border-slate-200 pb-2">
            {/* La lista muestra toda la plantilla, no solo los suplentes: el
                contador iba con substitutes.length y no coincidia con las filas. */}
            <span>Plantilla ({clubPlayers.length}) · {substitutes.length} suplentes</span>
            <span className="text-xs text-slate-500 font-tech">Haz clic para alternar titular</span>
          </h3>

          <div className="space-y-2">
            {clubPlayers.map((player) => {
              const transferItem = transfers.find(t => (t.player.id === player.id || t.player.name === player.name) && t.status === 'DISPONIBLE');

              return (
                <div
                  key={player.id}
                  className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                    transferItem
                      ? 'bg-amber-50/80 border-amber-300'
                      : player.isStarter
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shrink-0 relative">
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
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-display font-extrabold text-xs text-black shrink-0 ${
                      player.cardType === 'Special' ? 'bg-[#02f59b]' : 'bg-amber-400'
                    }`}>
                      {player.rating}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5 flex-wrap">
                        <span>{player.name}</span>
                        <span className="text-[9px] font-mono text-slate-600 bg-slate-200 px-1 rounded">
                          {player.position}
                        </span>
                        {player.releaseClause && player.releaseClause > 0 && (
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-display font-black uppercase px-1.5 py-0.5 rounded border border-amber-500 shadow-xs flex items-center gap-1 animate-pulse">
                            <Tag className="w-2.5 h-2.5 shrink-0" /> FICHABLE
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[10px] font-tech">
                        <span className="text-slate-500 font-semibold">
                          Valor Referencial: <strong className="font-mono text-slate-700">€{((player.value || 0) / 1000000).toFixed(1)}M</strong>
                        </span>
                        {player.releaseClause && player.releaseClause > 0 ? (
                          <span className="text-[#00ba68] font-bold">
                            Precio de Traspaso: <strong className="font-mono">€{(player.releaseClause / 1000000).toFixed(1)}M</strong> · visible en el Mercado
                          </span>
                        ) : (
                          <span className="text-slate-400 font-semibold italic">
                            No Transferible (ningún club puede ficharlo todavía)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    {onUpdatePlayerValue && (
                      <button
                        onClick={() => {
                          setValueEditPlayer(player);
                          setNewValueInput(player.value || 25000000);
                        }}
                        className="px-2 py-1 rounded text-[10px] font-extrabold font-tech uppercase bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 flex items-center gap-1 transition-colors"
                        title="Editar el valor de mercado de referencia (informativo, no afecta compras)"
                      >
                        <Edit3 className="w-3 h-3 text-slate-500" /> Valor
                      </button>
                    )}

                    {onSetTransferPrice && (
                      <button
                        onClick={() => {
                          setTransferPriceEditPlayer(player);
                          setNewTransferPriceInput(player.releaseClause && player.releaseClause > 0 ? player.releaseClause : (player.value || 25000000));
                        }}
                        className="px-2 py-1 rounded text-[10px] font-extrabold font-tech uppercase bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 flex items-center gap-1 transition-colors"
                        title="Fijar el precio por el que cualquier club puede fichar a este jugador (lo lista en el Mercado de Fichajes)"
                      >
                        <Tag className="w-3 h-3 text-emerald-600" /> {player.releaseClause && player.releaseClause > 0 ? 'Editar Precio' : 'Poner Fichable'}
                      </button>
                    )}

                    {onRemoveFromMarket && player.releaseClause && player.releaseClause > 0 && (
                      <button
                        onClick={() => {
                          if (confirm(`¿Quitar a ${player.name} del Mercado de Fichajes? Ya no será fichable por otros clubes.`)) {
                            onRemoveFromMarket(player.id);
                          }
                        }}
                        className="px-2 py-1 rounded text-[10px] font-extrabold font-tech uppercase bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1 transition-colors"
                        title="Quitar del Mercado de Fichajes"
                      >
                        <X className="w-3 h-3" /> Quitar
                      </button>
                    )}

                    <button
                      onClick={() => onToggleStarter(player.id)}
                      className={`px-2 py-1 rounded text-[10px] font-bold font-tech uppercase transition-colors ${
                        player.isStarter
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                      }`}
                    >
                      {player.isStarter ? '11 Titular' : 'Hacer Titular'}
                    </button>

                    <button
                      onClick={() => onRemovePlayer(player.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
