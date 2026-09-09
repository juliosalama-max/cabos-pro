import { useState } from "react";
import { Check, Copy, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculate } from "@/lib/nbr5410/calculate";
import { cableSpec, fmt, fmtA } from "@/lib/nbr5410/format";
import { bom, dropChain } from "@/lib/nbr5410/project-calc";
import { KIND_LABEL, type Project } from "@/lib/nbr5410/types";
import { METHOD_INFO } from "@/lib/nbr5410/tables";
import { useApp } from "@/lib/store";
import { AUTHOR } from "@/lib/brand";

function originLabel(origin: Project["meta"]["origin"]): string {
  return origin === "transformador" ? "transformador / gerador do consumidor" : "concessionária";
}

function spec(c: Project["circuits"][number], r: ReturnType<typeof calculate>): string {
  return cableSpec(r.nPerPhase, c.formation, r.section, c.insulation, c.conductor);
}

function buildMemoriaText(project: Project): string {
  const results = project.circuits.map((c) => ({ c, r: calculate(c) }));
  const materials = bom(project);
  const lines: string[] = [
    "CABOS Pro — MEMÓRIA DE CÁLCULO",
    "Dimensionamento de condutores · ABNT NBR 5410:2004",
    AUTHOR.line,
    "",
    `Projeto: ${project.meta.name}`,
    `Cliente: ${project.meta.client || "—"}`,
    `Local: ${project.meta.location || "—"}`,
    `Responsável: ${project.meta.responsible || "—"}`,
    `CREA: ${project.meta.crea || "—"}`,
    `Origem: ${originLabel(project.meta.origin)}`,
  ];
  if (project.meta.notes) lines.push(`Observações: ${project.meta.notes}`);
  lines.push("", "RESUMO");
  for (const { c, r } of results) {
    const chain = dropChain(project.circuits, c.id, project.meta.origin);
    lines.push(
      `${c.tag}  ${c.from} → ${c.to}  Ib ${fmtA(r.ib)}  ${spec(c, r)}  In ${r.breaker} A  ΔV ${fmt(r.dropPct, 2)} %  acum. ${fmt(chain.totalPct, 2)} %  ${r.ok && chain.ok ? "OK" : "REVISAR"}`,
    );
  }
  lines.push("", "LISTA DE MATERIAIS");
  for (const row of materials) {
    lines.push(`${row.item}  ${row.qty}  ${row.note}`);
  }
  for (const { c, r } of results) {
    const chain = dropChain(project.circuits, c.id, project.meta.origin);
    lines.push(
      "",
      `── ${c.tag} · ${KIND_LABEL[c.kind]} ──`,
      `${c.from} → ${c.to} · ${c.voltage} V · ${c.phases}φ · ${c.lengthM} m · ${METHOD_INFO[c.method].name} · ${c.conductor ?? "Cu"}`,
      `Ib ${fmtA(r.ib)} · I′p ${fmtA(r.ip)} · Fa ${fmt(r.fa, 2)} · Ft ${fmt(r.ft, 2)} · Fs ${fmt(r.fs, 2)} · Fh ${fmt(r.fh, 2)} · Fr ${fmt(r.fr, 2)}`,
      spec(c, r),
      `Iz ${fmtA(r.iz)} · In ${r.breaker} A · PE ${r.pe} mm² · Icw PE ${fmt(r.peIcwKa, 1)} kA · Ia ${fmtA(r.iaA)}`,
      `Rca ${fmt(r.rca, 3)} Ω/km · XL ${fmt(r.xl, 3)} Ω/km`,
      `ΔV trecho ${fmt(r.dropPct, 2)} % · ΔV acum. ${fmt(chain.totalPct, 2)} % (teto ${fmt(chain.limit, 0)} %) · |Z| ${fmt(r.dropModulusPct, 2)} %`,
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

function esc(s: string) {
  return s
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}

function buildMemoriaHtml(project: Project): string {
  const results = project.circuits.map((c) => ({ c, r: calculate(c) }));
  const materials = bom(project);
  const rows = results
    .map(({ c, r }) => {
      const chain = dropChain(project.circuits, c.id, project.meta.origin);
      return `<tr>
          <td>${esc(c.tag)}</td>
          <td>${esc(`${c.from} → ${c.to}`)}</td>
          <td>${esc(fmtA(r.ib))}</td>
          <td>${esc(spec(c, r))}</td>
          <td>${r.breaker} A</td>
          <td>${esc(fmt(r.dropPct, 2))} %</td>
          <td>${esc(fmt(chain.totalPct, 2))} %</td>
          <td>${esc(fmt(r.iscLocalKa, 2))} kA</td>
          <td>${esc(r.conduit ?? "—")}</td>
          <td>${r.ok && chain.ok ? "Conforme" : "Revisar"}</td>
        </tr>`;
    })
    .join("");
  const bomRows = materials
    .map((row) => `<tr><td>${esc(row.item)}</td><td>${esc(row.qty)}</td><td>${esc(row.note)}</td></tr>`)
    .join("");
  const details = results
    .map(({ c, r }) => {
      const chain = dropChain(project.circuits, c.id, project.meta.origin);
      const checks = r.checks
        .map((chk) => `<p>${chk.ok ? "OK" : "X"} — ${esc(chk.label)}: ${esc(chk.detail)} (${esc(chk.ref)})</p>`)
        .join("");
      return `<h2>${esc(c.tag)} · ${esc(KIND_LABEL[c.kind])}</h2>
        <p>${esc(c.from)} → ${esc(c.to)} · ${c.voltage} V · ${c.phases}φ · ${c.lengthM} m · ${esc(METHOD_INFO[c.method].name)} · ${esc(c.conductor ?? "Cu")}</p>
        <p>Ib ${esc(fmtA(r.ib))} · I′p ${esc(fmtA(r.ip))} · Fa ${esc(fmt(r.fa, 2))} · Ft ${esc(fmt(r.ft, 2))} · Fs ${esc(fmt(r.fs, 2))} · Fh ${esc(fmt(r.fh, 2))} · Fr ${esc(fmt(r.fr, 2))}</p>
        <p>${esc(spec(c, r))} · Iz ${esc(fmtA(r.iz))} · In ${r.breaker} A · PE ${r.pe} mm² · Icw PE ${esc(fmt(r.peIcwKa, 1))} kA</p>
        <p>ΔV trecho ${esc(fmt(r.dropPct, 2))} % · ΔV acum. ${esc(fmt(chain.totalPct, 2))} % (teto ${esc(fmt(chain.limit, 0))} %) · |Z| ${esc(fmt(r.dropModulusPct, 2))} %</p>
        <p>Icc ${esc(fmt(r.iscLocalKa, 2))} kA · Icw ${esc(fmt(r.icwKa, 1))} kA · Ia ${esc(fmtA(r.iaA))} · eletroduto ${esc(r.conduit ?? "—")}</p>
        ${checks}
        ${c.notes ? `<p><i>${esc(c.notes)}</i></p>` : ""}`;
    })
    .join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1C1A16;line-height:1.45}
    h1,h2{font-family:Calibri,Arial,sans-serif;font-weight:700}
    p{margin:0 0 8pt}
    table{border-collapse:collapse;width:100%;margin:12pt 0}
    th,td{border:1px solid #DDD4C4;padding:4pt 6pt;text-align:left;font-size:10pt}
    th{background:#FAF6EE}
  </style></head><body>
    <h1>CABOS Pro — Memória de cálculo</h1>
    <p>Dimensionamento de condutores · ABNT NBR 5410:2004</p>
    <p>${esc(AUTHOR.line)}</p>
    <p>Projeto: ${esc(project.meta.name)} · Cliente: ${esc(project.meta.client || "—")} · Local: ${esc(project.meta.location || "—")}</p>
    <p>Responsável: ${esc(project.meta.responsible || "—")} · CREA: ${esc(project.meta.crea || "—")} · Origem: ${esc(originLabel(project.meta.origin))}</p>
    ${project.meta.notes ? `<p>Observações: ${esc(project.meta.notes)}</p>` : ""}
    <table><thead><tr><th>Circ.</th><th>Trecho</th><th>Ib</th><th>Cabo</th><th>In</th><th>ΔV</th><th>ΔV acum.</th><th>Icc</th><th>Ø</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
    <h2>Lista de materiais</h2>
    <table><thead><tr><th>Item</th><th>Quantidade</th><th>Nota</th></tr></thead><tbody>${bomRows}</tbody></table>
    ${details}
    <p>${esc(AUTHOR.line)}</p>
  </body></html>`;
}

export function MemoriaView() {
  const project = useApp((s) => s.project());
  const results = project.circuits.map((c) => ({ c, r: calculate(c) }));
  const materials = bom(project);
  const [copied, setCopied] = useState(false);

  async function copyMemoria() {
    const text = buildMemoriaText(project);
    const html = buildMemoriaHtml(project);
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
    } catch {
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
          <Button onClick={copyMemoria}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copiado" : "Copiar memória"}
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="size-4" /> Imprimir memória
          </Button>
        </div>
      </div>

      <header className="rounded-lg border border-border bg-surface p-5 shadow-card print:shadow-none">
        <p className="text-label uppercase tracking-[0.1em] text-muted">CABOS Pro · NBR 5410</p>
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
          <div className="md:col-span-2">
            <dt className="text-muted">Origem da instalação</dt>
            <dd>{originLabel(project.meta.origin)}</dd>
          </div>
        </dl>
        {project.meta.notes ? <p className="mt-3 text-sm text-muted">{project.meta.notes}</p> : null}
        <p className="mt-4 text-[11px] text-muted">
          Criado por: {AUTHOR.name}
          <br />
          {AUTHOR.title} · CREA {AUTHOR.crea}
        </p>
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
              <th className="px-3 py-2">ΔV acum.</th>
              <th className="px-3 py-2">Icc</th>
              <th className="px-3 py-2">Ø</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ c, r }) => {
              const chain = dropChain(project.circuits, c.id, project.meta.origin);
              return (
                <tr key={c.id} className="border-b border-border/60">
                  <td className="px-3 py-2 font-medium">{c.tag}</td>
                  <td className="px-3 py-2">
                    {c.from} → {c.to}
                  </td>
                  <td className="px-3 py-2 font-mono">{fmtA(r.ib)}</td>
                  <td className="px-3 py-2">{spec(c, r)}</td>
                  <td className="px-3 py-2 font-mono">{r.breaker} A</td>
                  <td className="px-3 py-2 font-mono">{fmt(r.dropPct, 2)} %</td>
                  <td className="px-3 py-2 font-mono">{fmt(chain.totalPct, 2)} %</td>
                  <td className="px-3 py-2 font-mono">{fmt(r.iscLocalKa, 2)} kA</td>
                  <td className="px-3 py-2">{r.conduit ?? "—"}</td>
                  <td className="px-3 py-2">{r.ok && chain.ok ? "OK" : "Revisar"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-card print:shadow-none">
        <h3 className="px-4 pt-4 font-serif text-lg font-semibold">Lista de materiais</h3>
        <table className="mt-2 w-full min-w-[640px] text-xs">
          <thead className="text-left text-label uppercase tracking-wider text-muted">
            <tr className="border-b border-border">
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Quantidade</th>
              <th className="px-3 py-2">Nota</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((row) => (
              <tr key={`${row.item}-${row.qty}`} className="border-b border-border/60">
                <td className="px-3 py-2">{row.item}</td>
                <td className="px-3 py-2 font-mono">{row.qty}</td>
                <td className="px-3 py-2 text-muted">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.map(({ c, r }) => {
        const chain = dropChain(project.circuits, c.id, project.meta.origin);
        return (
          <article
            key={c.id}
            className="break-inside-avoid rounded-lg border border-border bg-surface p-5 shadow-card print:shadow-none"
          >
            <h3 className="font-serif text-lg font-semibold">
              {c.tag} · {KIND_LABEL[c.kind]}
            </h3>
            <p className="text-sm text-muted">
              {c.from} → {c.to} · {c.voltage} V · {c.phases}φ · {c.lengthM} m · {METHOD_INFO[c.method].name} ·{" "}
              {c.conductor ?? "Cu"}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
              <p>
                Ib {fmtA(r.ib)} · I′p {fmtA(r.ip)}
              </p>
              <p>
                Fa {fmt(r.fa, 2)} · Ft {fmt(r.ft, 2)} · Fs {fmt(r.fs, 2)} · Fh {fmt(r.fh, 2)}
              </p>
              <p>{spec(c, r)}</p>
              <p>
                Iz {fmtA(r.iz)} · In {r.breaker} A · PE {r.pe} mm²
              </p>
              <p>
                Rca {fmt(r.rca, 3)} Ω/km · XL {fmt(r.xl, 3)}
              </p>
              <p>
                ΔV trecho {fmt(r.dropPct, 2)} % · acum. {fmt(chain.totalPct, 2)} % (teto {fmt(chain.limit, 0)} %)
              </p>
              <p>
                Icc {fmt(r.iscLocalKa, 2)} kA · Icw {fmt(r.icwKa, 1)} kA · PE {fmt(r.peIcwKa, 1)} kA
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
        );
      })}

      <p className="text-[11px] text-muted print:mt-6">
        Criado por: {AUTHOR.name}
        <br />
        {AUTHOR.title} · CREA {AUTHOR.crea}
      </p>
    </div>
  );
}
