import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { a as Save, d as FolderPlus, f as FileSpreadsheet, h as CircleHelp, i as Scale, l as LogOut, o as Printer, p as Download, r as Trash2, t as Upload, u as Folder, v as Cable } from "../_libs/lucide-react.mjs";
import { n as APP, r as AUTHOR } from "./router-L3Ql1fD6.mjs";
import { i as useCurrentUserState, n as LoginScreen, r as cn, t as Button } from "./login-screen-D9FZpBbF.mjs";
import { t as authMiddleware } from "./middleware-CeMtEseE.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-Ch2Oj4Xw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InfoTip({ text, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cn("relative grid size-7 shrink-0 place-items-center rounded-full text-muted hover:bg-brand-soft hover:text-brand after:absolute after:top-1/2 after:left-1/2 after:size-9 after:-translate-x-1/2 after:-translate-y-1/2", className),
			"aria-label": "Ajuda",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, {
				className: "size-4",
				strokeWidth: 1.75
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		side: "bottom",
		align: "start",
		sideOffset: 8,
		collisionPadding: 12,
		className: "z-50 max-w-80 rounded-md border border-border bg-surface p-3 text-help leading-relaxed text-fg whitespace-pre-line shadow-card outline-none",
		children: text
	}) })] });
}
function Field({ label, hint, info, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col gap-1 min-w-0", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-label font-medium uppercase tracking-[0.1em] text-muted",
					children: label
				}), info ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoTip, { text: info }) : null]
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-help text-subtle",
				children: hint
			}) : null
		]
	});
}
var control = "h-11 w-full rounded-sm border border-border bg-paper px-3 text-sm text-fg placeholder:text-subtle disabled:opacity-60";
function Input(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: cn(control, props.className)
	});
}
function Select({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		...props,
		className: cn(control, "pr-8", className),
		children
	});
}
function Textarea(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		...props,
		className: cn(control, "h-auto min-h-20 py-2", props.className)
	});
}
function Readout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(control, "h-auto min-h-11 flex flex-wrap items-center gap-x-2 gap-y-0.5 py-2 overflow-hidden bg-surface-2"),
		children
	});
}
var KIND_LABEL = {
	iluminacao: "Iluminação",
	tug: "TUG — tomadas de uso geral",
	tue: "TUE — tomadas de uso específico",
	motor: "Motor",
	alimentador: "Alimentador",
	comando: "Comando / sinal"
};
function newId() {
	return Math.random().toString(36).slice(2, 10);
}
function defaultCircuit(partial) {
	return {
		id: newId(),
		tag: "C-01",
		from: "QGBT",
		to: "Carga",
		kind: "alimentador",
		loadType: "kva",
		powerKw: 0,
		powerKva: 30,
		powerCv: 0,
		ibManual: 0,
		voltage: 380,
		phases: 3,
		pf: .92,
		efficiency: 1,
		lengthM: 40,
		tempC: 30,
		nCircuits: 1,
		method: "B1",
		insulation: "HEPR",
		formation: "3x1",
		maxDropPct: 4,
		dropMethod: "nbr",
		iscKa: 15,
		iscTimeS: .1,
		groupingOverride: null,
		buriedDucts: false,
		burySpacingM: 0,
		layers: 1,
		reserveEnabled: true,
		notes: "",
		...partial
	};
}
var EXAMPLE_FEEDER = {
	id: "ex-planilha",
	tag: "AL-01",
	from: "PN-4600002",
	to: "PN-6210.03005",
	kind: "alimentador",
	loadType: "kva",
	powerKw: 0,
	powerKva: 150,
	powerCv: 0,
	ibManual: 0,
	voltage: 480,
	phases: 3,
	pf: 1,
	efficiency: 1,
	lengthM: 320,
	tempC: 40,
	nCircuits: 6,
	method: "F",
	insulation: "HEPR",
	formation: "3x1",
	maxDropPct: 3,
	dropMethod: "nbr",
	iscKa: 80,
	iscTimeS: .05,
	groupingOverride: null,
	buriedDucts: false,
	burySpacingM: 0,
	layers: 1,
	reserveEnabled: true,
	notes: "Circuito de referência da planilha (150 kVA · 480 V · 320 m). Dimensionado com R cosφ + X senφ (NBR 5410). A planilha original usava |Z| e chegava a 240 mm²."
};
function AccountMenu() {
	const { user, isPending } = useCurrentUserState();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "size-10 shrink-0 animate-pulse rounded-sm bg-secondary",
		"aria-hidden": true
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "outline",
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			children: "Entrar"
		})
	});
	const label = user.displayName || user.primaryEmail || "Conta";
	const initial = label.charAt(0).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-brand text-sm font-medium text-accent-fg",
			"aria-label": `Conta de ${label}`,
			children: user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "size-10 object-cover"
			}) : initial
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Content2, {
		align: "end",
		sideOffset: 8,
		className: "z-50 w-64 rounded-md border border-border bg-surface p-3 shadow-card outline-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-sm font-medium",
				children: label
			}),
			user.primaryEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-help text-muted",
				children: user.primaryEmail
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: signingOut,
				className: "mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-sm bg-secondary text-sm hover:bg-border disabled:opacity-50",
				onClick: () => {
					setError(null);
					setSigningOut(true);
					signOut("/login").catch(() => {
						setSigningOut(false);
						setError("Não foi possível sair. Tente de novo.");
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
					className: "size-4",
					strokeWidth: 1.75
				}), signingOut ? "Saindo…" : "Sair"]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-help text-danger",
				children: error
			}) : null
		]
	}) })] });
}
var defaultMeta = () => ({
	name: "Alimentador 150 kVA — exemplo",
	client: "Obra de referência",
	location: "Rio de Janeiro, RJ",
	responsible: "",
	crea: "",
	notes: "Projeto inicial com o circuito da planilha de dimensionamento.",
	updatedAt: (/* @__PURE__ */ new Date()).toISOString()
});
function demoProject() {
	const lighting = defaultCircuit({
		id: "ex-luz",
		tag: "IL-01",
		from: "QDL",
		to: "Iluminação pav. 1",
		kind: "iluminacao",
		loadType: "kw",
		powerKw: 2.2,
		powerKva: 0,
		voltage: 220,
		phases: 1,
		pf: .92,
		lengthM: 28,
		tempC: 30,
		nCircuits: 3,
		method: "B1",
		insulation: "PVC",
		formation: "1x2",
		maxDropPct: 4,
		dropMethod: "nbr",
		iscKa: 6,
		iscTimeS: .1
	});
	const motor = defaultCircuit({
		id: "ex-mot",
		tag: "M-01",
		from: "CCM-01",
		to: "Bomba B-101",
		kind: "motor",
		loadType: "kw",
		powerKw: 7.5,
		powerKva: 0,
		powerCv: 10,
		voltage: 380,
		phases: 3,
		pf: .82,
		efficiency: .91,
		lengthM: 55,
		tempC: 40,
		nCircuits: 4,
		method: "E",
		insulation: "HEPR",
		formation: "3x1",
		maxDropPct: 5,
		dropMethod: "nbr",
		iscKa: 25,
		iscTimeS: .1
	});
	return {
		id: newId(),
		meta: defaultMeta(),
		circuits: [
			EXAMPLE_FEEDER,
			motor,
			lighting
		],
		activeId: EXAMPLE_FEEDER.id
	};
}
function touch(p) {
	return {
		...p,
		meta: {
			...p.meta,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
}
var useApp = create()(persist((set, get) => {
	const seed = demoProject();
	return {
		projects: [seed],
		currentId: seed.id,
		ownerId: null,
		project: () => get().projects.find((p) => p.id === get().currentId) ?? get().projects[0],
		active: () => {
			const p = get().project();
			return p.circuits.find((c) => c.id === p.activeId) ?? p.circuits[0];
		},
		setMeta: (patch) => set((s) => ({ projects: s.projects.map((p) => p.id === s.currentId ? touch({
			...p,
			meta: {
				...p.meta,
				...patch
			}
		}) : p) })),
		setCircuit: (patch) => set((s) => ({ projects: s.projects.map((p) => {
			if (p.id !== s.currentId) return p;
			return touch({
				...p,
				circuits: p.circuits.map((c) => c.id === p.activeId ? {
					...c,
					...patch
				} : c)
			});
		}) })),
		addCircuit: (c) => set((s) => ({ projects: s.projects.map((p) => {
			if (p.id !== s.currentId) return p;
			const n = p.circuits.length + 1;
			const next = defaultCircuit({
				tag: `C-${String(n).padStart(2, "0")}`,
				...c
			});
			return touch({
				...p,
				circuits: [...p.circuits, next],
				activeId: next.id
			});
		}) })),
		duplicateCircuit: () => set((s) => ({ projects: s.projects.map((p) => {
			if (p.id !== s.currentId) return p;
			const src = p.circuits.find((c) => c.id === p.activeId);
			if (!src) return p;
			const copy = {
				...src,
				id: newId(),
				tag: `${src.tag}c`
			};
			return touch({
				...p,
				circuits: [...p.circuits, copy],
				activeId: copy.id
			});
		}) })),
		removeCircuit: (id) => set((s) => ({ projects: s.projects.map((p) => {
			if (p.id !== s.currentId || p.circuits.length <= 1) return p;
			const circuits = p.circuits.filter((c) => c.id !== id);
			return touch({
				...p,
				circuits,
				activeId: p.activeId === id ? circuits[0].id : p.activeId
			});
		}) })),
		selectCircuit: (id) => set((s) => ({ projects: s.projects.map((p) => p.id === s.currentId ? {
			...p,
			activeId: id
		} : p) })),
		newProject: () => {
			const p = {
				id: newId(),
				meta: {
					...defaultMeta(),
					name: "Novo projeto",
					notes: ""
				},
				circuits: [defaultCircuit()],
				activeId: ""
			};
			p.activeId = p.circuits[0].id;
			set((s) => ({
				projects: [p, ...s.projects],
				currentId: p.id
			}));
		},
		loadProject: (id) => set({ currentId: id }),
		saveAs: (name) => {
			const src = get().project();
			const p = {
				...src,
				id: newId(),
				meta: {
					...src.meta,
					name,
					updatedAt: (/* @__PURE__ */ new Date()).toISOString()
				},
				circuits: src.circuits.map((c) => ({
					...c,
					id: newId()
				}))
			};
			p.activeId = p.circuits[0]?.id ?? p.activeId;
			set((s) => ({
				projects: [p, ...s.projects],
				currentId: p.id
			}));
		},
		deleteProject: (id) => set((s) => {
			if (s.projects.length <= 1) return s;
			const projects = s.projects.filter((p) => p.id !== id);
			return {
				projects,
				currentId: s.currentId === id ? projects[0].id : s.currentId
			};
		}),
		exportJson: () => {
			const p = get().project();
			const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
			const a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.download = `${p.meta.name.replace(/\s+/g, "-").toLowerCase()}.cabos.json`;
			a.click();
			URL.revokeObjectURL(a.href);
		},
		importJson: (raw) => {
			try {
				const data = JSON.parse(raw);
				if (!data?.meta || !Array.isArray(data.circuits) || data.circuits.length === 0) return false;
				const p = {
					...data,
					id: newId(),
					meta: {
						...data.meta,
						updatedAt: (/* @__PURE__ */ new Date()).toISOString()
					}
				};
				set((s) => ({
					projects: [p, ...s.projects],
					currentId: p.id
				}));
				return true;
			} catch {
				return false;
			}
		},
		replaceWorkspace: (projects, currentId, ownerId) => {
			if (!projects.length) return;
			set({
				projects,
				currentId: projects.some((p) => p.id === currentId) ? currentId : projects[0].id,
				ownerId
			});
		},
		resetDemo: (ownerId) => {
			const seed = demoProject();
			set({
				projects: [seed],
				currentId: seed.id,
				ownerId
			});
		}
	};
}, {
	name: "cabos-pro-v1",
	partialize: (s) => ({
		projects: s.projects,
		currentId: s.currentId,
		ownerId: s.ownerId
	})
}));
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var loadWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f250419c7022b908c9f63ff8099f0bc681d9b71bf0e24647a9a9d5c2790db76e"));
var saveWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data || !Array.isArray(data.projects) || data.projects.length === 0 || !data.currentId) throw new Error("Workspace inválido");
	return data;
}).handler(createSsrRpc("660d2259743bff2cfcb01f2c7c91b27e572662697a890056662344f43b58751d"));
function WorkspaceSync() {
	const { user, isPending } = useCurrentUserState();
	const replaceWorkspace = useApp((s) => s.replaceWorkspace);
	const resetDemo = useApp((s) => s.resetDemo);
	const projects = useApp((s) => s.projects);
	const currentId = useApp((s) => s.currentId);
	const ownerId = useApp((s) => s.ownerId);
	const loadedFor = (0, import_react.useRef)(null);
	const [hydrated, setHydrated] = (0, import_react.useState)(() => useApp.persist.hasHydrated());
	(0, import_react.useEffect)(() => {
		if (hydrated) return;
		return useApp.persist.onFinishHydration(() => setHydrated(true));
	}, [hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated || isPending || !user) return;
		let cancelled = false;
		loadedFor.current = null;
		(async () => {
			try {
				const cloud = await loadWorkspace();
				if (cancelled) return;
				if (cloud) replaceWorkspace(cloud.projects, cloud.currentId, user.id);
				else {
					const local = useApp.getState();
					if (local.ownerId && local.ownerId !== user.id) resetDemo(user.id);
					else replaceWorkspace(local.projects, local.currentId, user.id);
					const next = useApp.getState();
					await saveWorkspace({ data: {
						projects: next.projects,
						currentId: next.currentId
					} });
				}
				if (!cancelled) loadedFor.current = user.id;
			} catch {
				if (!cancelled) loadedFor.current = user.id;
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		hydrated,
		user,
		isPending,
		replaceWorkspace,
		resetDemo
	]);
	(0, import_react.useEffect)(() => {
		if (!user || loadedFor.current !== user.id) return;
		if (ownerId !== user.id) return;
		const t = window.setTimeout(() => {
			const s = useApp.getState();
			saveWorkspace({ data: {
				projects: s.projects,
				currentId: s.currentId
			} }).catch(() => {});
		}, 900);
		return () => window.clearTimeout(t);
	}, [
		projects,
		currentId,
		ownerId,
		user
	]);
	return null;
}
function ProjectDrawer({ open, onClose }) {
	const projects = useApp((s) => s.projects);
	const currentId = useApp((s) => s.currentId);
	const currentName = useApp((s) => s.project().meta.name);
	const setMeta = useApp((s) => s.setMeta);
	const load = useApp((s) => s.loadProject);
	const create = useApp((s) => s.newProject);
	const remove = useApp((s) => s.deleteProject);
	const saveAs = useApp((s) => s.saveAs);
	const importJson = useApp((s) => s.importJson);
	const exportJson = useApp((s) => s.exportJson);
	const fileRef = (0, import_react.useRef)(null);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 flex justify-end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-fg/30",
			"aria-label": "Fechar",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-lg font-semibold",
						children: "Projetos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Salvos na sua conta"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: onClose,
						children: "Fechar"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 px-5 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => {
								create();
								onClose();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "size-3.5" }), " Novo"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => saveAs(`${currentName} (cópia)`),
							children: "Duplicar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: exportJson,
							"aria-label": "Baixar JSON",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => fileRef.current?.click(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "application/json",
							className: "hidden",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (!f) return;
								f.text().then((t) => importJson(t));
							}
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex-1 overflow-auto px-3 pb-6",
					children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							load(p.id);
							onClose();
						},
						className: cn("flex w-full items-center gap-3 rounded-md px-3 py-3 text-left", p.id === currentId ? "bg-surface-2" : "hover:bg-surface"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: p.meta.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-muted",
								children: [
									p.circuits.length,
									" circuito",
									p.circuits.length === 1 ? "" : "s",
									p.meta.location ? ` · ${p.meta.location}` : ""
								]
							})]
						}), projects.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							role: "button",
							tabIndex: 0,
							className: "grid size-8 place-items-center text-subtle hover:text-danger",
							onClick: (ev) => {
								ev.stopPropagation();
								remove(p.id);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						}) : null]
					}) }, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-5 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-label text-subtle",
						children: "Renomear projeto atual"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: currentName,
						onChange: (e) => setMeta({ name: e.target.value })
					})]
				})
			]
		})]
	});
}
var NAV = [
	{
		to: "/",
		label: "Circuito",
		icon: Cable,
		help: "Entradas do trecho: identificação, carga, método e fatores. O veredito à direita recalcula a cada alteração. O tipo define a seção mínima (Tab. 47)."
	},
	{
		to: "/tabelas",
		label: "Tabelas NBR",
		icon: FileSpreadsheet,
		help: "Consulta das tabelas de capacidade de condução, temperatura e agrupamento. Não altera o circuito ativo."
	},
	{
		to: "/memoria",
		label: "Memória",
		icon: Printer,
		help: "Memorial de cálculo para arquivo do projeto. Imprimir gera PDF pelo navegador; Copiar envia o texto."
	},
	{
		to: "/norma",
		label: "Norma",
		icon: Scale,
		help: "Premissas da NBR 5410:2004, limites de queda (6.2.7) e o que foi revisado na planilha original."
	}
];
function AppShell({ children, aside, strip }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const name = useApp((s) => s.project().meta.name);
	const setMeta = useApp((s) => s.setMeta);
	const [projectsOpen, setProjectsOpen] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [savedFlash, setSavedFlash] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => setReady(true), []);
	async function save() {
		setMeta({});
		try {
			const s = useApp.getState();
			await saveWorkspace({ data: {
				projects: s.projects,
				currentId: s.currentId
			} });
			setSavedFlash("ok");
		} catch {
			setSavedFlash("err");
		}
		window.setTimeout(() => setSavedFlash(null), 1800);
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginScreen, { pending: true });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceSync, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectDrawer, {
				open: projectsOpen,
				onClose: () => setProjectsOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "no-print sticky top-0 z-30 border-b border-border bg-surface",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-[68px] items-center gap-3 px-4 md:px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 shrink-0 place-items-center rounded-sm bg-brand text-accent-fg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cable, {
									className: "size-5",
									strokeWidth: 1.75
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-serif text-lg font-semibold leading-tight tracking-tight",
									children: APP.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden text-xs text-muted sm:block",
									children: APP.subtitle
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-2",
							children: [
								savedFlash === "ok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden text-xs text-ok sm:inline",
									children: "Salvo na sua conta"
								}) : null,
								savedFlash === "err" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden text-xs text-danger sm:inline",
									children: "Não foi possível salvar"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: APP.hubUrl,
									className: "hidden h-11 items-center px-2 text-sm text-muted hover:text-fg md:inline-flex",
									children: "Portal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => setProjectsOpen(true),
									"aria-label": "Projetos",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
										className: "size-4",
										strokeWidth: 1.75
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Projetos"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => void save(),
									"aria-label": "Salvar",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
										className: "size-4",
										strokeWidth: 1.75
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Salvar"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountMenu, {})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex gap-1 overflow-x-auto px-3 pb-3 md:hidden",
						children: NAV.map((item) => {
							const Icon = item.icon;
							const active = pathname === item.to;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("inline-flex h-10 shrink-0 items-center gap-1.5 rounded-sm px-3 text-sm", active ? "bg-brand text-accent-fg" : "bg-surface-2 text-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-3.5",
									strokeWidth: 1.75
								}), item.label]
							}, item.to);
						})
					}),
					strip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pb-3 lg:hidden",
						children: strip
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-[1480px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "no-print sticky top-[68px] hidden h-[calc(100dvh-68px)] w-60 shrink-0 flex-col border-r border-border bg-surface-2 p-4 md:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 px-2 text-label font-medium uppercase tracking-[0.12em] text-muted",
								children: "Projeto"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-4 truncate px-2 text-sm text-fg",
								children: ready ? name : "…"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "flex flex-col gap-1",
								children: NAV.map((item) => {
									const Icon = item.icon;
									const active = pathname === item.to;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("flex items-center rounded-sm pr-0.5", active ? "bg-brand text-accent-fg" : "text-fg hover:bg-surface"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: item.to,
											className: "flex h-11 min-w-0 flex-1 items-center gap-2 px-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												className: "size-4 shrink-0",
												strokeWidth: 1.75
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: item.label
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoTip, {
											text: item.help,
											className: active ? "text-accent-fg/90 hover:bg-brand-hover hover:text-accent-fg" : "text-fg/70 hover:bg-brand-soft hover:text-brand"
										})]
									}, item.to);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-auto px-2 pb-2 text-help leading-relaxed text-subtle",
								children: AUTHOR.line
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-w-0 flex-1 p-4 md:p-6",
						children
					}),
					aside ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "no-print hidden w-[280px] shrink-0 border-l border-border bg-surface-2 lg:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sticky top-[68px] max-h-[calc(100dvh-68px)] overflow-y-auto p-5",
							children: aside
						})
					}) : null
				]
			})
		]
	});
}
//#endregion
export { Readout as a, useApp as c, KIND_LABEL as i, Field as n, Select as o, Input as r, Textarea as s, AppShell as t };
