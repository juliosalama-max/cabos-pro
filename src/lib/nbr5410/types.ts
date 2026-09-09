import type { EnvelopeState } from "@/lib/install/envelope";
import type { OccupyState } from "@/lib/install/occupy";
import type { TrayState } from "@/lib/install/tray";
import type { Formation, InstallMethod, Insulation } from "./tables-data";

export type { Formation, InstallMethod, Insulation };
export type LoadType = "kva" | "kw" | "cv" | "ib";
export type CircuitKind = "iluminacao" | "tug" | "tue" | "motor" | "alimentador" | "comando";
export type DropMethod = "nbr" | "modulus";
export type Phases = 1 | 2 | 3;
export type ConductorMetal = "Cu" | "Al";
export type OriginKind = "concessionaria" | "transformador";
export type StartMethod = "dol" | "yd" | "soft" | "vfd";
export type BreakerCurve = "B" | "C" | "D";
export type EarthingScheme = "TN-S" | "TN-C-S" | "TT" | "IT";
export type IdrType = "none" | "AC" | "A" | "F" | "B";

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
  parentId: string | null;
  harmonic3Pct: number;
  conductor: ConductorMetal;
  soilRho: number;
  conduitBends: number;
  tugPoints: number;
  tugWetPoints: number;
  areaM2: number;
  startMethod: StartMethod;
  startRatio: number;
  startPf: number;
  maxStartDropPct: number;
  breakerCurve: BreakerCurve;
  icuKa: number;
  idrMa: number;
  idrType: IdrType;
  demandFactor: number;
}

export interface CalcContext {
  earthing?: EarthingScheme;
  parent?: CircuitInput;
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
  fh: number;
  fs: number;
  peIcwKa: number;
  inNeutral: number;
  iaA: number;
  tDiscS: number;
  istA: number;
  dropStartPct: number;
  startRatio: number;
  icuKa: number;
  breakerCurve: BreakerCurve;
}

export interface ProjectMeta {
  name: string;
  client: string;
  location: string;
  responsible: string;
  crea: string;
  notes: string;
  updatedAt: string;
  origin: OriginKind;
  earthing: EarthingScheme;
}

export interface Project {
  id: string;
  meta: ProjectMeta;
  circuits: CircuitInput[];
  activeId: string;
  occupy: OccupyState;
  envelope: EnvelopeState;
  tray: TrayState;
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
    parentId: null,
    harmonic3Pct: 0,
    conductor: "Cu",
    soilRho: 2.5,
    conduitBends: 0,
    tugPoints: 0,
    tugWetPoints: 0,
    areaM2: 0,
    startMethod: "dol",
    startRatio: 0,
    startPf: 0,
    maxStartDropPct: 10,
    breakerCurve: "C",
    icuKa: 0,
    idrMa: 0,
    idrType: "none",
    demandFactor: 0,
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
  parentId: null,
  harmonic3Pct: 0,
  conductor: "Cu",
  soilRho: 2.5,
  conduitBends: 0,
  tugPoints: 0,
  tugWetPoints: 0,
  areaM2: 0,
  startMethod: "dol",
  startRatio: 0,
  startPf: 0,
  maxStartDropPct: 10,
  breakerCurve: "C",
  icuKa: 0,
  idrMa: 0,
  idrType: "none",
  demandFactor: 0,
};
