import React, { useState } from 'react';
import { useFinance } from '../../context/FinancialContext';
import { SavingsGoal } from '../../types/finance';
import { X, Target } from 'lucide-react';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose }) => {
  const { addSavingsGoal } = useFinance();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [savedAmount, setSavedAmount] = useState('');
  const [category, setCategory] = useState<SavingsGoal['category']>('Bike');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories: { label: SavingsGoal['category']; icon: string }[] = [
    { label: 'Bike', icon: '🏍️' },
    { label: 'Phone', icon: '📱' },
    { label: 'Travel', icon: '✈️' },
    { label: 'House', icon: '🏡' },
    { label: 'Emergency Fund', icon: '🛡️' },
    { label: 'Gadgets', icon: '💻' },
    { label: 'Other', icon: '🎯' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const initialSaved = parseFloat(savedAmount) || 0;

    if (!title.trim()) {
      setError('Please provide a goal name');
      return;
    }
    if (!target || target <= 0) {
      setError('Target amount must be greater than 0');
      return;
    }

    const selectedCategoryObj = categories.find(c => c.label === category);

    addSavingsGoal({
      title: title.trim(),
      targetAmount: target,
      savedAmount: initialSaved,
      category,
      icon: selectedCategoryObj ? selectedCategoryObj.icon : '🎯',
      targetDate: targetDate || undefined,
    });

    setTitle('');
    setTargetAmount('');
    setSavedAmount('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Savings Goal</h3>
              <p className="text-xs text-slate-400">Track progress toward a financial milestone</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Goal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. New Bike, iPhone 16 Pro, Dream Home"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Amount (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="1,00,000"
                value={targetAmount}
                onChange={e => setTargetAmount(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono-num text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Already Saved (₹)
              </label>
              <input
                type="number"
                placeholder="45,000"
                value={savedAmount}
                onChange={e => setSavedAmount(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono-num text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Goal Category *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(c => (
                <button
                  type="button"
                  key={c.label}
                  onClick={() => setCategory(c.label)}
                  className={`flex items-center space-x-1.5 p-2 rounded-xl border text-xs font-medium ${
                    category === c.label
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-base">{c.icon}</span>
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Deadline (Optional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

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
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02]"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
