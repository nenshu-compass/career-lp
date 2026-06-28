import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, Settings } from "lucide-react";
import AdminTable from "@/components/admin/AdminTable";

export const metadata: Metadata = {
  title: "管理画面 | キャリアUPサポート",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-screen-lg items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-black text-gray-900">
              キャリア<span className="text-primary-600">UP</span>
              <span className="ml-2 text-xs font-medium text-gray-400">管理画面</span>
            </span>
          </Link>
          <Settings className="h-5 w-5 text-gray-400" />
        </div>
      </header>

      <div className="mx-auto max-w-screen-lg px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-black text-gray-900">診断回答者一覧</h1>
          <p className="mt-1 text-xs text-gray-500">
            ※ 現在はLocalStorageによるローカル保存。将来的にSupabase連携予定。
          </p>
        </div>

        <AdminTable />

        {/* 将来実装メモ */}
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-5">
          <h3 className="mb-3 text-sm font-black text-gray-500">🔮 今後の実装予定</h3>
          <ul className="space-y-1.5 text-xs text-gray-400">
            <li>✦ Supabase接続によるデータ永続化</li>
            <li>✦ OpenAI APIを使った個別診断コメント自動生成</li>
            <li>✦ LINE Messaging APIによる自動フォローアップメッセージ</li>
            <li>✦ CSVエクスポート機能</li>
            <li>✦ 転職意欲スコアの時系列グラフ</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
