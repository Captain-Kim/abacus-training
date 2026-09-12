type IconProps = { className?: string };

const base = "stroke-current fill-none";

export function IconPlus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" className={`${base} ${className ?? ""}`}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function IconMinus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" className={`${base} ${className ?? ""}`}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" className={`${base} ${className ?? ""}`}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function IconDivide({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" className={`${base} ${className ?? ""}`}>
      <circle cx="12" cy="6" r="1" fill="currentColor" stroke="none" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconChevronLeft({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className ?? ""}`}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className ?? ""}`}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className ?? ""}`}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function IconXCircle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className ?? ""}`}>
      <circle cx="12" cy="12" r="10" />
      <line x1="14.5" y1="9.5" x2="9.5" y2="14.5" />
      <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" />
    </svg>
  );
}

export function IconAbacus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className ?? ""}`}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" />
      <line x1="3" y1="14.5" x2="21" y2="14.5" />
      <circle cx="8" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="14" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="11" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
