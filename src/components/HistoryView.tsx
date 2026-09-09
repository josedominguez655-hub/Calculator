import React from 'react';
import { History, Trash2, ArrowUpRight, Clock, FileDown } from 'lucide-react';
import { SavedCalculation } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculator';

interface HistoryViewProps {
  history: SavedCalculation[];
  onLoad: (calc: SavedCalculation) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onLoad,
  onDelete,
  onClear,
}) => {
  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = ['Date', 'Symbol', 'Shares 1', 'Original Price', 'Loss %', 'Target Loss %', 'Shares to Buy', 'New Avg Price', 'Total Cost'];
    const rows = history.map(item => [
      new Date(item.timestamp).toLocaleString(),
      item.symbol || 'N/A',
      item.input.shares1,
      item.input.originalPrice,
      item.result.lossPercent,
      item.result.targetLossPercent,
      item.result.roundedShares,
      item.result.newAvgPrice,
      item.result.totalCost,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `resurrection_calculator_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
          <History className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No Saved Calculations</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
          Whenever you calculate a trade recovery scenario, tap the "Save" button to keep it here for quick reference during market hours.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Trade History</h2>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            {history.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-emerald-700 transition"
          >
            <FileDown className="w-3.5 h-3.5" />
            CSV
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-red-600 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {history.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition"
          >
            <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-xs tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.symbol || 'STOCK'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {item.input.shares1} shs @ ${item.input.originalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onLoad(item)}
                  className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition active:scale-95"
                  title="Load into Calculator"
                >
                  Load
                  <ArrowUpRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded-lg p-1 text-slate-300 hover:text-red-500 transition"
                  title="Delete from history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                <p className="text-[10px] text-slate-400 font-medium">Loss → Target</p>
                <p className="font-bold text-slate-800 text-xs">
                  {formatPercent(item.result.lossPercent, 1)} → {formatPercent(item.result.targetLossPercent, 1)}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50/70 p-2 border border-emerald-100">
                <p className="text-[10px] text-emerald-700 font-medium">Buy Shares</p>
                <p className="font-extrabold text-emerald-900 text-xs">
                  +{item.result.roundedShares}
                </p>
              </div>
              <div className="rounded-xl bg-blue-50/70 p-2 border border-blue-100">
                <p className="text-[10px] text-blue-700 font-medium">New Avg</p>
                <p className="font-bold text-blue-900 text-xs">
                  ${item.result.newAvgPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between pt-1 text-right">
              <span>Total Investment:</span>
              <span className="font-bold text-slate-800">{formatCurrency(item.result.totalCost)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
