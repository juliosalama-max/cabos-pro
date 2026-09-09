import { occupy, defaultOccupyRow, type OccupyRow } from "./occupy";
import { groupingFactor } from "@/lib/nbr5410/tables";

export type TrayKind = "lisa" | "perfurada" | "aramada" | "leito";

export const TRAY_KIND_LABEL: Record<TrayKind, string> = {
  lisa: "Lisa (não perfurada)",
  perfurada: "Perfurada (≥ 30 % de furos)",
  aramada: "Aramada",
  leito: "Leito (escada)",
};

/** Área dos cabos ≤ 40 % da seção interna — prática de projeto alinhada à NBR 5410 (3+ COND. em 6.2.11.1.6 e tabelas de ΔV). */
export const TRAY_FILL = 0.4;

/** Reserva de projeto, % da ocupação máxima. 0 = só o teto da norma. */
export const RESERVE_PCTS = [0, 10, 15, 20, 25, 30] as const;

export interface TraySize {
  w: number;
  h: number;
}

/** Bitolas comerciais usuais (mm), seção nominal interna. */
export const TRAYS: TraySize[] = [
  { w: 50, h: 50 },
  { w: 100, h: 50 },
  { w: 100, h: 75 },
  { w: 100, h: 100 },
  { w: 150, h: 50 },
  { w: 150, h: 75 },
  { w: 150, h: 100 },
  { w: 200, h: 50 },
  { w: 200, h: 75 },
  { w: 200, h: 100 },
  { w: 300, h: 50 },
  { w: 300, h: 75 },
  { w: 300, h: 100 },
  { w: 400, h: 50 },
  { w: 400, h: 100 },
  { w: 500, h: 100 },
  { w: 600, h: 100 },
  { w: 600, h: 150 },
];

export function trayKey(s: TraySize): string {
  return `${s.w}×${s.h}`;
}

export interface TrayState {
  kind: TrayKind;
  covered: boolean;
  size: string;
  reservePct?: number;
  dividers?: number;
  rows: OccupyRow[];
}

export function defaultTray(): TrayState {
  return {
    kind: "lisa",
    covered: true,
    size: "auto",
    reservePct: 0,
    dividers: 1,
    rows: [defaultOccupyRow()],
  };
}

export const FALLBACK_TRAY: TrayState = defaultTray();

export interface TrayMethod {
  code: string;
  label: string;
  ref: string;
}

export interface TrayResult {
  conductors: number;
  areaMm2: number;
  layerWidthMm: number;
  maxOdMm: number;
  fillLimit: number;
  reservePct: number;
  requiredAreaMm2: number;
  chosen: TraySize | null;
  usedPct: number;
  areaOk: boolean;
  layerOk: boolean;
  heightOk: boolean;
  method: TrayMethod;
  warnings: string[];
  ok: boolean;
  lines: ReturnType<typeof occupy>["lines"];
  massKgM: number;
  fa: number;
  faSource: string;
}

function methodOf(kind: TrayKind, covered: boolean, hasMultipolar: boolean): TrayMethod {
  if (covered) {
    return hasMultipolar
      ? { code: "B2", label: "B2 · eletrocalha com tampa", ref: "NBR 5410 Tab. 33 nº 32 / 36" }
      : { code: "B1", label: "B1 · eletrocalha com tampa", ref: "NBR 5410 Tab. 33 nº 31 / 35" };
  }
  if (kind === "lisa") {
    return { code: "C", label: "C · bandeja não perfurada", ref: "NBR 5410 Tab. 33 nº 12" };
  }
  if (kind === "perfurada") {
    return hasMultipolar
      ? { code: "E", label: "E · bandeja perfurada (multipolar)", ref: "NBR 5410 Tab. 33 nº 13" }
      : { code: "F", label: "F · bandeja perfurada (unipolar)", ref: "NBR 5410 Tab. 33 nº 13" };
  }
  return hasMultipolar
    ? { code: "E", label: "E · leito / aramada (multipolar)", ref: "NBR 5410 Tab. 33 nº 14 / 16" }
    : { code: "F", label: "F · leito / aramada (unipolar)", ref: "NBR 5410 Tab. 33 nº 14 / 16" };
}

function fits(size: TraySize, areaMm2: number, layerWidthMm: number, maxOdMm: number, needLayer: boolean, fill: number): boolean {
  const inner = size.w * size.h;
  if (inner * fill + 1e-9 < areaMm2) return false;
  if (size.h + 1e-9 < maxOdMm) return false;
  if (needLayer && size.w + 1e-9 < layerWidthMm) return false;
  return true;
}

export interface PackedCable {
  cx: number;
  cy: number;
  r: number;
  id: string;
}

/** Empilha na largura da calha (com tampa) ou em camada única (aberta). Coordenadas em mm, origem no canto inferior esquerdo. */
export function packTrayCables(
  lines: TrayResult["lines"],
  trayW: number,
  wrap: boolean,
): { items: PackedCable[]; width: number; height: number } {
  const items: PackedCable[] = [];
  let x = 0;
  let y = 0;
  let rowH = 0;
  for (const l of lines) {
    if (!l.odMm || l.row.quantity <= 0) continue;
    const d = l.odMm;
    for (let q = 0; q < l.row.quantity; q++) {
      if (wrap && x > 0 && x + d > trayW + 1e-6) {
        x = 0;
        y += rowH;
        rowH = 0;
      }
      items.push({ cx: x + d / 2, cy: y + d / 2, r: d / 2, id: `${l.row.id}-${q}` });
      x += d;
      rowH = Math.max(rowH, d);
    }
  }
  const height = items.reduce((m, p) => Math.max(m, p.cy + p.r), 0);
  const width = items.reduce((m, p) => Math.max(m, p.cx + p.r), 0);
  return { items, width, height };
}

export function tray(state: TrayState): TrayResult {
  const cab = occupy({ petrobras: false, rows: state.rows });
  const layerWidthMm = cab.lines.reduce((s, l) => s + (l.odMm ?? 0) * Math.max(0, l.row.quantity), 0);
  const maxOdMm = cab.lines.reduce((m, l) => Math.max(m, l.odMm ?? 0), 0);
  const reservePct = Math.min(50, Math.max(0, state.reservePct ?? 0));
  const dividers = Math.max(1, Math.round(state.dividers ?? 1));
  const fillLimit = TRAY_FILL * (1 - reservePct / 100) / dividers;
  const requiredAreaMm2 = fillLimit > 0 ? cab.areaMm2 / (TRAY_FILL * (1 - reservePct / 100)) * dividers : 0;
  const hasMultipolar = state.rows.some((r) => r.quantity > 0 && r.cores !== "1");
  const needLayer = !state.covered;
  const method = methodOf(state.kind, state.covered, hasMultipolar);

  const catalog = [...TRAYS].sort((a, b) => a.w * a.h - b.w * b.h || a.w - b.w || a.h - b.h);
  let chosen: TraySize | null = null;
  if (state.size !== "auto") {
    const [w, h] = state.size.split("×").map(Number);
    const hit = TRAYS.find((t) => t.w === w && t.h === h);
    if (hit) chosen = hit;
  } else {
    chosen = catalog.find((t) => {
      if (!fits(t, cab.areaMm2, layerWidthMm, maxOdMm, needLayer, fillLimit)) return false;
      const packed = packTrayCables(cab.lines, t.w, !needLayer);
      return packed.height <= t.h + 1e-6;
    }) ?? null;
  }

  const inner = chosen ? chosen.w * chosen.h : 0;
  const usedPct = chosen && inner > 0 ? (cab.areaMm2 / inner) * 100 : 0;
  const packed = chosen ? packTrayCables(cab.lines, chosen.w, !needLayer) : null;
  const areaOk = chosen ? inner * fillLimit + 1e-9 >= cab.areaMm2 : false;
  const layerOk = chosen ? !needLayer || chosen.w + 1e-9 >= layerWidthMm : false;
  const heightOk = chosen && packed ? packed.height <= chosen.h + 1e-6 : false;

  const warnings: string[] = [...cab.warnings];
  const isolated = state.rows.some((r) => r.quantity > 0 && r.family === "pirastic");
  if (isolated && !state.covered) {
    warnings.push("NBR 5410 6.2.11.4.1: condutor isolado (Pirastic 750 V) só em eletrocalha/perfilado com tampa desmontável, IP4X no mínimo.");
  }
  if (state.kind === "perfurada") {
    warnings.push("Bandeja perfurada: furos ≥ 30 % da área (nota 4 da Tab. 33). Menos que isso = lisa (método C).");
  }
  if (needLayer) {
    warnings.push("Linha aberta (sem tampa): Tab. 42 admite camada única. Largura útil ≥ soma dos Ø externos.");
  }
  if (reservePct > 0) {
    warnings.push(
      `Reserva de projeto ${reservePct} %: ocupação máxima ${fmtPct(fillLimit)} da seção (teto NBR 40 %). A norma não exige reserva — é critério do escritório.`,
    );
  }
  for (const l of cab.lines) if (l.error) warnings.push(l.error);

  const massKgM = cab.lines.reduce((s, l) => {
    const cores = Number(l.row.cores) || 1;
    return s + Math.max(0, l.row.quantity) * l.row.section * cores * (8.89 / 1000) * 1.4;
  }, 0);
  const nCirc = Math.max(1, state.rows.filter((r) => r.quantity > 0).length);
  const grpMethod = method.code === "B2" ? "B1" : method.code === "C" ? "C" : method.code === "F" ? "F" : "E";
  const grp = groupingFactor(grpMethod, nCirc);
  if (chosen) {
    const cap = (chosen.w / 50) * 12;
    if (massKgM > cap) {
      warnings.push(`Peso estimado ${massKgM.toFixed(1)} kg/m acima da ordem de ${cap.toFixed(0)} kg/m para ${chosen.w} mm (catálogo típico, não NBR).`);
    }
  }
  if (dividers > 1) {
    warnings.push(`Divisor: área útil ÷ ${dividers}.`);
  }

  const ok = Boolean(chosen) && areaOk && layerOk && heightOk && cab.areaMm2 > 0 && cab.lines.every((l) => !l.error);

  return {
    conductors: cab.conductors,
    areaMm2: cab.areaMm2,
    layerWidthMm,
    maxOdMm,
    fillLimit,
    reservePct,
    requiredAreaMm2,
    chosen,
    usedPct,
    areaOk,
    layerOk,
    heightOk,
    method,
    warnings,
    ok,
    lines: cab.lines,
    massKgM,
    fa: grp.fa,
    faSource: grp.source,
  };
}

function fmtPct(x: number): string {
  return `${(x * 100).toFixed(0)} %`;
}
