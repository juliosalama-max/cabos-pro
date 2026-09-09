import { CONDUITS } from "@/lib/nbr5410/tables";
import { SECTIONS } from "@/lib/nbr5410/tables-data";
import { newId } from "@/lib/nbr5410/types";
import { conduitRunLimit } from "@/lib/nbr5410/extras";

export type CableFamily = "eprotenax" | "pvc-pvc" | "pirastic" | "eprotenax-conc";
export type CoreKind = "1" | "2" | "3" | "4";

export interface OccupyRow {
  id: string;
  family: CableFamily;
  cores: CoreKind;
  section: number;
  quantity: number;
}

export interface OccupyState {
  petrobras: boolean;
  reservePct?: number;
  runM?: number;
  bends?: number;
  outdoor?: boolean;
  rows: OccupyRow[];
}

export const FAMILY_LABEL: Record<CableFamily, string> = {
  eprotenax: "EPR/HEPR · Eprotenax 0,6/1 kV",
  "pvc-pvc": "PVC/PVC · Sintenax 0,6/1 kV",
  pirastic: "PVC 750 V · Pirastic",
  "eprotenax-conc": "EPR concêntrico 3/C",
};

export const CORE_LABEL: Record<CoreKind, string> = {
  "1": "Singelo",
  "2": "2 condutores",
  "3": "3 condutores",
  "4": "4 condutores",
};

/** Diâmetro externo mm — planilha de ocupação. */
const OD: Record<CableFamily, Record<CoreKind, Record<string, number>>> = {
  eprotenax: {
    "1": {
      "1.5": 5, "2.5": 5.4, "4": 5.9, "6": 6.5, "10": 7.7, "16": 9.3, "25": 11.4,
      "35": 12.7, "50": 14.7, "70": 16.8, "95": 19.2, "120": 21.3, "150": 23.7,
      "185": 25.8, "240": 29.2, "300": 31.7,
    },
    "2": {
      "1.5": 8, "2.5": 9.1, "4": 10.1, "6": 11.2, "10": 13.4, "16": 17.7, "25": 21.6,
      "35": 24.4, "50": 28.2, "70": 32.6, "95": 37.4, "120": 41.8, "150": 46.5,
      "185": 51.7, "240": 58.4,
    },
    "3": {
      "1.5": 8.5, "2.5": 9.6, "4": 10.7, "6": 11.9, "10": 14.3, "16": 19.1, "25": 23.3,
      "35": 26.3, "50": 30.4, "70": 35, "95": 40, "120": 44.8, "150": 50.8,
      "185": 55.7, "240": 62.7,
    },
    "4": {
      "1.5": 9.5, "2.5": 10.5, "4": 11.8, "6": 13.3, "10": 16.1, "16": 20.9, "25": 25.8,
      "35": 28.9, "50": 33.7, "70": 38.9, "95": 44.5, "120": 50.8, "150": 56.5,
      "185": 61.8, "240": 70.2,
    },
  },
  "pvc-pvc": {
    "1": {
      "1.5": 4.9, "2.5": 5.4, "4": 6.5, "6": 7, "10": 8, "16": 9.5, "25": 11.6,
      "35": 12.9, "50": 15.3, "70": 17.1, "95": 19.6, "120": 21.5, "150": 24,
      "185": 26.2, "240": 29.8,
    },
    "2": {
      "1.5": 8.5, "2.5": 9.6, "4": 11.5, "6": 12.7, "10": 14.8, "16": 18.2, "25": 22,
      "35": 24.9, "50": 30.3, "70": 33.8, "95": 38.4, "120": 42.4, "150": 47.1,
      "185": 52.4, "240": 59.5,
    },
    "3": {
      "1.5": 9.3, "2.5": 10.2, "4": 12.4, "6": 13.5, "10": 15.7, "16": 19.4, "25": 23.6,
      "35": 26.6, "50": 32.1, "70": 36.2, "95": 41.3, "120": 45.6, "150": 50.8,
      "185": 55.6, "240": 63.3,
    },
    "4": {
      "1.5": 10.1, "2.5": 11.1, "4": 13.5, "6": 14.8, "10": 17.5, "16": 21.5, "25": 26.2,
      "35": 30.2, "50": 35.6, "70": 40.4, "95": 45.8, "120": 50.8, "150": 56.6,
      "185": 62, "240": 70.5,
    },
  },
  pirastic: {
    "1": {
      "1.5": 3, "2.5": 3.6, "4": 4.2, "6": 4.7, "10": 6, "16": 7.6, "25": 9.4,
      "35": 10.8, "50": 12.8, "70": 14.6, "95": 16.8, "120": 18.7, "150": 20.9,
      "185": 23, "240": 26.3,
    },
    "2": {},
    "3": {},
    "4": {},
  },
  "eprotenax-conc": {
    "1": {},
    "2": {},
    "3": {
      "2.5": 15.8, "4": 16.7, "6": 17.8, "10": 20, "16": 23.9, "25": 25.4,
      "35": 28, "50": 32, "70": 36.2, "95": 40, "120": 44.8, "150": 49.7,
      "185": 54.7, "240": 61.7,
    },
    "4": {},
  },
};

export const BEND_RADIUS: Record<string, number> = {
  "2.5": 190, "4": 200, "6": 214, "10": 240, "16": 287, "25": 305,
  "35": 336, "50": 384, "70": 434, "95": 480, "120": 538, "150": 596,
  "185": 656, "240": 740,
};

export const OCCUPY_SECTIONS = SECTIONS;

export function defaultOccupyRow(partial?: Partial<OccupyRow>): OccupyRow {
  return {
    id: newId(),
    family: "eprotenax",
    cores: "1",
    section: 16,
    quantity: 4,
    ...partial,
  };
}

export function defaultOccupy(): OccupyState {
  return { petrobras: true, reservePct: 0, runM: 0, bends: 0, outdoor: false, rows: [defaultOccupyRow()] };
}

export function odOf(family: CableFamily, cores: CoreKind, section: number): number | null {
  const key = section === 1.5 ? "1.5" : String(section);
  const v = OD[family]?.[cores]?.[key];
  return v && v > 0 ? v : null;
}

export function coresAllowed(family: CableFamily): CoreKind[] {
  if (family === "pirastic") return ["1"];
  if (family === "eprotenax-conc") return ["3"];
  return ["1", "2", "3", "4"];
}

export function fillLimit(count: number): { pct: number; label: string; rule: string } {
  if (count <= 1) return { pct: 0.53, label: "1 COND. (53 %)", rule: "1 COND." };
  if (count === 2) return { pct: 0.31, label: "2 COND. (31 %)", rule: "2 COND." };
  return { pct: 0.4, label: "3 ou mais COND. (40 %)", rule: "3+ COND." };
}

export const FILL_RATES = [
  { rule: "1 COND.", pct: 53, note: "um condutor no duto" },
  { rule: "2 COND.", pct: 31, note: "dois condutores no duto" },
  { rule: "3 ou mais COND.", pct: 40, note: "três ou mais condutores" },
] as const;

export interface OccupyLine {
  row: OccupyRow;
  odMm: number | null;
  areaMm2: number;
  error?: string;
}

export interface OccupyResult {
  lines: OccupyLine[];
  conductors: number;
  areaMm2: number;
  fill: { pct: number; label: string; rule: string };
  designPct: number;
  reservePct: number;
  requiredIdMm: number;
  nps: string | null;
  idMm: number | null;
  usedPct: number;
  skipped: string[];
  warnings: string[];
  ok: boolean;
  phi: number | null;
  bendMm: number;
}

const SKIP_PETROBRAS = new Set(['3"', '3.1/2"']);

export function npsToPhi(nps: string | null): number | null {
  if (!nps) return null;
  const map: Record<string, number> = {
    '1"': 1,
    '1.1/4"': 1.5,
    '1.1/2"': 1.5,
    '2"': 2,
    '2.1/2"': 2.5,
    '3"': 3,
    '3.1/2"': 3.5,
    '4"': 4,
    '4.1/2"': 5,
    '5"': 5,
    '6"': 5,
  };
  return map[nps] ?? null;
}

export const FALLBACK_OCCUPY: OccupyState = defaultOccupy();

export function occupy(state: OccupyState): OccupyResult {
  const lines: OccupyLine[] = state.rows.map((row) => {
    const qty = Math.max(0, Math.round(row.quantity));
    if (qty <= 0) return { row, odMm: null, areaMm2: 0 };
    const allowed = coresAllowed(row.family);
    const cores = allowed.includes(row.cores) ? row.cores : allowed[0];
    const odMm = odOf(row.family, cores, row.section);
    if (!odMm) {
      return { row: { ...row, cores }, odMm: null, areaMm2: 0, error: "Sem Ø de catálogo para esta seção/formação." };
    }
    const areaMm2 = qty * Math.PI * (odMm / 2) ** 2;
    return { row: { ...row, cores }, odMm, areaMm2 };
  });

  const conductors = lines.reduce((s, l) => s + Math.max(0, Math.round(l.row.quantity)), 0);
  const areaMm2 = lines.reduce((s, l) => s + l.areaMm2, 0);
  const fill = fillLimit(conductors);
  const reservePct = Math.min(50, Math.max(0, state.reservePct ?? 0));
  const designPct = fill.pct * (1 - reservePct / 100);
  const requiredIdMm = areaMm2 > 0 && designPct > 0 ? 2 * Math.sqrt(areaMm2 / designPct / Math.PI) : 0;

  const skipped: string[] = [];
  const list = state.petrobras
    ? CONDUITS.filter((c) => {
        if (SKIP_PETROBRAS.has(c.nps)) {
          skipped.push(c.nps);
          return false;
        }
        return true;
      })
    : CONDUITS;

  const chosen = requiredIdMm > 0 ? list.find((c) => c.idMm + 1e-9 >= requiredIdMm) : undefined;
  const usedPct = chosen ? (areaMm2 / (Math.PI * (chosen.idMm / 2) ** 2)) * 100 : 0;

  const warnings: string[] = [];
  if (state.petrobras) {
    const heavy = lines.some((l) => l.row.section >= 35 && l.row.quantity > 0);
    const other = lines.filter((l) => l.row.quantity > 0).length > 1;
    if (heavy && (other || lines.some((l) => l.row.section >= 35 && l.row.quantity > 1))) {
      warnings.push("Critério Petrobras: a partir de 35 mm², um circuito por eletroduto.");
    }
  }
  if (reservePct > 0) {
    warnings.push(
      `Reserva de projeto ${reservePct} %: ocupação máxima ${(designPct * 100).toFixed(0)} % (teto NBR ${fill.label}). A norma não exige reserva — é critério do escritório.`,
    );
  }
  for (const l of lines) if (l.error) warnings.push(l.error);

  const bendMm = lines.reduce((m, l) => {
    if (!l.row.quantity) return m;
    const b = BEND_RADIUS[String(l.row.section)] ?? 0;
    return Math.max(m, b);
  }, 0);
  if (bendMm) warnings.push(`Raio mínimo de curvatura do cabo: ${bendMm} mm (catálogo).`);

  const runM = state.runM ?? 0;
  const bends = state.bends ?? 0;
  if (runM > 0 || bends > 0) {
    const lim = conduitRunLimit(Boolean(state.outdoor), bends);
    if (!lim.okBends) warnings.push("No máximo 3 curvas de 90° (ou 270°) entre caixas — NBR 5410 6.2.11.1.7.");
    if (runM > lim.maxM) {
      warnings.push(
        `Trecho contínuo ${runM} m > ${lim.maxM} m (${state.outdoor ? "30 m externo" : "15 m interno"} − 3 m/curva). Interpor caixa.`,
      );
    }
  }

  const ok = Boolean(chosen) && lines.every((l) => !l.error) && areaMm2 > 0;

  return {
    lines,
    conductors,
    areaMm2,
    fill,
    designPct,
    reservePct,
    requiredIdMm,
    nps: chosen?.nps ?? null,
    idMm: chosen?.idMm ?? null,
    usedPct,
    skipped,
    warnings,
    ok,
    phi: npsToPhi(chosen?.nps ?? null),
    bendMm,
  };
}
