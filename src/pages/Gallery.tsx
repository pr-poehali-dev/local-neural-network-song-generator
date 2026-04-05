import { useState } from "react";
import Icon from "@/components/ui/icon";

const popular = [
  { id: 1, title: "Cosmic Drift", author: "NeuralBeat", genre: "Электроника", plays: "42K", likes: "3.2K", color: "#00e5ff", tags: ["синтвейв", "атмосфера", "ночь"] },
  { id: 2, title: "Piano Rain", author: "SoundCraft AI", genre: "Классика", plays: "38K", likes: "2.8K", color: "#a855f7", tags: ["пианино", "дождь", "романтика"] },
  { id: 3, title: "Street Flow", author: "RhythmGen", genre: "Хип-хоп", plays: "61K", likes: "5.1K", color: "#39ff14", tags: ["бит", "улица", "энергия"] },
  { id: 4, title: "Desert Wind", author: "LoFi Labs", genre: "Эмбиент", plays: "29K", likes: "1.9K", color: "#fbbf24", tags: ["эмбиент", "медитация", "покой"] },
  { id: 5, title: "Thunder Rock", author: "MetalMind", genre: "Рок", plays: "55K", likes: "4.3K", color: "#ff6b35", tags: ["гитара", "мощь", "адреналин"] },
  { id: 6, title: "Velvet Jazz", author: "SwingAI", genre: "Джаз", plays: "19K", likes: "1.4K", color: "#fbbf24", tags: ["саксофон", "вечер", "клуб"] },
  { id: 7, title: "Neon City", author: "CyberTunes", genre: "Поп", plays: "74K", likes: "6.7K", color: "#f472b6", tags: ["поп", "город", "будущее"] },
  { id: 8, title: "Deep Abyss", author: "DarkWave AI", genre: "Электроника", plays: "33K", likes: "2.2K", color: "#818cf8", tags: ["даркwave", "мрак", "глубина"] },
];

const genres = ["Все", "Электроника", "Поп", "Рок", "Джаз", "Классика", "Хип-хоп", "Эмбиент"];

export default function Gallery() {
  const [activeGenre, setActiveGenre] = useState("Все");
  const [playing, setPlaying] = useState<number | null>(null);
  const [sort, setSort] = useState("plays");

  const filtered = activeGenre === "Все"
    ? popular
    : popular.filter(t => t.genre === activeGenre);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-pink-400 to-yellow-400 rounded-full" />
          <span className="text-sm font-medium text-pink-400 tracking-widest uppercase">Галерея</span>
        </div>
        <h1 className="font-oswald text-4xl font-bold text-white mb-1">
          Популярные <span className="gradient-text">хиты</span>
        </h1>
        <p className="text-muted-foreground">Лучшие треки, созданные нейросетью</p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap fade-in-up">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap transition-all ${
                activeGenre === g
                  ? "bg-pink-500/20 border border-pink-500/50 text-pink-300"
                  : "glass border border-white/5 text-white/50 hover:text-white/70"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-white/5">
          <Icon name="TrendingUp" size={14} className="text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-sm text-white/70 outline-none cursor-pointer"
          >
            <option value="plays" className="bg-gray-900">По прослушиваниям</option>
            <option value="likes" className="bg-gray-900">По лайкам</option>
            <option value="new" className="bg-gray-900">Новые</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((track, i) => (
          <div
            key={track.id}
            className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300 group fade-in-up"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            {/* Track header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${track.color}33, ${track.color}11)`, border: `1px solid ${track.color}30` }}
                >
                  <Icon name="Music2" size={20} style={{ color: track.color }} />
                  {playing === track.id && (
                    <div className="absolute inset-0 flex items-end justify-center pb-1 gap-0.5">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div
                          key={j}
                          className="wave-bar rounded-full w-1"
                          style={{ background: track.color, height: `${Math.random() * 60 + 30}%`, animationDelay: `${j * 0.15}s` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{track.title}</h3>
                  <p className="text-xs text-muted-foreground">{track.author}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-lg" style={{ background: `${track.color}20`, color: track.color }}>
                {track.genre}
              </span>
            </div>

            {/* Tags */}
            <div className="flex gap-1.5 mb-4">
              {track.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="Play" size={10} />
                  {track.plays}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Heart" size={10} />
                  {track.likes}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPlaying(playing === track.id ? null : track.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: playing === track.id ? `${track.color}25` : 'rgba(255,255,255,0.05)',
                    color: playing === track.id ? track.color : 'rgba(255,255,255,0.6)',
                    border: `1px solid ${playing === track.id ? track.color + '40' : 'rgba(255,255,255,0.08)'}`
                  }}
                >
                  <Icon name={playing === track.id ? "Pause" : "Play"} size={12} />
                  {playing === track.id ? "Стоп" : "Играть"}
                </button>
                <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                  <Icon name="Download" size={14} className="text-white/50" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load more */}
      <div className="text-center mt-8">
        <button className="px-6 py-2.5 rounded-xl glass border border-white/10 text-white/60 text-sm hover:border-purple-500/30 hover:text-purple-300 transition-all">
          Загрузить ещё
        </button>
      </div>
    </div>
  );
}
