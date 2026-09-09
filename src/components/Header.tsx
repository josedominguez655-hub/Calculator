import React from 'react';
import { TrendingUp, RefreshCw, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onLoadSpreadsheetPreset: () => void;
  onLoadFormulaPreset: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadSpreadsheetPreset,
  onLoadFormulaPreset,
  onReset,
}) => {
  return (
    <header className="mb-4 pt-1">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 shrink-0">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
              Resurrection
            </h1>
            <p className="text-[11px] font-medium text-slate-500">
              Loss recovery calculator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <PWAInstallButton variant="compact" />
          
          <div className="relative group">
            <button
              id="btn-header-menu"
              aria-label="Presets and quick actions"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition"
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </button>
            <div className="absolute right-0 top-full mt-1.5 hidden w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl group-hover:block z-40">
              <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Presets
              </p>
              <button
                onClick={onLoadSpreadsheetPreset}
                className="w-full text-left px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition"
              >
                📊 Load Spreadsheet (234 shares)
              </button>
              <button
                onClick={onLoadFormulaPreset}
                className="w-full text-left px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg transition"
              >
                📐 Load 2% Formula (180 shares)
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={onReset}
                className="w-full text-left px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition"
              >
                <RefreshCw className="h-3 w-3" /> Reset inputs
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
