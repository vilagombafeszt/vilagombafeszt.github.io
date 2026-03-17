'use client';

import React, { useState, useEffect } from 'react';
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
      <header>
        <div className="header-content">
          {view === 'menu' ? (
            <button className="back-button" onClick={() => router.push(`/${gombappBase}/`)}>
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
          <div style={{ flex: 1, width: '100%', minHeight: 0, padding: '10px 0', display: 'flex' }}>
            <iframe
              src={REALTIME_SRC}
              title="Program naptár"
              style={{ border: 0, borderRadius: '12px', overflow: 'hidden', width: '100%', flex: 1 }}
              scrolling="no"
            />
          </div>
        )}

        {view === 'agenda' && (
          <div style={{ flex: 1, width: '100%', minHeight: 0, padding: '10px 0', display: 'flex' }}>
            <iframe
              src={AGENDA_SRC}
              title="Program naptár"
              style={{ border: 0, borderRadius: '12px', overflow: 'hidden', width: '100%', flex: 1 }}
              scrolling="no"
            />
          </div>
        )}
      </main>
    </>
  );
}
