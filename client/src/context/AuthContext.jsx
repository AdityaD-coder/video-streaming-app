import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../services/api.js";

const AuthContext = createContext(null);

const TOKEN_KEY = "streanime_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistToken = useCallback((t) => {
    if (t) {
      localStorage.setItem(TOKEN_KEY, t);
      setAuthToken(t);
      setToken(t);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
      setToken(null);
    }
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setAuthToken(token);
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      persistToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token, persistToken]);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post("/auth/login", { email, password });
      persistToken(data.token);
      setUser(data.user);
      return data.user;
    },
    [persistToken]
  );

  const register = useCallback(
    async (email, password) => {
      const { data } = await api.post("/auth/register", { email, password });
      persistToken(data.token);
      setUser(data.user);
      return data.user;
    },
    [persistToken]
  );

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
  }, [persistToken]);

  const toggleWatchlist = useCallback(
    async (animeId, shouldAdd) => {
      if (!token || !user) {
        throw new Error("Login required");
      }
      if (shouldAdd) {
        const { data } = await api.post(`/watchlist/${encodeURIComponent(animeId)}`);
        setUser((u) => (u ? { ...u, watchlistAnimeIds: data.watchlistAnimeIds } : u));
      } else {
        const { data } = await api.delete(`/watchlist/${encodeURIComponent(animeId)}`);
        setUser((u) => (u ? { ...u, watchlistAnimeIds: data.watchlistAnimeIds } : u));
      }
    },
    [token, user]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthed: Boolean(token && user),
      login,
      register,
      logout,
      refreshMe,
      toggleWatchlist,
    }),
    [token, user, loading, login, register, logout, refreshMe, toggleWatchlist]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
