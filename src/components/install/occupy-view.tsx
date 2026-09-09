import { Plus, Trash2 } from "lucide-react";
import { calculate } from "@/lib/nbr5410/calculate";
import { fmt } from "@/lib/nbr5410/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Select } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, OctagonAlert } from "lucide-react";
import {
  CORE_LABEL,
  FAMILY_LABEL,
  OCCUPY_SECTIONS,
  coresAllowed,
  defaultOccupyRow,
  occupy,
  type CableFamily,
  type CoreKind,
  type OccupyRow,
  type OccupyState,
} from "@/lib/install/occupy";
import { rowFromCircuit, rowsFromProject } from "@/lib/install/from-circuit";
import type { CircuitInput } from "@/lib/nbr5410/types";
import { cn } from "@/lib/utils";

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

export function OccupyForm({
  value,
  onChange,
  circuit,
  circuits,
}: {
  value: OccupyState;
  onChange: (next: OccupyState) => void;
  circuit: CircuitInput;
  circuits?: CircuitInput[];
}) {
  const patchRow = (id: string, patch: Partial<OccupyRow>) => {
    onChange({
      ...value,
      rows: value.rows.map((r) => {
        if (r.id !== id) return r;
        const next = { ...r, ...patch };
        const allowed = coresAllowed(next.family);
        if (!allowed.includes(next.cores)) next.cores = allowed[0];
        return next;
      }),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm text-muted">Instalação · ocupação de eletroduto</p>
      </div>

      <Card
        title="Condutores no mesmo duto"
        context="Área pelo Ø externo de catálogo (Eprotenax, PVC/PVC Sintenax, Pirastic 750 V ou EPR concêntrico). A taxa de ocupação depende do número de CONDUTORES no eletroduto (NBR 5410 6.2.11)."
      >
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange({ ...value, rows: [...value.rows, rowFromCircuit(circuit)] })}
          >
            Trazer do circuito {circuit.tag}
          </Button>
          {circuits && circuits.length > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange({ ...value, rows: rowsFromProject(circuits) })}
            >
              Trazer todos os circuitos
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange({ ...value, rows: [...value.rows, defaultOccupyRow({ quantity: 1, section: 2.5 })] })}
          >
            <Plus />
            Linha
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {value.rows.map((row, i) => {
            const allowed = coresAllowed(row.family);
            return (
              <div key={row.id} className="grid grid-cols-12 items-end gap-2 rounded-md border border-border p-3">
                <Field label={`Linha ${i + 1}`} className="col-span-12 sm:col-span-4" info="Família do cabo: EPR/HEPR (Eprotenax), PVC/PVC 0,6/1 kV (Sintenax), PVC 750 V (Pirastic) ou EPR concêntrico.">
                  <Select
                    value={row.family}
                    onChange={(e) => patchRow(row.id, { family: e.target.value as CableFamily })}
                  >
                    {(Object.keys(FAMILY_LABEL) as CableFamily[]).map((f) => (
                      <option key={f} value={f}>
                        {FAMILY_LABEL[f]}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Formação" className="col-span-6 sm:col-span-2" info="Singelo = unipolar. 2/3/4 = cabo multipolar.">
                  <Select
                    value={allowed.includes(row.cores) ? row.cores : allowed[0]}
                    onChange={(e) => patchRow(row.id, { cores: e.target.value as CoreKind })}
                  >
                    {allowed.map((c) => (
                      <option key={c} value={c}>
                        {CORE_LABEL[c]}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Seção" className="col-span-3 sm:col-span-2">
                  <Select
                    value={String(row.section)}
                    onChange={(e) => patchRow(row.id, { section: Number(e.target.value) })}
                  >
                    {OCCUPY_SECTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s} mm²
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="COND." className="col-span-3 sm:col-span-2" info="Número de condutores desta bitola no mesmo eletroduto. Singelo: cada cabo conta 1 COND. Multipolar: cada cabo conta 1 COND. (o Ø já é o do 2/3/4 cond.).">
                  <Select
                    value={String(row.quantity)}
                    onChange={(e) => patchRow(row.id, { quantity: Number(e.target.value) })}
                  >
                    {Array.from({ length: 24 }, (_, n) => n + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </Select>
                </Field>
                <div className="col-span-12 flex justify-end sm:col-span-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-danger"
                    disabled={value.rows.length <= 1}
                    onClick={() => onChange({ ...value, rows: value.rows.filter((r) => r.id !== row.id) })}
                    aria-label="Remover linha"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="Critérios de projeto" context="A NBR 5410 só fixa o teto (53 / 31 / 40 %). Reserva e Petrobras são critérios do escritório.">
        <Field
          label="Reserva"
          info="Não está na norma. Reduz a ocupação máxima usada no dimensionamento. Ex.: 20 % sobre 40 % → 32 %."
        >
          <Select
            value={String(value.reservePct ?? 0)}
            onChange={(e) => onChange({ ...value, reservePct: Number(e.target.value) })}
          >
            <option value={0}>Sem reserva (teto da NBR)</option>
            <option value={10}>10 %</option>
            <option value={15}>15 %</option>
            <option value={20}>20 %</option>
            <option value={25}>25 %</option>
            <option value={30}>30 %</option>
          </Select>
        </Field>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Trecho (m)" info="Comprimento contínuo sem caixa. Interno 15 m, externo 30 m, −3 m por curva de 90°.">
            <Select value={String(value.runM ?? 0)} onChange={(e) => onChange({ ...value, runM: Number(e.target.value) })}>
              <option value={0}>Não informado</option>
              {[6, 9, 12, 15, 18, 21, 24, 27, 30, 40].map((n) => (
                <option key={n} value={n}>
                  {n} m
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Curvas" info="Máximo 3 entre caixas (6.2.11.1.7).">
            <Select value={String(value.bends ?? 0)} onChange={(e) => onChange({ ...value, bends: Number(e.target.value) })}>
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </Select>
          </Field>
          <Field label="Local" info="Externo admite 30 m de trecho retilíneo.">
            <Select
              value={value.outdoor ? "1" : "0"}
              onChange={(e) => onChange({ ...value, outdoor: e.target.value === "1" })}
            >
              <option value="0">Interno (15 m)</option>
              <option value="1">Externo (30 m)</option>
            </Select>
          </Field>
        </div>
        <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={value.petrobras}
            onChange={(e) => onChange({ ...value, petrobras: e.target.checked })}
          />
          Aplicar critérios Petrobras
          <span className="text-help text-muted">um circuito ≥ 35 mm² por duto · sem 3″ e 3.1/2″</span>
        </label>
      </Card>
    </div>
  );
}

export function OccupyVerdict({
  value,
  circuit,
  onToEnvelope,
}: {
  value: OccupyState;
  circuit: CircuitInput;
  onToEnvelope?: (phi: number) => void;
}) {
  const r = occupy(value);
  const sized = calculate(circuit);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="text-label font-medium uppercase tracking-[0.12em] text-muted">Veredito eletroduto</p>
        <h2 className="mt-2 font-serif text-lg font-medium leading-snug tracking-tight">
          {r.nps ? r.nps : "Sem bitola"}
        </h2>
        <div className="mt-2">
          <Badge tone={r.ok ? "ok" : "danger"}>{r.ok ? "Cabe" : "Não cabe"}</Badge>
        </div>
        <p className="mt-2 text-help text-muted">
          {r.fill.label}
          {r.reservePct ? ` · reserva ${r.reservePct} % → máx. ${fmt(r.designPct * 100, 0)} %` : ""} · NBR 5410 6.2.11
        </p>
      </header>

      <dl>
        <Row label="Condutores" value={String(r.conductors)} hint={r.fill.label} />
        <Row label="Área dos COND." value={`${fmt(r.areaMm2, 1)} mm²`} />
        <Row label="Ø interno mín." value={`${fmt(r.requiredIdMm, 1)} mm`} hint="pelo limite de ocupação" />
        <Row label="Eletroduto" value={r.nps ?? "—"} hint={r.idMm ? `ID ${fmt(r.idMm, 2)} mm` : undefined} />
        <Row
          label="Ocupação"
          value={r.nps ? `${fmt(r.usedPct, 1)} %` : "—"}
          hint={
            r.reservePct
              ? `projeto ${fmt(r.designPct * 100, 0)} % · teto NBR ${fmt(r.fill.pct * 100, 0)} %`
              : `limite ${fmt(r.fill.pct * 100, 0)} % · ${r.fill.rule}`
          }
        />
        {r.bendMm ? <Row label="Raio de curvatura" value={`${r.bendMm} mm`} hint="mínimo do catálogo" /> : null}
      </dl>

      <section>
        <h3 className="text-label font-medium uppercase tracking-[0.12em] text-muted">Linhas</h3>
        <ul className="mt-2 flex flex-col">
          {r.lines.map((l) => (
            <li key={l.row.id} className="flex gap-2 border-b border-border py-2 last:border-0">
              <span className={l.error ? "text-danger" : "text-ok"}>
                {l.error ? (
                  <OctagonAlert className="size-4" strokeWidth={1.75} />
                ) : (
                  <BadgeCheck className="size-4" strokeWidth={1.75} />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-sm leading-snug">
                  {l.row.quantity} × {l.row.section} mm² {CORE_LABEL[l.row.cores]}
                </p>
                <p className="text-help text-muted">
                  {l.odMm ? `Ø ${fmt(l.odMm, 1)} mm · ${fmt(l.areaMm2, 1)} mm²` : l.error}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {r.warnings.length ? (
        <ul className="flex flex-col gap-1">
          {r.warnings.map((w) => (
            <li key={w} className="text-help text-warn">
              {w}
            </li>
          ))}
        </ul>
      ) : null}

      {r.phi && onToEnvelope ? (
        <Button type="button" variant="outline" size="sm" onClick={() => onToEnvelope(r.phi!)}>
          Usar {r.nps} no envelope
        </Button>
      ) : null}

      <p className={cn("text-help text-muted")}>
        Circuito {circuit.tag}: {sized.section} mm² · {sized.nPerPhase > 1 ? `${sized.nPerPhase}× ` : ""}
        {circuit.formation}
      </p>
    </div>
  );
}

export function OccupyStrip({ value }: { value: OccupyState }) {
  const r = occupy(value);
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2">
      <div>
        <p className="text-label uppercase tracking-[0.12em] text-muted">Eletroduto</p>
        <p className="font-serif text-sm">{r.nps ?? "—"}</p>
      </div>
      <Badge tone={r.ok ? "ok" : "danger"}>{r.ok ? "Cabe" : "Não cabe"}</Badge>
    </div>
  );
}
