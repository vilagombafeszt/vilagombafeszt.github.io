'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FullScreenSpinner } from '@/components/gombapp/FullScreenSpinner';

interface PageLayoutProps {
  title: string;
  onBack?: () => void;
  backHref?: string;
  children: React.ReactNode;
}

export function PageLayout({ title, onBack, backHref, children }: PageLayoutProps) {
  const router = useRouter();
  const params = useParams();

  const [isNavigating, setIsNavigating] = useState(false);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsNavigating(false);
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const handleBack = () => {
    if (backHref) {
      navTimerRef.current = setTimeout(() => setIsNavigating(true), 500);
      router.push(backHref);
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <>
      {isNavigating && <FullScreenSpinner />}

      <header className="relative z-[100] flex w-full shrink-0 flex-col items-center justify-between bg-gombapp-bg px-5 pt-[calc(10px+env(safe-area-inset-top,0px))] text-[30px]">
        <div className="flex w-full flex-row items-center justify-center">
          <button
            className="absolute left-[10px] top-1/2 flex w-[90px] -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
            onClick={handleBack}
          >
            Vissza
          </button>
          <h1 className="mt-[5px] text-center text-[40px]">{title}</h1>
        </div>
      </header>

      <main className="flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden px-5">
        {children}
      </main>
    </>
  );
}
