import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "あなたの転職タイプ診断 | キャリアアップ転職サポート",
  description:
    "10問の診断で、あなたに最適な転職先・想定年収アップ幅がわかります。20代・30代向け転職サポート。無料相談受付中。",
  openGraph: {
    title: "あなたの転職タイプ診断",
    description: "10問の診断で最適な転職先がわかる。無料相談受付中。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
