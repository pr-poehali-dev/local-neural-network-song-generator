import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { MusicEngine, type Genre as AudioGenre } from "@/lib/audioEngine";
import { generateSong, type SongLyrics } from "@/lib/lyricsEngine";
import { saveTrack, type SavedTrack } from "@/lib/tracksStore";
import KaraokePlayer from "@/components/KaraokePlayer";

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

const generatingSteps = [
  "Анализирую жанр и настроение...",
  "Подбираю аккордовую прогрессию...",
  "Генерирую мелодическую линию...",
  "Строю ритмическую структуру...",
  "Создаю текст песни...",
  "Финальная обработка...",
];

interface GeneratorProps {
  onGoHistory?: () => void;
}

type Tab = "generate" | "karaoke";

export default function Generator({ onGoHistory }: GeneratorProps) {
  const [tab, setTab] = useState<Tab>("generate");
  const [selectedGenre, setSelectedGenre] = useState("electronic");
  const [selectedMood, setSelectedMood] = useState("Энергичное");
  const [tempo, setTempo] = useState(128);
  const [duration, setDuration] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [song, setSong] = useState<SongLyrics | null>(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [savedId, setSavedId] = useState<string | null>(null);

  const engineRef = useRef<MusicEngine | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const genreColor = genres.find(g => g.id === selectedGenre)?.color || "#a855f7";

  const handleGenerate = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
      engineRef.current = null;
    }
    setIsGenerating(true);
    setGenerated(false);
    setIsPlaying(false);
    setPlayProgress(0);
    setProgress(0);
    setStepIndex(0);
    setShowLyrics(false);

    // Simulate generation steps
    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      setStepIndex(Math.min(step, generatingSteps.length - 1));
      setProgress(Math.min((step / generatingSteps.length) * 100, 95));
      if (step >= generatingSteps.length) {
        clearInterval(stepInterval);
        // Generate lyrics
        const lyrics = generateSong(selectedGenre as AudioGenre, selectedMood, tempo, prompt);
        setSong(lyrics);
        setSavedId(null);
        setProgress(100);
        // Автосохранение
        const newId = `track_${Date.now()}`;
        const track: SavedTrack = {
          id: newId,
          title: lyrics.title,
          genre: selectedGenre,
          genreLabel: genres.find(g => g.id === selectedGenre)?.label || "",
          genreColor: genres.find(g => g.id === selectedGenre)?.color || "#a855f7",
          mood: selectedMood,
          tempo,
          duration,
          createdAt: Date.now(),
          lyrics,
          plays: 0,
          liked: false,
        };
        saveTrack(track);
        setSavedId(newId);
        setTimeout(() => {
          setIsGenerating(false);
          setGenerated(true);
        }, 400);
      }
    }, 500);
  }, [selectedGenre, selectedMood, tempo, prompt]);

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      engineRef.current?.stop();
      engineRef.current = null;
      setIsPlaying(false);
      setCurrentBeat(0);
      setPlayProgress(0);
      if (progressInterval.current) clearInterval(progressInterval.current);
      return;
    }

    const engine = new MusicEngine(selectedGenre as AudioGenre, tempo);
    engineRef.current = engine;

    engine.onBeat = (beat, total) => {
      setCurrentBeat(beat);
      setPlayProgress(beat / total);
    };

    engine.onStop = () => {
      setIsPlaying(false);
      setCurrentBeat(0);
      setPlayProgress(0);
    };

    engine.play(duration);
    setIsPlaying(true);
  }, [isPlaying, selectedGenre, tempo, duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      engineRef.current?.stop();
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  // Stop engine when genre/tempo changes
  useEffect(() => {
    if (isPlaying) {
      engineRef.current?.stop();
      engineRef.current = null;
      setIsPlaying(false);
      setPlayProgress(0);
    }
  }, [selectedGenre, tempo]);

  const formatTime = (progress: number) => {
    const totalSec = duration * 60;
    const current = Math.floor(progress * totalSec);
    const m = Math.floor(current / 60);
    const s = current % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 fade-in-up fade-in-up-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-full" />
          <span className="text-sm font-medium text-purple-400 tracking-widest uppercase">AI Composer</span>
        </div>
        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white mb-3">
          Создай свой <span className="gradient-text">трек</span>
        </h1>
        <p className="text-muted-foreground">Настрой параметры — движок сгенерирует музыку и текст прямо в браузере</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-7 fade-in-up">
        {([
          { id: "generate", label: "Генератор", icon: "Sparkles" },
          { id: "karaoke", label: "Вокал / Караоке", icon: "Mic" },
        ] as { id: Tab; label: string; icon: string }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
              tab === t.id
                ? "text-white border-purple-500/50"
                : "text-white/40 border-white/5 hover:text-white/60 hover:border-white/10 glass"
            }`}
            style={tab === t.id ? { background: "rgba(168,85,247,0.15)" } : {}}
          >
            <Icon name={t.icon} fallback="Circle" size={15}
              style={{ color: tab === t.id ? "#a855f7" : undefined }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Karaoke tab */}
      {tab === "karaoke" && (
        <KaraokePlayer
          genre={selectedGenre}
          mood={selectedMood}
          tempo={tempo}
          genreColor={genreColor}
        />
      )}

      {tab === "generate" && <>
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left panel */}
        <div className="md:col-span-2 space-y-6">

          {/* Prompt */}
          <div className="glass rounded-2xl p-5 fade-in-up fade-in-up-2">
            <label className="text-xs text-muted-foreground uppercase tracking-widest mb-3 block">Описание трека</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 200))}
              placeholder="Напр.: энергичный трек для утренней пробежки с синтами и мощным басом..."
              className="w-full bg-transparent text-white placeholder-muted-foreground/50 resize-none outline-none text-sm leading-relaxed h-20"
            />
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
              <span className="text-xs text-muted-foreground/50">{prompt.length}/200</span>
              <div className="flex gap-1">
                {["🎸", "🎹", "🥁", "🎺", "🎻"].map((e, i) => (
                  <button key={i} onClick={() => setPrompt(p => (p + " " + e).slice(0, 200))}
                    className="text-base hover:scale-125 transition-transform">{e}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Genre */}
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
            <input type="range" min={1} max={5} value={duration} onChange={e => setDuration(+e.target.value)} />
            <div className="flex justify-between text-xs text-muted-foreground/40 mt-1">
              <span>1 мин</span><span>5 мин</span>
            </div>
          </div>

          {/* Live waveform */}
          <div className="glass rounded-2xl p-5">
            <label className="text-xs text-muted-foreground uppercase tracking-widest mb-4 block">Визуализация</label>
            <div className="flex items-end justify-center gap-0.5 h-12">
              {Array.from({ length: 32 }).map((_, i) => {
                const isBeat = isPlaying && (currentBeat % 32 === i);
                return (
                  <div
                    key={i}
                    className="rounded-full flex-1 transition-all duration-75"
                    style={{
                      background: isBeat
                        ? "#ffffff"
                        : i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#00e5ff" : "#f472b6",
                      height: `${isPlaying
                        ? Math.random() * 70 + 20
                        : isGenerating
                        ? Math.random() * 40 + 10
                        : 20}%`,
                      opacity: isPlaying || isGenerating ? 1 : 0.3,
                      animationPlayState: isPlaying || isGenerating ? "running" : "paused",
                      animation: (isPlaying || isGenerating) ? `wave-bar ${0.8 + i * 0.03}s ease-in-out infinite` : "none",
                      animationDelay: `${i * 0.04}s`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-8 space-y-4">
        {/* Generating state */}
        {isGenerating && (
          <div className="glass rounded-2xl p-6 border border-purple-500/20 fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full spin-slow flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white font-medium">Генерирую трек...</p>
                <p className="text-sm text-purple-300/70 mt-0.5">{generatingSteps[stepIndex]}</p>
              </div>
              <span className="font-oswald text-xl font-bold text-purple-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 progress-glow"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #a855f7, #00e5ff)" }}
              />
            </div>
            <div className="flex gap-1 mt-3">
              {generatingSteps.map((_, i) => (
                <div key={i} className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${i <= stepIndex ? "bg-purple-500" : "bg-white/10"}`} />
              ))}
            </div>
          </div>
        )}

        {/* Generated player */}
        {generated && song && (
          <div className="glass rounded-2xl border fade-in-up" style={{ borderColor: `${genreColor}30` }}>
            {/* Track header */}
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center relative pulse-ring"
                    style={{ background: `${genreColor}20`, border: `1px solid ${genreColor}40` }}
                  >
                    <Icon name="Music2" size={20} style={{ color: genreColor }} />
                  </div>
                  <div>
                    <h3 className="font-oswald text-lg font-bold text-white">{song.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {genres.find(g => g.id === selectedGenre)?.label} · {selectedMood} · {tempo} BPM · {duration} мин
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <button
                    onClick={() => setShowLyrics(!showLyrics)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                      showLyrics
                        ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                        : "bg-white/5 border-white/10 text-white/50 hover:text-white/70"
                    }`}
                  >
                    <Icon name="FileText" size={12} />
                    Текст
                  </button>
                  {/* Кнопка «В историю» */}
                  {savedId ? (
                    <button
                      onClick={() => { onGoHistory?.(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border bg-green-500/15 border-green-500/40 text-green-300 hover:bg-green-500/25 transition-all"
                    >
                      <Icon name="CheckCircle" size={12} />
                      В истории
                    </button>
                  ) : null}
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                    <Icon name="Heart" size={14} className="text-pink-400" />
                  </button>
                </div>
              </div>

              {/* Player controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlay}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
                  style={{
                    background: isPlaying
                      ? `${genreColor}30`
                      : `linear-gradient(135deg, #a855f7, #00e5ff)`,
                    boxShadow: isPlaying ? `0 0 20px ${genreColor}50` : "0 0 20px rgba(168,85,247,0.4)",
                  }}
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={18} className="text-white ml-0.5" />
                </button>

                {/* Progress bar */}
                <div className="flex-1">
                  <div className="h-1.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-100"
                      style={{
                        width: `${playProgress * 100}%`,
                        background: `linear-gradient(90deg, ${genreColor}, #a855f7)`,
                        boxShadow: `0 0 8px ${genreColor}60`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground/50 mt-1">
                    <span>{formatTime(playProgress)}</span>
                    <span>{duration}:00</span>
                  </div>
                </div>

                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full wave-bar"
                        style={{ background: genreColor, height: "100%", animationDelay: `${i * 0.12}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lyrics */}
            {showLyrics && (
              <div className="p-5 max-h-80 overflow-y-auto">
                <div className="space-y-5">
                  {song.sections.map((section, si) => (
                    <div key={si}>
                      <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: genreColor }}>
                        {section.label}
                      </p>
                      <div className="space-y-1">
                        {section.lines.map((line, li) => (
                          <p key={li} className="text-white/80 text-sm leading-relaxed">{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generate button */}
        {!isGenerating && (
          <button
            onClick={handleGenerate}
            className="w-full py-4 rounded-2xl text-white font-oswald font-semibold text-lg tracking-wider uppercase transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: generated
                ? "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(0,229,255,0.2))"
                : "linear-gradient(270deg, #a855f7, #00e5ff, #f472b6, #a855f7)",
              backgroundSize: "300% 300%",
              animation: generated ? "none" : "generating 2s ease infinite",
              border: generated ? "1px solid rgba(168,85,247,0.4)" : "none",
              boxShadow: generated ? "none" : "0 0 30px rgba(168,85,247,0.3)",
            }}
          >
            <span className="flex items-center justify-center gap-3">
              <Icon name={generated ? "RefreshCw" : "Sparkles"} size={20} />
              {generated ? "Сгенерировать ещё раз" : "Сгенерировать трек"}
            </span>
          </button>
        )}
      </div>
      </>}
    </div>
  );
}