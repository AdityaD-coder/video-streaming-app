import { getEpisode } from "../data/animeCatalog.js";

/**
 * Returns playback URL for an episode (mock catalog — same sample file for all).
 * Protected so only logged-in users hit the player API.
 */
export function getPlayback(req, res) {
  const { animeId, episodeId } = req.params;
  const found = getEpisode(animeId, episodeId);
  if (!found) {
    return res.status(404).json({ message: "Episode not found" });
  }
  return res.json({
    src: found.episode.src,
    anime: {
      id: found.anime.id,
      title: found.anime.title,
      poster: found.anime.poster,
    },
    episode: {
      id: found.episode.id,
      number: found.episode.number,
      title: found.episode.title,
      durationSec: found.episode.durationSec,
    },
  });
}
