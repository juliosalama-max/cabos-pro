import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { AUTHOR } from "@/lib/brand";

export const Route = createFileRoute("/norma")({ component: NormaPage });

function NormaPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-label font-medium uppercase tracking-[0.12em] text-muted">Premissas</p>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">NBR 5410:2004</h1>
          <p className="mt-1 text-sm text-muted">
            Instalações elétricas de baixa tensão. Segunda edição (30.09.2004), versão corrigida em 17.03.2008. Continua
            sendo a norma oficial vigente — a revisão em consulta nacional ainda não substitui esta edição.
          </p>
        </div>

        <Card title="O que o aplicativo calcula" context="Grandezas de entrada e critérios de dimensionamento.">
          <ul className="space-y-2 text-sm text-muted">
            <li>Corrente de projeto Ib a partir de kVA, kW, cv ou valor informado.</li>
            <li>Fatores de correção de temperatura (Tab. 40) e agrupamento (Tab. 13, 14, 16 e 17).</li>
            <li>Seção mínima que atende Iz ≥ Ib, queda de tensão e I²t de curto-circuito, com paralelismo até 6 por fase.</li>
            <li>Coordenação Ib ≤ In ≤ Iz e I² ≤ 1,45 Iz (5.7.2.2.1).</li>
            <li>Neutro (Tab. 48) e PE (Tab. 58), eletroduto (ocupação 40 % / 31 % / 53 %).</li>
            <li>Catálogo de motores 4 pólos 60 Hz da planilha (rendimento, FP, disjuntor, contator, relé).</li>
          </ul>
        </Card>

        <Card
          title="Revisão da planilha original"
          context="A planilha “MC — Dimensionamento de Cabos” foi o ponto de partida. O que mudou para alinhar à NBR."
        >
          <p className="text-sm text-muted">
            Mantivemos tabelas Prysmian (GSette Easy / Afumex Flex HEPR e Sintenax PVC), métodos B1, B2, D, E, F, formação
            de cabo, eletroduto e o circuito de exemplo 150 kVA / 480 V / 320 m.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <strong className="text-fg">Temperatura 30 °C</strong> — a planilha saltava de 25 para 35 °C. Incluímos Ft =
              1,00 em 30 °C, como a Tab. 40.
            </li>
            <li>
              <strong className="text-fg">Solo 20 °C</strong> — a coluna “solo” estava deslocada (20 °C = 0,95/0,96). A
              NBR define 20 °C como referência = 1,00.
            </li>
            <li>
              <strong className="text-fg">Queda de tensão</strong> — a planilha usa |Z| = √(R²+X²), conservador. O
              aplicativo dimensiona com a fórmula da NBR / IEC: R·cosφ + X·senφ. O |Z| aparece no resultado só como
              comparação.
            </li>
            <li>
              <strong className="text-fg">Fator k</strong> — a planilha fixava k = 142. Usamos Tab. 37/40: 115 (PVC) e 143
              (HEPR).
            </li>
            <li>
              <strong className="text-fg">Métodos A1, A2 e C</strong> — ausentes na planilha; incluídos pela NBR.
            </li>
            <li>
              <strong className="text-fg">Seção mínima, PE, neutro e I² ≤ 1,45 Iz</strong> — não automatizados na planilha.
            </li>
            <li>
              <strong className="text-fg">B2 HEPR 4 e 6 mm²</strong> — 2 condutores menores que 3 condutores (35/45 e 44/58).
              Mantido como na fonte; tratar com cautela.
            </li>
          </ul>
        </Card>

        <Card title="Limites de queda — 6.2.7" context="O campo ΔV máx. deve seguir o trecho, não um valor único do projeto.">
          <p className="text-sm text-muted">
            4 % da origem da instalação até o ponto de utilização quando a origem é a concessionária. Se a origem for o
            secundário de transformador ou gerador do consumidor: 5 % em iluminação e 7 % nos demais usos.
          </p>
        </Card>

        <p className="text-help text-subtle">
          Ferramenta de apoio ao projetista. Não substitui a leitura da norma, o memorial assinado nem a verificação de
          catálogo do fabricante do cabo.
        </p>
        <p className="text-help text-subtle">{AUTHOR.line}</p>
      </div>
    </AppShell>
  );
}
