/**
 * lib/line.ts
 * LINE Messaging API クライアント
 * 環境変数は関数呼び出し時のみ参照（ビルド時は参照しない）
 */

import type {
  LineMessage,
  LinePushMessageRequest,
  LineReplyMessageRequest,
  LineApiResponse,
} from "@/types/line";

const LINE_API_BASE = "https://api.line.me/v2/bot";

// ===== 環境変数ヘルパー（呼び出し時のみ評価） =====
function getChannelAccessToken(): string {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");
  return token;
}

function getChannelSecret(): string {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret) throw new Error("LINE_CHANNEL_SECRET is not set");
  return secret;
}

// ===== 共通フェッチ =====
async function lineApiFetch<T = LineApiResponse>(
  path: string,
  body: unknown
): Promise<T> {
  const res = await fetch(`${LINE_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getChannelAccessToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LINE API error [${res.status}]: ${err}`);
  }

  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}

// ===== 署名検証（crypto は動的 import で実行時のみロード） =====
export async function verifySignature(
  rawBody: string,
  signature: string
): Promise<boolean> {
  const secret = getChannelSecret();
  // Node.js 組み込み crypto — npm install 後 @types/node で型解決される
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cryptoMod = await import("crypto" as any);
  const hash = cryptoMod.createHmac("sha256", secret).update(rawBody).digest("base64");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return cryptoMod.timingSafeEqual(Buffer.from(hash) as any, Buffer.from(signature) as any);
}

// ===== メッセージ送信 =====

/** Push メッセージ */
export async function pushMessage(
  to: string,
  messages: LineMessage[]
): Promise<LineApiResponse> {
  const payload: LinePushMessageRequest = { to, messages };
  return lineApiFetch<LineApiResponse>("/message/push", payload);
}

/** Reply メッセージ */
export async function replyMessage(
  replyToken: string,
  messages: LineMessage[]
): Promise<LineApiResponse> {
  const payload: LineReplyMessageRequest = { replyToken, messages };
  return lineApiFetch<LineApiResponse>("/message/reply", payload);
}

/** Multicast（最大500人） */
export async function multicastMessage(
  userIds: string[],
  messages: LineMessage[]
): Promise<LineApiResponse> {
  return lineApiFetch<LineApiResponse>("/message/multicast", {
    to: userIds,
    messages,
  });
}

/** Broadcast（全友だち） */
export async function broadcastMessage(
  messages: LineMessage[]
): Promise<LineApiResponse> {
  return lineApiFetch<LineApiResponse>("/message/broadcast", { messages });
}

// ===== ユーザー情報取得 =====
export interface LineUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  language?: string;
}

export async function getUserProfile(
  userId: string
): Promise<LineUserProfile> {
  const res = await fetch(`${LINE_API_BASE}/profile/${userId}`, {
    headers: { Authorization: `Bearer ${getChannelAccessToken()}` },
  });
  if (!res.ok) throw new Error(`Failed to get profile: ${res.status}`);
  return res.json() as Promise<LineUserProfile>;
}
