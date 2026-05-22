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
        <div className="nav-loader-container">
          <div className="loading">
            <div className="loader loader-mb" />
            <br />
            Betöltés...
          </div>
        </div>
      )}

      <header>
        <div className="header-content">
          {view === 'menu' ? (
            <button className="back-button" onClick={() => handleNavigation(`/${gombappBase}/`)}>
              Vissza
            </button>
          ) : (
            <button className="back-button" onClick={() => setView('menu')}>
              Vissza
            </button>
          )}
          <h1 className="bartender-title">Programok</h1>
        </div>
      </header>

      <main>
        {view === 'menu' && (
          <div className="menu adjust">
            <button
              className="calendar-button"
              onClick={() => {
                setView('realtime');
                setIframeLoading(true);
              }}
            >
              <Image
                src="/GombApp/images/realtime-calendar.png"
                alt="Valós idejű program"
                className="profile-pic"
                width={100}
                height={100}
              />
              Valós idejű
            </button>
            <button
              className="calendar-button"
              onClick={() => {
                setView('agenda');
                setIframeLoading(true);
              }}
            >
              <Image
                src="/GombApp/images/agenda-calendar.png"
                alt="Napi program"
                className="profile-pic"
                width={100}
                height={100}
              />
              Teljes program
            </button>
          </div>
        )}

        {view === 'realtime' && (
          <div className="iframe-container">
            {iframeLoading && (
              <div className="iframe-loader-overlay">
                <div className="loader" />
              </div>
            )}
            <iframe
              src={REALTIME_SRC}
              title="Program naptár"
              onLoad={() => setIframeLoading(false)}
              className="iframe-content"
              style={{ opacity: iframeLoading ? 0 : 1 }}
              scrolling="no"
            />
          </div>
        )}

        {view === 'agenda' && (
          <div className="iframe-container">
            {iframeLoading && (
              <div className="iframe-loader-overlay">
                <div className="loader" />
              </div>
            )}
            <iframe
              src={AGENDA_SRC}
              title="Program naptár"
              onLoad={() => setIframeLoading(false)}
              className="iframe-content"
              style={{ opacity: iframeLoading ? 0 : 1 }}
              scrolling="no"
            />
          </div>
        )}
      </main>
    </>
  );
}
