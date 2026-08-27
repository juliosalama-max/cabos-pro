import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  title,
  context,
  kicker,
  className,
  children,
}: {
  title?: string;
  context?: string;
  kicker?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("rounded-lg border border-border bg-surface p-5 shadow-card", className)}>
      {kicker ? (
        <p className="mb-1 text-label font-medium uppercase tracking-[0.1em] text-muted">{kicker}</p>
      ) : null}
      {title ? <h3 className="font-serif text-xl font-semibold tracking-tight text-fg">{title}</h3> : null}
      {context ? <p className="mt-1 text-sm text-muted">{context}</p> : null}
      <div className={title || context ? "mt-4" : undefined}>{children}</div>
    </section>
  );
}
