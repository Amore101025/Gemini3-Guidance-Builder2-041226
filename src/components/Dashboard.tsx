import React from 'react';
import { AppState } from '../types';
import { InputPanel } from './InputPanel';
import { OutputPanel } from './OutputPanel';
import { Activity, CheckCircle2, Layers, PieChart, ListChecks, Square } from 'lucide-react';

interface DashboardProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export function Dashboard({ state, setState }: DashboardProps) {
  const handleStop = () => {
    if (state.abortController) {
      state.abortController.abort();
      setState(s => ({ ...s, isProcessing: false, statusMessage: 'Operation cancelled', abortController: null }));
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Top Status Bar */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 shadow-sm z-10" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Ready
          </div>
          {state.isProcessing && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400 animate-pulse">
                <Activity className="w-4 h-4" />
                {state.statusMessage}
              </div>
              <button
                onClick={handleStop}
                className="flex items-center justify-center p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                title="Stop Processing"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex items-center gap-2" title="Topics Extracted">
            <Layers className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            {state.topics.length}/30
          </div>
          <div className="flex items-center gap-2" title="Infographics Generated">
            <PieChart className="w-4 h-4" style={{ color: 'var(--color-secondary)' }} />
            {state.infographicSpecs.length}
          </div>
          <div className="flex items-center gap-2" title="Checklist Items">
            <ListChecks className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
            {state.checklist.length}
          </div>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r border-white/10 h-full overflow-hidden">
          <InputPanel state={state} setState={setState} />
        </div>
        <div className="w-2/3 h-full overflow-hidden">
          <OutputPanel state={state} setState={setState} />
        </div>
      </div>
    </div>
  );
}
