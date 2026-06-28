"use client";
import Link from "next/link";
import { ArrowRight, Briefcase, TrendingUp, CheckCircle2, MessageSquare } from "lucide-react";
import type { DiagnosisResult, UserRecord } from "@/types";
import ScoreChart from "@/components/ui/ScoreChart";
import Button from "@/components/ui/Button";

const TYPE_EMOJI: Record<string, string> = {
  sales_income:         "💼",
  construction_skilled: "🏗️",
  it_office_stable:     "💻",
  sales_experience:     "🛍️",
};

const TYPE_COLOR: Record<string, string> = {
  sales_income:         "from-blue-600 to-blue-400",
  construction_skilled: "from-orange-600 to-orange-400",
  it_office_stable:     "from-green-600 to-green-400",
  sales_experience:     "from-purple-600 to-purple-400",
};

interface ResultDisplayProps {
  result: DiagnosisResult;
  record: UserRecord;
}

export default function ResultDisplay({ result, record }: ResultDisplayProps) {
  const emoji = TYPE_EMOJI[result.type] ?? "✨";
  const gradient = TYPE_COLOR[result.type] ?? "from-blue-600 to-blue-400";

  return (
    <div className="mx-auto max-w-screen-md px-4 pb-12 pt-6">
      {/* タイプ発表 */}
      <div className={`mb-6 rounded-2xl bg-gradient-to-br ${gradient} p-6 text-center text-white`}>
        <p className="mb-1 text-sm font-bold opacity-80">あなたの転職タイプは</p>
        <div className="mb-2 text-5xl">{emoji}</div>
        <h1 className="text-xl font-black leading-tight">{result.typeName}</h1>
      </div>

      {/* おすすめ職種 */}
      <div className="card mb-4">
        <div className="mb-3 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary-600" />
          <h2 className="font-black text-gray-900">おすすめ職種</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.recommendedJobs.map((job) => (
            <span
              key={job}
              className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700"
            >
              {job}
            </span>
          ))}
        </div>
      </div>

      {/* 年収・成功率 */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="card text-center">
          <TrendingUp className="mx-auto mb-2 h-6 w-6 text-accent-500" />
          <p className="text-xs text-gray-500">想定年収アップ</p>
          <p className="text-xl font-black text-accent-600">{result.incomeUpRange}</p>
        </div>
        <div className="card text-center">
          <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-primary-500" />
          <p className="text-xs text-gray-500">転職成功可能性</p>
          <p className="text-xl font-black text-primary-600">{result.successRate}%</p>
        </div>
      </div>

      {/* スコアチャート */}
      <div className="card mb-4">
        <h2 className="mb-4 font-black text-gray-900">あなたの適性スコア</h2>
        <ScoreChart scores={result.scores} />
      </div>

      {/* アドバイス */}
      <div className="card mb-6 border-l-4 border-primary-500">
        <div className="mb-2 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary-600" />
          <h2 className="font-black text-gray-900">転職アドバイス</h2>
        </div>
        <p className="text-sm leading-relaxed text-gray-700">{result.advice}</p>
      </div>

      {/* CTA */}
      <div className="space-y-3">
        <Link href="/line">
          <Button variant="line" fullWidth size="lg">
            <svg viewBox="0 0 50 50" className="h-6 w-6 fill-white">
              <path d="M25 2C12.3 2 2 10.4 2 20.8c0 7.2 4.7 13.5 11.8 17.1-.5 1.8-1.8 6.6-2.1 7.6-.3 1.3.5 1.3 1 1 .4-.2 6.5-4.3 9.2-6.1.7.1 1.4.1 2.1.1 12.7 0 23-8.4 23-18.7C48 10.4 37.7 2 25 2z" />
            </svg>
            LINE登録で詳細情報を受け取る
          </Button>
        </Link>
        <Link href="/booking">
          <Button variant="primary" fullWidth size="lg">
            無料相談を予約する
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" fullWidth size="md" className="text-gray-400">
            トップに戻る
          </Button>
        </Link>
      </div>
    </div>
  );
}
