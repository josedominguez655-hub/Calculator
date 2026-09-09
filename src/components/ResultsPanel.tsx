import React, { useState } from 'react';
import {
  BarChart3,
  Target,
  Tag,
  PlusCircle,
  Waves,
  Coins,
  Calculator,
  TrendingUp,
  Users,
  BookmarkPlus,
  Check,
  Copy,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { CalculationResult } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculator';

interface ResultsPanelProps {
  result: CalculationResult | null;
  onSave: () => void;
  isSaved?: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  onSave,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
          <BarChart3 className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">No Calculation Yet</h3>
        <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
          Enter your current position parameters above and tap Calculate to see the required shares and recovery price.
        </p>
      </div>
    );
  }

  const copySummary = () => {
    const text = `Resurrection Calculator Results:
• Original: ${result.shares1} shares @ ${formatCurrency(result.originalPrice)} (${formatCurrency(result.cost1)})
• Current Loss: ${formatPercent(result.lossPercent)} → Target Loss: ${formatPercent(result.targetLossPercent)}
• Current Price: ${formatCurrency(result.currentPrice)}
• Buy: ${result.roundedShares} shares (${result.shares2} exact)
• Additional Cost: ${formatCurrency(result.cost2)}
• Total Investment: ${formatCurrency(result.totalCost)}
• New Average Price: ${formatCurrency(result.newAvgPrice)}
• Total Shares: ${result.totalShares}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Results
          </h2>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          Based on the resurrection formula
        </span>
      </div>

      {/* Results Rows styled exactly as the mobile mockup */}
      <div className="divide-y divide-slate-100/80 text-xs">
        {/* Target Loss */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Target className="h-4 w-4 text-rose-500" />
            <span className="font-semibold">Target Loss</span>
          </div>
          <span className="inline-flex items-center justify-center min-w-[76px] px-3 py-1 rounded-lg font-bold text-rose-700 bg-rose-50 border border-rose-100/80">
            {formatPercent(result.targetLossPercent)}
          </span>
        </div>

        {/* Current Price */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Tag className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">Current Price</span>
          </div>
          <span className="inline-flex items-center justify-center min-w-[76px] px-3 py-1 rounded-lg font-bold text-blue-700 bg-blue-50 border border-blue-100/80">
            {result.currentPrice.toFixed(2)}
          </span>
        </div>

        {/* Shares 2 (to buy) */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5 text-slate-700">
            <PlusCircle className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Shares 2 (to buy)</span>
          </div>
          <span className="inline-flex items-center justify-center min-w-[76px] px-3 py-1 rounded-lg font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/80">
            {result.shares2.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Rounded Shares */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Waves className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Rounded Shares</span>
          </div>
          <span className="inline-flex items-center justify-center min-w-[76px] px-3 py-1 rounded-lg font-extrabold text-emerald-800 bg-emerald-100/80 border border-emerald-200">
            {result.roundedShares.toLocaleString()}
          </span>
        </div>

        {/* Cost 1 */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="font-semibold">Cost 1</span>
          </div>
          <span className="inline-flex items-center justify-center min-w-[76px] px-3 py-1 rounded-lg font-bold text-amber-800 bg-amber-50 border border-amber-100/80">
            {result.cost1.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Cost 2 */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Coins className="h-4 w-4 text-amber-600" />
            <span className="font-semibold">Cost 2</span>
          </div>
          <span className="inline-flex items-center justify-center min-w-[76px] px-3 py-1 rounded-lg font-bold text-amber-800 bg-amber-50 border border-amber-100/80">
            {result.cost2.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Total Cost */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Calculator className="h-4 w-4 text-amber-600" />
            <span className="font-semibold">Total Cost</span>
          </div>
          <span className="inline-flex items-center justify-center min-w-[76px] px-3 py-1 rounded-lg font-black text-amber-900 bg-amber-100 border-2 border-amber-300 shadow-xs">
            {result.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* New Avg Price */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5 text-slate-700">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="font-semibold">New Avg Price</span>
          </div>
          <span className="inline-flex items-center justify-center min-w-[76px] px-3 py-1 rounded-lg font-bold text-blue-700 bg-blue-50 border border-blue-100/80">
            {result.newAvgPrice.toFixed(2)}
          </span>
        </div>

        {/* Total Shares */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Users className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Total Shares</span>
          </div>
          <span className="inline-flex items-center justify-center min-w-[76px] px-3 py-1 rounded-lg font-bold text-emerald-800 bg-emerald-50 border border-emerald-100/80">
            {result.totalShares.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Safety & Risk Banner */}
      {result.warning && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold">{result.warning}</p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              Capital required for additional purchase is {result.capitalRatio}× the initial investment. Ensure this fits your risk management guidelines.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Explanation helper */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowExplanation(!showExplanation)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-700 transition"
        >
          <Info className="w-3.5 h-3.5 text-emerald-600" />
          <span>{showExplanation ? 'Hide calculation details' : 'View cost dilution breakdown'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="btn-copy-results"
            onClick={copySummary}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition"
            title="Copy summary to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            id="btn-save-history"
            onClick={onSave}
            disabled={isSaved}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition active:scale-95 ${
              isSaved
                ? 'bg-slate-100 text-slate-400 cursor-default'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
            }`}
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {showExplanation && (
        <div className="mt-3 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-200/80 space-y-2 animate-in fade-in">
          <h4 className="font-bold text-slate-900 text-xs">Mathematical Verification:</h4>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
            <li>Original Investment: {result.shares1} shares × ${result.originalPrice.toFixed(2)} = {formatCurrency(result.cost1)}</li>
            <li>Additional Purchase: {result.roundedShares} shares × ${result.currentPrice.toFixed(2)} = {formatCurrency(result.cost2)}</li>
            <li>Weighted Cost: ({formatCurrency(result.cost1)} + {formatCurrency(result.cost2)}) ÷ {result.totalShares} = <strong>${result.newAvgPrice.toFixed(2)} / share</strong></li>
            <li>New Loss: (${result.newAvgPrice.toFixed(2)} - ${result.currentPrice.toFixed(2)}) ÷ ${result.newAvgPrice.toFixed(2)} = <strong>{formatPercent(result.targetLossPercent)}</strong></li>
          </ul>
        </div>
      )}
    </div>
  );
};
