import React, { useState, useEffect } from 'react';

export default function RetryBar({ onRetry }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  const handleManualRetry = () => {
    setRetrying(true);
    onRetry?.();
    setTimeout(() => {
      setIsOnline(navigator.onLine);
      setRetrying(false);
    }, 1500);
  };

  return (
    <div 
      role="status"
      aria-live="polite"
      className="sticky top-16 z-40 w-full h-12 bg-status-pending-bg border-b border-status-pending/20 px-4 flex items-center justify-between text-xs font-body text-status-pending"
    >
      <div className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>No connection. Retrying...</span>
      </div>

      <button
        type="button"
        disabled={retrying}
        onClick={handleManualRetry}
        className="font-heading font-bold text-xs uppercase underline tracking-wider cursor-pointer disabled:opacity-50"
      >
        {retrying ? 'Checking...' : 'Retry'}
      </button>
    </div>
  );
}