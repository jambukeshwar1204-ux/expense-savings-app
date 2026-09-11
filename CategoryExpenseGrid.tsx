import React from 'react';
import { useFinance } from '../../context/FinancialContext';
import { CATEGORY_CONFIG, formatCurrency, formatPercentage } from '../../utils/categoryMeta';
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { ExpenseCategory } from '../../types/finance';

interface CategoryExpenseGridProps {
  onSelectCategory?: (category: ExpenseCategory) => void;
}

export const CategoryExpenseGrid: React.FC<CategoryExpenseGridProps> = ({ onSelectCategory }) => {
  const { categoryBreakdowns, summary } = useFinance();

  // Filter categories that have expenses or budgets set, or default key ones
  const keyCategories: ExpenseCategory[] = [
    'Rent',
    'Shopping',
    'Food',
    'Transport',
    'Electricity/Water/Internet',
    'Mobile',
    'Entertainment',
    'Medical',
    'EMI/Loans',
    'Family',
    'Education',
    'Travel',
    'Other',
  ];

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>Category Spending Breakdown</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              13 Categories
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time spending across monthly living categories
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {keyCategories.map(catKey => {
          const catInfo = CATEGORY_CONFIG[catKey];
          const breakdown = categoryBreakdowns.find(b => b.category === catKey);
          const amount = breakdown ? breakdown.amount : 0;
          const percentage = breakdown ? breakdown.percentage : 0;
          const budget = breakdown?.budget;
          const isOver = breakdown?.isOverBudget;
          const usedPct = breakdown?.usedPercentage || 0;

          // Status indicator
          let statusBadge = null;
          if (budget) {
            if (isOver) {
              statusBadge = (
                <span className="inline-flex items-center text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/30">
                  <ShieldAlert className="w-3 h-3 mr-0.5" /> Over by {formatCurrency(breakdown.overAmount)}
                </span>
              );
            } else if (usedPct >= 80) {
              statusBadge = (
                <span className="inline-flex items-center text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                  🟡 {usedPct.toFixed(0)}% used
                </span>
              );
            } else {
              statusBadge = (
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  🟢 {formatCurrency(budget - amount)} left
                </span>
              );
            }
          }

          return (
            <div
              key={catKey}
              onClick={() => onSelectCategory && onSelectCategory(catKey)}
              className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl p-1.5 rounded-lg bg-slate-800/80">{catInfo.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {catInfo.label}
                      </h3>
                      <span className="text-[10px] text-slate-400 inline-block">
                        {catInfo.defaultNature} Expense
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono-num font-medium text-slate-400">
                    {formatPercentage(percentage)}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold font-mono-num text-white">
                      {formatCurrency(amount)}
                    </span>
                    {budget && (
                      <span className="text-[11px] text-slate-400 font-mono-num">
                        / {formatCurrency(budget)}
                      </span>
                    )}
                  </div>

                  {/* Progress bar if budget exists */}
                  {budget && (
                    <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOver ? 'bg-rose-500' : usedPct > 80 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, usedPct)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                {statusBadge ? (
                  statusBadge
                ) : (
                  <span className="text-slate-500 italic">No budget set</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
