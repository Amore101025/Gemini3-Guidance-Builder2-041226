import React from 'react';
import { painterStyles } from '../styles/themes';
import { AppState, Language, ThemeMode } from '../types';
import { Palette, Moon, Sun, Languages, Wand2, Settings } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onOpenSettings: () => void;
}

export function Sidebar({ state, setState, onOpenSettings }: SidebarProps) {
  const handleJackpot = () => {
    const randomStyle = painterStyles[Math.floor(Math.random() * painterStyles.length)];
    setState(s => ({ ...s, painterStyleId: randomStyle.id }));
  };

  return (
    <div className="w-64 h-full border-r border-white/10 p-4 flex flex-col gap-6 overflow-y-auto" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
          <Palette className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>WOW UI</h1>
      </div>

      {/* Theme Toggle */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium uppercase tracking-wider opacity-70" style={{ color: 'var(--text-secondary)' }}>Theme Mode</label>
        <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setState(s => ({ ...s, themeMode: 'light' }))}
            className={clsx("flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all", state.themeMode === 'light' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700")}
          >
            <Sun className="w-4 h-4" /> Light
          </button>
          <button
            onClick={() => setState(s => ({ ...s, themeMode: 'dark' }))}
            className={clsx("flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all", state.themeMode === 'dark' ? "bg-gray-800 shadow-sm text-white" : "text-gray-500 hover:text-gray-300")}
          >
            <Moon className="w-4 h-4" /> Dark
          </button>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium uppercase tracking-wider opacity-70" style={{ color: 'var(--text-secondary)' }}>Language</label>
        <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-1">
          {(['en', 'zh', 'dual'] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setState(s => ({ ...s, language: lang }))}
              className={clsx(
                "flex-1 py-1.5 text-sm rounded-md transition-all capitalize",
                state.language === lang ? "bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white" : "text-gray-500"
              )}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Painter Styles */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium uppercase tracking-wider opacity-70" style={{ color: 'var(--text-secondary)' }}>Painter Style</label>
          <button onClick={handleJackpot} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors" title="Jackpot! Random Style">
            <Wand2 className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
          </button>
        </div>
        <div className="flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
          {painterStyles.map(style => (
            <button
              key={style.id}
              onClick={() => setState(s => ({ ...s, painterStyleId: style.id }))}
              className={clsx(
                "text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-3",
                state.painterStyleId === style.id ? "bg-black/5 dark:bg-white/10 font-medium" : "hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100"
              )}
              style={{ color: state.painterStyleId === style.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: style.colors.primary }} />
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/10">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          <Settings className="w-4 h-4" />
          LLM Settings
        </button>
      </div>
    </div>
  );
}
