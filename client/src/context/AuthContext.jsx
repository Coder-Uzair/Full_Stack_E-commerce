import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { authApi } from '@/api/auth.api.js';
import { setAccessToken, parseApiError } from '@/api/axios.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // bootstrapping session

  // On mount, try a silent refresh to restore the session.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await authApi.refresh();
        if (active && res?.data) {
          setAccessToken(res.data.accessToken);
          setUser(res.data.user);
        }
      } catch {
        /* no active session */
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const res = await authApi.login(credentials);
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
      return { ok: true, user: res.data.user };
    } catch (error) {
      return { ok: false, ...parseApiError(error) };
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      const res = await authApi.register(payload);
      return { ok: true, message: res.message };
    } catch (error) {
      return { ok: false, ...parseApiError(error) };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
