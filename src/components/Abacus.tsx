"use client";

import { useEffect, useMemo, useState } from "react";

interface AbacusProps {
  integerDigits: number;
  decimalPlaces?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  onBeadMove?: (rodIndex: number, digit: number) => void;
}

const BEAD_H = 22;
const BEAD_GAP = 8;
const GROUP_GAP = 20;
const ROD_MIN_W = 44;
const BEAD_TRANSITION = "top 320ms cubic-bezier(0.34, 1.56, 0.64, 1)";

const BEAD_SHAPE = "polygon(18% 0%, 82% 0%, 100% 50%, 82% 100%, 18% 100%, 0% 50%)";

function earthBeadTop(index: number, earthCount: number): number {
  if (index < earthCount) {
    return index * (BEAD_H + BEAD_GAP);
  }
  return (
    earthCount * (BEAD_H + BEAD_GAP) +
    GROUP_GAP +
    (index - earthCount) * (BEAD_H + BEAD_GAP)
  );
}

function Bead({ top, active }: { top: number; active: boolean }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top, width: "78%", height: BEAD_H, transition: BEAD_TRANSITION }}
    >
      <div
        className="h-full w-full transition-colors duration-150"
        style={{
          clipPath: BEAD_SHAPE,
          background: active
            ? "radial-gradient(circle at 32% 28%, #52525b, #27272a 55%, #000000 100%)"
            : "radial-gradient(circle at 32% 28%, #ffffff, #d4d4d8 55%, #a1a1aa 100%)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.35)",
        }}
      />
    </div>
  );
}

interface RodProps {
  rodIndex: number;
  heavenActive: boolean;
  earthCount: number;
  isDecimalMarker: boolean;
  onToggleHeaven: () => void;
  onSetEarth: (count: number) => void;
}

function Rod({
  rodIndex,
  heavenActive,
  earthCount,
  isDecimalMarker,
  onToggleHeaven,
  onSetEarth,
}: RodProps) {
  const heavenTop = heavenActive ? BEAD_H + GROUP_GAP - 4 : 0;
  const heavenAreaHeight = 2 * BEAD_H + GROUP_GAP;
  const earthAreaHeight = 4 * (BEAD_H + BEAD_GAP) + GROUP_GAP;

  return (
    <div
      className="relative flex flex-1 flex-col items-center"
      style={{ minWidth: ROD_MIN_W }}
      data-rod={rodIndex}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-zinc-400" />

      <div
        className="relative w-full cursor-pointer"
        style={{ height: heavenAreaHeight }}
        onClick={onToggleHeaven}
        data-bead="heaven"
      >
        <Bead top={heavenTop} active={heavenActive} />
      </div>

      <div className="h-[3px] w-full rounded-full bg-zinc-900" />

      <div className="relative w-full" style={{ height: earthAreaHeight }}>
        {[0, 1, 2, 3].map((i) => {
          const top = earthBeadTop(i, earthCount);
          return (
            <div
              key={i}
              className="absolute w-full cursor-pointer"
              style={{ top, height: BEAD_H + BEAD_GAP, transition: BEAD_TRANSITION }}
              onClick={() => onSetEarth(earthCount <= i ? i + 1 : i)}
              data-bead={`earth-${i}`}
            >
              <Bead top={0} active={i < earthCount} />
            </div>
          );
        })}
      </div>

      {isDecimalMarker && <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-900" />}
    </div>
  );
}

export default function Abacus({
  integerDigits,
  decimalPlaces = 0,
  onChange,
  disabled,
  onBeadMove,
}: AbacusProps) {
  const rodCount = integerDigits + decimalPlaces;
  const [heaven, setHeaven] = useState<boolean[]>(() => Array(rodCount).fill(false));
  const [earth, setEarth] = useState<number[]>(() => Array(rodCount).fill(0));

  const value = useMemo(() => {
    let v = 0;
    for (let i = 0; i < rodCount; i++) {
      const digit = (heaven[i] ? 5 : 0) + earth[i];
      const power = integerDigits - 1 - i;
      v += digit * Math.pow(10, power);
    }
    return Math.round(v * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  }, [heaven, earth, rodCount, integerDigits, decimalPlaces]);

  useEffect(() => {
    onChange(value);
  }, [value]);

  function toggleHeaven(i: number) {
    if (disabled) return;
    const newActive = !heaven[i];
    setHeaven((prev) => prev.map((v, idx) => (idx === i ? newActive : v)));
    onBeadMove?.(i, (newActive ? 5 : 0) + earth[i]);
  }

  function setEarthCount(i: number, count: number) {
    if (disabled) return;
    setEarth((prev) => prev.map((v, idx) => (idx === i ? count : v)));
    onBeadMove?.(i, (heaven[i] ? 5 : 0) + count);
  }

  return (
    <div className="w-full rounded-2xl border border-zinc-300 bg-white p-2.5 shadow-md">
      <div
        className="flex w-full justify-center gap-1 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-2"
        data-testid="abacus"
      >
        {Array.from({ length: rodCount }, (_, i) => (
          <Rod
            key={i}
            rodIndex={i}
            heavenActive={heaven[i]}
            earthCount={earth[i]}
            isDecimalMarker={decimalPlaces > 0 && i === integerDigits - 1}
            onToggleHeaven={() => toggleHeaven(i)}
            onSetEarth={(count) => setEarthCount(i, count)}
          />
        ))}
      </div>
    </div>
  );
}
