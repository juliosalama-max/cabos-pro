import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./login-screen-D9FZpBbF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/card-B9M0cBs2.js
var import_jsx_runtime = require_jsx_runtime();
function Card({ title, context, kicker, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-lg border border-border bg-surface p-5 shadow-card", className),
		children: [
			kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-label font-medium uppercase tracking-[0.1em] text-muted",
				children: kicker
			}) : null,
			title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-xl font-semibold tracking-tight text-fg",
				children: title
			}) : null,
			context ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: context
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: title || context ? "mt-4" : void 0,
				children
			})
		]
	});
}
//#endregion
export { Card as t };
