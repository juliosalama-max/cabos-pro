import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as AUTHOR } from "./router-L3Ql1fD6.mjs";
import { t as AppShell } from "./app-shell-Ch2Oj4Xw.mjs";
import { t as Card } from "./card-B9M0cBs2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/norma-DGVEaE7g.js
var import_jsx_runtime = require_jsx_runtime();
function NormaPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-label font-medium uppercase tracking-[0.12em] text-muted",
					children: "Premissas"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl font-semibold tracking-tight",
					children: "NBR 5410:2004"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Instalações elétricas de baixa tensão. Segunda edição (30.09.2004), versão corrigida em 17.03.2008. Continua sendo a norma oficial vigente — a revisão em consulta nacional ainda não substitui esta edição."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "O que o aplicativo calcula",
				context: "Grandezas de entrada e critérios de dimensionamento.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Corrente de projeto Ib a partir de kVA, kW, cv ou valor informado." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Fatores de correção de temperatura (Tab. 40) e agrupamento (Tab. 13, 14, 16 e 17)." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Seção mínima que atende Iz ≥ Ib, queda de tensão e I²t de curto-circuito, com paralelismo até 6 por fase." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Coordenação Ib ≤ In ≤ Iz e I² ≤ 1,45 Iz (5.7.2.2.1)." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Neutro (Tab. 48) e PE (Tab. 58), eletroduto (ocupação 40 % / 31 % / 53 %)." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Catálogo de motores 4 pólos 60 Hz da planilha (rendimento, FP, disjuntor, contator, relé)." })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Revisão da planilha original",
				context: "A planilha “MC — Dimensionamento de Cabos” foi o ponto de partida. O que mudou para alinhar à NBR.",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Mantivemos tabelas Prysmian (GSette Easy / Afumex Flex HEPR e Sintenax PVC), métodos B1, B2, D, E, F, formação de cabo, eletroduto e o circuito de exemplo 150 kVA / 480 V / 320 m."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-fg",
							children: "Temperatura 30 °C"
						}), " — a planilha saltava de 25 para 35 °C. Incluímos Ft = 1,00 em 30 °C, como a Tab. 40."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-fg",
							children: "Solo 20 °C"
						}), " — a coluna “solo” estava deslocada (20 °C = 0,95/0,96). A NBR define 20 °C como referência = 1,00."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-fg",
							children: "Queda de tensão"
						}), " — a planilha usa |Z| = √(R²+X²), conservador. O aplicativo dimensiona com a fórmula da NBR / IEC: R·cosφ + X·senφ. O |Z| aparece no resultado só como comparação."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-fg",
							children: "Fator k"
						}), " — a planilha fixava k = 142. Usamos Tab. 37/40: 115 (PVC) e 143 (HEPR)."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-fg",
							children: "Métodos A1, A2 e C"
						}), " — ausentes na planilha; incluídos pela NBR."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-fg",
							children: "Seção mínima, PE, neutro e I² ≤ 1,45 Iz"
						}), " — não automatizados na planilha."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-fg",
							children: "B2 HEPR 4 e 6 mm²"
						}), " — 2 condutores menores que 3 condutores (35/45 e 44/58). Mantido como na fonte; tratar com cautela."] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Limites de queda — 6.2.7",
				context: "O campo ΔV máx. deve seguir o trecho, não um valor único do projeto.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "4 % da origem da instalação até o ponto de utilização quando a origem é a concessionária. Se a origem for o secundário de transformador ou gerador do consumidor: 5 % em iluminação e 7 % nos demais usos."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-help text-subtle",
				children: "Ferramenta de apoio ao projetista. Não substitui a leitura da norma, o memorial assinado nem a verificação de catálogo do fabricante do cabo."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-help text-subtle",
				children: AUTHOR.line
			})
		]
	}) });
}
//#endregion
export { NormaPage as component };
