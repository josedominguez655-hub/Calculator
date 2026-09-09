import React, { useState } from 'react';
import { Edit3, Coins, DollarSign, TrendingDown, Target, Calculator, AlertCircle, Tag, SlidersHorizontal } from 'lucide-react';
import { PositionInput, CalculationMode } from '../types';

interface CalculatorFormProps {
  input: PositionInput;
  onChange: (input: PositionInput) => void;
  onCalculate: () => void;
  error?: string | null;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  input,
  onChange,
  onCalculate,
  error,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Derived current price for display
  const derivedPrice = input.originalPrice > 0 && input.lossPercent > 0
    ? (input.originalPrice * (1 - input.lossPercent / 100)).toFixed(2)
    : '0.00';

  const handleModeChange = (newMode: CalculationMode) => {
    if (newMode === input.mode) return;
    if (newMode === 'target') {
      // Calculate target from reduction
      const target = Math.max(0, Number((input.lossPercent - input.reductionPercent).toFixed(2)));
      onChange({ ...input, mode: 'target', targetLossPercent: target });
    } else {
      // Calculate reduction from target
      const reduction = Math.max(0.01, Number((input.lossPercent - input.targetLossPercent).toFixed(2)));
      onChange({ ...input, mode: 'reduction', reductionPercent: reduction });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
        <div className="flex items-center gap-2">
          <Edit3 className="h-4 w-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Input Values
          </h2>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          Enter your current position
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Symbol & Mode Selector */}
        <div className="flex items-center justify-between gap-2 pb-1">
          <div className="flex items-center gap-1.5 flex-1 max-w-[150px]">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <input
              id="input-symbol"
              type="text"
              placeholder="Ticker (e.g. NVDA)"
              value={input.symbol}
              onChange={(e) => onChange({ ...input, symbol: e.target.value.toUpperCase() })}
              maxLength={8}
              className="w-full text-xs font-bold uppercase tracking-wider text-slate-800 placeholder:text-slate-400 focus:outline-none border-b border-transparent focus:border-emerald-500 py-0.5"
            />
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold text-slate-600">
            <button
              type="button"
              id="mode-reduction-tab"
              onClick={() => handleModeChange('reduction')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                input.mode === 'reduction'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Reduction %
            </button>
            <button
              type="button"
              id="mode-target-tab"
              onClick={() => handleModeChange('target')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                input.mode === 'target'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Target Loss %
            </button>
          </div>
        </div>

        {/* 2x2 Primary Inputs Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Box 1: Shares 1 */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-2.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
              <Coins className="h-3.5 w-3.5 text-emerald-600" />
              <label htmlFor="input-shares1" className="text-[11px] font-semibold text-slate-600">
                Shares 1
              </label>
            </div>
            <input
              id="input-shares1"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={input.shares1 || ''}
              onChange={(e) => onChange({ ...input, shares1: Number(e.target.value) })}
              className="w-full text-base font-bold text-slate-900 focus:outline-none bg-transparent"
              placeholder="75"
              required
            />
          </div>

          {/* Box 2: Price (per share) */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-2.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
              <label htmlFor="input-price" className="text-[11px] font-semibold text-slate-600">
                Price (per share)
              </label>
            </div>
            <div className="flex items-center">
              <span className="text-slate-400 font-semibold mr-0.5 text-sm">$</span>
              <input
                id="input-price"
                type="number"
                inputMode="decimal"
                min="0.0001"
                step="any"
                value={input.originalPrice || ''}
                onChange={(e) => onChange({ ...input, originalPrice: Number(e.target.value) })}
                className="w-full text-base font-bold text-slate-900 focus:outline-none bg-transparent"
                placeholder="3.88"
                required
              />
            </div>
          </div>

          {/* Box 3: Loss % */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-2.5 focus-within:border-red-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-500/10 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                <label htmlFor="input-loss" className="text-[11px] font-semibold text-slate-600">
                  Loss %
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <input
                id="input-loss"
                type="number"
                inputMode="decimal"
                min="0.01"
                max="99.99"
                step="any"
                value={input.lossPercent || ''}
                onChange={(e) => onChange({ ...input, lossPercent: Number(e.target.value) })}
                className="w-full text-base font-bold text-slate-900 focus:outline-none bg-transparent"
                placeholder="2.86"
                required
              />
              <span className="text-slate-400 font-bold text-sm ml-1">%</span>
            </div>
          </div>

          {/* Box 4: Reduction % OR Target Loss % */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-2.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
              <Target className="h-3.5 w-3.5 text-emerald-600" />
              <label htmlFor="input-target-reduction" className="text-[11px] font-semibold text-slate-600 truncate">
                {input.mode === 'reduction' ? 'Reduction %' : 'Target Loss %'}
              </label>
            </div>
            <div className="flex items-center justify-between">
              <input
                id="input-target-reduction"
                type="number"
                inputMode="decimal"
                min="0.01"
                max="99.99"
                step="any"
                value={
                  input.mode === 'reduction'
                    ? (input.reductionPercent || '')
                    : (input.targetLossPercent || '')
                }
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (input.mode === 'reduction') {
                    onChange({ ...input, reductionPercent: val });
                  } else {
                    onChange({ ...input, targetLossPercent: val });
                  }
                }}
                className="w-full text-base font-bold text-slate-900 focus:outline-none bg-transparent"
                placeholder={input.mode === 'reduction' ? '2.00' : '0.66'}
                required
              />
              <span className="text-slate-400 font-bold text-sm ml-1">%</span>
            </div>
          </div>
        </div>

        {/* Current Price and Context pill */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Current Market Price:</span>
            <span className="font-semibold text-slate-800">${derivedPrice}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition"
          >
            <SlidersHorizontal className="w-3 h-3" />
            {showAdvanced ? 'Hide manual price' : 'Manual price override'}
          </button>
        </div>

        {showAdvanced && (
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/60 text-xs animate-in fade-in duration-150">
            <label htmlFor="input-price-override" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Exact Market Price Override ($)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 flex-1">
                <span className="text-slate-400 font-semibold mr-1">$</span>
                <input
                  id="input-price-override"
                  type="number"
                  step="any"
                  placeholder={derivedPrice}
                  value={input.currentPriceOverride || ''}
                  onChange={(e) => onChange({ ...input, currentPriceOverride: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full font-medium text-slate-900 focus:outline-none text-xs"
                />
              </div>
              {input.currentPriceOverride && (
                <button
                  type="button"
                  onClick={() => onChange({ ...input, currentPriceOverride: undefined })}
                  className="text-[11px] text-slate-500 hover:text-red-600 underline"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="mt-1 text-[10px] text-slate-400">
              Leave blank to automatically compute from Original Price and Loss %.
            </p>
          </div>
        )}

        {/* Validation Error Alert */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-100 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <p className="font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Calculate Button */}
        <button
          id="btn-calculate"
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-4 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Calculator className="h-4 w-4" />
          <span>Calculate</span>
        </button>
      </form>
    </div>
  );
};
