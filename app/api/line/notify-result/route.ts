export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * app/api/line/notify-result/route.ts
 *
 * 診断完了時に呼び出すAPI
 * フロントエンドの DiagnosisForm から POST して
 * 診断結果 Flex Message を LINE Push で送信する
 *
 * Request body:
 *   NotifyResultPayload (types/line.ts 参照)
 *
 * 使い方（クライアント側）:
 *   await fetch("/api/line/notify-result", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(payload),
 *   });
 */

import { NextRequest, NextResponse } from "next/server";
import { pushMessage } from "@/lib/line";
import { buildDiagnosisResultMessages } from "@/lib/lineMessages";
import type { NotifyResultPayload } from "@/types/line";

const getBase = () =>
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://career-lp-ps5y.vercel.app";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ===== 簡易APIキー認証（内部呼び出し用） =====
  const apiKey = req.headers.get("x-internal-api-key");
  if (
    process.env.INTERNAL_API_KEY &&
    apiKey !== process.env.INTERNAL_API_KEY
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: NotifyResultPayload;
  try {
    payload = (await req.json()) as NotifyResultPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // バリデーション
  if (!payload.userId || !payload.typeName) {
    return NextResponse.json(
      { error: "userId and typeName are required" },
      { status: 422 }
    );
  }

  // bookingUrl のフォールバック
  if (!payload.bookingUrl) {
    payload.bookingUrl = `${getBase()}/booking`;
  }

  try {
    const messages = buildDiagnosisResultMessages(payload);
    await pushMessage(payload.userId, messages);

    console.log("[LINE] Diagnosis result sent to", payload.userId);
    return NextResponse.json({ ok: true, sentTo: payload.userId });
  } catch (err) {
    console.error("[LINE] notify-result error:", err);
    return NextResponse.json(
      { error: "Failed to send LINE message", detail: String(err) },
      { status: 500 }
    );
  }
}
