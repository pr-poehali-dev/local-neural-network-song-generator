import Icon from "@/components/ui/icon";

const team = [
  { name: "Алекс Морозов", role: "Основатель & CEO", avatar: "🧑‍🚀", desc: "10 лет в ML, бывший Яндекс" },
  { name: "Ника Власова", role: "Lead AI Engineer", avatar: "👩‍💻", desc: "PhD по акустике, MIT" },
  { name: "Дима Кузнецов", role: "Product Designer", avatar: "🎨", desc: "ex-Figma, ex-Notion" },
  { name: "Полина Орлова", role: "Sound Engineer", avatar: "🎧", desc: "15 лет в студийной записи" },
];

const stats = [
  { value: "2.4M+", label: "Треков создано", icon: "Music" },
  { value: "180K", label: "Пользователей", icon: "Users" },
  { value: "98%", label: "Довольных клиентов", icon: "Star" },
  { value: "12", label: "Жанров поддержано", icon: "Disc" },
];

const milestones = [
  { year: "2023", title: "Основание", desc: "Первый прототип генератора за 48 часов хакатона" },
  { year: "2024 Q1", title: "Запуск бета", desc: "1000 первых пользователей за неделю" },
  { year: "2024 Q3", title: "SoundForge Pro", desc: "Студийное качество и API для разработчиков" },
  { year: "2025", title: "SoundForge Ultra", desc: "Генерация в реальном времени (скоро)" },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-12 text-center fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/20 text-purple-300 text-sm mb-6">
          <Icon name="Sparkles" size={14} />
          Создаём музыку будущего
        </div>
        <h1 className="font-oswald text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
          <span className="gradient-text">SoundForge AI</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Мы верим, что каждый человек заслуживает собственного саундтрека — без студии, без музыкального образования.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 fade-in-up">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="glass rounded-2xl p-5 border border-white/5 text-center"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <Icon name={s.icon} fallback="Star" size={20} className="mx-auto mb-2 text-purple-400" />
            <p className="font-oswald text-2xl font-bold gradient-text">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="glass rounded-2xl p-8 border border-purple-500/20 mb-10 fade-in-up" style={{ background: 'rgba(168, 85, 247, 0.04)' }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0 mt-1">
            <Icon name="Target" size={18} className="text-purple-400" />
          </div>
          <div>
            <h2 className="font-oswald text-2xl font-bold text-white mb-3">Наша миссия</h2>
            <p className="text-muted-foreground leading-relaxed">
              Демократизировать музыкальное творчество. Мы создаём инструменты, которые превращают идею в звук за секунды — 
              независимо от вашего опыта. Профессионал или новичок — SoundForge даёт вам силу создавать.
            </p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mb-10 fade-in-up">
        <h2 className="font-oswald text-2xl font-bold text-white mb-6 text-center">Команда</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {team.map((member, i) => (
            <div
              key={member.name}
              className="glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all flex items-center gap-4"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="text-4xl w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                {member.avatar}
              </div>
              <div>
                <p className="font-semibold text-white">{member.name}</p>
                <p className="text-sm text-purple-400">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="fade-in-up">
        <h2 className="font-oswald text-2xl font-bold text-white mb-6 text-center">История проекта</h2>
        <div className="relative">
          <div className="absolute left-[80px] top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-cyan-500/30 to-transparent" />
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-20 text-right flex-shrink-0">
                  <span className="text-xs font-medium text-purple-400">{m.year}</span>
                </div>
                <div className="relative mt-0.5">
                  <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-background relative z-10" />
                </div>
                <div className="glass rounded-xl p-4 border border-white/5 flex-1 -mt-1.5">
                  <p className="font-semibold text-white text-sm">{m.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 text-center glass rounded-2xl p-8 border border-white/5 fade-in-up">
        <p className="font-oswald text-2xl font-bold text-white mb-2">Готов создать свой трек?</p>
        <p className="text-muted-foreground mb-6 text-sm">Бесплатно. Без музыкального образования. Прямо сейчас.</p>
        <button className="generating-btn px-8 py-3 rounded-xl text-white font-oswald font-semibold tracking-wider text-sm hover:scale-105 transition-transform inline-flex items-center gap-2">
          <Icon name="Sparkles" size={16} />
          Начать генерацию
        </button>
      </div>
    </div>
  );
}
