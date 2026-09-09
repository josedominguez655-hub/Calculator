import React from 'react';
import { Smartphone, BookOpen, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsViewProps {
  onResetAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetAll }) => {
  return (
    <div className="space-y-4">
      {/* PWA Mobile Installation Card */}
      <PWAInstallButton variant="card" />

      {/* About the Resurrection Formula */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 mb-3">
          <BookOpen className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">About the System</h3>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            The <strong>Resurrection Calculator</strong> is an algorithmic position management system designed to systematically lower the average entry price of a losing stock trade down to a calibrated threshold.
          </p>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1.5 font-mono text-[11px] text-slate-800">
            <p className="font-bold text-slate-900">Core Equation:</p>
            <p className="text-emerald-800">
              Shares 2 = (Shares 1 × Reduction) / ((1 - Loss/100) × (Loss - Reduction))
            </p>
          </div>
          <p className="text-[11px] text-slate-500">
            Unlike arbitrary martingale averaging down, this formula ensures you buy only the mathematical minimum number of shares required to dilute your break-even price to your exact target loss.
          </p>
        </div>
      </div>

      {/* Device & Offline Compliance */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 mb-3">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Mobile & Device Status</h3>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Target Devices:</span>
            <span className="font-semibold text-slate-900">Android, Samsung Fold, iOS Safari, Desktop</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Offline Functionality:</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Client-Side
            </span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">App Version:</span>
            <span className="font-mono text-slate-700">v1.2.0 (PWA-enabled)</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500">Data Storage:</span>
            <span className="font-medium text-slate-700">Encrypted Local Storage (Private)</span>
          </div>
        </div>
      </div>

      {/* Danger / Reset zone */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <h4 className="text-xs font-bold text-slate-900 mb-1">Reset All Application Data</h4>
        <p className="text-[11px] text-slate-500 mb-3">
          Clear all saved trade calculations and reset the form inputs back to defaults.
        </p>
        <button
          onClick={onResetAll}
          className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 active:scale-95 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Everything
        </button>
      </div>
    </div>
  );
};
