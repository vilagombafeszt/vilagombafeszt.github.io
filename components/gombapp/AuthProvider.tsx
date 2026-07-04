'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('gombapp_user');
        if (cached) return JSON.parse(cached) as User;
      } catch {
        // ignore JSON parse errors
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('gombapp_user');
    }
    return true;
  });

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        // Cache essential fields to avoid JSON cyclical errors and keep storage light
        const userToCache = {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
        };
        localStorage.setItem('gombapp_user', JSON.stringify(userToCache));
      } else {
        localStorage.removeItem('gombapp_user');
      }
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
