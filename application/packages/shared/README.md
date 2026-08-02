# @henriquecosta/react-debug-machine-shared

> Schema de eventos e event bus compartilhados pelos adapters do React Debug Machine.

**Status:** em desenvolvimento (M1 do [PRD](../../../docs/PRD.md) — schema + bus + modelo de timeline/sessão concluídos; schema de `dom`, `network` (M2) e `state` (M3) também vive aqui)

---

## Sobre

Todo adapter (`dom`, `network`, `state`, `console`, `types`) publica eventos capturados neste bus compartilhado, e o painel `devtools` consome dele. Este pacote não captura nada sozinho — ele só define o formato do evento (`DebugEvent`) e o canal por onde ele trafega (`createEventBus`).

Validação de schema roda no ponto de `publish()`: um evento inválido é reportado via `console.error` e descartado, nunca lança exceção — um adapter com bug não pode derrubar a aplicação hospedeira.

---

## API

### `createEventBus()`

```ts
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';

const bus = createEventBus();

const unsubscribe = bus.subscribe('dom', (event) => {
  console.log(event.data);
});

bus.subscribeAll((event) => {
  // recebe eventos de qualquer type
});

bus.publish({
  type: 'dom',
  timestamp: performance.now(),
  data: {
    nativeType: 'click',
    target: { tagName: 'BUTTON', id: null, className: 'btn', selectorPath: 'body > button' },
  },
});

unsubscribe();
```

| Método | Descrição |
|---|---|
| `publish(event)` | Valida o evento (`isDebugEvent`) e distribui pros listeners do `type` correspondente + wildcard. Evento inválido é descartado e reportado, nunca lança. |
| `subscribe(type, handler)` | Escuta só um `DebugEvent['type']`. Retorna função de unsubscribe. |
| `subscribeAll(handler)` | Escuta todos os types. Retorna função de unsubscribe. |

### `isDebugEvent(value)`

Type guard usado internamente por `publish()`, também exportado pra quem quiser validar um evento fora do bus (ex.: antes de serializar pra replay).

### `createTimeline(bus)`

Assina `bus.subscribeAll` e acumula os eventos em ordem, cada um com `sequence` (inteiro crescente, 1-based) atribuído no momento do registro.

```ts
import { createEventBus, createTimeline } from '@henriquecosta/react-debug-machine-shared';

const bus = createEventBus();
const timeline = createTimeline(bus);

bus.publish({ type: 'console', timestamp: performance.now(), data: 'hello' });

timeline.getEvents();               // TimelineEntry[] em ordem de chegada
timeline.getEventsByType('console'); // só os do domínio pedido
timeline.clear();                    // esvazia e reseta sequence
timeline.stop();                     // desliga o registro (unsubscribe do bus)
```

Não faz seek/scrubbing nem persiste nada — isso é responsabilidade do painel `devtools` (M6), que consome `getEvents()`/`getEventsByType()` pra montar sua própria UI de navegação.

### `createDebugSession()`

Empacota `Session` (id + `startedAt`) com um `bus` e uma `timeline` próprios e independentes — cada chamada cria um bus novo, não há singleton global.

```ts
import { createDebugSession } from '@henriquecosta/react-debug-machine-shared';

const { session, bus, timeline, end } = createDebugSession();

// adapters seguem recebendo `bus` normalmente (assinatura inalterada)
startDomCapture(bus);

end(); // para a timeline; não afeta os adapters, que têm seu próprio restore
```

### Tipos

| Tipo | Descrição |
|---|---|
| `DebugEvent` | União discriminada por `type`: `'dom' \| 'network' \| 'console' \| 'state' \| 'typescript' \| 'custom'`. `dom`, `network` e `state` têm `data` tipado (`DomEventData`, `NetworkEventData`, `StateEventData`); os demais domínios ficam `unknown` até seus adapters existirem. |
| `DomEventData` | `{ nativeType: string; target: DomTargetDescriptor }` |
| `DomTargetDescriptor` | Descritor serializável de um `Element` (`tagName`, `id`, `className`, `selectorPath`) — nunca retém referência viva ao DOM. |
| `NetworkEventData` | União discriminada por `phase`: `request` (`requestId`, `method`, `url`), `response` (+ `status`, `ok`, `durationMs`), `error` (+ `durationMs`, `message`). `requestId` correlaciona as fases de uma mesma chamada. |
| `StateEventData` | `{ origin: 'react' \| 'redux' \| 'tanstack'; label: string; before: unknown; after: unknown }`. `before`/`after` ficam `unknown` porque o shape do estado da app hospedeira é arbitrário. |
| `EventBus` | `ReturnType<typeof createEventBus>` |
| `Timeline` | `ReturnType<typeof createTimeline>` |
| `TimelineEntry` | `DebugEvent & { sequence: number }` |
| `Session` | `{ id: string; startedAt: number }` |
| `DebugSession` | `ReturnType<typeof createDebugSession>` — `{ session, bus, timeline, end }` |

---

## Scripts disponíveis

| Comando | O que faz |
|---|---|
| `pnpm build` | `eslint .` + `rslib build` — gera `dist/` (ESM + `.d.ts`) |
| `pnpm test` | `rstest run` |

---

## Testes

```bash
pnpm test
```

25 testes (Rstest) em `src/tests/`: cobrem `createEventBus` (dispatch por type, wildcard, unsubscribe, evento inválido descartado), `isDebugEvent` (aceite/rejeição por domínio, timestamp, tipos desconhecidos, valores primitivos, fases de `NetworkEventData`, `StateEventData`), `createTimeline` (ordem/sequence, filtro por type, clear, stop, evento inválido não entra) e `createDebugSession` (id único, bus/timeline ligados, end() para o registro, sessões independentes).

---

## Estrutura

```text
src/
  core/
    events/
      events.bus.ts      createEventBus
      events.schema.ts    isDebugEvent (type guards)
      events.types.ts     DebugEvent e tipos de domínio
    timeline/
      timeline.ts          createTimeline
      timeline.types.ts    TimelineEntry
    session/
      session.ts            createDebugSession
      session.types.ts       Session
    index.ts               ponto único de exports do pacote
  tests/                    espelha src/core, não fica junto ao arquivo fonte
```

---

## Documentação relacionada

| Documento | Conteúdo |
|---|---|
| [docs/PRD.md](../../../docs/PRD.md) | Escopo do produto, marcos (M1–M6) |
| [docs/CONVENTIONS.md](../../../docs/CONVENTIONS.md) | Convenções de arquitetura e código do monorepo |
| [TODO.md](../../../TODO.md) | Backlog ativo, inclusive gaps deste pacote |
