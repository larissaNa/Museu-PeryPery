import { User } from '@supabase/supabase-js';
import { supabase } from '../../infra/supabaseClient';

export class AuthRepository {
  async signIn(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erro no AuthRepository signIn:", error);
      throw error;
    }

    if (!data.user) {
      throw new Error("Usuário não encontrado após login");
    }

    return data.user;
  }

  async signUp(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("Falha ao criar usuário");
    }

    return data.user;
  }

  async updateUserProfile(user: User, displayName: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });

    if (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
}
