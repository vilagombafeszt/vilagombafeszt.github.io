'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import LoginForm from '@/components/gombapp/LoginForm';
import Image from 'next/image';

const ALLOWED_ADMIN_UIDS = ['9HBKQhxPThQXX51YLwHKGaLiz0D3', 'JlsebVypa1cYKXiLjIns7MktYmy2'];

export default function GombAppHome() {
  const { user, loading } = useAuth();
  const { showSnackbar, showConfirmSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const gombappBase = params.gombapp || 'GombApp';
  const [showLogin, setShowLogin] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    showConfirmSnackbar(
      'Biztosan ki szeretnél jelentkezni?',
      () => {
        signOut(auth!)
          .then(() => showSnackbar('Sikeres kijelentkezés!', 'success'))
          .catch(() => showSnackbar('Hiba történt a kijelentkezés során.', 'error'));
      }
    );
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
    router.push(path);
  };

  return (
    <>
      <header>
        <div className="header-content" style={user ? { flexDirection: 'column' } : undefined}>
          <h1 className="app-title">GombApp</h1>
        </div>

        {initialLoading ? (
          <div className="message-content" style={{ marginTop: '10px' }}>
            <div className="loader" />
          </div>
        ) : (
          <div className="message-content">
            {!user && !loading && (
              <button className="login-button" onClick={() => setShowLogin((prev) => !prev)}>
                Bejelentkezés
              </button>
            )}
            {user && (
              <>
                <span className="logged-in-message">Be vagy jelentkezve!</span>
                <button className="logout-button" onClick={handleLogout}>
                  Kijelentkezés
                </button>
              </>
            )}
          </div>
        )}
      </header>

      <main>
        <div className="menu home-adjust">
          <button className="button" onClick={() => navigateTo(`/${gombappBase}/admin/`, true)}>
            <Image src="/GombApp/images/adminpic.png" alt="Admin" className="profile-pic" width={100} height={100} />
            Admin
          </button>
          <button className="button" onClick={() => navigateTo(`/${gombappBase}/bartender/`)}>
            <Image src="/GombApp/images/bartenderprofilepic.png" alt="Pultos" className="profile-pic" width={100} height={100} />
            Pultos
          </button>
          <button className="button" onClick={() => navigateTo(`/${gombappBase}/programs/`)}>
            <Image src="/GombApp/images/calendar.png" alt="Programok" className="profile-pic" width={100} height={100} />
            Programok
          </button>
          <button className="button" onClick={() => navigateTo(`/${gombappBase}/ticketclerk/`)}>
            <Image src="/GombApp/images/ticketclerk.png" alt="Jegyárus" className="profile-pic" width={100} height={100} />
            Jegyárus
          </button>
        </div>
      </main>

      <LoginForm isOpen={showLogin && !user} onClose={() => setShowLogin(false)} />

      <footer>
        <p className="footer-text">v2.0.5</p>
      </footer>
    </>
  );
}
