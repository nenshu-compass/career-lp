"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DiagnosisAnswers } from "@/types";
import { QUESTIONS } from "@/lib/diagnosis";
import { generateResult, calcHeatScore } from "@/lib/diagnosis";
import { saveRecord, generateId } from "@/lib/storage";
import { useLineNotify } from "@/hooks/useLineNotify";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";

const INITIAL_ANSWERS: DiagnosisAnswers = {
  name: "",
  age: "",
  currentIncome: "",
  currentJob: "",
  desiredCondition: "",
  interpersonal: "",
  incomeMotivation: "",
  challengeMotivation: "",
  preferredLocation: "",
  transferTiming: "",
};

export default function DiagnosisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notify } = useLineNotify();

  // LINEログイン連携時: ?lineUserId=Uxxxxx として渡す想定
  const lineUserId = searchParams.get("lineUserId");

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswers>(INITIAL_ANSWERS);
  const [textInput, setTextInput] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const question = QUESTIONS[step];
  const isTextQuestion = question.type === "text";
  const totalSteps = QUESTIONS.length;

  function handleSelect(value: string) {
    setAnswers((prev: DiagnosisAnswers) => ({ ...prev, [question.id]: value }));
    setError("");
  }

  async function handleNext() {
    const val = isTextQuestion ? textInput : answers[question.id];
    if (!val || val.trim() === "") {
      setError("選択または入力してください");
      return;
    }

    if (isTextQuestion) {
      setAnswers((prev: DiagnosisAnswers) => ({ ...prev, name: textInput }));
    }

    if (step < totalSteps - 1) {
      setStep((s: number) => s + 1);
      setError("");
      return;
    }

    // ===== 診断完了 =====
    setSubmitting(true);
    try {
      const finalAnswers: DiagnosisAnswers = isTextQuestion
        ? { ...answers, [question.id]: textInput }
        : answers;

      const result = generateResult(finalAnswers);
      const heatScore = calcHeatScore(finalAnswers, result.scores);

      const record = {
        id: generateId(),
        name: finalAnswers.name || "名前未入力",
        age: finalAnswers.age,
        currentJob: finalAnswers.currentJob,
        currentIncome: finalAnswers.currentIncome,
        preferredLocation: finalAnswers.preferredLocation,
        transferTiming: finalAnswers.transferTiming,
        diagnosisType: result.type,
        typeName: result.typeName,
        heatScore,
        lineRegistered: !!lineUserId,
        interviewBooked: false,
        createdAt: new Date().toISOString(),
        answers: finalAnswers,
        scores: result.scores,
      };

      // ローカル保存
      saveRecord(record);

      // セッションストレージに結果を保存
      sessionStorage.setItem(
        "diagnosis_result",
        JSON.stringify({ result, record })
      );

      // LINE通知（非同期・失敗しても続行）
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      notify({
        lineUserId,
        payload: {
          recordId: record.id,
          userName: record.name,
          typeName: result.typeName,
          incomeUpRange: result.incomeUpRange,
          successRate: result.successRate,
          recommendedJobs: result.recommendedJobs,
          bookingUrl: `${baseUrl}/booking`,
        },
      });

      router.push("/result");
    } catch (err) {
      console.error("Diagnosis submit error:", err);
      setError("エラーが発生しました。もう一度お試しください。");
      setSubmitting(false);
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep((s: number) => s - 1);
      setError("");
    }
  }

  return (
    <div className="mx-auto max-w-screen-md px-4 pb-12 pt-6">
      <ProgressBar current={step + 1} total={totalSteps} className="mb-8" />

      <div key={step} className="animate-fade-up rounded-2xl bg-white p-6 shadow-md">
        <p className="mb-2 text-xs font-bold text-primary-600">
          Question {step + 1} / {totalSteps}
        </p>
        <h2 className="mb-6 text-lg font-black leading-snug text-gray-900">
          {question.question}
        </h2>

        {isTextQuestion ? (
          <input
            type="text"
            value={textInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTextInput(e.target.value); setError(""); }}
            placeholder="例：山田太郎"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-base font-medium outline-none transition-colors focus:border-primary-500"
            autoFocus
          />
        ) : (
          <div className="space-y-2.5">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-all duration-150 ${
                  answers[question.id] === opt.value
                    ? "border-primary-500 bg-primary-50 font-bold text-primary-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50/50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    answers[question.id] === opt.value
                      ? "border-primary-500 bg-primary-500"
                      : "border-gray-300"
                  }`}>
                    {answers[question.id] === opt.value && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <Button variant="ghost" size="md" onClick={handleBack} className="gap-1 text-gray-500">
            <ChevronLeft className="h-4 w-4" />
            戻る
          </Button>
        )}
        <Button
          variant="primary"
          size="md"
          onClick={handleNext}
          fullWidth
          className="ml-auto"
          disabled={submitting}
        >
          {submitting ? "送信中..." : step < totalSteps - 1 ? (
            <><span>次へ</span><ChevronRight className="h-4 w-4" /></>
          ) : "診断結果を見る 🎉"}
        </Button>
      </div>
    </div>
  );
}
