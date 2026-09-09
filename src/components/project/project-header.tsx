import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import type { OriginKind, ProjectMeta } from "@/lib/nbr5410/types";

export function ProjectHeader({
  meta,
  onChange,
}: {
  meta: ProjectMeta;
  onChange: (patch: Partial<ProjectMeta>) => void;
}) {
  return (
    <Card
      title="Identificação da obra"
      context="Cabeçalho da memória de cálculo. Não entra em fórmula."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          label="Projeto / estrutura"
          info="Nome do projeto ou da estrutura. Aparece no cabeçalho da memória de cálculo e na lista de projetos."
          className="sm:col-span-2"
        >
          <Input value={meta.name} onChange={(e) => onChange({ name: e.target.value })} />
        </Field>
        <Field label="Cliente" info="Identificação do cliente ou da obra. Só memória de cálculo.">
          <Input value={meta.client} onChange={(e) => onChange({ client: e.target.value })} />
        </Field>
        <Field label="Local" info="Município ou endereço da instalação. Só memória de cálculo.">
          <Input value={meta.location} onChange={(e) => onChange({ location: e.target.value })} />
        </Field>
        <Field
          label="Responsável técnico"
          info="Nome do profissional que assina o memorial. Não é preenchido automaticamente — informe o responsável pela obra."
        >
          <Input value={meta.responsible} onChange={(e) => onChange({ responsible: e.target.value })} />
        </Field>
        <Field
          label="Origem da instalação"
          info="NBR 5410 6.2.7: concessionária → 4 % até o ponto de uso. Transformador/gerador do consumidor → 5 % em iluminação e 7 % nos demais. A queda acumulada (alimentador + ramal) usa este teto."
        >
          <Select
            value={meta.origin ?? "concessionaria"}
            onChange={(e) => onChange({ origin: e.target.value as OriginKind })}
          >
            <option value="concessionaria">Concessionária (teto 4 %)</option>
            <option value="transformador">Transformador / gerador (5 % / 7 %)</option>
          </Select>
        </Field>
        <Field label="CREA" info="Número do CREA do responsável técnico desta obra.">
          <Input value={meta.crea} onChange={(e) => onChange({ crea: e.target.value })} />
        </Field>
        <Field
          label="Observações"
          info="Notas livres do projeto. Aparecem no cabeçalho da memória. Não entram em fórmula."
          className="sm:col-span-2"
        >
          <Textarea rows={1} value={meta.notes} onChange={(e) => onChange({ notes: e.target.value })} />
        </Field>
      </div>
    </Card>
  );
}
