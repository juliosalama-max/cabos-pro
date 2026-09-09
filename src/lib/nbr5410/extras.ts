import type {
  BreakerCurve,
  CircuitKind,
  EarthingScheme,
  IdrType,
  ProjectMeta,
  StartMethod,
} from "./types";

/** Tab. 41 — resistividade térmica do solo (método D). Ref. 2,5 K·m/W = 1,00. */
export const SOIL_RHO = [1, 1.5, 2, 2.5, 3] as const;
export type SoilRho = (typeof SOIL_RHO)[number];

export function soilFactor(rho: number): { fs: number; source: string } {
  const table: [number, number][] = [
    [1, 1.18],
    [1.5, 1.1],
    [2, 1.05],
    [2.5, 1],
    [3, 0.96],
  ];
  let best = table[3];
  for (const row of table) {
    if (Math.abs(row[0] - rho) < Math.abs(best[0] - rho)) best = row;
  }
  return { fs: best[1], source: `Tabela 41 · ρ ${String(best[0]).replace(".", ",")} K·m/W` };
}

export function harmonicAdjust(h3: number, ib: number): {
  fh: number;
  inNeutral: number;
  sizeByIb: number;
  note: string;
} {
  const h = Math.max(0, h3);
  if (h < 15) {
    return { fh: 1, inNeutral: 0, sizeByIb: ib, note: "3ª harmônica < 15 % · neutro pelo Tab. 48" };
  }
  const inNeutral = 3 * (h / 100) * ib;
  if (h <= 33) {
    return {
      fh: 0.86,
      inNeutral,
      sizeByIb: ib,
      note: "3ª harmônica 15–33 % · fator 0,86 (quatro condutores carregados, NBR 5410 6.2.6)",
    };
  }
  return {
    fh: 0.86,
    inNeutral,
    sizeByIb: Math.max(ib, inNeutral),
    note: `3ª harmônica > 33 % · dimensionar também pelo neutro (In ≈ ${inNeutral.toFixed(1)} A)`,
  };
}

export function dropLimitPct(origin: ProjectMeta["origin"], kind: CircuitKind): number {
  if (origin !== "transformador") return 4;
  return kind === "iluminacao" ? 5 : 7;
}

/** Tempo máx. de desligamento TN (5.7.3). */
export function disconnectTimeS(kind: CircuitKind, u0: number): number {
  if (kind === "tug" || kind === "tue" || kind === "iluminacao") return 0.4;
  if (u0 <= 230) return 0.4;
  return 5;
}

/** Múltiplo instantâneo Ia/In — limite superior da faixa IEC 60898. */
export function magneticMult(curve: BreakerCurve = "C"): number {
  if (curve === "B") return 5;
  if (curve === "D") return 20;
  return 10;
}

export function magneticIa(breakerA: number, curve: BreakerCurve = "C"): number {
  return magneticMult(curve) * breakerA;
}

export const START_RATIO: Record<StartMethod, number> = {
  dol: 7.5,
  yd: 2.5,
  soft: 3,
  vfd: 1.2,
};

export const START_PF: Record<StartMethod, number> = {
  dol: 0.35,
  yd: 0.4,
  soft: 0.45,
  vfd: 0.95,
};

export const START_LABEL: Record<StartMethod, string> = {
  dol: "Direta (DOL)",
  yd: "Estrela-triângulo",
  soft: "Soft-starter",
  vfd: "Inversor (VFD)",
};

export const START_DROP_DEFAULT = 10;

export function startRatioOf(method: StartMethod, override?: number): number {
  return override && override > 0 ? override : START_RATIO[method];
}

export function startPfOf(method: StartMethod, override?: number): number {
  return override && override > 0 ? override : START_PF[method];
}

/** Capacidade de interrupção comercial, kA (IEC 60947-2 / 60898). */
export const ICU_KA = [4.5, 6, 10, 15, 25, 36, 50, 70, 100] as const;

export function pickIcu(iscKa: number): number {
  if (iscKa <= 0) return 0;
  return ICU_KA.find((x) => x + 1e-9 >= iscKa) ?? ICU_KA[ICU_KA.length - 1];
}

export function tugDemandVa(points: number, wet: number): number {
  const w = Math.min(Math.max(0, wet), Math.max(0, points));
  return w * 600 + Math.max(0, points - w) * 100;
}

export function lightingDemandW(areaM2: number, wm2 = 15): number {
  return Math.max(0, areaM2) * wm2;
}

export function alAmpacityFactor(): number {
  return 0.78;
}

export function alK(insulation: "PVC" | "HEPR"): number {
  return insulation === "PVC" ? 76 : 94;
}

export function alPeK(insulation: "PVC" | "HEPR"): number {
  return insulation === "PVC" ? 94 : 116;
}

export function minSectionAl(kind: CircuitKind): number {
  if (kind === "comando") return 2.5;
  return 16;
}

export function conduitRunLimit(outdoor: boolean, bends: number): { maxM: number; okBends: boolean } {
  const b = Math.max(0, Math.round(bends));
  const base = outdoor ? 30 : 15;
  return { maxM: Math.max(0, base - 3 * b), okBends: b <= 3 };
}

export const EARTHING_LABEL: Record<EarthingScheme, string> = {
  "TN-S": "TN-S (PE e N separados)",
  "TN-C-S": "TN-C-S (PEN na origem)",
  TT: "TT (aterramento local)",
  IT: "IT (isolado / IMD)",
};

export const IDR_TYPE_LABEL: Record<IdrType, string> = {
  none: "Sem IDR",
  AC: "AC — senoidal",
  A: "A — senoidal + pulsante",
  F: "F — frequência variável",
  B: "B — contínua lisa",
};

export function idrRequired(kind: CircuitKind, wetPoints: number, earthing?: EarthingScheme): boolean {
  if ((wetPoints ?? 0) > 0) return true;
  if (earthing === "TT") return true;
  return false;
}
