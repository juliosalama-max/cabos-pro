import { Cable } from "lucide-react";
import { cn } from "@/lib/utils";

/** Marca do CABOS Pro: azulejo teal + cabo. */
export function AppMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-[7px] bg-primary text-primary-fg",
        className,
      )}
    >
      <Cable className="size-5" strokeWidth={1.75} />
    </span>
  );
}
