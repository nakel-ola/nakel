import { cn } from "@/lib/utils";

type Props = {
  /** Vertical line positions, as % of the width. */
  x: number[];
  /** Horizontal line positions, as % of the height. */
  y: number[];
  className?: string;
};

/** Hairline layout grid with a "+" at every crossing, like a designer's artboard. */
export const GridLines = ({ x, y, className }: Props) => (
  <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
    {x.map((p) => (
      <span
        key={`x${p}`}
        className="grid-v absolute inset-y-0 w-px origin-top bg-current opacity-20"
        style={{ left: `${p}%` }}
      />
    ))}
    {y.map((p) => (
      <span
        key={`y${p}`}
        className="grid-h absolute inset-x-0 h-px origin-left bg-current opacity-20"
        style={{ top: `${p}%` }}
      />
    ))}
    {x.flatMap((px) =>
      y.map((py) => (
        <span
          key={`c${px}-${py}`}
          className="grid-cross absolute -ml-[6px] -mt-[6px] h-3 w-3"
          style={{ left: `${px}%`, top: `${py}%` }}
        >
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current opacity-80" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current opacity-80" />
        </span>
      ))
    )}
  </div>
);
