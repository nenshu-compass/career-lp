// ===== 診断回答の型 =====
export interface DiagnosisAnswers {
  // Q1: 名前
  name: string;
  // Q2: 年齢
  age: string;
  // Q3: 現在年収
  currentIncome: string;
  // Q4: 現在職種
  currentJob: string;
  // Q5: 希望条件
  desiredCondition: string;
  // Q6: 対人適性
  interpersonal: string;
  // Q7: 稼ぎたい意欲
  incomeMotivation: string;
  // Q8: 挑戦意欲
  challengeMotivation: string;
  // Q9: 希望勤務地
  preferredLocation: string;
  // Q10: 転職時期
  transferTiming: string;
}

// ===== スコアの型 =====
export interface DiagnosisScores {
  sales_score: number;
  challenge_score: number;
  income_score: number;
  stability_score: number;
  communication_score: number;
  speed_score: number;
}

// ===== 診断タイプ =====
export type DiagnosisType =
  | "sales_income"
  | "construction_skilled"
  | "it_office_stable"
  | "sales_experience";

// ===== 診断結果の型 =====
export interface DiagnosisResult {
  type: DiagnosisType;
  typeName: string;
  recommendedJobs: string[];
  incomeUpRange: string;
  successRate: number;
  advice: string;
  scores: DiagnosisScores;
}

// ===== ユーザーレコード（管理画面用）=====
export interface UserRecord {
  id: string;
  name: string;
  age: string;
  currentJob: string;
  currentIncome: string;
  preferredLocation: string;
  transferTiming: string;
  diagnosisType: DiagnosisType;
  typeName: string;
  heatScore: number;        // 温度感スコア 1〜100
  lineRegistered: boolean;
  interviewBooked: boolean;
  createdAt: string;
  answers: DiagnosisAnswers;
  scores: DiagnosisScores;
}

// ===== 診断質問の型 =====
export interface Question {
  id: keyof DiagnosisAnswers;
  question: string;
  options: { label: string; value: string; score?: Record<string, number> }[];
  type: "select" | "text";
}
