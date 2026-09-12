export function formatWon(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}

export function formatLiter(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return `${rounded.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}L`;
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export function roundTo(n: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}
