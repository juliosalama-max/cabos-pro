import { useMemo, useState } from "react";
import { AMPACITY, METHODS, METHOD_INFO, TEMP_FACTOR, GROUP_A_TO_F, GROUP_E_F, IMPEDANCE } from "@/lib/nbr5410/tables";
import { SECTIONS } from "@/lib/nbr5410/tables-data";
import type { Insulation, InstallMethod } from "@/lib/nbr5410/tables-data";
import { Field, Select } from "@/components/ui/field";
import { Card } from "@/components/ui/card";

export function TablesView() {
  const [method, setMethod] = useState<InstallMethod>("F");
  const [ins, setIns] = useState<Insulation>("HEPR");
  const rows = useMemo(() => AMPACITY[method], [method]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-label font-medium uppercase tracking-[0.12em] text-muted">Consulta</p>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Tabelas NBR 5410</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Capacidade de condução extraída da planilha (métodos B1, B2, D, E, F) e da NBR 5410:2004 (A1, A2, C). Isolação
          HEPR/EPR 90 °C e PVC 70 °C, cobre.
        </p>
      </div>

      <Card title="Capacidade de condução" context={METHOD_INFO[method].desc}>
        <div className="mb-4 flex flex-wrap gap-3">
          <Field
            label="Método"
            info="Método de instalação da NBR 5410 (Tab. 33 a 36). A1/A2/C vêm da norma; B1, B2, D, E e F da planilha Prysmian."
          >
            <Select value={method} onChange={(e) => setMethod(e.target.value as InstallMethod)}>
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m} · {METHOD_INFO[m].name}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Isolação"
            info="PVC 70 °C ou HEPR/EPR 90 °C. A temperatura de operação altera Imax e o fator k térmico (115 PVC, 143 HEPR)."
          >
            <Select value={ins} onChange={(e) => setIns(e.target.value as Insulation)}>
              <option value="HEPR">HEPR / EPR 90 °C</option>
              <option value="PVC">PVC 70 °C</option>
            </Select>
          </Field>
        </div>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="text-left text-label uppercase tracking-[0.1em] text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-3">Seção mm²</th>
                <th className="px-4 py-3">Imax 2 cond. (A)</th>
                <th className="px-4 py-3">Imax 3 cond. (A)</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {SECTIONS.filter((s) => rows[s === 1.5 ? "1.5" : String(s)]).map((s) => {
                const key = s === 1.5 ? "1.5" : String(s);
                const row = rows[key];
                const i2 = ins === "HEPR" ? row[0] : row[2];
                const i3 = ins === "HEPR" ? row[1] : row[3];
                return (
                  <tr key={s} className="border-b border-border/60">
                    <td className="px-4 py-2">{s}</td>
                    <td className="px-4 py-2">{i2}</td>
                    <td className="px-4 py-2">{i3}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title="Fator de temperatura — Tabela 40"
        context="Referência: 30 °C no ar, 20 °C no solo. A planilha original omitia 30 °C e deslocava a coluna do solo — aqui está alinhado à NBR."
      >
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-label uppercase tracking-[0.1em] text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-3">°C</th>
                <th className="px-4 py-3">PVC ar</th>
                <th className="px-4 py-3">EPR ar</th>
                <th className="px-4 py-3">PVC solo</th>
                <th className="px-4 py-3">EPR solo</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {TEMP_FACTOR.map((r) => (
                <tr key={r.t} className="border-b border-border/60">
                  <td className="px-4 py-2">{r.t}</td>
                  <td className="px-4 py-2">{r.pvcAir || "—"}</td>
                  <td className="px-4 py-2">{r.eprAir || "—"}</td>
                  <td className="px-4 py-2">{r.pvcSoil || "—"}</td>
                  <td className="px-4 py-2">{r.eprSoil || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Agrupamento — Tabela 13" context="Fator Fa em função do número de circuitos agrupados.">
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="text-left text-label uppercase tracking-[0.1em] text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-3">Circuitos</th>
                {Array.from({ length: 12 }, (_, i) => (
                  <th key={i} className="px-2 py-3 text-center">
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular">
              <tr className="border-b border-border/60">
                <td className="px-4 py-2 text-muted">A a F</td>
                {GROUP_A_TO_F.slice(1).map((v, i) => (
                  <td key={i} className="px-2 py-2 text-center">
                    {v}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 text-muted">E e F</td>
                {GROUP_E_F.slice(1).map((v, i) => (
                  <td key={i} className="px-2 py-2 text-center">
                    {v}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Impedância HEPR 3×1" context="Rca e XL em Ω/km, usados na queda de tensão e no Icc no ponto.">
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[400px] text-sm">
            <thead className="text-left text-label uppercase tracking-[0.1em] text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-3">mm²</th>
                <th className="px-4 py-3">Rca</th>
                <th className="px-4 py-3">XL</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {Object.entries(IMPEDANCE.HEPR).map(([s, row]) => (
                <tr key={s} className="border-b border-border/60">
                  <td className="px-4 py-2">{s}</td>
                  <td className="px-4 py-2">{row["3x1"]?.rca ?? "—"}</td>
                  <td className="px-4 py-2">{row["3x1"]?.xl ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
