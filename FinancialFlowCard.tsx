import React from 'react';
import { useFinance } from '../../context/FinancialContext';
import { ArrowRight, Wallet, Home, ShoppingBag, PiggyBank, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/categoryMeta';

export const FinancialFlowCard: React.FC = () => {
  const { summary } = useFinance();

  const steps = [
    {
      step: 1,
      title: 'Total Income',
      amount: summary.totalIncome,
      icon: Wallet,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      tag: '100%',
      description: 'All monthly inflows',
    },
    {
      step: 2,
      title: 'Fixed Expenses',
      amount: summary.fixedExpenses,
      icon: Home,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/30',
      tag: summary.totalIncome > 0 ? formatPercentage((summary.fixedExpenses / summary.totalIncome) * 100) : '0%',
      description: 'Rent, EMI, Utilities',
    },
    {
      step: 3,
      title: 'Variable Expenses',
      amount: summary.variableExpenses,
      icon: ShoppingBag,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
      tag: summary.totalIncome > 0 ? formatPercentage((summary.variableExpenses / summary.totalIncome) * 100) : '0%',
      description: 'Food, Shopping, Travel',
    },
    {
      step: 4,
      title: 'Total Savings',
      amount: summary.plannedSavings,
      icon: PiggyBank,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30',
      tag: `${formatPercentage(summary.savingsRate)} Rate`,
      description: 'Goals & Emergency Fund',
    },
    {
      step: 5,
      title: 'Remaining Balance',
      amount: summary.remainingBalance,
      icon: CheckCircle2,
      color: summary.remainingBalance >= 0 ? 'text-teal-400' : 'text-rose-400',
      bgColor: summary.remainingBalance >= 0 ? 'bg-teal-500/10 border-teal-500/30' : 'bg-rose-500/10 border-rose-500/30',
      tag: summary.remainingBalance >= 0 ? 'Surplus' : 'Deficit',
      description: 'Unallocated reserve',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>Cash Flow Blueprint</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Income → Fixed → Variable → Savings → Balance
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent breakdown of every rupee flowing into and out of your account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            Savings Rate: <span className="font-mono-num font-bold text-purple-200">{formatPercentage(summary.savingsRate)}</span>
          </div>
        </div>
      </div>

      {/* Responsive Pipeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="relative group">
              <div
                className={`p-4 rounded-xl border ${item.bgColor} transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between h-full`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-slate-900/80 text-white">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 font-mono-num">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-400">{item.title}</p>
                  <p className={`text-lg sm:text-xl font-bold font-mono-num mt-1 ${item.color}`}>
                    {formatCurrency(item.amount)}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                  {item.description}
                </p>
              </div>

              {/* Arrow separator (hidden on mobile and last item) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-4 h-4 rounded-full bg-slate-800 border border-slate-700 items-center justify-center text-slate-400">
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
