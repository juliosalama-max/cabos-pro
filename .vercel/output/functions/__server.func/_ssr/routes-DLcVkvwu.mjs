import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as OctagonAlert, g as ChevronDown, m as Copy, r as Trash2, s as Plus, y as BadgeCheck } from "../_libs/lucide-react.mjs";
import { r as cn, t as Button } from "./login-screen-D9FZpBbF.mjs";
import { a as FORMATIONS, b as findMotorByCv, d as METHODS, f as METHOD_INFO, m as MOTORS, o as FORMATION_INFO, y as findMotor } from "./tables-CKe6Elx2.mjs";
import { a as fmtA, i as fmt, n as calculate, r as consultPowerKw, t as cableSpec } from "./format-1JLWe3U2.mjs";
import { a as Readout, c as useApp, i as KIND_LABEL, n as Field, o as Select, r as Input, s as Textarea, t as AppShell } from "./app-shell-Ch2Oj4Xw.mjs";
import { t as Card } from "./card-B9M0cBs2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DLcVkvwu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KINDS = [
	"alimentador",
	"motor",
	"iluminacao",
	"tug",
	"tue",
	"comando"
];
var KIND_L = {
	alimentador: "Alimentador",
	motor: "Motor",
	iluminacao: "Iluminação",
	tug: "TUG — tomadas de uso geral",
	tue: "TUE — tomadas de uso específico",
	comando: "Comando / sinal"
};
var INFO = {
	tag: "Identificação do circuito na lista e na memória de cálculo (ex.: AL-01, M-01, IL-01).",
	kind: "Classificação NBR 5410. Define a seção mínima (Tab. 47): iluminação 1,5 mm²; TUG, TUE, motor e alimentador 2,5 mm²; comando 0,5 mm².\n\nTUG — tomadas de uso geral: equipamentos portáteis até 10 A (TV, computador, carregador). Demanda típica 100 VA por ponto; em cozinha, área de serviço e similares, 3 pontos a 600 VA e o restante a 100 VA.\n\nTUE — tomadas de uso específico: circuito dedicado a um aparelho (chuveiro, ar-condicionado, forno, máquina de lavar), em geral acima de 10 A.",
	from: "Origem do trecho (quadro, CCM, barramento). Só identificação — não entra em fórmula.",
	to: "Destino do trecho (carga, quadro a jusante). Só identificação — não entra em fórmula.",
	loadType: "Grandeza usada para obter a corrente de projeto Ib.\n\n• kVA — potência aparente. Ib = S / (√3·V) trifásico ou S/V monofásico. FP e η não entram em Ib.\n• kW — potência ativa. Ib = P / (√3·V·FP·η).\n• cv — 1 cv = 736 W. Ib como em kW.\n• Corrente Ib — informa a corrente diretamente.",
	kva: "Potência aparente S em kVA. Em trifásico, Ib = 1000·S / (√3·V). O kW ao lado é só consulta (S × FP × η em motor, S × FP nos demais).",
	kw: "Potência ativa em kW. Em motor, o catálogo 4 pólos 60 Hz preenche FP, rendimento, carcaça e proteção. Ib = P / (√3·V·FP·η).",
	kwConsult: "Valor apenas informativo, calculado a partir da entrada (kVA ou cv). Não altera o dimensionamento — a corrente Ib continua vindo da grandeza escolhida em Entrada.",
	cv: "Potência em cavalos-vapor. 1 cv = 736 W, portanto kW = cv × 0,736. O kW ao lado é só consulta. Ib usa o cv informado.",
	ib: "Corrente de projeto informada diretamente, em amperes. Substitui o cálculo a partir da potência.",
	voltage: "Tensão nominal do circuito. Trifásico: tensão fase-fase. Monofásico: fase-neutro.",
	phases: "1 = F+N; 2 = duas fases; 3 = trifásico. Define o fator k da queda (2 ou √3) e o número de condutores carregados (2 ou 3) nas tabelas de ampacity.",
	pf: "Fator de potência cos φ da carga. Entra em Ib quando a entrada é kW ou cv, e na queda ΔV = k·Ib·L·(R cosφ + X senφ).",
	eta: "Rendimento η. Só reduz Ib quando a entrada é kW ou cv (potência no eixo do motor). Com kVA a corrente já é aparente e η não entra.",
	length: "Comprimento do trecho, em metros. Entra na queda de tensão e na impedância usada para o Icc no ponto de utilização.",
	method: "Método de instalação da NBR 5410 (Tab. 33 a 36). Define a capacidade de condução Imax do cabo.",
	insulation: "PVC 70 °C (fator k térmico = 115) ou HEPR/EPR 90 °C (k = 143). Afeta Imax, Ft e a suportabilidade ao curto (Icw = k·S/√t).",
	formation: "Unipolar ou multipolar. Define a coluna de ampacity, Rca/XL e o número de cabos no eletroduto.",
	temp: "Temperatura ambiente (ar) ou do solo (método D). Fator Ft da Tab. 40. Referência: 30 °C no ar e 20 °C no solo (Ft = 1,00).",
	nCirc: "Número de circuitos agrupados. Fator Fa da Tab. 13 (ou Tab. 16/17 se dutos enterrados).",
	layers: "Tab. 14 — fator adicional quando há mais de uma camada de cabos nos métodos C, E e F.",
	buried: "Agrupamento em dutos enterrados: Tab. 16 (multipolares) ou Tab. 17 (unipolares em dutos individuais), em vez da Tab. 13.",
	spacing: "Distância entre os dutos enterrados. Quanto maior o espaçamento, menor o efeito térmico do agrupamento.",
	dropMax: "Limite da NBR 5410 6.2.7: 4 % da origem da instalação até o ponto de uso quando a origem é a concessionária. Se a origem for transformador ou gerador do consumidor: 5 % em iluminação e 7 % nos demais usos.",
	isc: "Corrente de curto-circuito simétrica no início do trecho, em kA. Com a impedância do cabo, o app estima o Icc no ponto e compara com Icw do condutor.",
	iscT: "Duração do defeito, em segundos, usada em Icw = k·S/√t (NBR 5410 5.3.4). Típico 0,1 s ou o tempo de atuação da proteção.",
	reserve: "Em motores, se 1/(Fa·Ft) for menor que 1,25, aplica-se 1,25 como na planilha original (margem de partida). Pode desligar e usar só Fa e Ft.",
	notes: "Observações livres. Aparecem na memória de cálculo. Não entram em fórmula."
};
function CircuitForm({ value, onChange }) {
	function set(key, v) {
		onChange({ [key]: v });
	}
	function applyMotor(kw) {
		const m = findMotor(kw);
		if (!m) {
			set("powerKw", kw);
			return;
		}
		onChange({
			kind: "motor",
			loadType: "kw",
			powerKw: m.kw,
			powerCv: m.cv,
			pf: m.pf,
			efficiency: m.eff
		});
	}
	const consult = consultPowerKw(value);
	const catalogFromCv = value.loadType === "cv" ? findMotorByCv(value.powerCv) : void 0;
	const catalogFromKw = consult ? findMotor(consult.kw) : void 0;
	const catalogNote = catalogFromCv ?? catalogFromKw;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Identificação",
				context: "Cabeçalho do trecho na memória. Só o tipo entra em fórmula (seção mínima, Tab. 47).",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Circuito",
							info: INFO.tag,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: value.tag,
								onChange: (e) => set("tag", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tipo",
							info: INFO.kind,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: value.kind,
								onChange: (e) => set("kind", e.target.value),
								children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: k,
									children: KIND_L[k]
								}, k))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "De",
							info: INFO.from,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: value.from,
								onChange: (e) => set("from", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Para",
							info: INFO.to,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: value.to,
								onChange: (e) => set("to", e.target.value)
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Carga",
				context: "Potência, tensão e comprimento. Definem a corrente de projeto Ib e a queda de tensão.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Entrada",
							info: INFO.loadType,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: value.loadType,
								onChange: (e) => {
									const loadType = e.target.value;
									const patch = { loadType };
									if (loadType === "cv" && !(value.powerCv > 0)) {
										const m = findMotor(value.powerKw);
										patch.powerCv = m ? m.cv : Number((value.powerKw / .736).toFixed(2));
									}
									if (loadType === "kva" && !(value.powerKva > 0) && value.powerKw > 0) {
										const pf = Math.max(.1, value.pf || 1);
										const eta = value.kind === "motor" ? Math.max(.3, value.efficiency || 1) : 1;
										patch.powerKva = Number((value.powerKw / (pf * eta)).toFixed(2));
									}
									onChange(patch);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "kva",
										children: "kVA"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "kw",
										children: "kW"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "cv",
										children: "cv"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ib",
										children: "Corrente Ib"
									})
								]
							})
						}),
						value.loadType === "kva" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Potência (kVA)",
							info: INFO.kva,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.1",
								min: "0",
								value: value.powerKva || "",
								onChange: (e) => set("powerKva", Number(e.target.value))
							})
						}) : null,
						value.loadType === "kw" ? value.kind === "motor" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Potência (kW · cv)",
							info: INFO.kw,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: findMotor(value.powerKw) ? String(value.powerKw) : "custom",
								onChange: (e) => {
									if (e.target.value === "custom") return;
									applyMotor(Number(e.target.value));
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "custom",
									children: "Outra…"
								}), MOTORS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: m.kw,
									children: [
										m.kw,
										" kW · ",
										m.cv,
										" cv"
									]
								}, m.kw))]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Potência (kW)",
							info: INFO.kw,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.1",
								value: value.powerKw || "",
								onChange: (e) => set("powerKw", Number(e.target.value))
							})
						}) : null,
						value.loadType === "kw" && value.kind === "motor" && !findMotor(value.powerKw) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "kW manual",
							info: INFO.kw,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.1",
								value: value.powerKw || "",
								onChange: (e) => set("powerKw", Number(e.target.value))
							})
						}) : null,
						value.loadType === "cv" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Potência (cv)",
							info: INFO.cv,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.1",
								value: value.powerCv || "",
								onChange: (e) => set("powerCv", Number(e.target.value))
							})
						}) : null,
						consult ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Potência (kW) — consulta",
							info: INFO.kwConsult,
							className: "col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Readout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono tabular-nums",
								children: [fmt(consult.kw, 2), " kW"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted",
								children: [consult.source, catalogNote ? ` · catálogo ${catalogNote.kw} kW · ${catalogNote.cv} cv · carcaça ${catalogNote.frame}` : ""]
							})] })
						}) : null,
						value.loadType === "ib" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Ib (A)",
							info: INFO.ib,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.1",
								value: value.ibManual || "",
								onChange: (e) => set("ibManual", Number(e.target.value))
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tensão (V)",
							info: INFO.voltage,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: String(value.voltage),
								onChange: (e) => {
									const v = e.target.value;
									if (v === "other") return;
									set("voltage", Number(v));
								},
								children: [[
									110,
									127,
									220,
									380,
									440,
									460,
									480
								].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: v,
									children: [v, " V"]
								}, v)), ![
									110,
									127,
									220,
									380,
									440,
									460,
									480
								].includes(value.voltage) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: value.voltage,
									children: [value.voltage, " V"]
								}) : null]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Fases",
							info: INFO.phases,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: String(value.phases),
								onChange: (e) => set("phases", Number(e.target.value)),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "1",
										children: "1 (F+N)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "2",
										children: "2 (2F)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "3",
										children: "3 (trifásico)"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Fator de potência",
							info: INFO.pf,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								min: "0.1",
								max: "1",
								value: value.pf.toFixed(2),
								onChange: (e) => set("pf", Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Rendimento η",
							info: INFO.eta,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.01",
								min: "0.3",
								max: "1",
								value: value.efficiency.toFixed(2),
								onChange: (e) => set("efficiency", Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Comprimento (m)",
							info: INFO.length,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "1",
								min: "0",
								value: value.lengthM,
								onChange: (e) => set("lengthM", Number(e.target.value))
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Instalação",
				context: "Método NBR, isolação e agrupamento. Definem Imax, Fa e Ft (Tab. 33–36, 13, 14, 40).",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Método NBR",
							info: INFO.method,
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: value.method,
								onChange: (e) => set("method", e.target.value),
								children: METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m,
									children: METHOD_INFO[m].name
								}, m))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Isolação",
							info: INFO.insulation,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: value.insulation,
								onChange: (e) => set("insulation", e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "HEPR",
									children: "HEPR / EPR 90 °C"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "PVC",
									children: "PVC 70 °C"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Formação",
							info: INFO.formation,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: value.formation,
								onChange: (e) => set("formation", e.target.value),
								children: FORMATIONS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: f,
									children: [
										f,
										" · ",
										FORMATION_INFO[f].label
									]
								}, f))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Temp. (°C)",
							info: INFO.temp,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: value.tempC,
								onChange: (e) => set("tempC", Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nº de circuitos",
							info: INFO.nCirc,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "1",
								max: "20",
								value: value.nCircuits,
								onChange: (e) => set("nCircuits", Number(e.target.value))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Camadas (Tab. 14)",
							info: INFO.layers,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: String(value.layers),
								onChange: (e) => set("layers", Number(e.target.value)),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "1",
										children: "1 (não aplica)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "2",
										children: "2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "3",
										children: "3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "4",
										children: "4 ou 5"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "6",
										children: "6 a 8"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "9",
										children: "9 ou mais"
									})
								]
							})
						}),
						value.method === "D" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Dutos enterrados",
							info: INFO.buried,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: value.buriedDucts ? "1" : "0",
								onChange: (e) => set("buriedDucts", e.target.value === "1"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "0",
									children: "Agrupamento Tab. 13"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1",
									children: "Tab. 16 / 17"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Espaçamento",
							info: INFO.spacing,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: String(value.burySpacingM),
								onChange: (e) => set("burySpacingM", Number(e.target.value)),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "0",
										children: "Nulo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "0.25",
										children: "0,25 m"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "0.5",
										children: "0,50 m"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "1",
										children: "1,0 m"
									})
								]
							})
						})] }) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-help text-muted",
					children: METHOD_INFO[value.method].desc
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Queda de tensão e curto-circuito",
				context: "Limites da NBR 5410 6.2.7. A fórmula de dimensionamento é R cosφ + X senφ; |Z| só compara.",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "ΔV máx. (%)",
								info: INFO.dropMax,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: String(value.maxDropPct),
									onChange: (e) => set("maxDropPct", Number(e.target.value)),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "3",
											children: "3 %"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "4",
											children: "4 % (padrão NBR)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "5",
											children: "5 % (ilum. em transformador)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "7",
											children: "7 % (outras, transformador)"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Icc origem (kA)",
								info: INFO.isc,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.1",
									min: "0",
									value: value.iscKa,
									onChange: (e) => set("iscKa", Number(e.target.value))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tempo Icc (s)",
								info: INFO.iscT,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									min: "0.01",
									value: value.iscTimeS.toFixed(3),
									onChange: (e) => set("iscTimeS", Number(e.target.value))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Fator de reserva (motores)",
								info: INFO.reserve,
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: value.reserveEnabled ? "1" : "0",
									onChange: (e) => set("reserveEnabled", e.target.value === "1"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "1",
										children: "1,25 se 1/(Fa·Ft) menor que 1,25 (planilha)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "0",
										children: "Somente Fa e Ft"
									})]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-help text-muted",
						children: "Queda de tensão pela NBR 5410: ΔV = k · Ib · L · (R cosφ + X senφ). O valor |Z| aparece no veredito só como comparação."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Notas",
						info: INFO.notes,
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: value.notes,
							onChange: (e) => set("notes", e.target.value),
							rows: 2
						})
					})
				]
			})
		]
	});
}
function Badge({ children, tone = "neutral", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-label font-medium tracking-[0.08em] uppercase", tone === "ok" && "bg-brand text-accent-fg", tone === "danger" && "bg-danger text-accent-fg", tone === "warn" && "bg-warn-dim text-warn", tone === "neutral" && "bg-secondary text-muted", className),
		children
	});
}
function CircuitList({ circuits, activeId, onSelect, onAdd, onDuplicate, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Circuitos",
		context: "Lista repetível do memorial. O circuito ativo alimenta o veredito à direita.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex justify-end gap-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "secondary",
				onClick: onAdd,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
					className: "size-3.5",
					strokeWidth: 1.75
				}), "Adicionar circuito"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "ghost",
				onClick: onDuplicate,
				"aria-label": "Duplicar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
					className: "size-3.5",
					strokeWidth: 1.75
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-1",
			children: circuits.map((c) => {
				const r = calculate(c);
				const active = c.id === activeId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onSelect(c.id),
					className: cn("flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left", active ? "bg-brand-soft text-fg" : "hover:bg-surface-2"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-sm font-medium",
								children: [
									c.tag,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-normal text-muted",
										children: [
											"· ",
											c.from,
											" → ",
											c.to
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-help text-subtle",
								children: [
									KIND_LABEL[c.kind],
									" · ",
									r.section ? `${r.nPerPhase}× ${r.section} mm² ${c.insulation}` : "sem seção",
									" ·",
									" ",
									c.voltage,
									" V"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: r.ok ? "ok" : "danger",
							children: r.ok ? "Conforme" : "Revisar"
						}),
						circuits.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							role: "button",
							tabIndex: 0,
							className: "grid size-9 place-items-center text-subtle hover:text-danger",
							onClick: (e) => {
								e.stopPropagation();
								onRemove(c.id);
							},
							"aria-label": "Excluir circuito",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
								className: "size-3.5",
								strokeWidth: 1.75
							})
						}) : null
					]
				}) }, c.id);
			})
		})]
	});
}
function Row({ label, value, hint, alert }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3 border-b border-border py-2 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-help text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
			className: cn("text-right tabular font-medium", alert && "text-danger"),
			children: [value, hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-label font-normal text-subtle",
				children: hint
			}) : null]
		})]
	});
}
function VerdictBody({ input }) {
	const r = calculate(input);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-label font-medium uppercase tracking-[0.12em] text-muted",
					children: "Veredito NBR 5410"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-serif text-lg font-semibold leading-snug tracking-tight",
					children: cableSpec(r.nPerPhase, input.formation, r.section, input.insulation)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: r.ok ? "ok" : "danger",
						children: r.ok ? "Conforme" : "Não conforme"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-help text-muted",
					children: [
						"Critério: ",
						r.limiting,
						r.motor ? ` · motor ${r.motor.kw} kW · carcaça ${r.motor.frame}` : ""
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Ib",
					value: fmtA(r.ib),
					hint: "corrente de projeto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "I′p",
					value: fmtA(r.ip),
					hint: "Ib / (Fa·Ft)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Iz",
					value: fmtA(r.iz),
					hint: `Imax ${fmtA(r.imax)}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Disjuntor",
					value: r.breaker ? `${r.breaker} A` : "—",
					hint: "In ≥ 1,05 Ib"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "ΔV NBR",
					value: `${fmt(r.dropPct, 2)} %`,
					hint: `máx. ${fmt(input.maxDropPct, 0)} %`,
					alert: r.dropPct > input.maxDropPct
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "ΔV |Z|",
					value: `${fmt(r.dropModulusPct, 2)} %`,
					hint: "comparação"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "PE",
					value: r.pe ? `${r.pe} mm²` : "—",
					hint: `N ${r.neutral ?? "—"} mm²`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					label: "Eletroduto",
					value: r.conduit ?? "—",
					hint: r.conduit ? `${fmt(r.conduitFillPct, 0)} % ocup.` : void 0
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-label font-medium uppercase tracking-[0.12em] text-muted",
				children: "Verificações"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col",
				children: r.checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2 border-b border-border py-2 last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: c.ok ? "text-ok" : "text-danger",
						children: c.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
							className: "size-4",
							strokeWidth: 1.75
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, {
							className: "size-4",
							strokeWidth: 1.75
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-snug",
								children: c.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-help text-muted",
								children: c.detail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-label text-subtle",
								children: c.ref
							})
						]
					})]
				}, c.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-label font-medium uppercase tracking-[0.12em] text-muted",
					children: "Impedância e Icc"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Fa",
							value: fmt(r.fa, 2),
							hint: r.faSource
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Ft",
							value: fmt(r.ft, 2),
							hint: `${input.tempC} °C`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Fr",
							value: fmt(r.fr, 2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Rca",
							value: `${fmt(r.rca, 3)} Ω/km`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "XL",
							value: `${fmt(r.xl, 3)} Ω/km`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "V/A·km",
							value: fmt(r.vakm, 3)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Icc no ponto",
							value: `${fmt(r.iscLocalKa, 2)} kA`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Icw cabo",
							value: `${fmt(r.icwKa, 1)} kA`,
							hint: `k = ${r.kPhase}`
						})
					]
				}),
				r.motor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-help text-muted",
					children: [
						"Partida: disjuntor ",
						r.motor.breaker,
						" A · contator ",
						r.motor.contactor,
						" · relé ",
						r.motor.relay
					]
				}) : null
			] })
		]
	});
}
function ResultsPanel({ input }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictBody, { input });
}
function VerdictStrip({ input }) {
	const r = calculate(input);
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			className: "flex h-11 w-full items-center gap-2 rounded-sm border border-border bg-surface px-3 text-left",
			"aria-expanded": open,
			"aria-label": "Veredito do circuito",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1 truncate font-serif text-sm font-semibold",
					children: cableSpec(r.nPerPhase, input.formation, r.section, input.insulation)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "shrink-0",
					tone: r.ok ? "ok" : "danger",
					children: r.ok ? "Conforme" : "Não conforme"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 tabular text-help text-muted",
					children: [fmt(r.dropPct, 2), " %"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: cn("size-4 shrink-0 text-muted transition-transform", open && "rotate-180"),
					strokeWidth: 1.75
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "fixed inset-0 z-30 cursor-default",
			"aria-label": "Fechar veredito",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-x-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-surface p-4 shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictBody, { input })
		})] }) : null]
	});
}
function ProjectHeader({ meta, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Identificação da obra",
		context: "Cabeçalho da memória de cálculo. Não entra em fórmula.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Projeto / estrutura",
					info: "Nome do projeto ou da estrutura. Aparece no cabeçalho da memória de cálculo e na lista de projetos.",
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: meta.name,
						onChange: (e) => onChange({ name: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Cliente",
					info: "Identificação do cliente ou da obra. Só memória de cálculo.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: meta.client,
						onChange: (e) => onChange({ client: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Local",
					info: "Município ou endereço da instalação. Só memória de cálculo.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: meta.location,
						onChange: (e) => onChange({ location: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Responsável técnico",
					info: "Nome do profissional que assina o memorial. Não é preenchido automaticamente — informe o responsável pela obra.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: meta.responsible,
						onChange: (e) => onChange({ responsible: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "CREA",
					info: "Número do CREA do responsável técnico desta obra.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: meta.crea,
						onChange: (e) => onChange({ crea: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Observações",
					info: "Notas livres do projeto. Aparecem no cabeçalho da memória. Não entram em fórmula.",
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 1,
						value: meta.notes,
						onChange: (e) => onChange({ notes: e.target.value })
					})
				})
			]
		})
	});
}
function Home() {
	const project = useApp((s) => s.project());
	const setMeta = useApp((s) => s.setMeta);
	const setCircuit = useApp((s) => s.setCircuit);
	const addCircuit = useApp((s) => s.addCircuit);
	const duplicateCircuit = useApp((s) => s.duplicateCircuit);
	const removeCircuit = useApp((s) => s.removeCircuit);
	const selectCircuit = useApp((s) => s.selectCircuit);
	const active = project.circuits.find((c) => c.id === project.activeId) ?? project.circuits[0];
	if (!active) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Nenhum circuito neste projeto."
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		aside: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsPanel, { input: active }),
		strip: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictStrip, { input: active }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-label font-medium uppercase tracking-[0.12em] text-muted",
					children: "Circuito"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl font-semibold tracking-tight",
					children: project.meta.name
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectHeader, {
					meta: project.meta,
					onChange: setMeta
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitList, {
					circuits: project.circuits,
					activeId: active.id,
					onSelect: selectCircuit,
					onAdd: () => addCircuit(),
					onDuplicate: duplicateCircuit,
					onRemove: removeCircuit
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitForm, {
					value: active,
					onChange: setCircuit
				})
			]
		})
	});
}
//#endregion
export { Home as component };
