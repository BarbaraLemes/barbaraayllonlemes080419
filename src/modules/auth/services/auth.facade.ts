import { BehaviorSubject, Observable } from "rxjs";
import { authService } from "./auth.service";
import { registerAuthCallbacks } from "./api";
import type { AuthState, LoginRequest } from "../types/auth.types";

// Orquestração do fluxo de autenticação
class AuthFacade {
  // Estado reativo
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: authService.hasValidToken(),
    user: authService.getUser(),
    isLoading: false,
    error: null,
  });

  // Observable do estado
  public authState$: Observable<AuthState> = this.authStateSubject.asObservable();

  get currentState(): AuthState {
    return this.authStateSubject.value;
  }

  constructor() {
    // Registra callbacks para interceptors do Axios
    registerAuthCallbacks({
      getAccessToken: () => authService.getAccessToken(),
      handleTokenRefresh: () => this.handleRefresh(),
      canRefreshToken: () => authService.canRefresh(),
      handleLogout: () => this.logout(),
    });
  }

  async login(credentials: LoginRequest): Promise<void> {
    this.setLoading(true);

    try {
      const { user } = await authService.login(credentials);

      this.authStateSubject.next({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error);

      this.authStateSubject.next({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  }

  private async handleRefresh(): Promise<void> {
    try {
      await authService.refreshToken();

      // Mantém estado autenticado
      this.authStateSubject.next({
        ...this.currentState,
        isAuthenticated: true,
      });
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  logout(): void {
    authService.logout();

    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });
  }

  // Verificar autenticação inicial
  checkAuth(): void {
    const isAuthenticated = authService.hasValidToken();
    const user = authService.getUser();

    this.authStateSubject.next({
      isAuthenticated,
      user: isAuthenticated ? user : null,
      isLoading: false,
      error: null,
    });
  }

  // Loading 
  private setLoading(isLoading: boolean): void {
    this.authStateSubject.next({
      ...this.currentState,
      isLoading,
      error: null,
    });
  }

  // Mensagens de erro
  private getErrorMessage(error: any): string {
    if (error.response?.status === 401) {
      return "Usuário ou senha inválidos";
    }
    if (error.response?.status === 500) {
      return "Erro no servidor. Tente novamente mais tarde.";
    }
    return "Erro ao fazer login. Verifique sua conexão.";
  }
}

export const authFacade = new AuthFacade();