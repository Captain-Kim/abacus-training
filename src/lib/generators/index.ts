import { Operation, Problem, Stage } from "../types";
import { generateAddition } from "./addition";
import { generateSubtraction } from "./subtraction";
import { generateMultiplication } from "./multiplication";
import { generateDivision } from "./division";

export function generateProblem(operation: Operation, stage: Stage): Problem {
  switch (operation) {
    case "add":
      return generateAddition(stage);
    case "sub":
      return generateSubtraction(stage);
    case "mul":
      return generateMultiplication(stage);
    case "div":
      return generateDivision(stage);
  }
}

export const OPERATION_LABELS: Record<Operation, string> = {
  add: "덧셈",
  sub: "뺄셈",
  mul: "곱셈",
  div: "나눗셈",
};

export const STAGE_LABELS: Record<Operation, string[]> = {
  add: [
    "1단계 · 자리올림 없음",
    "2단계 · 단일 자리올림",
    "3단계 · 연쇄 자리올림",
    "4단계 · 9가 낀 자리",
    "5단계 · 실전 종합",
  ],
  sub: [
    "1단계 · 받아내림 없음",
    "2단계 · 단일 받아내림",
    "3단계 · 연쇄 받아내림",
    "4단계 · 0이 낀 자리",
    "5단계 · 실전 종합",
  ],
  mul: [
    "1단계 · 한 자리 수",
    "2단계 · 두 자리 수",
    "3단계 · 소수 첫째 자리",
    "4단계 · 소수 둘째 자리",
    "5단계 · 실전 종합",
  ],
  div: [
    "1단계 · 나누어떨어짐",
    "2단계 · 몫 자릿수 어림",
    "3단계 · 나머지(첫째 자리)",
    "4단계 · 나머지(둘째 자리)",
    "5단계 · 실전 종합",
  ],
};
