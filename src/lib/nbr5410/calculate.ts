import {
  AMPACITY,
  BREAKERS,
  CURRENT_TRANSFORMERS,
  FORMATION_INFO,
  K_PHASE,
  METHOD_INFO,
  MIN_SECTION,
  ampacityOf,
  cableOd,
  findMotor,
  findMotorByCv,
  groupingFactor,
  impedanceOf,
  interpolateTemp,
  minNeutral,
  minPe,
  motorVoltageKey,
  CONDUITS,
} from "./tables";
import { SECTIONS } from "./tables-data";
import type { CircuitInput, CircuitResult, Check } from "./types";

const SQRT3 = Math.sqrt(3);

export function round(n: number, d = 3): number {
  const p = 10 ** d;
  return Math.round(n * p) / p;
}

function nearestSection(s: number): number {
  let best: number = SECTIONS[0];
  for (const x of SECTIONS) {
    if (Math.abs(x - s) < Math.abs(best - s)) best = x;
  }
  return best;
}

/** kW de consulta a partir de kVA ou cv. Não substitui a grandeza de entrada. */
export function consultPowerKw(input: CircuitInput): { kw: number; source: string } | null {
  if (input.loadType === "cv" && input.powerCv > 0) {
    return { kw: input.powerCv * 0.736, source: "cv × 0,736" };
  }
  if (input.loadType === "kva" && input.powerKva > 0) {
    const pf = Math.min(1, Math.max(0.1, input.pf || 1));
    if (input.kind === "motor") {
      const eta = Math.min(1, Math.max(0.3, input.efficiency || 1));
      return { kw: input.powerKva * pf * eta, source: "S × FP × η" };
    }
    return { kw: input.powerKva * pf, source: "S × FP" };
  }
  return null;
}

export function designCurrent(input: CircuitInput): { ib: number; error?: string } {
  const V = input.voltage;
  const pf = Math.min(1, Math.max(0.1, input.pf || 1));
  const eta = Math.min(1, Math.max(0.3, input.efficiency || 1));
  if (V <= 0) return { ib: 0, error: "Tensão inválida" };

  if (input.loadType === "ib" && input.ibManual > 0) {
    return { ib: input.ibManual };
  }

  if (input.loadType === "kva" && input.powerKva > 0) {
    if (input.phases === 3) return { ib: (input.powerKva * 1000) / (V * SQRT3) };
    return { ib: (input.powerKva * 1000) / V };
  }

  let pW = 0;
  if (input.loadType === "cv" && input.powerCv > 0) pW = input.powerCv * 736;
  else if (input.powerKw > 0) pW = input.powerKw * 1000;
  else if (input.powerKva > 0) {
    if (input.phases === 3) return { ib: (input.powerKva * 1000) / (V * SQRT3) };
    return { ib: (input.powerKva * 1000) / V };
  }
  if (pW <= 0) return { ib: 0, error: "Informe a potência ou a corrente" };

  if (input.phases === 3) return { ib: pW / (V * SQRT3 * pf * eta) };
  return { ib: pW / (V * pf * eta) };
}

function loadedConductors(input: CircuitInput): 2 | 3 {
  return input.phases === 3 ? 3 : 2;
}

function pickBreaker(ib: number, iz: number, motorBreaker?: number): number {
  if (motorBreaker && motorBreaker >= ib - 1e-6 && motorBreaker <= iz + 1e-6) {
    return motorBreaker;
  }
  const target = ib * 1.05;
  const candidates = BREAKERS.filter((b) => b >= target - 1e-9 && b <= iz + 1e-6);
  if (candidates.length) return candidates[0];
  const aboveIb = BREAKERS.filter((b) => b >= ib);
  return aboveIb[0] ?? BREAKERS[BREAKERS.length - 1];
}

function pickTc(ib: number): number | null {
  return CURRENT_TRANSFORMERS.find((x) => x >= ib * 1.2) ?? CURRENT_TRANSFORMERS.at(-1) ?? null;
}

function voltageDropPct(
  input: CircuitInput,
  ib: number,
  rca: number,
  xl: number,
  n: number,
  method: "nbr" | "modulus",
): { dropV: number; dropPct: number; zvd: number; vakm: number } {
  const Lkm = input.lengthM / 1000;
  const pf = Math.min(1, Math.max(0, input.pf));
  const sf = Math.sqrt(Math.max(0, 1 - pf * pf));
  const zvd = method === "modulus" ? Math.hypot(rca, xl) : rca * pf + xl * sf;
  const k = input.phases === 3 ? SQRT3 : 2;
  const dropV = (k * ib * Lkm * zvd) / Math.max(1, n);
  const dropPct = input.voltage > 0 ? (dropV / input.voltage) * 100 : 0;
  return { dropV, dropPct, zvd, vakm: k * zvd };
}

function sizeConduit(
  section: number,
  formation: CircuitInput["formation"],
  nPerPhase: number,
): { nps: string | null; fillPct: number; od: number | null } {
  const od = cableOd(section, formation);
  if (!od) return { nps: null, fillPct: 0, od: null };
  const info = FORMATION_INFO[formation];
  const nCables = info.unipolar ? info.cores * nPerPhase : nPerPhase;
  const count = nCables;
  const areaCables = count * Math.PI * (od / 2) ** 2;
  const fillLimit = count <= 1 ? 0.53 : count === 2 ? 0.31 : 0.4;
  const requiredId = 2 * Math.sqrt(areaCables / fillLimit / Math.PI);
  const c = CONDUITS.find((x) => x.idMm >= requiredId);
  const used = c ? areaCables / (Math.PI * (c.idMm / 2) ** 2) : 1;
  return { nps: c?.nps ?? null, fillPct: used * 100, od };
}

function iscLocalKa(input: CircuitInput, rca: number, xl: number, n: number): number {
  if (input.iscKa <= 0) return 0;
  const zc = ((input.lengthM / 1000) * Math.hypot(rca, xl)) / Math.max(1, n);
  const zs = input.voltage / (SQRT3 * input.iscKa * 1000);
  return input.voltage / (SQRT3 * (zs + zc)) / 1000;
}

function fmtA(n: number): string {
  return `${n.toFixed(n >= 100 ? 1 : 2)} A`;
}

export function calculate(input: CircuitInput): CircuitResult {
  const { ib, error } = designCurrent(input);
  const loaded = loadedConductors(input);
  const buried = METHOD_INFO[input.method].buried;
  const ft = interpolateTemp(input.tempC, input.insulation, buried);
  const grp = groupingFactor(input.method, input.nCircuits, {
    buriedDucts: input.buriedDucts,
    unipolar: FORMATION_INFO[input.formation].unipolar,
    spacingM: input.burySpacingM,
    layers: input.layers,
    perLayer: input.nCircuits,
  });
  const fa = input.groupingOverride && input.groupingOverride > 0 ? input.groupingOverride : grp.fa;

  const isMotor = input.kind === "motor";
  const invCorr = fa > 0 && ft > 0 ? 1 / (fa * ft) : 1;
  const fr = input.reserveEnabled && isMotor && input.loadType !== "kva" && invCorr < 1.25 ? 1.25 : 1;
  const ip = ib * Math.max(fr, invCorr);

  const motorFound =
    isMotor ? findMotor(input.powerKw) ?? (input.powerCv > 0 ? findMotorByCv(input.powerCv) : undefined) : undefined;
  const vKey = motorVoltageKey(input.voltage);
  const motorProt = motorFound && vKey ? motorFound.prot[vKey] : null;

  const minS = MIN_SECTION[input.kind] ?? 2.5;
  const kPhase = K_PHASE[input.insulation];
  const sections = SECTIONS.filter((s) => s + 1e-9 >= minS);

  type Cand = {
    n: number;
    s: number;
    imax: number;
    iz: number;
    rca: number;
    xl: number;
    drop: ReturnType<typeof voltageDropPct>;
    dropMod: ReturnType<typeof voltageDropPct>;
    icw: number;
    iscL: number;
    limiting: string;
    copper: number;
  };

  let best: Cand | null = null;

  for (let n = 1; n <= 6; n++) {
    const iPer = ip / n;
    for (const s of sections) {
      const imax = ampacityOf(input.method, s, input.insulation, loaded);
      if (imax == null || imax + 1e-9 < iPer) continue;
      const iz = imax * fa * ft * n;
      const imp = impedanceOf(input.insulation, s, input.formation);
      if (!imp) continue;
      const drop = voltageDropPct(input, ib, imp.rca, imp.xl, n, "nbr");
      const dropMod = voltageDropPct(input, ib, imp.rca, imp.xl, n, "modulus");
      if (drop.dropPct > input.maxDropPct + 1e-6) continue;
      const icw = (kPhase * s * n) / Math.sqrt(Math.max(input.iscTimeS, 1e-6)) / 1000;
      const iscL = iscLocalKa(input, imp.rca, imp.xl, n);
      if (input.iscKa > 0 && icw + 1e-9 < iscL) continue;
      const copper = n * s;
      const limiting =
        drop.dropPct > input.maxDropPct * 0.85
          ? "queda de tensão"
          : iPer > imax * 0.92
            ? "capacidade de corrente"
            : "seção mínima";
      const cand: Cand = { n, s, imax, iz, rca: imp.rca, xl: imp.xl, drop, dropMod, icw, iscL, limiting, copper };
      best = cand;
      break;
    }
    if (best) break;
  }

  const checks: Check[] = [];
  if (error) {
    checks.push({ id: "ib", label: "Corrente de projeto", ok: false, detail: error, ref: "NBR 5410 6.2.4" });
  }

  if (!best) {
    checks.push({
      id: "size",
      label: "Dimensionamento",
      ok: false,
      detail:
        "Nenhuma seção até 6×300 mm² atende corrente, queda e Icc ao mesmo tempo. Afrouxe agrupamento, aumente a queda máxima ou use outro método.",
      ref: "NBR 5410 6.2",
    });
    return {
      ib,
      fa,
      faSource: input.groupingOverride ? "Manual" : grp.source,
      ft,
      fr,
      ip,
      loaded,
      nPerPhase: 1,
      section: 0,
      imax: 0,
      iz: 0,
      rca: 0,
      xl: 0,
      zvd: 0,
      dropV: 0,
      dropPct: 0,
      dropModulusPct: 0,
      vakm: 0,
      breaker: 0,
      tc: null,
      pe: 0,
      neutral: null,
      kPhase,
      iscLocalKa: 0,
      icwKa: 0,
      conduit: null,
      conduitFillPct: 0,
      cableOdMm: null,
      motor: null,
      formationLabel: FORMATION_INFO[input.formation].label,
      checks,
      ok: false,
      limiting: "indefinido",
      copperKgPerKm: 0,
    };
  }

  const iz = best.iz;
  const breaker = pickBreaker(ib, iz, motorProt && motorProt.breaker >= 6 ? motorProt.breaker : undefined);
  const pe = nearestSection(minPe(best.s));
  const needsN = input.phases !== 3 || input.formation === "4x1" || input.formation === "1x4";
  const neutral = needsN ? nearestSection(minNeutral(best.s)) : minNeutral(best.s);
  const conduit = sizeConduit(best.s, input.formation, best.n);

  checks.push({
    id: "ib-in-iz",
    label: "Coordenação Ib ≤ In ≤ Iz",
    ok: ib <= breaker + 1e-6 && breaker <= iz + 1e-6,
    detail: `Ib ${fmtA(ib)} · In ${breaker} A · Iz ${fmtA(iz)}`,
    ref: "NBR 5410 5.7.2.2.1",
  });
  checks.push({
    id: "iz-ib",
    label: "Capacidade de condução",
    ok: iz + 1e-6 >= ib,
    detail: `Iz = ${fmtA(best.imax)} × ${fa.toFixed(2)} × ${ft.toFixed(2)} × ${best.n} = ${fmtA(iz)} ≥ Ib`,
    ref: "NBR 5410 6.2.5 · Tab. 33–36",
  });
  checks.push({
    id: "drop",
    label: `Queda de tensão ≤ ${input.maxDropPct} %`,
    ok: best.drop.dropPct <= input.maxDropPct + 1e-6,
    detail: `ΔV = ${best.drop.dropPct.toFixed(2)} % (R cosφ + X senφ). |Z| = ${best.dropMod.dropPct.toFixed(2)} % (comparação).`,
    ref: "NBR 5410 6.2.7",
  });
  checks.push({
    id: "icc",
    label: "Suportabilidade à corrente de curto",
    ok: input.iscKa <= 0 || best.icw + 1e-9 >= best.iscL,
    detail: `Icc no ponto ${best.iscL.toFixed(2)} kA ≤ Icw ${best.icw.toFixed(1)} kA (k = ${kPhase}, t = ${input.iscTimeS} s)`,
    ref: "NBR 5410 5.3.4",
  });
  checks.push({
    id: "min-s",
    label: "Seção mínima do tipo de circuito",
    ok: best.s + 1e-9 >= minS,
    detail: `${best.s} mm² ≥ ${minS} mm²`,
    ref: "NBR 5410 Tabela 47",
  });
  const i2 = 1.45 * breaker;
  checks.push({
    id: "i2",
    label: "I² ≤ 1,45 Iz (sobrecarga)",
    ok: i2 <= 1.45 * iz + 1e-6,
    detail: `1,45·In = ${fmtA(i2)} · 1,45·Iz = ${fmtA(1.45 * iz)}`,
    ref: "NBR 5410 5.7.2.2.1.b",
  });
  if (conduit.nps) {
    checks.push({
      id: "conduit",
      label: "Ocupação do eletroduto",
      ok: conduit.fillPct <= 41,
      detail: `${conduit.nps} · ocupação ${conduit.fillPct.toFixed(0)} % (limite 40 % para 3+ condutores)`,
      ref: "NBR 5410 6.2.11",
    });
  }

  return {
    ib,
    fa,
    faSource: input.groupingOverride ? "Manual" : grp.source,
    ft,
    fr,
    ip,
    loaded,
    nPerPhase: best.n,
    section: best.s,
    imax: best.imax,
    iz,
    rca: best.rca,
    xl: best.xl,
    zvd: best.drop.zvd,
    dropV: best.drop.dropV,
    dropPct: best.drop.dropPct,
    dropModulusPct: best.dropMod.dropPct,
    vakm: best.drop.vakm,
    breaker,
    tc: pickTc(ib),
    pe,
    neutral: input.phases === 1 ? best.s : neutral,
    kPhase,
    iscLocalKa: best.iscL,
    icwKa: best.icw,
    conduit: conduit.nps,
    conduitFillPct: conduit.fillPct,
    cableOdMm: conduit.od,
    motor:
      motorFound && motorProt
        ? {
            kw: motorFound.kw,
            cv: motorFound.cv,
            frame: motorFound.frame,
            breaker: motorProt.breaker,
            contactor: motorProt.contactor,
            relay: motorProt.relay,
          }
        : null,
    formationLabel: FORMATION_INFO[input.formation].label,
    checks,
    ok: checks.every((c) => c.ok),
    limiting: best.limiting,
    copperKgPerKm: best.n * best.s * 3 * 8.89 / 1000,
  };
}

export function ampacityTable(method: CircuitInput["method"]) {
  return AMPACITY[method];
}
