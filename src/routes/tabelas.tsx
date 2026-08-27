import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { TablesView } from "@/components/tables/tables-view";

export const Route = createFileRoute("/tabelas")({ component: Page });

function Page() {
  return (
    <AppShell>
      <TablesView />
    </AppShell>
  );
}
