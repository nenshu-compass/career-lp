import { Metadata } from "next";
import DiagnosisForm from "@/components/diagnosis/DiagnosisForm";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "転職タイプ診断 | キャリアUPサポート",
};

export default function DiagnosisPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ミニヘッダー */}
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
          <span className="text-xs text-gray-400">無料診断</span>
        </div>
      </header>

      {/* タイトル */}
      <div className="bg-white pb-4 pt-6 text-center shadow-sm">
        <h1 className="text-lg font-black text-gray-900">転職タイプ診断</h1>
        <p className="mt-1 text-xs text-gray-500">10問に答えて、あなたの転職タイプを確認しよう</p>
      </div>

      <DiagnosisForm />
    </div>
  );
}
