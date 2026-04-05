import { useState } from "react";
import Icon from "@/components/ui/icon";

const faqs = [
  { q: "Как работает генератор музыки?", a: "Нейросеть анализирует ваше описание, выбранный жанр и параметры, затем создаёт уникальный трек с нуля. Каждая генерация уникальна — два одинаковых запроса дадут разный результат." },
  { q: "Сколько треков можно создать?", a: "В бесплатном тарифе доступно 10 треков в день. В Pro-тарифе генерации неограничены с приоритетной очередью." },
  { q: "Можно ли использовать треки коммерчески?", a: "Да! Все треки, созданные на платформе, принадлежат вам. Вы можете использовать их в проектах, YouTube, рекламе и продавать." },
  { q: "Какие форматы экспорта доступны?", a: "MP3 (320 kbps), WAV, FLAC — в зависимости от выбранного качества. Лосслесс форматы доступны на тарифе Pro." },
  { q: "Почему трек звучит не так, как я ожидал?", a: "Попробуйте добавить больше деталей в описание: инструменты, темп, ощущение, референсы. Также попробуйте увеличить параметр 'Шаги диффузии' в настройках." },
  { q: "Как удалить трек из истории?", a: "Перейдите в раздел 'История', наведите на трек и нажмите иконку корзины справа." },
];

const guides = [
  { icon: "BookOpen", title: "Быстрый старт", desc: "Создай первый трек за 2 минуты", color: "#a855f7", steps: 3 },
  { icon: "Sparkles", title: "Промпты для генерации", desc: "Как описывать музыку правильно", color: "#00e5ff", steps: 5 },
  { icon: "Sliders", title: "Продвинутые параметры", desc: "Детальная настройка модели", color: "#f472b6", steps: 7 },
  { icon: "Download", title: "Экспорт и публикация", desc: "Форматы, лицензии, платформы", color: "#fbbf24", steps: 4 },
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-green-400 rounded-full" />
          <span className="text-sm font-medium text-cyan-400 tracking-widest uppercase">Помощь</span>
        </div>
        <h1 className="font-oswald text-4xl font-bold text-white mb-1">
          Справка и <span className="gradient-text">документация</span>
        </h1>
        <p className="text-muted-foreground">Всё что нужно знать о генераторе</p>
      </div>

      {/* Search */}
      <div className="glass rounded-xl p-4 border border-white/5 mb-8 flex items-center gap-3 fade-in-up">
        <Icon name="Search" size={18} className="text-muted-foreground flex-shrink-0" />
        <input
          placeholder="Поиск по документации..."
          className="bg-transparent flex-1 text-white outline-none placeholder-muted-foreground/40"
        />
        <kbd className="text-xs px-2 py-1 rounded bg-white/5 text-white/30">⌘K</kbd>
      </div>

      {/* Guides */}
      <div className="mb-8 fade-in-up">
        <h2 className="font-oswald text-xl font-semibold text-white mb-4">Руководства</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {guides.map((g, i) => (
            <button
              key={g.title}
              className="glass rounded-xl p-4 border border-white/5 hover:border-white/15 transition-all text-left group"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${g.color}20` }}>
                  <Icon name={g.icon} fallback="BookOpen" size={18} style={{ color: g.color }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white text-sm group-hover:text-white">{g.title}</p>
                  <p className="text-xs text-muted-foreground">{g.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/50">{g.steps} шагов</span>
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground/40 group-hover:text-white/40 transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="fade-in-up">
        <h2 className="font-oswald text-xl font-semibold text-white mb-4">Частые вопросы</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-xl border border-white/5 overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/2 transition-colors"
              >
                <span className="font-medium text-white/90 text-sm pr-4">{faq.q}</span>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-8 glass rounded-2xl p-6 border border-cyan-500/20 fade-in-up" style={{ background: 'rgba(0, 229, 255, 0.03)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
            <Icon name="MessageCircle" size={22} className="text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white">Не нашли ответ?</p>
            <p className="text-sm text-muted-foreground">Напишите в поддержку — ответим в течение часа</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-sm font-medium hover:bg-cyan-500/25 transition-colors">
            Написать
          </button>
        </div>
      </div>
    </div>
  );
}
