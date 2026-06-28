"use client";
import Link from "next/link";
import { TrendingUp, Calendar, Clock, Video, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { markInterviewBooked } from "@/lib/storage";

const CALENDAR_URL = "https://calendar.google.com/";

const STEPS = [
  { step: "01", title: "日時を選択",       desc: "ご都合のよい日程を選んでください" },
  { step: "02", title: "情報を入力",       desc: "お名前・連絡先を入力してください" },
  { step: "03", title: "確認メール受信",   desc: "予約完了メールが届きます" },
  { step: "04", title: "面談当日",         desc: "Zoomでオンライン面談を実施します" },
];

export default function BookingPage() {
  function handleBooking() {
    const raw = sessionStorage.getItem("diagnosis_result");
    if (raw) {
      const { record } = JSON.parse(raw);
      if (record?.id) markInterviewBooked(record.id);
    }
    window.open(CALENDAR_URL, "_blank", "noopener,noreferrer");
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
        </div>
      </header>

      <div className="mx-auto max-w-screen-md px-4 pb-12 pt-8">
        {/* ヒーロー */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 p-6 text-center text-white">
          <Calendar className="mx-auto mb-3 h-10 w-10" />
          <h1 className="mb-2 text-xl font-black">無料転職相談を予約する</h1>
          <p className="text-sm text-blue-100">
            経験豊富なコンサルタントが
            <br />
            あなたの転職を徹底サポートします
          </p>
        </div>

        {/* 面談の特徴 */}
        <div className="mb-6 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: CheckCircle2, label: "完全無料" },
            { icon: Video,        label: "オンライン対応" },
            { icon: Clock,        label: "60分程度" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="rounded-xl bg-white p-3 shadow-sm">
              <Icon className="mx-auto mb-1 h-6 w-6 text-primary-600" />
              <p className="text-xs font-bold text-gray-700">{label}</p>
            </div>
          ))}
        </div>

        {/* 流れ */}
        <h2 className="mb-4 font-black text-gray-900">予約の流れ</h2>
        <div className="mb-8 space-y-3">
          {STEPS.map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-black text-white">
                {step}
              </div>
              <div>
                <p className="font-bold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 面談内容 */}
        <div className="mb-8 rounded-xl bg-primary-50 p-5">
          <h3 className="mb-3 font-black text-primary-900">面談でお伝えすること</h3>
          <ul className="space-y-2 text-sm text-primary-800">
            {[
              "診断結果の詳細解説",
              "あなたに合った求人の紹介",
              "転職活動のスケジュール提案",
              "年収交渉のポイント",
              "内定後のフォロー方法",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Button variant="primary" fullWidth size="lg" onClick={handleBooking} className="mb-4">
          <Calendar className="h-5 w-5" />
          無料相談を予約する
        </Button>

        <Link href="/line">
          <Button variant="outline" fullWidth size="md">
            まずLINEで相談してみる
          </Button>
        </Link>

        <p className="mt-4 text-center text-xs text-gray-400">
          ※ キャンセル・変更は24時間前まで可能です
        </p>
      </div>
    </div>
  );
}
