import { useEffect, useRef, useState } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useApp } from "@/lib/store";
import { loadWorkspace, saveWorkspace } from "@/lib/workspace";

export function WorkspaceSync() {
  const { user, isPending } = useCurrentUserState();
  const replaceWorkspace = useApp((s) => s.replaceWorkspace);
  const resetDemo = useApp((s) => s.resetDemo);
  const projects = useApp((s) => s.projects);
  const currentId = useApp((s) => s.currentId);
  const ownerId = useApp((s) => s.ownerId);
  const loadedFor = useRef<string | null>(null);
  const [hydrated, setHydrated] = useState(() => useApp.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    return useApp.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || isPending || !user) return;
    let cancelled = false;
    loadedFor.current = null;
    void (async () => {
      try {
        const cloud = await loadWorkspace();
        if (cancelled) return;
        if (cloud) {
          replaceWorkspace(cloud.projects, cloud.currentId, user.id);
        } else {
          const local = useApp.getState();
          if (local.ownerId && local.ownerId !== user.id) {
            resetDemo(user.id);
          } else {
            replaceWorkspace(local.projects, local.currentId, user.id);
          }
          const next = useApp.getState();
          await saveWorkspace({ data: { projects: next.projects, currentId: next.currentId } });
        }
        if (!cancelled) loadedFor.current = user.id;
      } catch {
        if (!cancelled) loadedFor.current = user.id;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, user, isPending, replaceWorkspace, resetDemo]);

  useEffect(() => {
    if (!user || loadedFor.current !== user.id) return;
    if (ownerId !== user.id) return;
    const t = window.setTimeout(() => {
      const s = useApp.getState();
      void saveWorkspace({ data: { projects: s.projects, currentId: s.currentId } }).catch(() => {
        /* autosave silencioso — o botão Salvar reporta falha */
      });
    }, 900);
    return () => window.clearTimeout(t);
  }, [projects, currentId, ownerId, user]);

  return null;
}
