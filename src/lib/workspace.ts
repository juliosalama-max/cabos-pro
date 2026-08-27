import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Project } from "@/lib/nbr5410/types";

export type WorkspacePayload = {
  projects: Project[];
  currentId: string;
};

function asWorkspace(row: { current_id: string; projects: unknown } | undefined): WorkspacePayload | null {
  if (!row) return null;
  const projects = row.projects as Project[];
  if (!Array.isArray(projects) || projects.length === 0) return null;
  return { projects, currentId: row.current_id || projects[0].id };
}

export const loadWorkspace = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ current_id: string; projects: unknown }>`
      select current_id, projects from cabos_workspace where user_id = ${context.userId}
    `;
    return asWorkspace(rows[0]);
  });

export const saveWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: WorkspacePayload) => {
    if (!data || !Array.isArray(data.projects) || data.projects.length === 0 || !data.currentId) {
      throw new Error("Workspace inválido");
    }
    return data;
  })
  .handler(async ({ context, data }) => {
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
    return { ok: true as const };
  });
