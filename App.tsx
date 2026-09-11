import React, { useState } from 'react';
import { FinancialProvider, useFinance } from './context/FinancialContext';
import { Header } from './components/Header';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { SavingsSection } from './components/savings/SavingsSection';
import { BudgetSystem } from './components/budget/BudgetSystem';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { SmartInsightsSection } from './components/insights/SmartInsightsSection';
import { RecurringExpensesSection } from './components/recurring/RecurringExpensesSection';
import { TransactionHistory } from './components/transactions/TransactionHistory';
import { AddIncomeModal } from './components/forms/AddIncomeModal';
import { AddExpenseModal } from './components/forms/AddExpenseModal';
import { ExpenseCategory } from './types/finance';

const MainContent: React.FC = () => {
  const { insights } = useFinance();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState<ExpenseCategory | undefined>(undefined);

  const handleOpenAddExpense = (cat?: ExpenseCategory) => {
    setSelectedExpenseCategory(cat);
    setIsAddExpenseOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Header */}
      <Header
        onOpenAddIncome={() => setIsAddIncomeOpen(true)}
        onOpenAddExpense={() => handleOpenAddExpense(undefined)}
      />

      {/* Primary Navigation Tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        insightsCount={insights.length}
      />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16 sm:mb-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigateTab={setActiveTab}
            onOpenAddIncome={() => setIsAddIncomeOpen(true)}
            onOpenAddExpense={handleOpenAddExpense}
          />
        )}

        {activeTab === 'savings' && <SavingsSection />}

        {activeTab === 'budgets' && <BudgetSystem />}

        {activeTab === 'analytics' && <AnalyticsPage />}

        {activeTab === 'recurring' && <RecurringExpensesSection />}

        {activeTab === 'insights' && <SmartInsightsSection />}

        {activeTab === 'transactions' && <TransactionHistory />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>WealthPulse &copy; 2026 — Personal Expense & Savings Balance Platform</span>
          <span>Scalable local-first architecture ready for Cloud/AI synchronization</span>
        </div>
      </footer>

      {/* Global Add Income Modal */}
      <AddIncomeModal
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
      />

      {/* Global Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        defaultCategory={selectedExpenseCategory}
      />
    </div>
  );
};

export function App() {
  return (
    <FinancialProvider>
      <MainContent />
    </FinancialProvider>
  );
}

export default App;
