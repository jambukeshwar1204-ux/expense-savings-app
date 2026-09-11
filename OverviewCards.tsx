import React from 'react';
import { useFinance } from '../../context/FinancialContext';
import { Wallet, TrendingDown, PiggyBank, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/categoryMeta';

export const OverviewCards: React.FC = () => {
  const { summary } = useFinance();

  const cards = [
    {
      title: 'Total Monthly Income',
      amount: summary.totalIncome,
      subtext: 'From all salary & gigs',
      icon: Wallet,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      badge: '💰 Inflow',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      title: 'Total Expenses',
      amount: summary.totalExpenses,
      subtext: `Fixed: ${formatCurrency(summary.fixedExpenses)} | Var: ${formatCurrency(summary.variableExpenses)}`,
      icon: TrendingDown,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      badge: `${summary.totalIncome > 0 ? ((summary.totalExpenses / summary.totalIncome) * 100).toFixed(0) : 0}% of Income`,
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
    {
      title: 'Total Savings',
      amount: summary.plannedSavings,
      subtext: `Saved in goals: ${formatCurrency(summary.totalSavings)}`,
      icon: PiggyBank,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      badge: `${formatPercentage(summary.savingsRate)} Savings Rate`,
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
    {
      title: 'Remaining Balance',
      amount: summary.remainingBalance,
      subtext: summary.remainingBalance >= 0 ? 'Surplus buffer retained' : 'Deficit this month',
      icon: CheckCircle2,
      color: summary.remainingBalance >= 0 ? 'text-teal-400' : 'text-rose-400',
      bgColor: summary.remainingBalance >= 0 ? 'bg-teal-500/10' : 'bg-rose-500/10',
      borderColor: summary.remainingBalance >= 0 ? 'border-teal-500/20' : 'border-rose-500/20',
      badge: summary.remainingBalance >= 0 ? '✅ Surplus' : '⚠️ Deficit',
      badgeColor: summary.remainingBalance >= 0 ? 'text-teal-400 bg-teal-500/10 border-teal-500/30' : 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-card glass-card-hover rounded-2xl p-5 border ${card.borderColor} relative overflow-hidden`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${card.badgeColor} mb-2`}>
                  {card.badge}
                </span>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-2">
              <p className={`text-2xl sm:text-3xl font-black font-mono-num ${card.color}`}>
                {formatCurrency(card.amount)}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
