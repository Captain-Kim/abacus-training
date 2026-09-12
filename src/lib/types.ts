export type Operation = "add" | "sub" | "mul" | "div";

export type Stage = 1 | 2 | 3 | 4 | 5;

export interface Operand {
  value: number;
  unit?: string;
}

export interface VerticalDisplay {
  operator: "+" | "-" | "×" | "÷";
  operands: Operand[];
}

export interface ProblemPart {
  prompt?: string;
  answer: number;
  unit?: string;
  tolerance?: number;
  allowDecimal?: boolean;
  integerDigits?: number;
  decimalPlaces?: number;
}

export interface Problem {
  id: string;
  operation: Operation;
  stage: Stage;
  display: VerticalDisplay;
  parts: ProblemPart[];
  hint?: string;
}

export interface AnsweredProblem {
  problem: Problem;
  userAnswers: number[];
  correct: boolean;
}
