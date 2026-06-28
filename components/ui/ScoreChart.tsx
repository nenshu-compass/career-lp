"use client";
import { DiagnosisScores } from "@/types";

interface ScoreChartProps {
  scores: DiagnosisScores;
}

const LABELS: { key: keyof DiagnosisScores; label: string; color: string }[] = [
  { key: "sales_score",        label: "営業力",   color: "#2563eb" },
  { key: "challenge_score",    label: "挑戦力",   color: "#7c3aed" },
  { key: "income_score",       label: "稼ぐ力",   color: "#dc2626" },
  { key: "stability_score",    label: "安定志向", color: "#059669" },
  { key: "communication_score",label: "対人力",   color: "#d97706" },
  { key: "speed_score",        label: "行動力",   color: "#0ea5e9" },
];

export default function ScoreChart({ scores }: ScoreChartProps) {
  return (
    <div className="space-y-3">
      {LABELS.map(({ key, label, color }) => (
        <div key={key}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{label}</span>
            <span className="font-bold" style={{ color }}>{scores[key]}点</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${scores[key]}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
