'use client';

import React from 'react';
import Link from 'next/link';

interface PageLayoutProps {
  title: string;
  onBack?: () => void;
  backHref?: string;
  children: React.ReactNode;
}

export function PageLayout({ title, onBack, backHref, children }: PageLayoutProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <>
      <header className="relative z-[100] flex w-full shrink-0 flex-col items-center justify-between bg-gombapp-bg px-5 pt-[max(env(safe-area-inset-top),15px)] text-[30px]">
        <div className="relative flex w-full flex-row items-center justify-center">
          {backHref ? (
            <Link
              href={backHref}
              prefetch={true}
              className="absolute left-[10px] top-1/2 mt-1 flex w-[90px] -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-2xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg no-underline transition-transform duration-100 ease-in-out active:scale-[0.96]"
            >
              Vissza
            </Link>
          ) : (
            <button
              className="absolute left-[10px] top-1/2 mt-1 flex w-[90px] -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-2xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={handleBack}
            >
              Vissza
            </button>
          )}
          <h1 className="mt-[5px] text-center text-[40px]">{title}</h1>
        </div>
      </header>

      <main className="flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden px-5">
        {children}
      </main>
    </>
  );
}
