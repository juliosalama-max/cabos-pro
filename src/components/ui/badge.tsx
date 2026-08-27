import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "danger" | "warn";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-label font-medium tracking-[0.08em] uppercase",
        tone === "ok" && "bg-brand text-accent-fg",
        tone === "danger" && "bg-danger text-accent-fg",
        tone === "warn" && "bg-warn-dim text-warn",
        tone === "neutral" && "bg-secondary text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
