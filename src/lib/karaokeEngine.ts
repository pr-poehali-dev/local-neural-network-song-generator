// Движок Karaoke — синхронизирует строки текста с аудио-потоком
// Вокальная линия синтезируется через Web Audio API: FM-синтез имитирует голос

export interface KaraokeLine {
  text: string;
  startSec: number;   // когда начать подсвечивать
  endSec: number;     // когда закончить
  words: KaraokeWord[];
}

export interface KaraokeWord {
  word: string;
  startSec: number;
  endSec: number;
}

// Ноты гаммы для «пения» (до мажор + пентатоника)
const VOCAL_SCALE = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];
const VOCAL_SCALE_MINOR = [220.0, 246.94, 261.63, 293.66, 329.63, 349.23, 392.0, 440.0];

// Слоги в русском языке (грубая оценка)
function countSyllables(word: string): number {
  const vowels = word.match(/[аеёиоуыэюяАЕЁИОУЫЭЮЯaeiouAEIOU]/g);
  return Math.max(1, vowels ? vowels.length : 1);
}

// Разбить текст на строки и слова, назначить тайминги
export function buildKaraokeLines(
  text: string,
  tempo: number,
  genre: string
): KaraokeLine[] {
  const rawLines = text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith("[") && !l.startsWith("("));

  const secPerBeat = 60 / tempo;
  // Одна строка ≈ 2 такта (8 долей)
  const secPerLine = secPerBeat * 8;
  // Пауза между секциями
  const sectionPause = secPerBeat * 4;

  let cursor = secPerBeat * 4; // начинаем через 4 удара (вступление)
  const lines: KaraokeLine[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const lineText = rawLines[i];
    const words = lineText.split(/\s+/).filter(Boolean);

    // Считаем слоги для пропорционального распределения времени
    const syllableCounts = words.map(countSyllables);
    const totalSyllables = syllableCounts.reduce((a, b) => a + b, 0) || 1;
    const secPerSyllable = secPerLine / totalSyllables;

    const karaokeWords: KaraokeWord[] = [];
    let wordCursor = cursor;

    for (let j = 0; j < words.length; j++) {
      const dur = syllableCounts[j] * secPerSyllable;
      karaokeWords.push({
        word: words[j],
        startSec: wordCursor,
        endSec: wordCursor + dur - 0.05,
      });
      wordCursor += dur;
    }

    lines.push({
      text: lineText,
      startSec: cursor,
      endSec: cursor + secPerLine,
      words: karaokeWords,
    });

    cursor += secPerLine;

    // Пауза каждые 4 строки (между куплетом/припевом)
    if ((i + 1) % 4 === 0 && i < rawLines.length - 1) {
      cursor += sectionPause;
    }
  }

  return lines;
}

// Синтез «вокального» тембра через FM (frequency modulation)
function playVocalNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume: number = 0.25,
  minor: boolean = false
) {
  // Carrier
  const carrier = ctx.createOscillator();
  carrier.type = "sine";
  carrier.frequency.value = freq;

  // Modulator (FM)
  const modulator = ctx.createOscillator();
  modulator.type = "sine";
  modulator.frequency.value = freq * 2.01; // небольшой детюн для тепла

  const modGain = ctx.createGain();
  modGain.gain.setValueAtTime(freq * 0.3, startTime);
  modGain.gain.linearRampToValueAtTime(freq * 0.15, startTime + duration * 0.5);

  // Vibrato
  const vibrato = ctx.createOscillator();
  vibrato.type = "sine";
  vibrato.frequency.value = 5.5;
  const vibratoGain = ctx.createGain();
  vibratoGain.gain.value = freq * 0.015;
  vibrato.connect(vibratoGain);
  vibratoGain.connect(carrier.frequency);

  modulator.connect(modGain);
  modGain.connect(carrier.frequency);

  // Envelope
  const envGain = ctx.createGain();
  const attack = Math.min(0.12, duration * 0.2);
  const release = Math.min(0.18, duration * 0.25);
  envGain.gain.setValueAtTime(0, startTime);
  envGain.gain.linearRampToValueAtTime(volume, startTime + attack);
  envGain.gain.setValueAtTime(volume * 0.85, startTime + duration - release);
  envGain.gain.linearRampToValueAtTime(0, startTime + duration);

  // Формантный фильтр (имитирует резонанс голосового тракта)
  const formant1 = ctx.createBiquadFilter();
  formant1.type = "bandpass";
  formant1.frequency.value = minor ? 700 : 800;
  formant1.Q.value = 3;

  const formant2 = ctx.createBiquadFilter();
  formant2.type = "bandpass";
  formant2.frequency.value = minor ? 1200 : 1400;
  formant2.Q.value = 4;

  const merger = ctx.createGain();
  merger.gain.value = 0.6;

  carrier.connect(formant1);
  carrier.connect(formant2);
  formant1.connect(merger);
  formant2.connect(merger);
  merger.connect(envGain);
  envGain.connect(ctx.destination);

  carrier.start(startTime);
  modulator.start(startTime);
  vibrato.start(startTime);
  carrier.stop(startTime + duration + 0.05);
  modulator.stop(startTime + duration + 0.05);
  vibrato.stop(startTime + duration + 0.05);
}

// Назначить ноты словам на основе мелодического контура
function assignNotes(words: KaraokeWord[], genre: string, lineIndex: number): number[] {
  const scale = ["jazz", "blues", "ambient"].includes(genre) ? VOCAL_SCALE_MINOR : VOCAL_SCALE;
  const baseIndex = lineIndex % 3 === 0 ? 0 : lineIndex % 3 === 1 ? 4 : 2;

  return words.map((_, wi) => {
    // Создаём мелодическую дугу: нарастание в начале, спад в конце
    const pos = wi / Math.max(1, words.length - 1);
    const arcOffset = Math.round(Math.sin(pos * Math.PI) * 3);
    const idx = Math.max(0, Math.min(scale.length - 1, baseIndex + arcOffset + (wi % 2)));
    return scale[idx];
  });
}

// Основной класс воспроизведения Karaoke
export class KaraokeEngine {
  private ctx: AudioContext | null = null;
  private lines: KaraokeLine[] = [];
  private genre: string = "pop";
  private tempo: number = 120;
  public isPlaying = false;
  public currentTime = 0;
  public totalDuration = 0;

  private startedAt = 0;
  private rafId: number | null = null;

  public onLineChange: ((lineIndex: number) => void) | null = null;
  public onWordChange: ((lineIndex: number, wordIndex: number) => void) | null = null;
  public onProgress: ((progress: number) => void) | null = null;
  public onStop: (() => void) | null = null;

  setup(lines: KaraokeLine[], genre: string, tempo: number) {
    this.lines = lines;
    this.genre = genre;
    this.tempo = tempo;
    this.totalDuration = lines.length > 0
      ? lines[lines.length - 1].endSec + 60 / tempo * 4
      : 60;
  }

  play() {
    if (this.isPlaying) this.stop();

    this.ctx = new AudioContext();
    this.isPlaying = true;
    this.startedAt = this.ctx.currentTime;

    // Планируем все вокальные ноты
    this.lines.forEach((line, li) => {
      const minor = ["jazz", "ambient", "metal", "hiphop"].includes(this.genre);
      const notes = assignNotes(line.words, this.genre, li);
      line.words.forEach((word, wi) => {
        const dur = word.endSec - word.startSec;
        if (dur > 0.05 && this.ctx) {
          playVocalNote(
            this.ctx,
            notes[wi],
            this.startedAt + word.startSec,
            dur * 0.9,
            0.22,
            minor
          );
        }
      });
    });

    // RAF loop для обновления UI
    let lastLine = -1;
    let lastWord = -1;

    const tick = () => {
      if (!this.ctx || !this.isPlaying) return;
      const elapsed = this.ctx.currentTime - this.startedAt;
      this.currentTime = elapsed;

      if (this.onProgress) {
        this.onProgress(Math.min(1, elapsed / this.totalDuration));
      }

      // Найти текущую строку и слово
      for (let li = 0; li < this.lines.length; li++) {
        const line = this.lines[li];
        if (elapsed >= line.startSec && elapsed < line.endSec) {
          if (li !== lastLine) {
            lastLine = li;
            if (this.onLineChange) this.onLineChange(li);
          }
          for (let wi = 0; wi < line.words.length; wi++) {
            const w = line.words[wi];
            if (elapsed >= w.startSec && elapsed < w.endSec) {
              if (wi !== lastWord) {
                lastWord = wi;
                if (this.onWordChange) this.onWordChange(li, wi);
              }
              break;
            }
          }
          break;
        }
      }

      if (elapsed >= this.totalDuration) {
        this.stop();
        if (this.onStop) this.onStop();
        return;
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  stop() {
    this.isPlaying = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.currentTime = 0;
  }
}
