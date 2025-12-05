
export interface Journal {
  name: string;
  issn: string;
  publisher: string;
  impactFactor: number;
  acceptanceRate: string; // e.g., "15%"
  reviewTime: string; // e.g., "4-6 weeks"
  isOA: boolean;
  matchScore: number; // 0-100
  acceptanceProbability: number; // 0-100
  matchReason: string;
  scope: string;
}

export interface ImprovementSuggestions {
  titleSuggestions: string[];
  abstractKeywordsToInclude: string[];
  generalAdvice: string;
}

export interface DetailedAnalysis {
  strengths: string[];
  weaknesses: string[];
}

export interface AnalysisResult {
  detectedSubjectArea: string;
  journals: Journal[];
  suggestions: ImprovementSuggestions;
  detailedAnalysis: DetailedAnalysis;
}

export interface FormData {
  title: string;
  keywords: string;
  abstract: string;
  subjectArea: string;
  fullText: string; // Extracted text
  preferences: {
    openAccess: boolean;
    highImpact: boolean;
    fastReview: boolean;
  };
}

export enum SortOption {
  MATCH_SCORE = '匹配度',
  IMPACT_FACTOR = '影响因子',
  ACCEPTANCE_RATE = '录用概率', // Higher is better
  REVIEW_TIME = '审稿速度', // Lower is better
}
