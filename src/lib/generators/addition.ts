import { Problem, Stage } from "../types";
import { randInt } from "../format";
import { digitsToNumber, genAddPair, randomDigits } from "./digits";

const SCALE = 100;

function toWon(coreDigits: number[]): number {
  return digitsToNumber(coreDigits) * SCALE;
}

function makeAdditionProblem(stage: Stage, amounts: number[]): Problem {
  const total = amounts.reduce((s, v) => s + v, 0);
  return {
    id: crypto.randomUUID(),
    operation: "add",
    stage,
    display: {
      operator: "+",
      operands: amounts.map((value) => ({ value, unit: "원" })),
    },
    parts: [{ answer: total, unit: "원", integerDigits: 6 }],
    hint: stage === 2 || stage === 3 ? "10을 채우려면 몇이 더 필요한지 생각해보세요." : undefined,
  };
}

function stage1(): Problem {
  const { a, b } = genAddPair(3, [0, 0, 0]);
  return makeAdditionProblem(1, [toWon(a), toWon(b)]);
}

function stage2(): Problem {
  const { a, b } = genAddPair(3, [1, 0, 0]);
  return makeAdditionProblem(2, [toWon(a), toWon(b)]);
}

function stage3(): Problem {
  const { a, b } = genAddPair(3, [1, 1, 0]);
  return makeAdditionProblem(3, [toWon(a), toWon(b)]);
}

function stage4(): Problem {
  const length = 3;
  const a = randomDigits(length);
  const b = randomDigits(length);

  a[0] = randInt(5, 9);
  b[0] = randInt(10 - a[0], 9);

  a[1] = 9;
  b[1] = randInt(0, 9);
  a[2] = 9;
  b[2] = randInt(0, 8);

  return makeAdditionProblem(4, [toWon(a), toWon(b)]);
}

function stage5(): Problem {
  const count = randInt(3, 4);
  const amounts: number[] = [];
  for (let i = 0; i < count; i++) {
    amounts.push(toWon(randomDigits(3)));
  }
  return makeAdditionProblem(5, amounts);
}

export function generateAddition(stage: Stage): Problem {
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
