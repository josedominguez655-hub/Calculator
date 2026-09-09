import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-banner"
      className="fixed bottom-20 left-4 right-4 z-50 flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-medium text-white shadow-lg sm:left-auto sm:right-6 sm:max-w-sm"
    >
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Offline Mode — All calculations work without internet connection.</span>
    </div>
  );
};
