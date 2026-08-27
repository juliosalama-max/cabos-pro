import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { MemoriaView } from "@/components/report/memoria";

export const Route = createFileRoute("/memoria")({ component: Page });

function Page() {
  return (
    <AppShell>
      <MemoriaView />
    </AppShell>
  );
}
