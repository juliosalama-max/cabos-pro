import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { InfoTip } from "@/components/ui/info-tip";

export function Field({
  label,
  hint,
  info,
  className,
  children,
}: {
  label: string;
  hint?: string;
  info?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1 min-w-0", className)}>
      <div className="flex items-center gap-1">
        <span className="text-label font-medium uppercase tracking-[0.1em] text-muted">{label}</span>
        {info ? <InfoTip text={info} /> : null}
      </div>
      {children}
      {hint ? <span className="text-help text-subtle">{hint}</span> : null}
    </div>
  );
}

const control =
  "h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-subtle disabled:opacity-60";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, props.className)} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(control, "pr-8", className)}>
      {children}
    </select>
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, "h-auto min-h-20 py-2", props.className)} />;
}

export function Readout({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        control,
        "h-auto min-h-11 flex flex-wrap items-center gap-x-2 gap-y-0.5 py-2 overflow-hidden bg-surface-2",
      )}
    >
      {children}
    </div>
  );
}
