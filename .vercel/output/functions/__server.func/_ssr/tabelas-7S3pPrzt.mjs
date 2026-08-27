import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as GROUP_E_F, d as METHODS, f as METHOD_INFO, g as TEMP_FACTOR, h as SECTIONS, l as IMPEDANCE, s as GROUP_A_TO_F, t as AMPACITY } from "./tables-CKe6Elx2.mjs";
import { n as Field, o as Select, t as AppShell } from "./app-shell-Ch2Oj4Xw.mjs";
import { t as Card } from "./card-B9M0cBs2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tabelas-7S3pPrzt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TablesView() {
	const [method, setMethod] = (0, import_react.useState)("F");
	const [ins, setIns] = (0, import_react.useState)("HEPR");
	const rows = (0, import_react.useMemo)(() => AMPACITY[method], [method]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-label font-medium uppercase tracking-[0.12em] text-muted",
					children: "Consulta"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl font-semibold tracking-tight",
					children: "Tabelas NBR 5410"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm text-muted",
					children: "Capacidade de condução extraída da planilha (métodos B1, B2, D, E, F) e da NBR 5410:2004 (A1, A2, C). Isolação HEPR/EPR 90 °C e PVC 70 °C, cobre."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Capacidade de condução",
				context: METHOD_INFO[method].desc,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Método",
						info: "Método de instalação da NBR 5410 (Tab. 33 a 36). A1/A2/C vêm da norma; B1, B2, D, E e F da planilha Prysmian.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: method,
							onChange: (e) => setMethod(e.target.value),
							children: METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: m,
								children: [
									m,
									" · ",
									METHOD_INFO[m].name
								]
							}, m))
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Isolação",
						info: "PVC 70 °C ou HEPR/EPR 90 °C. A temperatura de operação altera Imax e o fator k térmico (115 PVC, 143 HEPR).",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: ins,
							onChange: (e) => setIns(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "HEPR",
								children: "HEPR / EPR 90 °C"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "PVC",
								children: "PVC 70 °C"
							})]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-md border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[520px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-label uppercase tracking-[0.1em] text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Seção mm²"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Imax 2 cond. (A)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Imax 3 cond. (A)"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "tabular",
							children: SECTIONS.filter((s) => rows[s === 1.5 ? "1.5" : String(s)]).map((s) => {
								const row = rows[s === 1.5 ? "1.5" : String(s)];
								const i2 = ins === "HEPR" ? row[0] : row[2];
								const i3 = ins === "HEPR" ? row[1] : row[3];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2",
											children: s
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2",
											children: i2
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2",
											children: i3
										})
									]
								}, s);
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Fator de temperatura — Tabela 40",
				context: "Referência: 30 °C no ar, 20 °C no solo. A planilha original omitia 30 °C e deslocava a coluna do solo — aqui está alinhado à NBR.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-md border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[640px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-label uppercase tracking-[0.1em] text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "°C"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "PVC ar"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "EPR ar"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "PVC solo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "EPR solo"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "tabular",
							children: TEMP_FACTOR.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: r.t
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: r.pvcAir || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: r.eprAir || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: r.pvcSoil || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: r.eprSoil || "—"
									})
								]
							}, r.t))
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Agrupamento — Tabela 13",
				context: "Fator Fa em função do número de circuitos agrupados.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-md border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[640px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-label uppercase tracking-[0.1em] text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Circuitos"
								}), Array.from({ length: 12 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-3 text-center",
									children: i + 1
								}, i))]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "tabular",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2 text-muted",
									children: "A a F"
								}), GROUP_A_TO_F.slice(1).map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-center",
									children: v
								}, i))]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-2 text-muted",
								children: "E e F"
							}), GROUP_E_F.slice(1).map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2 text-center",
								children: v
							}, i))] })]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Impedância HEPR 3×1",
				context: "Rca e XL em Ω/km, usados na queda de tensão e no Icc no ponto.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-md border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[400px] text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-label uppercase tracking-[0.1em] text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "mm²"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "Rca"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-3",
										children: "XL"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "tabular",
							children: Object.entries(IMPEDANCE.HEPR).map(([s, row]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: s
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: row["3x1"]?.rca ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-2",
										children: row["3x1"]?.xl ?? "—"
									})
								]
							}, s))
						})]
					})
				})
			})
		]
	});
}
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablesView, {}) });
}
//#endregion
export { Page as component };
