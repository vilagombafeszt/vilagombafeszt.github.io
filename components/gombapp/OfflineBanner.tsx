'use client';

import React, { useState, useEffect } from 'react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initial check
    if (typeof window !== 'undefined') {
      setIsOffline(!window.navigator.onLine);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-[9999] flex items-center justify-center bg-red-600 px-4 pb-2 text-white shadow-md transition-transform duration-300 ease-in-out ${
        isOffline ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ paddingTop: 'calc(8px + env(safe-area-inset-top, 0px))' }}
    >
      <span className="material-symbols-rounded mr-2 text-[20px]">wifi_off</span>
      <span className="text-[18px] font-bold tracking-wide">Nincs internetkapcsolat!</span>
    </div>
  );
}
