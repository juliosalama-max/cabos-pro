import { calculate } from "./calculate";
import { dropLimitPct } from "./extras";
import { occupy } from "@/lib/install/occupy";
import { tray } from "@/lib/install/tray";
import { FORMATION_INFO } from "./tables";
import { cableSpec, fmt } from "./format";
import type { CircuitInput, Project, ProjectMeta } from "./types";

export function dropChain(
  circuits: CircuitInput[],
  id: string,
  origin: ProjectMeta["origin"] = "concessionaria",
): { totalPct: number; path: { tag: string; dropPct: number }[]; limit: number; ok: boolean; cyclic: boolean } {
  const byId = new Map(circuits.map((c) => [c.id, c]));
  const path: { tag: string; dropPct: number }[] = [];
  const seen = new Set<string>();
  let cur: CircuitInput | undefined = byId.get(id);
  let cyclic = false;
  while (cur) {
    if (seen.has(cur.id)) {
      cyclic = true;
      break;
    }
    seen.add(cur.id);
    const r = calculate(cur);
    path.unshift({ tag: cur.tag, dropPct: r.dropPct });
    if (!cur.parentId) break;
    cur = byId.get(cur.parentId);
  }
  const totalPct = path.reduce((s, p) => s + p.dropPct, 0);
  const leaf = byId.get(id);
  const limit = dropLimitPct(origin, leaf?.kind ?? "alimentador");
  return { totalPct, path, limit, ok: !cyclic && totalPct <= limit + 1e-6, cyclic };
}

export function bom(project: Project): { item: string; qty: string; note: string }[] {
  const lines: { item: string; qty: string; note: string }[] = [];
  for (const c of project.circuits) {
    const r = calculate(c);
    const cores = FORMATION_INFO[c.formation].cores * Math.max(1, r.nPerPhase);
    const m = c.lengthM * cores;
    const kg = r.copperKgPerKm * (c.lengthM / 1000);
    lines.push({
      item: `${c.tag} · ${cableSpec(r.nPerPhase, c.formation, r.section, c.insulation, c.conductor)}`,
      qty: `${fmt(m, 0)} m · ${fmt(kg, 1)} kg`,
      note: `${c.from} → ${c.to} · ${c.lengthM} m de trecho · PE ${r.pe} mm²`,
    });
    if (r.conduit) {
      lines.push({
        item: `Eletroduto ${r.conduit} (${c.tag})`,
        qty: `${fmt(c.lengthM, 0)} m`,
        note: `ocupação ${fmt(r.conduitFillPct, 0)} %`,
      });
    }
  }
  if (project.occupy?.rows?.length) {
    const o = occupy(project.occupy);
    if (o.nps) lines.push({ item: "Eletroduto (ocupação agrupada)", qty: o.nps, note: `${fmt(o.usedPct, 1)} %` });
  }
  if (project.tray?.rows?.length) {
    const t = tray(project.tray);
    if (t.chosen) {
      lines.push({
        item: `Eletrocalha ${t.chosen.w} × ${t.chosen.h} mm`,
        qty: "1 trecho",
        note: `${t.method.code} · ${fmt(t.usedPct, 1)} % · ${fmt(t.massKgM, 1)} kg/m`,
      });
    }
  }
  return lines;
}
