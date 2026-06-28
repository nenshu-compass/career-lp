import type { DiagnosisAnswers, DiagnosisScores, DiagnosisResult, DiagnosisType, Question } from "@/types";

// ===== 診断質問定義 =====
export const QUESTIONS: Question[] = [
  {
    id: "name",
    question: "あなたのお名前を教えてください",
    type: "text",
    options: [],
  },
  {
    id: "age",
    question: "現在の年齢を教えてください",
    type: "select",
    options: [
      { label: "20〜24歳", value: "20-24", score: { speed_score: 3, challenge_score: 2 } },
      { label: "25〜29歳", value: "25-29", score: { speed_score: 3, challenge_score: 3 } },
      { label: "30〜34歳", value: "30-34", score: { stability_score: 2, income_score: 2 } },
      { label: "35〜39歳", value: "35-39", score: { stability_score: 3, income_score: 3 } },
    ],
  },
  {
    id: "currentIncome",
    question: "現在の年収はいくらですか？",
    type: "select",
    options: [
      { label: "250万円未満", value: "under250", score: { income_score: 4, challenge_score: 2 } },
      { label: "250〜350万円", value: "250-350", score: { income_score: 3, stability_score: 1 } },
      { label: "350〜450万円", value: "350-450", score: { income_score: 2, stability_score: 2 } },
      { label: "450〜600万円", value: "450-600", score: { stability_score: 3, income_score: 1 } },
      { label: "600万円以上", value: "over600", score: { stability_score: 4 } },
    ],
  },
  {
    id: "currentJob",
    question: "現在の職種を教えてください",
    type: "select",
    options: [
      { label: "営業職", value: "sales", score: { sales_score: 4, communication_score: 3 } },
      { label: "販売・接客", value: "retail", score: { communication_score: 4, sales_score: 2 } },
      { label: "IT・エンジニア", value: "it", score: { stability_score: 3, challenge_score: 2 } },
      { label: "事務・バックオフィス", value: "office", score: { stability_score: 4 } },
      { label: "建設・施工", value: "construction", score: { stability_score: 3, income_score: 2 } },
      { label: "製造・物流", value: "manufacturing", score: { stability_score: 2, challenge_score: 1 } },
      { label: "飲食・サービス", value: "food", score: { communication_score: 3, challenge_score: 1 } },
      { label: "その他", value: "other", score: { challenge_score: 1 } },
    ],
  },
  {
    id: "desiredCondition",
    question: "転職で最も重視することは？",
    type: "select",
    options: [
      { label: "年収アップ", value: "income", score: { income_score: 4, sales_score: 2 } },
      { label: "安定・長期雇用", value: "stability", score: { stability_score: 4 } },
      { label: "やりがい・成長", value: "growth", score: { challenge_score: 4, sales_score: 2 } },
      { label: "ワークライフバランス", value: "balance", score: { stability_score: 3 } },
      { label: "スキルアップ", value: "skill", score: { challenge_score: 3, stability_score: 2 } },
    ],
  },
  {
    id: "interpersonal",
    question: "人と関わる仕事は得意ですか？",
    type: "select",
    options: [
      { label: "とても得意・好き", value: "very_good", score: { sales_score: 4, communication_score: 4 } },
      { label: "まあ得意", value: "good", score: { sales_score: 2, communication_score: 3 } },
      { label: "どちらでもない", value: "neutral", score: { stability_score: 1 } },
      { label: "あまり得意でない", value: "not_good", score: { stability_score: 3 } },
      { label: "苦手", value: "bad", score: { stability_score: 4 } },
    ],
  },
  {
    id: "incomeMotivation",
    question: "お金を稼ぐことへのモチベーションは？",
    type: "select",
    options: [
      { label: "とても高い・バリバリ稼ぎたい", value: "very_high", score: { income_score: 4, sales_score: 3 } },
      { label: "高い・年収はかなり重要", value: "high", score: { income_score: 3, sales_score: 2 } },
      { label: "普通・生活できれば十分", value: "normal", score: { stability_score: 2 } },
      { label: "低い・仕事内容が大事", value: "low", score: { stability_score: 3, challenge_score: 2 } },
    ],
  },
  {
    id: "challengeMotivation",
    question: "新しいことへの挑戦意欲は？",
    type: "select",
    options: [
      { label: "とても高い・常に挑戦したい", value: "very_high", score: { challenge_score: 4, speed_score: 3 } },
      { label: "高い・成長したい", value: "high", score: { challenge_score: 3, speed_score: 2 } },
      { label: "普通", value: "normal", score: { stability_score: 1 } },
      { label: "低い・安定が大事", value: "low", score: { stability_score: 4 } },
    ],
  },
  {
    id: "preferredLocation",
    question: "希望の勤務地はどこですか？",
    type: "select",
    options: [
      { label: "東京・首都圏", value: "tokyo", score: { income_score: 2, sales_score: 1 } },
      { label: "大阪・関西", value: "osaka", score: { income_score: 1 } },
      { label: "名古屋・東海", value: "nagoya", score: { stability_score: 1 } },
      { label: "福岡・九州", value: "fukuoka", score: { stability_score: 1 } },
      { label: "その他地方", value: "other", score: { stability_score: 2 } },
      { label: "リモート・場所を問わない", value: "remote", score: { challenge_score: 2, stability_score: 1 } },
    ],
  },
  {
    id: "transferTiming",
    question: "転職はいつ頃を考えていますか？",
    type: "select",
    options: [
      { label: "すぐにでも（1ヶ月以内）", value: "immediate", score: { speed_score: 4, challenge_score: 2 } },
      { label: "3ヶ月以内", value: "3months", score: { speed_score: 3 } },
      { label: "半年以内", value: "6months", score: { speed_score: 2, stability_score: 1 } },
      { label: "1年以内", value: "1year", score: { stability_score: 2 } },
      { label: "じっくり検討したい", value: "no_rush", score: { stability_score: 3 } },
    ],
  },
];

// ===== スコア計算 =====
export function calcScores(answers: DiagnosisAnswers): DiagnosisScores {
  const scores: DiagnosisScores = {
    sales_score: 0,
    challenge_score: 0,
    income_score: 0,
    stability_score: 0,
    communication_score: 0,
    speed_score: 0,
  };

  QUESTIONS.forEach((q) => {
    if (q.type === "text") return;
    const answer = answers[q.id];
    const option = q.options.find((o) => o.value === answer);
    if (option?.score) {
      Object.entries(option.score).forEach(([key, val]) => {
        scores[key as keyof DiagnosisScores] += val;
      });
    }
  });

  // 正規化 (0〜100)
  const max = { sales_score: 14, challenge_score: 14, income_score: 14, stability_score: 18, communication_score: 7, speed_score: 9 };
  (Object.keys(scores) as (keyof DiagnosisScores)[]).forEach((key) => {
    scores[key] = Math.min(100, Math.round((scores[key] / max[key]) * 100));
  });

  return scores;
}

// ===== 診断タイプ判定 =====
export function determineDiagnosisType(scores: DiagnosisScores): DiagnosisType {
  const { sales_score, challenge_score, income_score, stability_score, communication_score } = scores;

  // 営業＋収入意欲が高い
  if (sales_score >= 50 && income_score >= 50) return "sales_income";
  // コミュニケーション高い＋販売系
  if (communication_score >= 50 && sales_score >= 30) return "sales_experience";
  // 安定志向
  if (stability_score >= 50 && challenge_score < 40) return "it_office_stable";
  // 挑戦意欲
  if (challenge_score >= 40) return "construction_skilled";
  // デフォルト
  return "it_office_stable";
}

// ===== 診断結果生成 =====
const TYPE_DATA: Record<DiagnosisType, Omit<DiagnosisResult, "scores">> = {
  sales_income: {
    type: "sales_income",
    typeName: "営業職で年収アップタイプ",
    recommendedJobs: ["法人営業", "不動産営業", "保険営業", "IT営業", "人材営業"],
    incomeUpRange: "+80〜200万円",
    successRate: 87,
    advice:
      "あなたのコミュニケーション力と稼ぐ意欲は転職市場でも高く評価されます。インセンティブ制度が充実した企業への転職で、一気に年収100万円超のアップも狙えます。まずは無料相談で具体的な求人を確認しましょう。",
  },
  construction_skilled: {
    type: "construction_skilled",
    typeName: "施工管理で手に職タイプ",
    recommendedJobs: ["施工管理", "現場監督", "建設コンサルタント", "CADオペレーター", "設備管理"],
    incomeUpRange: "+50〜150万円",
    successRate: 82,
    advice:
      "手に職をつけながら安定した収入を得たいあなたに、施工管理職は最適です。資格取得サポートがある企業も多く、キャリアアップも計画しやすい職種です。経験者が不足しており求人も豊富です。",
  },
  it_office_stable: {
    type: "it_office_stable",
    typeName: "IT・事務で安定キャリアタイプ",
    recommendedJobs: ["事務職", "経理・財務", "ITサポート", "データ入力", "営業事務"],
    incomeUpRange: "+30〜80万円",
    successRate: 79,
    advice:
      "安定したキャリアを築きたいあなたに、IT・事務職は長期的に活躍できる分野です。リモートワーク可能な求人も多く、ワークライフバランスを整えながら着実に年収アップを目指せます。",
  },
  sales_experience: {
    type: "sales_experience",
    typeName: "販売・接客経験活用タイプ",
    recommendedJobs: ["店舗マネージャー", "バイヤー", "カスタマーサクセス", "ECコーディネーター", "ブランドスタッフ"],
    incomeUpRange: "+40〜100万円",
    successRate: 84,
    advice:
      "接客・販売で培ったホスピタリティとコミュニケーション力は、幅広い業界で活かせます。マネジメント職や専門職へのキャリアアップで、大きな年収アップが狙えるポジションが多数あります。",
  },
};

export function generateResult(answers: DiagnosisAnswers): DiagnosisResult {
  const scores = calcScores(answers);
  const type = determineDiagnosisType(scores);
  return { ...TYPE_DATA[type], scores };
}

// ===== 温度感スコア計算 =====
export function calcHeatScore(answers: DiagnosisAnswers, scores: DiagnosisScores): number {
  let heat = 50;
  if (answers.transferTiming === "immediate") heat += 30;
  else if (answers.transferTiming === "3months") heat += 20;
  else if (answers.transferTiming === "6months") heat += 10;

  if (answers.incomeMotivation === "very_high") heat += 10;
  if (scores.speed_score > 60) heat += 10;

  return Math.min(100, heat);
}
