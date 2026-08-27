import { useState } from "react";
import { Check, Copy, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculate } from "@/lib/nbr5410/calculate";
import { cableSpec, fmt, fmtA } from "@/lib/nbr5410/format";
import { KIND_LABEL, type Project } from "@/lib/nbr5410/types";
import { METHOD_INFO } from "@/lib/nbr5410/tables";
import { useApp } from "@/lib/store";
import { AUTHOR } from "@/lib/brand";

function buildMemoriaText(project: Project): string {
  const results = project.circuits.map((c) => ({ c, r: calculate(c) }));
  const lines: string[] = [
    "CONDUTORES — MEMÓRIA DE CÁLCULO",
    "Dimensionamento de condutores · ABNT NBR 5410:2004",
    AUTHOR.line,
    "",
    `Projeto: ${project.meta.name}`,
    `Cliente: ${project.meta.client || "—"}`,
    `Local: ${project.meta.location || "—"}`,
    `Responsável: ${project.meta.responsible || "—"}`,
    `CREA: ${project.meta.crea || "—"}`,
  ];
  if (project.meta.notes) lines.push(`Observações: ${project.meta.notes}`);
  lines.push("", "RESUMO");
  for (const { c, r } of results) {
    lines.push(
      `${c.tag}  ${c.from} → ${c.to}  Ib ${fmtA(r.ib)}  ${cableSpec(r.nPerPhase, c.formation, r.section, c.insulation)}  In ${r.breaker} A  ΔV ${fmt(r.dropPct, 2)} %  ${r.ok ? "OK" : "REVISAR"}`,
    );
  }
  for (const { c, r } of results) {
    lines.push(
      "",
      `── ${c.tag} · ${KIND_LABEL[c.kind]} ──`,
      `${c.from} → ${c.to} · ${c.voltage} V · ${c.phases}φ · ${c.lengthM} m · ${METHOD_INFO[c.method].name}`,
      `Ib ${fmtA(r.ib)} · I′p ${fmtA(r.ip)} · Fa ${fmt(r.fa, 2)} · Ft ${fmt(r.ft, 2)} · Fr ${fmt(r.fr, 2)}`,
      cableSpec(r.nPerPhase, c.formation, r.section, c.insulation),
      `Iz ${fmtA(r.iz)} · In ${r.breaker} A · PE ${r.pe} mm²`,
      `Rca ${fmt(r.rca, 3)} Ω/km · XL ${fmt(r.xl, 3)} Ω/km`,
      `ΔV NBR ${fmt(r.dropPct, 2)} % (R cosφ + X senφ) · |Z| ${fmt(r.dropModulusPct, 2)} % · máx. ${c.maxDropPct} %`,
      `Icc ${fmt(r.iscLocalKa, 2)} kA · Icw ${fmt(r.icwKa, 1)} kA · eletroduto ${r.conduit ?? "—"}`,
    );
    for (const chk of r.checks) {
      lines.push(`${chk.ok ? "OK" : "X"} — ${chk.label}: ${chk.detail} (${chk.ref})`);
    }
    if (c.notes) lines.push(`Notas: ${c.notes}`);
  }
  lines.push("", AUTHOR.line);
  return lines.join("\n");
}

export function MemoriaView() {
  const project = useApp((s) => s.project());
  const results = project.circuits.map((c) => ({ c, r: calculate(c) }));
  const [copied, setCopied] = useState(false);

  async function copyMemoria() {
    const text = buildMemoriaText(project);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="no-print flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-label font-medium uppercase tracking-[0.12em] text-muted">Documento</p>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">Memória de cálculo</h1>
          <p className="mt-1 text-sm text-muted">Documento para arquivo do projeto. Use imprimir para PDF ou copie o texto.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={copyMemoria}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copiado" : "Copiar"}
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="size-4" /> Imprimir / PDF
          </Button>
        </div>
      </div>

      <header className="rounded-lg border border-border bg-surface p-5 shadow-card print:shadow-none">
        <p className="text-label uppercase tracking-[0.1em] text-muted">Condutores · NBR 5410:2004</p>
        <h2 className="mt-1 font-serif text-xl font-semibold">{project.meta.name}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-4">
          <div>
            <dt className="text-muted">Cliente</dt>
            <dd>{project.meta.client || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">Local</dt>
            <dd>{project.meta.location || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">Responsável</dt>
            <dd>{project.meta.responsible || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted">CREA</dt>
            <dd>{project.meta.crea || "—"}</dd>
          </div>
        </dl>
        {project.meta.notes ? <p className="mt-3 text-sm text-muted">{project.meta.notes}</p> : null}
        <p className="mt-4 text-xs text-subtle">{AUTHOR.line}</p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-card print:shadow-none">
        <table className="w-full min-w-[900px] text-xs">
          <thead className="text-left text-label uppercase tracking-wider text-muted">
            <tr className="border-b border-border">
              <th className="px-3 py-2">Circ.</th>
              <th className="px-3 py-2">Trecho</th>
              <th className="px-3 py-2">Ib</th>
              <th className="px-3 py-2">Cabo</th>
              <th className="px-3 py-2">In</th>
              <th className="px-3 py-2">ΔV</th>
              <th className="px-3 py-2">Icc</th>
              <th className="px-3 py-2">Ø</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ c, r }) => (
              <tr key={c.id} className="border-b border-border/60">
                <td className="px-3 py-2 font-medium">{c.tag}</td>
                <td className="px-3 py-2">
                  {c.from} → {c.to}
                </td>
                <td className="px-3 py-2 font-mono">{fmtA(r.ib)}</td>
                <td className="px-3 py-2">{cableSpec(r.nPerPhase, c.formation, r.section, c.insulation)}</td>
                <td className="px-3 py-2 font-mono">{r.breaker} A</td>
                <td className="px-3 py-2 font-mono">{fmt(r.dropPct, 2)} %</td>
                <td className="px-3 py-2 font-mono">{fmt(r.iscLocalKa, 2)} kA</td>
                <td className="px-3 py-2">{r.conduit ?? "—"}</td>
                <td className="px-3 py-2">{r.ok ? "OK" : "Revisar"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.map(({ c, r }) => (
        <article
          key={c.id}
          className="break-inside-avoid rounded-lg border border-border bg-surface p-5 shadow-card print:shadow-none"
        >
          <h3 className="font-serif text-lg font-semibold">
            {c.tag} · {KIND_LABEL[c.kind]}
          </h3>
          <p className="text-sm text-muted">
            {c.from} → {c.to} · {c.voltage} V · {c.phases}φ · {c.lengthM} m · {METHOD_INFO[c.method].name}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            <p>
              Ib {fmtA(r.ib)} · I′p {fmtA(r.ip)}
            </p>
            <p>
              Fa {fmt(r.fa, 2)} · Ft {fmt(r.ft, 2)} · Fr {fmt(r.fr, 2)}
            </p>
            <p>{cableSpec(r.nPerPhase, c.formation, r.section, c.insulation)}</p>
            <p>
              Iz {fmtA(r.iz)} · In {r.breaker} A · PE {r.pe} mm²
            </p>
            <p>
              Rca {fmt(r.rca, 3)} Ω/km · XL {fmt(r.xl, 3)}
            </p>
            <p>
              ΔV NBR {fmt(r.dropPct, 2)} % · |Z| {fmt(r.dropModulusPct, 2)} % (máx. {c.maxDropPct} %)
            </p>
            <p>
              Icc {fmt(r.iscLocalKa, 2)} kA · Icw {fmt(r.icwKa, 1)} kA
            </p>
            <p>Eletroduto {r.conduit ?? "—"}</p>
          </div>
          <ul className="mt-3 space-y-1 text-xs text-muted">
            {r.checks.map((chk) => (
              <li key={chk.id}>
                {chk.ok ? "OK" : "X"} — {chk.label}: {chk.detail} ({chk.ref})
              </li>
            ))}
          </ul>
          {c.notes ? <p className="mt-2 text-xs italic text-subtle">{c.notes}</p> : null}
        </article>
      ))}

      <p className="text-xs text-subtle print:mt-6">{AUTHOR.line}</p>
    </div>
  );
}
