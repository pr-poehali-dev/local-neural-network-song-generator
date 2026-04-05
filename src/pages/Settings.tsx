import { useState } from "react";
import Icon from "@/components/ui/icon";

export default function Settings() {
  const [model, setModel] = useState("pro");
  const [quality, setQuality] = useState("high");
  const [temperature, setTemperature] = useState(0.7);
  const [creativity, setCreativity] = useState(0.6);
  const [steps, setSteps] = useState(50);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const models = [
    { id: "lite", name: "SoundForge Lite", desc: "Быстрая генерация, базовое качество", time: "~10 сек", badge: null },
    { id: "pro", name: "SoundForge Pro", desc: "Высокое качество, детальный звук", time: "~30 сек", badge: "Рекомендуется" },
    { id: "ultra", name: "SoundForge Ultra", desc: "Студийное качество, максимум деталей", time: "~2 мин", badge: "Скоро" },
  ];

  const qualities = [
    { id: "draft", label: "Черновик", desc: "64 kbps" },
    { id: "standard", label: "Стандарт", desc: "128 kbps" },
    { id: "high", label: "Высокое", desc: "320 kbps" },
    { id: "lossless", label: "Без потерь", desc: "FLAC" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8 fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-400 rounded-full" />
          <span className="text-sm font-medium text-pink-400 tracking-widest uppercase">Параметры</span>
        </div>
        <h1 className="font-oswald text-4xl font-bold text-white mb-1">
          Настройки <span className="gradient-text">модели</span>
        </h1>
        <p className="text-muted-foreground">Тонкая настройка нейросети под ваши задачи</p>
      </div>

      <div className="space-y-6">
        {/* Model selection */}
        <div className="glass rounded-2xl p-6 border border-white/5 fade-in-up">
          <h2 className="font-oswald text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="Cpu" size={18} className="text-purple-400" />
            Модель генерации
          </h2>
          <div className="space-y-3">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => m.id !== "ultra" && setModel(m.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                  model === m.id
                    ? "bg-purple-500/10 border-purple-500/50"
                    : m.id === "ultra"
                    ? "border-white/5 opacity-50 cursor-not-allowed"
                    : "border-white/5 hover:border-white/15 hover:bg-white/3"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${model === m.id ? "border-purple-400" : "border-white/20"}`}>
                      {model === m.id && <div className="w-2 h-2 rounded-full bg-purple-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground/60">{m.time}</span>
                    {m.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        m.badge === "Рекомендуется"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-white/5 text-white/30"
                      }`}>{m.badge}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div className="glass rounded-2xl p-6 border border-white/5 fade-in-up">
          <h2 className="font-oswald text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="Disc" size={18} className="text-cyan-400" />
            Качество аудио
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {qualities.map((q) => (
              <button
                key={q.id}
                onClick={() => setQuality(q.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  quality === q.id
                    ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300"
                    : "border-white/5 text-white/50 hover:border-white/15"
                }`}
              >
                <p className="text-sm font-medium">{q.label}</p>
                <p className="text-xs mt-0.5 opacity-60">{q.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced params */}
        <div className="glass rounded-2xl p-6 border border-white/5 fade-in-up">
          <h2 className="font-oswald text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Icon name="Sliders" size={18} className="text-pink-400" />
            Продвинутые параметры
          </h2>
          <div className="space-y-6">
            {[
              { label: "Температура", value: temperature, setter: setTemperature, min: 0, max: 1, step: 0.01, color: "#a855f7", desc: "Случайность генерации" },
              { label: "Креативность", value: creativity, setter: setCreativity, min: 0, max: 1, step: 0.01, color: "#00e5ff", desc: "Нестандартность звучания" },
            ].map((param) => (
              <div key={param.label}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{param.label}</p>
                    <p className="text-xs text-muted-foreground">{param.desc}</p>
                  </div>
                  <span className="font-oswald text-lg font-bold" style={{ color: param.color }}>
                    {param.value.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value}
                  onChange={(e) => param.setter(+e.target.value)}
                />
              </div>
            ))}

            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-medium text-white">Шаги диффузии</p>
                  <p className="text-xs text-muted-foreground">Чем больше — тем детальнее</p>
                </div>
                <span className="font-oswald text-lg font-bold text-pink-400">{steps}</span>
              </div>
              <input type="range" min={10} max={100} value={steps} onChange={(e) => setSteps(+e.target.value)} />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="glass rounded-2xl p-6 border border-white/5 fade-in-up">
          <h2 className="font-oswald text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="Settings" size={18} className="text-white/50" />
            Общие настройки
          </h2>
          <div className="space-y-4">
            {[
              { label: "Уведомления о завершении", desc: "Сообщать когда трек готов", val: notifications, set: setNotifications },
              { label: "Автосохранение треков", desc: "Сохранять все треки в историю", val: autoSave, set: setAutoSave },
            ].map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{toggle.label}</p>
                  <p className="text-xs text-muted-foreground">{toggle.desc}</p>
                </div>
                <button
                  onClick={() => toggle.set(!toggle.val)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${toggle.val ? "bg-purple-500" : "bg-white/10"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${toggle.val ? "left-6" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button className="w-full py-3.5 rounded-xl generating-btn text-white font-oswald font-semibold tracking-wider transition-all hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}
