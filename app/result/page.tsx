"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DiagnosisResult, UserRecord } from "@/types";
import ResultDisplay from "@/components/result/ResultDisplay";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<{ result: DiagnosisResult; record: UserRecord } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("diagnosis_result");
    if (!raw) {
      router.push("/diagnosis");
      return;
    }
    setData(JSON.parse(raw));
  }, [router]);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-gray-500">診断結果を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-screen-md items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-black text-gray-900">
              キャリア<span className="text-primary-600">UP</span>サポート
            </span>
          </Link>
          <span className="text-xs text-gray-400">診断結果</span>
        </div>
      </header>

      <div className="bg-white pb-4 pt-6 text-center shadow-sm">
        <h1 className="text-lg font-black text-gray-900">🎉 診断完了！</h1>
        <p className="mt-1 text-xs text-gray-500">あなたの転職タイプが判明しました</p>
      </div>

      <ResultDisplay result={data.result} record={data.record} />
    </div>
  );
}
