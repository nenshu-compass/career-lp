"use client";
import { useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Bell, Gift, MessageCircle, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { markLineRegistered } from "@/lib/storage";

const LINE_URL = "https://lin.ee/xxxxxxxx";

const BENEFITS = [
  { icon: Bell,          title: "非公開求人情報",     desc: "一般には公開されていない限定求人をLINEで優先お届け" },
  { icon: Gift,          title: "転職成功事例レポート", desc: "業界別・年代別の転職成功事例をまとめたPDFをプレゼント" },
  { icon: MessageCircle, title: "担当者と気軽に相談",  desc: "LINEで担当コンサルタントに直接メッセージできます" },
];

export default function LinePage() {
  // LINE登録後に戻った場合にフラグを更新（将来的にはWebhookで自動化）
  useEffect(() => {
    const raw = sessionStorage.getItem("diagnosis_result");
    if (raw) {
      const { record } = JSON.parse(raw);
      if (record?.id) {
        markLineRegistered(record.id);
      }
    }
  }, []);

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
        </div>
      </header>

      <div className="mx-auto max-w-screen-md px-4 pb-12 pt-8">
        {/* ヒーロー */}
        <div className="mb-8 rounded-2xl p-6 text-center text-white" style={{ backgroundColor: "#06C755" }}>
          <div className="mb-3 text-5xl">💬</div>
          <h1 className="mb-2 text-xl font-black">LINE登録で求人情報を受け取る</h1>
          <p className="text-sm text-green-100">
            登録者限定の非公開求人・転職ノウハウを
            <br />
            LINEでお届けします
          </p>
        </div>

        {/* 特典 */}
        <h2 className="mb-4 text-center font-black text-gray-900">
          LINE登録の<span className="text-primary-600">3つのメリット</span>
        </h2>
        <div className="mb-8 space-y-3">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                <Icon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{title}</p>
                <p className="text-xs leading-relaxed text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a href={LINE_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="line" fullWidth size="lg" className="mb-4">
            <svg viewBox="0 0 50 50" className="h-6 w-6 fill-white">
              <path d="M25 2C12.3 2 2 10.4 2 20.8c0 7.2 4.7 13.5 11.8 17.1-.5 1.8-1.8 6.6-2.1 7.6-.3 1.3.5 1.3 1 1 .4-.2 6.5-4.3 9.2-6.1.7.1 1.4.1 2.1.1 12.7 0 23-8.4 23-18.7C48 10.4 37.7 2 25 2z" />
            </svg>
            LINEで友だち追加する
          </Button>
        </a>

        <a href="https://timerex.net/s/dajietianbian357_782c/1c65b0da" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" fullWidth size="md">
            面談予約に進む
            <ArrowRight className="h-4 w-4" />
          </Button>
        </a>

        <p className="mt-4 text-center text-xs text-gray-400">
          ※ いつでも友だちを解除できます
        </p>
      </div>
    </div>
  );
}
