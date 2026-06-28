import { Star } from "lucide-react";

const VOICES = [
  {
    name: "Kさん（27歳・元販売職）",
    result: "→ 法人営業に転職",
    income: "年収 +120万円",
    comment:
      "診断で営業職向きとわかり、思い切って挑戦。最初は不安でしたが担当者に細かくサポートしてもらえました。",
  },
  {
    name: "Mさん（32歳・元製造業）",
    result: "→ 施工管理に転職",
    income: "年収 +90万円",
    comment:
      "手に職をつけたかったので施工管理の提案は目からうろこでした。資格取得も支援してもらえています。",
  },
  {
    name: "Tさん（25歳・元飲食店スタッフ）",
    result: "→ IT事務に転職",
    income: "年収 +65万円",
    comment:
      "リモートワークができる仕事に就きたくて相談。IT事務という選択肢があることを知らなくて驚きました。",
  },
];

export default function AchievementsSection() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="mx-auto max-w-screen-md px-4">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-primary-600">
          転職成功事例
        </p>
        <h2 className="section-title mb-8 text-center">
          みんなの
          <span className="text-primary-600">転職成功</span>
          ストーリー
        </h2>

        <div className="space-y-4">
          {VOICES.map((v) => (
            <div key={v.name} className="card">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-gray-500">{v.name}</p>
                  <p className="text-sm font-bold text-gray-900">{v.result}</p>
                </div>
                <span className="shrink-0 rounded-full bg-accent-50 px-3 py-1 text-xs font-black text-accent-600">
                  {v.income}
                </span>
              </div>
              <div className="mb-2 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{v.comment}</p>
            </div>
          ))}
        </div>

        {/* 数値実績 */}
        <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl bg-primary-600 p-5 text-center text-white">
          {[
            { value: "5,000+", label: "支援実績" },
            { value: "92%",    label: "内定獲得率" },
            { value: "平均45日",label: "内定まで" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-black text-yellow-300">{value}</div>
              <div className="text-[10px] text-blue-200">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
