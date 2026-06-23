import { useState, useEffect, useMemo } from 'react';
import { AuthService } from '../models/services/AuthService';
import { AuthRepository } from '../models/repositories/AuthRepository';
import type { User } from '../models/entities/User';

import { supabase } from '../infra/supabaseClient';

export const useAuthViewModel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authService = useMemo(() => new AuthService(new AuthRepository()), []);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, [authService]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const u = await authService.signIn(email, password);
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      const u = await authService.signUp(email, password, displayName);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(u);
        return { user: u, sessionCreated: true };
      } else {
        setUser(null);
        return { user: u, sessionCreated: false };
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    await authService.resetPasswordForEmail(email);
  };

  const updatePassword = async (password: string) => {
    await authService.updatePassword(password);
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    resetPasswordForEmail,
    updatePassword,
    signOut,
  };
};
