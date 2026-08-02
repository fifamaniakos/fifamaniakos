import React, { useState } from 'react';
import { Club, FinancialTransaction } from '../../types';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownLeft, ShieldCheck, Scale } from 'lucide-react';

interface FinancesTabProps {
  currentClub: Club;
  transactions: FinancialTransaction[];
}

export const FinancesTab: React.FC<FinancesTabProps> = ({ currentClub, transactions }) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const clubTransactions = transactions.filter(t => t.clubId === currentClub.id);
  const totalIncome = clubTransactions.filter(t => t.type === 'INGRESO').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = clubTransactions.filter(t => t.type === 'GASTO').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const currentBudget = currentClub.budget;

  // Donut chart calculations
  const chartData = [
    { id: 'budget', label: 'Presupuesto Actual', amount: currentBudget, color: '#3b82f6', bgClass: 'bg-blue-500', textClass: 'text-blue-600', strokeClass: 'stroke-blue-500' },
    { id: 'income', label: 'Ingresos (Ventas)', amount: totalIncome, color: '#10b981', bgClass: 'bg-emerald-500', textClass: 'text-emerald-600', strokeClass: 'stroke-emerald-500' },
    { id: 'expenses', label: 'Gastos (Fichajes)', amount: totalExpenses, color: '#f43f5e', bgClass: 'bg-rose-500', textClass: 'text-rose-600', strokeClass: 'stroke-rose-500' },
  ];

  const totalVolume = chartData.reduce((acc, item) => acc + item.amount, 0);

  // Calculate donut slices (circumference for r=40 is ~251.327)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;
  const slices = chartData.map(item => {
    const percent = totalVolume > 0 ? item.amount / totalVolume : (item.id === 'budget' ? 1 : 0);
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativePercent * circumference;
    cumulativePercent += percent;
    return {
      ...item,
      percent,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeItem = hoveredSegment ? chartData.find(d => d.id === hoveredSegment) : null;

  const incomeTxCount = clubTransactions.filter(t => t.type === 'INGRESO').length;
  const expenseTxCount = clubTransactions.filter(t => t.type === 'GASTO').length;

  return (
    <div className="space-y-6">
      {/* Main Grid: Donut Chart + Financial KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DONUT CHART CARD */}
        <div className="lg:col-span-5 fc-card p-6 rounded-3xl border border-slate-200 shadow-xl bg-white flex flex-col justify-between relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-display font-extrabold text-slate-900 text-base uppercase italic flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-600" /> Distribución de Fondos
            </h3>
            <span className="text-[10px] font-tech font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              Gráfico Donut
            </span>
          </div>

          {/* SVG Donut */}
          <div className="relative my-4 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-56 h-56 transform -rotate-90 drop-shadow-md">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Donut Slices */}
              {slices.map(slice => (
                <circle
                  key={slice.id}
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={hoveredSegment === slice.id ? '15' : '12'}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-300 cursor-pointer hover:opacity-90"
                  onMouseEnter={() => setHoveredSegment(slice.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />
              ))}
            </svg>

            {/* Inner Donut Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
              <span className="text-[10px] font-tech uppercase font-bold text-slate-400">
                {activeItem ? activeItem.label : 'Volumen Total'}
              </span>
              <span className="font-display font-black text-xl md:text-2xl text-slate-900">
                €{((activeItem ? activeItem.amount : totalVolume) / 1000000).toFixed(2)}M
              </span>
              {activeItem && (
                <span className={`text-[11px] font-tech font-bold px-2 py-0.5 rounded-full mt-1 ${activeItem.bgClass} text-white`}>
                  {((activeItem.amount / (totalVolume || 1)) * 100).toFixed(1)}% del total
                </span>
              )}
            </div>
          </div>

          {/* Donut Chart Legend */}
          <div className="space-y-2 mt-2 pt-4 border-t border-slate-100">
            {slices.map(slice => (
              <div
                key={slice.id}
                onMouseEnter={() => setHoveredSegment(slice.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  hoveredSegment === slice.id
                    ? 'bg-slate-50 border-slate-300 shadow-sm scale-[1.02]'
                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-3.5 h-3.5 rounded-md ${slice.bgClass} shadow-sm shrink-0`} />
                  <span className="text-xs font-bold text-slate-700 font-tech">{slice.label}</span>
                </div>
                <div className="text-right">
                  <span className={`font-display font-black text-xs block ${slice.textClass}`}>
                    €{(slice.amount / 1000000).toFixed(2)}M
                  </span>
                  <span className="text-[10px] font-tech text-slate-400">
                    {((slice.percent) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* METRICS & BREAKDOWN CARDS */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Card 1: Total Ingresos */}
          <div className="fc-card p-5 rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 shadow-lg relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <ArrowDownLeft className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-tech uppercase text-emerald-800 font-bold tracking-wider block">
                    Total Ingresos (Ventas)
                  </span>
                  <span className="font-display font-black text-2xl md:text-3xl text-emerald-700">
                    +${(totalIncome / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[10px] font-tech font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
                  <TrendingUp className="w-3 h-3 text-emerald-600" /> {incomeTxCount} {incomeTxCount === 1 ? 'Venta' : 'Ventas'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Gastos */}
          <div className="fc-card p-5 rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/80 via-white to-rose-50/30 shadow-lg relative overflow-hidden group hover:border-rose-300 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-tech uppercase text-rose-800 font-bold tracking-wider block">
                    Total Gastos (Fichajes)
                  </span>
                  <span className="font-display font-black text-2xl md:text-3xl text-rose-700">
                    -${(totalExpenses / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[10px] font-tech font-bold uppercase bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full border border-rose-300">
                  <TrendingDown className="w-3 h-3 text-rose-600" /> {expenseTxCount} {expenseTxCount === 1 ? 'Fichaje' : 'Fichajes'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Balance Neto */}
          <div className={`fc-card p-5 rounded-3xl border shadow-lg relative overflow-hidden group transition-all ${
            netBalance >= 0
              ? 'border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'
              : 'border-rose-300 bg-gradient-to-br from-rose-900 via-rose-950 to-slate-900 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                  netBalance >= 0 ? 'bg-emerald-400 text-slate-950 shadow-emerald-400/20' : 'bg-rose-500 text-white shadow-rose-500/30'
                }`}>
                  <Scale className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-tech uppercase text-slate-300 font-bold tracking-wider block">
                    Balance Neto de Operaciones
                  </span>
                  <span className={`font-display font-black text-2xl md:text-3xl ${netBalance >= 0 ? 'text-[#02f59b]' : 'text-rose-400'}`}>
                    {netBalance >= 0 ? '+' : ''}${(netBalance / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1 text-xs font-tech font-extrabold uppercase px-3 py-1 rounded-full border ${
                  netBalance >= 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {netBalance >= 0 ? 'Superávit Financiero' : 'Déficit Financiero'}
                </span>
              </div>
            </div>
          </div>

          {/* Cash Flow Visual Ratio Bar */}
          <div className="fc-card p-5 rounded-3xl border border-slate-200 bg-white shadow-md space-y-3">
            <div className="flex items-center justify-between text-xs font-tech font-bold uppercase text-slate-600">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Ingresos ({((totalIncome / (totalIncome + totalExpenses || 1)) * 100).toFixed(0)}%)
              </span>
              <span className="flex items-center gap-1.5 text-rose-700">
                Gastos ({((totalExpenses / (totalIncome + totalExpenses || 1)) * 100).toFixed(0)}%) <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              </span>
            </div>

            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-l-full transition-all duration-500"
                style={{ width: `${(totalIncome / (totalIncome + totalExpenses || 1)) * 100}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-r-full transition-all duration-500"
                style={{ width: `${(totalExpenses / (totalIncome + totalExpenses || 1)) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-tech text-slate-400 italic">
              <span>{clubTransactions.length} movimientos contables registrados</span>
              <span className="flex items-center gap-1 text-slate-500">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Finanzas auditadas por Supabase
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

