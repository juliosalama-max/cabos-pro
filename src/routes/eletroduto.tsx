import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OccupyForm, OccupyStrip, OccupyVerdict } from "@/components/install/occupy-view";
import { AppShell } from "@/components/layout/app-shell";
import { envelopeFromPhi } from "@/lib/install/from-circuit";
import { FALLBACK_OCCUPY } from "@/lib/install/occupy";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/eletroduto")({ component: Page });

function Page() {
  const project = useApp((s) => s.project());
  const setOccupy = useApp((s) => s.setOccupy);
  const setEnvelope = useApp((s) => s.setEnvelope);
  const active = project.circuits.find((c) => c.id === project.activeId) ?? project.circuits[0];
  const navigate = useNavigate();
  const occupyState = project.occupy ?? FALLBACK_OCCUPY;

  return (
    <AppShell
      aside={
        <OccupyVerdict
          value={occupyState}
          circuit={active}
          onToEnvelope={(phi) => {
            setEnvelope(envelopeFromPhi(phi));
            void navigate({ to: "/envelope" });
          }}
        />
      }
      strip={<OccupyStrip value={occupyState} />}
    >
      <OccupyForm
          value={occupyState}
          onChange={(next) => setOccupy(() => next)}
          circuit={active}
          circuits={project.circuits}
        />
    </AppShell>
  );
}