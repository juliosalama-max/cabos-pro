import { createFileRoute } from "@tanstack/react-router";
import { TrayForm, TrayStrip, TrayVerdict } from "@/components/install/tray-view";
import { AppShell } from "@/components/layout/app-shell";
import { FALLBACK_OCCUPY } from "@/lib/install/occupy";
import { FALLBACK_TRAY } from "@/lib/install/tray";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/eletrocalha")({ component: Page });

function Page() {
  const project = useApp((s) => s.project());
  const setTray = useApp((s) => s.setTray);
  const setCircuit = useApp((s) => s.setCircuit);
  const active = project.circuits.find((c) => c.id === project.activeId) ?? project.circuits[0];
  const trayState = project.tray ?? FALLBACK_TRAY;
  const occupyState = project.occupy ?? FALLBACK_OCCUPY;

  return (
    <AppShell
      aside={<TrayVerdict value={trayState} circuit={active} onApplyFa={(patch) => setCircuit(patch)} />}
      strip={<TrayStrip value={trayState} />}
    >
      <TrayForm
        value={trayState}
        onChange={(next) => setTray(() => next)}
        circuit={active}
        occupy={occupyState}
        circuits={project.circuits}
      />
    </AppShell>
  );
}
