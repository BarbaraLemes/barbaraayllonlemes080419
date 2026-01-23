import { api } from "./api";
import type { 
  LoginRequest, 
  LoginResponse, 
  TokenData, 
  User 
} from "../types/auth.types";

class AuthService {
  private readonly STORAGE_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    EXPIRES_AT: "expires_at",
    REFRESH_EXPIRES_AT: "refresh_expires_at",
    USER: "user",
  } as const;

  async login(credentials: LoginRequest): Promise<{ user: User; tokens: TokenData }> {
    const response = await api.post<LoginResponse>("/autenticacao/login", credentials);
    
    const tokens = this.saveTokens(response.data);
    const user: User = { username: credentials.username };
    
    this.saveUser(user);

    return { user, tokens };
  }

  async refreshToken(): Promise<TokenData> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.put<LoginResponse>("/autenticacao/refresh", {
      refreshToken,
    });

    return this.saveTokens(response.data);
  }

  logout(): void {
    Object.values(this.STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  private saveTokens(data: LoginResponse): TokenData {
    const now = Date.now();

    const tokenData: TokenData = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: now + data.expires_in * 1000,
      refreshExpiresAt: now + data.refresh_expires_in * 1000,
    };

    localStorage.setItem(this.STORAGE_KEYS.ACCESS_TOKEN, tokenData.accessToken);
    localStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken);
    localStorage.setItem(this.STORAGE_KEYS.EXPIRES_AT, String(tokenData.expiresAt));
    localStorage.setItem(this.STORAGE_KEYS.REFRESH_EXPIRES_AT, String(tokenData.refreshExpiresAt));

    return tokenData;
  }

  private saveUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // Getters
  getAccessToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
  }

  getUser(): User | null {
    const userJson = localStorage.getItem(this.STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  }

  // Verificações
  hasValidToken(): boolean {
    const token = this.getAccessToken();
    const expiresAt = localStorage.getItem(this.STORAGE_KEYS.EXPIRES_AT);

    if (!token || !expiresAt) {
      return false;
    }

    return Date.now() < parseInt(expiresAt);
  }

  canRefresh(): boolean {
    const refreshToken = this.getRefreshToken();
    const refreshExpiresAt = localStorage.getItem(this.STORAGE_KEYS.REFRESH_EXPIRES_AT);

    if (!refreshToken || !refreshExpiresAt) {
      return false;
    }

    return Date.now() < parseInt(refreshExpiresAt);
  }
}

export const authService = new AuthService();