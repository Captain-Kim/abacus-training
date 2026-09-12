import { Problem, Stage } from "../types";
import { pick, randInt } from "../format";
import { digitsToNumber, genSubPair } from "./digits";

const SCALE = 100;

function toWon(coreDigits: number[]): number {
  return digitsToNumber(coreDigits) * SCALE;
}

function makeSubtractionProblem(stage: Stage, paid: number, cost: number): Problem {
  const change = paid - cost;
  return {
    id: crypto.randomUUID(),
    operation: "sub",
    stage,
    display: {
      operator: "-",
      operands: [
        { value: paid, unit: "원" },
        { value: cost, unit: "원" },
      ],
    },
    parts: [{ answer: change, unit: "원", integerDigits: 6 }],
    hint: stage === 2 || stage === 3 ? "위 자리에서 10을 빌려와 나눠 쓰는 걸 떠올려보세요." : undefined,
  };
}

function stage1(): Problem {
  const { a, b } = genSubPair(3, [0, 0, 0]);
  return makeSubtractionProblem(1, toWon(a), toWon(b));
}

function stage2(): Problem {
  const { a, b } = genSubPair(3, [1, 0, 0]);
  return makeSubtractionProblem(2, toWon(a), toWon(b));
}

function stage3(): Problem {
  const { a, b } = genSubPair(3, [1, 1, 0]);
  return makeSubtractionProblem(3, toWon(a), toWon(b));
}

function stage4(): Problem {
  const bill = pick([10000, 20000, 30000, 50000, 100000]);
  const cost = randInt(Math.floor(bill * 0.15), bill - 100) - randInt(0, 99);
  const roundedCost = Math.max(100, Math.round(cost / 10) * 10);
  return makeSubtractionProblem(4, bill, roundedCost);
}

function stage5(): Problem {
  const bills = [10000, 5000, 1000];
  let paid = 0;
  for (const bill of bills) {
    if (Math.random() < 0.7) paid += bill * randInt(1, 3);
  }
  if (paid < 5000) paid += 10000;
  const cost = Math.max(500, Math.round(randInt(500, paid - 100) / 10) * 10);
  return makeSubtractionProblem(5, paid, cost);
}

export function generateSubtraction(stage: Stage): Problem {
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
