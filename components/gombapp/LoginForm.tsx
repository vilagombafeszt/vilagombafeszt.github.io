'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useSnackbar } from './Snackbar';

interface LoginFormProps {
  onClose: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const { showSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        showSnackbar('Ha ez az e-mail cím regisztrálva van, küldtünk rá egy hivatkozást.', 'success');
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
    <div className="login-form" style={{ display: 'block' }}>
      <form className="name-form" onSubmit={showReset ? handleSendReset : handleLogin}>
        {!showReset ? (
          <div className="login-fields">
            <input
              className="email-field"
              type="email"
              placeholder="E-mail cím"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="pw-field"
              type="password"
              placeholder="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="loginform-buttons">
              <button type="button" className="cancel-button" onClick={onClose}>
                Mégse
              </button>
              <button type="submit" className="submit-button">
                Belépés
              </button>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => setShowReset(true)}
            >
              Elfelejtettem a jelszavam.
            </button>
          </div>
        ) : (
          <div className="forgot-password-fields" style={{ display: 'flex' }}>
            <p className="reset-description">
              Add meg az e-mail-címedet, és elküldünk neked egy hivatkozást, amellyel visszajuthatsz a fiókodba.
            </p>
            <input
              className="email-field"
              type="email"
              placeholder="E-mail cím"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <div className="loginform-buttons">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowReset(false)}
              >
                Vissza
              </button>
              <button type="submit" className="submit-button">
                Hivatkozás küldése
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
