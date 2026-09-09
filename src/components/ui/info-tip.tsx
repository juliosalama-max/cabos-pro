import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export function InfoTip({
  text,
  className,
  side = "top",
}: {
  text: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const gap = 8;
    if (side === "right") setPos({ top: r.top, left: r.right + gap });
    else if (side === "left") setPos({ top: r.top, left: Math.max(8, r.left - 288 - gap) });
    else if (side === "bottom") setPos({ top: r.bottom + gap, left: r.left });
    else setPos({ top: Math.max(8, r.top - gap), left: r.left });
  }, [open, side]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label="Ajuda"
        className={cn(
          "grid size-7 shrink-0 cursor-help place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg",
          className,
        )}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <CircleHelp className="size-3.5" strokeWidth={1.75} />
      </button>
      {open
        ? createPortal(
            <div
              role="tooltip"
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                transform: side === "top" ? "translateY(-100%)" : undefined,
                zIndex: 80,
              }}
              className="max-w-72 rounded-md bg-ink px-3 py-2 text-xs leading-relaxed text-paper shadow-card"
            >
              {text}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
