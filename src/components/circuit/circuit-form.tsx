import { MOTORS, METHOD_INFO, FORMATION_INFO, METHODS, FORMATIONS, findMotor, findMotorByCv } from "@/lib/nbr5410/tables";
import { consultPowerKw } from "@/lib/nbr5410/calculate";
import { fmt } from "@/lib/nbr5410/format";
import type {
  BreakerCurve,
  CircuitInput,
  CircuitKind,
  ConductorMetal,
  Formation,
  IdrType,
  InstallMethod,
  Insulation,
  LoadType,
  Phases,
  StartMethod,
} from "@/lib/nbr5410/types";
import { Card } from "@/components/ui/card";
import { Field, Input, Readout, Select, Textarea } from "@/components/ui/field";
import { ICU_KA, lightingDemandW, START_LABEL, tugDemandVa } from "@/lib/nbr5410/extras";

const KINDS: CircuitKind[] = ["alimentador", "motor", "iluminacao", "tug", "tue", "comando"];
const KIND_L: Record<CircuitKind, string> = {
  alimentador: "Alimentador",
  motor: "Motor",
  iluminacao: "Iluminação",
  tug: "TUG — tomadas de uso geral",
  tue: "TUE — tomadas de uso específico",
  comando: "Comando / sinal",
};

const INFO = {
  tag: "Identificação do circuito na lista e na memória de cálculo (ex.: AL-01, M-01, IL-01).",
  kind: "Classificação NBR 5410. Define a seção mínima (Tab. 47): iluminação 1,5 mm²; TUG, TUE, motor e alimentador 2,5 mm²; comando 0,5 mm².\n\nTUG — tomadas de uso geral: equipamentos portáteis até 10 A (TV, computador, carregador). Demanda típica 100 VA por ponto; em cozinha, área de serviço e similares, 3 pontos a 600 VA e o restante a 100 VA.\n\nTUE — tomadas de uso específico: circuito dedicado a um aparelho (chuveiro, ar-condicionado, forno, máquina de lavar), em geral acima de 10 A.",
  from: "Origem do trecho (quadro, CCM, barramento). Só identificação — não entra em fórmula.",
  to: "Destino do trecho (carga, quadro a jusante). Só identificação — não entra em fórmula.",
  parent: "Trecho a montante na queda acumulada (6.2.7). A ΔV deste circuito soma com a do alimentador até a origem.",
  metal: "Cobre (tabelas NBR) ou alumínio (Imax ≈ 0,78 da tabela Cu; k = 76 PVC / 94 HEPR; seção mínima 16 mm²).",
  h3: "Parcela de 3ª harmônica da corrente de fase. ≥ 15 %: fator 0,86 e neutro carregado (6.2.6). > 33 %: dimensionar também pelo neutro.",
  soil: "Tabela 41. Referência 2,5 K·m/W = 1,00. Só no método D.",
  bends: "Curvas de 90° no trecho de eletroduto sem caixa. Máximo 3 (270°). Cada curva reduz 3 m do limite de 15 m (interno).",
  tugN: "Número de tomadas de uso geral. Demanda NBR: 100 VA por ponto; em cozinha/área de serviço, até 3 pontos a 600 VA.",
  area: "Área iluminada em m². Demanda típica residencial 15 W/m² (ajuste no kW/kVA se o projeto usar outro índice).",
  loadType:
    "Grandeza usada para obter a corrente de projeto Ib.\n\n• kVA — potência aparente. Ib = S / (√3·V) trifásico ou S/V monofásico. FP e η não entram em Ib.\n• kW — potência ativa. Ib = P / (√3·V·FP·η).\n• cv — 1 cv = 736 W. Ib como em kW.\n• Corrente Ib — informa a corrente diretamente.",
  kva: "Potência aparente S em kVA. Em trifásico, Ib = 1000·S / (√3·V). O kW ao lado é só consulta (S × FP × η em motor, S × FP nos demais).",
  kw: "Potência ativa em kW. Em motor, o catálogo 4 pólos 60 Hz preenche FP, rendimento, carcaça e proteção. Ib = P / (√3·V·FP·η).",
  kwConsult:
    "Valor apenas informativo, calculado a partir da entrada (kVA ou cv). Não altera o dimensionamento — a corrente Ib continua vindo da grandeza escolhida em Entrada.",
  cv: "Potência em cavalos-vapor. 1 cv = 736 W, portanto kW = cv × 0,736. O kW ao lado é só consulta. Ib usa o cv informado.",
  ib: "Corrente de projeto informada diretamente, em amperes. Substitui o cálculo a partir da potência.",
  voltage: "Tensão nominal do circuito. Trifásico: tensão fase-fase. Monofásico: fase-neutro.",
  phases: "1 = F+N; 2 = duas fases; 3 = trifásico. Define o fator k da queda (2 ou √3) e o número de condutores carregados (2 ou 3) nas tabelas de ampacity.",
  pf: "Fator de potência cos φ da carga. Entra em Ib quando a entrada é kW ou cv, e na queda ΔV = k·Ib·L·(R cosφ + X senφ).",
  eta: "Rendimento η. Só reduz Ib quando a entrada é kW ou cv (potência no eixo do motor). Com kVA a corrente já é aparente e η não entra.",
  length: "Comprimento do trecho, em metros. Entra na queda de tensão e na impedância usada para o Icc no ponto de utilização.",
  method: "Método de instalação da NBR 5410 (Tab. 33 a 36). Define a capacidade de condução Imax do cabo.",
  insulation: "PVC/PVC 70 °C (Sintenax, k térmico = 115) ou HEPR/EPR 90 °C (Eprotenax, k = 143). Afeta Imax, Ft e a suportabilidade ao curto (Icw = k·S/√t).",
  formation: "Unipolar ou multipolar. Define a coluna de ampacity, Rca/XL e o número de cabos no eletroduto.",
  temp: "Temperatura ambiente (ar) ou do solo (método D). Fator Ft da Tab. 40. Referência: 30 °C no ar e 20 °C no solo (Ft = 1,00).",
  nCirc: "Número de circuitos agrupados. Fator Fa da Tab. 13 (ou Tab. 16/17 se dutos enterrados).",
  layers: "Tab. 14 — fator adicional quando há mais de uma camada de cabos nos métodos C, E e F.",
  buried: "Agrupamento em dutos enterrados: Tab. 16 (multipolares) ou Tab. 17 (unipolares em dutos individuais), em vez da Tab. 13.",
  spacing: "Distância entre os dutos enterrados. Quanto maior o espaçamento, menor o efeito térmico do agrupamento.",
  dropMax:
    "Limite da NBR 5410 6.2.7: 4 % da origem da instalação até o ponto de uso quando a origem é a concessionária. Se a origem for transformador ou gerador do consumidor: 5 % em iluminação e 7 % nos demais usos.",
  isc: "Corrente de curto-circuito simétrica no início do trecho, em kA. Com a impedância do cabo, o app estima o Icc no ponto e compara com Icw do condutor.",
  iscT: "Duração do defeito, em segundos, usada em Icw = k·S/√t (NBR 5410 5.3.4). Típico 0,1 s ou o tempo de atuação da proteção.",
  reserve:
    "Em motores, se 1/(Fa·Ft) for menor que 1,25, aplica-se 1,25 como na planilha original (margem de partida). Pode desligar e usar só Fa e Ft.",
  notes: "Observações livres. Aparecem na memória de cálculo. Não entram em fórmula.",
  start: "Tipo de partida. Define Ist/Ib: direta 7,5 · Y-Δ 2,5 · soft-starter 3 · inversor 1,2. A seção cresce se ΔV na partida passar do teto.",
  startDrop: "Teto de queda nos bornes na partida. Prática usual 10 % (NBR 5410 6.2.7 trata do regime; o teto de partida é critério de projeto).",
  curve: "Curva IEC 60898. Ia (limite superior): B = 5·In, C = 10·In, D = 20·In. Usada no desligamento TN (5.7.3).",
  icu: "Poder de interrupção do disjuntor na origem do trecho. Deve ser ≥ Icc informado. 0 = menor comercial que atende.",
  idr: "Dispositivo DR. 30 mA para proteção de pessoas (áreas molhadas, TUG). 300 mA para proteção contra incêndio. Esquema TT exige IDR.",
  idrType: "Tipo AC só senoidal. Tipo A para cargas eletrônicas. Tipo F/B com inversor ou 3ª harmônica elevada.",
  fd: "Fator de demanda no quadro de cargas. 0 = automático (1,00; em motores do mesmo pai, o maior 1,00 e os demais 0,75).",
};

export function CircuitForm({
  value,
  onChange,
  circuits,
}: {
  value: CircuitInput;
  onChange: (patch: Partial<CircuitInput>) => void;
  circuits?: CircuitInput[];
}) {
  function set<K extends keyof CircuitInput>(key: K, v: CircuitInput[K]) {
    onChange({ [key]: v } as Partial<CircuitInput>);
  }

  function applyMotor(kw: number) {
    const m = findMotor(kw);
    if (!m) {
      set("powerKw", kw);
      return;
    }
    onChange({
      kind: "motor",
      loadType: "kw",
      powerKw: m.kw,
      powerCv: m.cv,
      pf: m.pf,
      efficiency: m.eff,
    });
  }

  const consult = consultPowerKw(value);
  const catalogFromCv = value.loadType === "cv" ? findMotorByCv(value.powerCv) : undefined;
  const catalogFromKw = consult ? findMotor(consult.kw) : undefined;
  const catalogNote = catalogFromCv ?? catalogFromKw;

  return (
    <div className="flex flex-col gap-6">
      <Card
        title="Identificação"
        context="Cabeçalho do trecho na memória. Só o tipo entra em fórmula (seção mínima, Tab. 47)."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Circuito" info={INFO.tag}>
            <Input value={value.tag} onChange={(e) => set("tag", e.target.value)} />
          </Field>
          <Field label="Tipo" info={INFO.kind}>
            <Select value={value.kind} onChange={(e) => set("kind", e.target.value as CircuitKind)}>
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {KIND_L[k]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="De" info={INFO.from}>
            <Input value={value.from} onChange={(e) => set("from", e.target.value)} />
          </Field>
          <Field label="Para" info={INFO.to}>
            <Input value={value.to} onChange={(e) => set("to", e.target.value)} />
          </Field>
          <Field label="Trecho a montante" info={INFO.parent} className="sm:col-span-2">
            <Select
              value={value.parentId ?? ""}
              onChange={(e) => set("parentId", e.target.value || null)}
            >
              <option value="">Origem da instalação (este é o primeiro trecho)</option>
              {(circuits ?? []).filter((c) => c.id !== value.id).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tag} · {c.from} → {c.to}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Fator de demanda" info={INFO.fd}>
            <Select
              value={String(value.demandFactor ?? 0)}
              onChange={(e) => set("demandFactor", Number(e.target.value))}
            >
              <option value="0">Automático</option>
              <option value="1">1,00</option>
              <option value="0.9">0,90</option>
              <option value="0.8">0,80</option>
              <option value="0.75">0,75</option>
              <option value="0.6">0,60</option>
              <option value="0.5">0,50</option>
              <option value="0.4">0,40</option>
            </Select>
          </Field>
        </div>
      </Card>

      {value.kind === "motor" ? (
        <Card
          title="Partida do motor"
          context="A seção também atende ΔV nos bornes durante Ist. Direta usa 7,5·Ib e cosφ 0,35."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Tipo de partida" info={INFO.start}>
              <Select
                value={value.startMethod ?? "dol"}
                onChange={(e) => set("startMethod", e.target.value as StartMethod)}
              >
                {(Object.keys(START_LABEL) as StartMethod[]).map((k) => (
                  <option key={k} value={k}>
                    {START_LABEL[k]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="ΔV máx. partida (%)" info={INFO.startDrop}>
              <Select
                value={String(value.maxStartDropPct || 10)}
                onChange={(e) => set("maxStartDropPct", Number(e.target.value))}
              >
                <option value="7">7 %</option>
                <option value="10">10 % (usual)</option>
                <option value="15">15 %</option>
              </Select>
            </Field>
          </div>
        </Card>
      ) : null}

      <Card title="Carga" context="Potência, tensão e comprimento. Definem a corrente de projeto Ib e a queda de tensão.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Entrada" info={INFO.loadType}>
            <Select
              value={value.loadType}
              onChange={(e) => {
                const loadType = e.target.value as LoadType;
                const patch: Partial<CircuitInput> = { loadType };
                if (loadType === "cv" && !(value.powerCv > 0)) {
                  const m = findMotor(value.powerKw);
                  patch.powerCv = m ? m.cv : Number((value.powerKw / 0.736).toFixed(2));
                }
                if (loadType === "kva" && !(value.powerKva > 0) && value.powerKw > 0) {
                  const pf = Math.max(0.1, value.pf || 1);
                  const eta = value.kind === "motor" ? Math.max(0.3, value.efficiency || 1) : 1;
                  patch.powerKva = Number((value.powerKw / (pf * eta)).toFixed(2));
                }
                onChange(patch);
              }}
            >
              <option value="kva">kVA</option>
              <option value="kw">kW</option>
              <option value="cv">cv</option>
              <option value="ib">Corrente Ib</option>
            </Select>
          </Field>
          {value.loadType === "kva" ? (
            <Field label="Potência (kVA)" info={INFO.kva}>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={value.powerKva || ""}
                onChange={(e) => set("powerKva", Number(e.target.value))}
              />
            </Field>
          ) : null}
          {value.loadType === "kw" ? (
            value.kind === "motor" ? (
              <Field label="Potência (kW · cv)" info={INFO.kw}>
                <Select
                  value={findMotor(value.powerKw) ? String(value.powerKw) : "custom"}
                  onChange={(e) => {
                    if (e.target.value === "custom") return;
                    applyMotor(Number(e.target.value));
                  }}
                >
                  <option value="custom">Outra…</option>
                  {MOTORS.map((m) => (
                    <option key={m.kw} value={m.kw}>
                      {m.kw} kW · {m.cv} cv
                    </option>
                  ))}
                </Select>
              </Field>
            ) : (
              <Field label="Potência (kW)" info={INFO.kw}>
                <Input
                  type="number"
                  step="0.1"
                  value={value.powerKw || ""}
                  onChange={(e) => set("powerKw", Number(e.target.value))}
                />
              </Field>
            )
          ) : null}
          {value.loadType === "kw" && value.kind === "motor" && !findMotor(value.powerKw) ? (
            <Field label="kW manual" info={INFO.kw}>
              <Input
                type="number"
                step="0.1"
                value={value.powerKw || ""}
                onChange={(e) => set("powerKw", Number(e.target.value))}
              />
            </Field>
          ) : null}
          {value.loadType === "cv" ? (
            <Field label="Potência (cv)" info={INFO.cv}>
              <Input
                type="number"
                step="0.1"
                value={value.powerCv || ""}
                onChange={(e) => set("powerCv", Number(e.target.value))}
              />
            </Field>
          ) : null}
          {consult ? (
            <Field label="Potência (kW) — consulta" info={INFO.kwConsult} className="col-span-2">
              <Readout>
                <span className="font-mono tabular-nums">{fmt(consult.kw, 2)} kW</span>
                <span className="text-xs text-muted">
                  {consult.source}
                  {catalogNote ? ` · catálogo ${catalogNote.kw} kW · ${catalogNote.cv} cv · carcaça ${catalogNote.frame}` : ""}
                </span>
              </Readout>
            </Field>
          ) : null}
          {value.loadType === "ib" ? (
            <Field label="Ib (A)" info={INFO.ib}>
              <Input
                type="number"
                step="0.1"
                value={value.ibManual || ""}
                onChange={(e) => set("ibManual", Number(e.target.value))}
              />
            </Field>
          ) : null}
          <Field label="Tensão (V)" info={INFO.voltage}>
            <Select
              value={String(value.voltage)}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "other") return;
                set("voltage", Number(v));
              }}
            >
              {[110, 127, 220, 380, 440, 460, 480].map((v) => (
                <option key={v} value={v}>
                  {v} V
                </option>
              ))}
              {!([110, 127, 220, 380, 440, 460, 480] as number[]).includes(value.voltage) ? (
                <option value={value.voltage}>{value.voltage} V</option>
              ) : null}
            </Select>
          </Field>
          <Field label="Fases" info={INFO.phases}>
            <Select value={String(value.phases)} onChange={(e) => set("phases", Number(e.target.value) as Phases)}>
              <option value="1">1 (F+N)</option>
              <option value="2">2 (2F)</option>
              <option value="3">3 (trifásico)</option>
            </Select>
          </Field>
          <Field label="Fator de potência" info={INFO.pf}>
            <Input
              type="number"
              step="0.01"
              min="0.1"
              max="1"
              value={value.pf.toFixed(2)}
              onChange={(e) => set("pf", Number(e.target.value))}
            />
          </Field>
          <Field label="Rendimento η" info={INFO.eta}>
            <Input
              type="number"
              step="0.01"
              min="0.3"
              max="1"
              value={value.efficiency.toFixed(2)}
              onChange={(e) => set("efficiency", Number(e.target.value))}
            />
          </Field>
          <Field label="Comprimento (m)" info={INFO.length}>
            <Input
              type="number"
              step="1"
              min="0"
              value={value.lengthM}
              onChange={(e) => set("lengthM", Number(e.target.value))}
            />
          </Field>
        </div>
      </Card>

      {value.kind === "tug" || value.kind === "iluminacao" ? (
        <Card title="Demanda" context="Atalho da NBR para montar Ib.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {value.kind === "tug" ? (
              <>
                <Field label="Pontos TUG" info={INFO.tugN}>
                  <Input
                    type="number"
                    min="0"
                    value={value.tugPoints || ""}
                    onChange={(e) => {
                      const tugPoints = Number(e.target.value);
                      onChange({
                        tugPoints,
                        loadType: "kva",
                        powerKva: tugDemandVa(tugPoints, value.tugWetPoints ?? 0) / 1000,
                      });
                    }}
                  />
                </Field>
                <Field label="Pontos 600 VA" info={INFO.tugN}>
                  <Input
                    type="number"
                    min="0"
                    max="3"
                    value={value.tugWetPoints || ""}
                    onChange={(e) => {
                      const tugWetPoints = Number(e.target.value);
                      onChange({
                        tugWetPoints,
                        loadType: "kva",
                        powerKva: tugDemandVa(value.tugPoints, tugWetPoints) / 1000,
                      });
                    }}
                  />
                </Field>
                {value.tugPoints > 0 ? (
                  <p className="text-help text-muted sm:col-span-2">
                    Demanda {tugDemandVa(value.tugPoints, value.tugWetPoints ?? 0)} VA aplicada como kVA.
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <Field label="Área (m²)" info={INFO.area}>
                  <Input
                    type="number"
                    min="0"
                    value={value.areaM2 || ""}
                    onChange={(e) => {
                      const areaM2 = Number(e.target.value);
                      onChange({
                        areaM2,
                        loadType: "kw",
                        powerKw: lightingDemandW(areaM2) / 1000,
                      });
                    }}
                  />
                </Field>
                {value.areaM2 > 0 ? (
                  <p className="text-help text-muted">15 W/m² → {lightingDemandW(value.areaM2) / 1000} kW aplicado.</p>
                ) : null}
              </>
            )}
          </div>
        </Card>
      ) : null}

      <Card
        title="Instalação"
        context="Método NBR, isolação e agrupamento. Definem Imax, Fa e Ft (Tab. 33–36, 13, 14, 40)."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Método NBR" info={INFO.method} className="sm:col-span-2">
            <Select value={value.method} onChange={(e) => set("method", e.target.value as InstallMethod)}>
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {METHOD_INFO[m].name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Isolação" info={INFO.insulation}>
            <Select value={value.insulation} onChange={(e) => set("insulation", e.target.value as Insulation)}>
              <option value="HEPR">HEPR / EPR 90 °C</option>
              <option value="PVC">PVC/PVC 70 °C</option>
            </Select>
          </Field>
          <Field label="Condutor" info={INFO.metal}>
            <Select value={value.conductor ?? "Cu"} onChange={(e) => set("conductor", e.target.value as ConductorMetal)}>
              <option value="Cu">Cobre</option>
              <option value="Al">Alumínio</option>
            </Select>
          </Field>
          <Field label="Formação" info={INFO.formation}>
            <Select value={value.formation} onChange={(e) => set("formation", e.target.value as Formation)}>
              {FORMATIONS.map((f) => (
                <option key={f} value={f}>
                  {f} · {FORMATION_INFO[f].label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Temp. (°C)" info={INFO.temp}>
            <Input type="number" value={value.tempC} onChange={(e) => set("tempC", Number(e.target.value))} />
          </Field>
          <Field label="Nº de circuitos" info={INFO.nCirc}>
            <Input
              type="number"
              min="1"
              max="20"
              value={value.nCircuits}
              onChange={(e) => onChange({ nCircuits: Number(e.target.value), groupingOverride: null })}
            />
          </Field>
          {value.groupingOverride ? (
            <p className="text-help text-muted sm:col-span-2">
              Fa informado {fmt(value.groupingOverride, 2)} (eletrocalha ou valor manual).{" "}
              <button type="button" className="underline" onClick={() => set("groupingOverride", null)}>
                usar Tabela 13
              </button>
            </p>
          ) : null}
          <Field label="Camadas (Tab. 14)" info={INFO.layers}>
            <Select value={String(value.layers)} onChange={(e) => set("layers", Number(e.target.value))}>
              <option value="1">1 (não aplica)</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4 ou 5</option>
              <option value="6">6 a 8</option>
              <option value="9">9 ou mais</option>
            </Select>
          </Field>
          {value.method === "D" ? (
            <>
              <Field label="Dutos enterrados" info={INFO.buried}>
                <Select
                  value={value.buriedDucts ? "1" : "0"}
                  onChange={(e) => set("buriedDucts", e.target.value === "1")}
                >
                  <option value="0">Agrupamento Tab. 13</option>
                  <option value="1">Tab. 16 / 17</option>
                </Select>
              </Field>
              <Field label="Espaçamento" info={INFO.spacing}>
                <Select
                  value={String(value.burySpacingM)}
                  onChange={(e) => set("burySpacingM", Number(e.target.value) as 0 | 0.25 | 0.5 | 1)}
                >
                  <option value="0">Nulo</option>
                  <option value="0.25">0,25 m</option>
                  <option value="0.5">0,50 m</option>
                  <option value="1">1,0 m</option>
                </Select>
              </Field>
              <Field label="ρ solo (K·m/W)" info={INFO.soil} className="sm:col-span-2">
                <Select
                  value={String(value.soilRho ?? 2.5)}
                  onChange={(e) => set("soilRho", Number(e.target.value))}
                >
                  <option value="1">1,0 · Fs 1,18</option>
                  <option value="1.5">1,5 · Fs 1,10</option>
                  <option value="2">2,0 · Fs 1,05</option>
                  <option value="2.5">2,5 · Fs 1,00 (referência)</option>
                  <option value="3">3,0 · Fs 0,96</option>
                </Select>
              </Field>
            </>
          ) : null}
          {(value.method === "A1" || value.method === "A2" || value.method === "B1" || value.method === "B2") && (
            <Field label="Curvas 90° sem caixa" info={INFO.bends} className="sm:col-span-2">
              <Select
                value={String(value.conduitBends ?? 0)}
                onChange={(e) => set("conduitBends", Number(e.target.value))}
              >
                <option value="0">0</option>
                <option value="1">1 (−3 m)</option>
                <option value="2">2 (−6 m)</option>
                <option value="3">3 (−9 m · máximo)</option>
              </Select>
            </Field>
          )}
        </div>
        <p className="mt-3 text-help text-muted">{METHOD_INFO[value.method].desc}</p>
      </Card>

      <Card
        title="Queda de tensão e curto-circuito"
        context="Limites da NBR 5410 6.2.7. A fórmula de dimensionamento é R cosφ + X senφ; |Z| só compara."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="ΔV máx. (%)" info={INFO.dropMax}>
            <Select
              value={String(value.maxDropPct)}
              onChange={(e) => set("maxDropPct", Number(e.target.value))}
            >
              <option value="3">3 %</option>
              <option value="4">4 % (padrão NBR)</option>
              <option value="5">5 % (ilum. em transformador)</option>
              <option value="7">7 % (outras, transformador)</option>
            </Select>
          </Field>
          <Field label="Icc origem (kA)" info={INFO.isc}>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={value.iscKa}
              onChange={(e) => set("iscKa", Number(e.target.value))}
            />
          </Field>
          <Field label="Tempo Icc (s)" info={INFO.iscT}>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={value.iscTimeS.toFixed(3)}
              onChange={(e) => set("iscTimeS", Number(e.target.value))}
            />
          </Field>
          <Field label="3ª harmônica (%)" info={INFO.h3}>
            <Select
              value={String(value.harmonic3Pct ?? 0)}
              onChange={(e) => set("harmonic3Pct", Number(e.target.value))}
            >
              <option value="0">0 % (desprezível)</option>
              <option value="15">15 %</option>
              <option value="25">25 %</option>
              <option value="33">33 %</option>
              <option value="45">45 %</option>
              <option value="60">60 %</option>
            </Select>
          </Field>
          <Field label="Fator de reserva (motores)" info={INFO.reserve} className="sm:col-span-2">
            <Select
              value={value.reserveEnabled ? "1" : "0"}
              onChange={(e) => set("reserveEnabled", e.target.value === "1")}
            >
              <option value="1">1,25 se 1/(Fa·Ft) menor que 1,25 (planilha)</option>
              <option value="0">Somente Fa e Ft</option>
            </Select>
          </Field>
          <Field label="Curva do disjuntor" info={INFO.curve}>
            <Select
              value={value.breakerCurve ?? (value.kind === "motor" ? "D" : "C")}
              onChange={(e) => set("breakerCurve", e.target.value as BreakerCurve)}
            >
              <option value="B">B · Ia = 5·In</option>
              <option value="C">C · Ia = 10·In</option>
              <option value="D">D · Ia = 20·In</option>
            </Select>
          </Field>
          <Field label="Icu (kA)" info={INFO.icu}>
            <Select value={String(value.icuKa ?? 0)} onChange={(e) => set("icuKa", Number(e.target.value))}>
              <option value="0">Automático (menor ≥ Icc)</option>
              {ICU_KA.map((k) => (
                <option key={k} value={k}>
                  {String(k).replace(".", ",")} kA
                </option>
              ))}
            </Select>
          </Field>
          <Field label="IDR IΔn" info={INFO.idr}>
            <Select
              value={String(value.idrMa ?? 0)}
              onChange={(e) => {
                const idrMa = Number(e.target.value);
                onChange({
                  idrMa,
                  idrType: idrMa === 0 ? "none" : value.idrType === "none" || !value.idrType ? "A" : value.idrType,
                });
              }}
            >
              <option value="0">Sem IDR</option>
              <option value="30">30 mA (pessoas)</option>
              <option value="100">100 mA</option>
              <option value="300">300 mA (incêndio)</option>
            </Select>
          </Field>
          {(value.idrMa ?? 0) > 0 ? (
            <Field label="Tipo do IDR" info={INFO.idrType}>
              <Select value={value.idrType ?? "A"} onChange={(e) => set("idrType", e.target.value as IdrType)}>
                <option value="AC">AC</option>
                <option value="A">A</option>
                <option value="F">F</option>
                <option value="B">B</option>
              </Select>
            </Field>
          ) : null}
        </div>
        <p className="mt-3 text-help text-muted">
          Queda de tensão pela NBR 5410: ΔV = k · Ib · L · (R cosφ + X senφ). O valor |Z| aparece no veredito só como
          comparação.
        </p>
        <Field label="Notas" info={INFO.notes} className="mt-3">
          <Textarea value={value.notes} onChange={(e) => set("notes", e.target.value)} rows={2} />
        </Field>
      </Card>
    </div>
  );
}
