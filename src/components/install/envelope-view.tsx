import { Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ENVELOPE_MAX,
  ENVELOPE_MIN,
  ENVELOPE_PHI,
  addCol,
  addRow,
  defaultEnvelope,
  emptyEnvelope,
  envelope,
  exampleEnvelope1,
  fmtPhi,
  gridSize,
  phiOdMm,
  removeCol,
  removeRow,
  setCell,
  type EnvelopeDim,
  type EnvelopeState,
} from "@/lib/install/envelope";
import { fmt } from "@/lib/nbr5410/format";

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border py-2 last:border-0">
      <dt className="text-help text-muted">{label}</dt>
      <dd className="text-right tabular font-medium">
        {value}
        {hint ? <span className="block text-label font-normal text-subtle">{hint}</span> : null}
      </dd>
    </div>
  );
}

function EnvelopeDraw({ state }: { state: EnvelopeState }) {
  const r = envelope(state);
  if (!r.ok) {
    return <p className="text-sm text-muted">Informe o Φ nas células para ver o corte cotado (C, D, B, A…).</p>;
  }

  const VW = 560;
  const VH = 420;
  const mL = 18;
  const mT = 22;
  const mR = 108;
  const mB = 78;
  const scale = Math.min((VW - mL - mR) / r.widthMm, (VH - mT - mB) / r.heightMm);
  const x0 = mL;
  const y0 = mT;
  const ew = r.widthMm * scale;
  const eh = r.heightMm * scale;

  const hSegs: (EnvelopeDim & { x1: number; x2: number })[] = [];
  let acc = 0;
  for (const d of r.horizontal) {
    const x1 = x0 + acc * scale;
    acc += d.mm;
    hSegs.push({ ...d, x1, x2: x0 + acc * scale });
  }
  const vSegs: (EnvelopeDim & { y1: number; y2: number })[] = [];
  acc = 0;
  for (const d of r.vertical) {
    const y1 = y0 + acc * scale;
    acc += d.mm;
    vSegs.push({ ...d, y1, y2: y0 + acc * scale });
  }

  const usedCols = r.colMax.map((p, i) => ({ i, p })).filter((x) => x.p);
  const usedRows = r.rowMax.map((p, i) => ({ i, p })).filter((x) => x.p);
  const colX = usedCols.map((_, i) => (hSegs[i] ? hSegs[i].x2 : x0 + ew / 2));
  const rowY = usedRows.map((row, i) => {
    const seg = vSegs[i];
    if (!seg) return y0 + eh / 2;
    const od = phiOdMm(row.p ?? 0) * scale;
    return seg.y2 - od / 2;
  });
  const ink = "currentColor";

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full text-primary" role="img" aria-label="Corte cotado do envelope">
      <rect x={x0} y={y0} width={ew} height={eh} fill="#eee6d8" stroke={ink} strokeWidth="1.75" />
      {r.used.map((u) => {
        const ci = usedCols.findIndex((c) => c.i === u.c);
        const ri = usedRows.findIndex((rw) => rw.i === u.r);
        if (ci < 0 || ri < 0) return null;
        const rad = Math.max(4, (phiOdMm(u.phi) * scale) / 2);
        return (
          <g key={`${u.r}-${u.c}`}>
            <circle cx={colX[ci]} cy={rowY[ri]} r={rad} fill="#faf6ee" stroke={ink} strokeWidth="1.6" />
            <text
              x={colX[ci]}
              y={rowY[ri] + 4}
              textAnchor="middle"
              fontSize="11"
              fill={ink}
              fontFamily="Source Sans 3, sans-serif"
            >
              {fmtPhi(u.phi)}
            </text>
          </g>
        );
      })}

      {hSegs.map((d) => {
        const y = y0 + eh + 28;
        const mid = (d.x1 + d.x2) / 2;
        return (
          <g key={`h-${d.key}`}>
            <line x1={d.x1} y1={y0 + eh} x2={d.x1} y2={y + 6} stroke={ink} strokeWidth="0.75" opacity={0.45} />
            <line x1={d.x2} y1={y0 + eh} x2={d.x2} y2={y + 6} stroke={ink} strokeWidth="0.75" opacity={0.45} />
            <line x1={d.x1} y1={y} x2={d.x2} y2={y} stroke={ink} strokeWidth="1" />
            <line x1={d.x1} y1={y - 4} x2={d.x1} y2={y + 4} stroke={ink} strokeWidth="1" />
            <line x1={d.x2} y1={y - 4} x2={d.x2} y2={y + 4} stroke={ink} strokeWidth="1" />
            <text
              x={mid}
              y={y - 6}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={ink}
              fontFamily="Source Sans 3, sans-serif"
            >
              {d.label}
            </text>
            <text
              x={mid}
              y={y + 16}
              textAnchor="middle"
              fontSize="10"
              fill={ink}
              opacity={0.8}
              fontFamily="Source Sans 3, sans-serif"
            >
              {d.mm} mm
            </text>
          </g>
        );
      })}

      {vSegs.map((d) => {
        const x = x0 + ew + 36;
        const mid = (d.y1 + d.y2) / 2;
        return (
          <g key={`v-${d.key}`}>
            <line x1={x0 + ew} y1={d.y1} x2={x + 6} y2={d.y1} stroke={ink} strokeWidth="0.75" opacity={0.45} />
            <line x1={x0 + ew} y1={d.y2} x2={x + 6} y2={d.y2} stroke={ink} strokeWidth="0.75" opacity={0.45} />
            <line x1={x} y1={d.y1} x2={x} y2={d.y2} stroke={ink} strokeWidth="1" />
            <line x1={x - 4} y1={d.y1} x2={x + 4} y2={d.y1} stroke={ink} strokeWidth="1" />
            <line x1={x - 4} y1={d.y2} x2={x + 4} y2={d.y2} stroke={ink} strokeWidth="1" />
            <text
              x={x + 10}
              y={mid - 4}
              fontSize="11"
              fontWeight="600"
              fill={ink}
              fontFamily="Source Sans 3, sans-serif"
            >
              {d.label}
            </text>
            <text
              x={x + 10}
              y={mid + 10}
              fontSize="10"
              fill={ink}
              opacity={0.8}
              fontFamily="Source Sans 3, sans-serif"
            >
              {d.mm} mm
            </text>
          </g>
        );
      })}

      <text
        x={x0 + ew / 2}
        y={VH - 8}
        textAnchor="middle"
        fontSize="11"
        fill={ink}
        fontFamily="Source Sans 3, sans-serif"
      >
        {fmt(r.widthMm, 0)} × {fmt(r.heightMm, 0)} mm
      </text>
    </svg>
  );
}

export function EnvelopeForm({
  value,
  onChange,
}: {
  value: EnvelopeState;
  onChange: (next: EnvelopeState) => void;
}) {
  const { rows, cols } = gridSize(value.grid);
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm text-muted">Instalação · envelope de concreto</p>
      </div>

      <Card
        title="Arranjo dos eletrodutos"
        context="Cada célula é um duto (Φ em polegadas). B vai do topo do envelope até a face inferior do duto; A2 de face inferior a face inferior; 75 mm fixos no fundo."
      >
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onChange(defaultEnvelope())}>
            Exemplo 2×2 de 2″
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => onChange(exampleEnvelope1())}>
            Exemplo 2×2 de 1″
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => onChange(emptyEnvelope(rows, cols))}>
            Limpar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={rows >= ENVELOPE_MAX}
            aria-label="Incluir fiada"
            onClick={() => onChange({ grid: addRow(value.grid) })}
          >
            <Plus />
            Fiada
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={rows <= ENVELOPE_MIN}
            aria-label="Remover fiada"
            onClick={() => onChange({ grid: removeRow(value.grid) })}
          >
            <Minus />
            Fiada
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={cols >= ENVELOPE_MAX}
            aria-label="Incluir coluna"
            onClick={() => onChange({ grid: addCol(value.grid) })}
          >
            <Plus />
            Coluna
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={cols <= ENVELOPE_MIN}
            aria-label="Remover coluna"
            onClick={() => onChange({ grid: removeCol(value.grid) })}
          >
            <Minus />
            Coluna
          </Button>
        </div>
        <p className="mt-2 text-help text-muted">
          {rows} fiada{rows > 1 ? "s" : ""} × {cols} coluna{cols > 1 ? "s" : ""} (máx. {ENVELOPE_MAX} × {ENVELOPE_MAX})
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[20rem] border-collapse text-sm">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-label font-medium uppercase tracking-[0.1em] text-muted">
                  Fiada
                </th>
                {Array.from({ length: cols }, (_, c) => (
                  <th
                    key={c}
                    className="px-2 py-2 text-left text-label font-medium uppercase tracking-[0.1em] text-muted"
                  >
                    Col.&nbsp;{c + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }, (_, r) => (
                <tr key={r} className="border-t border-border">
                  <td className="px-2 py-2 text-help text-muted">{r + 1}</td>
                  {Array.from({ length: cols }, (_, c) => (
                    <td key={c} className="px-2 py-2">
                      <select
                        aria-label={`Fiada ${r + 1}, coluna ${c + 1}`}
                        className="h-11 w-full rounded-md border border-border bg-surface px-2 text-sm"
                        value={String(value.grid[r]?.[c] ?? 0)}
                        onChange={(e) =>
                          onChange({ grid: setCell(value.grid, r, c, Number(e.target.value)) })
                        }
                      >
                        <option value="0">—</option>
                        {ENVELOPE_PHI.map((p) => (
                          <option key={p} value={p}>
                            {fmtPhi(p)}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Corte cotado" context="C e C1 = recuo até o eixo; D = eixo a eixo; B = topo → face inferior; A2 = entre faces inferiores; 75 mm = capa de fundo.">
        <EnvelopeDraw state={value} />
      </Card>
    </div>
  );
}

export function EnvelopeVerdict({ value }: { value: EnvelopeState }) {
  const r = envelope(value);
  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="text-label font-medium uppercase tracking-[0.12em] text-muted">Veredito envelope</p>
        <h2 className="mt-2 font-serif text-lg font-medium leading-snug tracking-tight">
          {r.ok ? `${fmt(r.widthMm, 0)} × ${fmt(r.heightMm, 0)} mm` : "Sem dutos"}
        </h2>
        <div className="mt-2">
          <Badge tone={r.ok ? "ok" : "warn"}>{r.ok ? "Dimensionado" : "Informe o arranjo"}</Badge>
        </div>
        <p className="mt-2 text-help text-muted">Largura × altura externas, valores em milímetro.</p>
      </header>

      <dl>
        <Row
          label="Largura"
          value={r.ok ? `${fmt(r.widthMm, 0)} mm` : "—"}
          hint={r.horizontal.map((d) => d.label).join(" + ")}
        />
        <Row
          label="Altura"
          value={r.ok ? `${fmt(r.heightMm, 0)} mm` : "—"}
          hint={r.vertical.map((d) => d.label).join(" + ")}
        />
        <Row label="Dutos" value={String(r.used.length)} />
      </dl>

      <section>
        <h3 className="text-label font-medium uppercase tracking-[0.12em] text-muted">Horizontais</h3>
        <dl className="mt-1">
          {r.horizontal.length === 0 ? (
            <p className="text-help text-muted">—</p>
          ) : (
            r.horizontal.map((d) => <Row key={d.key} label={d.label} value={`${d.mm} mm`} hint={d.hint} />)
          )}
        </dl>
      </section>

      <section>
        <h3 className="text-label font-medium uppercase tracking-[0.12em] text-muted">Verticais</h3>
        <dl className="mt-1">
          {r.vertical.length === 0 ? (
            <p className="text-help text-muted">—</p>
          ) : (
            r.vertical.map((d) => <Row key={d.key} label={d.label} value={`${d.mm} mm`} hint={d.hint} />)
          )}
        </dl>
      </section>
    </div>
  );
}

export function EnvelopeStrip({ value }: { value: EnvelopeState }) {
  const r = envelope(value);
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2">
      <div>
        <p className="text-label uppercase tracking-[0.12em] text-muted">Envelope</p>
        <p className="font-serif text-sm">{r.ok ? `${fmt(r.widthMm, 0)} × ${fmt(r.heightMm, 0)} mm` : "—"}</p>
      </div>
      <Badge tone={r.ok ? "ok" : "warn"}>{r.ok ? "Dimensionado" : "Vazio"}</Badge>
    </div>
  );
}
