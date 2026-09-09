import { calculate } from "@/lib/nbr5410/calculate";
import { FORMATION_INFO } from "@/lib/nbr5410/tables";
import type { CircuitInput } from "@/lib/nbr5410/types";
import { npsToPhi } from "./occupy";
import { defaultOccupyRow, type CableFamily, type CoreKind, type OccupyRow } from "./occupy";
import { emptyEnvelope, type EnvelopeState } from "./envelope";

export function rowFromCircuit(input: CircuitInput): OccupyRow {
  const r = calculate(input);
  const info = FORMATION_INFO[input.formation];
  const family: CableFamily = input.insulation === "PVC" ? "pvc-pvc" : "eprotenax";
  const cores: CoreKind = info.unipolar ? "1" : info.cores === 2 ? "2" : info.cores === 4 ? "4" : "3";
  const quantity = info.unipolar ? info.cores * Math.max(1, r.nPerPhase) : Math.max(1, r.nPerPhase);
  return defaultOccupyRow({
    family,
    cores,
    section: r.section || 16,
    quantity,
  });
}

export function rowsFromProject(circuits: CircuitInput[]): OccupyRow[] {
  return circuits.map((c) => rowFromCircuit(c));
}

export function envelopeFromPhi(phi: number | null, copies = 1): EnvelopeState {
  const n = Math.max(1, Math.min(8, copies));
  const grid = emptyEnvelope(1, n).grid;
  if (!phi) return { grid };
  for (let i = 0; i < n; i++) grid[0][i] = phi;
  return { grid };
}

export { npsToPhi };
