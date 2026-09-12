"use client";

import { useState } from "react";
import { Operation, Stage } from "@/lib/types";
import { OPERATION_LABELS, STAGE_LABELS } from "@/lib/generators";
import { IconAbacus, IconArrowRight, IconCheck, IconDivide, IconMinus, IconPlus, IconClose } from "./icons";

const OPERATIONS: Operation[] = ["add", "sub", "mul", "div"];
const STAGES: Stage[] = [1, 2, 3, 4, 5];

const OPERATION_ICONS: Record<Operation, typeof IconPlus> = {
  add: IconPlus,
  sub: IconMinus,
  mul: IconClose,
  div: IconDivide,
};

function splitLabel(label: string): { title: string; subtitle: string } {
  const match = label.match(/^(.+?)\s*\((.+)\)$/);
  return match ? { title: match[1], subtitle: match[2] } : { title: label, subtitle: "" };
}

function splitStageLabel(label: string): { title: string; subtitle: string } {
  const [title, subtitle] = label.split(" · ");
  return { title, subtitle: subtitle ?? "" };
}

interface StartScreenProps {
  onStart: (operation: Operation, stage: Stage) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [operation, setOperation] = useState<Operation>("add");
  const [stage, setStage] = useState<Stage>(1);

  return (
    <div className="flex h-dvh w-full max-w-md mx-auto flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pt-6 pb-3">
      <div className="flex flex-col gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-neutral-900">
          <IconAbacus className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest text-neutral-400">TRAINING</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-900">
            주산 트레이닝
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
            연산과 단계를 골라 반복 훈련을 시작하세요
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <h2 className="text-[13px] font-bold text-neutral-400">연산 선택</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {OPERATIONS.map((op) => {
            const Icon = OPERATION_ICONS[op];
            const { title, subtitle } = splitLabel(OPERATION_LABELS[op]);
            const selected = operation === op;
            return (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={`flex flex-col gap-2 rounded-[18px] border px-4 py-3 text-left transition ${
                  selected
                    ? "border-neutral-900 bg-neutral-900"
                    : "border-neutral-200 bg-white active:bg-neutral-50"
                }`}
              >
                <Icon className={`h-5 w-5 ${selected ? "text-white" : "text-neutral-900"}`} />
                <div>
                  <p className={`text-[15px] font-bold ${selected ? "text-white" : "text-neutral-900"}`}>
                    {title}
                  </p>
                  {subtitle && (
                    <p className={`mt-0.5 text-[11px] ${selected ? "text-neutral-300" : "text-neutral-400"}`}>
                      {subtitle}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[13px] font-bold text-neutral-400">단계 선택</h2>
        <div className="overflow-hidden rounded-[18px] border border-neutral-200 bg-white">
          {STAGES.map((s, i) => {
            const { title, subtitle } = splitStageLabel(STAGE_LABELS[operation][s - 1]);
            const selected = stage === s;
            return (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left ${
                  i !== STAGES.length - 1 ? "border-b border-neutral-100" : ""
                }`}
              >
                <div>
                  <p className="text-[15px] font-bold text-neutral-900">{title}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">{subtitle}</p>
                </div>
                <div
                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ${
                    selected ? "bg-neutral-900" : "border-2 border-neutral-200"
                  }`}
                >
                  {selected && <IconCheck className="h-[13px] w-[13px] text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      </div>

      <div className="shrink-0 px-5 pb-5 pt-2">
        <button
          onClick={() => onStart(operation, stage)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-neutral-900 text-base font-extrabold text-white shadow-lg shadow-neutral-900/15 transition active:scale-[0.98]"
        >
          시작하기
          <IconArrowRight className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
