import { Download, FolderPlus, RotateCcw, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { BACKUP_KEY } from "@/lib/brand";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProjectDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const projects = useApp((s) => s.projects);
  const currentId = useApp((s) => s.currentId);
  const currentName = useApp((s) => s.project().meta.name);
  const setMeta = useApp((s) => s.setMeta);
  const load = useApp((s) => s.loadProject);
  const create = useApp((s) => s.newProject);
  const remove = useApp((s) => s.deleteProject);
  const saveAs = useApp((s) => s.saveAs);
  const importJson = useApp((s) => s.importJson);
  const exportWorkspace = useApp((s) => s.exportWorkspace);
  const restoreBackup = useApp((s) => s.restoreBackup);
  const fileRef = useRef<HTMLInputElement>(null);
  const [flash, setFlash] = useState<string | null>(null);

  if (!open) return null;

  function ping(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 1800);
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button type="button" className="absolute inset-0 bg-fg/30" aria-label="Fechar" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold">Projetos</h2>
            <p className="text-xs text-muted">Salvos neste navegador · pasta → circuitos</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 px-5 py-3">
          <Button
            size="sm"
            onClick={() => {
              create();
              onClose();
            }}
          >
            <FolderPlus className="size-3.5" /> Novo
          </Button>
          <Button size="sm" variant="secondary" onClick={() => saveAs(`${currentName} (cópia)`)}>
            Duplicar
          </Button>
          <Button size="sm" variant="outline" onClick={exportWorkspace}>
            <Download className="size-3.5" /> Baixar cópia
          </Button>
          <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload className="size-3.5" /> Importar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => ping(restoreBackup() ? "Cópia de segurança restaurada" : "Nenhuma cópia de segurança")}
            title={BACKUP_KEY}
          >
            <RotateCcw className="size-3.5" /> Restaurar segurança
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              f.text().then((t) => ping(importJson(t) ? "Importado" : "JSON inválido"));
            }}
          />
        </div>
        {flash ? <p className="px-5 text-xs text-ok">{flash}</p> : null}
        <ul className="flex-1 overflow-auto px-3 pb-6">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  load(p.id);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left",
                  p.id === currentId ? "bg-surface-2" : "hover:bg-surface",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.meta.name}</p>
                  <p className="truncate text-xs text-muted">
                    {p.circuits.length} circuito{p.circuits.length === 1 ? "" : "s"}
                    {p.meta.location ? ` · ${p.meta.location}` : ""}
                  </p>
                </div>
                {projects.length > 1 ? (
                  <span
                    role="button"
                    tabIndex={0}
                    className="grid size-8 place-items-center text-muted hover:text-danger"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      remove(p.id);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-5 py-3">
          <p className="mb-2 text-label text-muted">Renomear projeto atual</p>
          <Input value={currentName} onChange={(e) => setMeta({ name: e.target.value })} />
        </div>
      </aside>
    </div>
  );
}
