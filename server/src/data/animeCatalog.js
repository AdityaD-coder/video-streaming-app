/**
 * Mock catalog — replace with a real DB later if needed.
 * Episode `src` uses sample MP4s (Big Buck Bunny) for demo playback.
 */
const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const animeCatalog = [
  {
    id: "a1",
    title: "Neon Sky Drifters",
    poster:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
    description:
      "In a neon-drenched megacity, courier pilots race rooftops to deliver mysterious packages that could reshape the world.",
    genres: ["Sci-Fi", "Action"],
    episodes: [
      { id: "a1-e1", number: 1, title: "First Drop", durationSec: 596, src: SAMPLE_VIDEO },
      { id: "a1-e2", number: 2, title: "Heat Haze", durationSec: 596, src: SAMPLE_VIDEO },
      { id: "a1-e3", number: 3, title: "Ghost Signal", durationSec: 596, src: SAMPLE_VIDEO },
    ],
  },
  {
    id: "a2",
    title: "Moonlit Bento Club",
    poster:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    description:
      "A cozy school club discovers that their midnight snacks summon tiny spirits who need help finishing unfinished business.",
    genres: ["Slice of Life", "Supernatural"],
    episodes: [
      { id: "a2-e1", number: 1, title: "Rice Ball Rumors", durationSec: 596, src: SAMPLE_VIDEO },
      { id: "a2-e2", number: 2, title: "Tea and Whispers", durationSec: 596, src: SAMPLE_VIDEO },
    ],
  },
  {
    id: "a3",
    title: "Blade of the Last Season",
    poster:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
    description:
      "When winter refuses to end, a wandering swordsman hunts the spirit responsible — and the truth about his own past.",
    genres: ["Fantasy", "Drama"],
    episodes: [
      { id: "a3-e1", number: 1, title: "Frostbite", durationSec: 596, src: SAMPLE_VIDEO },
      { id: "a3-e2", number: 2, title: "Thaw", durationSec: 596, src: SAMPLE_VIDEO },
      { id: "a3-e3", number: 3, title: "Bloom", durationSec: 596, src: SAMPLE_VIDEO },
      { id: "a3-e4", number: 4, title: "Last Petal", durationSec: 596, src: SAMPLE_VIDEO },
    ],
  },
  {
    id: "a4",
    title: "Circuit Hearts",
    poster:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
    description:
      "Two rival esports captains are forced to team up when an AI tournament organizer starts rewriting reality itself.",
    genres: ["Sports", "Sci-Fi"],
    episodes: [
      { id: "a4-e1", number: 1, title: "Lag Spike", durationSec: 596, src: SAMPLE_VIDEO },
      { id: "a4-e2", number: 2, title: "Combo Break", durationSec: 596, src: SAMPLE_VIDEO },
    ],
  },
];

export function listAnime(search = "") {
  const q = String(search).trim().toLowerCase();
  if (!q) return animeCatalog;
  return animeCatalog.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.genres.some((g) => g.toLowerCase().includes(q))
  );
}

export function getAnimeById(id) {
  return animeCatalog.find((a) => a.id === id) || null;
}

export function getEpisode(animeId, episodeId) {
  const anime = getAnimeById(animeId);
  if (!anime) return null;
  const ep = anime.episodes.find((e) => e.id === episodeId);
  if (!ep) return null;
  return { anime, episode: ep };
}
