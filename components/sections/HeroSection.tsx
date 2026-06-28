import Link from "next/link";
import { ArrowRight, Star, Users, TrendingUp } from "lucide-react";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="gradient-bg relative overflow-hidden pb-16 pt-24">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5" />
      </div>

      <div className="relative mx-auto max-w-screen-md px-4 text-center">
        {/* バッジ */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
          累計5,000名以上が転職成功
        </div>

        <h1 className="mb-4 text-3xl font-black leading-tight text-white md:text-4xl">
          10問の診断で
          <br />
          <span className="text-yellow-300">あなたの転職タイプ</span>
          <br />
          がわかる
        </h1>

        <p className="mb-8 text-sm leading-relaxed text-blue-100">
          現在の状況・適性・志向を分析して
          <br />
          最適な職種と<strong className="text-white">想定年収アップ幅</strong>をお伝えします
        </p>

        <Link href="/diagnosis">
          <Button size="lg" variant="accent" className="w-full max-w-xs text-lg shadow-2xl">
            無料で診断スタート
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>

        <p className="mt-3 text-xs text-blue-200">所要時間：約2分 ／ 登録不要</p>

        {/* 実績数値 */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { icon: Users,     value: "5,000+", label: "転職支援実績" },
            { icon: TrendingUp,value: "92%",    label: "内定獲得率"  },
            { icon: Star,      value: "4.8",    label: "利用者満足度" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
              <Icon className="mx-auto mb-1 h-5 w-5 text-yellow-300" />
              <div className="text-xl font-black text-white">{value}</div>
              <div className="text-[10px] text-blue-200">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
