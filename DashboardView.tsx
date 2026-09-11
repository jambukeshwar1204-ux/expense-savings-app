import React from 'react';
import { useFinance } from '../../context/FinancialContext';
import { SafeToSpendBanner } from './SafeToSpendBanner';
import { FinancialFlowCard } from './FinancialFlowCard';
import { OverviewCards } from './OverviewCards';
import { CategoryExpenseGrid } from './CategoryExpenseGrid';
import { ExpenseCategory } from '../../types/finance';
import { Sparkles, Clock, ArrowRight } from 'lucide-react';
import { NavTab } from '../Navbar';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenAddIncome: () => void;
  onOpenAddExpense: (category?: ExpenseCategory) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenAddIncome,
  onOpenAddExpense,
}) => {
  const { insights, recurringExpenses, selectedMonth } = useFinance();

  // Top critical insight
  const priorityInsight = insights[0];

  // Upcoming bills due today or soon
  const today = new Date().getDate();
  const upcomingBills = recurringExpenses.filter(
    r => r.lastPaidMonth !== selectedMonth && r.dueDay >= today && r.dueDay <= today + 5
  );

  return (
    <div className="space-y-6">
      {/* 1. Important Feature: Prominent Hero Banner */}
      <SafeToSpendBanner />

      {/* Quick Attention Alerts (Top AI Insight + Upcoming Bill Reminder) */}
      {(priorityInsight || upcomingBills.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priorityInsight && (
            <div
              onClick={() => onNavigateTab('insights')}
              className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl p-2 rounded-xl bg-amber-500/20 text-amber-300">
                  {priorityInsight.icon}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Smart AI Alert
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {priorityInsight.message}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          )}

          {upcomingBills.length > 0 && (
            <div
              onClick={() => onNavigateTab('recurring')}
              className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 hover:border-teal-500/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl p-2 rounded-xl bg-teal-500/20 text-teal-300">
                  ⏰
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                    Bill Due Alert
                  </span>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {upcomingBills.length} recurring {upcomingBills.length === 1 ? 'bill is' : 'bills are'} due soon this week
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          )}
        </div>
      )}

      {/* 2. Main Goal: Step-by-Step Cash Flow Blueprint */}
      <FinancialFlowCard />

      {/* 3. 4 Main Financial Balance Metric Cards */}
      <OverviewCards />

      {/* 4. Category Expense Breakdown Grid (13 Categories) */}
      <CategoryExpenseGrid onSelectCategory={cat => onOpenAddExpense(cat)} />
    </div>
  );
};
