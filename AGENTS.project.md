# Engenharia Apps — instruções de projeto (modelo)

Copiar este arquivo (ou o conteúdo) para as instruções de qualquer app novo da suíte.\
Referência visual e de fluxo: **SPDA Pro** (NBR 5419:2026).

Hub: https://engenharia-apps.vercel.app\
Autor: **Júlio Salama · Engenheiro Eletricista · CREA 48732**

Antes de desenhar qualquer tela, abrir o hub e o SPDA Pro e **copiar** paleta, tipografia, raios, ícones e peças fixas. Não inventar outro tema.

---

## 0. Tom e idioma

- Português do Brasil em toda a interface, ajuda, memoriais e respostas ao usuário.
- Escritório de projetos: preciso, técnico, sóbrio.
- Sem gíria, sem visual “startup neon”, sem dark mode, sem gradientes chamativos.
- Números no padrão BR (vírgula decimal, × 10ⁿ quando científico).

---

## 1. Paleta (obrigatória)

Usar tokens CSS. Não espalhar hex em `className`.

Token

Hex

Uso

Fundo (`background`)

`#F3EEE4`

Página

Superfície (`card`, `paper`)

`#FAF6EE`

Cards, inputs

Marca (`primary`)

`#1F4D45`

Botão principal, item ativo, ícone-marca

Texto da marca

`#F3EEE4`

Texto sobre primary

Borda (`border`, `input`)

`#DDD4C4`

Linhas, inputs

Texto (`foreground`, `ink`)

`#1C1A16`

Títulos e corpo

Secundário (`muted-foreground`)

`#6B6458`

Ajuda, crédito

Destaque suave (`muted`)

`#EEE6D8`

Hover, faixas

Conforme (`ok`)

`#2F6B4F`

Badge positivo

Atenção (`warn`)

`#7A6248`

Badge de aviso

Falha (`destructive`)

`#8F2D2D`

Não conforme

`theme-color`

`#1F4D45`

Aba do navegador

Raios: 6 / 10 / 16 / 22 px (`sm` / `md` / `lg` / `xl`). Cards usam **16 px**. Inputs **10 px**.

---

## 2. Tipografia (obrigatória)

Google Fonts:

```
Source Sans 3 (400, 500, 600, 700) — UI, 16 px no body
Source Serif 4 (500, 600, 700) — títulos (h1–h3, nome do app, cards)
```

Não usar Fraunces nem IBM Plex.

Peça

Fonte

Tamanho

Corpo, campos, botões, nav

Source Sans 3

16 px

Nome do app no header

Source Serif 4

\~18 px

Subtítulo do app

Source Sans 3

13 px, cinza `#1C1A16` \~80%

Títulos de card

Source Serif 4

\~18 px

Números de cálculo

`ui-monospace` / Consolas

10–12 px, tabular

Colar no Word

Calibri, 11 pt

só no HTML da memória

CSS:

```css
--font-sans: "Source Sans 3", "Segoe UI", system-ui, sans-serif;
--font-display: "Source Serif 4", Georgia, "Times New Roman", serif;
--font-mono: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
```

---

## 3. Ícones e marcas

- Ícones de interface: **Lucide**, traço \~1.75–2, tamanho 16–20 px.
- Sem emojis na UI.
- **Portal (Engenharia Apps):** `HubMark` — quadrado 32×32, `rx=7`, fundo `#1F4D45`, glifo creme em **esquadro + triângulo de desenho** (não o raio).
- **App individual:** marca própria no mesmo azulejo teal. SPDA Pro usa **raio**. Outro app = outro glifo (ainda no mesmo tile).
- Favicon = a marca do app, SVG + PNG 180 px (`public/favicon.svg`, `public/__grok/icon-180.png`).
- Capa 1200×630 (`public/og.jpg`) e, se pedido, banner X 1200×264 (`public/x-banner.jpg`), mesma paleta e letra.

---

## 4. Cabeçalho (sempre)

Barra creme, sticky, borda inferior 1 px `#DDD4C4`, **faixa 68–76 px**, `px-5 py-4`. Não some no scroll. Sem hamburger no desktop.

**Esquerda**

- Marca do app \~40×40 (`size-10`)
- Nome do app (serif)
- Subtítulo: `<função> · <norma>`\
  Ex.: `Análise de risco · NBR 5419:2026`

**Direita**

1. Cartão **Portal** (borda, fundo card, HubMark + “Engenharia Apps” / “Voltar ao portal”) → https://engenharia-apps.vercel.app\
   Celular: só o ícone, com tooltip.
2. Botão outline **Projetos** (ícone pasta).
3. Sem botão Salvar se o app grava sozinho no navegador.

---

## 5. Rodapé / crédito (sempre)

No **rodapé da sidebar esquerda** (e no sheet mobile), duas linhas, texto discreto 11 px:

```
Criado por: Júlio Salama
Engenheiro Eletricista · CREA 48732
```

Colado embaixo da coluna (`mt-auto`), com filete superior. Também no rodapé da memória de cálculo.

---

## 6. Estrutura canônica de um app de cálculo

Desktop em **3 colunas** (máx. \~90 rem):

1. **Sidebar \~256 px**

   - Sem rótulo “PROJETO”.
   - Só etapas: ícone Lucide + label + «?».
   - Ativo: pílula `#1F4D45`, texto creme.
   - Inativo: transparente, hover `muted`.
   - «?» = ajuda curta (o que entra em fórmula, o que é cabeçalho).
   - Sticky, altura da viewport abaixo do header. Crédito no fundo.

2. **Centro**

   - Breadcrumb: `projeto · estrutura` (ou equivalente).
   - Cards creme, borda, radius 16, padding generoso.
   - Título serif + frase de contexto.
   - Campos: label + «?» + input.
   - Listas repetíveis: Adicionar + lixeira.

3. **Painel direito de veredito (\~256 px), sticky**

   - Rótulo em versalete (ex.: VEREDITO R1 / F).
   - Badge Conforme / Não conforme / Atenção.
   - Grandezas principais.
   - **Fica fixo** enquanto o meio rola. O selo de status não some.

Mobile: sidebar vira menu; veredito sobe para faixa sob o header.

---

## 7. Componentes

- Botão principal: fundo `#1F4D45`, texto creme.
- Botão secundário: outline, fundo card, borda `#DDD4C4`.
- Badges: `ok` / `fail` / `warn` / `muted`.
- Tooltip: fundo ink, texto paper, texto curto.
- Dialog de Projetos: lista de pastas e itens, criar / renomear / excluir.
- Sem login por padrão. Dados no **localStorage** deste navegador.
- Projetos: **Baixar cópia** (JSON), **Importar**, **Restaurar segurança** (`spda-pro-backup` ou chave equivalente do app).
- Modelo: pasta (projeto) → vários cálculos (estruturas).

---

## 8. Memória / documento

- Memorial passo a passo: objetivo, referências, identificação, parâmetros, equações, confronto, conclusão breve.
- Botões **Copiar memória** e **Imprimir memória** no mesmo verde da marca.
- Copiar gera HTML com tabelas bordadas, parágrafos espaçados, sem marcadores soltos (Word).
- Campos AS BUILT levam “AS BUILT” no rótulo e no «?».

---

## 9. O que não fazer

- Dark mode, paleta azul- roxo, Fraunces, IBM Plex, Inter como fonte principal.
- Login/nuvem sem o usuário pedir.
- Inventar outra marca de portal (o portal é o esquadro; o app tem glifo próprio).
- Header compacto (`py-2.5`).
- Rótulo “PROJETO” acima da nav.
- Botão Salvar cosmética se já houver autosave.
- Esconder o veredito no scroll.
- Emojis, ilustrações 3D, fotos de estoque no chrome.

---

## 10. Checklist de um app novo

- \[ \] Paleta e fontes iguais às da tabela
- \[ \] Header 68–76 px com marca + nome + subtítulo norma
- \[ \] Cartão Portal (HubMark) → engenharia-apps.vercel.app
- \[ \] Projetos (localStorage + export/import JSON)
- \[ \] Sidebar de etapas com «?»
- \[ \] Crédito em duas linhas no rodapé da coluna
- \[ \] Painel de resultado sticky
- \[ \] Favicon = marca do app
- \[ \] Português BR, tom de escritório
- \[ \] Sem login, sem dark mode

This conversation belongs to a Grok project. The project's files are mounted at `/workspace/artifacts` — look there for user-provided sources before concluding the workspace has no project files. Files written there persist to the project across conversations.