import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-B4N4reaB.mjs";
import { t as authMiddleware } from "./middleware-CeMtEseE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace-CuOymT79.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function asWorkspace(row) {
	if (!row) return null;
	const projects = row.projects;
	if (!Array.isArray(projects) || projects.length === 0) return null;
	return {
		projects,
		currentId: row.current_id || projects[0].id
	};
}
var loadWorkspace_createServerFn_handler = createServerRpc({
	id: "f250419c7022b908c9f63ff8099f0bc681d9b71bf0e24647a9a9d5c2790db76e",
	name: "loadWorkspace",
	filename: "src/lib/workspace.ts"
}, (opts) => loadWorkspace.__executeServer(opts));
var loadWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadWorkspace_createServerFn_handler, async ({ context }) => {
	return asWorkspace((await (await getSql())`
      select current_id, projects from cabos_workspace where user_id = ${context.userId}
    `)[0]);
});
var saveWorkspace_createServerFn_handler = createServerRpc({
	id: "660d2259743bff2cfcb01f2c7c91b27e572662697a890056662344f43b58751d",
	name: "saveWorkspace",
	filename: "src/lib/workspace.ts"
}, (opts) => saveWorkspace.__executeServer(opts));
var saveWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => {
	if (!data || !Array.isArray(data.projects) || data.projects.length === 0 || !data.currentId) throw new Error("Workspace inválido");
	return data;
}).handler(saveWorkspace_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const payload = JSON.stringify(data.projects);
	await sql`
      insert into cabos_workspace (user_id, current_id, projects, updated_at)
      values (${context.userId}, ${data.currentId}, ${payload}::jsonb, now())
      on conflict (user_id) do update set
        current_id = excluded.current_id,
        projects = excluded.projects,
        updated_at = now()
    `;
	return { ok: true };
});
//#endregion
export { loadWorkspace_createServerFn_handler, saveWorkspace_createServerFn_handler };
