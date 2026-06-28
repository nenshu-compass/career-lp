"use client";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-md items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-black text-gray-900">
            キャリア<span className="text-primary-600">UP</span>サポート
          </span>
        </Link>
        <Link href="/diagnosis">
          <Button size="sm" variant="primary">
            無料診断スタート
          </Button>
        </Link>
      </div>
    </header>
  );
}
