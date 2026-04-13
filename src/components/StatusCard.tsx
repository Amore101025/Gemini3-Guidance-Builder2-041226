import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState } from '../types';
import { Activity, Cpu, Globe, Palette, Sparkles } from 'lucide-react';

interface StatusCardProps {
  state: AppState;
}

export function StatusCard({ state }: StatusCardProps) {
  const isVisible = true; // Always show the status card

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-8 right-8 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-2xl"
          style={{ 
            backgroundColor: 'rgba(var(--bg-secondary-rgb), 0.85)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 30px rgba(var(--color-primary-rgb), 0.15)'
          }}
        >
          {/* Top animated gradient bar */}
          <div className="h-1.5 w-full relative overflow-hidden">
            <motion.div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-accent), var(--color-primary))`,
                backgroundSize: '300% 100%'
              }}
              animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <div className="p-5 bg-gradient-to-b from-white/5 to-transparent dark:from-black/5">
            {/* Header: Current Status */}
            <div className="flex items-center gap-4 mb-5">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 shadow-inner">
                {state.isProcessing && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <motion.div
                  animate={state.isProcessing ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
                {state.isProcessing && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                  System Status
                </p>
                <motion.p 
                  key={state.statusMessage}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-bold truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {state.statusMessage}
                </motion.p>
              </div>
            </div>

            {/* Data Points Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Theme */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-sm transition-colors hover:bg-black/10 dark:hover:bg-white/10">
                <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                  <Palette className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">Theme</span>
                  <span className="text-xs font-semibold truncate">{state.painterStyleId}</span>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-sm transition-colors hover:bg-black/10 dark:hover:bg-white/10">
                <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                  <Globe className="w-4 h-4" style={{ color: 'var(--color-secondary)' }} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">Language</span>
                  <span className="text-xs font-semibold truncate">
                    {state.language === 'en' ? 'English' : state.language === 'zh' ? '繁中' : 'Dual (EN/ZH)'}
                  </span>
                </div>
              </div>

              {/* Model */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-sm transition-colors hover:bg-black/10 dark:hover:bg-white/10 col-span-2">
                <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                  <Cpu className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">Model</span>
                  <span className="text-xs font-semibold truncate">GPT-4o-mini</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
