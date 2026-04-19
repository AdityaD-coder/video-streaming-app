import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AnimeDetails() {
  const { id } = useParams();
  const { isAuthed, user, toggleWatchlist } = useAuth();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/anime/${id}`);
        if (!cancelled) setAnime(data.anime);
      } catch {
        if (!cancelled) setError("Anime not found or API unavailable.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const inList = useMemo(
    () => Boolean(anime && user?.watchlistAnimeIds?.includes(anime.id)),
    [anime, user]
  );

  async function onToggleFavorite() {
    if (!isAuthed || !anime) return;
    setBusy(true);
    try {
      await toggleWatchlist(anime.id, !inList);
    } catch {
      /* handled silently for student demo */
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-slate-400">Loading…</p>;
  }
  if (error || !anime) {
    return <p className="text-red-400">{error || "Not found."}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800/40 shadow-xl">
          <img src={anime.poster} alt="" className="aspect-[2/3] w-full object-cover" />
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{anime.title}</h1>
            {isAuthed && (
              <button
                type="button"
                disabled={busy}
                onClick={onToggleFavorite}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-accent/50 disabled:opacity-50"
              >
                {inList ? "★ In my list" : "＋ Add to my list"}
              </button>
            )}
          </div>
          <p className="text-sm text-accent">{anime.genres.join(" · ")}</p>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-300">{anime.description}</p>
          {!isAuthed && (
            <p className="text-sm text-slate-500">
              <Link to="/login" className="text-neon underline-offset-2 hover:underline">
                Log in
              </Link>{" "}
              to sync favorites and watch history to your account.
            </p>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-white">Episodes</h2>
        <ul className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-ink-900/40">
          {anime.episodes.map((ep) => (
            <li key={ep.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Episode {ep.number}</p>
                <p className="font-medium text-white">{ep.title}</p>
              </div>
              <Link
                to={`/watch/${anime.id}/${ep.id}`}
                className="inline-flex w-fit items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-accent hover:text-ink-950"
              >
                Play
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
