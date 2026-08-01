import React from 'react';
import { Club, FinancialTransaction } from '../../types';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface FinancesTabProps {
  currentClub: Club;
  transactions: FinancialTransaction[];
}

export const FinancesTab: React.FC<FinancesTabProps> = ({ currentClub, transactions }) => {
  const clubTransactions = transactions.filter(t => t.clubId === currentClub.id);
  const totalIncome = clubTransactions.filter(t => t.type === 'INGRESO').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = clubTransactions.filter(t => t.type === 'GASTO').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="fc-card p-6 rounded-2xl border-slate-200 shadow-lg space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-slate-900 uppercase italic flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#00ba68]" /> Estado Financiero y Movimientos de Dinero
          </h2>
          <p className="text-xs text-slate-500 font-tech">Resumen contable de fichajes/ventas del {currentClub.name}.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-tech text-slate-500 uppercase">Presupuesto Actual:</span>
          <span className="font-display font-black text-2xl text-[#00ba68] bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            €{(currentClub.budget / 1000000).toFixed(2)}M
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-tech uppercase text-emerald-800 font-bold block">Total Ingresos (Ventas)</span>
            <span className="font-display font-black text-lg text-emerald-700">+${(totalIncome / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500 text-white rounded-lg flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-tech uppercase text-rose-800 font-bold block">Total Gastos (Fichajes)</span>
            <span className="font-display font-black text-lg text-rose-700">-${(totalExpenses / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${netBalance >= 0 ? 'bg-slate-800 text-[#02f59b]' : 'bg-rose-800 text-rose-200'}`}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-tech uppercase text-slate-500 font-bold block">Balance Neto</span>
            <span className={`font-display font-black text-lg ${netBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {netBalance >= 0 ? '+' : ''}${(netBalance / 1000000).toFixed(2)}M
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
