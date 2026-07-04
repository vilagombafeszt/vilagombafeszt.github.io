'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import Image from 'next/image';

type View = 'menu' | 'realtime' | 'agenda';

const REALTIME_SRC =
  'https://calendar.google.com/calendar/embed?height=500&wkst=2&ctz=Europe%2FBudapest&bgcolor=%23ffffff&showTitle=0&showNav=0&showPrint=0&showTabs=0&mode=WEEK&showTz=0&src=dmlsYWdvbWJhZmVzenRAZ21haWwuY29t&color=%23039BE5';

const AGENDA_SRC =
  'https://calendar.google.com/calendar/embed?height=500&wkst=2&ctz=Europe%2FBudapest&bgcolor=%23ffffff&showTitle=0&showNav=0&showPrint=0&showTabs=0&mode=AGENDA&showTz=0&src=dmlsYWdvbWJhZmVzenRAZ21haWwuY29t&color=%23039BE5&dates=20260821/20260824';

export default function ProgramsPage() {
  const { user, loading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const gombappBase = params.gombapp || 'GombApp';
  const [view, setView] = useState<View>('menu');
  const [isViewLoaded, setIsViewLoaded] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsNavigating(false);
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const handleNavigation = (path: string) => {
    navTimerRef.current = setTimeout(() => setIsNavigating(true), 500);
    router.push(path);
  };

  // Load view from sessionStorage on mount
  useEffect(() => {
    const savedView = sessionStorage.getItem('programs_view') as View;
    if (savedView) {
      setView(savedView);
    }
    setIsViewLoaded(true);
  }, []);

  // Save view to sessionStorage when it changes
  useEffect(() => {
    if (isViewLoaded) {
      sessionStorage.setItem('programs_view', view);
    }
  }, [view, isViewLoaded]);

  // Auth check
  useEffect(() => {
    if (!loading && !user) {
      showSnackbar('Kérlek, jelentkezz be az oldal használatához!', 'info');
      router.push(`/${gombappBase}/`);
    }
  }, [user, loading, router, showSnackbar, gombappBase]);

  if (loading) return null;

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] flex animate-gombapp-fade-in-fast flex-col items-center justify-center bg-gombapp-bg">
          <div className="p-10 text-center text-[18px] text-[#666]">
            <div className="mb-[15px] inline-block h-10 w-10 animate-gombapp-spin rounded-full border-r-4 border-t-4 border-r-transparent border-t-gombapp-text" />
            <br />
            Betöltés...
          </div>
        </div>
      )}

      <header className="relative z-[100] flex w-full shrink-0 flex-col items-center justify-between bg-gombapp-bg px-5 pt-[calc(10px+env(safe-area-inset-top,0px))] text-[30px]">
        <div className="flex w-full flex-row items-center justify-center">
          {view === 'menu' ? (
            <button
              className="absolute left-[10px] top-1/2 flex w-[90px] -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={() => handleNavigation(`/${gombappBase}/`)}
            >
              Vissza
            </button>
          ) : (
            <button
              className="absolute left-[10px] top-1/2 flex w-[90px] -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={() => setView('menu')}
            >
              Vissza
            </button>
          )}
          <h1 className="mt-[5px] text-center text-[40px]">Programok</h1>
        </div>
      </header>

      <main className="flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden px-5">
        {view === 'menu' && (
          <div className="menu adjust static z-auto mx-auto grid h-auto w-full max-w-[500px] grid-cols-2 gap-5 overflow-y-auto overflow-x-hidden bg-transparent p-0">
            <button
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={() => {
                setView('realtime');
                setIframeLoading(true);
              }}
            >
              <Image
                src="/GombApp/images/realtime-calendar.png"
                alt="Valós idejű program"
                className="mb-2.5 h-[100px] w-[100px]"
                width={100}
                height={100}
              />
              Valós idejű
            </button>
            <button
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={() => {
                setView('agenda');
                setIframeLoading(true);
              }}
            >
              <Image
                src="/GombApp/images/agenda-calendar.png"
                alt="Napi program"
                className="mb-2.5 h-[100px] w-[100px]"
                width={100}
                height={100}
              />
              Teljes program
            </button>
          </div>
        )}

        {view === 'realtime' && (
          <div className="relative flex min-h-0 w-full flex-1 py-2.5">
            {iframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="inline-block h-10 w-10 animate-gombapp-spin rounded-full border-r-4 border-t-4 border-r-transparent border-t-gombapp-text" />
              </div>
            )}
            <iframe
              src={REALTIME_SRC}
              title="Program naptár"
              onLoad={() => setIframeLoading(false)}
              className="w-full flex-1 overflow-hidden rounded-xl border-0 transition-opacity duration-300 ease-in-out"
              style={{ opacity: iframeLoading ? 0 : 1 }}
              scrolling="no"
            />
          </div>
        )}

        {view === 'agenda' && (
          <div className="relative flex min-h-0 w-full flex-1 py-2.5">
            {iframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="inline-block h-10 w-10 animate-gombapp-spin rounded-full border-r-4 border-t-4 border-r-transparent border-t-gombapp-text" />
              </div>
            )}
            <iframe
              src={AGENDA_SRC}
              title="Program naptár"
              onLoad={() => setIframeLoading(false)}
              className="w-full flex-1 overflow-hidden rounded-xl border-0 transition-opacity duration-300 ease-in-out"
              style={{ opacity: iframeLoading ? 0 : 1 }}
              scrolling="no"
            />
          </div>
        )}
      </main>
    </>
  );
}
