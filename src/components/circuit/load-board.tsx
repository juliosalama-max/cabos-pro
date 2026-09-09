import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KIND_LABEL, type Project } from "@/lib/nbr5410/types";
import { loadBoard } from "@/lib/nbr5410/project-calc";
import { fmt, fmtA } from "@/lib/nbr5410/format";
import { EARTHING_LABEL } from "@/lib/nbr5410/extras";

export function LoadBoardView({ project }: { project: Project }) {
  const board = loadBoard(project);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-label font-medium uppercase tracking-[0.12em] text-muted">Demanda</p>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Quadro de cargas</h1>
        <p className="mt-1 text-sm text-muted">
          Soma dos circuitos no mesmo ponto de origem. Fd automático: 1,00; em dois ou mais motores no mesmo pai, o
          de maior Ib fica 1,00 e os demais 0,75. Origem {project.meta.origin === "transformador" ? "transformador" : "concessionária"}
          {" · "}
          {EARTHING_LABEL[project.meta.earthing ?? "TN-S"]}.
        </p>
      </div>

      <Card title="Totais na origem" context="Circuitos sem trecho a montante — o que o QGBT (ou a origem) alimenta.">
        <p className="font-serif text-2xl tabular-nums">{fmtA(board.totalId)}</p>
        <p className="mt-1 text-help text-muted">Σ Id = Σ (Ib × Fd) dos circuitos ligados à origem.</p>
      </Card>

      {board.groups.map((g) => (
        <div key={g.key} className="overflow-x-auto rounded-lg border border-border bg-surface shadow-card">
          <div className="flex items-start justify-between gap-3 px-4 pt-4">
            <div>
              <h2 className="font-serif text-lg font-semibold">{g.title}</h2>
              <p className="text-help text-muted">
                Σ Ib {fmtA(g.sumIb)} · Σ Id {fmtA(g.sumId)}
                {g.parentIz != null ? ` · Iz do montante ${fmtA(g.parentIz)}` : ""}
                {g.parentBreaker != null ? ` · In do montante ${g.parentBreaker} A` : ""}
              </p>
            </div>
            <Badge tone={g.ok ? "ok" : "danger"}>{g.ok ? "Demanda ok" : "Revisar montante"}</Badge>
          </div>
          <table className="mt-3 w-full min-w-[720px] text-xs">
            <thead className="text-left text-label uppercase tracking-wider text-muted">
              <tr className="border-y border-border">
                <th className="px-3 py-2">Circ.</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Trecho</th>
                <th className="px-3 py-2">Ib</th>
                <th className="px-3 py-2">Fd</th>
                <th className="px-3 py-2">Id</th>
                <th className="px-3 py-2">In</th>
                <th className="px-3 py-2">Seção</th>
              </tr>
            </thead>
            <tbody>
              {g.rows.map((row) => (
                <tr key={row.id} className="border-b border-border/60">
                  <td className="px-3 py-2 font-medium">{row.tag}</td>
                  <td className="px-3 py-2">{KIND_LABEL[row.kind]}</td>
                  <td className="px-3 py-2">
                    {row.from} → {row.to}
                  </td>
                  <td className="px-3 py-2 font-mono">{fmtA(row.ib)}</td>
                  <td className="px-3 py-2 font-mono">{fmt(row.fd, 2)}</td>
                  <td className="px-3 py-2 font-mono">{fmtA(row.idA)}</td>
                  <td className="px-3 py-2 font-mono">{row.breaker} A</td>
                  <td className="px-3 py-2 font-mono">{row.section} mm²</td>
                </tr>
              ))}
              <tr>
                <td className="px-3 py-2 font-medium" colSpan={3}>
                  Soma
                </td>
                <td className="px-3 py-2 font-mono">{fmtA(g.sumIb)}</td>
                <td className="px-3 py-2" />
                <td className="px-3 py-2 font-mono font-medium">{fmtA(g.sumId)}</td>
                <td className="px-3 py-2" colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
