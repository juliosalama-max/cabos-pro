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
        "inline-flex items-center rounded-full px-2 py-px text-[10px] font-medium leading-4 tracking-wide",
        tone === "ok" && "bg-ok text-primary-fg",
        tone === "danger" && "bg-danger text-primary-fg",
        tone === "warn" && "bg-warn-dim text-warn",
        tone === "neutral" && "bg-secondary text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
