import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { FormData, AnalysisResult } from './types';
import { analyzeManuscript } from './services/geminiService';

const App: React.FC = () => {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    // Scroll to results area logic would go here typically
    
    try {
      const analysis = await analyzeManuscript(data);
      setResults(analysis);
    } catch (err: any) {
      console.error(err);
      setError("分析稿件时发生错误，请检查您的网络连接或 API Key 设置。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-academic-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">ScholarMatch</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">AI 智能期刊匹配助手</p>
            </div>
          </div>
          {results && (
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-slate-600 hover:text-academic-600 underline"
            >
              开始新搜索
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        
        {/* Intro / Hero - Only show if no results yet */}
        {!results && !isLoading && (
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
              为您的研究成果找到最理想的发表平台
            </h2>
            <p className="text-slate-600 text-lg">
              输入您的稿件标题、摘要及关键词，我们的 AI 将为您分析文章内容，推荐最匹配的高影响力期刊。
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-8">
          {/* Input Form - Hide when results are shown to focus on results, or keep it collapsible. 
              For this UI, we hide it if results exist for cleaner view, but allow reset. */}
          {!results && (
            <InputSection onSubmit={handleSubmit} isLoading={isLoading} />
          )}

          {/* Results View */}
          {results && (
            <ResultsSection results={results} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} ScholarMatch AI. Powered by Google Gemini.</p>
        <p className="mt-2">所有预估指标（影响因子、审稿周期等）基于 AI 知识库生成，仅供参考，请以期刊官网实时数据为准。</p>
      </footer>
    </div>
  );
};

export default App;