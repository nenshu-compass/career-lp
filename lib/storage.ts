import type { UserRecord } from "@/types";

const STORAGE_KEY = "career_lp_records";

// ===== 全レコード取得 =====
export function getAllRecords(): UserRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ===== レコード保存 =====
export function saveRecord(record: UserRecord): void {
  if (typeof window === "undefined") return;
  const records = getAllRecords();
  const idx = records.findIndex((r) => r.id === record.id);
  if (idx >= 0) {
    records[idx] = record;
  } else {
    records.unshift(record);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// ===== LINE登録更新 =====
export function markLineRegistered(id: string): void {
  const records = getAllRecords();
  const record = records.find((r) => r.id === id);
  if (record) {
    record.lineRegistered = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}

// ===== 面談予約更新 =====
export function markInterviewBooked(id: string): void {
  const records = getAllRecords();
  const record = records.find((r) => r.id === id);
  if (record) {
    record.interviewBooked = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}

// ===== UUID生成 =====
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/*
 * ===== Supabase 将来実装メモ =====
 * 以下のテーブル設計を想定:
 *
 * CREATE TABLE user_records (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   age TEXT,
 *   current_job TEXT,
 *   current_income TEXT,
 *   preferred_location TEXT,
 *   transfer_timing TEXT,
 *   diagnosis_type TEXT,
 *   type_name TEXT,
 *   heat_score INT,
 *   line_registered BOOLEAN DEFAULT false,
 *   interview_booked BOOLEAN DEFAULT false,
 *   answers JSONB,
 *   scores JSONB,
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * import { createClient } from "@supabase/supabase-js";
 * const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
 *
 * export async function saveRecordToSupabase(record: UserRecord) {
 *   const { error } = await supabase.from("user_records").upsert({ ...record });
 *   if (error) throw error;
 * }
 */
