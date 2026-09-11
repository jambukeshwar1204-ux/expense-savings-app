import React from 'react';
import {
  LayoutDashboard,
  PiggyBank,
  PieChart,
  TrendingUp,
  Clock,
  Sparkles,
  ReceiptText,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'savings'
  | 'budgets'
  | 'analytics'
  | 'recurring'
  | 'insights'
  | 'transactions';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  insightsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, insightsCount }) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'savings' as NavTab, label: 'Savings & Goals', icon: PiggyBank },
    { id: 'budgets' as NavTab, label: 'Budgets', icon: PieChart },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: TrendingUp },
    { id: 'recurring' as NavTab, label: 'Recurring Bills', icon: Clock },
    {
      id: 'insights' as NavTab,
      label: 'AI Insights',
      icon: Sparkles,
      badge: insightsCount > 0 ? insightsCount : null,
    },
    { id: 'transactions' as NavTab, label: 'Transactions', icon: ReceiptText },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Navigation */}
      <nav className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Fixed Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex justify-around items-center">
        {tabs.slice(0, 5).map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
        {/* Extra tab trigger for mobile */}
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
            activeTab === 'insights' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-amber-400" />
          <span className="text-[10px] font-medium">Insights</span>
        </button>
      </div>
    </>
  );
};
