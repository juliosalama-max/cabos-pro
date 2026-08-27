import type { Formation, InstallMethod, Insulation } from "./tables-data";

export type { Formation, InstallMethod, Insulation };
export type LoadType = "kva" | "kw" | "cv" | "ib";
export type CircuitKind = "iluminacao" | "tug" | "tue" | "motor" | "alimentador" | "comando";
export type DropMethod = "nbr" | "modulus";
export type Phases = 1 | 2 | 3;

export interface CircuitInput {
  id: string;
  tag: string;
  from: string;
  to: string;
  kind: CircuitKind;
  loadType: LoadType;
  powerKw: number;
  powerKva: number;
  powerCv: number;
  ibManual: number;
  voltage: number;
  phases: Phases;
  pf: number;
  efficiency: number;
  lengthM: number;
  tempC: number;
  nCircuits: number;
  method: InstallMethod;
  insulation: Insulation;
  formation: Formation;
  maxDropPct: number;
  dropMethod: DropMethod;
  iscKa: number;
  iscTimeS: number;
  groupingOverride: number | null;
  buriedDucts: boolean;
  burySpacingM: 0 | 0.25 | 0.5 | 1;
  layers: number;
  reserveEnabled: boolean;
  notes: string;
}

export interface Check {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
  ref: string;
}

export interface CircuitResult {
  ib: number;
  fa: number;
  faSource: string;
  ft: number;
  fr: number;
  ip: number;
  loaded: 2 | 3;
  nPerPhase: number;
  section: number;
  imax: number;
  iz: number;
  rca: number;
  xl: number;
  zvd: number;
  dropV: number;
  dropPct: number;
  dropModulusPct: number;
  vakm: number;
  breaker: number;
  tc: number | null;
  pe: number;
  neutral: number | null;
  kPhase: number;
  iscLocalKa: number;
  icwKa: number;
  conduit: string | null;
  conduitFillPct: number;
  cableOdMm: number | null;
  motor: {
    kw: number;
    cv: number;
    frame: string;
    breaker: number;
    contactor: string;
    relay: string;
  } | null;
  formationLabel: string;
  checks: Check[];
  ok: boolean;
  limiting: string;
  copperKgPerKm: number;
}

export interface ProjectMeta {
  name: string;
  client: string;
  location: string;
  responsible: string;
  crea: string;
  notes: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  meta: ProjectMeta;
  circuits: CircuitInput[];
  activeId: string;
}

export const KIND_LABEL: Record<CircuitKind, string> = {
  iluminacao: "Iluminação",
  tug: "TUG — tomadas de uso geral",
  tue: "TUE — tomadas de uso específico",
  motor: "Motor",
  alimentador: "Alimentador",
  comando: "Comando / sinal",
};

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function defaultCircuit(partial?: Partial<CircuitInput>): CircuitInput {
  return {
    id: newId(),
    tag: "C-01",
    from: "QGBT",
    to: "Carga",
    kind: "alimentador",
    loadType: "kva",
    powerKw: 0,
    powerKva: 30,
    powerCv: 0,
    ibManual: 0,
    voltage: 380,
    phases: 3,
    pf: 0.92,
    efficiency: 1,
    lengthM: 40,
    tempC: 30,
    nCircuits: 1,
    method: "B1",
    insulation: "HEPR",
    formation: "3x1",
    maxDropPct: 4,
    dropMethod: "nbr",
    iscKa: 15,
    iscTimeS: 0.1,
    groupingOverride: null,
    buriedDucts: false,
    burySpacingM: 0,
    layers: 1,
    reserveEnabled: true,
    notes: "",
    ...partial,
  };
}

export const EXAMPLE_FEEDER: CircuitInput = {
  id: "ex-planilha",
  tag: "AL-01",
  from: "PN-4600002",
  to: "PN-6210.03005",
  kind: "alimentador",
  loadType: "kva",
  powerKw: 0,
  powerKva: 150,
  powerCv: 0,
  ibManual: 0,
  voltage: 480,
  phases: 3,
  pf: 1,
  efficiency: 1,
  lengthM: 320,
  tempC: 40,
  nCircuits: 6,
  method: "F",
  insulation: "HEPR",
  formation: "3x1",
  maxDropPct: 3,
  dropMethod: "nbr",
  iscKa: 80,
  iscTimeS: 0.05,
  groupingOverride: null,
  buriedDucts: false,
  burySpacingM: 0,
  layers: 1,
  reserveEnabled: true,
  notes:
    "Circuito de referência da planilha (150 kVA · 480 V · 320 m). Dimensionado com R cosφ + X senφ (NBR 5410). A planilha original usava |Z| e chegava a 240 mm².",
};
