import React, { useState } from 'react';
import { useFinance } from '../../context/FinancialContext';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle, ChevronDown, ChevronUp, Calendar, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/categoryMeta';

export const SafeToSpendBanner: React.FC = () => {
  const { summary } = useFinance();
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Status computation:
  // Safe pool = Income - Fixed - Planned Savings
  const totalSafePool = Math.max(0, summary.totalIncome - summary.fixedExpenses - summary.plannedSavings);
  const spentRatio = totalSafePool > 0 ? (summary.variableExpenses / totalSafePool) * 100 : 100;

  let statusColor = 'text-emerald-400';
  let statusBg = 'from-emerald-950/60 via-slate-900/90 to-emerald-950/40 border-emerald-500/30';
  let statusBadge = {
    icon: ShieldCheck,
    label: '🟢 Healthy Spending',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  if (summary.safeToSpend < 0) {
    statusColor = 'text-rose-400';
    statusBg = 'from-rose-950/70 via-slate-900/90 to-rose-950/50 border-rose-500/40';
    statusBadge = {
      icon: AlertOctagon,
      label: '🔴 Overspending Alert',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    };
  } else if (spentRatio > 75 || summary.safeToSpend <= summary.dailySafeAllowance * 3) {
    statusColor = 'text-amber-400';
    statusBg = 'from-amber-950/60 via-slate-900/90 to-amber-950/40 border-amber-500/30';
    statusBadge = {
      icon: AlertTriangle,
      label: '🟡 Warning: Low Buffer',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-gradient-to-br ${statusBg} p-5 sm:p-7 shadow-xl shadow-black/40 transition-all`}>
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top bar: Badge & Formula explanation toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.badgeClass}`}>
              <StatusIcon className="w-3.5 h-3.5 mr-1" />
              {statusBadge.label}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline-flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {summary.daysRemainingInMonth} days remaining this month
            </span>
          </div>

          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>How is this calculated?</span>
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Main Headline Card */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">
              Remaining Discretionary Allowance
            </p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-1">
              You can safely spend{' '}
              <span className={`font-mono-num ${statusColor}`}>
                {formatCurrency(summary.safeToSpend)}
              </span>{' '}
              this month
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400 inline shrink-0" />
              Daily Safe Budget:{' '}
              <strong className="text-white font-mono-num">
                {formatCurrency(summary.dailySafeAllowance)} / day
              </strong>{' '}
              for the next {summary.daysRemainingInMonth} days.
            </p>
          </div>

          {/* Quick status bar */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 min-w-[240px]">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-400">Safe Pool Used</span>
              <span className="text-slate-200 font-mono-num font-semibold">
                {Math.min(100, Math.round(spentRatio))}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  summary.safeToSpend < 0
                    ? 'bg-rose-500'
                    : spentRatio > 75
                    ? 'bg-amber-500'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(5, spentRatio))}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono-num">
              <span>Spent: {formatCurrency(summary.variableExpenses)}</span>
              <span>Pool: {formatCurrency(totalSafePool)}</span>
            </div>
          </div>
        </div>

        {/* Expandable Breakdown Drawer */}
        {showBreakdown && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs bg-slate-900/60 p-4 rounded-xl">
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">💰 Monthly Income</span>
              <span className="text-base font-bold text-emerald-400 font-mono-num">
                +{formatCurrency(summary.totalIncome)}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">🏠 Fixed Expenses</span>
              <span className="text-base font-bold text-rose-400 font-mono-num">
                -{formatCurrency(summary.fixedExpenses)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Rent, EMI, Utilities</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">🏦 Planned Savings</span>
              <span className="text-base font-bold text-indigo-400 font-mono-num">
                -{formatCurrency(summary.plannedSavings)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Goals & Emergency</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <span className="text-slate-400 block mb-1">🛒 Current Variable</span>
              <span className="text-base font-bold text-amber-400 font-mono-num">
                -{formatCurrency(summary.variableExpenses)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Shopping, Food, Outings</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/90 border border-emerald-500/40">
              <span className="text-emerald-400 font-bold block mb-1">✅ Safely Available</span>
              <span className="text-base font-black text-white font-mono-num">
                ={formatCurrency(summary.safeToSpend)}
              </span>
              <span className="text-[10px] text-emerald-300/80 block mt-0.5">Guilt-free to spend!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
