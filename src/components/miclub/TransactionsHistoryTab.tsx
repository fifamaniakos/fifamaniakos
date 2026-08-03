import React, { useState, useMemo } from 'react';
import { Club, FinancialTransaction } from '../../types';
import { FileText, ArrowDownLeft, ArrowUpRight, Search, Filter, Calendar, Tag, DollarSign, Wallet } from 'lucide-react';

interface TransactionsHistoryTabProps {
  currentClub: Club;
  transactions: FinancialTransaction[];
}

export const TransactionsHistoryTab: React.FC<TransactionsHistoryTabProps> = ({ currentClub, transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INGRESO' | 'GASTO'>('ALL');

  const clubTransactions = useMemo(() => {
    return transactions.filter(t => t.clubId === currentClub.id);
  }, [transactions, currentClub.id]);

  const filteredTransactions = useMemo(() => {
    return clubTransactions.filter(tx => {
      const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
      const matchesSearch = tx.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.date.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [clubTransactions, typeFilter, searchTerm]);

  const totalIncome = clubTransactions.filter(t => t.type === 'INGRESO').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = clubTransactions.filter(t => t.type === 'GASTO').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner & Summary */}
      <div className="fc-card p-6 rounded-3xl border border-slate-200 shadow-xl bg-white space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-display font-extrabold text-xl text-slate-900 uppercase italic flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-emerald-600" /> Historial de Transacciones Financieras
            </h2>
            <p className="text-xs text-slate-500 font-tech">
              Registro contable detallado de todos los ingresos y egresos de {currentClub.name}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-tech text-slate-400 uppercase">Movimientos:</span>
            <span className="font-display font-black text-lg text-slate-800 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
              {clubTransactions.length}
            </span>
          </div>
        </div>

        {/* Quick Financial Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <span className="text-[10px] font-tech font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-slate-400" /> Total Registros
            </span>
            <span className="font-display font-black text-lg text-slate-900">{clubTransactions.length} txs</span>
          </div>

          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
            <span className="text-[10px] font-tech font-bold uppercase text-emerald-700 flex items-center gap-1.5">
              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> Entradas
            </span>
            <span className="font-display font-black text-lg text-emerald-700">+${(totalIncome / 1000000).toFixed(2)}M</span>
          </div>

          <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200/80 flex items-center justify-between">
            <span className="text-[10px] font-tech font-bold uppercase text-rose-700 flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" /> Salidas
            </span>
            <span className="font-display font-black text-lg text-rose-700">-${(totalExpenses / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por concepto o fecha..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-tech text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-tech font-bold uppercase transition-all ${
                typeFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Todos ({clubTransactions.length})
            </button>
            <button
              onClick={() => setTypeFilter('INGRESO')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-tech font-bold uppercase transition-all flex items-center gap-1 ${
                typeFilter === 'INGRESO'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 hover:bg-emerald-100/60'
              }`}
            >
              <ArrowDownLeft className="w-3 h-3" /> Ingresos
            </button>
            <button
              onClick={() => setTypeFilter('GASTO')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-tech font-bold uppercase transition-all flex items-center gap-1 ${
                typeFilter === 'GASTO'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-700 hover:bg-rose-100/60'
              }`}
            >
              <ArrowUpRight className="w-3 h-3" /> Gastos
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      {filteredTransactions.length > 0 ? (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 shadow-xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300 font-tech uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4 font-bold">Tipo</th>
                  <th className="py-3.5 px-4 font-bold">Concepto / Detalle de Operación</th>
                  <th className="py-3.5 px-4 font-bold text-right">Monto ($)</th>
                  <th className="py-3.5 px-4 font-bold text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-tech">
                {filteredTransactions.map(tx => {
                  const isIncome = tx.type === 'INGRESO';
                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-slate-50/90 transition-all group border-l-4 ${
                        isIncome ? 'border-l-emerald-500' : 'border-l-rose-500'
                      }`}
                    >
                      <td className="p-4 whitespace-nowrap">
                        {isIncome ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-100/90 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300 shadow-sm">
                            <ArrowDownLeft className="w-3 h-3 text-emerald-600 stroke-[2.5]" /> INGRESO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] bg-rose-100/90 text-rose-800 font-bold px-2.5 py-1 rounded-full border border-rose-300 shadow-sm">
                            <ArrowUpRight className="w-3 h-3 text-rose-600 stroke-[2.5]" /> GASTO
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                          <span className="font-bold text-slate-900 text-xs md:text-sm">{tx.concept}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <span
                          className={`font-display font-black text-sm md:text-base ${
                            isIncome ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isIncome ? '+' : '-'}${(tx.amount / 1000000).toFixed(2)}M
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-slate-500 font-mono text-xs bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                          <Calendar className="w-3 h-3 text-slate-400" /> {tx.date}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-lg space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="font-display font-bold text-slate-700 text-sm uppercase">Sin resultados</h4>
          <p className="text-xs text-slate-500 font-tech italic max-w-sm mx-auto">
            {searchTerm || typeFilter !== 'ALL'
              ? 'No se encontraron movimientos que coincidan con la búsqueda o filtro seleccionado.'
              : `No hay movimientos de dinero registrados aún para ${currentClub.name}.`}
          </p>
          {(searchTerm || typeFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('ALL');
              }}
              className="mt-2 text-xs font-tech font-bold text-emerald-600 hover:text-emerald-700 underline"
            >
              Restablecer filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};
