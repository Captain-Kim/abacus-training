import { Operand, VerticalDisplay as VerticalDisplayType } from "@/lib/types";

function formatOperand(op: Operand): string {
  const formatted =
    op.unit === "원"
      ? op.value.toLocaleString("ko-KR")
      : op.value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  return `${formatted}${op.unit ?? ""}`;
}

interface VerticalDisplayProps extends VerticalDisplayType {
  highlight?: { operandIndex: number; digitIndex: number } | null;
}

function renderOperand(op: Operand, highlightDigitIndex: number | undefined) {
  const formatted = formatOperand(op);
  let digitCounter = -1;
  return formatted.split("").map((ch, idx) => {
    const isDigit = ch >= "0" && ch <= "9";
    if (isDigit) digitCounter++;
    const isHighlighted = isDigit && digitCounter === highlightDigitIndex;
    return (
      <span
        key={idx}
        className={
          isHighlighted
            ? "animate-pulse rounded bg-neutral-900 px-0.5 text-white"
            : undefined
        }
      >
        {ch}
      </span>
    );
  });
}

export default function VerticalDisplay({ operator, operands, highlight }: VerticalDisplayProps) {
  return (
    <div className="flex flex-col items-end gap-1 font-mono">
      {operands.map((op, i) => (
        <div key={i} className="flex items-baseline gap-2 text-2xl font-bold text-neutral-900">
          <span className="w-4 text-right text-neutral-300">{i === 0 ? "" : operator}</span>
          <span>
            {renderOperand(
              op,
              highlight?.operandIndex === i ? highlight.digitIndex : undefined
            )}
          </span>
        </div>
      ))}
      <div className="mt-1 h-[2px] w-full bg-neutral-900" />
    </div>
  );
}
