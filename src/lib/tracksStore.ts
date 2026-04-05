import type { SongLyrics } from "./lyricsEngine";

export interface SavedTrack {
  id: string;
  title: string;
  genre: string;
  genreLabel: string;
  genreColor: string;
  mood: string;
  tempo: number;
  duration: number;
  createdAt: number;
  lyrics: SongLyrics;
  plays: number;
  liked: boolean;
}

const STORAGE_KEY = "soundforge_tracks";

export function loadTracks(): SavedTrack[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedTrack[]) : [];
  } catch {
    return [];
  }
}

export function saveTrack(track: SavedTrack): void {
  const tracks = loadTracks();
  const existing = tracks.findIndex(t => t.id === track.id);
  if (existing >= 0) {
    tracks[existing] = track;
  } else {
    tracks.unshift(track);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
}

export function deleteTrack(id: string): void {
  const tracks = loadTracks().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
}

export function toggleLike(id: string): void {
  const tracks = loadTracks();
  const t = tracks.find(t => t.id === id);
  if (t) {
    t.liked = !t.liked;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
  }
}

export function incrementPlays(id: string): void {
  const tracks = loadTracks();
  const t = tracks.find(t => t.id === id);
  if (t) {
    t.plays += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
  }
}

export function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Только что";
  if (min < 60) return `${min} мин назад`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Вчера";
  if (d < 7) return `${d} дн назад`;
  return new Date(ts).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}
