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

const RealtimeSkeleton = () => (
  <div className="absolute bottom-6 left-0 right-0 top-6 flex animate-pulse flex-col overflow-hidden rounded-3xl bg-white">
    {/* Header */}
    <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-3 py-3">
      <div className="h-5 w-24 rounded bg-gray-300"></div>
      <div className="h-5 w-5 rounded-sm bg-gray-300"></div>
    </div>

    {/* Days Row */}
    <div className="ml-12 flex shrink-0 border-b border-gray-200">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="flex flex-1 flex-col items-center gap-1.5 border-l border-gray-100 py-2"
        >
          <div className="h-2 w-4 rounded bg-gray-300"></div>
          <div className={`h-6 w-6 rounded-full bg-gray-300`}></div>
        </div>
      ))}
    </div>

    {/* Grid Body */}
    <div className="relative flex flex-1 overflow-hidden">
      {/* Time column */}
      <div className="z-10 flex w-12 shrink-0 flex-col bg-white">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex h-12 items-start justify-center pt-1.5">
            <div className="h-2.5 w-7 rounded bg-gray-300"></div>
          </div>
        ))}
      </div>
      {/* Grid columns */}
      <div className="flex flex-1 border-l border-gray-200">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex flex-1 flex-col border-r border-gray-100">
            {[...Array(12)].map((_, j) => (
              <div key={j} className="relative h-12 w-full border-b border-gray-100"></div>
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* Bottom Bar Controls */}
    <div className="absolute bottom-2 left-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#3c4043]">
      <span className="text-xs font-medium text-white">N</span>
    </div>
    <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center">
      <span className="text-[26px] font-light leading-none text-gray-500">+</span>
    </div>
  </div>
);

const AgendaSkeleton = () => (
  <div className="absolute bottom-6 left-0 right-0 top-6 flex animate-pulse flex-col overflow-hidden rounded-3xl bg-white">
    {/* Header */}
    <div className="flex items-center justify-between border-b border-gray-200 px-3 py-3">
      <div className="h-5 w-40 rounded bg-gray-300"></div>
      <div className="h-5 w-5 rounded-sm bg-gray-300"></div>
    </div>

    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Day 1 Header */}
      <div className="border-b border-gray-200 bg-gray-50/50 px-3 py-3">
        <div className="h-3.5 w-24 rounded bg-gray-300"></div>
      </div>
      {/* Day 1 - Events */}
      <div className="flex items-start gap-4 border-b border-gray-100 px-3 py-3">
        <div className="mt-0.5 h-3 w-12 shrink-0 rounded bg-gray-300"></div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-48 rounded bg-gray-300"></div>
          <div className="h-3 w-32 rounded bg-gray-200"></div>
        </div>
      </div>
      <div className="flex items-start gap-4 border-b border-gray-100 px-3 py-3">
        <div className="mt-0.5 h-3 w-12 shrink-0 rounded bg-gray-300"></div>
        <div className="h-4 w-36 rounded bg-gray-300"></div>
      </div>
      <div className="flex items-start gap-4 border-b border-gray-100 px-3 py-3">
        <div className="mt-0.5 h-3 w-12 shrink-0 rounded bg-gray-300"></div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-52 rounded bg-gray-300"></div>
          <div className="h-3 w-24 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Day 2 Header */}
      <div className="border-b border-gray-200 bg-gray-50/50 px-3 py-3">
        <div className="h-3.5 w-20 rounded bg-gray-300"></div>
      </div>
      {/* Day 2 - Events */}
      <div className="flex items-start gap-4 border-b border-gray-100 px-3 py-3">
        <div className="mt-0.5 h-3 w-12 shrink-0 rounded bg-gray-300"></div>
        <div className="h-4 w-40 rounded bg-gray-300"></div>
      </div>
      <div className="flex items-start gap-4 border-b border-gray-100 px-3 py-3">
        <div className="mt-0.5 h-3 w-12 shrink-0 rounded bg-gray-300"></div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-44 rounded bg-gray-300"></div>
          <div className="h-3 w-36 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>

    {/* Bottom Bar Controls */}
    <div className="absolute bottom-2 left-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#3c4043]">
      <span className="text-xs font-medium text-white">N</span>
    </div>
    <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center">
      <span className="text-[26px] font-light leading-none text-gray-500">+</span>
    </div>
  </div>
);

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
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
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
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
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
        <div className="relative flex min-h-0 w-full flex-1 py-6">
          {iframeLoading && <RealtimeSkeleton />}
          <iframe
            src={REALTIME_SRC}
            title="Program naptár"
            onLoad={() => setIframeLoading(false)}
            className="w-full flex-1 overflow-hidden rounded-3xl border-0 transition-opacity duration-300 ease-in-out"
            style={{ opacity: iframeLoading ? 0 : 1 }}
            scrolling="no"
          />
        </div>
      )}

      {view === 'agenda' && (
        <div className="relative flex min-h-0 w-full flex-1 py-6">
          {iframeLoading && <AgendaSkeleton />}
          <iframe
            src={AGENDA_SRC}
            title="Program naptár"
            onLoad={() => setIframeLoading(false)}
            className="w-full flex-1 overflow-hidden rounded-3xl border-0 transition-opacity duration-300 ease-in-out"
            style={{ opacity: iframeLoading ? 0 : 1 }}
            scrolling="no"
          />
        </div>
      )}
    </PageLayout>
  );
}
