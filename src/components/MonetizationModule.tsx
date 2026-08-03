import React, { useState } from 'react';
import { BudgetPackage } from '../types';
import { Wallet, Plus, Trash2, X, Coins, FileText, Edit3, Crown } from 'lucide-react';
import { BudgetPackageCard } from './BudgetPackageCard';

const WHATSAPP_NUMBER = '5493434538564';

interface MonetizationModuleProps {
  packages: BudgetPackage[];
  explanation: string;
  isAdmin: boolean;
  currentSeasonNumber: number;
  hasActiveSubscription: boolean;
  onAddPackage: (pkg: BudgetPackage) => void;
  onEditPackage: (id: string, budgetMillions: number, priceUsd: number) => void;
  onDeletePackage: (id: string) => void;
  onSaveExplanation: (text: string) => void;
}

export const MonetizationModule: React.FC<MonetizationModuleProps> = ({
  packages,
  explanation,
  isAdmin,
  currentSeasonNumber,
  hasActiveSubscription,
  onAddPackage,
  onEditPackage,
  onDeletePackage,
  onSaveExplanation
}) => {
  const subscriptionRequired = currentSeasonNumber >= 2;
  const subscriptionWhatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hola! Quiero activar mi suscripción mensual de USD 8 para seguir participando en la liga.'
  )}`;
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<BudgetPackage | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<BudgetPackage | null>(null);
  const [formBudget, setFormBudget] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [explanationDraft, setExplanationDraft] = useState('');

  const openExplanationForm = () => {
    setExplanationDraft(explanation);
    setShowExplanationModal(true);
  };

  const handleSaveExplanation = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveExplanation(explanationDraft.trim());
    setShowExplanationModal(false);
  };

  const openCreateForm = () => {
    setEditingPackage(null);
    setFormBudget('');
    setFormPrice('');
    setShowFormModal(true);
  };

  const openEditForm = (pkg: BudgetPackage) => {
    setEditingPackage(pkg);
    setFormBudget(String(pkg.budgetMillions));
    setFormPrice(String(pkg.priceUsd));
    setShowFormModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetMillions = Number(formBudget);
    const priceUsd = Number(formPrice);
    if (!budgetMillions || !priceUsd) return;

    if (editingPackage) {
      onEditPackage(editingPackage.id, budgetMillions, priceUsd);
    } else {
      onAddPackage({ id: `pkg-${Date.now()}`, budgetMillions, priceUsd });
    }
    setShowFormModal(false);
  };

  const buildWhatsappLink = (pkg: BudgetPackage) => {
    const message = `Hola! Quiero comprar el paquete de €${pkg.budgetMillions}M de presupuesto extra por ${pkg.priceUsd} USD.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner Header */}
      <div className="fc-card p-6 md:p-8 rounded-2xl border-emerald-500/40 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Wallet className="w-9 h-9 text-emerald-300" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 bg-emerald-500 text-white text-[10px] font-tech font-extrabold uppercase rounded tracking-wider">
                RECARGÁ TU PRESUPUESTO
              </span>
              <h1 className="font-display font-black text-2xl md:text-3xl text-white uppercase italic tracking-wide mt-1">
                Tienda de Presupuesto
              </h1>
              <p className="text-xs text-slate-300 font-tech">
                Sumá presupuesto extra a tu club eligiendo uno de los paquetes disponibles.
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={openCreateForm}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-tech font-bold uppercase flex items-center gap-1.5 border border-white/20 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" /> Agregar Paquete
            </button>
          )}
        </div>
      </div>

      {/* Suscripción de la Liga */}
      <div className="fc-card p-5 md:p-6 rounded-2xl border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-display font-bold text-base uppercase tracking-wide text-slate-900 flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" /> Suscripción de la Liga
          </h2>
          <span className="px-2.5 py-0.5 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase rounded tracking-wider">
            Temporada Actual: {currentSeasonNumber}
          </span>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          La <strong>Temporada 1 es completamente gratis</strong> para todos los DTs. A partir de la{' '}
          <strong>Temporada 2</strong>, participar activamente (reportar resultados y fichar jugadores)
          requiere una <strong>suscripción de USD 8/mes</strong>. El foro y la consulta de fixture,
          tabla y estadísticas siguen siendo libres siempre, con o sin suscripción.
        </p>

        {subscriptionRequired ? (
          <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border flex-wrap ${
            hasActiveSubscription || isAdmin
              ? 'bg-emerald-50 border-emerald-300'
              : 'bg-rose-50 border-rose-300'
          }`}>
            <span className={`text-xs font-tech font-bold ${hasActiveSubscription || isAdmin ? 'text-emerald-800' : 'text-rose-800'}`}>
              {isAdmin
                ? 'Como admin no necesitás suscripción.'
                : hasActiveSubscription
                  ? 'Tu suscripción está ACTIVA. ¡Gracias por apoyar la liga!'
                  : 'Tu suscripción está INACTIVA — no vas a poder reportar resultados ni fichar hasta activarla.'}
            </span>
            {!isAdmin && !hasActiveSubscription && (
              <a
                href={subscriptionWhatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-tech font-bold uppercase shrink-0"
              >
                Activar por WhatsApp
              </a>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50">
            <span className="text-xs font-tech font-bold text-emerald-800">
              Estás en Temporada 1: todavía no se cobra suscripción.
            </span>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="fc-card p-5 md:p-6 rounded-2xl border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display font-bold text-base uppercase tracking-wide text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" /> Cómo Funciona
          </h2>
          {isAdmin && (
            <button
              onClick={openExplanationForm}
              className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-tech font-bold uppercase flex items-center gap-1.5 border border-slate-200 transition-colors shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" /> Editar Explicación
            </button>
          )}
        </div>

        {explanation.trim() ? (
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
            {explanation}
          </p>
        ) : (
          <p className="text-sm text-slate-400 font-tech">
            {isAdmin
              ? 'Todavía no cargaste una explicación. Tocá "Editar Explicación" para escribirla.'
              : 'Consultá con la administración de la liga para más información sobre cómo comprar presupuesto extra.'}
          </p>
        )}
      </div>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <div className="text-center py-16 fc-card rounded-2xl">
          <Coins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-tech">
            {isAdmin ? 'Todavía no cargaste ningún paquete. Tocá "Agregar Paquete" para crear el primero.' : 'Todavía no hay paquetes disponibles.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <BudgetPackageCard
              key={pkg.id}
              pkg={pkg}
              whatsappHref={buildWhatsappLink(pkg)}
              isAdmin={isAdmin}
              onEdit={() => openEditForm(pkg)}
              onDelete={() => setPackageToDelete(pkg)}
            />
          ))}
        </div>
      )}

      {/* Modal: Crear / Editar Paquete */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-md w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="font-display font-black text-xl text-slate-900 uppercase italic tracking-wide">
                {editingPackage ? 'Editar Paquete' : 'Nuevo Paquete'}
              </h2>
              <button
                onClick={() => setShowFormModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5">
                  PRESUPUESTO EXTRA (EN MILLONES DE €) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formBudget}
                  onChange={(e) => setFormBudget(e.target.value)}
                  placeholder="Ej: 200"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5">
                  PRECIO (EN USD) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="Ej: 5"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition"
                >
                  {editingPackage ? 'GUARDAR CAMBIOS' : 'CREAR PAQUETE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Eliminación */}
      {packageToDelete && (
        <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-rose-300 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-900 uppercase">¿Eliminar Paquete?</h3>
                <p className="text-xs text-slate-500 font-tech">Esta acción es permanente y no se podrá deshacer.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-800 font-tech">€{packageToDelete.budgetMillions}M — {packageToDelete.priceUsd} USD</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPackageToDelete(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-xl hover:bg-slate-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeletePackage(packageToDelete.id);
                  setPackageToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-tech font-extrabold uppercase rounded-xl shadow-md transition-colors"
              >
                Sí, Eliminar Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Explicación */}
      {showExplanationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white border border-slate-200 max-w-xl w-full p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 text-slate-800 my-8 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="font-display font-black text-xl text-slate-900 uppercase italic tracking-wide">
                Editar Explicación
              </h2>
              <button
                onClick={() => setShowExplanationModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition flex items-center justify-center border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExplanation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 font-tech mb-1.5">
                  TEXTO EXPLICATIVO
                </label>
                <textarea
                  value={explanationDraft}
                  onChange={(e) => setExplanationDraft(e.target.value)}
                  rows={8}
                  placeholder="Explicá cómo funciona la compra de presupuesto extra, condiciones, tiempos de entrega, etc."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#00ba68] focus:ring-1 focus:ring-[#00ba68] transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowExplanationModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-tech font-bold uppercase rounded-lg transition border border-slate-200"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="fc-button-primary px-7 py-2.5 text-xs font-extrabold uppercase shadow-md hover:shadow-lg transition"
                >
                  GUARDAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
