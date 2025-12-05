
import React, { useState, useEffect } from 'react';
import { AnalysisResult, Journal, SortOption } from '../types';

interface Props {
  results: AnalysisResult;
}

const ResultsSection: React.FC<Props> = ({ results }) => {
  const [sortedJournals, setSortedJournals] = useState<Journal[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.MATCH_SCORE);

  useEffect(() => {
    const sorted = [...results.journals];
    switch (sortOption) {
      case SortOption.MATCH_SCORE:
        sorted.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case SortOption.IMPACT_FACTOR:
        sorted.sort((a, b) => b.impactFactor - a.impactFactor);
        break;
      case SortOption.ACCEPTANCE_RATE:
        // Parse "15%" -> 15
        const getRate = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
        sorted.sort((a, b) => getRate(b.acceptanceRate) - getRate(a.acceptanceRate));
        break;
      case SortOption.REVIEW_TIME:
        // Heuristic: smaller number in string is better
        const getWeeks = (s: string) => parseInt(s.replace(/[^0-9]/g, '')) || 99;
        sorted.sort((a, b) => getWeeks(a.reviewTime) - getWeeks(b.reviewTime));
        break;
    }
    setSortedJournals(sorted);
  }, [results, sortOption]);

  const ProbabilityBar = ({ value }: { value: number }) => {
    let color = "bg-red-500";
    if (value > 40) color = "bg-yellow-500";
    if (value > 70) color = "bg-green-500";

    return (
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-1">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Deep Diagnosis Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-academic-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            文章优劣势分析
          </h3>
          <span className="text-xs font-semibold px-2 py-1 bg-academic-100 text-academic-700 rounded border border-academic-200">
            {results.detectedSubjectArea}
          </span>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strengths */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-emerald-700 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              文章亮点 (Strengths)
            </h4>
            <ul className="space-y-2">
              {results.detailedAnalysis.strengths.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                  <span className="text-emerald-500 font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div>
            <h4 className="flex items-center gap-2 font-semibold text-rose-700 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              改进空间 (Areas for Improvement)
            </h4>
            <ul className="space-y-2">
              {results.detailedAnalysis.weaknesses.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700 bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                  <span className="text-rose-500 font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Suggestions Panel (Title & Keywords) */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          标题与关键词优化建议
        </h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-800 text-sm uppercase tracking-wide mb-2">建议修改的标题</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {results.suggestions.titleSuggestions.map((title, idx) => (
                <li key={idx} className="text-sm italic font-medium">"{title}"</li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-800 text-sm uppercase tracking-wide mb-2">建议补充的关键词</h4>
              <div className="flex flex-wrap gap-2">
                {results.suggestions.abstractKeywordsToInclude.map((kw, idx) => (
                  <span key={idx} className="px-2 py-1 bg-white border border-blue-200 text-blue-700 text-xs rounded-full shadow-sm">{kw}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 text-sm uppercase tracking-wide mb-2">综合投稿策略</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{results.suggestions.generalAdvice}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Explanation Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-slate-700 flex flex-col md:flex-row gap-4">
         <div className="flex-1">
            <h4 className="font-bold text-amber-800 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              指标说明
            </h4>
            <p className="mb-2"><span className="font-semibold text-slate-900">匹配得分 (Match Score)</span>: 代表您的文章主题与期刊收录范围的契合程度。分数越高，说明主题越相关。</p>
            <p><span className="font-semibold text-slate-900">录用概率 (Acceptance Probability)</span>: 综合考虑了期刊的竞争程度（难度）和文章质量。比如顶级期刊可能主题非常匹配（Match Score高），但因为极难发表，录用概率可能很低。</p>
         </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">推荐期刊 ({results.journals.length})</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">排序方式:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-academic-500 outline-none"
          >
            {Object.values(SortOption).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Journal Cards */}
      <div className="grid gap-6">
        {sortedJournals.map((journal, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md hover:border-academic-300">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              
              {/* Left Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{journal.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{journal.publisher} • ISSN: {journal.issn}</p>
                  </div>
                  {journal.isOA && (
                    <span className="shrink-0 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase tracking-wider">
                      Open Access
                    </span>
                  )}
                </div>
                
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{journal.scope}</p>
                
                <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 border border-slate-100">
                  <span className="font-semibold text-academic-700">推荐理由: </span>
                  {journal.matchReason}
                </div>
              </div>

              {/* Right Metrics */}
              <div className="w-full md:w-64 shrink-0 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">预估录用概率</span>
                    <span className="font-bold text-slate-900">{journal.acceptanceProbability}%</span>
                  </div>
                  <ProbabilityBar value={journal.acceptanceProbability} />
                  <p className="text-xs text-slate-400">基于文章质量与期刊难度综合评估</p>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">影响因子 (IF)</p>
                    <p className="text-lg font-bold text-slate-800">{journal.impactFactor.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">匹配得分</p>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-academic-600">{journal.matchScore}</span>
                      <span className="text-xs text-slate-400">/100</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">历史录用率</p>
                    <p className="text-sm font-semibold text-slate-800">{journal.acceptanceRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">平均审稿周期</p>
                    <p className="text-sm font-semibold text-slate-800">{journal.reviewTime}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsSection;
