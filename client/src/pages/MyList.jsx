import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import AnimeCard from "../components/AnimeCard.jsx";

export default function MyList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/watchlist");
        if (!cancelled) setItems(data.watchlist || []);
      } catch {
        if (!cancelled) setError("Could not load your list.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">My list</h1>
        <p className="text-sm text-slate-400">Anime you have starred for later.</p>
      </div>
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-sm text-slate-400">
          Nothing here yet — tap “Add to my list” on a show&apos;s page.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((a) => (
            <AnimeCard key={a.id} anime={a} />
          ))}
        </div>
      )}
    </div>
  );
}
