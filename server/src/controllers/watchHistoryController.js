import { WatchHistory } from "../models/WatchHistory.js";
import { getAnimeById, getEpisode } from "../data/animeCatalog.js";

export async function listHistory(req, res) {
  try {
    const rows = await WatchHistory.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    const enriched = rows
      .map((row) => {
        const anime = getAnimeById(row.animeId);
        const ep = anime?.episodes.find((e) => e.id === row.episodeId);
        if (!anime || !ep) return null;
        return {
          animeId: row.animeId,
          episodeId: row.episodeId,
          lastPositionSec: row.lastPositionSec,
          durationSec: row.durationSec || ep.durationSec,
          updatedAt: row.updatedAt,
          anime: {
            id: anime.id,
            title: anime.title,
            poster: anime.poster,
          },
          episode: {
            id: ep.id,
            number: ep.number,
            title: ep.title,
          },
        };
      })
      .filter(Boolean);

    return res.json({ history: enriched });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function upsertHistory(req, res) {
  try {
    const { animeId, episodeId, lastPositionSec, durationSec } = req.body || {};
    if (!animeId || !episodeId) {
      return res.status(400).json({ message: "animeId and episodeId required" });
    }
    const found = getEpisode(animeId, episodeId);
    if (!found) {
      return res.status(404).json({ message: "Episode not found" });
    }
    const pos = Math.max(0, Number(lastPositionSec) || 0);
    const dur =
      Number(durationSec) > 0
        ? Number(durationSec)
        : found.episode.durationSec || 0;

    const doc = await WatchHistory.findOneAndUpdate(
      { userId: req.userId, animeId, episodeId },
      {
        $set: {
          lastPositionSec: pos,
          durationSec: dur,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json({
      entry: {
        animeId: doc.animeId,
        episodeId: doc.episodeId,
        lastPositionSec: doc.lastPositionSec,
        durationSec: doc.durationSec,
        updatedAt: doc.updatedAt,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
}
