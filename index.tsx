import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App = () => {
  const [targetNum, setTargetNum] = useState<string>('3.1415');
  const [intA, setIntA] = useState<string>('47000');
  const [intB, setIntB] = useState<string>('53000');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    math: any;
    aiInsight: string;
  } | null>(null);

  const performAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const f = parseFloat(targetNum);
    const a = parseInt(intA);
    const b = parseInt(intB);

    if (isNaN(f) || isNaN(a) || isNaN(b)) {
      alert("Please ensure all inputs are valid numbers.");
      setLoading(false);
      return;
    }

    const min = Math.min(a, b);
    const max = Math.max(a, b);
    const isInside = f >= min && f <= max;
    const progress = max === min ? 0 : ((f - min) / (max - min)) * 100;

    const mathStats = {
      isInside,
      progress: progress.toFixed(2),
      min,
      max,
      range: max - min,
      isInteger: Number.isInteger(f)
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these numbers: Target: ${f}, Min bound: ${min}, Max bound: ${max}. 
        Provide a short, fascinating mathematical or historical paragraph about these specific numbers. 
        Focus on their relationship or individual properties. Keep it under 100 words.`,
      });

      setResult({
        math: mathStats,
        aiInsight: response.text || "No insight available."
      });
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setResult({
        math: mathStats,
        aiInsight: "The numbers are shy today. Mathematical synergy is present, but AI insight is currently offline."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-300">
          Synergy Engine
        </h1>
        <p className="text-slate-400 text-lg">Explore the relationship between your values and constraints.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Input Controls */}
        <div className="md:col-span-5">
          <form onSubmit={performAnalysis} className="glass p-8 space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Target Float Value</label>
              <input 
                type="number" 
                step="any"
                value={targetNum}
                onChange={(e) => setTargetNum(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-lg mono input-glow text-violet-300"
                placeholder="e.g. 42.75"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Bound Alpha</label>
                <input 
                  type="number" 
                  step="1"
                  value={intA}
                  onChange={(e) => setIntA(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-lg mono input-glow"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Bound Omega</label>
                <input 
                  type="number" 
                  step="1"
                  value={intB}
                  onChange={(e) => setIntB(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-lg mono input-glow"
                  placeholder="100"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 
                ${loading 
                  ? 'bg-slate-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Analyze Synergy"}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-7">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass p-8 shimmer-bg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-indigo-300 uppercase tracking-widest">Mathematical Status</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.math.isInside ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {result.math.isInside ? 'INTERNALIZED' : 'EXTERNALIZED'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="relative h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${result.math.isInside ? 'bg-gradient-to-r from-violet-500 to-indigo-500' : 'bg-slate-600'}`}
                      style={{ width: `${Math.max(0, Math.min(100, result.math.progress))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mono text-slate-500">
                    <span>{result.math.min}</span>
                    <span>{result.math.progress}% position</span>
                    <span>{result.math.max}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Range Breadth</p>
                    <p className="text-xl mono">{result.math.range}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Float Status</p>
                    <p className="text-xl mono">{result.math.isInteger ? 'Integer' : 'Rational'}</p>
                  </div>
                </div>
              </div>

              <div className="glass p-8 border-l-4 border-l-violet-500">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  AI Synergy Insight
                </h3>
                <p className="text-slate-300 leading-relaxed italic">
                  "{result.aiInsight}"
                </p>
              </div>
            </div>
          ) : (
            <div className="glass h-full flex flex-col items-center justify-center p-12 text-center text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-lg">Awaiting input parameters...</p>
              <p className="text-sm mt-2">Enter your values to unlock mathematical resonance data.</p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-16 text-center text-slate-600 text-xs">
        <p>Built with Gemini 3 Flash & High Precision Computational Logic</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
