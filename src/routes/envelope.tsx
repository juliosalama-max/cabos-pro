import { createFileRoute } from "@tanstack/react-router";
import { EnvelopeForm, EnvelopeStrip, EnvelopeVerdict } from "@/components/install/envelope-view";
import { AppShell } from "@/components/layout/app-shell";
import { FALLBACK_ENVELOPE } from "@/lib/install/envelope";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/envelope")({ component: Page });

function Page() {
  const project = useApp((s) => s.project());
  const setEnvelope = useApp((s) => s.setEnvelope);
  const envelopeState = project.envelope ?? FALLBACK_ENVELOPE;

  return (
    <AppShell
      aside={<EnvelopeVerdict value={envelopeState} />}
      strip={<EnvelopeStrip value={envelopeState} />}
    >
      <EnvelopeForm value={envelopeState} onChange={(next) => setEnvelope(() => next)} />
    </AppShell>
  );
}