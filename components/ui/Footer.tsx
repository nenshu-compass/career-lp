import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 py-10">
      <div className="mx-auto max-w-screen-md px-4">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-gray-900">
            キャリア<span className="text-primary-600">UP</span>サポート
          </span>
        </div>
        <div className="mb-6 grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div className="space-y-2">
            <Link href="/" className="block hover:text-primary-600">ホーム</Link>
            <Link href="/diagnosis" className="block hover:text-primary-600">転職タイプ診断</Link>
            <Link href="/line" className="block hover:text-primary-600">LINE登録</Link>
          </div>
          <div className="space-y-2">
            <Link href="/booking" className="block hover:text-primary-600">無料相談予約</Link>
            <Link href="/admin" className="block hover:text-primary-600">管理画面</Link>
            <a href="#" className="block hover:text-primary-600">プライバシーポリシー</a>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400">
          © 2024 キャリアUPサポート All rights reserved.
        </p>
      </div>
    </footer>
  );
}
