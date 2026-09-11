import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../context/FinancialContext';
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Sparkles,
  Trash2,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddIncome, onOpenAddExpense }) => {
  const {
    selectedMonth,
    setSelectedMonth,
    resetData,
    clearMonthExpenses,
    clearAllExpenses,
    clearAllData,
  } = useFinance();

  const [isResetMenuOpen, setIsResetMenuOpen] = useState(false);
  const resetMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (resetMenuRef.current && !resetMenuRef.current.contains(e.target as Node)) {
        setIsResetMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthOptions = [
    { value: '2026-09', label: 'September 2026 (Current)' },
    { value: '2026-08', label: 'August 2026' },
    { value: '2026-07', label: 'July 2026' },
    { value: '2026-06', label: 'June 2026' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-xl">
              ₹
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  Wealth<span className="text-emerald-400">Pulse</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3 mr-1" /> Smart Track
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Personal Expense & Savings Balance
              </p>
            </div>
          </div>

          {/* Center / Month Selector */}
          <div className="flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/60 shadow-inner">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              aria-label="Select month"
              className="bg-transparent text-xs sm:text-sm font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {monthOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Right actions: Reset Dropdown & Quick Add buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Reset Menu Dropdown */}
            <div className="relative" ref={resetMenuRef}>
              <button
                onClick={() => setIsResetMenuOpen(!isResetMenuOpen)}
                className="flex items-center space-x-1 px-2.5 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors text-xs font-medium border border-slate-700/60"
                title="Reset or clear expenses and data"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Reset / Clear</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isResetMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Reset & Clear Options
                  </div>

                  {/* 1. Clear this month's expenses */}
                  <button
                    onClick={() => {
                      if (confirm(`Clear all expenses for ${selectedMonth}? This will reset spending to ₹0.`)) {
                        clearMonthExpenses();
                        setIsResetMenuOpen(false);
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <div>
                      <p className="font-semibold">Clear {selectedMonth} Expenses</p>
                      <span className="text-[10px] text-slate-400">Resets this month's spent to ₹0</span>
                    </div>
                  </button>

                  {/* 2. Clear all expenses across all months */}
                  <button
                    onClick={() => {
                      if (confirm('Clear all expenses across all months?')) {
                        clearAllExpenses();
                        setIsResetMenuOpen(false);
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <div>
                      <p className="font-semibold">Clear All Expenses (All Months)</p>
                      <span className="text-[10px] text-slate-400">Keeps income, goals & budgets</span>
                    </div>
                  </button>

                  {/* 3. Reset to demo data */}
                  <button
                    onClick={() => {
                      if (confirm('Reset everything to sample demo data?')) {
                        resetData();
                        setIsResetMenuOpen(false);
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <div>
                      <p className="font-semibold">Reset to Sample Demo Data</p>
                      <span className="text-[10px] text-slate-400">Reloads realistic sample numbers</span>
                    </div>
                  </button>

                  {/* 4. Complete fresh start */}
                  <button
                    onClick={() => {
                      if (confirm('Clear all data completely for a clean blank start?')) {
                        clearAllData();
                        setIsResetMenuOpen(false);
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <div>
                      <p className="font-semibold">Start Fresh (Clear All Data)</p>
                      <span className="text-[10px] text-slate-500">Wipes all incomes & expenses to ₹0</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onOpenAddIncome}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all font-medium text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>+ Income</span>
            </button>

            <button
              onClick={onOpenAddExpense}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-md shadow-rose-500/20 transition-all font-medium text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>+ Expense</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
