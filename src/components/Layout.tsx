import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "generator" | "history" | "settings" | "gallery" | "help" | "about";

const navItems: { id: Page; label: string; icon: string; color: string }[] = [
  { id: "generator", label: "Генератор", icon: "Sparkles", color: "#a855f7" },
  { id: "history", label: "История", icon: "Clock", color: "#00e5ff" },
  { id: "settings", label: "Настройки", icon: "Sliders", color: "#f472b6" },
  { id: "gallery", label: "Галерея", icon: "LayoutGrid", color: "#fbbf24" },
  { id: "help", label: "Справка", icon: "HelpCircle", color: "#39ff14" },
  { id: "about", label: "О проекте", icon: "Info", color: "#818cf8" },
];

interface LayoutProps {
  children: React.ReactNode;
  page: Page;
  onNav: (page: Page) => void;
}

export default function Layout({ children, page, onNav }: LayoutProps) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full float-slow pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full float-medium pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)' }} />
      <div className="fixed top-[40%] right-[20%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%)', animation: 'float-slow 15s ease-in-out infinite reverse' }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg generating-btn flex items-center justify-center">
              <Icon name="Music2" size={16} className="text-white" />
            </div>
            <span className="font-oswald font-semibold text-lg text-white tracking-wide">
              Sound<span className="gradient-text">Forge</span>
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">AI</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                className={`nav-item px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  page === item.id
                    ? "text-white bg-white/5"
                    : "text-white/50 hover:text-white/80 hover:bg-white/3"
                }`}
              >
                <Icon
                  name={item.icon}
                  fallback="Circle"
                  size={14}
                  style={{ color: page === item.id ? item.color : undefined }}
                />
                <span className={page === item.id ? "active" : ""}>{item.label}</span>
                {page === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }} />
                )}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">Онлайн</span>
            </div>

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 rounded-lg glass border border-white/5"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <Icon name={mobileMenu ? "X" : "Menu"} size={18} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenu && (
          <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNav(item.id); setMobileMenu(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  page === item.id ? "text-white bg-white/5" : "text-white/50"
                }`}
              >
                <Icon name={item.icon} fallback="Circle" size={16} style={{ color: page === item.id ? item.color : undefined }} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="pt-14 min-h-screen">
        {children}
      </main>

      {/* Bottom bar mobile */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden glass border-t border-white/5 z-50">
        <div className="grid grid-cols-6 h-14">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                page === item.id ? "text-white" : "text-white/30"
              }`}
            >
              <Icon
                name={item.icon}
                fallback="Circle"
                size={18}
                style={{ color: page === item.id ? item.color : undefined }}
              />
              <span className="text-[9px]">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
