
import React, { useState, useCallback } from 'react';
import { expandPrompt } from './services/geminiService';
import { GeneratedResult } from './types';

export default function App() {
  const [userInput, setUserInput] = useState('');
  const [isExpanding, setIsExpanding] = useState(false);
  const [currentResult, setCurrentResult] = useState<GeneratedResult | null>(null);
  const [history, setHistory] = useState<GeneratedResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const input = userInput.trim();
    if (!input) return;

    setError(null);
    setIsExpanding(true);
    setCurrentResult(null);

    try {
      const expanded = await expandPrompt(input);
      const newResult: GeneratedResult = {
        id: Date.now().toString(),
        originalInput: input,
        expandedPrompt: expanded,
        timestamp: Date.now()
      };
      setCurrentResult(newResult);
      setHistory(prev => [newResult, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to expand prompt. Please try again.");
    } finally {
      setIsExpanding(false);
    }
  };

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }, []);

  const loadFromHistory = (item: GeneratedResult) => {
    setCurrentResult(item);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fas fa-terminal text-xl text-white"></i>
          </div>
          <h1 className="text-2xl font-bold gradient-text tracking-tight">AvatarGen AI</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/5"
          >
            <i className="fas fa-history"></i>
            <span className="hidden sm:inline">History</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Input Section */}
        <section className="glass rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <i className="fas fa-wand-magic-sparkles text-9xl text-white"></i>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Prompt Engineer</h2>
            <p className="text-slate-400 mb-8">Transform simple descriptions into hyper-detailed engineering documents for AI image generators.</p>
            
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="relative">
                <input 
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g., Japanese man, 30, street style, Tokyo night"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-6 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600 shadow-inner"
                />
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={isExpanding || !userInput.trim()}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white shadow-xl shadow-blue-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-3"
                >
                  {isExpanding ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Engineering...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-bolt"></i> Expand Prompt
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
            <i className="fas fa-exclamation-circle text-xl"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Results Area */}
        {(currentResult || isExpanding) && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass rounded-2xl p-8 flex flex-col border-blue-500/20 shadow-xl min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                  <i className="fas fa-microchip text-blue-400"></i>
                  AI Engineered Output
                </h3>
                {currentResult && (
                  <button 
                    onClick={() => copyToClipboard(currentResult.expandedPrompt)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white border border-white/10"
                  >
                    <i className="fas fa-copy"></i>
                    <span>Copy</span>
                  </button>
                )}
              </div>
              
              <div className="flex-1 bg-slate-950/50 rounded-xl p-6 border border-slate-800 font-mono text-base leading-relaxed overflow-y-auto shadow-inner text-slate-300">
                {isExpanding ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-800 rounded w-11/12"></div>
                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                    <div className="h-4 bg-slate-800 rounded w-10/12"></div>
                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                  </div>
                ) : (
                  currentResult?.expandedPrompt
                )}
              </div>
              
              {currentResult && (
                <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-4 text-xs text-slate-500 italic">
                  <span>Input: "{currentResult.originalInput}"</span>
                  <span className="ml-auto">{new Date(currentResult.timestamp).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Drawer */}
        {showHistory && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
            <div className="relative w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Generation History</h3>
                <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white transition-colors">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {history.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    <i className="fas fa-ghost text-4xl mb-4 block opacity-20"></i>
                    <p>No history yet</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => loadFromHistory(item)}
                      className="group p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-sm line-clamp-1 flex-1 text-slate-200">{item.originalInput}</p>
                        <span className="text-[10px] text-slate-500 ml-2 whitespace-nowrap">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-3 italic">"{item.expandedPrompt.substring(0, 150)}..."</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-12 px-8 text-center text-slate-500">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="flex items-center justify-center gap-2">
            Engineered with <i className="fas fa-brain text-blue-500"></i> using Gemini 3 Pro
          </p>
          <p className="text-xs uppercase tracking-widest opacity-50">© 2024 AvatarGen AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
