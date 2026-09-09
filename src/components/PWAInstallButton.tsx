import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, X, Smartphone, CheckCircle, Copy, Check, QrCode, ExternalLink } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'compact' | 'card' }> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // Current URL or production shared URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-aguo3z3mjrl7jfh7nusgs7-392670282288.us-east1.run.app';
  const sharedUrl = 'https://ais-pre-aguo3z3mjrl7jfh7nusgs7-392670282288.us-east1.run.app';
  const displayUrl = currentUrl.includes('ais-dev') ? currentUrl : sharedUrl;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
        return;
      }
    }
    // If native prompt is not available (e.g. inside AI Studio iframe or manual install needed), open modal guide
    setShowModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (isInstalled) {
    return null;
  }

  if (installSuccess) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
        <CheckCircle className="w-4 h-4 text-emerald-600" />
        Installed!
      </div>
    );
  }

  return (
    <>
      {variant === 'compact' ? (
        <button
          id="btn-install-pwa-compact"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
          title="Install to Phone"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      ) : (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">Install to Mobile Home Screen</h4>
              <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                Run Resurrection Calculator as a standalone fullscreen app on your phone, with 100% offline support.
              </p>
              <div className="mt-3">
                <button
                  id="btn-install-card"
                  onClick={handleInstallClick}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>How to Install on Phone</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Mobile Install Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Install on Your Phone</h3>
                  <p className="text-[11px] text-slate-500">Android, Samsung Fold & iOS</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Open via Link or QR Code */}
            <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
              <p className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-600" />
                Step 1: Open this link on your phone
              </p>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-2">
                <span className="text-[11px] font-mono text-slate-700 truncate flex-1 select-all">
                  {displayUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition shrink-0"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* QR Code preview */}
              <div className="mt-3 flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(displayUrl)}`}
                  alt="QR Code to open on phone"
                  className="w-18 h-18 rounded-lg border border-slate-100 shrink-0"
                />
                <div className="text-[11px] text-slate-600 space-y-1">
                  <p>
                    <strong>Scan with your phone's camera</strong> to open directly.
                  </p>
                  <p className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                    💡 If you see an error page, click the <strong>"Share"</strong> button in the top-right header of AI Studio to activate the public link.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Device-Specific Instructions */}
            <div className="mt-4 space-y-3">
              <p className="text-xs font-bold text-slate-800">
                Step 2: Add to your home screen
              </p>

              {/* Android / Samsung Fold */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>On Android (Chrome or Samsung Internet):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>In Chrome or Samsung Internet, tap the <strong>three dots menu (⋮)</strong> in the top-right corner.</li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Confirm by tapping <strong>Install</strong>. The icon will appear directly on your home screen and app drawer!</li>
                </ol>
              </div>

              {/* iOS / iPhone */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>On iPhone / iPad (Safari):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>Tap the <strong>Share</strong> button (box with an arrow pointing up) at the bottom of Safari.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top-right corner.</li>
                </ol>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <a
                href={displayUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 active:scale-98 transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
