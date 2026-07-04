'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import LoginForm from '@/components/gombapp/LoginForm';
import Image from 'next/image';
import { FullScreenSpinner } from '@/components/gombapp/FullScreenSpinner';
import packageInfo from '../../package.json';

const ALLOWED_ADMIN_UIDS = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_UIDS?.split(',') || [];

export default function GombAppHome() {
  const { user, loading } = useAuth();
  const { showSnackbar, showConfirmSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const gombappBase = params.gombapp || 'GombApp';
  const [showLogin, setShowLogin] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsNavigating(false);
    setIsClient(true);
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const handleLogout = () => {
    showConfirmSnackbar('Biztosan ki szeretnél jelentkezni?', () => {
      signOut(auth!)
        .then(() => showSnackbar('Sikeres kijelentkezés!', 'success'))
        .catch(() => showSnackbar('Hiba történt a kijelentkezés során.', 'error'));
    });
  };

  const navigateTo = (path: string, adminOnly = false) => {
    if (!user) {
      showSnackbar('Kérlek jelentkezz be!', 'info');
      return;
    }
    if (adminOnly && !ALLOWED_ADMIN_UIDS.includes(user.uid)) {
      showSnackbar('Nincs jogosultságod az admin oldal megtekintéséhez!', 'error');
      return;
    }
    navTimerRef.current = setTimeout(() => setIsNavigating(true), 500);
    router.push(path);
  };

  return (
    <>
      {isNavigating && <FullScreenSpinner />}

      <header className="relative z-[100] flex w-full shrink-0 flex-col items-center justify-between bg-gombapp-bg px-5 pt-[calc(10px+env(safe-area-inset-top,0px))] text-[30px]">
        <div
          className="flex w-full flex-row items-center justify-center"
          style={isClient && user ? { flexDirection: 'column' } : undefined}
        >
          <h1 className="flex-1 text-center text-[1.5em] text-gombapp-text">GombApp</h1>
        </div>

        <div className="mt-2.5 flex min-h-[92px] w-full flex-col items-center justify-center gap-5">
          {!isClient || loading ? null : !user ? (
            <button
              className="cursor-pointer rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg"
              onClick={() => setShowLogin((prev) => !prev)}
            >
              Bejelentkezés
            </button>
          ) : (
            <>
              <span className="text-[25px]">Be vagy jelentkezve!</span>
              <button
                className="ml-2.5 cursor-pointer rounded-xl border-none bg-[#c62828] px-5 py-2.5 text-[0.7em] text-white transition-all duration-300 ease-in-out hover:bg-[#b71c1c]"
                onClick={handleLogout}
              >
                Kijelentkezés
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden px-5">
        <div className="menu home-adjust static z-auto mx-auto grid h-auto w-full max-w-[500px] grid-cols-2 gap-5 overflow-y-auto overflow-x-hidden bg-transparent p-0">
          <button
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
            onClick={() => navigateTo(`/${gombappBase}/admin/`, true)}
          >
            <Image
              src="/GombApp/images/adminpic.png"
              alt="Admin"
              className="mb-2.5 h-[100px] w-[100px]"
              width={100}
              height={100}
            />
            Admin
          </button>
          <button
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
            onClick={() => navigateTo(`/${gombappBase}/bartender/`)}
          >
            <Image
              src="/GombApp/images/bartenderprofilepic.png"
              alt="Pultos"
              className="mb-2.5 h-[100px] w-[100px]"
              width={100}
              height={100}
            />
            Pultos
          </button>
          <button
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
            onClick={() => navigateTo(`/${gombappBase}/programs/`)}
          >
            <Image
              src="/GombApp/images/calendar.png"
              alt="Programok"
              className="mb-2.5 h-[100px] w-[100px]"
              width={100}
              height={100}
            />
            Programok
          </button>
          <button
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
            onClick={() => navigateTo(`/${gombappBase}/ticketclerk/`)}
          >
            <Image
              src="/GombApp/images/ticketclerk.png"
              alt="Jegyárus"
              className="mb-2.5 h-[100px] w-[100px]"
              width={100}
              height={100}
            />
            Jegyárus
          </button>
        </div>
      </main>

      <LoginForm isOpen={showLogin && !user} onClose={() => setShowLogin(false)} />

      <footer className="mt-auto shrink-0 pt-5">
        <p className="text-center">v{packageInfo.version}</p>
      </footer>
    </>
  );
}
