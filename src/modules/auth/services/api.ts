import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "https://pet-manager-api.geia.vip",
  headers: {
    "Content-Type": "application/json",
  },
});

// Função para obter tokens e gerenciar refresh
let getAccessToken: (() => string | null) | null = null;
let handleTokenRefresh: (() => Promise<void>) | null = null;
let canRefreshToken: (() => boolean) | null = null;
let handleLogout: (() => void) | null = null;

// Função para registrar os callbacks
export const registerAuthCallbacks = (callbacks: {
  getAccessToken: () => string | null;
  handleTokenRefresh: () => Promise<void>;
  canRefreshToken: () => boolean;
  handleLogout: () => void;
}) => {
  getAccessToken = callbacks.getAccessToken;
  handleTokenRefresh = callbacks.handleTokenRefresh;
  canRefreshToken = callbacks.canRefreshToken;
  handleLogout = callbacks.handleLogout;
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isAuthRoute = config.url?.includes("/autenticacao/login") 
      || config.url?.includes("/autenticacao/refresh");
    
    if (isAuthRoute) {
      return config;
    }
    const token = getAccessToken?.();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute = originalRequest.url?.includes("/autenticacao/login") 
      || originalRequest.url?.includes("/autenticacao/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

        if (canRefreshToken?.()) {
          try {
          await handleTokenRefresh?.();

          const newToken = getAccessToken?.();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);

          } catch (refreshError) {
          handleLogout?.();
          return Promise.reject(refreshError);
          }

        } else {
          handleLogout?.();
          return Promise.reject(new Error("Seção expirada"));
        }
      
    }

    return Promise.reject(error);
  }
);