Design Spec: React Debug Machine (painel devtools)

Tokens concretos e regras de componente para o painel
(@henriquecosta/react-debug-machine-devtools, componente DebugMachineDevtools /
hook useDebugMachine).

O painel deve priorizar densidade de informação, precisão e legibilidade técnica. O visual pode ser sofisticado, mas não deve introduzir ornamentação que dificulte a inspeção de dados.

Valores marcados a definir precisam de decisão antes da implementação. Este documento não deve ficar com placeholder permanente uma vez que o painel comece a ser construído.

Brand
Nome: React Debug Machine
Tom: denso, preciso, discreto.
Denso: mostra muita informação por área de tela sem esconder dados atrás de interações desnecessárias.
Preciso: nunca arredonda, trunca ou omite valor capturado sem indicar explicitamente que existe conteúdo adicional.
Discreto: o toggle é fixo e não invasivo até ser aberto.
Técnico: a interface deve parecer uma ferramenta de inspeção/debug, e não uma dashboard de métricas.
Hierarquia: dados capturados têm prioridade visual sobre decoração, branding e controles.
Princípios visuais
Dados > decoração
Estado explícito > inferência visual
Precisão > estética
Densidade > espaçamento excessivo
Consistência > customização por componente
Interação deve ser previsível
Estados de erro/aviso nunca dependem apenas de cor
Color tokens
Token	Value	Usage
color-bg	#0F3040	Fundo principal do painel
color-primary	#464858	Seleção na timeline, botão de toggle, controles primários
color-secondary	#A56F63	Bordas, divisores e elementos secundários
color-error	#FF5656	Erros de diagnóstico, requisições com falha
color-warn	#FF8A6D	Warnings, console.warn
color-diff-add	#78B9B5	Valor adicionado em diff
color-diff-remove	#AE445A	Valor removido em diff
Tokens adicionais
Token	Value	Usage
color-bg-elevated	#143A4C	Cards, popovers, áreas elevadas
color-bg-subtle	#112F3E	Headers internos, áreas secundárias
color-bg-hover	#1A4355	Hover
color-bg-active	#254B5B	Item ativo pressionado/selecionado
color-border	#315365	Bordas padrão
color-border-strong	#4A6675	Bordas de maior contraste
color-text	#F2F5F6	Texto principal
color-text-secondary	#B8C5CA	Texto secundário
color-text-muted	#7F949D	Metadados, timestamps, labels
color-text-disabled	#526B75	Controles desabilitados
color-focus	#78B9B5	Focus ring
color-success	#78B9B5	Estado concluído/sucesso
color-info	#78A9D1	Informação neutra
color-overlay	rgba(0, 0, 0, 0.45)	Backdrop de modal/popover
Opacidade

Valores de opacidade devem ser usados principalmente para estados, e não para texto que contenha dados importantes.

opacity-hover: 0.08
opacity-active: 0.14
opacity-disabled: 0.45
opacity-divider: 0.65

Regra: não usar texto abaixo de color-text-muted para valores capturados pelo debugger.

Typography

A tipografia deve privilegiar leitura rápida de valores técnicos.

Role	Font	Size	Weight	Line height
App title	Source Sans Pro	16px	700	20px
Heading	Source Sans Pro	20px	700	24px
Large heading	Source Sans Pro	24px	800	28px
Section title	Source Sans Pro	14px	700	18px
Body	Source Sans Pro	14px	500	18px
Body compact	Source Sans Pro	13px	500	16px
Small label	Source Sans Pro	12px	600	16px
Metadata	Source Sans Pro	11px	500	14px
JSON / diff	ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace	12px	500	17px
Numeric data	Monospace	12px	600	16px
Toggle label	Source Sans Pro	12px	700	16px
Regras tipográficas
font-smoothing pode ser usado para melhorar a leitura, sem alterar peso visual excessivamente.
Valores numéricos devem usar tabular numbers quando houver alinhamento vertical.
JSON, stack traces, paths, keys e valores técnicos devem usar fonte monoespaçada.
Não usar itálico para comunicar estado.
Negrito deve indicar hierarquia, não importância arbitrária.
Nunca utilizar text-transform: uppercase em valores capturados.
Labels curtos podem usar uppercase apenas quando isso melhorar a identificação de seções.
Timestamps devem usar fonte monoespaçada.
Números
font-variant-numeric: tabular-nums;

Deve ser aplicado a:

timestamps;
contadores;
duração;
índices;
número de requests;
tamanho de payload;
posições da timeline.
Font stack

A aplicação deve declarar uma stack explícita:

font-family:
  "Source Sans Pro",
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;

Para dados técnicos:

font-family:
  ui-monospace,
  SFMono-Regular,
  Menlo,
  Monaco,
  Consolas,
  "Liberation Mono",
  monospace;

Se Source Sans Pro não estiver disponível, a aplicação não deve bloquear o funcionamento do devtools.

Spacing

Utilizar escala baseada em múltiplos de 4px.

Token	Value
space-1	4px
space-2	8px
space-3	12px
space-4	16px
space-5	20px
space-6	24px
space-8	32px
space-10	40px
space-12	48px
Uso
Gap mínimo entre elementos relacionados: 4px
Gap padrão entre controles: 8px
Padding interno compacto: 8px
Padding de seção: 12px
Padding de painel: 16px
Separação entre grandes grupos: 24px

O painel deve evitar espaços verticais superiores a 24px sem necessidade funcional.

Borders

Bordas são parte importante da linguagem visual do debugger.

Tokens
Token	Value
border-width-default	1px
border-width-strong	1px
border-width-focus	2px
border-style	solid
border-color	#315365
border-color-strong	#4A6675
Regras
Bordas padrão: 1px solid color-border
Separadores: 1px solid color-border
Estado selecionado: 1px solid color-secondary
Estado de erro: 1px solid color-error
Estado de warning: 1px solid color-warn
Focus: 2px solid color-focus

Evitar bordas excessivamente arredondadas ou efeitos de "glassmorphism".

Border radius

O painel deve utilizar radius pequeno para preservar o aspecto de ferramenta técnica.

Token	Value	Uso
radius-none	0px	Divisores e áreas de tabela
radius-sm	2px	Badges, tags
radius-md	4px	Botões, inputs, cards pequenos
radius-lg	6px	Painéis internos
radius-xl	8px	Container principal
radius-pill	999px	Toggle/pills quando necessário

Regra: radius-xl não deve ser usado indiscriminadamente. O painel deve manter aparência compacta e técnica.

Shadows

Sombras devem comunicar elevação, não decoração.

Token	Value
shadow-panel	0 8px 32px rgba(0, 0, 0, 0.32)
shadow-popover	0 4px 16px rgba(0, 0, 0, 0.28)
shadow-modal	0 12px 48px rgba(0, 0, 0, 0.40)

Não utilizar sombras internas ou glow por padrão.

Focus

Todo elemento interativo precisa possuir estado de foco perceptível.

outline: 2px solid var(--color-focus);
outline-offset: 2px;

Não remover outline sem fornecer uma alternativa equivalente.

O focus deve permanecer visível mesmo em componentes com background escuro.

Interactive states

Todos os controles interativos devem possuir:

default;
hover;
active/pressed;
focus;
disabled;
selected, quando aplicável;
loading, quando aplicável.
Hover

O hover deve alterar principalmente:

background;
border;
ou contraste do texto.

Evitar movimentos de layout.

Active

O estado active pode utilizar:

color-bg-active

e uma pequena alteração de contraste.

Não usar transform: scale() em controles do debugger.

Disabled
texto: color-text-disabled;
borda: color-border;
cursor: not-allowed;
não deve responder a hover.
Transitions

As animações devem ser discretas.

Default
duration: 120ms
easing: ease-out

Aplicável a:

background;
border-color;
opacity;
color.

Não animar:

valores capturados;
JSON;
diffs;
stack traces;
mudanças de layout relacionadas à seleção de eventos.
Reduced motion

Quando:

@media (prefers-reduced-motion: reduce)

transições devem ser reduzidas ou removidas.

Layout do painel

O painel deve ser estruturado em:

┌─────────────────────────────────────────────┐
│ Header / controles                          │
├─────────────────────────────────────────────┤
│ Timeline                                    │
├─────────────────────────────────────────────┤
│ Conteúdo principal                          │
│                                             │
│ ┌───────────────┐ ┌───────────────────────┐ │
│ │ Navegação     │ │ Inspector             │ │
│ │ / eventos     │ │ / detalhes            │ │
│ └───────────────┘ └───────────────────────┘ │
└─────────────────────────────────────────────┘
Header

Responsabilidades:

identificação do debugger;
estado da conexão/captura;
controles globais;
fechamento/minimização;
filtros globais, quando aplicável.

Altura recomendada: 40–48px.

Timeline

Deve possuir altura compacta e permitir inspeção de:

eventos;
renders;
mudanças de estado;
requests;
logs;
erros.
Toggle do Devtools

O toggle deve ser fixo e discreto.

Dimensões
largura: 32px
altura: 32px
área clicável mínima: 40px × 40px
radius: radius-md
Estado fechado

Deve ocupar o mínimo possível da interface da aplicação.

Estado aberto

O toggle pode assumir color-primary como background e color-text como foreground.

Posicionamento

position: fixed.

O posicionamento exato deve considerar safe areas:

bottom: max(12px, env(safe-area-inset-bottom));
right: max(12px, env(safe-area-inset-right));
Buttons
Button primary
background: color-primary
texto: color-text
border: color-border-strong
radius: radius-md
altura: 32px
padding horizontal: 12px
Button secondary
background: transparent
texto: color-text-secondary
border: color-border
Icon button
dimensão visual: 28px–32px
área clicável: mínimo 40px × 40px

Ícones nunca devem ser a única forma de representar uma ação crítica sem tooltip/label acessível.

Inputs

Inputs devem seguir o mesmo sistema de bordas do restante do painel.

background: color-bg-subtle
border: 1px solid color-border
color: color-text
radius: radius-md
Estados
default
hover
focus
disabled
invalid
Placeholder

Usar color-text-muted.

Placeholder nunca deve ser usado para exibir informação essencial.

Select / Filter

Filtros devem ser visualmente compactos.

Exemplo:

[ All events ▼ ] [ Errors ▼ ] [ Search...             ]

Filtros ativos devem possuir indicação explícita:

background alterado;
border alterada;
ou badge de quantidade.

Não depender somente de uma mudança sutil de cor.

Badges

Badges são destinados a informações curtas.

Exemplos:

ERROR
WARN
STATE
ACTION
REQUEST
RENDER
Dimensões
font: 11px
weight: 700
padding horizontal: 6px
padding vertical: 2px
radius: radius-sm

Badges não devem conter textos longos.

Dividers

Divisores horizontais:

border-top: 1px solid var(--color-border);

Divisores verticais:

border-left: 1px solid var(--color-border);

Evitar utilizar mais de um divisor consecutivo sem conteúdo entre eles.

Timeline

A timeline é um componente central do debugger.

Evento selecionado
background: color-primary
border-color: color-secondary
Evento normal
background: transparent
border-color: transparent
Evento de erro
border-left: 2px solid color-error
Evento de warning
border-left: 2px solid color-warn

A timeline deve permitir distinguir categorias mesmo quando o usuário estiver com daltonismo ou com contraste reduzido.

Event rows

Cada linha de evento deve possuir uma estrutura consistente:

[time] [type] [description]                         [metadata]

Exemplo:

12:42:01.482   STATE    user.profile.name changed   +1
Regras
timestamp sempre monoespaçado;
valores numéricos alinhados;
descrição pode ocupar o espaço restante;
metadata não deve causar overflow do timestamp;
conteúdo capturado nunca deve ser silenciosamente truncado.

Quando houver overflow:

ellipsis + mecanismo para visualizar o valor completo
JSON viewer

JSON deve ser apresentado em fonte monoespaçada.

Regras
preservar ordem das propriedades quando fornecida pelo runtime;
preservar valores;
preservar tipos;
strings devem ser distinguíveis de números;
null, undefined, booleanos e objetos devem ser visualmente diferenciáveis;
objetos grandes podem ser colapsados;
o estado expandido/colapsado deve ser explícito.

Exemplo:

{
  user: {
    id: 42,
    active: true,
    name: "Henrique"
  }
}

A interface não deve converter automaticamente:

42 → "42"

ou:

false → "false"
Diff viewer

O diff deve comunicar claramente:

adicionado;
removido;
alterado;
mantido.
Adicionado
background sutil derivado de color-diff-add;
borda opcional;
indicador +.
Removido
background sutil derivado de color-diff-remove;
indicador -.
Alterado

Quando possível, mostrar:

before → after

sem esconder o valor anterior.

Regra de precisão

Não substituir valores por:

...

sem oferecer uma maneira explícita de visualizar o conteúdo integral.

Tables

Tabelas devem ser compactas.

Header
background: color-bg-subtle
font-weight: 700
border-bottom: 1px solid color-border
Rows
altura mínima: 28px
padding horizontal: 8px
padding vertical: 4px
Zebra striping

Não utilizar por padrão.

O contraste deve vir de:

bordas;
hover;
seleção;
hierarquia tipográfica.
Scrollbars

Scrollbars devem ser discretas, mas continuar utilizáveis.

Quando suportado:

scrollbar-width: thin;

O scrollbar não deve reduzir excessivamente a área útil de conteúdo.

Não esconder scrollbar permanentemente quando isso impedir o usuário de descobrir que existe conteúdo adicional.

Empty states

Estados vazios devem ser compactos.

Exemplo:

No events captured
Start interacting with the application to inspect activity.

Não utilizar ilustrações grandes.

O empty state deve responder:

o que está vazio;
por que está vazio;
o que o usuário pode fazer.
Loading

O loading deve ser mínimo e não bloquear dados já disponíveis.

Preferência:

indicador pequeno;
texto contextual;
skeleton somente quando a estrutura final for conhecida.

Evitar spinner grande no centro do debugger.

Error states

Erros devem possuir:

color-error;
texto explicativo;
contexto;
ação possível, quando houver.

Exemplo:

ERROR
Failed to capture request

Reason: NetworkError

A cor vermelha nunca deve ser a única indicação.

Warning states

Warnings utilizam color-warn.

Devem ser visualmente menos agressivos que erros.

Exemplo:

WARN
State update occurred outside expected lifecycle.
Success / informational states

Sucesso e informação não devem competir visualmente com erros.

success: color-success
info: color-info

Usar principalmente em:

status de conexão;
conclusão de operação;
informações auxiliares.
Tooltips

Tooltips devem ser utilizados para:

ícones sem label;
valores truncados;
ações cujo significado não seja óbvio;
atalhos de teclado.
Regras
delay curto;
não bloquear interação;
não substituir labels importantes;
conteúdo deve ser conciso.
Modal / Dialog

Quando uma ação exigir confirmação ou inspeção aprofundada:

backdrop: color-overlay;
background: color-bg-elevated;
border: 1px solid color-border;
radius: radius-lg;
shadow: shadow-modal.

O conteúdo deve continuar denso e técnico.

Panel hierarchy

A hierarquia de superfícies deve seguir:

color-bg
  └── color-bg-subtle
        └── color-bg-elevated
              └── popover/modal

Não criar dezenas de níveis de cinza/azul.

O usuário deve conseguir entender a estrutura apenas pela combinação de:

posição;
borda;
tipografia;
background.
Accessibility
Contraste

Texto importante deve manter contraste suficiente contra o background.

Não utilizar color-text-muted para informações que precisam ser lidas para executar uma tarefa.

Keyboard

Todos os controles devem ser acessíveis por teclado.

Ordem de tabulação deve seguir a ordem visual.

Screen readers

Ícones funcionais devem possuir:

aria-label;
ou texto visível equivalente.

Estados selecionados devem utilizar atributos semânticos apropriados, como:

aria-selected="true"

quando aplicável.

Color independence

Erro, warning, diff e seleção devem possuir pelo menos dois sinais visuais:

cor + ícone;
cor + texto;
cor + borda;
cor + símbolo.
Density modes

O painel pode futuramente suportar dois níveis de densidade.

Compact
rows: 24–28px
body: 13px
padding: 4–8px
Comfortable
rows: 28–36px
body: 14px
padding: 8–12px

Default: Compact.

O modo confortável não deve alterar a hierarquia ou a informação disponível, apenas o espaço entre elementos.

Z-index

Definir uma escala pequena e previsível:

Token	Value	Uso
z-base	0	Conteúdo
z-sticky	10	Headers/timeline sticky
z-dropdown	100	Menus
z-tooltip	200	Tooltips
z-modal	300	Dialogs
z-toggle	400	Toggle fixo

Evitar valores arbitrários como 99999.

Overflow

Como o debugger trabalha com dados potencialmente grandes:

min-width: 0 deve ser aplicado aos flex children apropriados;
áreas de JSON devem permitir scroll horizontal;
textos longos devem poder ser expandidos;
stack traces devem preservar formatação;
paths e URLs podem usar ellipsis visual, mas precisam permitir inspeção integral.

Nenhum valor capturado deve ser destruído por CSS.

Responsividade

O painel deve funcionar em:

desktop;
janela estreita;
viewport reduzida;
ambientes de desenvolvimento com zoom.
Breakpoints

Evitar breakpoints numerosos.

Sugestão:

Token	Value
breakpoint-sm	640px
breakpoint-md	768px
breakpoint-lg	1024px

Em telas menores, priorizar:

timeline;
evento selecionado;
inspector;
filtros.

Não esconder silenciosamente dados críticos.

CSS custom properties

Todos os tokens devem ser expostos como custom properties:

:root {
  --rdm-color-bg: #0F3040;
  --rdm-color-primary: #464858;
  --rdm-color-secondary: #A56F63;
  --rdm-color-error: #FF5656;
  --rdm-color-warn: #FF8A6D;
  --rdm-color-diff-add: #78B9B5;
  --rdm-color-diff-remove: #AE445A;

  --rdm-color-bg-elevated: #143A4C;
  --rdm-color-bg-subtle: #112F3E;
  --rdm-color-bg-hover: #1A4355;
  --rdm-color-bg-active: #254B5B;

  --rdm-color-border: #315365;
  --rdm-color-border-strong: #4A6675;

  --rdm-color-text: #F2F5F6;
  --rdm-color-text-secondary: #B8C5CA;
  --rdm-color-text-muted: #7F949D;
  --rdm-color-text-disabled: #526B75;
  --rdm-color-focus: #78B9B5;

  --rdm-space-1: 4px;
  --rdm-space-2: 8px;
  --rdm-space-3: 12px;
  --rdm-space-4: 16px;
  --rdm-space-5: 20px;
  --rdm-space-6: 24px;
  --rdm-space-8: 32px;

  --rdm-radius-sm: 2px;
  --rdm-radius-md: 4px;
  --rdm-radius-lg: 6px;
  --rdm-radius-xl: 8px;

  --rdm-shadow-panel: 0 8px 32px rgba(0, 0, 0, 0.32);
  --rdm-shadow-popover: 0 4px 16px rgba(0, 0, 0, 0.28);
  --rdm-shadow-modal: 0 12px 48px rgba(0, 0, 0, 0.40);
}
Component contract visual

Todo novo componente do DebugMachineDevtools deve responder a estas perguntas antes de ser implementado:

Qual é sua hierarquia visual?
Qual é seu estado default?
Qual é seu estado hover?
Qual é seu estado active?
Qual é seu estado focus?
Qual é seu estado disabled?
Qual é seu estado de erro?
Qual é seu estado de warning?
Qual informação é obrigatória?
O que acontece quando o conteúdo é muito grande?
O conteúdo completo continua acessível?
Como funciona por teclado?
A distinção visual continua funcionando sem depender exclusivamente de cor?
Regras anti-pattern

Evitar:

gradientes decorativos;
glassmorphism;
blur excessivo;
sombras fortes em todos os elementos;
cards aninhados sem necessidade;
radius muito alto;
animações chamativas;
texto excessivamente pequeno;
truncamento silencioso;
valores arredondados;
esconder dados atrás de tooltips quando eles deveriam estar visíveis;
depender exclusivamente de cor para representar estado;
z-index arbitrariamente alto;
múltiplas escalas de spacing;
múltiplos sistemas de borda;
estilos específicos que não utilizem tokens.
Critério de implementação

A implementação será considerada visualmente consistente quando:

todos os componentes utilizarem os tokens definidos;
não existirem cores hardcoded fora da definição dos tokens;
não existirem valores arbitrários de border-radius;
não existirem valores arbitrários de z-index;
estados interativos estiverem definidos;
dados técnicos utilizarem tipografia apropriada;
erros e warnings forem distinguíveis sem depender somente de cor;
conteúdo capturado não for perdido por truncamento;
foco de teclado estiver visível;
o painel mantiver alta densidade sem comprometer legibilidade;
o mesmo padrão visual for utilizado para componentes semanticamente equivalentes.
Decisões fechadas

Para evitar que o spec permaneça indefinido, ficam estabelecidos:

Fonte principal: Source Sans Pro
Fonte técnica: system monospace stack
Spacing base: 4px
Radius máximo padrão: 8px
Border padrão: 1px
Focus: 2px
Densidade padrão: Compact
Animação padrão: 120ms
Panel shadow: 0 8px 32px rgba(0, 0, 0, 0.32)
Dados numéricos: tabular numbers
Dados técnicos: monospace
Truncamento: somente quando houver acesso explícito ao valor completo
Estado: nunca comunicado exclusivamente por cor