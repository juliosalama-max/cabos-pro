import * as Popover from "@radix-ui/react-popover";
import { CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";

export function InfoTip({ text, className }: { text: string; className?: string }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "relative grid size-7 shrink-0 place-items-center rounded-full text-muted hover:bg-brand-soft hover:text-brand after:absolute after:top-1/2 after:left-1/2 after:size-9 after:-translate-x-1/2 after:-translate-y-1/2",
            className,
          )}
          aria-label="Ajuda"
        >
          <CircleHelp className="size-4" strokeWidth={1.75} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={12}
          className="z-50 max-w-80 rounded-md border border-border bg-surface p-3 text-help leading-relaxed text-fg whitespace-pre-line shadow-card outline-none"
        >
          {text}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
