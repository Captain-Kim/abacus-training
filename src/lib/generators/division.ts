import { Problem, Stage } from "../types";
import { randInt, roundTo } from "../format";

function randomDivisor(): number {
  return randInt(150, 990);
}

function makeDivisionProblem(
  stage: Stage,
  total: number,
  divisor: number,
  quotient: number,
  extra?: { tolerance?: number; allowDecimal?: boolean; roundNote?: string; decimalPlaces?: number }
): Problem {
  return {
    id: crypto.randomUUID(),
    operation: "div",
    stage,
    display: {
      operator: "÷",
      operands: [
        { value: total, unit: "원" },
        { value: divisor, unit: "원" },
      ],
    },
    parts: [
      {
        prompt: extra?.roundNote,
        answer: quotient,
        tolerance: extra?.tolerance,
        allowDecimal: extra?.allowDecimal,
        integerDigits: 2,
        decimalPlaces: extra?.decimalPlaces ?? 0,
      },
    ],
  };
}

function stage1(): Problem {
  const divisor = randomDivisor();
  const quotient = randInt(2, 60);
  const total = divisor * quotient;
  return makeDivisionProblem(1, total, divisor, quotient);
}

function stage2(): Problem {
  const divisor = randomDivisor();
  const quotient = randInt(2, 60);
  const total = divisor * quotient;
  const digitCount = String(quotient).length;
  return {
    id: crypto.randomUUID(),
    operation: "div",
    stage: 2,
    display: {
      operator: "÷",
      operands: [
        { value: total, unit: "원" },
        { value: divisor, unit: "원" },
      ],
    },
    parts: [
      {
        prompt: "몫은 몇 자리 수 일까요?",
        answer: digitCount,
        unit: "자리",
        integerDigits: 1,
      },
      { prompt: "실제 값은?", answer: quotient, integerDigits: 2 },
    ],
  };
}

function stage3(): Problem {
  const divisor = randomDivisor();
  const totalRough = randInt(2, 60) * divisor + randInt(-divisor + 1, divisor - 1);
  const total = Math.max(divisor, totalRough);
  const quotient = roundTo(total / divisor, 1);
  return makeDivisionProblem(3, total, divisor, quotient, {
    tolerance: 0.05,
    allowDecimal: true,
    roundNote: "소수 첫째 자리까지 반올림",
    decimalPlaces: 1,
  });
}

function stage4(): Problem {
  const divisor = randomDivisor();
  const totalRough = randInt(2, 60) * divisor + randInt(-divisor + 1, divisor - 1);
  const total = Math.max(divisor, totalRough);
  const quotient = roundTo(total / divisor, 2);
  return makeDivisionProblem(4, total, divisor, quotient, {
    tolerance: 0.005,
    allowDecimal: true,
    roundNote: "소수 둘째 자리까지 반올림",
    decimalPlaces: 2,
  });
}

function reverseMultiplicationProblem(): Problem {
  const unitPrice = randomDivisor();
  const quantity = roundTo(randInt(5, 40) + randInt(0, 9) / 10, 1);
  const total = Math.round((quantity * unitPrice) / 10) * 10;
  return {
    id: crypto.randomUUID(),
    operation: "div",
    stage: 5,
    display: {
      operator: "×",
      operands: [{ value: quantity }, { value: unitPrice, unit: "원" }],
    },
    parts: [
      { prompt: "10원 단위로 반올림", answer: total, unit: "원", integerDigits: 6 },
    ],
  };
}

function stage5(): Problem {
  const variant = randInt(1, 4);
  if (variant === 1) return { ...stage1(), stage: 5 };
  if (variant === 2) return { ...stage3(), stage: 5 };
  if (variant === 3) return { ...stage4(), stage: 5 };
  return reverseMultiplicationProblem();
}

export function generateDivision(stage: Stage): Problem {
  switch (stage) {
    case 1:
      return stage1();
    case 2:
      return stage2();
    case 3:
      return stage3();
    case 4:
      return stage4();
    case 5:
      return stage5();
  }
}
