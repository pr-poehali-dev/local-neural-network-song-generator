import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { KaraokeEngine, buildKaraokeLines, type KaraokeLine } from "@/lib/karaokeEngine";
import { MusicEngine, type Genre as AudioGenre } from "@/lib/audioEngine";

interface KaraokePlayerProps {
  genre: string;
  mood: string;
  tempo: number;
  genreColor: string;
}

const SAMPLE_TEXTS: Record<string, string> = {
  electronic: `Мы мчимся сквозь цифровой свет\nПо кодам и частотам вперёд\nНейронный импульс — вечный ответ\nСистема нас снова зовёт\n\nПульс, пульс, электронный пульс\nВибрирует в каждой клетке\nПульс, пульс, мы не вернёмся назад\nМы живём в этой сетке`,
  pop: `Ты смотришь на меня сквозь звёздный свет\nИ сердце моё ускоряет ход\nЯ знаю — другого такого нет\nМы вместе встречаем новый восход\n\nНавсегда, навсегда\nЭта ночь останется с нами\nНавсегда, навсегда\nМы написали историю сами`,
  rock: `Гром над городом — это мы\nМы не боимся ни тьмы ни стен\nГоры рушатся от волны\nСвобода стоит дороже всех\n\nГори, гори, живой огонь\nНас не сломить — мы снова встанем\nГори, гори, сильнее гром\nМы этот мир перекричали`,
  jazz: `Поздний вечер, синий дым\nСаксофон поёт о прошлом\nМы остались вдвоём с тобой\nВ этом клубе полупустом\n\nЗвучи, звучи, мой старый блюз\nШепчи мне о далёком лете\nЗвучи, звучи, твой нежный джаз\nМы лучшее что есть на свете`,
  classical: `О вечность, ты звучишь в тиши\nКак голос неба над землёй\nДуша моя тебя нашла\nВ симфонии над высотой\n\nПой, пой, бессмертная краса\nПарит над временем и болью\nПой, пой, в тебе моя душа\nТвоей я покорился воле`,
  hiphop: `Я иду по улице своей\nКаждый шаг — это мой путь\nНет преград для моих идей\nЯ скажу то что думаю суть\n\nРеальный, настоящий, живой\nМикрофон — это мой голос\nРеальный, без маски, прямой\nЭто мой район, мой колос`,
  ambient: `Далёкий горизонт зовёт\nТуман над тихою водой\nДуша неслышно устаёт\nИ растворяется с зарёй\n\nТиши, тиши, дыши со мной\nМы в бесконечном океане\nТиши, тиши, плыви домой\nВсё растворится на рассвете`,
  metal: `Тьма опускается на мир\nСталь и огонь — наш ответ\nМы разрушаем старый мир\nИ строим новый из побед\n\nГнев, ярость, сила и хаос\nМы поднимаемся из пепла\nГнев, ярость — это наш голос\nМы будем вечными как небо`,
};

export default function KaraokePlayer({ genre, mood, tempo, genreColor }: KaraokePlayerProps) {
  const [mode, setMode] = useState<"input" | "playing" | "done">("input");
  const [inputText, setInputText] = useState("");
  const [lines, setLines] = useState<KaraokeLine[]>([]);
  const [currentLine, setCurrentLine] = useState(-1);
  const [currentWord, setCurrentWord] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatingVocal, setGeneratingVocal] = useState(false);
  const [vocalProgress, setVocalProgress] = useState(0);

  const karaokeRef = useRef<KaraokeEngine | null>(null);
  const musicRef = useRef<MusicEngine | null>(null);
  const lyricsScrollRef = useRef<HTMLDivElement>(null);

  // Прокручиваем к текущей строке
  useEffect(() => {
    if (currentLine >= 0 && lyricsScrollRef.current) {
      const lineEl = lyricsScrollRef.current.querySelector(`[data-line="${currentLine}"]`);
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentLine]);

  const handleLoadSample = () => {
    setInputText(SAMPLE_TEXTS[genre] || SAMPLE_TEXTS.pop);
  };

  const handleGenerate = useCallback(() => {
    if (!inputText.trim()) return;

    setGeneratingVocal(true);
    setVocalProgress(0);

    // Имитация анализа текста
    const interval = setInterval(() => {
      setVocalProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setVocalProgress(100);

      const builtLines = buildKaraokeLines(inputText, tempo, genre);
      setLines(builtLines);
      setGeneratingVocal(false);
      setMode("playing");
      setCurrentLine(-1);
      setCurrentWord(-1);
      setProgress(0);
      setIsPlaying(false);
    }, 1800);
  }, [inputText, tempo, genre]);

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      karaokeRef.current?.stop();
      musicRef.current?.stop();
      karaokeRef.current = null;
      musicRef.current = null;
      setIsPlaying(false);
      setCurrentLine(-1);
      setCurrentWord(-1);
      setProgress(0);
      return;
    }

    // Запускаем музыкальный фон
    const music = new MusicEngine(genre as AudioGenre, tempo);
    musicRef.current = music;
    music.play(Math.ceil(lines[lines.length - 1]?.endSec / 60 + 0.5) || 2);

    // Запускаем вокальный движок
    const karaoke = new KaraokeEngine();
    karaoke.setup(lines, genre, tempo);
    karaokeRef.current = karaoke;

    karaoke.onLineChange = (li) => setCurrentLine(li);
    karaoke.onWordChange = (li, wi) => { setCurrentLine(li); setCurrentWord(wi); };
    karaoke.onProgress = (p) => setProgress(p);
    karaoke.onStop = () => {
      setIsPlaying(false);
      setCurrentLine(-1);
      setCurrentWord(-1);
      music.stop();
    };

    karaoke.play();
    setIsPlaying(true);
  }, [isPlaying, lines, genre, tempo]);

  useEffect(() => {
    return () => {
      karaokeRef.current?.stop();
      musicRef.current?.stop();
    };
  }, []);

  const formatTime = (progress: number) => {
    if (!lines.length) return "0:00";
    const totalSec = lines[lines.length - 1]?.endSec || 60;
    const cur = Math.floor(progress * totalSec);
    return `${Math.floor(cur / 60)}:${(cur % 60).toString().padStart(2, "0")}`;
  };

  const totalLines = inputText.split("\n").filter(l => l.trim() && !l.startsWith("[")).length;

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center gap-2 glass rounded-xl p-1 border border-white/5 w-fit">
        {(["input", "playing"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { if (m === "input") { karaokeRef.current?.stop(); musicRef.current?.stop(); setIsPlaying(false); } setMode(m); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? "text-white"
                : "text-white/40 hover:text-white/60"
            }`}
            style={mode === m ? { background: `${genreColor}25`, color: genreColor } : {}}
          >
            {m === "input" ? "✏️ Текст" : "🎤 Плеер"}
          </button>
        ))}
      </div>

      {/* Input mode */}
      {mode === "input" && (
        <div className="space-y-3">
          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs text-muted-foreground uppercase tracking-widest">Текст песни</label>
              <button
                onClick={handleLoadSample}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all"
              >
                <Icon name="Wand2" size={11} />
                Пример для жанра
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Вставь текст песни...\n\nКуплет 1:\nСтрока первая\nСтрока вторая\n\nПрипев:\nПрипев первая строка\nПрипев вторая строка`}
              className="w-full bg-transparent text-white placeholder-muted-foreground/30 resize-none outline-none text-sm leading-relaxed h-52 font-mono"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
                <span>{totalLines} строк</span>
                <span>·</span>
                <span>{inputText.length} символов</span>
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground/40">
                <span>Строки начинающиеся с [ игнорируются</span>
              </div>
            </div>
          </div>

          {/* Generate vocal button */}
          {generatingVocal ? (
            <div className="glass rounded-2xl p-5 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full spin-slow flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">Синтезирую вокальную линию...</p>
                  <p className="text-xs text-purple-300/60 mt-0.5">Анализирую слоги и строю мелодический контур</p>
                </div>
                <span className="font-oswald text-lg font-bold text-purple-400 ml-auto">{Math.round(Math.min(vocalProgress, 100))}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(vocalProgress, 100)}%`,
                    background: `linear-gradient(90deg, ${genreColor}, #a855f7)`,
                    boxShadow: `0 0 8px ${genreColor}60`,
                  }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!inputText.trim()}
              className="w-full py-4 rounded-2xl text-white font-oswald font-semibold text-lg tracking-wider uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01]"
              style={{
                background: inputText.trim()
                  ? `linear-gradient(270deg, ${genreColor}, #a855f7, #f472b6, ${genreColor})`
                  : "rgba(255,255,255,0.05)",
                backgroundSize: "300% 300%",
                animation: inputText.trim() ? "generating 2s ease infinite" : "none",
                boxShadow: inputText.trim() ? `0 0 25px ${genreColor}30` : "none",
              }}
            >
              <span className="flex items-center justify-center gap-3">
                <Icon name="Mic" size={20} />
                Сгенерировать вокал
              </span>
            </button>
          )}
        </div>
      )}

      {/* Karaoke player mode */}
      {mode === "playing" && lines.length > 0 && (
        <div className="space-y-3">
          {/* Main display */}
          <div
            className="glass rounded-2xl border overflow-hidden"
            style={{ borderColor: `${genreColor}25` }}
          >
            {/* Lyrics scroll */}
            <div
              ref={lyricsScrollRef}
              className="h-64 overflow-y-auto p-5 space-y-3 relative"
              style={{ scrollbarWidth: "none" }}
            >
              {/* Gradient overlays top/bottom */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 z-10"
                style={{ background: "linear-gradient(to bottom, hsl(var(--card)), transparent)" }} />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 z-10"
                style={{ background: "linear-gradient(to top, hsl(var(--card)), transparent)" }} />

              {lines.map((line, li) => {
                const isActive = li === currentLine;
                const isPast = li < currentLine;
                return (
                  <div
                    key={li}
                    data-line={li}
                    className="transition-all duration-300"
                  >
                    <p
                      className="text-center font-oswald leading-relaxed transition-all duration-200"
                      style={{
                        fontSize: isActive ? "1.4rem" : "1rem",
                        fontWeight: isActive ? 700 : 400,
                        opacity: isPast ? 0.25 : isActive ? 1 : 0.5,
                        color: isActive ? "white" : "rgba(255,255,255,0.6)",
                        textShadow: isActive ? `0 0 20px ${genreColor}80, 0 0 40px ${genreColor}40` : "none",
                      }}
                    >
                      {isActive
                        ? line.words.map((w, wi) => (
                            <span
                              key={wi}
                              className="transition-all duration-100"
                              style={{
                                color: wi < currentWord
                                  ? genreColor
                                  : wi === currentWord
                                  ? "#ffffff"
                                  : "rgba(255,255,255,0.75)",
                                textShadow: wi === currentWord
                                  ? `0 0 12px ${genreColor}, 0 0 24px ${genreColor}60`
                                  : wi < currentWord
                                  ? `0 0 8px ${genreColor}80`
                                  : "none",
                                fontWeight: wi === currentWord ? 900 : 700,
                                display: "inline-block",
                                transform: wi === currentWord ? "scale(1.08)" : "scale(1)",
                                marginRight: "0.35em",
                              }}
                            >
                              {w.word}
                            </span>
                          ))
                        : line.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Progress */}
            <div className="px-5 pb-4 pt-2 border-t border-white/5">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlay}
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-105"
                  style={{
                    background: isPlaying ? `${genreColor}25` : `linear-gradient(135deg, ${genreColor}, #a855f7)`,
                    boxShadow: `0 0 16px ${genreColor}40`,
                  }}
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="text-white ml-0.5" />
                </button>

                <div className="flex-1">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="h-full rounded-full transition-all duration-100"
                      style={{
                        width: `${progress * 100}%`,
                        background: `linear-gradient(90deg, ${genreColor}, #a855f7)`,
                        boxShadow: `0 0 8px ${genreColor}60`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground/50 mt-1">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(1)}</span>
                  </div>
                </div>

                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-5 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-0.5 rounded-full wave-bar"
                        style={{ background: genreColor, height: "100%", animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Line progress pills */}
          <div className="flex gap-1 flex-wrap">
            {lines.map((_, li) => (
              <div
                key={li}
                className="h-1 flex-1 min-w-[8px] rounded-full transition-all duration-200"
                style={{
                  background: li < currentLine
                    ? genreColor
                    : li === currentLine
                    ? `linear-gradient(90deg, ${genreColor}, rgba(255,255,255,0.3))`
                    : "rgba(255,255,255,0.08)",
                  minWidth: "6px",
                  maxWidth: "24px",
                }}
              />
            ))}
          </div>

          {/* Edit text button */}
          <button
            onClick={() => { karaokeRef.current?.stop(); musicRef.current?.stop(); setIsPlaying(false); setMode("input"); }}
            className="flex items-center gap-2 text-sm text-muted-foreground/50 hover:text-white/60 transition-colors"
          >
            <Icon name="ArrowLeft" size={13} />
            Изменить текст
          </button>
        </div>
      )}

      {/* Empty state for player with no lines */}
      {mode === "playing" && lines.length === 0 && (
        <div className="text-center py-8 text-muted-foreground/40 text-sm">
          Сначала введи текст и нажми «Сгенерировать вокал»
        </div>
      )}
    </div>
  );
}
