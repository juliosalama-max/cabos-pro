import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  EXAMPLE_FEEDER,
  defaultCircuit,
  newId,
  type CircuitInput,
  type Project,
  type ProjectMeta,
} from "@/lib/nbr5410/types";

const defaultMeta = (): ProjectMeta => ({
  name: "Alimentador 150 kVA — exemplo",
  client: "Obra de referência",
  location: "Rio de Janeiro, RJ",
  responsible: "",
  crea: "",
  notes: "Projeto inicial com o circuito da planilha de dimensionamento.",
  updatedAt: new Date().toISOString(),
});

function demoProject(): Project {
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
    pf: 0.92,
    lengthM: 28,
    tempC: 30,
    nCircuits: 3,
    method: "B1",
    insulation: "PVC",
    formation: "1x2",
    maxDropPct: 4,
    dropMethod: "nbr",
    iscKa: 6,
    iscTimeS: 0.1,
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
    pf: 0.82,
    efficiency: 0.91,
    lengthM: 55,
    tempC: 40,
    nCircuits: 4,
    method: "E",
    insulation: "HEPR",
    formation: "3x1",
    maxDropPct: 5,
    dropMethod: "nbr",
    iscKa: 25,
    iscTimeS: 0.1,
  });
  return {
    id: newId(),
    meta: defaultMeta(),
    circuits: [EXAMPLE_FEEDER, motor, lighting],
    activeId: EXAMPLE_FEEDER.id,
  };
}

interface AppState {
  projects: Project[];
  currentId: string;
  ownerId: string | null;
  project: () => Project;
  active: () => CircuitInput;
  setMeta: (patch: Partial<ProjectMeta>) => void;
  setCircuit: (patch: Partial<CircuitInput>) => void;
  addCircuit: (c?: Partial<CircuitInput>) => void;
  duplicateCircuit: () => void;
  removeCircuit: (id: string) => void;
  selectCircuit: (id: string) => void;
  newProject: () => void;
  loadProject: (id: string) => void;
  saveAs: (name: string) => void;
  deleteProject: (id: string) => void;
  importJson: (raw: string) => boolean;
  exportJson: () => void;
  replaceWorkspace: (projects: Project[], currentId: string, ownerId: string) => void;
  resetDemo: (ownerId: string) => void;
}

function touch(p: Project): Project {
  return { ...p, meta: { ...p.meta, updatedAt: new Date().toISOString() } };
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => {
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
        setMeta: (patch) =>
          set((s) => ({
            projects: s.projects.map((p) =>
              p.id === s.currentId ? touch({ ...p, meta: { ...p.meta, ...patch } }) : p,
            ),
          })),
        setCircuit: (patch) =>
          set((s) => ({
            projects: s.projects.map((p) => {
              if (p.id !== s.currentId) return p;
              return touch({
                ...p,
                circuits: p.circuits.map((c) => (c.id === p.activeId ? { ...c, ...patch } : c)),
              });
            }),
          })),
        addCircuit: (c) =>
          set((s) => ({
            projects: s.projects.map((p) => {
              if (p.id !== s.currentId) return p;
              const n = p.circuits.length + 1;
              const next = defaultCircuit({ tag: `C-${String(n).padStart(2, "0")}`, ...c });
              return touch({ ...p, circuits: [...p.circuits, next], activeId: next.id });
            }),
          })),
        duplicateCircuit: () =>
          set((s) => ({
            projects: s.projects.map((p) => {
              if (p.id !== s.currentId) return p;
              const src = p.circuits.find((c) => c.id === p.activeId);
              if (!src) return p;
              const copy = { ...src, id: newId(), tag: `${src.tag}c` };
              return touch({ ...p, circuits: [...p.circuits, copy], activeId: copy.id });
            }),
          })),
        removeCircuit: (id) =>
          set((s) => ({
            projects: s.projects.map((p) => {
              if (p.id !== s.currentId || p.circuits.length <= 1) return p;
              const circuits = p.circuits.filter((c) => c.id !== id);
              return touch({
                ...p,
                circuits,
                activeId: p.activeId === id ? circuits[0].id : p.activeId,
              });
            }),
          })),
        selectCircuit: (id) =>
          set((s) => ({
            projects: s.projects.map((p) => (p.id === s.currentId ? { ...p, activeId: id } : p)),
          })),
        newProject: () => {
          const p: Project = {
            id: newId(),
            meta: {
              ...defaultMeta(),
              name: "Novo projeto",
              notes: "",
            },
            circuits: [defaultCircuit()],
            activeId: "",
          };
          p.activeId = p.circuits[0].id;
          set((s) => ({ projects: [p, ...s.projects], currentId: p.id }));
        },
        loadProject: (id) => set({ currentId: id }),
        saveAs: (name) => {
          const src = get().project();
          const p: Project = {
            ...src,
            id: newId(),
            meta: { ...src.meta, name, updatedAt: new Date().toISOString() },
            circuits: src.circuits.map((c) => ({ ...c, id: newId() })),
          };
          p.activeId = p.circuits[0]?.id ?? p.activeId;
          set((s) => ({ projects: [p, ...s.projects], currentId: p.id }));
        },
        deleteProject: (id) =>
          set((s) => {
            if (s.projects.length <= 1) return s;
            const projects = s.projects.filter((p) => p.id !== id);
            return {
              projects,
              currentId: s.currentId === id ? projects[0].id : s.currentId,
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
            const data = JSON.parse(raw) as Project;
            if (!data?.meta || !Array.isArray(data.circuits) || data.circuits.length === 0) return false;
            const p: Project = {
              ...data,
              id: newId(),
              meta: { ...data.meta, updatedAt: new Date().toISOString() },
            };
            set((s) => ({ projects: [p, ...s.projects], currentId: p.id }));
            return true;
          } catch {
            return false;
          }
        },
        replaceWorkspace: (projects, currentId, ownerId) => {
          if (!projects.length) return;
          const id = projects.some((p) => p.id === currentId) ? currentId : projects[0].id;
          set({ projects, currentId: id, ownerId });
        },
        resetDemo: (ownerId) => {
          const seed = demoProject();
          set({ projects: [seed], currentId: seed.id, ownerId });
        },
      };
    },
    {
      name: "cabos-pro-v1",
      partialize: (s: AppState) => ({
        projects: s.projects,
        currentId: s.currentId,
        ownerId: s.ownerId,
      }),
    },
  ),
);
