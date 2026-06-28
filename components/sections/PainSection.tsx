import { AlertCircle } from "lucide-react";

const PAINS = [
  "今の会社でこのまま働き続けていいのか不安…",
  "年収が上がらないけど転職できるか自信がない",
  "何の仕事が向いているか全くわからない",
  "転職活動の進め方がわからず一歩踏み出せない",
  "求人が多すぎてどれを選べばいいかわからない",
];

export default function PainSection() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="mx-auto max-w-screen-md px-4">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-primary-600">
          こんなお悩みありませんか？
        </p>
        <h2 className="section-title mb-8 text-center">
          転職を考えているけど
          <br />
          <span className="text-primary-600">何から始めればいい？</span>
        </h2>

        <div className="space-y-3">
          {PAINS.map((pain) => (
            <div
              key={pain}
              className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <p className="text-sm font-medium text-gray-700">{pain}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-primary-600 p-6 text-center text-white">
          <p className="text-sm font-bold leading-relaxed">
            そのお悩み、<strong className="text-yellow-300">10問の診断</strong>で
            <br />
            解決の糸口が見つかります！
          </p>
        </div>
      </div>
    </section>
  );
}
