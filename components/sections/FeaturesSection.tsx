import { Briefcase, TrendingUp, Target, MessageCircle } from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    title: "転職タイプ診断",
    desc: "4つのタイプから、あなたに最も合った転職スタイルを特定します",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: TrendingUp,
    title: "想定年収アップ幅",
    desc: "転職で実現可能な年収増加レンジを具体的な数字でお伝えします",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Briefcase,
    title: "おすすめ職種",
    desc: "あなたの経験・スキル・適性に合った具体的な求人職種を提案します",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: MessageCircle,
    title: "転職アドバイス",
    desc: "あなたの状況に応じた具体的な転職活動のアドバイスをお届けします",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-screen-md px-4">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-primary-600">
          診断でわかること
        </p>
        <h2 className="section-title mb-8 text-center">
          診断結果で
          <span className="text-primary-600">4つのこと</span>
          がわかる
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="card">
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="mb-2 text-sm font-bold text-gray-900">{title}</h3>
              <p className="text-xs leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
