import { Plus, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { calculate } from "@/lib/nbr5410/calculate";
import { KIND_LABEL, type CircuitInput } from "@/lib/nbr5410/types";
import { cn } from "@/lib/utils";

export function CircuitList({
  circuits,
  activeId,
  onSelect,
  onAdd,
  onDuplicate,
  onRemove,
}: {
  circuits: CircuitInput[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDuplicate: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Card
      title="Circuitos"
      context="Lista repetível do memorial. O circuito ativo alimenta o veredito à direita."
    >
      <div className="mb-3 flex justify-end gap-1">
        <Button size="sm" variant="secondary" onClick={onAdd}>
          <Plus className="size-3.5" strokeWidth={1.75} />
          Adicionar circuito
        </Button>
        <Button size="sm" variant="ghost" onClick={onDuplicate} aria-label="Duplicar">
          <Copy className="size-3.5" strokeWidth={1.75} />
        </Button>
      </div>
      <ul className="flex flex-col gap-1">
        {circuits.map((c) => {
          const r = calculate(c);
          const active = c.id === activeId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left",
                  active ? "bg-brand-soft text-fg" : "hover:bg-surface-2",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {c.tag}{" "}
                    <span className="font-normal text-muted">
                      · {c.from} → {c.to}
                    </span>
                  </p>
                  <p className="truncate text-help text-subtle">
                    {KIND_LABEL[c.kind]} · {r.section ? `${r.nPerPhase}× ${r.section} mm² ${c.insulation}` : "sem seção"} ·{" "}
                    {c.voltage} V
                  </p>
                </div>
                <Badge tone={r.ok ? "ok" : "danger"}>{r.ok ? "Conforme" : "Revisar"}</Badge>
                {circuits.length > 1 ? (
                  <span
                    role="button"
                    tabIndex={0}
                    className="grid size-9 place-items-center text-subtle hover:text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(c.id);
                    }}
                    aria-label="Excluir circuito"
                  >
                    <Trash2 className="size-3.5" strokeWidth={1.75} />
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
