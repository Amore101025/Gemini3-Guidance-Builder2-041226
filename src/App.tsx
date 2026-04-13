import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StatusCard } from './components/StatusCard';
import { SettingsModal } from './components/SettingsModal';
import { painterStyles } from './styles/themes';

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [state, setState] = useState<AppState>({
    language: 'en',
    themeMode: 'light',
    painterStyleId: 'van-gogh',
    inputContent: '',
    structuredMarkdown: '',
    topics: [],
    infographicSpecs: [],
    checklist: [],
    isProcessing: false,
    statusMessage: 'Ready',
    llmConfig: {
      model: 'gemini-3.1-pro-preview',
      prompts: {
        transform: 'Transform the following unstructured notes or text into organized markdown. Create section headings, numbered lists, and tables as needed. Clean up the text for clarity.',
        extractTopics: 'Extract exactly 30 regulatory topics/entities from the following article.\nOutput must be a JSON array of objects with the following properties:\ntopic_id (01-30), title_en, title_zh, summary_en, summary_zh, why_it_matters (array of strings, bilingual if dual mode), source_anchors (array of strings), suggested_infographic_type, tags (array of strings), confidence ("High", "Med", or "Low").',
        generateInfographics: 'Generate infographic specifications for the following topics based on the article.\nOutput must be a JSON array of objects with properties: topic_id, narrative_goal, template, data_schema (object), copy_deck (object with title, subtitle, callouts array, footnotes array, key_takeaways array), accessibility (object with alt_text, non_color_encoding_notes), evidence (array of strings).',
        generateChecklist: 'Generate a 10-point review checklist based on the following article (simulating a 100-point checklist for brevity).\nOutput must be a JSON array of objects with properties: id, description, status (always "n.a."), anchors (array of strings).',
        autoSummary: 'Generate a brief executive summary and 3-5 key insights from the following text.',
        glossary: 'Extract 10-15 complex regulatory or technical terms from the text and provide clear definitions for a glossary. Output as a JSON array of objects with properties: term, definition.',
        sentiment: 'Analyze the tone of the document and suggest improvements for a specific audience (e.g., regulators vs. patients). Provide a short analysis.'
      }
    },
    abortController: null,
    autoSummary: '',
    glossary: [],
    sentimentAnalysis: ''
  });

  useEffect(() => {
    const style = painterStyles.find(s => s.id === state.painterStyleId) || painterStyles[0];
    const root = document.documentElement;
    
    // Apply Theme Mode
    if (state.themeMode === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#0f172a'); // slate-900
      root.style.setProperty('--bg-secondary', '#1e293b'); // slate-800
      root.style.setProperty('--text-primary', '#f8fafc'); // slate-50
      root.style.setProperty('--text-secondary', '#cbd5e1'); // slate-300
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc'); // slate-50
      root.style.setProperty('--text-primary', '#0f172a'); // slate-900
      root.style.setProperty('--text-secondary', '#475569'); // slate-600
    }

    // Apply Painter Style Colors
    root.style.setProperty('--color-primary', style.colors.primary);
    root.style.setProperty('--color-secondary', style.colors.secondary);
    root.style.setProperty('--color-accent', style.colors.accent);
    
    // Optional: Use painter background if we want a more immersive feel, 
    // but for a clean UI, we stick to the theme mode backgrounds and use painter colors for accents.
  }, [state.themeMode, state.painterStyleId]);

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Sidebar state={state} setState={setState} onOpenSettings={() => setIsSettingsOpen(true)} />
      <Dashboard state={state} setState={setState} />
      <StatusCard state={state} />
      {isSettingsOpen && <SettingsModal state={state} setState={setState} onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}
