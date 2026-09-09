import { Link, useRouterState } from "@tanstack/react-router";
import { Box, Cable, ClipboardList, Columns3, Cylinder, FileSpreadsheet, Folder, Printer, Scale } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AppMark } from "@/components/brand/app-mark";
import { HubMark } from "@/components/brand/hub-mark";
import { ProjectDrawer } from "@/components/project/project-drawer";
import { Button } from "@/components/ui/button";
import { InfoTip } from "@/components/ui/info-tip";
import { APP, AUTHOR } from "@/lib/brand";
import { cn } from "@/lib/utils";

const NAV = [
  {
    to: "/",
    label: "Circuito",
    icon: Cable,
    help: "Entradas do trecho: identificação, carga, método e fatores. O veredito à direita recalcula a cada alteração. O tipo define a seção mínima (Tab. 47).",
  },
  {
    to: "/eletroduto",
    label: "Eletroduto",
    icon: Cylinder,
    help: "Ocupação do eletroduto pelos Ø de catálogo. Limite 53 / 31 / 40 % conforme o número de cabos (NBR 5410 6.2.11). Pode trazer o circuito ativo.",
  },
  {
    to: "/eletrocalha",
    label: "Eletrocalha",
    icon: Columns3,
    help: "Seção da eletrocalha: área dos cabos ≤ 40 % e, sem tampa, camada única (Tab. 42). Método B1/B2/C/E/F conforme tipo e tampa.",
  },
  {
    to: "/envelope",
    label: "Envelope",
    icon: Box,
    help: "Dimensões A, B, C e D do envelope de concreto em função do Φ dos dutos. Independente do cálculo elétrico; usa o bitola do eletroduto se você enviar.",
  },
  {
    to: "/quadro",
    label: "Quadro",
    icon: ClipboardList,
    help: "Quadro de cargas: Ib × Fd por circuito e soma no ponto de origem. Confronta a demanda com o Iz do alimentador a montante.",
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
    help: "Memorial de cálculo para arquivo do projeto. Imprimir gera PDF pelo navegador; Copiar envia o HTML para o Word.",
  },
  {
    to: "/norma",
    label: "Norma",
    icon: Scale,
    help: "Premissas da NBR 5410:2004, limites de queda (6.2.7) e o que foi revisado na planilha original.",
  },
] as const;

function Credit() {
  return (
    <p className="border-t border-border px-2 pt-3 text-[11px] leading-relaxed text-muted">
      Criado por: {AUTHOR.name}
      <br />
      {AUTHOR.title} · CREA {AUTHOR.crea}
    </p>
  );
}

export function AppShell({
  children,
  aside,
  strip,
}: {
  children: ReactNode;
  aside?: ReactNode;
  strip?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [projectsOpen, setProjectsOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <ProjectDrawer open={projectsOpen} onClose={() => setProjectsOpen(false)} />
      <header className="no-print sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex min-h-[68px] max-w-[90rem] items-center gap-3 px-5 py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <AppMark />
            <span className="min-w-0">
              <span className="block font-display text-lg leading-none tracking-tight">{APP.name}</span>
              <span className="hidden truncate text-[13px] text-foreground/80 sm:block">{APP.subtitle}</span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-1.5">
            <a
              href={APP.hubUrl}
              aria-label="Voltar ao portal Engenharia Apps"
              title="Voltar ao portal"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card pl-1.5 pr-2.5"
            >
              <HubMark size={32} />
              <span className="hidden leading-tight sm:block">
                <span className="block font-display text-[13px] tracking-tight">{APP.hubName}</span>
                <span className="block text-[10px] text-muted">Voltar ao portal</span>
              </span>
            </a>
            <Button variant="outline" size="sm" className="h-8" onClick={() => setProjectsOpen(true)} aria-label="Projetos">
              <Folder />
              <span className="hidden sm:inline">Projetos</span>
            </Button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-5 py-2 lg:hidden">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-4 text-sm",
                  active ? "bg-primary text-primary-fg" : "text-muted hover:bg-surface-2",
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {strip ? <div className="px-3 pb-3 lg:hidden">{strip}</div> : null}
      </header>

      <div
        className={cn(
          "mx-auto grid max-w-[90rem] grid-cols-1",
          aside ? "lg:grid-cols-[16rem_minmax(0,1fr)_16rem]" : "lg:grid-cols-[16rem_minmax(0,1fr)]",
        )}
      >
        <aside className="no-print sticky top-[73px] hidden h-[calc(100dvh-73px)] flex-col overflow-y-auto border-r border-border p-3 lg:flex">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              return (
                <div
                  key={item.to}
                  className={cn(
                    "flex min-h-11 items-center rounded-lg pr-0.5",
                    active ? "bg-primary text-primary-fg" : "text-fg/80 hover:bg-surface-2",
                  )}
                >
                  <Link to={item.to} className="flex min-h-11 min-w-0 flex-1 items-center gap-2 px-3 text-sm">
                    <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                  <InfoTip
                    text={item.help}
                    side="right"
                    className={
                      active
                        ? "text-primary-fg/80 hover:bg-brand-hover hover:text-primary-fg"
                        : "text-muted hover:bg-surface-2 hover:text-fg"
                    }
                  />
                </div>
              );
            })}
          </nav>
          <div className="mt-auto">
            <Credit />
          </div>
        </aside>

        <main className="min-w-0 px-3 py-5 sm:px-6 sm:py-7">
          {children}
          <div className="no-print mt-10 lg:hidden">
            <Credit />
          </div>
        </main>

        {aside ? (
          <aside className="no-print hidden border-l border-border lg:block">
            <div className="sticky top-[73px] max-h-[calc(100dvh-73px)] overflow-y-auto p-5">{aside}</div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
