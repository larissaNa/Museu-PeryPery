import { AuthRepository } from '../models/repositories/AuthRepository';
import { User } from '../models/entities/User';
import { User as SupabaseUser } from '@supabase/supabase-js';

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  formatUser(supabaseUser: SupabaseUser): User {
    return {
      uid: supabaseUser.id,
      email: supabaseUser.email || null,
      displayName: supabaseUser.user_metadata?.display_name || supabaseUser.user_metadata?.full_name || null,
      photoURL: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
    };
  }

  private translateError(error: any): string {
    // Supabase returns 'message' in the error object
    const errorMessage = error?.message || '';
    
    // Map common Supabase error messages to Portuguese
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha incorretos',
      'User already registered': 'Este email já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Email not confirmed': 'Por favor, confirme seu email antes de fazer login',
    };

    return errorMessages[errorMessage] || errorMessage || 'Ocorreu um erro inesperado';
  }

  async signIn(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    try {
      const supabaseUser = await this.authRepository.signIn(email, password);
      const formattedUser = this.formatUser(supabaseUser);
      return formattedUser;
    } catch (error: any) {
      console.error("Erro no AuthService signIn:", error);
      const translatedError = this.translateError(error);
      throw new Error(translatedError);
    }
  }

  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    if (password.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }

    try {
      const supabaseUser = await this.authRepository.signUp(email, password);
      
      if (displayName) {
        await this.authRepository.updateUserProfile(supabaseUser, displayName);
        // Update local object to reflect change immediately if needed, 
        // though Supabase might need a refresh or re-fetch.
        // For now, let's assume metadata update is enough.
        if (supabaseUser.user_metadata) {
            supabaseUser.user_metadata.display_name = displayName;
        } else {
            supabaseUser.user_metadata = { display_name: displayName };
        }
      }

      return this.formatUser(supabaseUser);
    } catch (error: any) {
      throw new Error(this.translateError(error));
    }
  }

  async signOut(): Promise<void> {
    await this.authRepository.signOut();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.authRepository.onAuthStateChanged((supabaseUser) => {
      if (supabaseUser) {
        callback(this.formatUser(supabaseUser));
      } else {
        callback(null);
      }
    });
  }
}
