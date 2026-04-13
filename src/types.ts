export type Language = 'en' | 'zh' | 'dual';
export type ThemeMode = 'light' | 'dark';

export interface Topic {
  topic_id: string;
  title_en: string;
  title_zh: string;
  summary_en: string;
  summary_zh: string;
  why_it_matters: string[];
  source_anchors: string[];
  suggested_infographic_type: string;
  tags: string[];
  confidence: 'High' | 'Med' | 'Low';
}

export interface InfographicSpec {
  topic_id: string;
  narrative_goal: string;
  template: string;
  data_schema: any;
  copy_deck: {
    title: string;
    subtitle: string;
    callouts: string[];
    footnotes: string[];
    key_takeaways: string[];
  };
  accessibility: {
    alt_text: string;
    non_color_encoding_notes: string;
  };
  evidence: string[];
}

export interface ChecklistItem {
  id: string;
  description: string;
  status: 'yes' | 'no' | 'n.a.';
  anchors: string[];
}

export interface LlmConfig {
  model: string;
  prompts: {
    transform: string;
    extractTopics: string;
    generateInfographics: string;
    generateChecklist: string;
    autoSummary: string;
    glossary: string;
    sentiment: string;
  };
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface AppState {
  language: Language;
  themeMode: ThemeMode;
  painterStyleId: string;
  inputContent: string;
  structuredMarkdown: string;
  topics: Topic[];
  infographicSpecs: InfographicSpec[];
  checklist: ChecklistItem[];
  isProcessing: boolean;
  statusMessage: string;
  llmConfig: LlmConfig;
  abortController: AbortController | null;
  autoSummary: string;
  glossary: GlossaryTerm[];
  sentimentAnalysis: string;
}
