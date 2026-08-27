import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as Check, m as Copy, o as Printer } from "../_libs/lucide-react.mjs";
import { r as AUTHOR } from "./router-L3Ql1fD6.mjs";
import { t as Button } from "./login-screen-D9FZpBbF.mjs";
import { f as METHOD_INFO } from "./tables-CKe6Elx2.mjs";
import { a as fmtA, i as fmt, n as calculate, t as cableSpec } from "./format-1JLWe3U2.mjs";
import { c as useApp, i as KIND_LABEL, t as AppShell } from "./app-shell-Ch2Oj4Xw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/memoria-Du6ZTsN2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function buildMemoriaText(project) {
	const results = project.circuits.map((c) => ({
		c,
		r: calculate(c)
	}));
	const lines = [
		"CONDUTORES — MEMÓRIA DE CÁLCULO",
		"Dimensionamento de condutores · ABNT NBR 5410:2004",
		AUTHOR.line,
		"",
		`Projeto: ${project.meta.name}`,
		`Cliente: ${project.meta.client || "—"}`,
		`Local: ${project.meta.location || "—"}`,
		`Responsável: ${project.meta.responsible || "—"}`,
		`CREA: ${project.meta.crea || "—"}`
	];
	if (project.meta.notes) lines.push(`Observações: ${project.meta.notes}`);
	lines.push("", "RESUMO");
	for (const { c, r } of results) lines.push(`${c.tag}  ${c.from} → ${c.to}  Ib ${fmtA(r.ib)}  ${cableSpec(r.nPerPhase, c.formation, r.section, c.insulation)}  In ${r.breaker} A  ΔV ${fmt(r.dropPct, 2)} %  ${r.ok ? "OK" : "REVISAR"}`);
	for (const { c, r } of results) {
		lines.push("", `── ${c.tag} · ${KIND_LABEL[c.kind]} ──`, `${c.from} → ${c.to} · ${c.voltage} V · ${c.phases}φ · ${c.lengthM} m · ${METHOD_INFO[c.method].name}`, `Ib ${fmtA(r.ib)} · I′p ${fmtA(r.ip)} · Fa ${fmt(r.fa, 2)} · Ft ${fmt(r.ft, 2)} · Fr ${fmt(r.fr, 2)}`, cableSpec(r.nPerPhase, c.formation, r.section, c.insulation), `Iz ${fmtA(r.iz)} · In ${r.breaker} A · PE ${r.pe} mm²`, `Rca ${fmt(r.rca, 3)} Ω/km · XL ${fmt(r.xl, 3)} Ω/km`, `ΔV NBR ${fmt(r.dropPct, 2)} % (R cosφ + X senφ) · |Z| ${fmt(r.dropModulusPct, 2)} % · máx. ${c.maxDropPct} %`, `Icc ${fmt(r.iscLocalKa, 2)} kA · Icw ${fmt(r.icwKa, 1)} kA · eletroduto ${r.conduit ?? "—"}`);
		for (const chk of r.checks) lines.push(`${chk.ok ? "OK" : "X"} — ${chk.label}: ${chk.detail} (${chk.ref})`);
		if (c.notes) lines.push(`Notas: ${c.notes}`);
	}
	lines.push("", AUTHOR.line);
	return lines.join("\n");
}
function MemoriaView() {
	const project = useApp((s) => s.project());
	const results = project.circuits.map((c) => ({
		c,
		r: calculate(c)
	}));
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function copyMemoria() {
		const text = buildMemoriaText(project);
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			const ta = document.createElement("textarea");
			ta.value = text;
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			ta.remove();
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1800);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-label font-medium uppercase tracking-[0.12em] text-muted",
						children: "Documento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-2xl font-semibold tracking-tight",
						children: "Memória de cálculo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Documento para arquivo do projeto. Use imprimir para PDF ou copie o texto."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: copyMemoria,
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copiado" : "Copiar"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => window.print(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), " Imprimir / PDF"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "rounded-lg border border-border bg-surface p-5 shadow-card print:shadow-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-label uppercase tracking-[0.1em] text-muted",
						children: "Condutores · NBR 5410:2004"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-serif text-xl font-semibold",
						children: project.meta.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Cliente"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: project.meta.client || "—" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Local"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: project.meta.location || "—" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Responsável"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: project.meta.responsible || "—" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "CREA"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: project.meta.crea || "—" })] })
						]
					}),
					project.meta.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: project.meta.notes
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-subtle",
						children: AUTHOR.line
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-lg border border-border bg-surface shadow-card print:shadow-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[900px] text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-left text-label uppercase tracking-wider text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Circ."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Trecho"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Ib"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Cabo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "In"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "ΔV"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Icc"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Ø"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2",
									children: "Status"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: results.map(({ c, r }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-medium",
								children: c.tag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2",
								children: [
									c.from,
									" → ",
									c.to
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono",
								children: fmtA(r.ib)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: cableSpec(r.nPerPhase, c.formation, r.section, c.insulation)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 font-mono",
								children: [r.breaker, " A"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 font-mono",
								children: [fmt(r.dropPct, 2), " %"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 font-mono",
								children: [fmt(r.iscLocalKa, 2), " kA"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: r.conduit ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: r.ok ? "OK" : "Revisar"
							})
						]
					}, c.id)) })]
				})
			}),
			results.map(({ c, r }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "break-inside-avoid rounded-lg border border-border bg-surface p-5 shadow-card print:shadow-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-serif text-lg font-semibold",
						children: [
							c.tag,
							" · ",
							KIND_LABEL[c.kind]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							c.from,
							" → ",
							c.to,
							" · ",
							c.voltage,
							" V · ",
							c.phases,
							"φ · ",
							c.lengthM,
							" m · ",
							METHOD_INFO[c.method].name
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Ib ",
								fmtA(r.ib),
								" · I′p ",
								fmtA(r.ip)
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Fa ",
								fmt(r.fa, 2),
								" · Ft ",
								fmt(r.ft, 2),
								" · Fr ",
								fmt(r.fr, 2)
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: cableSpec(r.nPerPhase, c.formation, r.section, c.insulation) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Iz ",
								fmtA(r.iz),
								" · In ",
								r.breaker,
								" A · PE ",
								r.pe,
								" mm²"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Rca ",
								fmt(r.rca, 3),
								" Ω/km · XL ",
								fmt(r.xl, 3)
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"ΔV NBR ",
								fmt(r.dropPct, 2),
								" % · |Z| ",
								fmt(r.dropModulusPct, 2),
								" % (máx. ",
								c.maxDropPct,
								" %)"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Icc ",
								fmt(r.iscLocalKa, 2),
								" kA · Icw ",
								fmt(r.icwKa, 1),
								" kA"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Eletroduto ", r.conduit ?? "—"] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-1 text-xs text-muted",
						children: r.checks.map((chk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							chk.ok ? "OK" : "X",
							" — ",
							chk.label,
							": ",
							chk.detail,
							" (",
							chk.ref,
							")"
						] }, chk.id))
					}),
					c.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs italic text-subtle",
						children: c.notes
					}) : null
				]
			}, c.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle print:mt-6",
				children: AUTHOR.line
			})
		]
	});
}
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoriaView, {}) });
}
//#endregion
export { Page as component };
