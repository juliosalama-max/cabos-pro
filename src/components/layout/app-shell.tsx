import { Link, useRouterState } from "@tanstack/react-router";
import { Cable, FileSpreadsheet, Folder, Printer, Save, Scale } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AccountMenu } from "@/components/auth/account-menu";
import { WorkspaceSync } from "@/components/auth/workspace-sync";
import { ProjectDrawer } from "@/components/project/project-drawer";
import { Button } from "@/components/ui/button";
import { InfoTip } from "@/components/ui/info-tip";
import { LoginScreen } from "@/components/auth/login-screen";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { APP, AUTHOR } from "@/lib/brand";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { saveWorkspace } from "@/lib/workspace";

const NAV = [
  {
    to: "/",
    label: "Circuito",
    icon: Cable,
    help: "Entradas do trecho: identificação, carga, método e fatores. O veredito à direita recalcula a cada alteração. O tipo define a seção mínima (Tab. 47).",
  },
  {
    to: "/tabelas",
    label: "Tabelas NBR",
    icon: FileSpreadsheet,
    help: "Consulta das tabelas de capacidade de condução, temperatura e agrupamento. Não altera o circuito ativo.",
  },
  {
    to: "/memoria",
    label: "Memória",
    icon: Printer,
    help: "Memorial de cálculo para arquivo do projeto. Imprimir gera PDF pelo navegador; Copiar envia o texto.",
  },
  {
    to: "/norma",
    label: "Norma",
    icon: Scale,
    help: "Premissas da NBR 5410:2004, limites de queda (6.2.7) e o que foi revisado na planilha original.",
  },
] as const;

export function AppShell({
  children,
  aside,
  strip,
}: {
  children: ReactNode;
  aside?: ReactNode;
  strip?: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const name = useApp((s) => s.project().meta.name);
  const setMeta = useApp((s) => s.setMeta);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [savedFlash, setSavedFlash] = useState<"ok" | "err" | null>(null);

  useEffect(() => setReady(true), []);

  async function save() {
    setMeta({});
    try {
      const s = useApp.getState();
      await saveWorkspace({ data: { projects: s.projects, currentId: s.currentId } });
      setSavedFlash("ok");
    } catch {
      setSavedFlash("err");
    }
    window.setTimeout(() => setSavedFlash(null), 1800);
  }

  if (isPending) return <LoginScreen pending />;
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <WorkspaceSync />
      <ProjectDrawer open={projectsOpen} onClose={() => setProjectsOpen(false)} />
      <header className="no-print sticky top-0 z-30 border-b border-border bg-surface">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-fg">
              <Cable className="size-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-lg font-semibold leading-tight tracking-tight">{APP.name}</span>
              <span className="hidden text-xs text-muted sm:block">{APP.subtitle}</span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {savedFlash === "ok" ? (
              <span className="hidden text-xs text-ok sm:inline">Salvo na sua conta</span>
            ) : null}
            {savedFlash === "err" ? (
              <span className="hidden text-xs text-danger sm:inline">Não foi possível salvar</span>
            ) : null}
            <a
              href={APP.hubUrl}
              className="hidden h-11 items-center px-2 text-sm text-muted hover:text-fg md:inline-flex"
            >
              Portal
            </a>
            <Button variant="outline" onClick={() => setProjectsOpen(true)} aria-label="Projetos">
              <Folder className="size-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">Projetos</span>
            </Button>
            <Button onClick={() => void save()} aria-label="Salvar">
              <Save className="size-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">Salvar</span>
            </Button>
            <AccountMenu />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-5 pb-3 md:hidden">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm",
                  active ? "bg-primary text-primary-fg" : "bg-surface-2 text-muted",
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {strip ? <div className="px-5 pb-3 lg:hidden">{strip}</div> : null}
      </header>

      <div className="mx-auto flex max-w-[1480px]">
        <aside className="no-print sticky top-[4.75rem] hidden h-[calc(100dvh-4.75rem)] w-60 shrink-0 flex-col border-r border-border bg-surface p-4 md:flex">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              return (
                <div
                  key={item.to}
                  className={cn(
                    "flex items-center rounded-lg pr-0.5",
                    active ? "bg-primary text-primary-fg" : "text-fg hover:bg-surface-2",
                  )}
                >
                  <Link to={item.to} className="flex h-11 min-w-0 flex-1 items-center gap-2 px-3 text-sm">
                    <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                  <InfoTip
                    text={item.help}
                    className={
                      active
                        ? "text-primary-fg/90 hover:bg-brand-hover hover:text-primary-fg"
                        : "text-fg/70 hover:bg-brand-soft hover:text-primary"
                    }
                  />
                </div>
              );
            })}
          </nav>
          <p className="mt-auto px-2 pb-2 text-help leading-relaxed text-muted">{AUTHOR.line}</p>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-6">
          <p className="mb-4 truncate text-sm text-muted">{ready ? name : "…"}</p>
          {children}
        </main>

        {aside ? (
          <aside className="no-print hidden w-[280px] shrink-0 border-l border-border bg-surface lg:block">
            <div className="sticky top-[4.75rem] p-5">{aside}</div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
