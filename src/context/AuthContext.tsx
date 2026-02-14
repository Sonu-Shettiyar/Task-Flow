import React, { createContext, useContext, useState, useCallback } from "react";
import { loginApi } from "../api/auth";
import type { AuthState, LoginCredentials, User } from "../types";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "task_app_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const user: User = JSON.parse(stored);
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

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err
      ) {
        const e = err as {
          response?: { data?: { message?: string } };
        };
        message = e.response?.data?.message ?? message;
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
