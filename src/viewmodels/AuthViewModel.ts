import { useState, useEffect, useMemo } from 'react';
import { AuthService } from '../services/AuthService';
import { AuthRepository } from '../models/repositories/AuthRepository';
import type { User } from '../models/entities/User';

export const useAuthViewModel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializar serviços (usando useMemo para evitar recriação)
  const authService = useMemo(() => {
    const authRepository = new AuthRepository();
    return new AuthService(authRepository);
  }, []);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [authService]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await authService.signIn(email, password);
      // O onAuthStateChanged vai atualizar o user automaticamente
      // mas setamos aqui também para garantir
      setUser(user);
      setLoading(false);
      return user;
    } catch (error: any) {
      setLoading(false);
      console.error("Erro no ViewModel signIn:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      const user = await authService.signUp(email, password, displayName);
      setUser(user);
      setLoading(false);
      return user;
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
};

