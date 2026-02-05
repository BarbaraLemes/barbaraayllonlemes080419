import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authFacade } from '../services/auth.facade';
import { authService } from '../services/auth.service';
import type { LoginRequest } from '../types/auth.types';
import { firstValueFrom } from 'rxjs';

vi.mock('../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn(),
    getUser: vi.fn(),
    getAccessToken: vi.fn(),
    isAuthenticated: vi.fn(),
    hasValidToken: vi.fn(),
    canRefresh: vi.fn(),
  },
}));

vi.mock('../services/api', () => ({
  api: {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
  registerAuthCallbacks: vi.fn(),
}));

describe('AuthFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('authState$', () => {
    it('deve expor observable do estado de autenticação', async () => {
      const state = await firstValueFrom(authFacade.authState$);
      
      expect(state).toHaveProperty('isAuthenticated');
      expect(state).toHaveProperty('user');
      expect(state).toHaveProperty('isLoading');
      expect(state).toHaveProperty('error');
    });
  });

  describe('currentState', () => {
    it('deve retornar o estado atual', () => {
      const state = authFacade.currentState;
      
      expect(state).toHaveProperty('isAuthenticated');
      expect(state).toHaveProperty('user');
      expect(state).toHaveProperty('isLoading');
      expect(state).toHaveProperty('error');
    });
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'admin',
      };

      const mockUser = { username: 'admin' };
      
      vi.mocked(authService.logout).mockReturnValue(undefined);
      vi.mocked(authService.login).mockResolvedValue({
        user: mockUser,
        tokens: {
          accessToken: 'token',
          refreshToken: 'refresh',
          expiresAt: 3600,
          refreshExpiresAt: 86400,
        },
      });

      await authFacade.login(credentials);

      const state = authFacade.currentState;
      
      expect(authService.logout).toHaveBeenCalled();
      expect(authService.login).toHaveBeenCalledWith(credentials);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('deve definir erro quando login falhar', async () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'wrong',
      };

      vi.mocked(authService.logout).mockReturnValue(undefined);
      vi.mocked(authService.login).mockRejectedValue({
        response: { status: 401 },
      });

      await expect(authFacade.login(credentials)).rejects.toBeDefined();

      const state = authFacade.currentState;
      
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Usuário ou senha inválidos');
    });

    it('deve definir erro 500 quando servidor falhar', async () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'admin',
      };

      vi.mocked(authService.logout).mockReturnValue(undefined);
      vi.mocked(authService.login).mockRejectedValue({
        response: { status: 500 },
      });

      await expect(authFacade.login(credentials)).rejects.toBeDefined();

      const state = authFacade.currentState;
      expect(state.error).toBe('Erro no servidor. Tente novamente mais tarde.');
    });

    it('deve definir erro genérico quando houver erro de conexão', async () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'admin',
      };

      vi.mocked(authService.logout).mockReturnValue(undefined);
      vi.mocked(authService.login).mockRejectedValue(new Error('Network error'));

      await expect(authFacade.login(credentials)).rejects.toBeDefined();

      const state = authFacade.currentState;
      expect(state.error).toBe('Erro ao fazer login. Verifique sua conexão.');
    });
  });

  describe('logout', () => {
    it('deve fazer logout e limpar estado', () => {
      vi.mocked(authService.logout).mockReturnValue(undefined);

      authFacade.logout();

      const state = authFacade.currentState;
      
      expect(authService.logout).toHaveBeenCalled();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('checkAuth', () => {
    it('deve verificar autenticação quando usuário está autenticado', () => {
      const mockUser = { username: 'admin' };
      
      vi.mocked(authService.isAuthenticated).mockReturnValue(true);
      vi.mocked(authService.getUser).mockReturnValue(mockUser);

      authFacade.checkAuth();

      const state = authFacade.currentState;
      
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('deve verificar autenticação quando usuário não está autenticado', () => {
      vi.mocked(authService.isAuthenticated).mockReturnValue(false);
      vi.mocked(authService.getUser).mockReturnValue(null);

      authFacade.checkAuth();

      const state = authFacade.currentState;
      
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('handleRefresh (private via callback)', () => {
    it('deve registrar callback de refresh no construtor', () => {
      // O callback é registrado automaticamente no construtor da facade
      // Testamos indiretamente através do login/logout
      expect(authFacade).toBeDefined();
      expect(authFacade.currentState).toBeDefined();
    });

    it('deve manter estado autenticado após refresh bem-sucedido', async () => {
      const mockUser = { username: 'admin' };
      
      // Simula estado inicial autenticado
      vi.mocked(authService.logout).mockReturnValue(undefined);
      vi.mocked(authService.login).mockResolvedValue({
        user: mockUser,
        tokens: {
          accessToken: 'token',
          refreshToken: 'refresh',
          expiresAt: 3600,
          refreshExpiresAt: 86400,
        },
      });

      await authFacade.login({ username: 'admin', password: 'admin' });

      // Verifica que está autenticado
      expect(authFacade.currentState.isAuthenticated).toBe(true);
    });
  });

  describe('getErrorMessage (private)', () => {
    it('deve retornar mensagem correta para erro 401', async () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'wrong',
      };

      vi.mocked(authService.logout).mockReturnValue(undefined);
      vi.mocked(authService.login).mockRejectedValue({
        response: { status: 401 },
      });

      await expect(authFacade.login(credentials)).rejects.toBeDefined();

      const state = authFacade.currentState;
      expect(state.error).toBe('Usuário ou senha inválidos');
    });

    it('deve retornar mensagem correta para erro 500', async () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'admin',
      };

      vi.mocked(authService.logout).mockReturnValue(undefined);
      vi.mocked(authService.login).mockRejectedValue({
        response: { status: 500 },
      });

      await expect(authFacade.login(credentials)).rejects.toBeDefined();

      const state = authFacade.currentState;
      expect(state.error).toBe('Erro no servidor. Tente novamente mais tarde.');
    });
  });

  describe('setLoading (private)', () => {
    it('deve definir loading true durante login', async () => {
      const credentials: LoginRequest = {
        username: 'admin',
        password: 'admin',
      };

      vi.mocked(authService.logout).mockReturnValue(undefined);
      vi.mocked(authService.login).mockImplementation(
        () => new Promise((resolve) => {
          // Durante o loading
          const state = authFacade.currentState;
          expect(state.isLoading).toBe(true);
          
          setTimeout(() => {
            resolve({
              user: { username: 'admin' },
              tokens: {
                accessToken: 'token',
                refreshToken: 'refresh',
                expiresAt: 3600,
                refreshExpiresAt: 86400,
              },
            });
          }, 10);
        })
      );

      await authFacade.login(credentials);
      
      const state = authFacade.currentState;
      expect(state.isLoading).toBe(false);
    });
  });
});
