import React, {  useState, useCallback } from "react";
import axios from "axios";

import { loginApi } from "../api/auth";
import type { LoginCredentials, User } from "../types";
import { AuthContext } from "../hooks/useAuth";

const AUTH_STORAGE_KEY = "task_app_auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      return { user, isAuthenticated: true, isLoading: false, error: null };
    }
    return { user: null, isAuthenticated: false, isLoading: false, error: null };
  });

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const user = await loginApi(credentials);
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (err: unknown) {
      let message = "Login failed";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || "Login failed";
      }
      setState((s) => ({ ...s, isLoading: false, error: message }));
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}