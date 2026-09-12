"use client";

import { useMemo, useState } from "react";
import { AnsweredProblem, Operand, Operation, Problem, Stage } from "@/lib/types";
import { generateProblem, OPERATION_LABELS, STAGE_LABELS } from "@/lib/generators";
import Abacus from "./Abacus";
import VerticalDisplay from "./VerticalDisplay";
import { IconCheck, IconChevronLeft, IconXCircle } from "./icons";

const TOTAL_PROBLEMS = 12;

function digitCount(value: number): number {
  return Math.abs(value).toString().replace(".", "").length;
}

function toRodDigits(value: number, rodCount: number, decimalPlaces: number): number[] {
  const scaled = Math.round(Math.abs(value) * Math.pow(10, decimalPlaces));
  const str = scaled.toString().padStart(rodCount, "0");
  return str.slice(-rodCount).split("").map(Number);
}

interface DigitStep {
  operandIndex: number;
  rodIndex: number;
  digitIndex: number;
  digit: number;
}

function buildDigitSteps(
  operands: Operand[],
  rodCount: number,
  decimalPlaces: number,
  operator: "+" | "-",
  sameScale: boolean
): DigitStep[] {
  if (!sameScale) return [];
  const steps: DigitStep[] = [];
  let running = 0;
  let prevDigits = toRodDigits(0, rodCount, decimalPlaces);
  operands.forEach((op, operandIndex) => {
    running =
      operandIndex === 0
        ? op.value
        : operator === "+"
        ? running + op.value
        : running - op.value;
    const currDigits = toRodDigits(running, rodCount, decimalPlaces);
    const dispLen = digitCount(op.value);
    for (let rodIndex = 0; rodIndex < rodCount; rodIndex++) {
      if (currDigits[rodIndex] === prevDigits[rodIndex]) continue;
      const rawDigitIndex = rodIndex - (rodCount - dispLen);
      const digitIndex = rawDigitIndex >= 0 ? rawDigitIndex : -1;
      steps.push({ operandIndex, rodIndex, digitIndex, digit: currDigits[rodIndex] });
    }
    prevDigits = currDigits;
  });
  return steps;
}

interface QuizScreenProps {
  operation: Operation;
  stage: Stage;
  onFinish: (results: AnsweredProblem[]) => void;
  onQuit: () => void;
}

type Phase = "answering" | "correct" | "wrong";

export default function QuizScreen({
  operation,
  stage,
  onFinish,
  onQuit,
}: QuizScreenProps) {
  const problems = useMemo(
    () =>
      Array.from({ length: TOTAL_PROBLEMS }, () =>
        generateProblem(operation, stage)
      ),
    [operation, stage]
  );

  const [problemIdx, setProblemIdx] = useState(0);
  const [partIdx, setPartIdx] = useState(0);
  const [abacusValue, setAbacusValue] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [partAnswers, setPartAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<AnsweredProblem[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const problem: Problem = problems[problemIdx];
  const part = problem.parts[partIdx];
  const digitSteps = useMemo(
    () =>
      buildDigitSteps(
        problem.display.operands,
        part.integerDigits ?? 6,
        part.decimalPlaces ?? 0,
        problem.display.operator as "+" | "-",
        operation === "add" || operation === "sub"
      ),
    [problem, part, operation]
  );
  const highlight = stepIndex < digitSteps.length ? digitSteps[stepIndex] : null;

  function isCorrect(userValue: number): boolean {
    const tolerance = part.tolerance ?? 0.001;
    return Math.abs(userValue - part.answer) <= tolerance;
  }

  function handleSubmit() {
    if (phase !== "answering") return;
    const value = abacusValue;
    const correct = isCorrect(value);
    const newPartAnswers = [...partAnswers, value];
    setPartAnswers(newPartAnswers);
    setPhase(correct ? "correct" : "wrong");

    setTimeout(() => {
      if (partIdx + 1 < problem.parts.length) {
        setPartIdx(partIdx + 1);
        setAbacusValue(0);
        setPhase("answering");
        setStepIndex(0);
        return;
      }

      const allCorrect = problem.parts.every((p, i) =>
        Math.abs(newPartAnswers[i] - p.answer) <= (p.tolerance ?? 0.001)
      );
      const nextResults = [
        ...results,
        { problem, userAnswers: newPartAnswers, correct: allCorrect },
      ];
      setResults(nextResults);

      if (problemIdx + 1 < problems.length) {
        setProblemIdx(problemIdx + 1);
        setPartIdx(0);
        setPartAnswers([]);
        setAbacusValue(0);
        setPhase("answering");
        setShowHint(false);
        setStepIndex(0);
      } else {
        onFinish(nextResults);
      }
    }, 900);
  }

  return (
    <div className="flex h-dvh w-full max-w-md mx-auto flex-col">
      <div className="flex shrink-0 items-center gap-3 px-5 pt-4">
        <button
          onClick={onQuit}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white"
        >
          <IconChevronLeft className="h-4 w-4 text-neutral-900" />
        </button>
        <div className="flex flex-1 gap-1">
          {Array.from({ length: problems.length }, (_, i) => (
            <div
              key={i}
              className={`h-[5px] flex-1 rounded-full ${
                i <= problemIdx ? "bg-neutral-900" : "bg-neutral-200"
              }`}
            />
          ))}
        </div>
        <span className="shrink-0 text-[13px] font-bold text-neutral-400">
          {problemIdx + 1}/{problems.length}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-5 py-3">
        <div className="text-center">
          <span className="inline-block rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-white">
            {OPERATION_LABELS[operation]} · {STAGE_LABELS[operation][stage - 1]}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 rounded-[20px] border border-neutral-100 bg-white p-4 shadow-sm">
          <VerticalDisplay
            operator={problem.display.operator}
            operands={problem.display.operands}
            highlight={highlight}
          />
          {part.prompt && (
            <p className="text-sm font-medium text-neutral-400">{part.prompt}</p>
          )}
          {problem.hint && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="self-start text-xs text-neutral-400 underline"
            >
              힌트 보기
            </button>
          )}
          {problem.hint && showHint && (
            <p className="text-xs text-neutral-500">{problem.hint}</p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div
            className={`h-11 min-w-[9rem] rounded-[14px] flex items-center justify-center gap-1.5 px-4 text-xl font-extrabold transition ${
              phase === "correct"
                ? "bg-neutral-900 text-white"
                : phase === "wrong"
                ? "border-2 border-dashed border-neutral-300 text-neutral-900"
                : "border-2 border-neutral-900 text-neutral-900"
            }`}
          >
            {phase === "correct" && <IconCheck className="h-5 w-5 text-white" />}
            {phase === "wrong" && <IconXCircle className="h-5 w-5 text-neutral-400" />}
            {abacusValue.toLocaleString("ko-KR")}
            {part.unit && (
              <span
                className={`ml-1 text-base font-medium ${
                  phase === "correct" ? "text-neutral-300" : "text-neutral-400"
                }`}
              >
                {part.unit}
              </span>
            )}
          </div>
        </div>

        {phase === "wrong" && (
          <p className="text-center text-sm font-medium text-neutral-500">
            정답: {part.answer.toLocaleString("ko-KR")}
            {part.unit}
          </p>
        )}
        {phase === "correct" && (
          <p className="text-center text-sm font-bold text-neutral-900">정답이에요!</p>
        )}

        <div className="flex flex-1 items-center justify-center">
          <Abacus
            key={`${problemIdx}-${partIdx}`}
            integerDigits={part.integerDigits ?? 6}
            decimalPlaces={part.decimalPlaces ?? 0}
            onChange={setAbacusValue}
            disabled={phase !== "answering"}
            onBeadMove={(rodIndex, digit) => {
              const current = digitSteps[stepIndex];
              if (current && current.rodIndex === rodIndex && current.digit === digit) {
                setStepIndex((s) => Math.min(s + 1, digitSteps.length));
              }
            }}
          />
        </div>
      </div>

      <div className="shrink-0 px-5 pb-5 pt-2">
        <button
          onClick={handleSubmit}
          disabled={phase !== "answering"}
          className="h-12 w-full rounded-[16px] bg-neutral-900 text-base font-extrabold text-white shadow-lg shadow-neutral-900/15 transition active:scale-[0.98] disabled:opacity-30"
        >
          확인
        </button>
      </div>
    </div>
  );
}
