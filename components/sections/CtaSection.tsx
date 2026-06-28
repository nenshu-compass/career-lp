import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CtaSection() {
  return (
    <section className="gradient-bg py-14">
      <div className="mx-auto max-w-screen-md px-4 text-center">
        <h2 className="mb-3 text-2xl font-black text-white">
          まずは無料診断で
          <br />
          あなたの転職タイプを確認
        </h2>
        <p className="mb-8 text-sm text-blue-100">
          所要2分・登録不要・完全無料
        </p>

        <Link href="/diagnosis" className="block">
          <Button size="lg" variant="accent" fullWidth className="mb-4 max-w-sm mx-auto">
            無料診断スタート
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>

        <Link href="/booking" className="block">
          <Button size="md" variant="outline" fullWidth className="max-w-sm mx-auto border-white text-white hover:bg-white/10">
            <MessageCircle className="h-5 w-5" />
            まず相談してみる
          </Button>
        </Link>
      </div>
    </section>
  );
}
