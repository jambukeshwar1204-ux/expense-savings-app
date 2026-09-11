import React, { useState } from 'react';
import { useFinance } from '../../context/FinancialContext';
import { ExpenseCategory } from '../../types/finance';
import { CATEGORY_CONFIG } from '../../utils/categoryMeta';
import { X, PieChart } from 'lucide-react';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: ExpenseCategory;
  defaultLimit?: number;
}

export const AddBudgetModal: React.FC<AddBudgetModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'Shopping',
  defaultLimit,
}) => {
  const { saveBudget, budgets } = useFinance();

  const [category, setCategory] = useState<ExpenseCategory>(defaultCategory);
  const [limit, setLimit] = useState(defaultLimit ? String(defaultLimit) : '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = Object.keys(CATEGORY_CONFIG) as ExpenseCategory[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numLimit = parseFloat(limit);
    if (!numLimit || numLimit <= 0) {
      setError('Please specify a monthly budget greater than 0');
      return;
    }

    saveBudget({
      category,
      limit: numLimit,
    });

    setLimit('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Set Category Budget</h3>
              <p className="text-xs text-slate-400">Establish a monthly spending ceiling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Category *
            </label>
            <select
              value={category}
              onChange={e => {
                const newCat = e.target.value as ExpenseCategory;
                setCategory(newCat);
                const existing = budgets.find(b => b.category === newCat);
                if (existing) setLimit(String(existing.limit));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Monthly Limit (₹) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400 font-bold text-lg">
                ₹
              </div>
              <input
                type="number"
                required
                autoFocus
                placeholder="5,000"
                value={limit}
                onChange={e => setLimit(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-mono-num text-lg font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/20"
            >
              Save Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
