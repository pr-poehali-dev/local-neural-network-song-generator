import { useState } from "react";
import Icon from "@/components/ui/icon";

const tracks = [
  { id: 1, title: "Neon Pulse", genre: "Электроника", mood: "Энергичное", tempo: 140, duration: "3:42", date: "Сегодня, 14:23", plays: 12, liked: true, color: "#00e5ff" },
  { id: 2, title: "Midnight Jazz", genre: "Джаз", mood: "Расслабленное", tempo: 72, duration: "5:18", date: "Сегодня, 11:05", plays: 7, liked: false, color: "#fbbf24" },
  { id: 3, title: "Electric Storm", genre: "Рок", mood: "Эпическое", tempo: 165, duration: "4:10", date: "Вчера, 20:44", plays: 34, liked: true, color: "#ff6b35" },
  { id: 4, title: "Soft Dreams", genre: "Эмбиент", mood: "Меланхоличное", tempo: 85, duration: "6:00", date: "Вчера, 18:30", plays: 5, liked: false, color: "#818cf8" },
  { id: 5, title: "Pop Sensation", genre: "Поп", mood: "Романтичное", tempo: 110, duration: "2:58", date: "2 дня назад", plays: 21, liked: true, color: "#f472b6" },
  { id: 6, title: "Royal Suite", genre: "Классика", mood: "Эпическое", tempo: 68, duration: "8:22", date: "3 дня назад", plays: 9, liked: false, color: "#a855f7" },
];

export default function History() {
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set(tracks.filter(t => t.liked).map(t => t.id)));
  const [playing, setPlaying] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const toggleLike = (id: number) => {
    setLikedTracks(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const filtered = filter === "liked" ? tracks.filter(t => likedTracks.has(t.id)) : tracks;

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
        <p className="text-muted-foreground">{tracks.length} созданных композиций</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 fade-in-up">
        {[{ id: "all", label: "Все треки" }, { id: "liked", label: "Избранное" }].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.id
                ? "bg-purple-500/20 border border-purple-500/50 text-purple-300"
                : "glass border border-white/5 text-white/50 hover:text-white/70"
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 glass rounded-xl px-3 border border-white/5">
          <Icon name="Search" size={14} className="text-muted-foreground" />
          <input placeholder="Поиск..." className="bg-transparent text-sm text-white outline-none w-32 placeholder-muted-foreground/40" />
        </div>
      </div>

      {/* Tracks list */}
      <div className="space-y-3">
        {filtered.map((track, i) => (
          <div
            key={track.id}
            className="glass rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300 group fade-in-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center gap-4">
              {/* Play button */}
              <button
                onClick={() => setPlaying(playing === track.id ? null : track.id)}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: playing === track.id
                    ? `${track.color}33`
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${playing === track.id ? track.color + '60' : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: playing === track.id ? `0 0 12px ${track.color}44` : 'none'
                }}
              >
                <Icon
                  name={playing === track.id ? "Pause" : "Play"}
                  size={14}
                  className="ml-0.5"
                  style={{ color: playing === track.id ? track.color : 'rgba(255,255,255,0.7)' }}
                />
              </button>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-white truncate">{track.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${track.color}20`, color: track.color }}>
                    {track.genre}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{track.mood}</span>
                  <span>·</span>
                  <span>{track.tempo} BPM</span>
                  <span>·</span>
                  <span>{track.date}</span>
                </div>
                {/* Mini waveform */}
                {playing === track.id && (
                  <div className="flex items-end gap-0.5 mt-2 h-4">
                    {Array.from({ length: 30 }).map((_, j) => (
                      <div
                        key={j}
                        className="wave-bar rounded-full flex-1"
                        style={{
                          background: track.color,
                          height: `${Math.random() * 70 + 20}%`,
                          animationDelay: `${j * 0.04}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon name="Play" size={10} />
                  <span>{track.plays}</span>
                </div>
                <span className="text-xs text-muted-foreground">{track.duration}</span>
                <button onClick={() => toggleLike(track.id)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                  <Icon
                    name={likedTracks.has(track.id) ? "Heart" : "Heart"}
                    size={14}
                    className={likedTracks.has(track.id) ? "text-pink-400" : "text-white/30"}
                    fill={likedTracks.has(track.id) ? "#f472b6" : "none"}
                  />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100">
                  <Icon name="Download" size={14} className="text-white/50" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100">
                  <Icon name="Trash2" size={14} className="text-red-400/50" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 fade-in-up">
        {[
          { label: "Всего треков", value: "6", icon: "Music", color: "#a855f7" },
          { label: "Прослушиваний", value: "88", icon: "Headphones", color: "#00e5ff" },
          { label: "В избранном", value: String(likedTracks.size), icon: "Heart", color: "#f472b6" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4 border border-white/5 text-center">
            <Icon name={stat.icon} size={20} className="mx-auto mb-2" style={{ color: stat.color }} />
            <p className="font-oswald text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}