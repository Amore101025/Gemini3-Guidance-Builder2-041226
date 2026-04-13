import React, { useState } from 'react';
import { AppState, Topic, InfographicSpec, ChecklistItem } from '../types';
import { extractTopics, generateInfographicSpecs, generateChecklist, generateAutoSummary, generateGlossary, analyzeSentiment } from '../services/geminiService';
import { FileText, ListChecks, PieChart, Wand2, Layers, CheckCircle2, MessageCircleQuestion, BookOpen, FileSearch, HeartPulse } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface OutputPanelProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export function OutputPanel({ state, setState }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<'topics' | 'infographics' | 'checklist' | 'questions' | 'summary' | 'glossary' | 'sentiment'>('topics');

  const handleExtractTopics = async () => {
    if (!state.structuredMarkdown) return;
    const abortController = new AbortController();
    setState(s => ({ ...s, isProcessing: true, statusMessage: 'Extracting 30 regulatory topics...', abortController }));
    try {
      const topics = await extractTopics(state.structuredMarkdown, state.language, state.llmConfig.model, state.llmConfig.prompts.extractTopics);
      if (!abortController.signal.aborted) {
        setState(s => ({ ...s, topics, isProcessing: false, statusMessage: `Extracted ${topics.length} topics`, abortController: null }));
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error(error);
        setState(s => ({ ...s, isProcessing: false, statusMessage: 'Error extracting topics', abortController: null }));
      }
    }
  };

  const handleGenerateInfographics = async () => {
    if (state.topics.length === 0) return;
    const abortController = new AbortController();
    setState(s => ({ ...s, isProcessing: true, statusMessage: 'Generating infographic specs...', abortController }));
    try {
      const specs = await generateInfographicSpecs(state.topics, state.structuredMarkdown, state.llmConfig.model, state.llmConfig.prompts.generateInfographics);
      if (!abortController.signal.aborted) {
        setState(s => ({ ...s, infographicSpecs: specs, isProcessing: false, statusMessage: `Generated ${specs.length} infographic specs`, abortController: null }));
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error(error);
        setState(s => ({ ...s, isProcessing: false, statusMessage: 'Error generating infographics', abortController: null }));
      }
    }
  };

  const handleGenerateChecklist = async () => {
    if (!state.structuredMarkdown) return;
    const abortController = new AbortController();
    setState(s => ({ ...s, isProcessing: true, statusMessage: 'Generating 100-point review checklist...', abortController }));
    try {
      const checklist = await generateChecklist(state.structuredMarkdown, state.llmConfig.model, state.llmConfig.prompts.generateChecklist);
      if (!abortController.signal.aborted) {
        setState(s => ({ ...s, checklist, isProcessing: false, statusMessage: `Generated checklist with ${checklist.length} items`, abortController: null }));
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error(error);
        setState(s => ({ ...s, isProcessing: false, statusMessage: 'Error generating checklist', abortController: null }));
      }
    }
  };

  const handleGenerateSummary = async () => {
    if (!state.structuredMarkdown) return;
    const abortController = new AbortController();
    setState(s => ({ ...s, isProcessing: true, statusMessage: 'Generating summary...', abortController }));
    try {
      const summary = await generateAutoSummary(state.structuredMarkdown, state.llmConfig.model, state.llmConfig.prompts.autoSummary);
      if (!abortController.signal.aborted) {
        setState(s => ({ ...s, autoSummary: summary, isProcessing: false, statusMessage: 'Summary generated', abortController: null }));
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error(error);
        setState(s => ({ ...s, isProcessing: false, statusMessage: 'Error generating summary', abortController: null }));
      }
    }
  };

  const handleGenerateGlossary = async () => {
    if (!state.structuredMarkdown) return;
    const abortController = new AbortController();
    setState(s => ({ ...s, isProcessing: true, statusMessage: 'Generating glossary...', abortController }));
    try {
      const glossary = await generateGlossary(state.structuredMarkdown, state.llmConfig.model, state.llmConfig.prompts.glossary);
      if (!abortController.signal.aborted) {
        setState(s => ({ ...s, glossary, isProcessing: false, statusMessage: `Generated ${glossary.length} glossary terms`, abortController: null }));
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error(error);
        setState(s => ({ ...s, isProcessing: false, statusMessage: 'Error generating glossary', abortController: null }));
      }
    }
  };

  const handleAnalyzeSentiment = async () => {
    if (!state.structuredMarkdown) return;
    const abortController = new AbortController();
    setState(s => ({ ...s, isProcessing: true, statusMessage: 'Analyzing sentiment...', abortController }));
    try {
      const sentiment = await analyzeSentiment(state.structuredMarkdown, state.llmConfig.model, state.llmConfig.prompts.sentiment);
      if (!abortController.signal.aborted) {
        setState(s => ({ ...s, sentimentAnalysis: sentiment, isProcessing: false, statusMessage: 'Sentiment analyzed', abortController: null }));
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        console.error(error);
        setState(s => ({ ...s, isProcessing: false, statusMessage: 'Error analyzing sentiment', abortController: null }));
      }
    }
  };

  const followUpQuestions = [
    "1. How do the new FDA QMSR requirements align with ISO 13485:2016 in practice?",
    "2. What are the specific transition timelines for legacy devices under the EU MDR?",
    "3. How should manufacturers handle clinical evaluation reports (CERs) for software as a medical device (SaMD)?",
    "4. What are the key differences in post-market surveillance (PMS) reporting between FDA and EU MDR?",
    "5. How does the IMDRF framework influence national regulations in emerging markets?",
    "6. What cybersecurity documentation is now mandatory for premarket submissions?",
    "7. How can real-world evidence (RWE) be effectively used to support label expansions?",
    "8. What are the implications of the new UDI requirements for global supply chains?",
    "9. How should companies prepare for unannounced audits by Notified Bodies?",
    "10. What are the best practices for managing supplier quality agreements under the new regulations?",
    "11. How do the new UKCA marking requirements differ from the CE marking process?",
    "12. What specific human factors engineering (HFE) data is required for home-use devices?",
    "13. How should manufacturers approach biocompatibility testing for novel materials?",
    "14. What are the regulatory pathways for AI/ML-based medical devices with adaptive algorithms?",
    "15. How can companies streamline their regulatory submissions across multiple jurisdictions?",
    "16. What are the common pitfalls in clinical investigation design for high-risk devices?",
    "17. How should manufacturers handle adverse event reporting in a global context?",
    "18. What are the requirements for environmental sustainability in medical device packaging?",
    "19. How do the new regulations impact the classification of borderline products (e.g., drug-device combinations)?",
    "20. What strategies can companies use to ensure continuous compliance in a rapidly changing regulatory landscape?"
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 shadow-sm" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'topics' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            style={{ color: activeTab === 'topics' ? 'var(--color-primary)' : 'var(--text-secondary)' }}
          >
            <Layers className="w-4 h-4" /> Topics ({state.topics.length})
          </button>
          <button
            onClick={() => setActiveTab('infographics')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'infographics' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            style={{ color: activeTab === 'infographics' ? 'var(--color-secondary)' : 'var(--text-secondary)' }}
          >
            <PieChart className="w-4 h-4" /> Infographics ({state.infographicSpecs.length})
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'checklist' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            style={{ color: activeTab === 'checklist' ? 'var(--color-accent)' : 'var(--text-secondary)' }}
          >
            <ListChecks className="w-4 h-4" /> Checklist ({state.checklist.length})
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'summary' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            style={{ color: activeTab === 'summary' ? 'var(--color-primary)' : 'var(--text-secondary)' }}
          >
            <FileSearch className="w-4 h-4" /> Summary
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'glossary' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            style={{ color: activeTab === 'glossary' ? 'var(--color-secondary)' : 'var(--text-secondary)' }}
          >
            <BookOpen className="w-4 h-4" /> Glossary
          </button>
          <button
            onClick={() => setActiveTab('sentiment')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'sentiment' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            style={{ color: activeTab === 'sentiment' ? 'var(--color-accent)' : 'var(--text-secondary)' }}
          >
            <HeartPulse className="w-4 h-4" /> Sentiment
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'questions' ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
            style={{ color: activeTab === 'questions' ? 'var(--color-primary)' : 'var(--text-secondary)' }}
          >
            <MessageCircleQuestion className="w-4 h-4" /> Questions
          </button>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {activeTab === 'topics' && (
            <button onClick={handleExtractTopics} disabled={state.isProcessing || !state.structuredMarkdown} className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2">
              <Wand2 className="w-4 h-4" /> Extract Topics
            </button>
          )}
          {activeTab === 'infographics' && (
            <button onClick={handleGenerateInfographics} disabled={state.isProcessing || state.topics.length === 0} className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2">
              <Wand2 className="w-4 h-4" /> Generate Infographics
            </button>
          )}
          {activeTab === 'checklist' && (
            <button onClick={handleGenerateChecklist} disabled={state.isProcessing || !state.structuredMarkdown} className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2">
              <Wand2 className="w-4 h-4" /> Generate Checklist
            </button>
          )}
          {activeTab === 'summary' && (
            <button onClick={handleGenerateSummary} disabled={state.isProcessing || !state.structuredMarkdown} className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2">
              <Wand2 className="w-4 h-4" /> Generate Summary
            </button>
          )}
          {activeTab === 'glossary' && (
            <button onClick={handleGenerateGlossary} disabled={state.isProcessing || !state.structuredMarkdown} className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2">
              <Wand2 className="w-4 h-4" /> Generate Glossary
            </button>
          )}
          {activeTab === 'sentiment' && (
            <button onClick={handleAnalyzeSentiment} disabled={state.isProcessing || !state.structuredMarkdown} className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2">
              <Wand2 className="w-4 h-4" /> Analyze Sentiment
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
        <AnimatePresence mode="wait">
          {activeTab === 'topics' && (
            <motion.div key="topics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {state.topics.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-500">
                  <Layers className="w-12 h-12 mb-4 opacity-50" />
                  <p>No topics extracted yet. Click "Extract Topics" to begin.</p>
                </div>
              ) : (
                state.topics.map((topic, i) => (
                  <div key={topic.topic_id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-black/5 dark:border-white/5 hover:shadow-md transition-shadow" style={{ borderTop: `4px solid var(--color-primary)` }}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-black/5 dark:bg-white/10" style={{ color: 'var(--text-secondary)' }}>#{topic.topic_id}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${topic.confidence === 'High' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : topic.confidence === 'Med' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {topic.confidence}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{state.language === 'zh' ? topic.title_zh : topic.title_en}</h3>
                    {state.language === 'dual' && <h4 className="text-sm font-medium mb-3 opacity-70" style={{ color: 'var(--text-secondary)' }}>{topic.title_zh}</h4>}
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{state.language === 'zh' ? topic.summary_zh : topic.summary_en}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {(topic.tags || []).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-md bg-black/5 dark:bg-white/5" style={{ color: 'var(--color-secondary)' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'infographics' && (
            <motion.div key="infographics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-6">
              {state.infographicSpecs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <PieChart className="w-12 h-12 mb-4 opacity-50" />
                  <p>No infographics generated yet. Click "Generate Infographics" to begin.</p>
                </div>
              ) : (
                state.infographicSpecs.map(spec => (
                  <div key={spec.topic_id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-black/5 dark:border-white/5 flex flex-col md:flex-row">
                    {/* Mock Visual Area */}
                    <div className="md:w-1/3 p-8 flex flex-col justify-center items-center relative overflow-hidden" style={{ backgroundColor: 'var(--color-primary)' }}>
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                      <PieChart className="w-24 h-24 text-white mb-4 relative z-10" />
                      <h4 className="text-white font-bold text-xl text-center relative z-10">{(spec.template || 'Template').toUpperCase()}</h4>
                      <p className="text-white/80 text-sm text-center mt-2 relative z-10">{spec.narrative_goal}</p>
                    </div>
                    {/* Spec Details */}
                    <div className="md:w-2/3 p-6 flex flex-col gap-4">
                      <div>
                        <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{spec.copy_deck.title}</h3>
                        <p className="text-lg opacity-80" style={{ color: 'var(--text-secondary)' }}>{spec.copy_deck.subtitle}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                          <h5 className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--color-secondary)' }}>Key Takeaways</h5>
                          <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                            {(spec.copy_deck?.key_takeaways || []).map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                          <h5 className="font-bold text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--color-accent)' }}>Evidence Anchors</h5>
                          <ul className="list-disc list-inside text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                            {(spec.evidence || []).map((e, i) => <li key={i}>{e}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'checklist' && (
            <motion.div key="checklist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
              {state.checklist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <ListChecks className="w-12 h-12 mb-4 opacity-50" />
                  <p>No checklist generated yet. Click "Generate Checklist" to begin.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/5 dark:bg-white/5">
                      <th className="p-4 font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>ID</th>
                      <th className="p-4 font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Description</th>
                      <th className="p-4 font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Status</th>
                      <th className="p-4 font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Anchors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.checklist.map((item, i) => (
                      <tr key={item.id} className="border-t border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.id}</td>
                        <td className="p-4 text-sm" style={{ color: 'var(--text-primary)' }}>{item.description}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            <CheckCircle2 className="w-3 h-3" /> {(item.status || 'N.A.').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {(item.anchors || []).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          )}

          {activeTab === 'questions' && (
            <motion.div key="questions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 p-6">
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>20 Comprehensive Follow-Up Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followUpQuestions.map((q, i) => (
                  <div key={i} className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-colors">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{q}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'summary' && (
            <motion.div key="summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 p-6">
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Executive Summary & Insights</h3>
              {state.autoSummary ? (
                <div className="prose dark:prose-invert max-w-none">
                  <Markdown>{state.autoSummary}</Markdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <FileSearch className="w-12 h-12 mb-4 opacity-50" />
                  <p>No summary generated yet. Click "Generate Summary" to begin.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'glossary' && (
            <motion.div key="glossary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
              {state.glossary.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <BookOpen className="w-12 h-12 mb-4 opacity-50" />
                  <p>No glossary generated yet. Click "Generate Glossary" to begin.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/5 dark:bg-white/5">
                      <th className="p-4 font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Term</th>
                      <th className="p-4 font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Definition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.glossary.map((item, i) => (
                      <tr key={i} className="border-t border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.term}</td>
                        <td className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{item.definition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          )}

          {activeTab === 'sentiment' && (
            <motion.div key="sentiment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 p-6">
              <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Sentiment & Tone Analysis</h3>
              {state.sentimentAnalysis ? (
                <div className="prose dark:prose-invert max-w-none">
                  <Markdown>{state.sentimentAnalysis}</Markdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <HeartPulse className="w-12 h-12 mb-4 opacity-50" />
                  <p>No sentiment analysis generated yet. Click "Analyze Sentiment" to begin.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
