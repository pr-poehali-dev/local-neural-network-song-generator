import { useState } from "react";
import Icon from "@/components/ui/icon";

const genres = [
  { id: "electronic", label: "Электроника", icon: "Zap", color: "#00e5ff" },
  { id: "pop", label: "Поп", icon: "Star", color: "#f472b6" },
  { id: "rock", label: "Рок", icon: "Flame", color: "#ff6b35" },
  { id: "jazz", label: "Джаз", icon: "Music", color: "#fbbf24" },
  { id: "classical", label: "Классика", icon: "Crown", color: "#a855f7" },
  { id: "hiphop", label: "Хип-хоп", icon: "Mic", color: "#39ff14" },
  { id: "ambient", label: "Эмбиент", icon: "Wind", color: "#818cf8" },
  { id: "metal", label: "Метал", icon: "Swords", color: "#f87171" },
];

const moods = ["Энергичное", "Расслабленное", "Меланхоличное", "Романтичное", "Эпическое", "Мистическое"];

export default function Generator() {
  const [selectedGenre, setSelectedGenre] = useState("electronic");
  const [selectedMood, setSelectedMood] = useState("Энергичное");
  const [tempo, setTempo] = useState(128);
  const [duration, setDuration] = useState(3);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerated(false);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setGenerated(true);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-in-up">
      {/* Header */}
      <div className="mb-10 fade-in-up fade-in-up-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-full" />
          <span className="text-sm font-medium text-purple-400 tracking-widest uppercase">AI Composer</span>
        </div>
        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white mb-3">
          Создай свой <span className="gradient-text">трек</span>
        </h1>
        <p className="text-muted-foreground">Опиши настроение — нейросеть сгенерирует уникальную музыку за секунды</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left panel */}
        <div className="md:col-span-2 space-y-6">

          {/* Prompt */}
          <div className="glass rounded-2xl p-5 fade-in-up fade-in-up-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest mb-3 block">Описание трека</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Напр.: энергичный трек для утренней пробежки с синтами и мощным басом..."
              className="w-full bg-transparent text-white placeholder-muted-foreground/50 resize-none outline-none text-sm leading-relaxed h-24"
            />
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
              <span className="text-xs text-muted-foreground/50">{prompt.length}/200 символов</span>
              <div className="flex gap-1">
                {["🎸", "🎹", "🥁", "🎺", "🎻"].map((e, i) => (
                  <button key={i} onClick={() => setPrompt(p => p + " " + e)}
                    className="text-base hover:scale-125 transition-transform">{e}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Genre Selection */}
          <div className="fade-in-up fade-in-up-3">
            <label className="text-xs text-muted-foreground uppercase tracking-widest mb-3 block">Жанр</label>
            <div className="grid grid-cols-4 gap-2">
              {genres.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  className={`genre-card glass rounded-xl p-3 flex flex-col items-center gap-2 border border-white/5 ${selectedGenre === g.id ? "active" : "hover:border-white/15"}`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${g.color}22` }}>
                    <Icon name={g.icon} fallback="Music" size={16} style={{ color: g.color }} />
                  </div>
                  <span className="text-xs font-medium text-white/80">{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="fade-in-up fade-in-up-4">
            <label className="text-xs text-muted-foreground uppercase tracking-widest mb-3 block">Настроение</label>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                    selectedMood === m
                      ? "bg-purple-500/20 border-purple-500/60 text-purple-300"
                      : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4 fade-in-up fade-in-up-3">
          {/* Tempo */}
          <div className="glass rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs text-muted-foreground uppercase tracking-widest">Темп</label>
              <span className="text-purple-400 font-oswald font-bold text-lg">{tempo} BPM</span>
            </div>
            <input type="range" min={60} max={200} value={tempo} onChange={e => setTempo(+e.target.value)} />
            <div className="flex justify-between text-xs text-muted-foreground/40 mt-1">
              <span>Медленно</span><span>Быстро</span>
            </div>
          </div>

          {/* Duration */}
          <div className="glass rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs text-muted-foreground uppercase tracking-widest">Длительность</label>
              <span className="text-cyan-400 font-oswald font-bold text-lg">{duration} мин</span>
            </div>
            <input type="range" min={1} max={10} value={duration} onChange={e => setDuration(+e.target.value)} />
            <div className="flex justify-between text-xs text-muted-foreground/40 mt-1">
              <span>1 мин</span><span>10 мин</span>
            </div>
          </div>

          {/* Waveform preview */}
          <div className="glass rounded-2xl p-5">
            <label className="text-xs text-muted-foreground uppercase tracking-widest mb-4 block">Визуализация</label>
            <div className="flex items-end justify-center gap-1 h-12">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="wave-bar w-1.5 rounded-full"
                  style={{
                    background: i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#00e5ff' : '#f472b6',
                    height: `${Math.random() * 70 + 20}%`,
                    animationDelay: `${i * 0.05}s`,
                    animationPlayState: isGenerating || generated ? 'running' : 'paused',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate button */}
      <div className="mt-8 fade-in-up fade-in-up-5">
        {isGenerating ? (
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full spin-slow" />
              <div>
                <p className="text-white font-medium">Генерирую трек...</p>
                <p className="text-sm text-muted-foreground">{Math.round(Math.min(progress, 100))}% завершено</p>
              </div>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full progress-glow rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  background: 'linear-gradient(90deg, #a855f7, #00e5ff)'
                }}
              />
            </div>
          </div>
        ) : generated ? (
          <div className="glass rounded-2xl p-6 border border-purple-500/30 neon-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center relative pulse-ring">
                  <Icon name="Music" size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Трек готов!</p>
                  <p className="text-xs text-muted-foreground">{genres.find(g => g.id === selectedGenre)?.label} · {selectedMood} · {tempo} BPM · {duration} мин</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Icon name="Heart" size={16} className="text-pink-400" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Icon name="Share2" size={16} className="text-cyan-400" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <Icon name="Download" size={16} className="text-white/60" />
                </button>
              </div>
            </div>
            {/* Fake player */}
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full generating-btn flex items-center justify-center flex-shrink-0">
                <Icon name="Play" size={16} className="text-white ml-0.5" />
              </button>
              <div className="flex-1">
                <div className="h-1 bg-white/10 rounded-full">
                  <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">1:{(duration * 20).toString().padStart(2, '0')} / {duration}:00</span>
            </div>
          </div>
        ) : (
          <button
            onClick={handleGenerate}
            className="w-full py-4 rounded-2xl generating-btn text-white font-oswald font-semibold text-lg tracking-wider uppercase transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-3">
              <Icon name="Sparkles" size={20} />
              Сгенерировать трек
            </span>
          </button>
        )}
      </div>
    </div>
  );
}