import React, { useState, ChangeEvent } from 'react';
import { FormData } from '../types';

interface Props {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const InputSection: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    keywords: '',
    abstract: '',
    subjectArea: '自动检测',
    fullText: '',
    preferences: {
      openAccess: false,
      highImpact: false,
      fastReview: false,
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [name]: checked },
    }));
  };

  const handleTextFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, fullText: event.target?.result as string }));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 relative overflow-hidden">
      {/* Privacy Badge */}
      <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-bl-xl text-xs font-bold flex items-center gap-1 border-b border-l border-emerald-100 shadow-sm">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        隐私保护模式: 数据仅用于实时分析
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-academic-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        稿件信息录入
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">文章标题 (英文) *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-academic-500 focus:border-academic-500 transition-colors"
              placeholder="例如: Deep Learning Approaches for Medical Image Analysis"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">学科领域</label>
            <select
              name="subjectArea"
              value={formData.subjectArea}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-academic-500 focus:border-academic-500 bg-white"
            >
              <option value="自动检测">🤖 自动检测 (AI智能分析)</option>
              <option value="Computer Science">计算机科学 (Computer Science)</option>
              <option value="Medicine & Health">医学与健康 (Medicine & Health)</option>
              <option value="Engineering">工程学 (Engineering)</option>
              <option value="Social Sciences">社会科学 (Social Sciences)</option>
              <option value="Business & Management">商业与管理 (Business & Management)</option>
              <option value="Biology">生物学 (Biology)</option>
              <option value="Physics">物理学 (Physics)</option>
              <option value="Chemistry">化学 (Chemistry)</option>
              <option value="Arts & Humanities">艺术与人文 (Arts & Humanities)</option>
              <option value="Environmental Science">环境科学 (Environmental Science)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">关键词 (英文，逗号分隔)</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-academic-500 focus:border-academic-500"
              placeholder="例如: neural networks, radiology, diagnostics"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">摘要 (英文) *</label>
            <textarea
              name="abstract"
              required
              rows={5}
              value={formData.abstract}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-academic-500 focus:border-academic-500"
              placeholder="请粘贴您的文章摘要..."
            />
          </div>

           <div className="col-span-1 md:col-span-2">
            {/* Text Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                上传正文文本 (可选, .txt/.md)
              </label>
              <div className="relative border-dashed border-2 border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors h-32 flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept=".txt,.md"
                  onChange={handleTextFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-slate-500">
                  {formData.fullText ? (
                    <span className="text-emerald-600 font-medium flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      已读取文本内容
                    </span>
                  ) : (
                    <span className="text-sm">点击上传文章正文<br/><span className="text-xs text-slate-400">用于更精准的分析</span></span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-3">投稿偏好</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="openAccess"
                checked={formData.preferences.openAccess}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-academic-600 rounded border-slate-300 focus:ring-academic-500"
              />
              <span className="text-slate-700">开放获取 (OA)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="highImpact"
                checked={formData.preferences.highImpact}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-academic-600 rounded border-slate-300 focus:ring-academic-500"
              />
              <span className="text-slate-700">高影响因子</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="fastReview"
                checked={formData.preferences.fastReview}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-academic-600 rounded border-slate-300 focus:ring-academic-500"
              />
              <span className="text-slate-700">快速审稿</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg shadow-md transition-all 
            ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-academic-600 hover:bg-academic-800 hover:shadow-lg transform active:scale-[0.99]'}
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI 正在分析稿件与验证期刊...
            </span>
          ) : (
            "分析稿件并推荐期刊"
          )}
        </button>
        <p className="text-center text-xs text-slate-400 mt-2">
          承诺：您的稿件仅用于实时分析，不会被保存到我们的服务器。
        </p>
      </form>
    </div>
  );
};

export default InputSection;