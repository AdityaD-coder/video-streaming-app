const HISTORY_KEY = "streanime_guest_history";

export function readGuestHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function upsertGuestHistory(entry) {
  const list = readGuestHistory();
  const idx = list.findIndex(
    (x) => x.animeId === entry.animeId && x.episodeId === entry.episodeId
  );
  const row = {
    animeId: entry.animeId,
    episodeId: entry.episodeId,
    lastPositionSec: entry.lastPositionSec,
    durationSec: entry.durationSec,
    episodeNumber: entry.episodeNumber,
    episodeTitle: entry.episodeTitle,
    updatedAt: Date.now(),
  };
  if (idx >= 0) list[idx] = row;
  else list.unshift(row);
  list.sort((a, b) => b.updatedAt - a.updatedAt);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 24)));
}
