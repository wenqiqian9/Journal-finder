
import { GoogleGenAI, Type } from "@google/genai";
import { FormData, AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in the environment.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

export const analyzeManuscript = async (data: FormData): Promise<AnalysisResult> => {
  const modelName = 'gemini-2.5-flash'; 

  // Construct the prompt context
  const userPreferences = [
    data.preferences.openAccess ? "偏好开放获取(Open Access)期刊。" : "",
    data.preferences.highImpact ? "优先考虑高影响因子期刊。" : "",
    data.preferences.fastReview ? "优先考虑审稿周期短的期刊。" : ""
  ].filter(Boolean).join(" ");

  const subjectAreaContext = data.subjectArea === '自动检测' 
    ? "请根据文章内容自动分析并确定所属的具体学科领域。" 
    : `用户指定的学科领域为: ${data.subjectArea}`;

  const textPrompt = `
    你是一位严谨、公正且经验丰富的资深学术期刊编辑。
    请使用中文回答。
    
    【核心原则】：
    1. **真实性验证**：你推荐的期刊必须是真实存在的，具有有效的 ISSN 号。绝对禁止编造虚假期刊。请基于真实的数据库（如 WoS, Scopus）知识进行推荐。
    2. **保密性**：模拟同行评审的保密协议，客观、中立地分析稿件，不要在输出中泄露用户的个人敏感信息。

    稿件详情:
    - 标题: ${data.title}
    - 关键词: ${data.keywords}
    - 摘要: ${data.abstract}
    - 学科领域: ${subjectAreaContext}
    ${data.fullText ? `- 全文片段 (前3000字符): ${data.fullText.substring(0, 3000)}...` : ''}

    用户偏好: ${userPreferences}

    任务:
    1. **学科检测**：如果用户未指定，推断最准确的学科领域。
    2. **期刊推荐**：识别 6-8 本真实存在的英文学术期刊。
    3. **指标预估**：提供真实的影响因子（基于最新数据）和历史录用率估算。
    4. **匹配分析**：计算匹配得分（Match Score）和预估录用概率（Acceptance Probability）。
    5. **简要点评**：
       - 分析文章的强项和弱项。
       - 提供标题和摘要的修改建议。

    输出必须是严格的 JSON 格式。
  `;

  // Prepare parts for request (text only now)
  const parts: any[] = [{ text: textPrompt }];

  const response = await ai.models.generateContent({
    model: modelName,
    contents: {
      role: 'user',
      parts: parts
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedSubjectArea: { type: Type.STRING, description: "分析得出的具体学科领域" },
          journals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                issn: { type: Type.STRING },
                publisher: { type: Type.STRING },
                impactFactor: { type: Type.NUMBER, description: "Estimated Impact Factor" },
                acceptanceRate: { type: Type.STRING, description: "e.g., '18%'" },
                reviewTime: { type: Type.STRING, description: "e.g., '6 weeks'" },
                isOA: { type: Type.BOOLEAN },
                matchScore: { type: Type.NUMBER, description: "0-100, scope relevance" },
                acceptanceProbability: { type: Type.NUMBER, description: "0-100, likelihood of acceptance" },
                matchReason: { type: Type.STRING, description: "中文解释为什么适合" },
                scope: { type: Type.STRING, description: "期刊范围简介(中文)" },
              },
              required: ["name", "publisher", "impactFactor", "matchScore", "acceptanceProbability", "matchReason"],
            },
          },
          detailedAnalysis: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "文章亮点" },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "不足之处" },
            },
            required: ["strengths", "weaknesses"]
          },
          suggestions: {
            type: Type.OBJECT,
            properties: {
              titleSuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              abstractKeywordsToInclude: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              generalAdvice: { type: Type.STRING, description: "综合投稿策略建议" },
            },
            required: ["titleSuggestions", "abstractKeywordsToInclude", "generalAdvice"]
          },
        },
        required: ["journals", "suggestions", "detectedSubjectArea", "detailedAnalysis"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI service");
  }

  try {
    return JSON.parse(response.text) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse analysis results.");
  }
};
