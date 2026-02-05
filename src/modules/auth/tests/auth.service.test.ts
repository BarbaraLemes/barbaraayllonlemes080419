import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from '../services/auth.service';
import { api } from '../services/api';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

// Mock do módulo api
vi.mock('./api', () => ({
  api: {
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
    it('deve fazer login com sucesso e salvar tokens', async () => {
      const mockCredentials: LoginRequest = {
        username: 'admin',
        password: 'password123',
      };

      const mockResponse: LoginResponse = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        refresh_expires_in: 86400,
      };

      vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.login(mockCredentials);

      expect(api.post).toHaveBeenCalledWith('/autenticacao/login', mockCredentials);
      expect(result.user.username).toBe('admin');
      expect(result.tokens.accessToken).toBe('mock-access-token');
      expect(result.tokens.refreshToken).toBe('mock-refresh-token');
      
      // Verifica se os tokens foram salvos
      expect(localStorage.getItem('access_token')).toBe('mock-access-token');
      expect(localStorage.getItem('refresh_token')).toBe('mock-refresh-token');
    });

    it('deve lançar erro quando o login falhar', async () => {
      const mockCredentials: LoginRequest = {
        username: 'admin',
        password: 'wrong-password',
      };

      vi.mocked(api.post).mockRejectedValueOnce(new Error('Credenciais inválidas'));

      await expect(authService.login(mockCredentials)).rejects.toThrow('Credenciais inválidas');
      expect(localStorage.getItem('access_token')).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('deve renovar o token com sucesso', async () => {
      // Simula um refresh token válido no localStorage
      localStorage.setItem('refresh_token', 'valid-refresh-token');

      const mockResponse: LoginResponse = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_in: 3600,
        refresh_expires_in: 86400,
      };

      vi.mocked(api.put).mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.refreshToken();

      expect(api.put).toHaveBeenCalledWith(
        '/autenticacao/refresh',
        {},
        {
          headers: {
            Authorization: 'Bearer valid-refresh-token',
          },
        }
      );
      expect(result.accessToken).toBe('new-access-token');
      expect(localStorage.getItem('access_token')).toBe('new-access-token');
    });

    it('deve lançar erro quando não houver refresh token', async () => {
      await expect(authService.refreshToken()).rejects.toThrow('Sem refresh token disponível');
    });
  });

  describe('logout', () => {
    it('deve limpar todos os dados do localStorage', () => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('refresh_token', 'refresh');
      localStorage.setItem('user', JSON.stringify({ username: 'admin' }));

      authService.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('getAccessToken', () => {
    it('deve retornar o access token quando disponível', () => {
      localStorage.setItem('access_token', 'my-access-token');

      const token = authService.getAccessToken();

      expect(token).toBe('my-access-token');
    });

    it('deve retornar null quando não houver token', () => {
      const token = authService.getAccessToken();

      expect(token).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar true quando houver token válido', () => {
      const futureTime = Date.now() + 3600000; // 1 hora no futuro
      localStorage.setItem('access_token', 'valid-token');
      localStorage.setItem('expires_at', futureTime.toString());

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('deve retornar false quando não houver token', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('deve retornar false quando o token estiver expirado', () => {
      const pastTime = Date.now() - 1000; // 1 segundo no passado
      localStorage.setItem('access_token', 'expired-token');
      localStorage.setItem('expires_at', pastTime.toString());

      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
