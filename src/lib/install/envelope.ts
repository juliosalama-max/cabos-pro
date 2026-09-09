export const ENVELOPE_PHI = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5] as const;
export type EnvelopePhi = (typeof ENVELOPE_PHI)[number];

export const ENVELOPE_MAX = 8;
export const ENVELOPE_MIN = 1;

/** 0 = vazio. Valores em polegadas. */
export type EnvelopeGrid = number[][];

export interface EnvelopeState {
  grid: EnvelopeGrid;
}

export function defaultEnvelope(): EnvelopeState {
  return {
    grid: [
      [2, 2],
      [2, 2],
    ],
  };
}

export function emptyEnvelope(rows = 2, cols = 2): EnvelopeState {
  const r = clampSize(rows);
  const c = clampSize(cols);
  return {
    grid: Array.from({ length: r }, () => Array.from({ length: c }, () => 0)),
  };
}

function clampSize(n: number): number {
  return Math.max(ENVELOPE_MIN, Math.min(ENVELOPE_MAX, Math.round(n) || ENVELOPE_MIN));
}

export function gridSize(grid: EnvelopeGrid): { rows: number; cols: number } {
  const rows = Math.max(1, grid.length);
  const cols = Math.max(1, grid[0]?.length ?? 1);
  return { rows, cols };
}

export function addRow(grid: EnvelopeGrid): EnvelopeGrid {
  const { rows, cols } = gridSize(grid);
  if (rows >= ENVELOPE_MAX) return grid;
  return [...grid.map((row) => row.slice()), Array.from({ length: cols }, () => 0)];
}

export function addCol(grid: EnvelopeGrid): EnvelopeGrid {
  const { cols } = gridSize(grid);
  if (cols >= ENVELOPE_MAX) return grid;
  return grid.map((row) => [...row, 0]);
}

export function removeRow(grid: EnvelopeGrid): EnvelopeGrid {
  const { rows } = gridSize(grid);
  if (rows <= ENVELOPE_MIN) return grid;
  return grid.slice(0, -1).map((row) => row.slice());
}

export function removeCol(grid: EnvelopeGrid): EnvelopeGrid {
  const { cols } = gridSize(grid);
  if (cols <= ENVELOPE_MIN) return grid;
  return grid.map((row) => row.slice(0, -1));
}

interface Abc {
  phi: number;
  a: number;
  b: number;
  c: number;
}

/** Capa e recuo de face, mm. */
const ABC: Abc[] = [
  { phi: 1, a: 85, b: 110, c: 90 },
  { phi: 1.5, a: 100, b: 125, c: 100 },
  { phi: 2, a: 115, b: 135, c: 105 },
  { phi: 2.5, a: 125, b: 150, c: 110 },
  { phi: 3, a: 140, b: 165, c: 120 },
  { phi: 3.5, a: 155, b: 180, c: 125 },
  { phi: 4, a: 170, b: 190, c: 135 },
  { phi: 5, a: 185, b: 220, c: 145 },
];

/** Distância D entre dois Φ, mm. Linhas/colunas = ENVELOPE_PHI. */
const D: number[][] = [
  [85, 95, 100, 105, 115, 120, 125, 140],
  [95, 100, 105, 115, 120, 125, 135, 150],
  [100, 105, 115, 120, 125, 135, 140, 155],
  [105, 115, 120, 125, 135, 140, 150, 180],
  [115, 120, 125, 135, 140, 150, 155, 170],
  [120, 125, 135, 140, 150, 155, 160, 175],
  [125, 135, 140, 150, 155, 160, 170, 180],
  [140, 150, 155, 160, 170, 175, 180, 195],
];

function abcOf(phi: number): Abc | null {
  return ABC.find((r) => r.phi === phi) ?? null;
}

function dOf(a: number, b: number): number | null {
  const i = ENVELOPE_PHI.indexOf(a as EnvelopePhi);
  const j = ENVELOPE_PHI.indexOf(b as EnvelopePhi);
  if (i < 0 || j < 0) return null;
  return D[i][j];
}

export interface EnvelopeDim {
  key: string;
  label: string;
  mm: number;
  hint: string;
}

export interface EnvelopeResult {
  used: { r: number; c: number; phi: number }[];
  colMax: (number | null)[];
  rowMax: (number | null)[];
  horizontal: EnvelopeDim[];
  vertical: EnvelopeDim[];
  widthMm: number;
  heightMm: number;
  ok: boolean;
  rows: number;
  cols: number;
}

function colPhi(grid: EnvelopeGrid, c: number): number | null {
  const { rows } = gridSize(grid);
  let m = 0;
  for (let r = 0; r < rows; r++) m = Math.max(m, grid[r]?.[c] ?? 0);
  return m > 0 ? m : null;
}

function rowPhi(grid: EnvelopeGrid, r: number): number | null {
  const { cols } = gridSize(grid);
  let m = 0;
  for (let c = 0; c < cols; c++) m = Math.max(m, grid[r]?.[c] ?? 0);
  return m > 0 ? m : null;
}

function hLabel(i: number, n: number, kind: "cover-left" | "space" | "cover-right"): string {
  if (kind === "cover-left") return "C";
  if (kind === "cover-right") {
    if (n === 1) return "C";
    if (n === 2) return "C1";
    return `C${n - 1}`;
  }
  return i === 0 ? "D" : `D${i + 1}`;
}

function vLabel(i: number, n: number): string {
  if (i === 0) return "B";
  if (i === 1) return "A2";
  if (i === n - 1) return "A";
  if (i === 2) return "A1";
  return `A${i}`;
}

export const ENVELOPE_BASE_MM = 75;

/** Ø externo aproximado do eletroduto (aço rígido, mm) para o corte. */
export function phiOdMm(phi: number): number {
  const map: Record<number, number> = {
    1: 33.4,
    1.5: 48.3,
    2: 60.3,
    2.5: 73,
    3: 88.9,
    3.5: 101.6,
    4: 114.3,
    5: 141.3,
  };
  return map[phi] ?? phi * 33.4;
}

export function exampleEnvelope1(): EnvelopeState {
  return {
    grid: [
      [1, 1],
      [1, 1],
    ],
  };
}

export const FALLBACK_ENVELOPE: EnvelopeState = defaultEnvelope();

export function envelope(state: EnvelopeState): EnvelopeResult {
  const grid = state.grid;
  const { rows, cols } = gridSize(grid);
  const used: EnvelopeResult["used"] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const phi = grid[r]?.[c] ?? 0;
      if (phi > 0) used.push({ r, c, phi });
    }
  }

  const colMax = Array.from({ length: cols }, (_, c) => colPhi(grid, c));
  const rowMax = Array.from({ length: rows }, (_, r) => rowPhi(grid, r));
  const usedCols = colMax.map((p, i) => ({ i, p })).filter((x) => x.p != null) as { i: number; p: number }[];
  const usedRows = rowMax.map((p, i) => ({ i, p })).filter((x) => x.p != null) as { i: number; p: number }[];

  const horizontal: EnvelopeDim[] = [];
  if (usedCols.length) {
    const left = abcOf(usedCols[0].p);
    if (left) {
      horizontal.push({
        key: "C",
        label: hLabel(0, usedCols.length, "cover-left"),
        mm: left.c,
        hint: `recuo esquerdo · Φ ${fmtPhi(usedCols[0].p)}`,
      });
    }
    for (let i = 0; i < usedCols.length - 1; i++) {
      const d = dOf(usedCols[i].p, usedCols[i + 1].p);
      if (d != null) {
        horizontal.push({
          key: `D${i + 1}`,
          label: hLabel(i, usedCols.length, "space"),
          mm: d,
          hint: `eixo a eixo · Φ ${fmtPhi(usedCols[i].p)} × Φ ${fmtPhi(usedCols[i + 1].p)}`,
        });
      }
    }
    const right = abcOf(usedCols[usedCols.length - 1].p);
    if (right) {
      horizontal.push({
        key: "C-right",
        label: hLabel(0, usedCols.length, "cover-right"),
        mm: right.c,
        hint: `recuo direito · Φ ${fmtPhi(usedCols[usedCols.length - 1].p)}`,
      });
    }
  }

  const vertical: EnvelopeDim[] = [];
  if (usedRows.length) {
    const top = abcOf(usedRows[0].p);
    if (top) {
      vertical.push({
        key: "B",
        label: "B",
        mm: top.b,
        hint: `topo do envelope até a face inferior do duto · Φ ${fmtPhi(usedRows[0].p)}`,
      });
    }
    for (let i = 1; i < usedRows.length; i++) {
      const rec = abcOf(usedRows[i].p);
      if (!rec) continue;
      const lab = vLabel(i, usedRows.length);
      vertical.push({
        key: lab,
        label: lab,
        mm: rec.a,
        hint: `face inferior da fiada de cima até a face inferior desta · Φ ${fmtPhi(usedRows[i].p)}`,
      });
    }
    vertical.push({
      key: "base",
      label: "75",
      mm: ENVELOPE_BASE_MM,
      hint: "capa inferior fixa · face do último duto até o fundo",
    });
  }

  const widthMm = horizontal.reduce((s, d) => s + d.mm, 0);
  const heightMm = vertical.reduce((s, d) => s + d.mm, 0);

  return {
    used,
    colMax,
    rowMax,
    horizontal,
    vertical,
    widthMm,
    heightMm,
    ok: used.length > 0 && widthMm > 0 && heightMm > 0,
    rows,
    cols,
  };
}

export function fmtPhi(phi: number): string {
  if (!phi) return "—";
  const n = Number.isInteger(phi) ? String(phi) : String(phi).replace(".", ",");
  return `${n}"`;
}

export function setCell(grid: EnvelopeGrid, r: number, c: number, phi: number): EnvelopeGrid {
  return grid.map((row, i) => (i === r ? row.map((v, j) => (j === c ? phi : v)) : row.slice()));
}
