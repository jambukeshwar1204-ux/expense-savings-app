import React, { useState } from 'react';
import { useFinance } from '../../context/FinancialContext';
import { ExpenseCategory, PaymentMethod } from '../../types/finance';
import { CATEGORY_CONFIG, PAYMENT_METHODS } from '../../utils/categoryMeta';
import { X, Clock } from 'lucide-react';

interface AddRecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddRecurringModal: React.FC<AddRecurringModalProps> = ({ isOpen, onClose }) => {
  const { addRecurringExpense } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Rent');
  const [dueDay, setDueDay] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Net Banking');
  const [autoPay, setAutoPay] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = Object.keys(CATEGORY_CONFIG) as ExpenseCategory[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim()) {
      setError('Please provide a title for the recurring bill');
      return;
    }
    if (!numAmount || numAmount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    if (dueDay < 1 || dueDay > 31) {
      setError('Due day must be between 1 and 31');
      return;
    }

    addRecurringExpense({
      title: title.trim(),
      amount: numAmount,
      category,
      dueDay,
      paymentMethod,
      nature: 'Fixed',
      autoPay,
    });

    setTitle('');
    setAmount('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Recurring Bill</h3>
              <p className="text-xs text-slate-400">Set scheduled monthly obligations & reminders</p>
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
              Bill Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. House Rent, Fiber Internet, Netflix, Car EMI"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Amount (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="10,000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono-num font-bold focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Due Day of Month *
              </label>
              <input
                type="number"
                min="1"
                max="31"
                required
                value={dueDay}
                onChange={e => setDueDay(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-mono-num focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {CATEGORY_CONFIG[cat].icon} {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-teal-500 text-sm"
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="autopay-check"
              checked={autoPay}
              onChange={e => setAutoPay(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-teal-500 focus:ring-teal-500 h-4 w-4"
            />
            <label htmlFor="autopay-check" className="text-xs text-slate-300 cursor-pointer">
              Enabled for Auto-Debit / Standing Instruction
            </label>
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
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-teal-600/20"
            >
              Save Recurring Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
