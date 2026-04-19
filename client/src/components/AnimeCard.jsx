import { Link } from "react-router-dom";

export default function AnimeCard({ anime }) {
  return (
    <Link
      to={`/anime/${anime.id}`}
      className="group relative block overflow-hidden rounded-xl border border-white/5 bg-ink-800/40 shadow-lg transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-glow"
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={anime.poster}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent opacity-90" />
      </div>
      <div className="absolute inset-x-0 bottom-0 space-y-1 p-3">
        <h3 className="font-display text-sm font-semibold leading-snug text-white line-clamp-2">
          {anime.title}
        </h3>
        <p className="text-xs text-slate-400">{anime.episodeCount} episodes</p>
      </div>
    </Link>
  );
}
