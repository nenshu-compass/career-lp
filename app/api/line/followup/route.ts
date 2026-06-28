export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * app/api/line/followup/route.ts
 *
 * フォローアップ一括送信API
 * cron job（Vercel Cron / GitHub Actions）から定期呼び出し
 *
 * 対象: LINE登録済み & 面談未予約 & 診断から3日以上経過したユーザー
 *
 * cron設定例（vercel.json）:
 *   {
 *     "crons": [{ "path": "/api/line/followup", "schedule": "0 10 * * *" }]
 *   }
 *
 * ヘッダー:
 *   Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { pushMessage } from "@/lib/line";
import { buildFollowUpMessages } from "@/lib/lineMessages";

/** Supabase等から取得するユーザーレコードの最小型 */
interface FollowUpTarget {
  id: string;
  name: string;
  lineUserId: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ===== cron認証 =====
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /*
   * ===== 対象ユーザー取得 =====
   * 本番実装では Supabase から取得:
   *
   * const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
   * const { data: targets } = await supabase
   *   .from("user_records")
   *   .select("id, name, line_user_id")
   *   .eq("line_registered", true)
   *   .eq("interview_booked", false)
   *   .is("followup_sent_at", null)
   *   .lte("created_at", threeDaysAgo)
   *   .limit(100);
   *
   * 現在はモック（実際の送信はしない）
   */
  const targets: FollowUpTarget[] = [
    // { id: "xxx", name: "田中太郎", lineUserId: "Uxxxxx" },
  ];

  if (targets.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No targets" });
  }

  // ===== 1人ずつ送信（レートリミット対策：間隔あり） =====
  const results: { id: string; ok: boolean; error?: string }[] = [];

  for (const target of targets) {
    try {
      const messages = buildFollowUpMessages(target.name);
      await pushMessage(target.lineUserId, messages);

      /*
       * 将来: followup_sent_at を更新して重複送信を防ぐ
       * await supabase
       *   .from("user_records")
       *   .update({ followup_sent_at: new Date().toISOString() })
       *   .eq("id", target.id);
       */

      results.push({ id: target.id, ok: true });
    } catch (err) {
      results.push({ id: target.id, ok: false, error: String(err) });
    }

    // レートリミット対策: 200ms待機
    await new Promise((r) => setTimeout(r, 200));
  }

  const sentCount = results.filter((r) => r.ok).length;
  console.log(`[LINE Followup] Sent: ${sentCount}/${targets.length}`);

  return NextResponse.json({ ok: true, sent: sentCount, results });
}
