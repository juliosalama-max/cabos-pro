import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useCurrentUserState, n as LoginScreen } from "./login-screen-D9FZpBbF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-SsZssDwA.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginScreen, { pending: true });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginScreen, {});
}
//#endregion
export { Login as component };
