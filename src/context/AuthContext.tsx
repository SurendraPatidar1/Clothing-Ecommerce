import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '@/services/authService';
import { AUTH_LOGOUT_EVENT, tokenStorage } from '@/services/api';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  signup: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_KEY = 'cjmw_user';

function readStoredUser(): User | null {
  if (!tokenStorage.get()) return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') as User | null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const startSession = useCallback(({ token, user: u }: AuthResponse) => {
    tokenStorage.set(token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  // The axios interceptor fires this when the backend rejects the token.
  useEffect(() => {
    window.addEventListener(AUTH_LOGOUT_EVENT, clearSession);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, clearSession);
  }, [clearSession]);

  // Validate a persisted token on startup and refresh the cached profile.
  useEffect(() => {
    if (!tokenStorage.get()) return;
    authService
      .getProfile()
      .then((profile) => {
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
        setUser(profile);
      })
      .catch(() => {
        /* 401 is handled by the interceptor; network errors keep the cached user */
      });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login: async (payload) => startSession(await authService.login(payload)),
      signup: async (payload) => startSession(await authService.register(payload)),
      logout: clearSession,
    }),
    [user, startSession, clearSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
