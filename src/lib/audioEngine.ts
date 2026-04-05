// Аудио-движок на Web Audio API — синтез музыки прямо в браузере

export type Genre = "electronic" | "pop" | "rock" | "jazz" | "classical" | "hiphop" | "ambient" | "metal";

// Частоты нот (октава 4)
const NOTE_FREQ: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0,
  A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  "C#4": 277.18, "D#4": 311.13, "F#4": 369.99, "G#4": 415.3, "A#4": 466.16,
  "C#5": 554.37, "D#5": 622.25, "F#5": 739.99, "G#5": 830.61,
  "A#3": 233.08, "G#3": 207.65,
};

// Аккордовые прогрессии по жанрам (ступени: ноты + октава)
const CHORD_PROGRESSIONS: Record<Genre, string[][]> = {
  electronic: [["A3","C4","E4"], ["F3","A3","C4"], ["G3","B3","D4"], ["E3","G3","B3"]],
  pop:        [["C4","E4","G4"], ["A3","C4","E4"], ["F3","A3","C4"], ["G3","B3","D4"]],
  rock:       [["A3","E4","A4"], ["D3","A3","D4"], ["E3","B3","E4"], ["G3","D4","G4"]],
  jazz:       [["D4","F4","A4","C5"], ["G3","B3","D4","F4"], ["C4","E4","G4","B4"], ["A3","C4","E4","G4"]],
  classical:  [["C4","E4","G4"], ["G3","B3","D4"], ["A3","C4","E4"], ["F3","A3","C4"]],
  hiphop:     [["A3","C4","E4"], ["G3","A#3","D4"], ["F3","A3","C4"], ["E3","G3","B3"]],
  ambient:    [["D4","A4","D5"], ["A3","E4","A4"], ["G3","D4","G4"], ["C4","G4","C5"]],
  metal:      [["E3","B3","E4"], ["D3","A3","D4"], ["C3","G3","C4"], ["A2","E3","A3"]] as never,
};

// Мелодические паттерны (интервалы от тоники)
const MELODY_PATTERNS: Record<Genre, number[][]> = {
  electronic: [[0,4,7,12,7,4,0,4], [0,3,7,10,7,3,0,3]],
  pop:        [[0,2,4,7,4,2,0,2], [0,4,5,7,5,4,2,0]],
  rock:       [[0,0,7,7,5,5,3,0], [0,3,5,7,8,7,5,3]],
  jazz:       [[0,2,4,7,9,7,4,2], [0,3,5,7,10,9,7,5]],
  classical:  [[0,2,4,5,7,5,4,2], [0,4,7,12,11,9,7,4]],
  hiphop:     [[0,0,3,3,7,7,5,5], [0,3,5,3,0,3,5,7]],
  ambient:    [[0,7,12,7,4,7,12,7], [0,5,9,12,9,5,2,0]],
  metal:      [[0,0,0,7,6,5,3,0], [0,3,0,5,0,7,6,5]],
};

// Ритмические паттерны (kick, snare, hihat) — 16 шагов
const DRUM_PATTERNS: Record<Genre, { kick: boolean[]; snare: boolean[]; hihat: boolean[] }> = {
  electronic: {
    kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0].map(Boolean),
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0].map(Boolean),
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0].map(Boolean),
  },
  pop: {
    kick:  [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0].map(Boolean),
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0].map(Boolean),
    hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1].map(Boolean),
  },
  rock: {
    kick:  [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,0,0].map(Boolean),
    snare: [0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0].map(Boolean),
    hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,1].map(Boolean),
  },
  jazz: {
    kick:  [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,0].map(Boolean),
    snare: [0,0,1,0, 0,1,0,0, 1,0,0,1, 0,0,1,0].map(Boolean),
    hihat: [1,1,0,1, 1,0,1,1, 0,1,1,0, 1,1,0,1].map(Boolean),
  },
  classical: {
    kick:  [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0].map(Boolean),
    snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0].map(Boolean),
    hihat: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0].map(Boolean),
  },
  hiphop: {
    kick:  [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,0,0].map(Boolean),
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0].map(Boolean),
    hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,0,1].map(Boolean),
  },
  ambient: {
    kick:  [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0].map(Boolean),
    snare: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0].map(Boolean),
    hihat: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0].map(Boolean),
  },
  metal: {
    kick:  [1,0,1,0, 1,0,1,0, 1,1,1,0, 1,0,1,0].map(Boolean),
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1].map(Boolean),
    hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1].map(Boolean),
  },
};

// Тембры синтезатора по жанрам
type OscType = OscillatorType;
const SYNTH_SETTINGS: Record<Genre, { osc: OscType; attack: number; decay: number; sustain: number; release: number; detune: number }> = {
  electronic: { osc: "sawtooth", attack: 0.01, decay: 0.1, sustain: 0.6, release: 0.3, detune: 5 },
  pop:        { osc: "sine",     attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.4, detune: 0 },
  rock:       { osc: "sawtooth", attack: 0.01, decay: 0.05, sustain: 0.8, release: 0.2, detune: 10 },
  jazz:       { osc: "sine",     attack: 0.08, decay: 0.2, sustain: 0.5, release: 0.6, detune: 0 },
  classical:  { osc: "sine",     attack: 0.1, decay: 0.3, sustain: 0.6, release: 0.8, detune: 0 },
  hiphop:     { osc: "square",   attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.2, detune: 0 },
  ambient:    { osc: "sine",     attack: 0.5, decay: 0.5, sustain: 0.8, release: 1.5, detune: 2 },
  metal:      { osc: "sawtooth", attack: 0.005, decay: 0.05, sustain: 0.9, release: 0.1, detune: 15 },
};

function noteToFreq(note: string): number {
  return NOTE_FREQ[note] || 440;
}

function playKick(ctx: AudioContext, time: number, volume: number = 0.8) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.3);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
  osc.start(time);
  osc.stop(time + 0.35);
}

function playSnare(ctx: AudioContext, time: number, volume: number = 0.5) {
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1000;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  source.start(time);
}

function playHihat(ctx: AudioContext, time: number, volume: number = 0.2) {
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 7000;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  source.start(time);
}

function playNote(
  ctx: AudioContext,
  freq: number,
  time: number,
  duration: number,
  settings: typeof SYNTH_SETTINGS[Genre],
  volume: number = 0.3,
  detune: number = 0
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = settings.osc;
  osc.frequency.value = freq;
  osc.detune.value = detune;

  filter.type = "lowpass";
  filter.frequency.value = 3000;
  filter.Q.value = 1;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const { attack, decay, sustain, release } = settings;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(volume, time + attack);
  gain.gain.linearRampToValueAtTime(volume * sustain, time + attack + decay);
  gain.gain.setValueAtTime(volume * sustain, time + duration - release);
  gain.gain.linearRampToValueAtTime(0, time + duration);

  osc.start(time);
  osc.stop(time + duration + 0.1);
}

function playChord(ctx: AudioContext, notes: string[], time: number, duration: number, settings: typeof SYNTH_SETTINGS[Genre]) {
  notes.forEach((note, i) => {
    const freq = noteToFreq(note);
    const detune = (Math.random() - 0.5) * settings.detune;
    playNote(ctx, freq, time + i * 0.01, duration, settings, 0.18, detune);
  });
}

export interface AudioEngine {
  play: () => void;
  stop: () => void;
  isPlaying: boolean;
  currentBeat: number;
}

export class MusicEngine {
  private ctx: AudioContext | null = null;
  private scheduleInterval: ReturnType<typeof setInterval> | null = null;
  private currentBeat = 0;
  private totalBeats = 0;
  private genre: Genre;
  private tempo: number;
  public isPlaying = false;
  public onBeat: ((beat: number, total: number) => void) | null = null;
  public onStop: (() => void) | null = null;

  private scheduledUntil = 0;
  private startTime = 0;

  constructor(genre: Genre, tempo: number) {
    this.genre = genre;
    this.tempo = tempo;
  }

  play(durationMinutes: number = 1) {
    if (this.isPlaying) this.stop();

    this.ctx = new AudioContext();
    this.isPlaying = true;
    this.currentBeat = 0;

    const secondsPerBeat = 60 / this.tempo;
    const stepDuration = secondsPerBeat / 4; // 16th note
    this.totalBeats = Math.floor((durationMinutes * 60) / stepDuration);

    const chords = CHORD_PROGRESSIONS[this.genre];
    const melodyPattern = MELODY_PATTERNS[this.genre][0];
    const drumPattern = DRUM_PATTERNS[this.genre];
    const synthSettings = SYNTH_SETTINGS[this.genre];

    // Base notes for melody from first chord
    const baseFreqs = chords[0].map(noteToFreq);
    const tonicFreq = baseFreqs[0];

    // Semitone intervals to frequencies
    const semitoneRatios = melodyPattern.map(s => tonicFreq * Math.pow(2, s / 12));

    this.startTime = this.ctx.currentTime + 0.1;
    this.scheduledUntil = this.startTime;

    const LOOKAHEAD = 0.2; // seconds to schedule ahead
    const chordDuration = stepDuration * 16; // one chord per bar

    const schedule = () => {
      if (!this.ctx || !this.isPlaying) return;

      const now = this.ctx.currentTime;

      while (this.scheduledUntil < now + LOOKAHEAD && this.currentBeat < this.totalBeats) {
        const beat = this.currentBeat;
        const time = this.startTime + beat * stepDuration;
        const stepInBar = beat % 16;
        const chordIndex = Math.floor(beat / 16) % chords.length;
        const chord = chords[chordIndex];

        // Drums
        if (drumPattern.kick[stepInBar]) playKick(this.ctx, time, this.genre === "metal" ? 1.0 : 0.7);
        if (drumPattern.snare[stepInBar]) playSnare(this.ctx, time, 0.5);
        if (drumPattern.hihat[stepInBar]) playHihat(this.ctx, time, this.genre === "metal" ? 0.3 : 0.15);

        // Chord (every bar start)
        if (stepInBar === 0) {
          playChord(this.ctx, chord, time, chordDuration * 0.9, synthSettings);
        }

        // Melody
        const melodyStep = beat % melodyPattern.length;
        const melodyFreq = semitoneRatios[melodyStep];
        if (melodyFreq > 0 && beat % 2 === 0) {
          playNote(this.ctx, melodyFreq * 2, time, stepDuration * 1.8, synthSettings, 0.2);
        }

        // Bass (every 4 steps)
        if (stepInBar % 4 === 0) {
          const bassFreq = noteToFreq(chord[0]) / 2;
          playNote(this.ctx, bassFreq, time, stepDuration * 3.8, { ...synthSettings, osc: "sawtooth", attack: 0.02, release: 0.1 }, 0.35);
        }

        this.scheduledUntil = time + stepDuration;
        this.currentBeat++;

        if (this.onBeat) {
          setTimeout(() => {
            if (this.onBeat) this.onBeat(beat, this.totalBeats);
          }, Math.max(0, (time - now) * 1000));
        }

        if (this.currentBeat >= this.totalBeats) {
          setTimeout(() => {
            this.stop();
            if (this.onStop) this.onStop();
          }, (time - now + stepDuration) * 1000);
          break;
        }
      }
    };

    schedule();
    this.scheduleInterval = setInterval(schedule, 50);
  }

  stop() {
    this.isPlaying = false;
    if (this.scheduleInterval) {
      clearInterval(this.scheduleInterval);
      this.scheduleInterval = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.currentBeat = 0;
    this.scheduledUntil = 0;
  }

  getProgress(): number {
    if (this.totalBeats === 0) return 0;
    return Math.min(1, this.currentBeat / this.totalBeats);
  }
}
