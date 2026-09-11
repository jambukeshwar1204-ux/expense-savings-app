import React, { useState } from 'react';
import { useFinance } from '../../context/FinancialContext';
import { InsightsEngine } from '../../services/insightsEngine';
import { formatCurrency, formatPercentage } from '../../utils/categoryMeta';
import {
  Sparkles,
  Sliders,
  Send,
  Bot,
} from 'lucide-react';

export const SmartInsightsSection: React.FC = () => {
  const { insights, summary, expenses, savingsGoals, selectedMonth } = useFinance();

  // "What-If" interactive simulation state
  const [sliderCutback, setSliderCutback] = useState(1500);

  // AI Chat question state
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hello! I'm your WealthPulse AI Financial Advisor. Based on your ${selectedMonth} data, you have ${formatCurrency(summary.safeToSpend)} safely remaining to spend, and your savings rate is ${formatPercentage(summary.savingsRate)}. Ask me anything about your budget, affordability, or savings pacing!`,
    },
  ]);

  // Compute what-if impacts
  const simulatedSavings = summary.plannedSavings + sliderCutback;
  const simulatedSavingsRate =
    summary.totalIncome > 0 ? (simulatedSavings / summary.totalIncome) * 100 : 0;
  const rateIncrease = simulatedSavingsRate - summary.savingsRate;

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userText = question.trim();
    setQuestion('');

    const answer = InsightsEngine.answerFinancialQuery(
      userText,
      summary,
      savingsGoals,
      expenses,
      selectedMonth
    );

    setChatLog(prev => [
      ...prev,
      { role: 'user', text: userText },
      { role: 'assistant', text: answer },
    ]);
  };

  const handleQuickQuestion = (q: string) => {
    const answer = InsightsEngine.answerFinancialQuery(
      q,
      summary,
      savingsGoals,
      expenses,
      selectedMonth
    );
    setChatLog(prev => [
      ...prev,
      { role: 'user', text: q },
      { role: 'assistant', text: answer },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-5 sm:p-7 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Smart AI Financial Insights</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time algorithmic pattern detection, fixed-cost alerts, and what-if simulation engine.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Intelligence Engine</span>
        </div>
      </div>

      {/* Generated Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map(insight => {
          let cardBorder = 'border-slate-800 hover:border-slate-700';
          let badgeColor = 'bg-slate-800 text-slate-300';

          if (insight.type === 'alert') {
            cardBorder = 'border-amber-500/30 bg-amber-950/10';
            badgeColor = 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
          } else if (insight.type === 'warning') {
            cardBorder = 'border-rose-500/30 bg-rose-950/10';
            badgeColor = 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
          } else if (insight.type === 'positive') {
            cardBorder = 'border-emerald-500/30 bg-emerald-950/10';
            badgeColor = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
          } else if (insight.type === 'goal') {
            cardBorder = 'border-purple-500/30 bg-purple-950/10';
            badgeColor = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
          } else if (insight.type === 'tip') {
            cardBorder = 'border-teal-500/30 bg-teal-950/10';
            badgeColor = 'bg-teal-500/20 text-teal-300 border border-teal-500/30';
          }

          return (
            <div
              key={insight.id}
              className={`glass-card rounded-2xl p-5 border transition-all flex flex-col justify-between ${cardBorder}`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-900/80 shrink-0">
                      {insight.icon}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white">{insight.title}</h3>
                      {insight.category && (
                        <span className="text-[10px] text-slate-400">{insight.category} Category</span>
                      )}
                    </div>
                  </div>
                  {insight.highlight && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                      {insight.highlight}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-200 font-medium leading-relaxed mb-3">
                  {insight.message}
                </p>
              </div>

              {insight.actionableRecommendation && (
                <div className="pt-3 border-t border-slate-800/80 mt-2">
                  <p className="text-xs text-slate-400 flex items-start gap-1.5">
                    <strong className="text-emerald-400 shrink-0">Action:</strong>
                    <span>{insight.actionableRecommendation}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive What-If Simulator */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Interactive "What-If" Savings Simulator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag the slider to test how cutting discretionary spending boosts your monthly savings
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            Live Projection
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Slider input */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300">Reduce Shopping / Discretionary by:</span>
              <span className="text-base font-bold text-indigo-400 font-mono-num">
                {formatCurrency(sliderCutback)}
              </span>
            </div>

            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={sliderCutback}
              onChange={e => setSliderCutback(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />

            <div className="flex justify-between text-[11px] text-slate-500 font-mono-num">
              <span>₹500</span>
              <span>₹5,000</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* Result card */}
          <div className="lg:col-span-6 bg-slate-900/80 p-5 rounded-xl border border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">New Monthly Savings</span>
              <span className="text-xl sm:text-2xl font-black font-mono-num text-emerald-400">
                {formatCurrency(simulatedSavings)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Up from {formatCurrency(summary.plannedSavings)}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">New Savings Rate</span>
              <span className="text-xl sm:text-2xl font-black font-mono-num text-purple-400">
                {formatPercentage(simulatedSavingsRate)}
              </span>
              <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">
                +{rateIncrease.toFixed(1)}% boost!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Financial Advisor Interactive Q&A */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Ask Financial Advisor AI</h3>
            <p className="text-xs text-slate-400">
              Get instant, context-aware answers about your affordability, savings, and spending habits
            </p>
          </div>
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleQuickQuestion('Can I afford to buy a laptop for ₹40,000 this month?')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            "Can I afford to buy a laptop for ₹40,000?"
          </button>
          <button
            onClick={() => handleQuickQuestion('How can I boost my monthly savings rate?')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            "How can I boost my savings rate?"
          </button>
          <button
            onClick={() => handleQuickQuestion('What is my highest spending category this month?')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            "What is my highest spending category?"
          </button>
        </div>

        {/* Chat message display */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 max-h-64 overflow-y-auto space-y-3 mb-4">
          {chatLog.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Question input */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask anything, e.g. 'Can I spend ₹5,000 this weekend on travel?'"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-xs sm:text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm flex items-center space-x-1 shadow-lg shadow-purple-600/20"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
