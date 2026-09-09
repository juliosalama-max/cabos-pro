import {
  AMPACITY,
  IMPEDANCE,
  type Formation,
  type Insulation,
  type InstallMethod,
} from "./tables-data";

export {
  AMPACITY,
  IMPEDANCE,
  VAKM,
  SECTIONS,
  METHODS,
  INSULATIONS,
  INSULATION_LABEL,
  FORMATIONS,
} from "./tables-data";
export type {
  Section,
  InstallMethod,
  Insulation,
  Formation,
  LoadedConductors,
  Impedance,
} from "./tables-data";

/** NBR 5410:2004 Tabela 40 — fator de temperatura. Solo ref. 20 °C = 1,00 (planilha deslocava uma linha). */
export const TEMP_FACTOR: { t: number; pvcAir: number; eprAir: number; pvcSoil: number; eprSoil: number }[] = [
  { t: 10, pvcAir: 1.22, eprAir: 1.15, pvcSoil: 1.1, eprSoil: 1.07 },
  { t: 15, pvcAir: 1.17, eprAir: 1.12, pvcSoil: 1.05, eprSoil: 1.04 },
  { t: 20, pvcAir: 1.12, eprAir: 1.08, pvcSoil: 1.0, eprSoil: 1.0 },
  { t: 25, pvcAir: 1.06, eprAir: 1.04, pvcSoil: 0.95, eprSoil: 0.96 },
  { t: 30, pvcAir: 1.0, eprAir: 1.0, pvcSoil: 0.89, eprSoil: 0.93 },
  { t: 35, pvcAir: 0.94, eprAir: 0.96, pvcSoil: 0.84, eprSoil: 0.89 },
  { t: 40, pvcAir: 0.87, eprAir: 0.91, pvcSoil: 0.77, eprSoil: 0.85 },
  { t: 45, pvcAir: 0.79, eprAir: 0.87, pvcSoil: 0.71, eprSoil: 0.8 },
  { t: 50, pvcAir: 0.71, eprAir: 0.82, pvcSoil: 0.63, eprSoil: 0.76 },
  { t: 55, pvcAir: 0.61, eprAir: 0.76, pvcSoil: 0.55, eprSoil: 0.71 },
  { t: 60, pvcAir: 0.5, eprAir: 0.71, pvcSoil: 0.45, eprSoil: 0.65 },
  { t: 65, pvcAir: 0, eprAir: 0.65, pvcSoil: 0, eprSoil: 0.6 },
  { t: 70, pvcAir: 0, eprAir: 0.58, pvcSoil: 0, eprSoil: 0.53 },
  { t: 75, pvcAir: 0, eprAir: 0.5, pvcSoil: 0, eprSoil: 0.46 },
  { t: 80, pvcAir: 0, eprAir: 0.41, pvcSoil: 0, eprSoil: 0.38 },
];

/** Tabela 13 — agrupamento em feixe / camada única. Índice = n circuitos (1–12). */
export const GROUP_A_TO_F = [1, 1, 0.8, 0.7, 0.65, 0.6, 0.57, 0.54, 0.52, 0.5, 0.45, 0.41, 0.38];
export const GROUP_E_F = [1, 1, 0.88, 0.82, 0.77, 0.75, 0.73, 0.73, 0.72, 0.72, 0.68, 0.62, 0.57];
export const GROUP_C_SPACED = [1, 1, 0.85, 0.79, 0.75, 0.73, 0.72, 0.72, 0.71, 0.7, 0.7, 0.7, 0.7];
export const GROUP_C_TOUCHING = [1, 0.95, 0.81, 0.72, 0.68, 0.66, 0.64, 0.63, 0.62, 0.61, 0.61, 0.61, 0.61];

/** Tabela 14 — mais de uma camada (C, E, F). */
export const LAYER_FACTOR: Record<string, Record<string, number>> = {
  "2": { "2": 0.68, "3": 0.62, "4": 0.6, "6": 0.58, "9": 0.56 },
  "3": { "2": 0.62, "3": 0.57, "4": 0.55, "6": 0.53, "9": 0.51 },
  "4": { "2": 0.6, "3": 0.55, "4": 0.52, "6": 0.51, "9": 0.49 },
  "6": { "2": 0.58, "3": 0.53, "4": 0.51, "6": 0.49, "9": 0.48 },
  "9": { "2": 0.56, "3": 0.51, "4": 0.49, "6": 0.48, "9": 0.46 },
};

/** Tabela 16 — cabos multipolares em dutos enterrados. spacing: 0 | 0.25 | 0.5 | 1 */
export const BURIED_MULTI: Record<number, [number, number, number, number]> = {
  2: [0.85, 0.9, 0.95, 0.95],
  3: [0.75, 0.85, 0.9, 0.95],
  4: [0.7, 0.8, 0.85, 0.9],
  5: [0.65, 0.8, 0.85, 0.9],
  6: [0.6, 0.8, 0.8, 0.8],
  7: [0.57, 0.76, 0.8, 0.88],
  8: [0.54, 0.74, 0.78, 0.88],
  9: [0.52, 0.73, 0.77, 0.87],
  10: [0.49, 0.72, 0.76, 0.86],
  12: [0.45, 0.69, 0.74, 0.85],
  16: [0.39, 0.66, 0.71, 0.83],
  20: [0.34, 0.63, 0.68, 0.82],
};

/** Tabela 17 — unipolares em dutos individuais enterrados. */
export const BURIED_UNI: Record<number, [number, number, number, number]> = {
  2: [0.8, 0.9, 0.9, 0.95],
  3: [0.7, 0.8, 0.85, 0.9],
  4: [0.65, 0.75, 0.8, 0.9],
  5: [0.6, 0.7, 0.8, 0.9],
  6: [0.6, 0.7, 0.8, 0.9],
  7: [0.53, 0.66, 0.76, 0.87],
  8: [0.5, 0.63, 0.74, 0.87],
  9: [0.47, 0.61, 0.73, 0.86],
  10: [0.45, 0.59, 0.72, 0.85],
  12: [0.41, 0.56, 0.69, 0.84],
  16: [0.34, 0.51, 0.66, 0.83],
  20: [0.29, 0.47, 0.63, 0.81],
};

export const BREAKERS = [
  6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 150, 160, 185, 200, 250, 320, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500,
];

export const CURRENT_TRANSFORMERS = [
  100, 125, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000,
];

/** k térmico — condutor de fase em cabo (Tabela 37 / 40). Cobre. */
export const K_PHASE: Record<Insulation, number> = { PVC: 115, HEPR: 143 };
/** k para PE isolado não incorporado (Tabela 38) cobre. */
export const K_PE_ISOLATED: Record<Insulation, number> = { PVC: 143, HEPR: 176 };

export const METHOD_INFO: Record<
  InstallMethod,
  { name: string; desc: string; buried: boolean }
> = {
  A1: {
    name: "A1 — condutores isolados em eletroduto na parede isolante",
    desc: "Eletroduto embutido em parede termicamente isolante. Pior dissipação.",
    buried: false,
  },
  A2: {
    name: "A2 — cabo multipolar em eletroduto na parede isolante",
    desc: "Cabo multipolar no eletroduto embutido em parede isolante.",
    buried: false,
  },
  B1: {
    name: "B1 — condutores isolados em eletroduto aparente",
    desc: "Eletroduto sobre parede de madeira ou alvenaria (aparente).",
    buried: false,
  },
  B2: {
    name: "B2 — cabo multipolar em eletroduto aparente",
    desc: "Cabo multipolar em eletroduto sobre parede.",
    buried: false,
  },
  C: {
    name: "C — cabo fixado em parede / piso",
    desc: "Cabo único ou multipolar fixado diretamente na superfície.",
    buried: false,
  },
  D: {
    name: "D — cabo em eletroduto enterrado",
    desc: "Multipolar em duto enterrado. Temperatura de referência do solo: 20 °C.",
    buried: true,
  },
  E: {
    name: "E — cabo multipolar ao ar livre",
    desc: "Bandeja, leito, prateleira. Melhor dissipação entre os multipolares.",
    buried: false,
  },
  F: {
    name: "F — cabos unipolares ao ar livre",
    desc: "Unipolares em trifólio ou plano sobre bandeja perfurada / leito.",
    buried: false,
  },
};

export const FORMATION_INFO: Record<Formation, { cores: number; unipolar: boolean; label: string }> = {
  "2x1": { cores: 2, unipolar: true, label: "2 unipolares" },
  "1x2": { cores: 2, unipolar: false, label: "1 cabo bipolar" },
  "3x1": { cores: 3, unipolar: true, label: "3 unipolares (trifólio)" },
  "1x3": { cores: 3, unipolar: false, label: "1 cabo tripolar" },
  "4x1": { cores: 4, unipolar: true, label: "4 unipolares" },
  "1x4": { cores: 4, unipolar: false, label: "1 cabo tetrapolar" },
};

/** Diâmetro externo mm — Eprotenax GSette 0,6/1 kV. */
export const CABLE_OD: Record<string, Record<string, number>> = {
  "1.5": { "3x1": 5, "4x1": 5, "1x2": 8, "1x3": 8.5, "1x4": 9.5 },
  "2.5": { "3x1": 5.4, "4x1": 5.4, "1x2": 9.1, "1x3": 9.6, "1x4": 10.5 },
  "4": { "3x1": 5.9, "4x1": 5.9, "1x2": 10.1, "1x3": 10.7, "1x4": 11.8 },
  "6": { "3x1": 6.5, "4x1": 6.5, "1x2": 11.2, "1x3": 11.9, "1x4": 13.3 },
  "10": { "3x1": 7.7, "4x1": 7.7, "1x2": 13.4, "1x3": 14.3, "1x4": 16.1 },
  "16": { "3x1": 9.3, "4x1": 9.3, "1x2": 17.7, "1x3": 19.1, "1x4": 20.9 },
  "25": { "3x1": 11.4, "4x1": 11.4, "1x2": 21.6, "1x3": 23.3, "1x4": 25.8 },
  "35": { "3x1": 12.7, "4x1": 12.7, "1x2": 24.4, "1x3": 26.3, "1x4": 28.9 },
  "50": { "3x1": 14.7, "4x1": 14.7, "1x2": 28.2, "1x3": 30.4, "1x4": 33.7 },
  "70": { "3x1": 16.8, "4x1": 16.8, "1x2": 32.6, "1x3": 35, "1x4": 38.9 },
  "95": { "3x1": 19.2, "4x1": 19.2, "1x2": 37.4, "1x3": 40, "1x4": 44.5 },
  "120": { "3x1": 21.3, "4x1": 21.3, "1x2": 41.8, "1x3": 44.8, "1x4": 50.8 },
  "150": { "3x1": 23.7, "4x1": 23.7, "1x2": 46.5, "1x3": 50.8, "1x4": 56.5 },
  "185": { "3x1": 25.8, "4x1": 25.8, "1x2": 51.7, "1x3": 55.7, "1x4": 61.8 },
  "240": { "3x1": 29.2, "4x1": 29.2, "1x2": 58.4, "1x3": 62.7, "1x4": 70.2 },
  "300": { "3x1": 31.7, "4x1": 31.7 },
};

export const CONDUITS: { nps: string; idMm: number }[] = [
  { nps: '3/8"', idMm: 12.44 },
  { nps: '1/2"', idMm: 15.75 },
  { nps: '3/4"', idMm: 20.82 },
  { nps: '1"', idMm: 26.41 },
  { nps: '1.1/4"', idMm: 35.05 },
  { nps: '1.1/2"', idMm: 40.89 },
  { nps: '2"', idMm: 52.32 },
  { nps: '2.1/2"', idMm: 62.48 },
  { nps: '3"', idMm: 77.72 },
  { nps: '3.1/2"', idMm: 89.91 },
  { nps: '4"', idMm: 102.1 },
  { nps: '4.1/2"', idMm: 114.3 },
  { nps: '5"', idMm: 128.01 },
  { nps: '6"', idMm: 153.92 },
];

/** Tabela 47 — seção mínima cobre. */
export const MIN_SECTION: Record<string, number> = {
  iluminacao: 1.5,
  tug: 2.5,
  tue: 2.5,
  motor: 2.5,
  alimentador: 2.5,
  comando: 0.5,
};

/** Tabela 48 — neutro em função da fase (S → N). */
export function minNeutral(phaseMm2: number): number {
  if (phaseMm2 <= 25) return phaseMm2;
  if (phaseMm2 <= 35) return 25;
  if (phaseMm2 <= 50) return 25;
  if (phaseMm2 <= 70) return 35;
  if (phaseMm2 <= 95) return 50;
  if (phaseMm2 <= 120) return 70;
  if (phaseMm2 <= 150) return 70;
  if (phaseMm2 <= 185) return 95;
  if (phaseMm2 <= 240) return 120;
  if (phaseMm2 <= 300) return 150;
  if (phaseMm2 <= 400) return 185;
  return 240;
}

/** Tabela 58 — PE em função da fase. */
export function minPe(phaseMm2: number): number {
  if (phaseMm2 <= 16) return phaseMm2;
  if (phaseMm2 <= 35) return 16;
  return phaseMm2 / 2;
}

export interface MotorRow {
  kw: number;
  cv: number;
  frame: string;
  rpm: number;
  eff: number;
  pf: number;
  kg: number;
  prot: Record<220 | 380 | 440, { breaker: number; contactor: string; relay: string }>;
}

function p(b: number, c: string, r: string) {
  return { breaker: b, contactor: c, relay: r };
}

export const MOTORS: MotorRow[] = [
  { kw: 0.12, cv: 0.16, frame: "63", rpm: 1720, eff: 0.61, pf: 0.6, kg: 7, prot: { 440: p(0.63, "7", "0,45-0,63"), 380: p(0.63, "7", "0,45-0,63"), 220: p(1, "7", "0,8-1,2") } },
  { kw: 0.18, cv: 0.25, frame: "63", rpm: 1710, eff: 0.665, pf: 0.63, kg: 7.5, prot: { 440: p(0.63, "7", "0,63-0,8"), 380: p(1, "7", "0,63-0,8"), 220: p(1.6, "7", "1,2-1,8") } },
  { kw: 0.25, cv: 0.33, frame: "63", rpm: 1710, eff: 0.685, pf: 0.65, kg: 8, prot: { 440: p(1, "7", "0,63-0,8"), 380: p(1, "7", "0,8-1,2"), 220: p(1.6, "7", "1,2-1,8") } },
  { kw: 0.37, cv: 0.5, frame: "71", rpm: 1720, eff: 0.72, pf: 0.65, kg: 10, prot: { 440: p(1.6, "7", "0,8-1,2"), 380: p(1.6, "7", "1,2-1,8"), 220: p(2.5, "7", "1,8-2,8") } },
  { kw: 0.55, cv: 0.75, frame: "71", rpm: 1680, eff: 0.75, pf: 0.68, kg: 11.5, prot: { 440: p(1.6, "7", "1,2-1,8"), 380: p(2.5, "7", "1,8-2,8"), 220: p(4, "7", "2,8-4") } },
  { kw: 0.75, cv: 1, frame: "80", rpm: 1730, eff: 0.826, pf: 0.8, kg: 18, prot: { 440: p(1.6, "7", "1,2-1,8"), 380: p(2.5, "7", "1,8-2,8"), 220: p(4, "7", "2,8-4") } },
  { kw: 1.1, cv: 1.5, frame: "80", rpm: 1715, eff: 0.815, pf: 0.82, kg: 16, prot: { 440: p(2.5, "7", "1,8-2,8"), 380: p(4, "7", "1,8-2,8"), 220: p(6.3, "7", "4-6,3") } },
  { kw: 1.5, cv: 2, frame: "90S", rpm: 1755, eff: 0.842, pf: 0.76, kg: 20, prot: { 440: p(4, "7", "4-6,3"), 380: p(4, "7", "2,8-4"), 220: p(6.3, "7", "5,6-8") } },
  { kw: 2.2, cv: 3, frame: "90L", rpm: 1735, eff: 0.851, pf: 0.82, kg: 23, prot: { 440: p(6.3, "7", "4-6,3"), 380: p(6.3, "7", "4-6,3"), 220: p(10, "9", "7-10") } },
  { kw: 3, cv: 4, frame: "100L", rpm: 1720, eff: 0.865, pf: 0.82, kg: 30, prot: { 440: p(6.3, "7", "4-6,3"), 380: p(10, "7", "5,6-8"), 220: p(16, "12", "8-12,5") } },
  { kw: 3.7, cv: 5, frame: "100L", rpm: 1720, eff: 0.88, pf: 0.8, kg: 33, prot: { 440: p(10, "9", "5,6-8"), 380: p(10, "9", "7-10"), 220: p(16, "16", "10-15") } },
  { kw: 4.5, cv: 6, frame: "112M", rpm: 1735, eff: 0.89, pf: 0.81, kg: 45, prot: { 440: p(10, "9", "7-10"), 380: p(10, "12", "8-12,5"), 220: p(20, "18", "11-17") } },
  { kw: 5.5, cv: 7.5, frame: "112M", rpm: 1740, eff: 0.9, pf: 0.8, kg: 46, prot: { 440: p(10, "12", "9-12"), 380: p(16, "12", "10-15"), 220: p(20, "25", "15-23") } },
  { kw: 7.5, cv: 10, frame: "132S", rpm: 1760, eff: 0.91, pf: 0.82, kg: 65, prot: { 440: p(16, "16", "10-15"), 380: p(16, "16", "11-17"), 220: p(32, "32", "22-32") } },
  { kw: 9.2, cv: 12.5, frame: "132M", rpm: 1760, eff: 0.91, pf: 0.83, kg: 75, prot: { 440: p(16, "18", "11-17"), 380: p(20, "25", "15-23"), 220: p(32, "32", "32-40") } },
  { kw: 11, cv: 15, frame: "132M/L", rpm: 1755, eff: 0.917, pf: 0.84, kg: 78, prot: { 440: p(20, "25", "15-23"), 380: p(25, "25", "15-23"), 220: p(40, "40", "32-50") } },
  { kw: 15, cv: 20, frame: "160M", rpm: 1765, eff: 0.924, pf: 0.8, kg: 120, prot: { 440: p(32, "32", "22-32"), 380: p(32, "32", "32-40"), 220: p(65, "65", "40-57") } },
  { kw: 18.5, cv: 25, frame: "160L", rpm: 1760, eff: 0.926, pf: 0.81, kg: 135, prot: { 440: p(32, "40", "32-40"), 380: p(40, "40", "32-40"), 220: p(65, "65", "57-70") } },
  { kw: 22, cv: 30, frame: "180M", rpm: 1760, eff: 0.93, pf: 0.85, kg: 185, prot: { 440: p(40, "40", "32-40"), 380: p(50, "50", "32-50"), 220: p(90, "80", "63-80") } },
  { kw: 30, cv: 40, frame: "200M", rpm: 1770, eff: 0.93, pf: 0.85, kg: 218, prot: { 440: p(50, "50", "40-57"), 380: p(65, "65", "50-63"), 220: p(105, "105", "90-112") } },
  { kw: 37, cv: 50, frame: "200L", rpm: 1770, eff: 0.932, pf: 0.85, kg: 274, prot: { 440: p(65, "65", "50-63"), 380: p(80, "80", "63-80"), 220: p(150, "150", "100-150") } },
  { kw: 45, cv: 60, frame: "225S/M", rpm: 1780, eff: 0.939, pf: 0.86, kg: 410, prot: { 440: p(75, "80", "63-80"), 380: p(95, "95", "75-97"), 220: p(150, "150", "100-150") } },
  { kw: 55, cv: 75, frame: "225S/M", rpm: 1775, eff: 0.941, pf: 0.88, kg: 410, prot: { 440: p(100, "95", "75-97"), 380: p(105, "105", "90-112"), 220: p(185, "180", "140-215") } },
  { kw: 75, cv: 100, frame: "250S/M", rpm: 1785, eff: 0.945, pf: 0.85, kg: 510, prot: { 440: p(150, "150", "100-150"), 380: p(150, "150", "100-150"), 220: p(250, "250", "200-310") } },
  { kw: 90, cv: 125, frame: "280S/M", rpm: 1785, eff: 0.95, pf: 0.85, kg: 700, prot: { 440: p(150, "150", "100-150"), 380: p(185, "180", "140-215"), 220: p(320, "300", "200-310") } },
  { kw: 110, cv: 150, frame: "280S/M", rpm: 1785, eff: 0.95, pf: 0.86, kg: 740, prot: { 440: p(185, "180", "140-215"), 380: p(250, "250", "140-215"), 220: p(420, "400", "275-420") } },
  { kw: 132, cv: 175, frame: "315S/M", rpm: 1785, eff: 0.95, pf: 0.87, kg: 841, prot: { 440: p(250, "250", "200-310"), 380: p(250, "250", "200-310"), 220: p(420, "500", "400-600") } },
  { kw: 150, cv: 200, frame: "280S/M", rpm: 1785, eff: 0.955, pf: 0.87, kg: 868, prot: { 440: p(250, "250", "200-310"), 380: p(320, "300", "200-310"), 220: p(500, "500", "400-600") } },
  { kw: 185, cv: 250, frame: "315S/M", rpm: 1785, eff: 0.955, pf: 0.86, kg: 1005, prot: { 440: p(320, "300", "200-310"), 380: p(420, "400", "275-420"), 220: p(700, "630", "560-840") } },
  { kw: 220, cv: 300, frame: "355M/L", rpm: 1790, eff: 0.955, pf: 0.87, kg: 1349, prot: { 440: p(420, "400", "275-420"), 380: p(420, "400", "275-420"), 220: p(700, "800", "560-840") } },
  { kw: 260, cv: 350, frame: "355M/L", rpm: 1790, eff: 0.96, pf: 0.87, kg: 1488, prot: { 440: p(420, "500", "275-420"), 380: p(500, "500", "400-600"), 220: p(1000, "—", "560-840") } },
  { kw: 300, cv: 400, frame: "355M/L", rpm: 1790, eff: 0.959, pf: 0.88, kg: 1590, prot: { 440: p(500, "500", "400-600"), 380: p(700, "630", "400-600"), 220: p(1000, "—", "—") } },
  { kw: 330, cv: 450, frame: "355M/L", rpm: 1790, eff: 0.961, pf: 0.88, kg: 1702, prot: { 440: p(700, "630", "400-600"), 380: p(700, "630", "560-840"), 220: p(0, "—", "—") } },
  { kw: 370, cv: 500, frame: "355M/L", rpm: 1790, eff: 0.962, pf: 0.88, kg: 1795, prot: { 440: p(700, "630", "400-600"), 380: p(700, "800", "560-840"), 220: p(0, "—", "—") } },
];

export function findMotor(kw: number): MotorRow | undefined {
  return MOTORS.find((m) => Math.abs(m.kw - kw) < 0.021);
}

export function findMotorByCv(cv: number): MotorRow | undefined {
  return MOTORS.find((m) => Math.abs(m.cv - cv) < 0.03);
}

export function motorVoltageKey(v: number): 220 | 380 | 440 | null {
  if (Math.abs(v - 220) < 15 || Math.abs(v - 230) < 15) return 220;
  if (Math.abs(v - 380) < 15) return 380;
  if (Math.abs(v - 440) < 15 || Math.abs(v - 460) < 15 || Math.abs(v - 480) < 15) return 440;
  return null;
}

export function interpolateTemp(
  t: number,
  insulation: Insulation,
  buried: boolean,
): number {
  const key = buried
    ? insulation === "PVC"
      ? "pvcSoil"
      : "eprSoil"
    : insulation === "PVC"
      ? "pvcAir"
      : "eprAir";
  const rows = TEMP_FACTOR;
  if (t <= rows[0].t) return rows[0][key];
  if (t >= rows[rows.length - 1].t) return rows[rows.length - 1][key];
  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i];
    const b = rows[i + 1];
    if (t >= a.t && t <= b.t) {
      const fa = a[key];
      const fb = b[key];
      if (fa === 0 || fb === 0) return fa || fb;
      const u = (t - a.t) / (b.t - a.t);
      return fa + u * (fb - fa);
    }
  }
  return 1;
}

export function groupingFactor(
  method: InstallMethod,
  nCircuits: number,
  opts?: { buriedDucts?: boolean; unipolar?: boolean; spacingM?: 0 | 0.25 | 0.5 | 1; layers?: number; perLayer?: number },
): { fa: number; source: string } {
  const n = Math.max(1, Math.round(nCircuits));
  if (opts?.layers && opts.layers > 1 && (method === "C" || method === "E" || method === "F")) {
    const layerKey = opts.layers >= 9 ? "9" : opts.layers >= 6 ? "6" : opts.layers >= 4 ? "4" : String(opts.layers);
    const pl = opts.perLayer ?? n;
    const col = pl >= 9 ? "9" : pl >= 6 ? "6" : pl >= 4 ? "4" : pl >= 3 ? "3" : "2";
    const f = LAYER_FACTOR[layerKey]?.[col] ?? 0.5;
    return { fa: f, source: "Tabela 14 (camadas)" };
  }
  if (method === "D" && opts?.buriedDucts && n >= 2) {
    const table = opts.unipolar ? BURIED_UNI : BURIED_MULTI;
    const keys = Object.keys(table)
      .map(Number)
      .sort((a, b) => a - b);
    let row = table[n];
    if (!row) {
      const nearest = keys.reduce((p, c) => (Math.abs(c - n) < Math.abs(p - n) ? c : p));
      row = table[nearest];
    }
    const si = opts.spacingM === 1 ? 3 : opts.spacingM === 0.5 ? 2 : opts.spacingM === 0.25 ? 1 : 0;
    return { fa: row[si], source: opts.unipolar ? "Tabela 17" : "Tabela 16" };
  }
  const idx = Math.min(12, n);
  if (method === "E" || method === "F") {
    return { fa: GROUP_E_F[idx] ?? 0.57, source: "Tabela 13 · métodos E e F" };
  }
  if (method === "C") {
    return { fa: GROUP_C_SPACED[idx] ?? 0.7, source: "Tabela 13 · método C" };
  }
  return { fa: GROUP_A_TO_F[idx] ?? 0.38, source: "Tabela 13 · métodos A a F" };
}

export function ampacityOf(
  method: InstallMethod,
  section: number,
  insulation: Insulation,
  loaded: 2 | 3,
): number | null {
  const key = section === 1.5 ? "1.5" : String(section);
  const row = AMPACITY[method]?.[key];
  if (!row) return null;
  const i = insulation === "HEPR" ? (loaded === 2 ? 0 : 1) : loaded === 2 ? 2 : 3;
  return row[i];
}

export function impedanceOf(
  insulation: Insulation,
  section: number,
  formation: Formation,
): { rca: number; xl: number } | null {
  const key = section === 1.5 ? "1.5" : String(section);
  const form = formation === "4x1" ? "4x1" : formation === "1x4" ? "1x4" : formation;
  const row = IMPEDANCE[insulation]?.[key]?.[form] ?? IMPEDANCE[insulation]?.[key]?.["3x1"];
  if (!row || row.rca == null) return null;
  return { rca: row.rca, xl: row.xl ?? 0.1 };
}

export function cableOd(section: number, formation: Formation): number | null {
  const key = section === 1.5 ? "1.5" : String(section);
  const map = CABLE_OD[key];
  if (!map) return null;
  return map[formation] ?? map["3x1"] ?? map["1x3"] ?? null;
}
