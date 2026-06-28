/**
 * app/api/line/webhook/route.ts
 *
 * LINE Webhookエンドポイント
 * - 友だち追加（follow）→ ウェルカムメッセージ送信
 * - テキストメッセージ（message）→ キーワード自動返信
 * - ブロック（unfollow）→ ログのみ（Supabase連携時にステータス更新）
 *
 * LINE Developersコンソールで以下を設定:
 *   Webhook URL: https://your-domain.com/api/line/webhook
 *   Use webhook: ON
 */

import { NextRequest, NextResponse } from "next/server";
import { verifySignature, replyMessage, getUserProfile } from "@/lib/line";
import {
  buildWelcomeMessages,
  buildKeywordReplyMessages,
} from "@/lib/lineMessages";
import type {
  LineWebhookBody,
  LineFollowEvent,
  LineMessageEvent,
} from "@/types/line";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ===== 署名検証 =====
  const signature = req.headers.get("x-line-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const rawBody = await req.text();

  try {
    const isValid = verifySignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } catch (err) {
    // LINE_CHANNEL_SECRET 未設定など
    console.error("[LINE Webhook] Signature verification error:", err);
    return NextResponse.json({ error: "Config error" }, { status: 500 });
  }

  // ===== イベント処理 =====
  let body: LineWebhookBody;
  try {
    body = JSON.parse(rawBody) as LineWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // イベントを並列処理（順序依存なし）
  await Promise.allSettled(body.events.map(handleEvent));

  // LINEプラットフォームには常に200を返す
  return NextResponse.json({ ok: true });
}

// ===== 個別イベントハンドラー =====
async function handleEvent(event: LineWebhookBody["events"][number]) {
  switch (event.type) {
    case "follow":
      await handleFollow(event as LineFollowEvent);
      break;

    case "unfollow":
      // ブロック時の処理（将来: SupabaseでlineRegistered = false に更新）
      console.log("[LINE] Unfollowed:", event.source.userId);
      break;

    case "message":
      await handleMessage(event as LineMessageEvent);
      break;

    default:
      // postback など: 今は無視
      break;
  }
}

// ===== 友だち追加 =====
async function handleFollow(event: LineFollowEvent) {
  const { userId } = event.source;
  const { replyToken } = event;

  try {
    // ユーザー名取得（失敗してもウェルカムは送る）
    let displayName = "ゲスト";
    try {
      const profile = await getUserProfile(userId);
      displayName = profile.displayName;
    } catch {
      console.warn("[LINE] Could not get profile for", userId);
    }

    const messages = buildWelcomeMessages(displayName);
    await replyMessage(replyToken, messages);

    console.log("[LINE] Welcome sent to", userId, displayName);

    /*
     * 将来: Supabase連携
     * await supabase.from("user_records")
     *   .update({ line_registered: true, line_user_id: userId })
     *   .eq("line_user_id", userId);
     *
     * または user_records を LINE userId で照合して更新
     */
  } catch (err) {
    console.error("[LINE] handleFollow error:", err);
  }
}

// ===== テキストメッセージ受信 =====
async function handleMessage(event: LineMessageEvent) {
  if (event.message.type !== "text") return;

  const { replyToken } = event;
  const text = event.message.text;

  const replies = buildKeywordReplyMessages(text);
  if (!replies) {
    // キーワード不一致 → デフォルト返信
    await replyMessage(replyToken, [
      {
        type: "text",
        text: "メッセージありがとうございます！\n担当者が確認次第ご返信いたします。\n\n転職相談はお気軽に 😊\n▶ 無料診断はこちら:\nhttps://career-lp.vercel.app/diagnosis",
      },
    ]);
    return;
  }

  await replyMessage(replyToken, replies);
}
