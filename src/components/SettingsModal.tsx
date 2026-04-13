import React from 'react';
import { AppState, LlmConfig } from '../types';
import { X, Save } from 'lucide-react';

interface SettingsModalProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onClose: () => void;
}

export function SettingsModal({ state, setState, onClose }: SettingsModalProps) {
  const [localConfig, setLocalConfig] = React.useState<LlmConfig>(state.llmConfig);

  const handleSave = () => {
    setState(s => ({ ...s, llmConfig: localConfig }));
    onClose();
  };

  const updatePrompt = (key: keyof LlmConfig['prompts'], value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      prompts: {
        ...prev.prompts,
        [key]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-black/10 dark:border-white/10">
        <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-white/10">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>LLM Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Model Selection</label>
            <select
              value={localConfig.model}
              onChange={(e) => setLocalConfig(prev => ({ ...prev, model: e.target.value }))}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
              <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
              <option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite Preview</option>
            </select>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Prompts</h3>
            
            {Object.entries(localConfig.prompts).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="text-sm font-medium capitalize" style={{ color: 'var(--text-secondary)' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()} Prompt
                </label>
                <textarea
                  value={value}
                  onChange={(e) => updatePrompt(key as keyof LlmConfig['prompts'], e.target.value)}
                  className="w-full h-24 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-3 resize-none outline-none focus:border-blue-500 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-black/10 dark:border-white/10 flex justify-end gap-3 bg-black/5 dark:bg-white/5">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
