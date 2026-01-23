import { useEffect, useState } from "react";
import { authFacade } from "../services/auth.facade";
import type { AuthState, LoginRequest } from "../types/auth.types";

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authFacade.currentState);

  useEffect(() => {
    const subscription = authFacade.authState$.subscribe((state) => {
      setAuthState(state);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginRequest) => {
    await authFacade.login(credentials);
  };

  const logout = () => {
    authFacade.logout();
  };

  return {
    ...authState,
    login,
    logout,
  };
}