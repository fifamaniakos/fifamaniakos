import React from 'react';
import { Club, FinancialTransaction } from '../../types';
import { FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TransactionsHistoryTabProps {
  currentClub: Club;
  transactions: FinancialTransaction[];
}

export const TransactionsHistoryTab: React.FC<TransactionsHistoryTabProps> = ({ currentClub, transactions }) => {
  const clubTransactions = transactions.filter(t => t.clubId === currentClub.id);

  return (
    <div className="space-y-3">
      <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
        <FileText className="w-4 h-4 text-slate-500" /> Historial de Transacciones Financieras
      </h3>

      {clubTransactions.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-tech uppercase text-[10px]">
              <tr>
                <th className="p-3">Tipo</th>
                <th className="p-3">Concepto / Detalle</th>
                <th className="p-3 text-right">Monto ($)</th>
                <th className="p-3 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-tech">
              {clubTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    {tx.type === 'INGRESO' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                        <ArrowDownLeft className="w-3 h-3 text-emerald-600" /> INGRESO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-300">
                        <ArrowUpRight className="w-3 h-3 text-rose-600" /> GASTO
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-bold text-slate-800">{tx.concept}</td>
                  <td className={`p-3 text-right font-display font-black text-sm ${tx.type === 'INGRESO' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'INGRESO' ? '+' : '-'}${(tx.amount / 1000000).toFixed(2)}M
                  </td>
                  <td className="p-3 text-right text-slate-500 font-mono text-[11px]">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs font-tech italic">
          No hay movimientos de dinero registrados aún para {currentClub.name}.
        </div>
      )}
    </div>
  );
};
