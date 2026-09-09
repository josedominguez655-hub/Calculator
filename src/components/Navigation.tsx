import React from 'react';
import { Calculator, History, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  historyCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  historyCount,
}) => {
  return (
    <nav
      id="bottom-navigation"
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,12px)] pt-2"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-4">
        {/* Calculator Tab */}
        <button
          id="tab-calculator"
          onClick={() => onChangeTab('calculator')}
          className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-bold transition-all cursor-pointer ${
            activeTab === 'calculator'
              ? 'text-emerald-700'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
              activeTab === 'calculator' ? 'bg-emerald-100/90 text-emerald-800' : 'bg-transparent'
            }`}
          >
            <Calculator className="h-4 w-4" />
          </div>
          <span>Calculator</span>
        </button>

        {/* History Tab */}
        <button
          id="tab-history"
          onClick={() => onChangeTab('history')}
          className={`relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'text-emerald-700'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
              activeTab === 'history' ? 'bg-emerald-100/90 text-emerald-800' : 'bg-transparent'
            }`}
          >
            <History className="h-4 w-4" />
            {historyCount > 0 && (
              <span className="absolute top-1 right-[calc(50%-18px)] flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-black text-white">
                {historyCount}
              </span>
            )}
          </div>
          <span>History</span>
        </button>

        {/* Settings Tab */}
        <button
          id="tab-settings"
          onClick={() => onChangeTab('settings')}
          className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-bold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'text-emerald-700'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
              activeTab === 'settings' ? 'bg-emerald-100/90 text-emerald-800' : 'bg-transparent'
            }`}
          >
            <Settings className="h-4 w-4" />
          </div>
          <span>Settings</span>
        </button>
      </div>
    </nav>
  );
};
