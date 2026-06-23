import { AuthRepository } from '../repositories/AuthRepository';
import { User } from '../entities/User';
import { User as SupabaseUser } from '@supabase/supabase-js';

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async formatUser(supabaseUser: SupabaseUser): Promise<User> {
    const role = await this.authRepository.getUserRole(supabaseUser.id);
    return {
      uid: supabaseUser.id,
      email: supabaseUser.email || null,
      displayName:
        supabaseUser.user_metadata?.display_name ||
        supabaseUser.user_metadata?.full_name ||
        null,
      photoURL:
        supabaseUser.user_metadata?.avatar_url ||
        supabaseUser.user_metadata?.picture ||
        null,
      role,
    };
  }

  private translateError(error: any): string {
    const code = error?.code as string | undefined;
    const message = (error?.message as string | undefined) || '';
    const lower = message.toLowerCase();

    if (code === 'invalid_credentials' || lower.includes('invalid login')) {
      return 'Email ou senha inválidos';
    }
    if (code === 'user_already_exists' || lower.includes('already registered')) {
      return 'Este email já está cadastrado';
    }
    if (code === 'weak_password' || lower.includes('password should be')) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    if (lower.includes('email not confirmed')) {
      return 'Por favor, confirme seu email antes de fazer login';
    }
    if (lower.includes('invalid email')) {
      return 'Email inválido';
    }
    if (lower.includes('rate limit') || lower.includes('too many requests')) {
      return 'Limite de tentativas excedido. Por favor, aguarde alguns minutos antes de tentar novamente.';
    }
    return message || 'Ocorreu um erro inesperado. Tente novamente.';
  }


  async signIn(email: string, password: string): Promise<User> {
    if (!email || !password) throw new Error('Email e senha são obrigatórios');
    try {
      const u = await this.authRepository.signIn(email, password);
      return await this.formatUser(u);
    } catch (e: any) {
      throw new Error(this.translateError(e));
    }
  }

  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    if (!email || !password) throw new Error('Email e senha são obrigatórios');
    if (password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres');
    try {
      const u = await this.authRepository.signUp(email, password, displayName);
      return await this.formatUser(u);
    } catch (e: any) {
      throw new Error(this.translateError(e));
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      await this.authRepository.signInWithGoogle();
    } catch (e: any) {
      throw new Error(this.translateError(e));
    }
  }

  async resetPasswordForEmail(email: string): Promise<void> {
    if (!email) throw new Error('Email é obrigatório');
    try {
      await this.authRepository.resetPasswordForEmail(email);
    } catch (e: any) {
      throw new Error(this.translateError(e));
    }
  }

  async updatePassword(password: string): Promise<void> {
    if (!password || password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres');
    try {
      await this.authRepository.updatePassword(password);
    } catch (e: any) {
      throw new Error(this.translateError(e));
    }
  }

  async signOut(): Promise<void> {
    await this.authRepository.signOut();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.authRepository.onAuthStateChanged(async (u) => {
      if (u) callback(await this.formatUser(u));
      else callback(null);
    });
  }
}
