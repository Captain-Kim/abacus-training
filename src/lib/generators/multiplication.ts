import { Problem, Stage } from "../types";
import { randInt, roundTo } from "../format";

function randomMultiplier(): number {
  return randInt(150, 990);
}

function makeProblem(stage: Stage, quantity: number, unitPrice: number): Problem {
  const rawTotal = quantity * unitPrice;
  const total = stage >= 3 ? Math.round(rawTotal / 10) * 10 : rawTotal;
  return {
    id: crypto.randomUUID(),
    operation: "mul",
    stage,
    display: {
      operator: "×",
      operands: [{ value: quantity }, { value: unitPrice, unit: "원" }],
    },
    parts: [
      {
        prompt: stage >= 3 ? "10원 단위로 반올림" : undefined,
        answer: total,
        unit: "원",
        integerDigits: 6,
      },
    ],
  };
}

function stage1(): Problem {
  const quantity = randInt(1, 9);
  const unitPrice = randomMultiplier();
  return makeProblem(1, quantity, unitPrice);
}

function stage2(): Problem {
  const quantity = randInt(10, 45);
  const unitPrice = randomMultiplier();
  return makeProblem(2, quantity, unitPrice);
}

function stage3(): Problem {
  const quantity = roundTo(randInt(10, 45) + randInt(1, 9) / 10, 1);
  const unitPrice = randomMultiplier();
  return makeProblem(3, quantity, unitPrice);
}

function stage4(): Problem {
  const quantity = roundTo(randInt(5, 45) + randInt(1, 99) / 100, 2);
  const unitPrice = randomMultiplier();
  return makeProblem(4, quantity, unitPrice);
}

function stage5(): Problem {
  const variant = randInt(1, 4);
  if (variant === 1) return stage1();
  if (variant === 2) return stage2();
  if (variant === 3) return stage3();
  return stage4();
}

export function generateMultiplication(stage: Stage): Problem {
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
      return { ...stage5(), stage: 5 };
  }
}
