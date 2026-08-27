import { C as interpolateTemp, E as motorVoltageKey, S as impedanceOf, T as minPe, _ as ampacityOf, b as findMotorByCv, f as METHOD_INFO, h as SECTIONS, i as CURRENT_TRANSFORMERS, n as BREAKERS, o as FORMATION_INFO, p as MIN_SECTION, r as CONDUITS, u as K_PHASE, v as cableOd, w as minNeutral, x as groupingFactor, y as findMotor } from "./tables-CKe6Elx2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-1JLWe3U2.js
var SQRT3 = Math.sqrt(3);
function nearestSection(s) {
	let best = SECTIONS[0];
	for (const x of SECTIONS) if (Math.abs(x - s) < Math.abs(best - s)) best = x;
	return best;
}
/** kW de consulta a partir de kVA ou cv. Não substitui a grandeza de entrada. */
function consultPowerKw(input) {
	if (input.loadType === "cv" && input.powerCv > 0) return {
		kw: input.powerCv * .736,
		source: "cv × 0,736"
	};
	if (input.loadType === "kva" && input.powerKva > 0) {
		const pf = Math.min(1, Math.max(.1, input.pf || 1));
		if (input.kind === "motor") {
			const eta = Math.min(1, Math.max(.3, input.efficiency || 1));
			return {
				kw: input.powerKva * pf * eta,
				source: "S × FP × η"
			};
		}
		return {
			kw: input.powerKva * pf,
			source: "S × FP"
		};
	}
	return null;
}
function designCurrent(input) {
	const V = input.voltage;
	const pf = Math.min(1, Math.max(.1, input.pf || 1));
	const eta = Math.min(1, Math.max(.3, input.efficiency || 1));
	if (V <= 0) return {
		ib: 0,
		error: "Tensão inválida"
	};
	if (input.loadType === "ib" && input.ibManual > 0) return { ib: input.ibManual };
	if (input.loadType === "kva" && input.powerKva > 0) {
		if (input.phases === 3) return { ib: input.powerKva * 1e3 / (V * SQRT3) };
		return { ib: input.powerKva * 1e3 / V };
	}
	let pW = 0;
	if (input.loadType === "cv" && input.powerCv > 0) pW = input.powerCv * 736;
	else if (input.powerKw > 0) pW = input.powerKw * 1e3;
	else if (input.powerKva > 0) {
		if (input.phases === 3) return { ib: input.powerKva * 1e3 / (V * SQRT3) };
		return { ib: input.powerKva * 1e3 / V };
	}
	if (pW <= 0) return {
		ib: 0,
		error: "Informe a potência ou a corrente"
	};
	if (input.phases === 3) return { ib: pW / (V * SQRT3 * pf * eta) };
	return { ib: pW / (V * pf * eta) };
}
function loadedConductors(input) {
	return input.phases === 3 ? 3 : 2;
}
function pickBreaker(ib, iz, motorBreaker) {
	if (motorBreaker && motorBreaker >= ib - 1e-6 && motorBreaker <= iz + 1e-6) return motorBreaker;
	const target = ib * 1.05;
	const candidates = BREAKERS.filter((b) => b >= target - 1e-9 && b <= iz + 1e-6);
	if (candidates.length) return candidates[0];
	return BREAKERS.filter((b) => b >= ib)[0] ?? BREAKERS[BREAKERS.length - 1];
}
function pickTc(ib) {
	return CURRENT_TRANSFORMERS.find((x) => x >= ib * 1.2) ?? CURRENT_TRANSFORMERS.at(-1) ?? null;
}
function voltageDropPct(input, ib, rca, xl, n, method) {
	const Lkm = input.lengthM / 1e3;
	const pf = Math.min(1, Math.max(0, input.pf));
	const sf = Math.sqrt(Math.max(0, 1 - pf * pf));
	const zvd = method === "modulus" ? Math.hypot(rca, xl) : rca * pf + xl * sf;
	const k = input.phases === 3 ? SQRT3 : 2;
	const dropV = k * ib * Lkm * zvd / Math.max(1, n);
	return {
		dropV,
		dropPct: input.voltage > 0 ? dropV / input.voltage * 100 : 0,
		zvd,
		vakm: k * zvd
	};
}
function sizeConduit(section, formation, nPerPhase) {
	const od = cableOd(section, formation);
	if (!od) return {
		nps: null,
		fillPct: 0,
		od: null
	};
	const info = FORMATION_INFO[formation];
	const count = info.unipolar ? info.cores * nPerPhase : nPerPhase;
	const areaCables = count * Math.PI * (od / 2) ** 2;
	const requiredId = 2 * Math.sqrt(areaCables / (count <= 1 ? .53 : count === 2 ? .31 : .4) / Math.PI);
	const c = CONDUITS.find((x) => x.idMm >= requiredId);
	const used = c ? areaCables / (Math.PI * (c.idMm / 2) ** 2) : 1;
	return {
		nps: c?.nps ?? null,
		fillPct: used * 100,
		od
	};
}
function iscLocalKa(input, rca, xl, n) {
	if (input.iscKa <= 0) return 0;
	const zc = input.lengthM / 1e3 * Math.hypot(rca, xl) / Math.max(1, n);
	const zs = input.voltage / (SQRT3 * input.iscKa * 1e3);
	return input.voltage / (SQRT3 * (zs + zc)) / 1e3;
}
function fmtA$1(n) {
	return `${n.toFixed(n >= 100 ? 1 : 2)} A`;
}
function calculate(input) {
	const { ib, error } = designCurrent(input);
	const loaded = loadedConductors(input);
	const buried = METHOD_INFO[input.method].buried;
	const ft = interpolateTemp(input.tempC, input.insulation, buried);
	const grp = groupingFactor(input.method, input.nCircuits, {
		buriedDucts: input.buriedDucts,
		unipolar: FORMATION_INFO[input.formation].unipolar,
		spacingM: input.burySpacingM,
		layers: input.layers,
		perLayer: input.nCircuits
	});
	const fa = input.groupingOverride && input.groupingOverride > 0 ? input.groupingOverride : grp.fa;
	const isMotor = input.kind === "motor";
	const invCorr = fa > 0 && ft > 0 ? 1 / (fa * ft) : 1;
	const fr = input.reserveEnabled && isMotor && input.loadType !== "kva" && invCorr < 1.25 ? 1.25 : 1;
	const ip = ib * Math.max(fr, invCorr);
	const motorFound = isMotor ? findMotor(input.powerKw) ?? (input.powerCv > 0 ? findMotorByCv(input.powerCv) : void 0) : void 0;
	const vKey = motorVoltageKey(input.voltage);
	const motorProt = motorFound && vKey ? motorFound.prot[vKey] : null;
	const minS = MIN_SECTION[input.kind] ?? 2.5;
	const kPhase = K_PHASE[input.insulation];
	const sections = SECTIONS.filter((s) => s + 1e-9 >= minS);
	let best = null;
	for (let n = 1; n <= 6; n++) {
		const iPer = ip / n;
		for (const s of sections) {
			const imax = ampacityOf(input.method, s, input.insulation, loaded);
			if (imax == null || imax + 1e-9 < iPer) continue;
			const iz = imax * fa * ft * n;
			const imp = impedanceOf(input.insulation, s, input.formation);
			if (!imp) continue;
			const drop = voltageDropPct(input, ib, imp.rca, imp.xl, n, "nbr");
			const dropMod = voltageDropPct(input, ib, imp.rca, imp.xl, n, "modulus");
			if (drop.dropPct > input.maxDropPct + 1e-6) continue;
			const icw = kPhase * s * n / Math.sqrt(Math.max(input.iscTimeS, 1e-6)) / 1e3;
			const iscL = iscLocalKa(input, imp.rca, imp.xl, n);
			if (input.iscKa > 0 && icw + 1e-9 < iscL) continue;
			const copper = n * s;
			const limiting = drop.dropPct > input.maxDropPct * .85 ? "queda de tensão" : iPer > imax * .92 ? "capacidade de corrente" : "seção mínima";
			best = {
				n,
				s,
				imax,
				iz,
				rca: imp.rca,
				xl: imp.xl,
				drop,
				dropMod,
				icw,
				iscL,
				limiting,
				copper
			};
			break;
		}
		if (best) break;
	}
	const checks = [];
	if (error) checks.push({
		id: "ib",
		label: "Corrente de projeto",
		ok: false,
		detail: error,
		ref: "NBR 5410 6.2.4"
	});
	if (!best) {
		checks.push({
			id: "size",
			label: "Dimensionamento",
			ok: false,
			detail: "Nenhuma seção até 6×300 mm² atende corrente, queda e Icc ao mesmo tempo. Afrouxe agrupamento, aumente a queda máxima ou use outro método.",
			ref: "NBR 5410 6.2"
		});
		return {
			ib,
			fa,
			faSource: input.groupingOverride ? "Manual" : grp.source,
			ft,
			fr,
			ip,
			loaded,
			nPerPhase: 1,
			section: 0,
			imax: 0,
			iz: 0,
			rca: 0,
			xl: 0,
			zvd: 0,
			dropV: 0,
			dropPct: 0,
			dropModulusPct: 0,
			vakm: 0,
			breaker: 0,
			tc: null,
			pe: 0,
			neutral: null,
			kPhase,
			iscLocalKa: 0,
			icwKa: 0,
			conduit: null,
			conduitFillPct: 0,
			cableOdMm: null,
			motor: null,
			formationLabel: FORMATION_INFO[input.formation].label,
			checks,
			ok: false,
			limiting: "indefinido",
			copperKgPerKm: 0
		};
	}
	const iz = best.iz;
	const breaker = pickBreaker(ib, iz, motorProt && motorProt.breaker >= 6 ? motorProt.breaker : void 0);
	const pe = nearestSection(minPe(best.s));
	const neutral = input.phases !== 3 || input.formation === "4x1" || input.formation === "1x4" ? nearestSection(minNeutral(best.s)) : minNeutral(best.s);
	const conduit = sizeConduit(best.s, input.formation, best.n);
	checks.push({
		id: "ib-in-iz",
		label: "Coordenação Ib ≤ In ≤ Iz",
		ok: ib <= breaker + 1e-6 && breaker <= iz + 1e-6,
		detail: `Ib ${fmtA$1(ib)} · In ${breaker} A · Iz ${fmtA$1(iz)}`,
		ref: "NBR 5410 5.7.2.2.1"
	});
	checks.push({
		id: "iz-ib",
		label: "Capacidade de condução",
		ok: iz + 1e-6 >= ib,
		detail: `Iz = ${fmtA$1(best.imax)} × ${fa.toFixed(2)} × ${ft.toFixed(2)} × ${best.n} = ${fmtA$1(iz)} ≥ Ib`,
		ref: "NBR 5410 6.2.5 · Tab. 33–36"
	});
	checks.push({
		id: "drop",
		label: `Queda de tensão ≤ ${input.maxDropPct} %`,
		ok: best.drop.dropPct <= input.maxDropPct + 1e-6,
		detail: `ΔV = ${best.drop.dropPct.toFixed(2)} % (R cosφ + X senφ). |Z| = ${best.dropMod.dropPct.toFixed(2)} % (comparação).`,
		ref: "NBR 5410 6.2.7"
	});
	checks.push({
		id: "icc",
		label: "Suportabilidade à corrente de curto",
		ok: input.iscKa <= 0 || best.icw + 1e-9 >= best.iscL,
		detail: `Icc no ponto ${best.iscL.toFixed(2)} kA ≤ Icw ${best.icw.toFixed(1)} kA (k = ${kPhase}, t = ${input.iscTimeS} s)`,
		ref: "NBR 5410 5.3.4"
	});
	checks.push({
		id: "min-s",
		label: "Seção mínima do tipo de circuito",
		ok: best.s + 1e-9 >= minS,
		detail: `${best.s} mm² ≥ ${minS} mm²`,
		ref: "NBR 5410 Tabela 47"
	});
	const i2 = 1.45 * breaker;
	checks.push({
		id: "i2",
		label: "I² ≤ 1,45 Iz (sobrecarga)",
		ok: i2 <= 1.45 * iz + 1e-6,
		detail: `1,45·In = ${fmtA$1(i2)} · 1,45·Iz = ${fmtA$1(1.45 * iz)}`,
		ref: "NBR 5410 5.7.2.2.1.b"
	});
	if (conduit.nps) checks.push({
		id: "conduit",
		label: "Ocupação do eletroduto",
		ok: conduit.fillPct <= 41,
		detail: `${conduit.nps} · ocupação ${conduit.fillPct.toFixed(0)} % (limite 40 % para 3+ condutores)`,
		ref: "NBR 5410 6.2.11"
	});
	return {
		ib,
		fa,
		faSource: input.groupingOverride ? "Manual" : grp.source,
		ft,
		fr,
		ip,
		loaded,
		nPerPhase: best.n,
		section: best.s,
		imax: best.imax,
		iz,
		rca: best.rca,
		xl: best.xl,
		zvd: best.drop.zvd,
		dropV: best.drop.dropV,
		dropPct: best.drop.dropPct,
		dropModulusPct: best.dropMod.dropPct,
		vakm: best.drop.vakm,
		breaker,
		tc: pickTc(ib),
		pe,
		neutral: input.phases === 1 ? best.s : neutral,
		kPhase,
		iscLocalKa: best.iscL,
		icwKa: best.icw,
		conduit: conduit.nps,
		conduitFillPct: conduit.fillPct,
		cableOdMm: conduit.od,
		motor: motorFound && motorProt ? {
			kw: motorFound.kw,
			cv: motorFound.cv,
			frame: motorFound.frame,
			breaker: motorProt.breaker,
			contactor: motorProt.contactor,
			relay: motorProt.relay
		} : null,
		formationLabel: FORMATION_INFO[input.formation].label,
		checks,
		ok: checks.every((c) => c.ok),
		limiting: best.limiting,
		copperKgPerKm: best.n * best.s * 3 * 8.89 / 1e3
	};
}
function fmt(n, d = 2) {
	if (!Number.isFinite(n)) return "—";
	return n.toLocaleString("pt-BR", {
		minimumFractionDigits: d,
		maximumFractionDigits: d
	});
}
function fmtA(n) {
	if (!Number.isFinite(n) || n === 0) return "—";
	return `${fmt(n, n >= 100 ? 1 : 2)} A`;
}
function cableSpec(n, formation, section, insulation) {
	if (!section) return "—";
	return `${n > 1 ? `${n}×(${formation} ${section} mm²)` : `${formation} ${section} mm²`} ${insulation} Cu`;
}
//#endregion
export { fmtA as a, fmt as i, calculate as n, consultPowerKw as r, cableSpec as t };
