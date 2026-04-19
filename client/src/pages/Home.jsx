import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { api } from "../services/api.js";
import AnimeCard from "../components/AnimeCard.jsx";
import { useAppState } from "../context/AppStateContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { search } = useOutletContext();
  const { isAuthed, loading: authLoading } = useAuth();
  const { continueWatching, cwLoading, loadContinueWatching } = useAppState();
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/anime", { params: { search } });
        if (!cancelled) setAnime(data.anime || []);
      } catch {
        if (!cancelled) setError("Could not load anime. Is the API running?");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search]);

  useEffect(() => {
    loadContinueWatching();
  }, [loadContinueWatching, isAuthed, authLoading]);

  const hero = useMemo(() => anime[0], [anime]);

  return (
    <div className="space-y-10">
      {hero && (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800/30">
          <div className="grid gap-6 md:grid-cols-[1.1fr_minmax(0,0.9fr)] md:items-center">
            <div className="relative h-56 sm:h-72 md:h-80">
              <img src={hero.poster} alt="" className="h-full w-full object-cover md:absolute md:inset-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent md:from-ink-950/90" />
            </div>
            <div className="relative space-y-4 p-6 md:py-10 md:pr-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Featured</p>
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{hero.title}</h1>
              <p className="max-w-xl text-sm text-slate-300">
                Binge mock episodes, track progress, and curate your watchlist — a compact streaming UI for
                learning full-stack basics.
              </p>
              <Link
                to={`/anime/${hero.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-glow hover:bg-accent-dim"
              >
                View details
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">Continue watching</h2>
            <p className="text-sm text-slate-400">
              {isAuthed ? "Synced to your account." : "Saved on this device while browsing as a guest."}
            </p>
          </div>
        </div>
        {cwLoading ? (
          <p className="text-sm text-slate-500">Loading progress…</p>
        ) : continueWatching.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 bg-ink-900/40 px-4 py-6 text-sm text-slate-400">
            Start an episode to see it appear here with your last timestamp.
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {continueWatching.map((row) => (
              <Link
                key={`${row.animeId}-${row.episodeId}`}
                to={`/watch/${row.animeId}/${row.episodeId}`}
                className="min-w-[220px] max-w-[240px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-800/50 transition hover:border-accent/40"
              >
                <div className="relative aspect-video">
                  <img src={row.anime.poster} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
                    <div
                      className="h-full bg-accent"
                      style={{
                        width: `${Math.min(
                          100,
                          row.durationSec
                            ? (row.lastPositionSec / row.durationSec) * 100
                            : 0
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-1 p-3">
                  <p className="font-display text-sm font-semibold text-white line-clamp-1">{row.anime.title}</p>
                  <p className="text-xs text-slate-400">
                    Ep {row.episode.number}
                    {row.episode.title ? ` · ${row.episode.title}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-white">Browse</h2>
        {loading ? (
          <p className="text-slate-400">Loading catalog…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {anime.map((a) => (
              <AnimeCard key={a.id} anime={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
