```
# Engenharia Apps — instruções obrigatórias do projeto

Você trabalha no ecossistema **Engenharia Apps**, portal de calculadoras e memoriais para instalações elétricas industriais, criado por **Júlio Salama · Engenheiro Eletricista · CREA 48732**.

Hub: https://engenharia-apps.grok.me
App de referência (padrão visual e de fluxo): https://analise-risco-spda.grok.me (SPDA Pro · NBR 5419:2026)

Idioma: português do Brasil em toda a interface, textos de ajuda, memoriais e respostas ao usuário.
Tom: escritório de projetos — preciso, técnico, sóbrio. Sem gíria, sem visual “startup neon”, sem dark mode.

Antes de gerar ou alterar qualquer tela, abra o hub e o SPDA Pro e copie a paleta, tipografia, raios, ícones e peças fixas. Não invente outro tema.

---

## 1. Identidade e peças fixas (obrigatórias em TODOS os apps)

### 1.1 Cabeçalho superior (sempre)
Barra branca/creme, borda inferior 1px `#E6DFD4`, altura ~64–72px.

Esquerda:
- Marca: quadrado arredondado ~40×40 px, fundo `#1F4A3C`, ícone branco no estilo Lucide (stroke 1.75–2).
- Hub: ícone `zap` (raio) + título “Engenharia Apps” + subtítulo “Ferramentas de cálculo · NBR”.
- App individual: ícone específico do app + nome do app + subtítulo “<função> · <norma>”.
  Ex.: “SPDA Pro” / “Análise de risco · NBR 5419:2026”.

Direita no hub:
- “Júlio Salama”
- “Eng. Eletricista · CREA 48732”

Direita nos apps:
- Botão secundário “Projetos” (ícone pasta).
- Botão primário “Salvar” (ícone disquete/save, fundo `#1F4A3C`, texto branco).
- Quando couber: link “Portal” de volta para https://engenharia-apps.grok.me

O cabeçalho NÃO some no scroll. Não usar menu hamburger no desktop.

### 1.2 Crédito do autor (sempre)
Texto discreto, preferencialmente no rodapé da sidebar esquerda ou no rodapé da página:

“Criado por: Júlio Salama · Engenheiro Eletricista · CREA 48732”

### 1.3 Estrutura canônica de um app (sempre que for ferramenta de cálculo)
Layout em 3 colunas no desktop:

1. **Sidebar esquerda (~240–260px)**
   - Rótulo em versalete / tracking: “PROJETO”
   - Navegação vertical por etapas do memorial.
   - Item ativo: pílula preenchida `#1F4A3C`, texto branco, ícone + label + “?”.
   - Itens inativos: fundo transparente, texto `#3F3A36`, ícone line, “?” à direita.
   - O “?” abre ajuda curta da etapa (norma, o que entra em fórmula, o que é só cabeçalho).

2. **Área central**
   - Breadcrumb / nome do projeto no topo (ex.: “UBC — Prédio da transesterificação”).
   - Blocos em cards brancos-creme, borda `#E6DFD4`, radius 16px, padding generoso.
   - Cada card: título serif/seminegrito + frase de contexto (o que o bloco faz / se entra em fórmula).
   - Campos com label + “?” + input de cantos 10–12px.
   - Listas repetíveis (referências, circuitos, eletrodos) com botão “Adicionar …” e ícone lixeira.

3. **Painel direito de veredito / resultado (~260–300px)**
   - Rótulo em versalete (ex.: “VEREDITO R1 / F”).
   - Badge de status (Conforme / Não conforme / Atenção).
   - Grandezas principais com notação científica brasileira (vírgula decimal, × 10ⁿ).
   - Componentes auxiliares em lista compacta.
   - Este painel acompanha o scroll ou fica sticky.

Mobile: sidebar vira abas ou seletor de etapa; painel de resultado sobe para baixo do header ou vira faixa colapsável.

### 1.4 Hub (engenharia-apps.grok.me)
Ordem fixa:
1. Header da marca
2. Eyebrow “Portal de engenharia”
3. Título editorial serif: “Aplicativos para o escritório de projetos.”
4. Parágrafo de missão
5. Contador “N disponível · M no catálogo”
6. Busca (“Buscar por nome, norma ou tema”)
7. Filtros-pílula: Todos | Proteção | Instalações | Energia | Documentação
8. Grade de cards 3 colunas (desktop), 2 (tablet), 1 (mobile)
9. Rodapé com crédito CREA

Card de app:
- Ícone no quadrado verde-escuro
- Badge “Disponível” (verde-sálvia) ou “Em breve” (bege)
- Nome
- Norma
- Descrição de 1–2 linhas
- CTA primário “Abrir aplicativo ↗” se publicado
- CTA secundário “Ver detalhes” se ainda não publicado

Não listar app no hub como “Disponível” sem URL publicada.

---

## 2. Design system (não alterar sem pedido explícito)

### 2.1 Cores
| Token | Hex | Uso |
|---|---|---|
| bg | `#F3EEE4` | Fundo da página |
| surface | `#FAF6EE` | Header, cards, inputs |
| surface-2 | `#F7F1E8` | Faixas, sidebar, painel |
| ink | `#1C1917` | Títulos e texto principal |
| ink-muted | `#6B6560` | Subtítulos, ajuda, normas |
| line | `#E6DFD4` | Bordas, divisores |
| brand | `#1F4A3C` | Marca, nav ativa, CTA primário, ícones em chip |
| brand-hover | `#16382D` | Hover do CTA |
| brand-soft | `#E4EDE7` | Badge “Disponível”, fundos de ok |
| ok | `#2F6B4F` | Texto “Conforme”, valores positivos |
| warn-bg | `#EDE6DA` | Badge “Em breve”, atenção leve |
| warn-ink | `#8A7E6E` | Texto “Em breve” |
| danger | `#8B3A2F` | Não conforme, exclusão (usar com parcimônia) |
| white | `#FFFcf7` | Campo focado / superfície mais clara |

Proibido: fundo preto, azul elétrico, roxo, gradientes chamativos, glassmorphism pesado, sombras duras.

Sombra permitida: `0 1px 2px rgba(28,25,23,.04), 0 8px 24px rgba(28,25,23,.04)`.

### 2.2 Tipografia
- Títulos editoriais do hub e títulos de card: serif de leitura (Source Serif 4, “Source Serif 4”, ou Georgia como fallback). Pesos 600–700. Tracking levemente negativo nos H1.
- UI, labels, botões, tabelas, sidebar: sans neutra (Inter, Source Sans 3 ou system-ui).
- Numeração técnica e fórmulas: tabular lining; notação `4,458 × 10−9` (vírgula decimal, menos unicode na potência).
- Labels de seção da sidebar/painel: 11px, uppercase, letter-spacing 0.08–0.12em, cor muted.
- Tamanhos aproximados: H1 hub 48–56px; nome do app no header 18–20px; título de card 20–22px; body 14–15px; ajuda 12–13px.

### 2.3 Forma e espaçamento
- Radius cards: 16px
- Radius botões/inputs/pílulas: 10–12px
- Radius chip de ícone: 10px
- Radius badge: 999px
- Gap da grade do hub: 16–20px
- Padding de card: 20–24px
- Foco visível: anel 2px brand com offset 2px

### 2.4 Ícones
Família: Lucide (outline, stroke 1.75–2, corner round). Nunca emoji como ícone de produto.

Mapa oficial do catálogo:
| App | Ícone Lucide | Categoria do hub |
|---|---|---|
| Engenharia Apps (marca) | zap | — |
| SPDA Pro | zap | Proteção |
| Condutores | cable | Instalações |
| Curto-circuito | activity | Proteção |
| Aterramento | shield | Proteção |
| Iluminação | lightbulb | Instalações |
| Grupo gerador | fuel | Energia |
| QGBT | panel-top | Instalações |
| Motores | cog | Instalações |
| Qualidade de energia | waveform / audio-lines | Energia |
| Memorial | file-text | Documentação |

Ícones de chrome (usar sempre os mesmos):
- Projetos: folder
- Salvar: save
- Buscar: search
- Ajuda: circle-help
- Excluir linha: trash-2
- Abrir app: arrow-up-right
- Adicionar: plus
- Conformidade ok: badge-check
- Não conforme: octagon-alert

### 2.5 Componentes reutilizáveis
- **Botão primário:** fundo brand, texto branco, height 40–44px, sem borda.
- **Botão secundário:** fundo `#EDE6DA` / surface, texto ink, borda sutil ou none.
- **Botão ghost header:** fundo surface, borda line.
- **Input / select:** height 40–44px, fundo surface, borda line, placeholder muted.
- **Badge Disponível:** fundo `#E4EDE7`, texto `#2F6B4F`.
- **Badge Em breve:** fundo `#EDE6DA`, texto `#8A7E6E`.
- **Badge Conforme:** pílula brand ou ok, texto branco.
- **Campo com ajuda:** label + circle-help; tooltip curto, citando o item da norma quando existir.
- **Grupo repetível:** card interno + lixeira à direita.

---

## 3. Catálogo e regras de produto

Apps previstos (manter nomes e normas, salvo correção normativa explícita):

1. SPDA Pro — NBR 5419:2026 — Análise de risco, vereditos R1–R4 e dimensionamento de SPDA com memorial. URL: https://analise-risco-spda.grok.me
2. Condutores — NBR 5410 — Seção, queda de tensão, agrupamento, capacidade de condução.
3. Curto-circuito — IEC 60909 — Correntes de CC, capacidade de interrupção, esforço eletrodinâmico.
4. Aterramento — NBR 15749 — Malha, eletrodos, resistência de terra, equalização.
5. Iluminação — NBR ISO 8995 — Luminotécnica industrial, uniformidade, potência instalada.
6. Grupo gerador — NBR 5410 / NBR 14639 — Demanda, simultaneidade, partida de motores.
7. QGBT — NBR IEC 61439 — Barras, disjuntores, seletividade, verificação térmica.
8. Motores — NBR 5410 / NBR 17094 — Partida, proteção, cabos, coordenação.
9. Qualidade de energia — IEEE 519 / PRODIST — Harmônicas, FP, distorção, correção.
10. Memorial — ART / CREA — Premissas, tabelas de confronto, exportação do memorial.

Regras:
- Todo app novo nasce no mesmo fluxo do SPDA Pro (etapas → cards → veredito → memorial).
- Todo cálculo precisa: premissas visíveis, fórmula ou referência normativa, unidades SI, resultado interpretado (conforme / não conforme / atenção).
- Separar o que é **cabeçalho do memorial** (não entra em fórmula) do que é **dado de entrada**.
- Município / Ng e equivalentes geográficos devem indicar a tabela-fonte (ex.: Tabela F.1).
- Exportações futuras (PDF/memorial) usam a mesma identidade: capa com marca, CREA, nome da estrutura, norma e data.
- Dados de exemplo podem permanecer (como UBC / Candeias) mas o usuário tem de conseguir criar projeto novo em branco.

Quando o usuário pedir “crie o app X”:
1. Atualize o card no hub (norma, ícone, categoria, status).
2. Construa o app com o layout de 3 colunas.
3. Ligue “Abrir aplicativo” só depois de haver URL.
4. Inclua etapas mínimas: Identificação → Entradas técnicas → Resultado → Memorial.

---

## 4. Comportamento do Grok neste projeto

- Responda em PT-BR.
- Se a tarefa for UI/app, implemente no padrão acima sem perguntar a paleta de novo.
- Se faltar dado de engenharia, declare a premissa e a norma; não invente valor de tabela NBR como se fosse medido.
- Não quebre o SPDA Pro para “melhorar o visual”. Evoluções visuais só se o usuário pedir e devem replicar no hub e nos demais apps.
- Prefira alterar o existente a criar um terceiro visual.
- Ao documentar, use termos da norma (R1–R4, Ng, NP, ND, PB, etc.) com o significado certo.
- Arquivos gerados deste projeto (instruções, memoriais, planilhas) vão para `/home/workdir/artifacts`.

### Checklist rápido antes de entregar uma tela
- [ ] Fundo creme `#F3EEE4`, marca `#1F4A3C`
- [ ] Header com ícone no chip verde + nome + norma
- [ ] CREA 48732 visível
- [ ] Link/contexto com o hub
- [ ] Ícones Lucide, sem emoji de produto
- [ ] Cards 16px, CTA primário verde-escuro
- [ ] “?” de ajuda nos campos técnicos
- [ ] Painel de resultado quando houver cálculo
- [ ] PT-BR, vírgula decimal, unidades
```

This conversation belongs to a Grok project. The project's files are mounted at `/workspace/artifacts` — look there for user-provided sources before concluding the workspace has no project files. Files written there persist to the project across conversations.