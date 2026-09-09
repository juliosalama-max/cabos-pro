import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculate } from "./calculate.ts";
import { defaultCircuit, EXAMPLE_FEEDER } from "./types.ts";
import {
  conduitRunLimit,
  dropLimitPct,
  harmonicAdjust,
  lightingDemandW,
  magneticIa,
  minSectionAl,
  soilFactor,
  tugDemandVa,
} from "./extras.ts";
import { bom, dropChain } from "./project-calc.ts";
import { occupy } from "../install/occupy.ts";
import { exampleEnvelope1, envelope } from "../install/envelope.ts";
import { defaultTray, tray } from "../install/tray.ts";

describe("NBR 5410 engine", () => {
  it("30 kVA B1 40 m skips 6 mm² (In 50 > Iz 48) and sizes 10 mm²", () => {
    const r = calculate(defaultCircuit());
    assert.equal(r.section, 10);
    assert.equal(r.breaker, 50);
    assert.ok(r.ok);
    const ibInIz = r.checks.find((c) => c.id === "ib-in-iz");
    assert.ok(ibInIz?.ok);
  });

  it("example feeder 150 kVA 320 m HEPR F", () => {
    const r = calculate(EXAMPLE_FEEDER);
    assert.ok(r.section >= 120);
    assert.ok(r.dropPct <= EXAMPLE_FEEDER.maxDropPct + 1e-6);
    assert.ok(r.ok);
  });

  it("aluminum min 16 mm² and lower Iz", () => {
    assert.equal(minSectionAl("alimentador"), 16);
    const cu = calculate(defaultCircuit({ conductor: "Cu", powerKva: 30, method: "B1" }));
    const al = calculate(defaultCircuit({ conductor: "Al", powerKva: 30, method: "B1" }));
    assert.ok(al.section >= 16);
    assert.ok(al.imax < cu.imax || al.section > cu.section);
  });

  it("3rd harmonic ≥ 15 % applies Fh 0,86", () => {
    const h = harmonicAdjust(20, 100);
    assert.equal(h.fh, 0.86);
    const hi = harmonicAdjust(45, 100);
    assert.ok(hi.sizeByIb > 100);
    const r = calculate(defaultCircuit({ harmonic3Pct: 25 }));
    assert.equal(r.fh, 0.86);
  });

  it("soil Tab. 41", () => {
    assert.equal(soilFactor(2.5).fs, 1);
    assert.equal(soilFactor(1).fs, 1.18);
    const r = calculate(defaultCircuit({ method: "D", soilRho: 1, powerKva: 30, lengthM: 10 }));
    assert.equal(r.fs, 1.18);
  });

  it("drop chain accumulates parent trechos", () => {
    const feeder = defaultCircuit({ id: "a", tag: "AL", parentId: null, powerKva: 50, lengthM: 40, method: "B1" });
    const branch = defaultCircuit({ id: "b", tag: "C1", parentId: "a", powerKva: 10, lengthM: 20, method: "B1" });
    const chain = dropChain([feeder, branch], "b", "concessionaria");
    assert.equal(chain.path.length, 2);
    assert.ok(chain.totalPct > chain.path[1].dropPct);
    assert.equal(dropLimitPct("concessionaria", "tug"), 4);
    assert.equal(dropLimitPct("transformador", "iluminacao"), 5);
    assert.equal(dropLimitPct("transformador", "tug"), 7);
  });

  it("TN magnetic Ia is 5·In", () => {
    assert.equal(magneticIa(50), 250);
  });

  it("TUG and lighting demand", () => {
    assert.equal(tugDemandVa(8, 3), 3 * 600 + 5 * 100);
    assert.equal(lightingDemandW(20), 300);
  });

  it("conduit 53/31/40 % and run limit", () => {
    const one = occupy({ petrobras: false, rows: [{ id: "1", family: "eprotenax", cores: "1", section: 16, quantity: 1 }] });
    assert.equal(one.fill.pct, 0.53);
    const two = occupy({ petrobras: false, rows: [{ id: "1", family: "eprotenax", cores: "1", section: 16, quantity: 2 }] });
    assert.equal(two.fill.pct, 0.31);
    const three = occupy({ petrobras: false, rows: [{ id: "1", family: "eprotenax", cores: "1", section: 16, quantity: 3 }] });
    assert.equal(three.fill.pct, 0.4);
    const run = conduitRunLimit(false, 1);
    assert.equal(run.maxM, 12);
    assert.ok(run.okBends);
    const tooMany = conduitRunLimit(false, 4);
    assert.equal(tooMany.okBends, false);
  });

  it("envelope 1″ 2×2 is 265 × 270 mm", () => {
    const r = envelope(exampleEnvelope1());
    assert.equal(r.widthMm, 265);
    assert.equal(r.heightMm, 270);
  });

  it("tray 40 % fill and Fa", () => {
    const state = defaultTray();
    const r = tray(state);
    assert.ok(r.fillLimit <= 0.4 + 1e-9);
    assert.ok(r.fa > 0);
    assert.ok(r.massKgM > 0);
  });

  it("bom lists circuits", () => {
    const feeder = defaultCircuit({ tag: "AL-01", lengthM: 10, powerKva: 10 });
    const lines = bom({
      id: "p",
      meta: {
        name: "t",
        client: "",
        location: "",
        responsible: "",
        crea: "",
        notes: "",
        updatedAt: "",
        origin: "concessionaria",
      },
      circuits: [feeder],
      activeId: feeder.id,
      occupy: { petrobras: false, rows: [] },
      envelope: { grid: [[0]] },
      tray: defaultTray(),
    });
    assert.ok(lines.some((l) => l.item.includes("AL-01")));
  });
});
