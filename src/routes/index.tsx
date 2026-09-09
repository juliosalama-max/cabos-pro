import { createFileRoute } from "@tanstack/react-router";
import { CircuitForm } from "@/components/circuit/circuit-form";
import { CircuitList } from "@/components/circuit/circuit-list";
import { ResultsPanel, VerdictStrip } from "@/components/circuit/results-panel";
import { AppShell } from "@/components/layout/app-shell";
import { ProjectHeader } from "@/components/project/project-header";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const project = useApp((s) => s.project());
  const setMeta = useApp((s) => s.setMeta);
  const setCircuit = useApp((s) => s.setCircuit);
  const addCircuit = useApp((s) => s.addCircuit);
  const duplicateCircuit = useApp((s) => s.duplicateCircuit);
  const removeCircuit = useApp((s) => s.removeCircuit);
  const selectCircuit = useApp((s) => s.selectCircuit);
  const active = project.circuits.find((c) => c.id === project.activeId) ?? project.circuits[0];

  if (!active) {
    return (
      <AppShell>
        <p className="text-sm text-muted">Nenhum circuito neste projeto.</p>
      </AppShell>
    );
  }

  return (
    <AppShell
      aside={<ResultsPanel input={active} circuits={project.circuits} origin={project.meta.origin} />}
      strip={<VerdictStrip input={active} circuits={project.circuits} origin={project.meta.origin} />}
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm text-muted">
            {project.meta.name} · {active.tag}
          </p>
        </div>
        <ProjectHeader meta={project.meta} onChange={setMeta} />
        <CircuitList
          circuits={project.circuits}
          activeId={active.id}
          onSelect={selectCircuit}
          onAdd={() => addCircuit()}
          onDuplicate={duplicateCircuit}
          onRemove={removeCircuit}
        />
        <CircuitForm value={active} circuits={project.circuits} onChange={setCircuit} />
      </div>
    </AppShell>
  );
}
