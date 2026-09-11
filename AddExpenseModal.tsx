import React, { useState } from 'react';
import { useFinance } from '../../context/FinancialContext';
import { ExpenseCategory, PaymentMethod, ExpenseNature } from '../../types/finance';
import { CATEGORY_CONFIG, PAYMENT_METHODS } from '../../utils/categoryMeta';
import { X, ArrowDownRight, Layers } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: ExpenseCategory;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'Food',
}) => {
  const { addExpense, selectedMonth } = useFinance();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(defaultCategory);
  const [nature, setNature] = useState<ExpenseNature>(
    CATEGORY_CONFIG[defaultCategory].defaultNature
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [date, setDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today.startsWith(selectedMonth) ? today : `${selectedMonth}-01`;
  });
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // When category changes, auto-recommend default nature (Fixed vs Variable)
  const handleCategoryChange = (newCat: ExpenseCategory) => {
    setCategory(newCat);
    setNature(CATEGORY_CONFIG[newCat].defaultNature);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a brief description');
      return;
    }

    addExpense({
      amount: numAmount,
      category,
      nature,
      paymentMethod,
      date,
      description: description.trim(),
    });

    // Reset
    setAmount('');
    setDescription('');
    setError('');
    onClose();
  };

  const categories = Object.keys(CATEGORY_CONFIG) as ExpenseCategory[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Expense</h3>
              <p className="text-xs text-slate-400">Log a new expenditure and categorize it</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium">
              {error}
            </div>
          )}

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Expense Amount (₹) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400 font-bold text-lg">
                ₹
              </div>
              <input
                type="number"
                step="any"
                required
                autoFocus
                placeholder="1,500"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono-num text-lg font-bold"
              />
            </div>
          </div>

          {/* Fixed vs Variable Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Expense Type</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {nature === 'Fixed' ? 'Rent, bills, EMIs' : 'Shopping, dining, movies'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setNature('Fixed')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  nature === 'Fixed'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔒 Fixed (Obligatory)
              </button>
              <button
                type="button"
                onClick={() => setNature('Variable')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  nature === 'Variable'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🛒 Variable (Discretionary)
              </button>
            </div>
          </div>

          {/* Category Selection Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
              {categories.map(catKey => {
                const info = CATEGORY_CONFIG[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    type="button"
                    key={catKey}
                    onClick={() => handleCategoryChange(catKey)}
                    className={`flex items-center space-x-2 p-2 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-base shrink-0">{info.icon}</span>
                    <span className="truncate">{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dinner with colleagues, Nike runners, Wi-Fi bill"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
            />
          </div>

          {/* Payment Method & Date (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 focus:outline-none focus:border-rose-500 text-sm"
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Expense Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 focus:outline-none focus:border-rose-500 text-sm"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
