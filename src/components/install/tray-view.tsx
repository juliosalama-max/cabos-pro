import { Plus, Trash2, BadgeCheck, OctagonAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Select } from "@/components/ui/field";
import {
  CORE_LABEL,
  FAMILY_LABEL,
  OCCUPY_SECTIONS,
  coresAllowed,
  defaultOccupyRow,
  type CableFamily,
  type CoreKind,
  type OccupyRow,
  type OccupyState,
} from "@/lib/install/occupy";
import { rowFromCircuit, rowsFromProject } from "@/lib/install/from-circuit";
import {
  RESERVE_PCTS,
  TRAYS,
  TRAY_KIND_LABEL,
  packTrayCables,
  tray,
  trayKey,
  type TrayKind,
  type TrayState,
} from "@/lib/install/tray";
import { fmt } from "@/lib/nbr5410/format";
import type { CircuitInput, InstallMethod } from "@/lib/nbr5410/types";

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

function TrayDraw({ state }: { state: TrayState }) {
  const r = tray(state);
  if (!r.chosen) return <p className="text-sm text-muted">Sem bitola que atenda área e camada única.</p>;
  const pack = packTrayCables(r.lines, r.chosen.w, state.covered);
  const worldW = Math.max(r.chosen.w, pack.width, 1);
  const worldH = Math.max(r.chosen.h, pack.height, 1);
  const W = 480;
  const H = 240;
  const mL = 20;
  const mR = 20;
  const mT = 16;
  const mB = 28;
  const s = Math.min((W - mL - mR) / worldW, (H - mT - mB) / worldH);
  const tw = r.chosen.w * s;
  const th = r.chosen.h * s;
  const ww = worldW * s;
  const x0 = (W - ww) / 2;
  const yBottom = H - mB;
  const trayY = yBottom - th;
  const overflow = pack.width > r.chosen.w + 0.5 || pack.height > r.chosen.h + 0.5;
  const divs = Math.max(1, Math.round(state.dividers ?? 1));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-primary" role="img" aria-label="Corte da eletrocalha">
      {overflow ? (
        <rect
          x={x0}
          y={yBottom - pack.height * s}
          width={pack.width * s}
          height={pack.height * s}
          fill="none"
          stroke="currentColor"
          strokeDasharray="4 3"
          opacity={0.35}
        />
      ) : null}
      <rect x={x0} y={trayY} width={tw} height={th} fill="#eee6d8" stroke="currentColor" strokeWidth="1.75" />
      {state.covered ? (
        <line x1={x0} y1={trayY} x2={x0 + tw} y2={trayY} stroke="currentColor" strokeWidth="3" />
      ) : null}
      {divs > 1
        ? Array.from({ length: divs - 1 }, (_, i) => {
            const x = x0 + (tw * (i + 1)) / divs;
            return (
              <line
                key={i}
                x1={x}
                y1={trayY}
                x2={x}
                y2={yBottom}
                stroke="currentColor"
                strokeWidth="1.25"
                strokeDasharray="3 2"
                opacity={0.7}
              />
            );
          })
        : null}
      {pack.items.map((p) => (
        <circle
          key={p.id}
          cx={x0 + p.cx * s}
          cy={yBottom - p.cy * s}
          r={Math.max(2, p.r * s)}
          fill="#faf6ee"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ))}
      <text
        x={W / 2}
        y={H - 8}
        textAnchor="middle"
        fontSize="11"
        fill="currentColor"
        fontFamily="Source Sans 3, sans-serif"
      >
        {r.chosen.w} × {r.chosen.h} mm
        {state.covered ? " · com tampa" : " · camada única"}
        {divs > 1 ? ` · ${divs} compartimentos` : ""}
        {overflow ? " · cabos ultrapassam" : ""}
      </text>
    </svg>
  );
}

export function TrayForm({
  value,
  onChange,
  circuit,
  occupy,
  circuits,
}: {
  value: TrayState;
  onChange: (next: TrayState) => void;
  circuit: CircuitInput;
  occupy: OccupyState;
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
        <p className="text-sm text-muted">Instalação · eletrocalha / leito</p>
      </div>

      <Card
        title="Tipo e bitola"
        context="Método de referência da Tab. 33 conforme o conduto (lisa, perfurada, aramada) e a tampa. Teto NBR: área dos cabos ≤ 40 % da seção. Reserva de projeto é opcional."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Tipo" info="Lisa = bandeja de fundo sólido (método C sem tampa). Perfurada: furos ≥ 30 % da área, senão tratar como lisa. Aramada = leito (E/F). Leito (escada) = método E/F.">
            <Select
              value={value.kind}
              onChange={(e) => onChange({ ...value, kind: e.target.value as TrayKind })}
            >
              {(Object.keys(TRAY_KIND_LABEL) as TrayKind[]).map((k) => (
                <option key={k} value={k}>
                  {TRAY_KIND_LABEL[k]}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Tampa"
            info="Com tampa desmontável (IP4X no mínimo) a linha é fechada: métodos B1/B2 (nº 31–36). Sem tampa: C, E ou F e camada única (Tab. 42). Condutor isolado só com tampa (6.2.11.4.1)."
          >
            <Select
              value={value.covered ? "sim" : "nao"}
              onChange={(e) => onChange({ ...value, covered: e.target.value === "sim" })}
            >
              <option value="sim">Com tampa (B1 / B2)</option>
              <option value="nao">Sem tampa (C / E / F)</option>
            </Select>
          </Field>
          <Field
            label="Reserva"
            info="A NBR 5410 não exige folga: 40 % já é o teto. Reserva reduz a ocupação máxima de projeto (20 % → 32 % da seção) para cabos futuros."
          >
            <Select
              value={String(value.reservePct ?? 0)}
              onChange={(e) => onChange({ ...value, reservePct: Number(e.target.value) })}
            >
              {RESERVE_PCTS.map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "Sem reserva (teto 40 %)" : `${n} % (teto ${(40 * (1 - n / 100)).toFixed(0)} %)`}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Divisor"
            info="Chapas longitudinais que separam circuitos. A área útil e o teto de 40 % aplicam-se a cada compartimento."
          >
            <Select
              value={String(value.dividers ?? 1)}
              onChange={(e) => onChange({ ...value, dividers: Number(e.target.value) })}
            >
              <option value="1">Sem divisor</option>
              <option value="2">2 compartimentos</option>
              <option value="3">3 compartimentos</option>
            </Select>
          </Field>
          <Field label="Bitola" info="Auto escolhe a menor seção comercial cuja área útil no teto de projeto e, se aberta, a largura da camada única, comportam os cabos.">
            <Select value={value.size} onChange={(e) => onChange({ ...value, size: e.target.value })}>
              <option value="auto">Automática (menor que cabe)</option>
              {TRAYS.map((t) => (
                <option key={trayKey(t)} value={trayKey(t)}>
                  {t.w} × {t.h} mm
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Card>

      <Card
        title="Cabos na eletrocalha"
        context="Mesmo catálogo de Ø do eletroduto. Trazer do circuito ou copiar as linhas do eletroduto."
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
            onClick={() => onChange({ ...value, rows: occupy.rows.map((r) => ({ ...r, id: defaultOccupyRow().id })) })}
          >
            Copiar do eletroduto
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({ ...value, rows: [...value.rows, defaultOccupyRow({ quantity: 1, section: 2.5 })] })
            }
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
                <Field label={`Linha ${i + 1}`} className="col-span-12 sm:col-span-4">
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
                <Field label="Formação" className="col-span-6 sm:col-span-2">
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
                <Field label="COND." className="col-span-3 sm:col-span-2">
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

      <Card title="Corte" context="Com tampa, os cabos empilham na largura da calha. Sem tampa, camada única (Tab. 42). Se não couber, o excesso aparece tracejado.">
        <TrayDraw state={value} />
      </Card>
    </div>
  );
}

export function TrayVerdict({
  value,
  circuit,
  onApplyFa,
}: {
  value: TrayState;
  circuit?: CircuitInput;
  onApplyFa?: (patch: Partial<CircuitInput>) => void;
}) {
  const r = tray(value);
  const size = r.chosen ? `${r.chosen.w} × ${r.chosen.h} mm` : "Sem bitola";
  const nCirc = Math.max(1, value.rows.filter((row) => row.quantity > 0).length);
  const method = r.method.code as InstallMethod;
  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="text-label font-medium uppercase tracking-[0.12em] text-muted">Veredito eletrocalha</p>
        <h2 className="mt-2 font-serif text-lg font-medium leading-snug tracking-tight">{size}</h2>
        <div className="mt-2">
          <Badge tone={r.ok ? "ok" : "danger"}>{r.ok ? "Cabe" : "Não cabe"}</Badge>
        </div>
        <p className="mt-2 text-help text-muted">
          {r.method.code} · ocupação ≤ {fmt(r.fillLimit * 100, 0)} %{r.reservePct ? ` (reserva ${r.reservePct} %)` : ""} · NBR 5410
        </p>
      </header>

      <dl>
        <Row label="Método" value={r.method.code} hint={r.method.label} />
        <Row label="Condutores" value={String(r.conductors)} />
        <Row label="Área dos cabos" value={`${fmt(r.areaMm2, 1)} mm²`} />
        <Row
          label="Seção interna mín."
          value={`${fmt(r.requiredAreaMm2, 0)} mm²`}
          hint={r.reservePct ? `teto ${fmt(r.fillLimit * 100, 0)} % com reserva` : "40 % da área útil"}
        />
        <Row
          label="Camada única"
          value={`${fmt(r.layerWidthMm, 1)} mm`}
          hint="soma dos Ø · Tab. 42"
        />
        <Row
          label="Ocupação"
          value={r.chosen ? `${fmt(r.usedPct, 1)} %` : "—"}
          hint={r.chosen ? `de ${r.chosen.w} × ${r.chosen.h} mm` : undefined}
        />
        <Row label="Fa agrupamento" value={fmt(r.fa, 2)} hint={`${r.faSource} · ${nCirc} circ.`} />
        <Row label="Massa estimada" value={`${fmt(r.massKgM, 1)} kg/m`} hint="Cu + capa · ordem de grandeza" />
      </dl>

      {onApplyFa && circuit ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onApplyFa({
              method,
              nCircuits: nCirc,
              groupingOverride: r.fa,
            })
          }
        >
          Aplicar Fa no circuito {circuit.tag}
        </Button>
      ) : null}

      <section>
        <h3 className="text-label font-medium uppercase tracking-[0.12em] text-muted">Checagens</h3>
        <ul className="mt-2 flex flex-col">
          {[
            { ok: r.areaOk, label: `Área ≤ ${fmt(r.fillLimit * 100, 0)} %`, detail: r.method.ref },
            { ok: r.layerOk, label: value.covered ? "Tampa · feixe admitido" : "Largura da camada única", detail: "Tab. 42" },
            { ok: r.heightOk, label: "Altura das fiadas", detail: r.maxOdMm ? `Ø máx. ${fmt(r.maxOdMm, 1)} mm` : "—" },
          ].map((c) => (
            <li key={c.label} className="flex gap-2 border-b border-border py-2 last:border-0">
              <span className={c.ok ? "text-ok" : "text-danger"}>
                {c.ok ? (
                  <BadgeCheck className="size-4" strokeWidth={1.75} />
                ) : (
                  <OctagonAlert className="size-4" strokeWidth={1.75} />
                )}
              </span>
              <div>
                <p className="text-sm leading-snug">{c.label}</p>
                <p className="text-help text-muted">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {r.warnings.length > 0 ? (
        <section>
          <h3 className="text-label font-medium uppercase tracking-[0.12em] text-muted">Notas</h3>
          <ul className="mt-2 flex flex-col gap-2">
            {r.warnings.map((w) => (
              <li key={w} className="text-help text-muted">
                {w}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export function TrayStrip({ value }: { value: TrayState }) {
  const r = tray(value);
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2">
      <div>
        <p className="text-label uppercase tracking-[0.12em] text-muted">Eletrocalha</p>
        <p className="font-serif text-sm">
          {r.chosen ? `${r.chosen.w} × ${r.chosen.h} mm · ${r.method.code}` : "—"}
        </p>
      </div>
      <Badge tone={r.ok ? "ok" : "warn"}>{r.ok ? "Cabe" : "Revisar"}</Badge>
    </div>
  );
}
