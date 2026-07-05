'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useSnackbar } from './Snackbar';
import { BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter } from './BottomSheet';

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginForm({ isOpen, onClose }: LoginFormProps) {
  const { showSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showSnackbar('Kérlek, töltsd ki az összes mezőt!', 'info');
      return;
    }

    if (!auth) return;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        showSnackbar('Sikeres bejelentkezés!', 'success');
        onClose();
      })
      .catch((error) => {
        console.error('Firebase auth error:', error.code, error.message, error);
        let errorMessage = 'Hiba történt a bejelentkezés során.';
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Érvénytelen e-mail cím formátum.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Ez a fiók le lett tiltva.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Nem található ilyen felhasználó.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Hibás jelszó.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Hibás e-mail cím vagy jelszó.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Túl sok sikertelen próbálkozás. Kérlek, próbáld újra később.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Hálózati hiba. Ellenőrizd az internetkapcsolatot.';
            break;
          default:
            errorMessage = 'Bejelentkezési hiba. Ellenőrizd az adataidat.';
        }
        showSnackbar(errorMessage, 'error');
      });
  };

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = resetEmail.trim();
    if (!trimmed) {
      showSnackbar('Kérlek, add meg az e-mail-címedet!', 'info');
      return;
    }

    if (!auth) return;
    sendPasswordResetEmail(auth, trimmed)
      .then(() => {
        showSnackbar(
          'Ha ez az e-mail cím regisztrálva van, küldtünk rá egy hivatkozást.',
          'success'
        );
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          showSnackbar('Nincs regisztrált fiók ezzel az e-mail-címmel.', 'error');
        } else if (error.code === 'auth/invalid-email') {
          showSnackbar('Érvénytelen e-mail cím formátum.', 'error');
        } else {
          showSnackbar(error.message, 'error');
        }
      });
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <BottomSheetHeader>Bejelentkezés</BottomSheetHeader>
      <form
        className="flex w-full flex-col gap-[15px] text-[25px]"
        onSubmit={showReset ? handleSendReset : handleLogin}
      >
        <BottomSheetBody>
          {!showReset ? (
            <div className="flex w-full flex-col gap-[15px]">
              <input
                className="h-10 rounded-2xl border-2 border-gombapp-text/20 bg-white/90 px-[15px] py-2.5 text-[1em] text-gombapp-text outline-none transition-all duration-300 ease-in-out placeholder:text-gombapp-text/50 focus:border-gombapp-text focus:bg-white focus:shadow-[0_0_0_3px_rgba(16,33,53,0.1)] [&:hover:not(:focus)]:border-gombapp-text/30"
                type="email"
                placeholder="E-mail cím"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="relative w-full">
                <input
                  className="h-10 w-full rounded-2xl border-2 border-gombapp-text/20 bg-white/90 px-[15px] py-2.5 pr-10 text-[1em] text-gombapp-text outline-none transition-all duration-300 ease-in-out placeholder:text-gombapp-text/50 focus:border-gombapp-text focus:bg-white focus:shadow-[0_0_0_3px_rgba(16,33,53,0.1)] [&:hover:not(:focus)]:border-gombapp-text/30"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Jelszó"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-[#666]"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
                  aria-label={showPassword ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                type="button"
                className="mt-2.5 cursor-pointer self-start border-none bg-transparent p-0 text-[0.7em] text-gombapp-text underline"
                onClick={() => setShowReset(true)}
              >
                Elfelejtettem a jelszavam.
              </button>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-[15px]">
              <p className="m-0 pb-2 text-[0.8em]">
                Add meg az e-mail-címedet, és elküldünk neked egy hivatkozást, amellyel
                visszajuthatsz a fiókodba.
              </p>
              <input
                className="h-10 rounded-2xl border-2 border-gombapp-text/20 bg-white/90 px-[15px] py-2.5 text-[1em] text-gombapp-text outline-none transition-all duration-300 ease-in-out placeholder:text-gombapp-text/50 focus:border-gombapp-text focus:bg-white focus:shadow-[0_0_0_3px_rgba(16,33,53,0.1)] [&:hover:not(:focus)]:border-gombapp-text/30"
                type="email"
                placeholder="E-mail cím"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>
          )}
        </BottomSheetBody>
        <BottomSheetFooter>
          {!showReset ? (
            <div className="flex w-full justify-between">
              <button
                type="button"
                className="mr-auto flex cursor-pointer flex-col items-center justify-center self-end rounded-2xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
                onClick={onClose}
              >
                Mégse
              </button>
              <button
                type="submit"
                className="mt-5 flex cursor-pointer flex-col items-center justify-center self-end rounded-2xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              >
                Belépés
              </button>
            </div>
          ) : (
            <div className="flex w-full justify-between">
              <button
                type="button"
                className="mr-auto flex cursor-pointer flex-col items-center justify-center self-end rounded-2xl border-none bg-gombapp-text px-[18px] py-2.5 text-[0.95em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
                onClick={() => setShowReset(false)}
              >
                Vissza
              </button>
              <button
                type="submit"
                className="mt-5 flex cursor-pointer flex-col items-center justify-center self-end rounded-2xl border-none bg-gombapp-text px-[18px] py-2.5 text-[0.95em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              >
                Hivatkozás küldése
              </button>
            </div>
          )}
        </BottomSheetFooter>
      </form>
    </BottomSheet>
  );
}
