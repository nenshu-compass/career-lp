/**
 * lib/line.ts
 * LINE Messaging API クライアント
 *
 * 環境変数:
 *   LINE_CHANNEL_ACCESS_TOKEN  チャネルアクセストークン
 *   LINE_CHANNEL_SECRET        チャネルシークレット（署名検証用）
 *   NEXT_PUBLIC_BASE_URL       本番サイトのURL（例: https://career-lp.vercel.app）
 */

// crypto はNode.js組み込みモジュール。本番（Next.js API Routes）では自動利用可能。
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const nodeCrypto = require("crypto") as {
  createHmac: (algo: string, key: string) => {
    update: (data: string | Buffer) => { digest: (enc: string) => string };
  };
  timingSafeEqual: (a: Buffer, b: Buffer) => boolean;
};
import type {
  LineMessage,
  LinePushMessageRequest,
  LineReplyMessageRequest,
  LineApiResponse,
} from "@/types/line";

const LINE_API_BASE = "https://api.line.me/v2/bot";

// ===== 環境変数ヘルパー =====
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

  // 204 No Content の場合は空オブジェクト
  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}

// ===== 署名検証 =====
/**
 * Webhookリクエストの署名を検証する
 * @param rawBody  リクエストの生ボディ（Buffer または string）
 * @param signature  X-Line-Signature ヘッダー値
 */
export function verifySignature(
  rawBody: string | Buffer,
  signature: string
): boolean {
  const secret = getChannelSecret();
  const hash = nodeCrypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("base64");
  return nodeCrypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

// ===== メッセージ送信 =====

/** Push メッセージ（任意のユーザーへ送信） */
export async function pushMessage(
  to: string,
  messages: LineMessage[]
): Promise<LineApiResponse> {
  const payload: LinePushMessageRequest = { to, messages };
  return lineApiFetch<LineApiResponse>("/message/push", payload);
}

/** Reply メッセージ（Webhookの replyToken を使って返信） */
export async function replyMessage(
  replyToken: string,
  messages: LineMessage[]
): Promise<LineApiResponse> {
  const payload: LineReplyMessageRequest = { replyToken, messages };
  return lineApiFetch<LineApiResponse>("/message/reply", payload);
}

/** Multicast（複数ユーザーへ同時送信、最大500人） */
export async function multicastMessage(
  userIds: string[],
  messages: LineMessage[]
): Promise<LineApiResponse> {
  return lineApiFetch<LineApiResponse>("/message/multicast", {
    to: userIds,
    messages,
  });
}

/** Broadcast（全友だちへ送信） */
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
