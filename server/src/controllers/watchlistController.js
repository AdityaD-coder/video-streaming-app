import { User } from "../models/User.js";
import { getAnimeById } from "../data/animeCatalog.js";

export async function getWatchlist(req, res) {
  try {
    const user = await User.findById(req.userId).select("watchlistAnimeIds").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const items = user.watchlistAnimeIds
      .map((id) => {
        const anime = getAnimeById(id);
        if (!anime) return null;
        return {
          id: anime.id,
          title: anime.title,
          poster: anime.poster,
          genres: anime.genres,
          episodeCount: anime.episodes.length,
        };
      })
      .filter(Boolean);
    return res.json({ watchlist: items });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function addToWatchlist(req, res) {
  try {
    const { animeId } = req.params;
    if (!getAnimeById(animeId)) {
      return res.status(404).json({ message: "Anime not found" });
    }
    await User.updateOne(
      { _id: req.userId },
      { $addToSet: { watchlistAnimeIds: animeId } }
    );
    const user = await User.findById(req.userId).select("watchlistAnimeIds").lean();
    return res.json({ watchlistAnimeIds: user.watchlistAnimeIds });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function removeFromWatchlist(req, res) {
  try {
    const { animeId } = req.params;
    await User.updateOne({ _id: req.userId }, { $pull: { watchlistAnimeIds: animeId } });
    const user = await User.findById(req.userId).select("watchlistAnimeIds").lean();
    return res.json({ watchlistAnimeIds: user.watchlistAnimeIds });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
}
