export function fmt(n: number, d = 2): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function fmtA(n: number): string {
  if (!Number.isFinite(n) || n === 0) return "—";
  return `${fmt(n, n >= 100 ? 1 : 2)} A`;
}

export function cableSpec(
  n: number,
  formation: string,
  section: number,
  insulation: string,
  metal: string = "Cu",
): string {
  if (!section) return "—";
  const form = n > 1 ? `${n}×(${formation} ${section} mm²)` : `${formation} ${section} mm²`;
  const ins = insulation === "PVC" ? "PVC/PVC" : insulation;
  return `${form} ${ins} ${metal === "Al" ? "Al" : "Cu"}`;
}

