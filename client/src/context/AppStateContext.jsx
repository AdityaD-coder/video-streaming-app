import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { readGuestHistory } from "../utils/guestStorage.js";
import { useAuth } from "./AuthContext.jsx";

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const { isAuthed, loading: authLoading } = useAuth();
  const [continueWatching, setContinueWatching] = useState([]);
  const [cwLoading, setCwLoading] = useState(false);

  const loadContinueWatching = useCallback(async () => {
    if (authLoading) return;
    setCwLoading(true);
    try {
      if (isAuthed) {
        const { data } = await api.get("/watch-history");
        setContinueWatching(data.history || []);
        return;
      }
      const guest = readGuestHistory();
      if (!guest.length) {
        setContinueWatching([]);
        return;
      }
      const { data } = await api.get("/anime");
      const byId = Object.fromEntries((data.anime || []).map((a) => [a.id, a]));
      const enriched = guest
        .map((row) => {
          const anime = byId[row.animeId];
          if (!anime) return null;
          return {
            animeId: row.animeId,
            episodeId: row.episodeId,
            lastPositionSec: row.lastPositionSec,
            durationSec: row.durationSec,
            updatedAt: new Date(row.updatedAt).toISOString(),
            anime: { id: anime.id, title: anime.title, poster: anime.poster },
            episode: {
              id: row.episodeId,
              number: row.episodeNumber ?? 0,
              title: row.episodeTitle || "Episode",
            },
          };
        })
        .filter(Boolean);
      setContinueWatching(enriched);
    } catch {
      setContinueWatching([]);
    } finally {
      setCwLoading(false);
    }
  }, [isAuthed, authLoading]);

  const value = useMemo(
    () => ({
      continueWatching,
      cwLoading,
      loadContinueWatching,
      setContinueWatching,
    }),
    [continueWatching, cwLoading, loadContinueWatching]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
