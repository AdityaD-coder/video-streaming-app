import { getAnimeById, listAnime } from "../data/animeCatalog.js";

export function getAllAnime(req, res) {
  const search = req.query.search || "";
  const items = listAnime(search).map((a) => ({
    id: a.id,
    title: a.title,
    poster: a.poster,
    genres: a.genres,
    episodeCount: a.episodes.length,
  }));
  return res.json({ anime: items });
}

export function getOneAnime(req, res) {
  const anime = getAnimeById(req.params.id);
  if (!anime) {
    return res.status(404).json({ message: "Anime not found" });
  }
  return res.json({
    anime: {
      id: anime.id,
      title: anime.title,
      poster: anime.poster,
      description: anime.description,
      genres: anime.genres,
      episodes: anime.episodes.map((e) => ({
        id: e.id,
        number: e.number,
        title: e.title,
        durationSec: e.durationSec,
        src: e.src,
      })),
    },
  });
}
