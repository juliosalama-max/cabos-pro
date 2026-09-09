import {
  AMPACITY,
  BREAKERS,
  CURRENT_TRANSFORMERS,
  FORMATION_INFO,
  K_PHASE,
  K_PE_ISOLATED,
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
import { odOf } from "@/lib/install/occupy";
import type { CircuitInput, CircuitResult, Check } from "./types";
import {
  alAmpacityFactor,
  alK,
  alPeK,
  conduitRunLimit,
  disconnectTimeS,
  harmonicAdjust,
  magneticIa,
  minSectionAl,
  soilFactor,
} from "./extras";

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

function breakerFits(ib: number, iz: number, breaker: number): boolean {
  return ib <= breaker + 1e-6 && breaker <= iz + 1e-6;
}

function pickBreaker(ib: number, iz: number, motorBreaker?: number): number {
  if (motorBreaker && breakerFits(ib, iz, motorBreaker)) return motorBreaker;
  const withMargin = BREAKERS.filter((b) => b >= ib * 1.05 - 1e-9 && b <= iz + 1e-6);
  if (withMargin.length) return withMargin[0];
  const inWindow = BREAKERS.filter((b) => b >= ib - 1e-9 && b <= iz + 1e-6);
  if (inWindow.length) return inWindow[0];
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
  insulation: CircuitInput["insulation"],
): { nps: string | null; fillPct: number; od: number | null; conductors: number } {
  const info = FORMATION_INFO[formation];
  const cores = info.unipolar ? "1" : info.cores === 2 ? "2" : info.cores === 4 ? "4" : "3";
  const family = insulation === "PVC" ? "pvc-pvc" : "eprotenax";
  const od = odOf(family, cores as "1" | "2" | "3" | "4", section) ?? cableOd(section, formation);
  if (!od) return { nps: null, fillPct: 0, od: null, conductors: 0 };
  const conductors = info.unipolar ? info.cores * nPerPhase : nPerPhase;
  const areaCables = conductors * Math.PI * (od / 2) ** 2;
  const fillLimit = conductors <= 1 ? 0.53 : conductors === 2 ? 0.31 : 0.4;
  const requiredId = 2 * Math.sqrt(areaCables / fillLimit / Math.PI);
  const c = CONDUITS.find((x) => x.idMm >= requiredId);
  const used = c ? areaCables / (Math.PI * (c.idMm / 2) ** 2) : 1;
  return { nps: c?.nps ?? null, fillPct: used * 100, od, conductors };
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
  const soil = buried ? soilFactor(input.soilRho ?? 2.5) : { fs: 1, source: "—" };
  const fs = soil.fs;
  const al = (input.conductor ?? "Cu") === "Al";
  const kPhase = al ? alK(input.insulation) : K_PHASE[input.insulation];
  const kPe = al ? alPeK(input.insulation) : K_PE_ISOLATED[input.insulation];
  const harm = harmonicAdjust(input.harmonic3Pct ?? 0, ib);
  const fh = harm.fh;
  const grp = groupingFactor(input.method, input.nCircuits, {
    buriedDucts: input.buriedDucts,
    unipolar: FORMATION_INFO[input.formation].unipolar,
    spacingM: input.burySpacingM,
    layers: input.layers,
    perLayer: input.nCircuits,
  });
  const fa = input.groupingOverride && input.groupingOverride > 0 ? input.groupingOverride : grp.fa;

  const isMotor = input.kind === "motor";
  const invCorr = fa > 0 && ft > 0 && fs > 0 && fh > 0 ? 1 / (fa * ft * fs * fh) : 1;
  const fr = input.reserveEnabled && isMotor && input.loadType !== "kva" && invCorr < 1.25 ? 1.25 : 1;
  const ip = Math.max(ib, harm.sizeByIb) * Math.max(fr, invCorr);

  const motorFound =
    isMotor ? findMotor(input.powerKw) ?? (input.powerCv > 0 ? findMotorByCv(input.powerCv) : undefined) : undefined;
  const vKey = motorVoltageKey(input.voltage);
  const motorProt = motorFound && vKey ? motorFound.prot[vKey] : null;

  const minS = al ? minSectionAl(input.kind) : (MIN_SECTION[input.kind] ?? 2.5);
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
      const imax0 = ampacityOf(input.method, s, input.insulation, loaded);
      if (imax0 == null) continue;
      const imax = imax0 * (al ? alAmpacityFactor() : 1);
      if (imax + 1e-9 < iPer) continue;
      const iz = imax * fa * ft * fs * fh * n;
      const motorBr = motorProt && motorProt.breaker >= 6 ? motorProt.breaker : undefined;
      const br = pickBreaker(ib, iz, motorBr);
      if (!breakerFits(ib, iz, br)) continue;
      const imp0 = impedanceOf(input.insulation, s, input.formation);
      if (!imp0) continue;
      const imp = al ? { rca: imp0.rca * 1.64, xl: imp0.xl } : imp0;
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
      fh,
      fs,
      peIcwKa: 0,
      inNeutral: harm.inNeutral,
      iaA: 0,
      tDiscS: 0,
    };
  }

  const iz = best.iz;
  const breaker = pickBreaker(ib, iz, motorProt && motorProt.breaker >= 6 ? motorProt.breaker : undefined);
  let pe = nearestSection(minPe(best.s));
  const tS = Math.max(input.iscTimeS, 1e-6);
  const sPeThermal = best.iscL > 0 ? (best.iscL * 1000 * Math.sqrt(tS)) / kPe : 0;
  if (sPeThermal > pe) pe = nearestSection(sPeThermal);
  const peIcwKa = (kPe * pe) / Math.sqrt(tS) / 1000;
  const needsN = input.phases !== 3 || input.formation === "4x1" || input.formation === "1x4";
  let neutral = needsN ? nearestSection(minNeutral(best.s)) : minNeutral(best.s);
  if (harm.inNeutral > ib + 1e-6) {
    const nHarm = nearestSection(best.s * (harm.inNeutral / Math.max(ib, 1e-6)));
    if (nHarm > (neutral ?? 0)) neutral = nHarm;
  }
  const conduit = sizeConduit(best.s, input.formation, best.n, input.insulation);

  const u0 = input.phases === 3 ? input.voltage / SQRT3 : input.voltage;
  const iaA = magneticIa(breaker);
  const tDiscS = disconnectTimeS(input.kind, u0);
  const run = conduitRunLimit(false, input.conduitBends ?? 0);
  const methodConduit = input.method === "A1" || input.method === "A2" || input.method === "B1" || input.method === "B2";

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
    detail: `Iz = ${fmtA(best.imax)} × Fa ${fa.toFixed(2)} × Ft ${ft.toFixed(2)} × Fs ${fs.toFixed(2)} × Fh ${fh.toFixed(2)} × ${best.n} = ${fmtA(iz)} ≥ Ib`,
    ref: "NBR 5410 6.2.5 · Tab. 33–36",
  });
  checks.push({
    id: "drop",
    label: `Queda de tensão do trecho ≤ ${input.maxDropPct} %`,
    ok: best.drop.dropPct <= input.maxDropPct + 1e-6,
    detail: `ΔV trecho = ${best.drop.dropPct.toFixed(2)} % (R cosφ + X senφ). |Z| = ${best.dropMod.dropPct.toFixed(2)} %.`,
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
    detail: `${best.s} mm² ≥ ${minS} mm²${al ? " (Al, Tab. 47)" : ""}`,
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
  checks.push({
    id: "pe-th",
    label: "PE — seção térmica (I²t)",
    ok: input.iscKa <= 0 || peIcwKa + 1e-9 >= best.iscL,
    detail: `PE ${pe} mm² · Icw PE ${peIcwKa.toFixed(1)} kA (k = ${kPe}) ≥ Icc ${best.iscL.toFixed(2)} kA`,
    ref: "NBR 5410 5.3.5 · Tab. 58",
  });
  checks.push({
    id: "disc",
    label: `Desligamento TN ≤ ${tDiscS} s`,
    ok: input.iscKa <= 0 || best.iscL * 1000 + 1e-6 >= iaA,
    detail: `Ia magnética ≈ 5·In = ${fmtA(iaA)} · Icc ${fmtA(best.iscL * 1000)} · U0 ${u0.toFixed(0)} V`,
    ref: "NBR 5410 5.7.3",
  });
  if (al) {
    checks.push({
      id: "al",
      label: "Condutor de alumínio",
      ok: best.s + 1e-9 >= minS,
      detail: `Imax ≈ 0,78 × tabela Cu · Rca × 1,64 · k ${kPhase} · mín. ${minS} mm². Confrontar com o catálogo.`,
      ref: "NBR 5410 Tab. 36 / 37 / 47",
    });
  }
  if ((input.harmonic3Pct ?? 0) >= 15) {
    checks.push({
      id: "h3",
      label: "Neutro com 3ª harmônica",
      ok: true,
      detail: harm.note + ` · N ${neutral ?? "—"} mm²`,
      ref: "NBR 5410 6.2.6",
    });
  }
  if (conduit.nps) {
    checks.push({
      id: "conduit",
      label: "Ocupação do eletroduto",
      ok: conduit.fillPct <= 41,
      detail: `${conduit.nps} · ${conduit.conductors} COND. · ocupação ${conduit.fillPct.toFixed(0)} % (1 COND. 53 % · 2 COND. 31 % · 3+ COND. 40 %)`,
      ref: "NBR 5410 6.2.11",
    });
  }
  if (methodConduit) {
    const bends = input.conduitBends ?? 0;
    checks.push({
      id: "run",
      label: "Trecho contínuo de eletroduto",
      ok: run.okBends,
      detail: `${input.lengthM} m de circuito · ${bends} curva(s) sem caixa. Limite de trecho contínuo ${run.maxM} m — interpor caixa se exceder.`,
      ref: "NBR 5410 6.2.11.1.6-b / 6.2.11.1.7",
    });
  }

  const density = al ? 2.7 : 8.89;

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
    copperKgPerKm: (best.n * best.s * 3 * density) / 1000,
    fh,
    fs,
    peIcwKa,
    inNeutral: harm.inNeutral,
    iaA,
    tDiscS,
  };
}

export function ampacityTable(method: CircuitInput["method"]) {
  return AMPACITY[method];
}
