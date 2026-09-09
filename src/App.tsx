import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsPanel } from './components/ResultsPanel';
import { FormulaCard } from './components/FormulaCard';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { Navigation } from './components/Navigation';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  calculateResurrection,
  PRESET_SPREADSHEET_EXACT,
  PRESET_STANDARD_FORMULA,
} from './utils/calculator';
import { ActiveTab, CalculationResult, PositionInput, SavedCalculation } from './types';

const STORAGE_KEY = 'resurrection_calc_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [input, setInput] = useState<PositionInput>(PRESET_SPREADSHEET_EXACT);
  const [result, setResult] = useState<CalculationResult | null>(() => {
    try {
      return calculateResurrection(PRESET_SPREADSHEET_EXACT);
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedCalculation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSaved, setIsSaved] = useState(false);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore storage errors
    }
  }, [history]);

  const handleCalculate = () => {
    try {
      setError(null);
      const calculated = calculateResurrection(input);
      setResult(calculated);
      setIsSaved(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while calculating the formula.');
      }
    }
  };

  const handleSave = () => {
    if (!result) return;
    const newItem: SavedCalculation = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      symbol: input.symbol || 'POSITION',
      input: { ...input },
      result: { ...result },
    };
    setHistory((prev) => [newItem, ...prev]);
    setIsSaved(true);
  };

  const handleLoadSaved = (saved: SavedCalculation) => {
    setInput(saved.input);
    setResult(saved.result);
    setError(null);
    setIsSaved(true);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all saved trade calculations?')) {
      setHistory([]);
    }
  };

  const handleLoadSpreadsheetPreset = () => {
    setInput(PRESET_SPREADSHEET_EXACT);
    try {
      const calc = calculateResurrection(PRESET_SPREADSHEET_EXACT);
      setResult(calc);
      setError(null);
      setIsSaved(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
    setActiveTab('calculator');
  };

  const handleLoadFormulaPreset = () => {
    setInput(PRESET_STANDARD_FORMULA);
    try {
      const calc = calculateResurrection(PRESET_STANDARD_FORMULA);
      setResult(calc);
      setError(null);
      setIsSaved(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
    setActiveTab('calculator');
  };

  const handleReset = () => {
    setInput({
      symbol: '',
      shares1: 100,
      originalPrice: 10.0,
      lossPercent: 5.0,
      reductionPercent: 2.5,
      targetLossPercent: 2.5,
      mode: 'reduction',
    });
    setResult(null);
    setError(null);
    setIsSaved(false);
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all saved calculations and restore defaults?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
      handleLoadSpreadsheetPreset();
      setActiveTab('calculator');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100/70 via-slate-50 to-emerald-50/20 text-slate-900 pb-28">
      {/* Mobile-first centered container */}
      <main className="mx-auto w-full max-w-md px-3.5 pt-3 sm:px-4 sm:pt-4">
        <Header
          onLoadSpreadsheetPreset={handleLoadSpreadsheetPreset}
          onLoadFormulaPreset={handleLoadFormulaPreset}
          onReset={handleReset}
        />

        {activeTab === 'calculator' && (
          <div className="space-y-3.5">
            <CalculatorForm
              input={input}
              onChange={(newInput) => {
                setInput(newInput);
                setIsSaved(false);
              }}
              onCalculate={handleCalculate}
              error={error}
            />

            <ResultsPanel
              result={result}
              onSave={handleSave}
              isSaved={isSaved}
            />

            <FormulaCard />
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onLoad={handleLoadSaved}
            onDelete={handleDeleteHistory}
            onClear={handleClearHistory}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView onResetAll={handleResetAll} />
        )}
      </main>

      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* Bottom Mobile Navigation */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        historyCount={history.length}
      />
    </div>
  );
}
