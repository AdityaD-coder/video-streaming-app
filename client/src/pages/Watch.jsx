import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useAppState } from "../context/AppStateContext.jsx";
import { readGuestHistory, upsertGuestHistory } from "../utils/guestStorage.js";

export default function Watch() {
  const { animeId, episodeId } = useParams();
  const { isAuthed } = useAuth();
  const { loadContinueWatching } = useAppState();
  const videoRef = useRef(null);
  const [anime, setAnime] = useState(null);
  const [episode, setEpisode] = useState(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const lastSave = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError("");
      try {
        const { data } = await api.get(`/anime/${animeId}`);
        if (cancelled) return;
        const a = data.anime;
        const ep = a.episodes.find((e) => e.id === episodeId);
        if (!ep) {
          setError("Episode not found.");
          return;
        }
        setAnime(a);
        setEpisode(ep);
      } catch {
        if (!cancelled) setError("Could not load episode.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [animeId, episodeId]);

  const saveProgress = useCallback(
    async (positionSec, durationSec) => {
      if (!animeId || !episodeId) return;
      const payload = {
        animeId,
        episodeId,
        lastPositionSec: Math.floor(positionSec),
        durationSec: Math.floor(durationSec || episode?.durationSec || 0),
      };
      if (isAuthed) {
        await api.post("/watch-history", payload);
      } else {
        upsertGuestHistory({
          ...payload,
          episodeNumber: episode?.number,
          episodeTitle: episode?.title,
        });
      }
      loadContinueWatching();
    },
    [animeId, episodeId, episode, isAuthed, loadContinueWatching]
  );

  useEffect(() => {
    if (!episode || !videoRef.current) return;
    let cancelled = false;
    (async () => {
      let resume = 0;
      if (isAuthed) {
        try {
          const { data } = await api.get("/watch-history");
          const row = (data.history || []).find(
            (h) => h.animeId === animeId && h.episodeId === episodeId
          );
          resume = row?.lastPositionSec || 0;
        } catch {
          resume = 0;
        }
      } else {
        const list = readGuestHistory();
        const row = list.find((h) => h.animeId === animeId && h.episodeId === episodeId);
        resume = row?.lastPositionSec || 0;
      }
      if (cancelled || !videoRef.current) return;
      const el = videoRef.current;
      const onMeta = () => {
        if (resume > 5 && resume < (el.duration || 0) - 5) {
          el.currentTime = resume;
        }
        el.removeEventListener("loadedmetadata", onMeta);
      };
      el.addEventListener("loadedmetadata", onMeta);
    })();
    return () => {
      cancelled = true;
    };
  }, [episode, isAuthed, animeId, episodeId]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !episode) return undefined;

    const tick = () => {
      if (!el.duration || !started) return;
      const now = Date.now();
      if (now - lastSave.current < 4000) return;
      lastSave.current = now;
      void saveProgress(el.currentTime, el.duration);
    };

    const onPause = () => {
      if (el.duration) void saveProgress(el.currentTime, el.duration);
    };

    el.addEventListener("timeupdate", tick);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("timeupdate", tick);
      el.removeEventListener("pause", onPause);
    };
  }, [episode, started, saveProgress]);

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }
  if (!anime || !episode) {
    return <p className="text-slate-400">Preparing player…</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
        <Link to="/" className="hover:text-white">
          Home
        </Link>
        <span>/</span>
        <Link to={`/anime/${anime.id}`} className="hover:text-white">
          {anime.title}
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl ring-1 ring-white/5">
        <video
          ref={videoRef}
          className="aspect-video w-full bg-black"
          src={episode.src}
          controls
          playsInline
          poster={anime.poster}
          onPlay={() => setStarted(true)}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Episode {episode.number}
        </p>
        <h1 className="font-display text-2xl font-bold text-white">{episode.title}</h1>
        <p className="text-sm text-slate-400">
          Progress saves every few seconds{isAuthed ? " to your account" : " on this device"}.
        </p>
      </div>
    </div>
  );
}
