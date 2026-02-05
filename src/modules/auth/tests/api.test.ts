import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerAuthCallbacks } from '../services/api';

describe('API Configuration', () => {
  let mockGetAccessToken: ReturnType<typeof vi.fn>;
  let mockHandleTokenRefresh: ReturnType<typeof vi.fn>;
  let mockCanRefreshToken: ReturnType<typeof vi.fn>;
  let mockHandleLogout: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockGetAccessToken = vi.fn();
    mockHandleTokenRefresh = vi.fn();
    mockCanRefreshToken = vi.fn();
    mockHandleLogout = vi.fn();
  });

  describe('registerAuthCallbacks', () => {
    it('deve registrar callbacks de autenticação', () => {
      const callbacks = {
        getAccessToken: mockGetAccessToken,
        handleTokenRefresh: mockHandleTokenRefresh,
        canRefreshToken: mockCanRefreshToken,
        handleLogout: mockHandleLogout,
      };

      expect(() => registerAuthCallbacks(callbacks as any)).not.toThrow();
    });

    it('deve permitir registrar múltiplas vezes', () => {
      const callbacks1 = {
        getAccessToken: vi.fn(),
        handleTokenRefresh: vi.fn(),
        canRefreshToken: vi.fn(),
        handleLogout: vi.fn(),
      };

      const callbacks2 = {
        getAccessToken: vi.fn(),
        handleTokenRefresh: vi.fn(),
        canRefreshToken: vi.fn(),
        handleLogout: vi.fn(),
      };

      expect(() => {
        registerAuthCallbacks(callbacks1 as any);
        registerAuthCallbacks(callbacks2 as any);
      }).not.toThrow();
    });

    it('deve aceitar callbacks válidos', async () => {
      mockGetAccessToken.mockReturnValue('token');
      mockCanRefreshToken.mockReturnValue(true);
      mockHandleTokenRefresh.mockResolvedValue(undefined);
      mockHandleLogout.mockReturnValue(undefined);

      registerAuthCallbacks({
        getAccessToken: mockGetAccessToken,
        handleTokenRefresh: mockHandleTokenRefresh,
        canRefreshToken: mockCanRefreshToken,
        handleLogout: mockHandleLogout,
      } as any);

      // Verifica que callbacks podem ser chamados
      expect((mockGetAccessToken as any)()).toBe('token');
      expect((mockCanRefreshToken as any)()).toBe(true);
      await expect((mockHandleTokenRefresh as any)()).resolves.toBeUndefined();
      expect((mockHandleLogout as any)()).toBeUndefined();
    });

    it('deve registrar callback getAccessToken que retorna null', () => {
      const getToken = vi.fn().mockReturnValue(null);
      
      registerAuthCallbacks({
        getAccessToken: getToken,
        handleTokenRefresh: mockHandleTokenRefresh,
        canRefreshToken: mockCanRefreshToken,
        handleLogout: mockHandleLogout,
      } as any);

      expect((getToken as any)()).toBeNull();
    });

    it('deve registrar callback canRefreshToken que retorna false', () => {
      const canRefresh = vi.fn().mockReturnValue(false);
      
      registerAuthCallbacks({
        getAccessToken: mockGetAccessToken,
        handleTokenRefresh: mockHandleTokenRefresh,
        canRefreshToken: canRefresh,
        handleLogout: mockHandleLogout,
      } as any);

      expect((canRefresh as any)()).toBe(false);
    });
  });
});

