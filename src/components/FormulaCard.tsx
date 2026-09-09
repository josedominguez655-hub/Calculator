import React, { useState } from 'react';
import { FlaskConical, ChevronRight, X, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';

export const FormulaCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 transition-all hover:bg-emerald-50/80">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              Formula
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition cursor-pointer"
          >
            <span>How it works?</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* The Exact Formula display matching mockup */}
        <div className="rounded-xl bg-white/90 border border-emerald-200/80 p-3 font-mono text-[11px] sm:text-xs text-emerald-950 shadow-2xs overflow-x-auto">
          <p className="whitespace-pre text-center leading-relaxed">
            Shares to Buy = (Shares 1 × Reduction) /<br />
            ((1 - Loss/100) × (Loss - Reduction))
          </p>
        </div>
      </div>

      {/* How it Works Modal / Explainer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  How the Resurrection Formula Works
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              {/* Step 1 */}
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">1</span>
                  The Problem: Position Under Water
                </h4>
                <p>
                  You own <strong>Shares 1</strong> at an entry price, and the price drops by <strong>Loss %</strong>. The current market price is:
                </p>
                <p className="mt-1 font-mono font-semibold text-slate-800 bg-white p-1.5 rounded-lg border border-slate-200">
                  Current Price = Original Price × (1 - Loss / 100)
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">2</span>
                  The Goal: Dilute Average Cost
                </h4>
                <p>
                  Instead of guessing how many shares to buy, you define your target: either a <strong>Loss Reduction %</strong> (e.g. reduce loss by 2%) or a <strong>Target Remaining Loss %</strong> (e.g. 0.66%).
                </p>
                <p className="mt-1">
                  Remaining Loss is: <code className="font-semibold text-slate-800">Target Loss = Loss - Reduction</code>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">3</span>
                  The 180 vs 234 Shares Comparison
                </h4>
                <div className="mt-2 space-y-2 text-[11px]">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-emerald-800 mb-0.5">Exact 2.00% Reduction (180 shares):</p>
                    <p className="text-slate-600">
                      If Current Loss is 2.86% and you reduce it by 2.00%, remaining loss is <strong>0.86%</strong>. Buying 180 shares lowers your average cost from $3.88 to $3.8017.
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <p className="font-bold text-emerald-800 mb-0.5">Spreadsheet Mode (234 shares):</p>
                    <p className="text-slate-600">
                      In the spreadsheet example, Target Loss was set to <strong>0.66%</strong>. That requires 234 shares at $3.78, which yields a total investment of $1,174.77 and brings average cost to $3.80.
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk warning */}
              <div className="rounded-2xl bg-amber-50 p-3.5 border border-amber-200 text-amber-900">
                <h4 className="font-bold mb-1 text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-amber-700" />
                  Risk Management Rule
                </h4>
                <p className="text-[11px] leading-relaxed">
                  As the Reduction % gets closer to the total Loss %, the denominator approaches zero, requiring an exponentially large number of shares. Always verify the Capital Ratio before placing orders.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-5 w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 active:scale-98 transition"
            >
              Close Explainer
            </button>
          </div>
        </div>
      )}
    </>
  );
};
