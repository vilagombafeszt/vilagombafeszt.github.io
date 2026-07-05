'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import Image from 'next/image';
import { PageLayout } from '@/components/gombapp/PageLayout';

type View = 'menu' | 'realtime' | 'agenda';

const REALTIME_SRC =
  'https://calendar.google.com/calendar/embed?height=500&wkst=2&ctz=Europe%2FBudapest&bgcolor=%23ffffff&showTitle=0&showNav=0&showPrint=0&showTabs=0&mode=WEEK&showTz=0&src=dmlsYWdvbWJhZmVzenRAZ21haWwuY29t&color=%23039BE5';

const AGENDA_SRC =
  'https://calendar.google.com/calendar/embed?height=500&wkst=2&ctz=Europe%2FBudapest&bgcolor=%23ffffff&showTitle=0&showNav=0&showPrint=0&showTabs=0&mode=AGENDA&showTz=0&src=dmlsYWdvbWJhZmVzenRAZ21haWwuY29t&color=%23039BE5&dates=20260821/20260824';

export default function ProgramsPage() {
  const { user, loading: authLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const gombappBase = params.gombapp || 'GombApp';
  const [view, setView] = useState<View>('menu');
  const [isViewLoaded, setIsViewLoaded] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

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
    if (!authLoading && !user) {
      showSnackbar('Kérlek, jelentkezz be az oldal használatához!', 'info');
      router.push(`/${gombappBase}/`);
    }
  }, [user, authLoading, router, showSnackbar, gombappBase]);

  return (
    <PageLayout
      title="Programok"
      onBack={view === 'menu' ? undefined : () => setView('menu')}
      backHref={view === 'menu' ? `/${gombappBase}/` : undefined}
    >
      {view === 'menu' && (
        <div className="menu adjust static z-auto mx-auto grid h-auto w-full max-w-[500px] grid-cols-2 gap-5 overflow-y-auto overflow-x-hidden bg-transparent p-0">
          <button
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-2xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
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
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-2xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
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
            className="w-full flex-1 overflow-hidden rounded-2xl border-0 transition-opacity duration-300 ease-in-out"
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
            className="w-full flex-1 overflow-hidden rounded-2xl border-0 transition-opacity duration-300 ease-in-out"
            style={{ opacity: iframeLoading ? 0 : 1 }}
            scrolling="no"
          />
        </div>
      )}
    </PageLayout>
  );
}
