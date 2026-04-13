import React, { useState } from 'react';
import { AppState } from '../types';
import { FileText, Upload, Wand2, FileSearch } from 'lucide-react';
import { transformToMarkdown } from '../services/geminiService';

interface InputPanelProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export function InputPanel({ state, setState }: InputPanelProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setState(s => ({ ...s, inputContent: e.target?.result as string }));
      };
      reader.readAsText(file);
    }
  };

  const handleTransform = async () => {
    if (!state.inputContent) return;
    
    const abortController = new AbortController();
    setState(s => ({ ...s, isProcessing: true, statusMessage: 'Transforming notes to structured markdown...', abortController }));
    
    try {
      const markdown = await transformToMarkdown(state.inputContent, state.llmConfig.model, state.llmConfig.prompts.transform);
      if (!abortController.signal.aborted) {
        setState(s => ({ ...s, structuredMarkdown: markdown, isProcessing: false, statusMessage: 'Transformation complete', abortController: null }));
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error(error);
        setState(s => ({ ...s, isProcessing: false, statusMessage: 'Error during transformation', abortController: null }));
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full p-6 overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Input Document</h2>
        <div className="flex gap-2">
          <button
            onClick={handleTransform}
            disabled={!state.inputContent || state.isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
          >
            <Wand2 className="w-4 h-4" />
            AI Transform to Markdown
          </button>
        </div>
      </div>

      <div
        className={`flex-1 border-2 border-dashed rounded-xl p-4 transition-all ${isDragging ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 dark:border-gray-700'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          className="w-full h-full bg-transparent resize-none outline-none"
          placeholder="Paste your medical device premarket review guidance, 510(k) summary, or raw notes here... Or drag and drop a text/markdown file."
          value={state.inputContent}
          onChange={(e) => setState(s => ({ ...s, inputContent: e.target.value }))}
          style={{ color: 'var(--text-primary)' }}
        />
      </div>
      
      {state.structuredMarkdown && (
        <div className="flex-1 mt-4 flex flex-col gap-2">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Structured Markdown (Editable)</h3>
          <textarea
            className="w-full h-full bg-black/5 dark:bg-white/5 rounded-xl p-4 resize-none outline-none border border-transparent focus:border-blue-500 transition-colors"
            value={state.structuredMarkdown}
            onChange={(e) => setState(s => ({ ...s, structuredMarkdown: e.target.value }))}
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      )}
    </div>
  );
}
