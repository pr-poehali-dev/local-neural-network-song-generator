// Движок генерации текстов песен

type Genre = "electronic" | "pop" | "rock" | "jazz" | "classical" | "hiphop" | "ambient" | "metal";
type Mood = string;

const rhymeGroups: Record<string, string[]> = {
  night: ["night", "light", "bright", "fight", "right", "sight", "might", "flight"],
  love: ["love", "above", "dove", "dream", "gleam", "stream", "beam", "seam"],
  fire: ["fire", "desire", "higher", "wire", "inspire", "empire", "entire"],
  soul: ["soul", "whole", "roll", "goal", "control", "role", "hole", "toll"],
  time: ["time", "rhyme", "climb", "prime", "sublime", "paradigm", "crime"],
  heart: ["heart", "start", "apart", "art", "chart", "smart", "part"],
  way: ["way", "day", "say", "stay", "play", "ray", "gray", "sway", "away"],
  mind: ["mind", "find", "behind", "kind", "blind", "wind", "remind"],
};

const wordPools: Record<Genre, Record<string, string[]>> = {
  electronic: {
    nouns: ["синтезатор", "нейросеть", "алгоритм", "сигнал", "частота", "импульс", "код", "матрица", "система", "протокол"],
    verbs: ["пульсирует", "вибрирует", "резонирует", "обрабатывает", "генерирует", "синхронизирует", "кодирует", "передаёт"],
    adjectives: ["цифровой", "электронный", "виртуальный", "нейронный", "бесконечный", "квантовый", "бинарный"],
    places: ["в сети", "в эфире", "в коде", "в системе", "в пустоте", "в матрице"],
  },
  pop: {
    nouns: ["сердце", "мечта", "звезда", "момент", "вечер", "улыбка", "взгляд", "голос", "танец", "свет"],
    verbs: ["сияет", "летит", "танцует", "горит", "поёт", "мечтает", "живёт", "любит", "ищет"],
    adjectives: ["яркий", "нежный", "сладкий", "золотой", "бесконечный", "волшебный", "особенный"],
    places: ["под звёздами", "на краю", "в мечтах", "в ночи", "на вершине", "в сердце"],
  },
  rock: {
    nouns: ["гром", "буря", "огонь", "сила", "свобода", "дорога", "кровь", "воля", "крик", "стена"],
    verbs: ["рвётся", "горит", "ломает", "кричит", "падает", "встаёт", "бьётся", "несётся"],
    adjectives: ["яростный", "дикий", "свободный", "сломанный", "живой", "настоящий", "острый"],
    places: ["на сцене", "в огне", "под небом", "на краю пропасти", "в темноте"],
  },
  jazz: {
    nouns: ["саксофон", "полночь", "джаз", "клуб", "дым", "виски", "мелодия", "ритм", "блюз", "пианино"],
    verbs: ["звучит", "льётся", "импровизирует", "качается", "плывёт", "шепчет", "вздыхает"],
    adjectives: ["бархатный", "медовый", "ленивый", "глубокий", "тёплый", "дымчатый", "старый"],
    places: ["в клубе", "за стойкой", "в полутьме", "в тёплом свете", "поздней ночью"],
  },
  classical: {
    nouns: ["вечность", "симфония", "судьба", "душа", "время", "пространство", "гармония", "красота", "тишина"],
    verbs: ["звучит", "течёт", "возносится", "растворяется", "парит", "замирает", "рождается"],
    adjectives: ["величественный", "торжественный", "хрупкий", "вечный", "прекрасный", "бесконечный"],
    places: ["в тишине", "в вечности", "над миром", "в глубине", "за горизонтом"],
  },
  hiphop: {
    nouns: ["улица", "ритм", "микрофон", "слово", "история", "путь", "цель", "власть", "движение", "блок"],
    verbs: ["читает", "строит", "движется", "ломает", "создаёт", "говорит", "показывает", "ведёт"],
    adjectives: ["настоящий", "твёрдый", "живой", "острый", "реальный", "честный", "прямой"],
    places: ["на улице", "в студии", "в районе", "на вершине", "в игре"],
  },
  ambient: {
    nouns: ["туман", "рассвет", "горизонт", "тишина", "волна", "ветер", "облако", "свет", "пространство"],
    verbs: ["дышит", "плывёт", "растворяется", "течёт", "возникает", "исчезает", "мерцает"],
    adjectives: ["бесконечный", "спокойный", "глубокий", "мягкий", "далёкий", "прозрачный"],
    places: ["в бесконечности", "за горизонтом", "в облаках", "на рассвете", "в тишине"],
  },
  metal: {
    nouns: ["тьма", "сталь", "хаос", "буря", "зверь", "война", "гнев", "разрушение", "мощь", "боль"],
    verbs: ["рвёт", "сокрушает", "горит", "уничтожает", "восстаёт", "атакует", "захватывает"],
    adjectives: ["тёмный", "безжалостный", "мощный", "разрушительный", "первобытный", "яростный"],
    places: ["в аду", "в хаосе", "в тьме", "на поле битвы", "в огне"],
  },
};

const moodModifiers: Record<string, { adj: string[]; verbs: string[] }> = {
  "Энергичное": { adj: ["мощный", "быстрый", "яркий", "взрывной"], verbs: ["мчится", "взрывается", "горит", "летит"] },
  "Расслабленное": { adj: ["мягкий", "тихий", "спокойный", "плавный"], verbs: ["дрейфует", "дышит", "покоится", "течёт"] },
  "Меланхоличное": { adj: ["грустный", "туманный", "тихий", "далёкий"], verbs: ["угасает", "тоскует", "молчит", "уходит"] },
  "Романтичное": { adj: ["нежный", "сладкий", "тёплый", "волшебный"], verbs: ["любит", "мечтает", "шепчет", "обнимает"] },
  "Эпическое": { adj: ["великий", "могучий", "бесконечный", "легендарный"], verbs: ["возносится", "завоёвывает", "ведёт", "побеждает"] },
  "Мистическое": { adj: ["тайный", "загадочный", "потусторонний", "древний"], verbs: ["скрывается", "призывает", "манит", "исчезает"] },
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLine(genre: Genre, mood: Mood, type: "verse" | "chorus" | "bridge"): string {
  const pool = wordPools[genre] || wordPools.pop;
  const moodMod = moodModifiers[mood] || moodModifiers["Энергичное"];

  const noun = pick(pool.nouns);
  const verb = type === "chorus" ? pick(moodMod.verbs) : pick(pool.verbs);
  const adj = Math.random() > 0.5 ? pick([...pool.adjectives, ...moodMod.adj]) : "";
  const place = Math.random() > 0.6 ? pick(pool.places) : "";

  const patterns = [
    `${adj ? adj + " " : ""}${noun} ${verb}${place ? " " + place : ""}`,
    `${verb} ${adj ? adj + " " : ""}${noun}`,
    `${noun} ${verb}, ${noun} ${pick(pool.verbs)}`,
    `${adj ? adj + " " : ""}${noun}${place ? " " + place : ""} — ${verb}`,
    `${verb} как ${adj ? adj + " " : ""}${noun}`,
  ];

  const line = pick(patterns);
  return line.charAt(0).toUpperCase() + line.slice(1);
}

function generateSection(
  genre: Genre,
  mood: Mood,
  type: "verse" | "chorus" | "bridge",
  lines: number
): string[] {
  return Array.from({ length: lines }, () => generateLine(genre, mood, type));
}

const sectionTitles: Record<string, string> = {
  verse: "Куплет",
  chorus: "Припев",
  bridge: "Бридж",
  outro: "Аутро",
};

export interface SongLyrics {
  title: string;
  sections: { type: string; label: string; lines: string[] }[];
  genre: Genre;
  mood: Mood;
  tempo: number;
}

const genreTitles: Record<Genre, string[]> = {
  electronic: ["Digital Signal", "Neon Protocol", "System Override", "Cyber Drift", "Neural Wave", "Binary Soul"],
  pop: ["Звёздный миг", "Навсегда", "Только ты", "Светлый путь", "Мечта живёт", "Сердце поёт"],
  rock: ["Гром и пепел", "Живой огонь", "Без цепей", "Последний крик", "Дикая воля", "Сквозь бурю"],
  jazz: ["Late Night Blues", "Midnight Sax", "Smoky Room", "Sweet Tempo", "Blue Note", "Velvet Hours"],
  classical: ["Соната памяти", "Вечная тема", "Adagio", "Тихая гармония", "Элегия", "Opus Infinitum"],
  hiphop: ["Реальный путь", "С нуля", "Свой район", "Без фильтров", "Движение вверх", "Настоящий"],
  ambient: ["Горизонт", "Бесконечность", "Туманный рассвет", "Пространство", "Тихая волна", "Дыхание"],
  metal: ["Iron Chaos", "Wrath Eternal", "Dark Storm", "Steel Fury", "Void Crusher", "Burning Throne"],
};

export function generateSong(
  genre: Genre,
  mood: Mood,
  tempo: number,
  userPrompt?: string
): SongLyrics {
  const titles = genreTitles[genre] || genreTitles.pop;
  const title = pick(titles);

  const sections: SongLyrics["sections"] = [];

  // Structure: Verse 1 → Chorus → Verse 2 → Chorus → Bridge → Chorus
  sections.push({
    type: "verse",
    label: `${sectionTitles.verse} 1`,
    lines: generateSection(genre, mood, "verse", 4),
  });

  sections.push({
    type: "chorus",
    label: sectionTitles.chorus,
    lines: generateSection(genre, mood, "chorus", 4),
  });

  sections.push({
    type: "verse",
    label: `${sectionTitles.verse} 2`,
    lines: generateSection(genre, mood, "verse", 4),
  });

  sections.push({
    type: "chorus",
    label: sectionTitles.chorus,
    lines: generateSection(genre, mood, "chorus", 4),
  });

  if (Math.random() > 0.3) {
    sections.push({
      type: "bridge",
      label: sectionTitles.bridge,
      lines: generateSection(genre, mood, "bridge", 2),
    });

    sections.push({
      type: "chorus",
      label: `${sectionTitles.chorus} (финал)`,
      lines: generateSection(genre, mood, "chorus", 4),
    });
  }

  return { title, sections, genre, mood, tempo };
}
