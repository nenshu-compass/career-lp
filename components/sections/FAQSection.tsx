"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "診断は本当に無料ですか？",
    a: "はい、完全無料です。診断後の面談相談も無料で承っております。費用は一切かかりません。",
  },
  {
    q: "診断結果は正確ですか？",
    a: "10問の回答をもとに6つのスコアを算出し、最適なタイプを判定します。あくまで参考情報ですが、多くの方に「自分に合っている」とご好評いただいています。",
  },
  {
    q: "転職するかどうか迷っています",
    a: "転職を迷っている段階でのご相談も大歓迎です。現在の状況を整理するだけでも、次のステップが見えてきます。まずはお気軽にどうぞ。",
  },
  {
    q: "個人情報はどのように扱われますか？",
    a: "ご入力いただいた情報は転職サポートの目的以外には使用しません。第三者への提供は行いません。プライバシーポリシーをご確認ください。",
  },
  {
    q: "どんな業界・職種でも対応できますか？",
    a: "営業・施工管理・IT・事務・販売など幅広い業界に対応しています。現職を問わずご相談いただけます。",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-14">
      <div className="mx-auto max-w-screen-md px-4">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-primary-600">
          FAQ
        </p>
        <h2 className="section-title mb-8 text-center">よくある質問</h2>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="pr-4 text-sm font-bold text-gray-900">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="border-t border-gray-100 px-4 py-3">
                  <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
