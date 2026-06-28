"use client";
import { useState, useEffect } from "react";
import type { UserRecord } from "@/types";
import { getAllRecords } from "@/lib/storage";
import { Users, TrendingUp, CheckCircle2, Clock } from "lucide-react";

const HEAT_COLOR = (score: number) => {
  if (score >= 80) return "text-red-600 bg-red-50";
  if (score >= 60) return "text-orange-600 bg-orange-50";
  if (score >= 40) return "text-yellow-600 bg-yellow-50";
  return "text-gray-500 bg-gray-100";
};

const TYPE_LABEL: Record<string, string> = {
  sales_income:         "営業年収UP",
  construction_skilled: "施工管理",
  it_office_stable:     "IT・事務",
  sales_experience:     "販売活用",
};

const TIMING_LABEL: Record<string, string> = {
  immediate: "すぐにでも",
  "3months": "3ヶ月以内",
  "6months": "半年以内",
  "1year":   "1年以内",
  no_rush:   "じっくり",
};

export default function AdminTable() {
  const [records, setRecords] = useState<UserRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "line" | "booked" | "hot">("all");

  useEffect(() => {
    setRecords(getAllRecords());
  }, []);

  const filtered = records.filter((r: UserRecord) => {
    if (filter === "line")   return r.lineRegistered;
    if (filter === "booked") return r.interviewBooked;
    if (filter === "hot")    return r.heatScore >= 70;
    return true;
  });

  const stats = {
    total:   records.length,
    line:    records.filter((r: UserRecord) => r.lineRegistered).length,
    booked:  records.filter((r: UserRecord) => r.interviewBooked).length,
    hot:     records.filter((r: UserRecord) => r.heatScore >= 70).length,
  };

  return (
    <div>
      {/* サマリー */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { icon: Users,       label: "総診断数",    value: stats.total,  color: "text-blue-600",  bg: "bg-blue-50"  },
          { icon: TrendingUp,  label: "LINE登録",    value: stats.line,   color: "text-green-600", bg: "bg-green-50" },
          { icon: CheckCircle2,label: "面談予約",    value: stats.booked, color: "text-purple-600",bg: "bg-purple-50"},
          { icon: Clock,       label: "高温度感",    value: stats.hot,    color: "text-red-600",   bg: "bg-red-50"   },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="rounded-xl bg-white p-4 shadow-sm">
            <div className={`mb-1 inline-flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* フィルター */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {(["all", "hot", "line", "booked"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              filter === f
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-500 shadow-sm hover:bg-gray-50"
            }`}
          >
            {f === "all" ? "すべて" : f === "hot" ? "🔥 高温度感" : f === "line" ? "LINE済" : "面談予約済"}
          </button>
        ))}
      </div>

      {/* テーブル（スマホ: カード表示） */}
      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center text-gray-400 shadow-sm">
          <p className="text-sm">データがありません</p>
          <p className="mt-1 text-xs">診断を完了するとここに表示されます</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((record: UserRecord) => (
            <div key={record.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-gray-900">{record.name}</p>
                  <p className="text-xs text-gray-500">
                    {record.age} / {record.currentJob} / {record.currentIncome}万円
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${HEAT_COLOR(record.heatScore)}`}>
                  🌡️ {record.heatScore}
                </span>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">診断タイプ：</span>
                  <span className="font-bold text-primary-600">{TYPE_LABEL[record.diagnosisType] ?? record.typeName}</span>
                </div>
                <div>
                  <span className="text-gray-400">希望地：</span>
                  <span className="font-medium">{record.preferredLocation}</span>
                </div>
                <div>
                  <span className="text-gray-400">転職時期：</span>
                  <span className="font-medium">{TIMING_LABEL[record.transferTiming] ?? record.transferTiming}</span>
                </div>
                <div>
                  <span className="text-gray-400">登録日：</span>
                  <span className="font-medium">
                    {new Date(record.createdAt).toLocaleDateString("ja-JP")}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <span
                  className={`flex-1 rounded-lg py-1 text-center text-xs font-bold ${
                    record.lineRegistered
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  LINE {record.lineRegistered ? "✓ 登録済" : "未登録"}
                </span>
                <span
                  className={`flex-1 rounded-lg py-1 text-center text-xs font-bold ${
                    record.interviewBooked
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  面談 {record.interviewBooked ? "✓ 予約済" : "未予約"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
