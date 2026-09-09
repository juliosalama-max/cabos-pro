import { createFileRoute } from "@tanstack/react-router";
import { LoadBoardView } from "@/components/circuit/load-board";
import { AppShell } from "@/components/layout/app-shell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/quadro")({ component: Page });

function Page() {
  const project = useApp((s) => s.project());
  return (
    <AppShell>
      <LoadBoardView project={project} />
    </AppShell>
  );
}
