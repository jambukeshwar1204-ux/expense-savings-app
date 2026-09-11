import React, { useState } from 'react';
import { useFinance } from '../../context/FinancialContext';
import { CATEGORY_CONFIG, formatCurrency } from '../../utils/categoryMeta';
import {
  Clock,
  Plus,
  CheckCircle2,
  Calendar,
  CreditCard,
  Trash2,
  Zap,
} from 'lucide-react';
import { AddRecurringModal } from '../forms/AddRecurringModal';

export const RecurringExpensesSection: React.FC = () => {
  const { recurringExpenses, selectedMonth, markRecurringAsPaid, deleteRecurringExpense } =
    useFinance();

  const [isAddOpen, setIsAddOpen] = useState(false);

  // Date comparison for reminders
  const today = new Date();
  const currentDay = today.getDate();

  // Metrics
  const totalCommitment = recurringExpenses.reduce((sum, r) => sum + r.amount, 0);
  const paidCommitment = recurringExpenses
    .filter(r => r.lastPaidMonth === selectedMonth)
    .reduce((sum, r) => sum + r.amount, 0);
  const pendingCommitment = totalCommitment - paidCommitment;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-5 sm:p-7 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Clock className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Recurring Bills & Fixed Commitments
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track fixed commitments (Rent, EMI, Utilities, OTT) with proactive due-date alerts.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.02] self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recurring Bill</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Monthly Bills</span>
          <p className="text-2xl sm:text-3xl font-black font-mono-num text-white mt-1">
            {formatCurrency(totalCommitment)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{recurringExpenses.length} scheduled bills</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Cleared This Month</span>
          <p className="text-2xl sm:text-3xl font-black font-mono-num text-emerald-400 mt-1">
            {formatCurrency(paidCommitment)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {recurringExpenses.filter(r => r.lastPaidMonth === selectedMonth).length} bills settled
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <span className="text-xs font-semibold uppercase text-slate-400">Pending Due</span>
          <p className="text-2xl sm:text-3xl font-black font-mono-num text-amber-400 mt-1">
            {formatCurrency(pendingCommitment)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Remaining commitments for {selectedMonth}
          </p>
        </div>
      </div>

      {/* Bills Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recurringExpenses.map(bill => {
          const catMeta = CATEGORY_CONFIG[bill.category];
          const isPaid = bill.lastPaidMonth === selectedMonth;

          // Due status calculation
          let dueStatusText = '';
          let dueBadgeColor = '';

          if (isPaid) {
            dueStatusText = 'Paid this month';
            dueBadgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
          } else if (bill.dueDay === currentDay) {
            dueStatusText = '⚠️ Due Today!';
            dueBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
          } else if (bill.dueDay > currentDay) {
            const diff = bill.dueDay - currentDay;
            dueStatusText = diff === 1 ? 'Due tomorrow' : `Due in ${diff} days`;
            dueBadgeColor = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
          } else {
            dueStatusText = `Due on ${bill.dueDay}th (Pending)`;
            dueBadgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
          }

          return (
            <div
              key={bill.id}
              className={`glass-card rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isPaid ? 'border-slate-800/80 opacity-90' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl p-2 rounded-xl bg-slate-800/80">{catMeta.icon}</span>
                    <div>
                      <h3 className="text-base font-bold text-white">{bill.title}</h3>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span>{bill.category}</span>
                        {bill.autoPay && (
                          <span className="inline-flex items-center text-[10px] text-teal-400">
                            <Zap className="w-3 h-3 mr-0.5" /> Auto-Pay
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteRecurringExpense(bill.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 my-3">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-xs text-slate-400">Monthly Amount:</span>
                    <span className="text-lg font-bold font-mono-num text-white">
                      {formatCurrency(bill.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      Due on {bill.dueDay}th of month
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-slate-500" />
                      {bill.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${dueBadgeColor}`}>
                  {dueStatusText}
                </span>

                {!isPaid ? (
                  <button
                    onClick={() => markRecurringAsPaid(bill.id)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Paid</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Settled
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddRecurringModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};
