/**
 * app/api/line/send/route.ts
 *
 * 汎用メッセージ送信API（管理画面から手動送信など）
 *
 * Request body:
 *   {
 *     to: string           // LINE userId
 *     messages: LineMessage[]
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { pushMessage } from "@/lib/line";
import type { LineMessage } from "@/types/line";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 内部APIキー認証
  const apiKey = req.headers.get("x-internal-api-key");
  if (
    process.env.INTERNAL_API_KEY &&
    apiKey !== process.env.INTERNAL_API_KEY
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { to: string; messages: LineMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.to || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json(
      { error: "to and messages[] are required" },
      { status: 422 }
    );
  }

  if (body.messages.length > 5) {
    return NextResponse.json(
      { error: "Max 5 messages per request" },
      { status: 422 }
    );
  }

  try {
    const result = await pushMessage(body.to, body.messages);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("[LINE] send error:", err);
    return NextResponse.json(
      { error: "Failed to send", detail: String(err) },
      { status: 500 }
    );
  }
}
