import { AuthRepository } from '../models/repositories/AuthRepository';
import { User } from '../models/entities/User';
import { User as FirebaseUser } from 'firebase/auth';

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  formatUser(firebaseUser: FirebaseUser): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    };
  }

  private translateError(error: any): string {
    const errorCode = error?.code || '';
    
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Usuário desabilitado',
      'auth/email-already-in-use': 'Este email já está em uso',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
      'auth/operation-not-allowed': 'Operação não permitida',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
    };

    return errorMessages[errorCode] || error?.message || 'Ocorreu um erro inesperado';
  }

  async signIn(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    try {
      const firebaseUser = await this.authRepository.signIn(email, password);
      const formattedUser = this.formatUser(firebaseUser);
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
      const firebaseUser = await this.authRepository.signUp(email, password);
      
      if (displayName) {
        await this.authRepository.updateUserProfile(firebaseUser, displayName);
      }

      return this.formatUser(firebaseUser);
    } catch (error: any) {
      throw new Error(this.translateError(error));
    }
  }

  async signOut(): Promise<void> {
    await this.authRepository.signOut();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.authRepository.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        callback(this.formatUser(firebaseUser));
      } else {
        callback(null);
      }
    });
  }
}

