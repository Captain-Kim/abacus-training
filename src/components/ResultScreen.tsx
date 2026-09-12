"use client";

import { AnsweredProblem, Operand } from "@/lib/types";
import { IconClose } from "./icons";

function formatOperand(op: Operand): string {
  const formatted =
    op.unit === "원"
      ? op.value.toLocaleString("ko-KR")
      : op.value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  return `${formatted}${op.unit ?? ""}`;
}

interface ResultScreenProps {
  results: AnsweredProblem[];
  onRetry: () => void;
  onHome: () => void;
}

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ResultScreen({
  results,
  onRetry,
  onHome,
}: ResultScreenProps) {
  const correctCount = results.filter((r) => r.correct).length;
  const wrongOnes = results.filter((r) => !r.correct);
  const ratio = results.length > 0 ? correctCount / results.length : 0;
  const dashOffset = CIRCUMFERENCE * (1 - ratio);

  return (
    <div className="flex h-dvh w-full max-w-md mx-auto flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pt-6 pb-3">
      <p className="text-center text-[13px] font-bold tracking-widest text-neutral-400">
        세션 결과
      </p>

      <div className="flex flex-col items-center">
        <svg viewBox="0 0 160 160" className="h-[150px] w-[150px]">
          <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#e5e5e5" strokeWidth="14" />
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke="#171717"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 80 80)"
          />
          <text x="80" y="76" textAnchor="middle" fontSize="34" fontWeight="800" fill="#171717">
            {correctCount}/{results.length}
          </text>
          <text x="80" y="98" textAnchor="middle" fontSize="13" fontWeight="600" fill="#a3a3a3">
            정답
          </text>
        </svg>
      </div>

      {wrongOnes.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="px-0.5 text-[13px] font-bold text-neutral-400">
            틀린 문제 ({wrongOnes.length})
          </h2>
          <div className="overflow-hidden rounded-[18px] border border-neutral-200 bg-white">
            {wrongOnes.map((r, idx) => (
              <div
                key={idx}
                className={`flex gap-3 p-4 ${
                  idx !== wrongOnes.length - 1 ? "border-b border-neutral-100" : ""
                }`}
              >
                <div className="mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-neutral-900">
                  <IconClose className="h-3 w-3 text-neutral-900" />
                </div>
                <div className="flex-1">
                  <p className="font-mono text-sm font-bold text-neutral-900">
                    {r.problem.display.operands
                      .map((op) => formatOperand(op))
                      .join(` ${r.problem.display.operator} `)}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    내 답{" "}
                    <span className="line-through">{r.userAnswers.join(", ") || "-"}</span> · 정답{" "}
                    <span className="font-bold text-neutral-900">
                      {r.problem.parts.map((p) => p.answer).join(", ")}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      </div>

      <div className="flex shrink-0 flex-col gap-2.5 px-5 pb-5 pt-2">
        <button
          onClick={onRetry}
          className="h-12 rounded-[16px] bg-neutral-900 text-base font-extrabold text-white shadow-lg shadow-neutral-900/15 transition active:scale-[0.98]"
        >
          같은 단계 다시하기
        </button>
        <button
          onClick={onHome}
          className="h-12 rounded-[16px] border-2 border-neutral-900 text-base font-bold text-neutral-900 transition active:scale-[0.98]"
        >
          연산/단계 다시 선택
        </button>
      </div>
    </div>
  );
}
