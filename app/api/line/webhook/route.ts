/**
 * app/api/line/webhook/route.ts
 * LINE Webhook受信エンドポイント
 */

// API Routeは常にDynamic（static generationしない）
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
  const signature = req.headers.get("x-line-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const rawBody = await req.text();

  try {
    const isValid = await verifySignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } catch (err) {
    console.error("[LINE Webhook] Signature verification error:", err);
    return NextResponse.json({ error: "Config error" }, { status: 500 });
  }

  let body: LineWebhookBody;
  try {
    body = JSON.parse(rawBody) as LineWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  await Promise.allSettled(body.events.map(handleEvent));

  return NextResponse.json({ ok: true });
}

async function handleEvent(event: LineWebhookBody["events"][number]) {
  switch (event.type) {
    case "follow":
      await handleFollow(event as LineFollowEvent);
      break;
    case "unfollow":
      console.log("[LINE] Unfollowed:", event.source.userId);
      break;
    case "message":
      await handleMessage(event as LineMessageEvent);
      break;
    default:
      break;
  }
}

async function handleFollow(event: LineFollowEvent) {
  const { userId } = event.source;
  const { replyToken } = event;

  try {
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
  } catch (err) {
    console.error("[LINE] handleFollow error:", err);
  }
}

async function handleMessage(event: LineMessageEvent) {
  if (event.message.type !== "text") return;

  const { replyToken } = event;
  const text = event.message.text;

  const replies = buildKeywordReplyMessages(text);
  if (!replies) {
    await replyMessage(replyToken, [
      {
        type: "text",
        text: "メッセージありがとうございます！\n担当者が確認次第ご返信いたします。\n\n転職相談はお気軽に 😊\n▶ 無料診断はこちら:\nhttps://career-lp-ps5y.vercel.app/diagnosis",
      },
    ]);
    return;
  }

  await replyMessage(replyToken, replies);
}
