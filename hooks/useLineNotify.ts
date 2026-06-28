/**
 * hooks/useLineNotify.ts
 *
 * 診断完了後にLINE通知APIを呼び出すカスタムフック
 *
 * 使用箇所: components/diagnosis/DiagnosisForm.tsx
 * （診断完了 → 結果保存 → LINE通知を非同期送信）
 */

"use client";
import { useCallback } from "react";
import type { NotifyResultPayload } from "@/types/line";

interface NotifyOptions {
  /** LINE userId（LINEログイン連携後に取得 or URLパラメータ経由） */
  lineUserId: string | null;
  payload: Omit<NotifyResultPayload, "userId">;
}

export function useLineNotify() {
  const notify = useCallback(async (opts: NotifyOptions) => {
    const { lineUserId, payload } = opts;

    if (!lineUserId) {
      // LINE未連携はスキップ（エラーにしない）
      return;
    }

    try {
      await fetch("/api/line/notify-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // INTERNAL_API_KEY は本番でのみ必要（クライアント側では省略可能にする）
        },
        body: JSON.stringify({ ...payload, userId: lineUserId }),
      });
    } catch (err) {
      // 通知失敗は診断フローをブロックしない
      console.warn("[LINE] Notify failed:", err);
    }
  }, []);

  return { notify };
}
