import { useState } from "react";
import { BadgeCheck, ChevronDown, OctagonAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { calculate } from "@/lib/nbr5410/calculate";
import { dropChain } from "@/lib/nbr5410/project-calc";
import { cableSpec, fmt, fmtA } from "@/lib/nbr5410/format";
import type { CircuitInput, EarthingScheme, OriginKind } from "@/lib/nbr5410/types";
import { cn } from "@/lib/utils";

function Row({ label, value, hint, alert }: { label: string; value: string; hint?: string; alert?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border py-2 last:border-0">
      <dt className="text-help text-muted">{label}</dt>
      <dd className={cn("text-right tabular font-medium", alert && "text-danger")}>
        {value}
        {hint ? <span className="block text-label font-normal text-subtle">{hint}</span> : null}
      </dd>
    </div>
  );
}

function VerdictBody({
  input,
  circuits,
  origin,
  earthing,
}: {
  input: CircuitInput;
  circuits?: CircuitInput[];
  origin?: OriginKind;
  earthing?: EarthingScheme;
}) {
  const parent = circuits?.find((c) => c.id === input.parentId);
  const r = calculate(input, { earthing, parent });
  const chain = circuits?.length ? dropChain(circuits, input.id, origin ?? "concessionaria") : null;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <p className="text-label font-medium uppercase tracking-[0.12em] text-muted">Veredito NBR 5410</p>
        <h2 className="mt-2 font-serif text-lg font-medium leading-snug tracking-tight">
          {cableSpec(r.nPerPhase, input.formation, r.section, input.insulation, input.conductor)}
        </h2>
        <div className="mt-2">
          <Badge tone={r.ok ? "ok" : "danger"}>{r.ok ? "Conforme" : "Não conforme"}</Badge>
        </div>
        <p className="mt-2 text-help text-muted">
          Critério: {r.limiting}
          {r.motor ? ` · motor ${r.motor.kw} kW · carcaça ${r.motor.frame}` : ""}
        </p>
      </header>

      <dl>
        <Row label="Ib" value={fmtA(r.ib)} hint="corrente de projeto" />
        <Row label="I′p" value={fmtA(r.ip)} hint="Ib / (Fa·Ft)" />
        <Row label="Iz" value={fmtA(r.iz)} hint={`Imax ${fmtA(r.imax)}`} />
        <Row label="Disjuntor" value={r.breaker ? `${r.breaker} A` : "—"} hint={`curva ${r.breakerCurve} · Icu ${r.icuKa || "—"} kA`} />
        <Row
          label="ΔV NBR"
          value={`${fmt(r.dropPct, 2)} %`}
          hint={`máx. ${fmt(input.maxDropPct, 0)} %`}
          alert={r.dropPct > input.maxDropPct}
        />
        {r.istA > 0 ? (
          <Row
            label="ΔV partida"
            value={`${fmt(r.dropStartPct, 2)} %`}
            hint={`Ist ${fmtA(r.istA)} · ${r.startRatio.toFixed(1)}·Ib`}
            alert={r.dropStartPct > (input.maxStartDropPct || 10)}
          />
        ) : null}
        {chain ? (
          <Row
            label="ΔV acumulada"
            value={`${fmt(chain.totalPct, 2)} %`}
            hint={`${chain.path.map((p) => p.tag).join(" → ")} · teto ${fmt(chain.limit, 0)} %`}
            alert={!chain.ok}
          />
        ) : null}
        <Row label="ΔV |Z|" value={`${fmt(r.dropModulusPct, 2)} %`} hint="comparação" />
        <Row label="PE" value={r.pe ? `${r.pe} mm²` : "—"} hint={`N ${r.neutral ?? "—"} mm²`} />
        <Row label="Eletroduto" value={r.conduit ?? "—"} hint={r.conduit ? `${fmt(r.conduitFillPct, 0)} % ocup.` : undefined} />
      </dl>

      <section>
        <h3 className="text-label font-medium uppercase tracking-[0.12em] text-muted">Verificações</h3>
        <ul className="mt-2 flex flex-col">
          {r.checks.map((c) => (
            <li key={c.id} className="flex gap-2 border-b border-border py-2 last:border-0">
              <span className={c.ok ? "text-ok" : "text-danger"}>
                {c.ok ? (
                  <BadgeCheck className="size-4" strokeWidth={1.75} />
                ) : (
                  <OctagonAlert className="size-4" strokeWidth={1.75} />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-sm leading-snug">{c.label}</p>
                <p className="text-help text-muted">{c.detail}</p>
                <p className="text-label text-subtle">{c.ref}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-label font-medium uppercase tracking-[0.12em] text-muted">Impedância e Icc</h3>
        <dl className="mt-1">
          <Row label="Fa" value={fmt(r.fa, 2)} hint={r.faSource} />
          <Row label="Ft" value={fmt(r.ft, 2)} hint={`${input.tempC} °C`} />
          <Row label="Fs" value={fmt(r.fs, 2)} hint="Tab. 41" />
          <Row label="Fh" value={fmt(r.fh, 2)} hint="3ª harmônica" />
          <Row label="Fr" value={fmt(r.fr, 2)} />
          <Row label="Rca" value={`${fmt(r.rca, 3)} Ω/km`} />
          <Row label="XL" value={`${fmt(r.xl, 3)} Ω/km`} />
          <Row label="V/A·km" value={fmt(r.vakm, 3)} />
          <Row label="Icc no ponto" value={`${fmt(r.iscLocalKa, 2)} kA`} />
          <Row label="Icu disjuntor" value={`${fmt(r.icuKa, 1)} kA`} />
          <Row label="Icw cabo" value={`${fmt(r.icwKa, 1)} kA`} hint={`k = ${r.kPhase}`} />
          <Row label="Icw PE" value={`${fmt(r.peIcwKa, 1)} kA`} />
          <Row label={`Ia (${r.breakerCurve})`} value={fmtA(r.iaA)} hint={`t ≤ ${r.tDiscS} s`} />
        </dl>
        {r.motor ? (
          <p className="mt-3 text-help text-muted">
            Partida: disjuntor {r.motor.breaker} A · contator {r.motor.contactor} · relé {r.motor.relay}
          </p>
        ) : null}
      </section>
    </div>
  );
}

export function ResultsPanel({
  input,
  circuits,
  origin,
  earthing,
}: {
  input: CircuitInput;
  circuits?: CircuitInput[];
  origin?: OriginKind;
  earthing?: EarthingScheme;
}) {
  return <VerdictBody input={input} circuits={circuits} origin={origin} earthing={earthing} />;
}

export function VerdictStrip({
  input,
  circuits,
  origin,
  earthing,
}: {
  input: CircuitInput;
  circuits?: CircuitInput[];
  origin?: OriginKind;
  earthing?: EarthingScheme;
}) {
  const parent = circuits?.find((c) => c.id === input.parentId);
  const r = calculate(input, { earthing, parent });
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center gap-2 rounded-sm border border-border bg-surface px-3 text-left"
        aria-expanded={open}
        aria-label="Veredito do circuito"
      >
        <span className="min-w-0 flex-1 truncate font-serif text-sm font-semibold">
          {cableSpec(r.nPerPhase, input.formation, r.section, input.insulation, input.conductor)}
        </span>
        <Badge className="shrink-0" tone={r.ok ? "ok" : "danger"}>
          {r.ok ? "Conforme" : "Não conforme"}
        </Badge>
        <span className="shrink-0 tabular text-help text-muted">{fmt(r.dropPct, 2)} %</span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-muted transition-transform", open && "rotate-180")}
          strokeWidth={1.75}
        />
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 cursor-default"
            aria-label="Fechar veredito"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-surface p-4 shadow-card">
            <VerdictBody input={input} circuits={circuits} origin={origin} earthing={earthing} />
          </div>
        </>
      ) : null}
    </div>
  );
}
