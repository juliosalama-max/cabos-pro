import { calculate } from "./calculate";
import { dropLimitPct } from "./extras";
import { occupy } from "@/lib/install/occupy";
import { tray } from "@/lib/install/tray";
import { FORMATION_INFO } from "./tables";
import { cableSpec, fmt } from "./format";
import type { CircuitInput, CircuitKind, Project, ProjectMeta } from "./types";

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

function autoFd(kind: CircuitKind, isLargestMotor: boolean, override: number): number {
  if (override > 0) return override;
  if (kind === "motor") return isLargestMotor ? 1 : 0.75;
  return 1;
}

export interface LoadBoardRow {
  id: string;
  tag: string;
  kind: CircuitKind;
  from: string;
  to: string;
  ib: number;
  fd: number;
  idA: number;
  breaker: number;
  section: number;
  parentId: string | null;
}

export interface LoadBoardGroup {
  key: string;
  title: string;
  rows: LoadBoardRow[];
  sumIb: number;
  sumId: number;
  parentBreaker: number | null;
  parentIz: number | null;
  ok: boolean;
}

export function loadBoard(project: Project): { groups: LoadBoardGroup[]; totalId: number } {
  const results = new Map(project.circuits.map((c) => [c.id, { c, r: calculate(c, { earthing: project.meta.earthing }) }]));
  const byParent = new Map<string, CircuitInput[]>();
  for (const c of project.circuits) {
    const key = c.parentId ?? "__origin__";
    const arr = byParent.get(key) ?? [];
    arr.push(c);
    byParent.set(key, arr);
  }
  const groups: LoadBoardGroup[] = [];
  for (const [key, list] of byParent) {
    const motors = list.filter((c) => c.kind === "motor");
    let largestId = "";
    let largestIb = -1;
    for (const m of motors) {
      const ib = results.get(m.id)?.r.ib ?? 0;
      if (ib > largestIb) {
        largestIb = ib;
        largestId = m.id;
      }
    }
    const rows: LoadBoardRow[] = list.map((c) => {
      const r = results.get(c.id)!.r;
      const fd = autoFd(c.kind, motors.length >= 2 && c.id === largestId, c.demandFactor ?? 0);
      return {
        id: c.id,
        tag: c.tag,
        kind: c.kind,
        from: c.from,
        to: c.to,
        ib: r.ib,
        fd,
        idA: r.ib * fd,
        breaker: r.breaker,
        section: r.section,
        parentId: c.parentId,
      };
    });
    const parent = key === "__origin__" ? null : results.get(key);
    const sumIb = rows.reduce((s, row) => s + row.ib, 0);
    const sumId = rows.reduce((s, row) => s + row.idA, 0);
    const parentBreaker = parent?.r.breaker ?? null;
    const parentIz = parent?.r.iz ?? null;
    const ok = parentIz == null || sumId <= parentIz + 1e-6;
    const title =
      key === "__origin__"
        ? "Origem / QGBT"
        : `${parent?.c.tag ?? key} · ${parent?.c.from ?? ""} → ${parent?.c.to ?? ""}`;
    groups.push({ key, title, rows, sumIb, sumId, parentBreaker, parentIz, ok });
  }
  groups.sort((a, b) => (a.key === "__origin__" ? -1 : b.key === "__origin__" ? 1 : a.title.localeCompare(b.title)));
  const origin = groups.find((g) => g.key === "__origin__");
  return { groups, totalId: origin?.sumId ?? groups.reduce((s, g) => s + g.sumId, 0) };
}

export function bom(project: Project): { item: string; qty: string; note: string }[] {
  const lines: { item: string; qty: string; note: string }[] = [];
  for (const c of project.circuits) {
    const r = calculate(c, { earthing: project.meta.earthing });
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
    if ((c.idrMa ?? 0) > 0) {
      lines.push({
        item: `IDR ${c.idrMa} mA tipo ${c.idrType ?? "A"} (${c.tag})`,
        qty: "1",
        note: `In ${r.breaker} A`,
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
