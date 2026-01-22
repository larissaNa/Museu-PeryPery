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
      role: (supabaseUser.user_metadata as any)?.role || (supabaseUser.app_metadata as any)?.role || null,
    };
  }

  private translateError(error: any): string {
    console.log('AuthService translateError - Error object:', JSON.stringify(error, null, 2));
    console.log('AuthService translateError - Code:', error?.code);
    console.log('AuthService translateError - Message:', error?.message);

    const code = error?.code as string | undefined;
    const message = error?.message as string | undefined;

    const codeMessages: Record<string, string> = {
      invalid_credentials: 'Email ou senha incorretos',
      invalid_email: 'Email inválido',
      email_not_confirmed: 'Por favor, confirme seu email antes de fazer login',
      user_already_exists: 'Este email já está cadastrado',
      weak_password: 'A senha deve ter pelo menos 6 caracteres',
      over_email_send_rate_limit: 'Muitas tentativas. Tente novamente em alguns minutos.',
    };

    if (code && codeMessages[code]) {
      return codeMessages[code];
    }

    const messageMessages: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha incorretos',
      'User already registered': 'Este email já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Email not confirmed': 'Por favor, confirme seu email antes de fazer login',
      'Invalid email': 'Email inválido',
    };

    if (message && messageMessages[message]) {
      return messageMessages[message];
    }

    if (error?.status === 400 && message?.toLowerCase().includes('email')) {
      return 'Email inválido';
    }

    if (error?.status === 400 && message?.toLowerCase().includes('password')) {
      return 'Senha inválida';
    }

    return message || 'Ocorreu um erro inesperado. Tente novamente.';
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
