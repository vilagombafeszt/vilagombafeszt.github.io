'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  const [view, setView] = useState<View>('menu');
  const realtimeRef = useRef<HTMLIFrameElement>(null);
  const agendaRef = useRef<HTMLIFrameElement>(null);
  const [iframeSize, setIframeSize] = useState({ width: 350, height: 500 });

  // Auth check
  useEffect(() => {
    if (!loading && !user) {
      showSnackbar('Kérlek, jelentkezz be az oldal használatához!', 'info');
      router.push('/GombApp/');
    }
  }, [user, loading, router, showSnackbar]);

  // Resize iframes
  const resizeIframes = useCallback(() => {
    const newWidth = window.innerWidth - 50;
    const newHeight = window.innerHeight - 150;
    setIframeSize({ width: newWidth, height: newHeight });
  }, []);

  useEffect(() => {
    resizeIframes();
    window.addEventListener('resize', resizeIframes);
    return () => window.removeEventListener('resize', resizeIframes);
  }, [resizeIframes]);

  if (loading) return null;

  return (
    <>
      <header>
        <div className="header-content">
          {view === 'menu' ? (
            <button className="back-button" onClick={() => router.push('/GombApp/')}>
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
          <div className="menu" style={{ marginTop: '150px' }}>
            <button className="calendar-button" onClick={() => setView('realtime')}>
              <Image
                src="/GombApp/images/realtime-calendar.png"
                alt="Valós idejű program"
                className="profile-pic"
                width={100}
                height={100}
              />
              Valós idejű
            </button>
            <button className="calendar-button" onClick={() => setView('agenda')}>
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
          <div style={{ marginTop: '80px' }}>
            <iframe
              ref={realtimeRef}
              src={REALTIME_SRC}
              title="Program naptár"
              style={{ border: 0, borderRadius: '12px', overflow: 'hidden' }}
              width={iframeSize.width}
              height={iframeSize.height}
              scrolling="no"
            />
          </div>
        )}

        {view === 'agenda' && (
          <div style={{ marginTop: '100px' }}>
            <iframe
              ref={agendaRef}
              src={AGENDA_SRC}
              title="Program naptár"
              style={{ border: 0, borderRadius: '12px', overflow: 'hidden' }}
              width={iframeSize.width}
              height={iframeSize.height}
              scrolling="no"
            />
          </div>
        )}
      </main>
    </>
  );
}
