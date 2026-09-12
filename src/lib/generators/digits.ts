import { randInt } from "../format";

export type Digits = number[];

export function randomDigits(length: number): Digits {
  const digits: Digits = [];
  for (let i = 0; i < length; i++) {
    digits.push(i === length - 1 ? randInt(1, 9) : randInt(0, 9));
  }
  return digits;
}

export function digitsToNumber(digits: Digits): number {
  let value = 0;
  for (let i = digits.length - 1; i >= 0; i--) {
    value = value * 10 + digits[i];
  }
  return value;
}

export function simulateAddCarries(a: Digits, b: Digits): number[] {
  const len = Math.max(a.length, b.length);
  const carries: number[] = [];
  let carry = 0;
  for (let i = 0; i < len; i++) {
    const sum = (a[i] ?? 0) + (b[i] ?? 0) + carry;
    carry = sum >= 10 ? 1 : 0;
    carries.push(carry);
  }
  return carries;
}

export function simulateSubBorrows(a: Digits, b: Digits): number[] {
  const len = Math.max(a.length, b.length);
  const borrows: number[] = [];
  let borrow = 0;
  for (let i = 0; i < len; i++) {
    let da = (a[i] ?? 0) - borrow;
    const db = b[i] ?? 0;
    if (da < db) {
      da += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    borrows.push(borrow);
  }
  return borrows;
}

export function genAddPair(
  length: number,
  pattern: (number | null)[],
  maxTries = 5000
): { a: Digits; b: Digits } {
  for (let t = 0; t < maxTries; t++) {
    const a = randomDigits(length);
    const b = randomDigits(length);
    const carries = simulateAddCarries(a, b);
    let ok = true;
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== null && carries[i] !== pattern[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return { a, b };
  }
  throw new Error("genAddPair: could not satisfy pattern");
}

export function genSubPair(
  length: number,
  pattern: (number | null)[],
  maxTries = 5000
): { a: Digits; b: Digits } {
  for (let t = 0; t < maxTries; t++) {
    const a = randomDigits(length);
    const b = randomDigits(length);
    if (digitsToNumber(a) < digitsToNumber(b)) continue;
    const borrows = simulateSubBorrows(a, b);
    let ok = true;
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== null && borrows[i] !== pattern[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return { a, b };
  }
  throw new Error("genSubPair: could not satisfy pattern");
}
