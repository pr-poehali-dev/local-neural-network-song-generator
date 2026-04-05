import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { MusicEngine, type Genre as AudioGenre } from "@/lib/audioEngine";
import {
  loadTracks,
  deleteTrack,
  toggleLike,
  incrementPlays,
  formatTimeAgo,
  type SavedTrack,
} from "@/lib/tracksStore";

interface HistoryProps {
  onGoGenerator?: () => void;
}

export default function History({ onGoGenerator }: HistoryProps) {
  const [tracks, setTracks] = useState<SavedTrack[]>(() => loadTracks());
  const [filter, setFilter] = useState<"all" | "liked">("all");
  const [search, setSearch] = useState("");
  const [playing, setPlaying] = useState<string | null>(null);
  const [playProgress, setPlayProgress] = useState<Record<string, number>>({});
  const [showLyrics, setShowLyrics] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const engineRef = useRef<MusicEngine | null>(null);

  const reload = () => setTracks(loadTracks());

  const handlePlay = useCallback((track: SavedTrack) => {
    if (playing === track.id) {
      engineRef.current?.stop();
      engineRef.current = null;
      setPlaying(null);
      return;
    }

    // Stop previous
    if (engineRef.current) {
      engineRef.current.stop();
      engineRef.current = null;
    }

    incrementPlays(track.id);
    reload();

    const engine = new MusicEngine(track.genre as AudioGenre, track.tempo);
    engineRef.current = engine;

    engine.onBeat = (beat, total) => {
      setPlayProgress(prev => ({ ...prev, [track.id]: beat / total }));
    };
    engine.onStop = () => {
      setPlaying(null);
      setPlayProgress(prev => ({ ...prev, [track.id]: 0 }));
    };

    engine.play(track.duration);
    setPlaying(track.id);
  }, [playing]);

  const handleDelete = (id: string) => {
    if (playing === id) {
      engineRef.current?.stop();
      engineRef.current = null;
      setPlaying(null);
    }
    deleteTrack(id);
    setConfirmDelete(null);
    reload();
  };

  const handleToggleLike = (id: string) => {
    toggleLike(id);
    reload();
  };

  useEffect(() => {
    return () => { engineRef.current?.stop(); };
  }, []);

  const filtered = tracks
    .filter(t => filter === "all" || t.liked)
    .filter(t =>
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.genreLabel.toLowerCase().includes(search.toLowerCase()) ||
      t.mood.toLowerCase().includes(search.toLowerCase())
    );

  const totalPlays = tracks.reduce((s, t) => s + t.plays, 0);
  const likedCount = tracks.filter(t => t.liked).length;

  const formatTime = (progress: number, duration: number) => {
    const totalSec = duration * 60;
    const cur = Math.floor(progress * totalSec);
    return `${Math.floor(cur / 60)}:${(cur % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
          <span className="text-sm font-medium text-cyan-400 tracking-widest uppercase">История</span>
        </div>
        <h1 className="font-oswald text-4xl font-bold text-white mb-1">
          Мои <span className="gradient-text-2">треки</span>
        </h1>
        <p className="text-muted-foreground">{tracks.length} сохранённых композиций</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 fade-in-up">
        {[
          { label: "Треков", value: String(tracks.length), icon: "Music", color: "#a855f7" },
          { label: "Прослушиваний", value: String(totalPlays), icon: "Headphones", color: "#00e5ff" },
          { label: "Избранное", value: String(likedCount), icon: "Heart", color: "#f472b6" },
        ].map(stat => (
          <div key={stat.label} className="glass rounded-xl p-4 border border-white/5 text-center">
            <Icon name={stat.icon} size={18} className="mx-auto mb-1.5" style={{ color: stat.color }} />
            <p className="font-oswald text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap fade-in-up">
        <div className="flex gap-2">
          {([["all", "Все"], ["liked", "Избранное"]] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === id
                  ? "bg-purple-500/20 border border-purple-500/50 text-purple-300"
                  : "glass border border-white/5 text-white/50 hover:text-white/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-white/5 flex-1 min-w-[160px]">
          <Icon name="Search" size={14} className="text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="bg-transparent text-sm text-white outline-none flex-1 placeholder-muted-foreground/40"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <Icon name="X" size={12} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Tracks list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Icon name="Music2" size={28} className="text-white/20" />
          </div>
          <p className="text-white/40 font-medium mb-1">
            {tracks.length === 0 ? "История пуста" : "Ничего не найдено"}
          </p>
          <p className="text-sm text-muted-foreground/50 mb-4">
            {tracks.length === 0 ? "Сгенерируй свой первый трек!" : "Попробуй другой запрос"}
          </p>
          {tracks.length === 0 && (
            <button
              onClick={onGoGenerator}
              className="px-5 py-2.5 rounded-xl generating-btn text-white text-sm font-medium inline-flex items-center gap-2"
            >
              <Icon name="Sparkles" size={14} />
              Создать трек
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((track, i) => (
            <div
              key={track.id}
              className="glass rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden fade-in-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {/* Main row */}
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {/* Play button */}
                  <button
                    onClick={() => handlePlay(track)}
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
                    style={{
                      background: playing === track.id ? `${track.genreColor}30` : "rgba(255,255,255,0.06)",
                      border: `1px solid ${playing === track.id ? track.genreColor + "50" : "rgba(255,255,255,0.1)"}`,
                      boxShadow: playing === track.id ? `0 0 14px ${track.genreColor}40` : "none",
                    }}
                  >
                    <Icon
                      name={playing === track.id ? "Pause" : "Play"}
                      size={14}
                      className="ml-0.5"
                      style={{ color: playing === track.id ? track.genreColor : "rgba(255,255,255,0.7)" }}
                    />
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-white text-sm truncate">{track.title}</span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: `${track.genreColor}20`, color: track.genreColor }}
                      >
                        {track.genreLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span>{track.mood}</span>
                      <span>·</span>
                      <span>{track.tempo} BPM</span>
                      <span>·</span>
                      <span>{track.duration} мин</span>
                      <span>·</span>
                      <span>{formatTimeAgo(track.createdAt)}</span>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-xs text-muted-foreground/50 mr-1 flex items-center gap-1">
                      <Icon name="Play" size={9} />
                      {track.plays}
                    </span>
                    <button
                      onClick={() => setShowLyrics(showLyrics === track.id ? null : track.id)}
                      className={`p-1.5 rounded-lg transition-colors ${showLyrics === track.id ? "bg-purple-500/20 text-purple-300" : "hover:bg-white/5 text-white/30 hover:text-white/60"}`}
                    >
                      <Icon name="FileText" size={13} />
                    </button>
                    <button
                      onClick={() => handleToggleLike(track.id)}
                      className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Icon
                        name="Heart"
                        size={13}
                        style={{ color: track.liked ? "#f472b6" : "rgba(255,255,255,0.3)" }}
                        fill={track.liked ? "#f472b6" : "none"}
                      />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(track.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors"
                    >
                      <Icon name="Trash2" size={13} />
                    </button>
                  </div>
                </div>

                {/* Progress bar when playing */}
                {playing === track.id && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-100"
                        style={{
                          width: `${(playProgress[track.id] || 0) * 100}%`,
                          background: `linear-gradient(90deg, ${track.genreColor}, #a855f7)`,
                          boxShadow: `0 0 6px ${track.genreColor}60`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground/60 flex-shrink-0">
                      {formatTime(playProgress[track.id] || 0, track.duration)} / {track.duration}:00
                    </span>
                    <div className="flex items-end gap-0.5 h-4">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div
                          key={j}
                          className="w-0.5 rounded-full wave-bar"
                          style={{ background: track.genreColor, height: "100%", animationDelay: `${j * 0.12}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lyrics panel */}
              {showLyrics === track.id && (
                <div className="border-t border-white/5 px-4 pb-4 pt-3 max-h-56 overflow-y-auto">
                  <div className="space-y-4">
                    {track.lyrics.sections.map((section, si) => (
                      <div key={si}>
                        <p className="text-xs uppercase tracking-widest mb-1.5 font-medium" style={{ color: track.genreColor }}>
                          {section.label}
                        </p>
                        {section.lines.map((line, li) => (
                          <p key={li} className="text-white/70 text-xs leading-relaxed">{line}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm delete */}
              {confirmDelete === track.id && (
                <div className="border-t border-red-500/20 bg-red-500/5 px-4 py-3 flex items-center justify-between">
                  <p className="text-sm text-white/70">Удалить трек «{track.title}»?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      onClick={() => handleDelete(track.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-xs border border-red-500/30 hover:bg-red-500/30 transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
