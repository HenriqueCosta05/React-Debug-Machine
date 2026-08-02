# @henriquecosta/react-debug-machine-shared

> Schema de eventos e event bus compartilhados pelos adapters do React Debug Machine.

**Status:** em desenvolvimento (M1 do [PRD](../../../docs/PRD.md) — schema + bus concluídos; modelo de timeline/sessão ainda não implementado, ver [TODO.md](../../../TODO.md))

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

### Tipos

| Tipo | Descrição |
|---|---|
| `DebugEvent` | União discriminada por `type`: `'dom' \| 'network' \| 'console' \| 'state' \| 'typescript' \| 'custom'`. Só `dom` tem `data` tipado hoje (`DomEventData`); os demais domínios ficam `unknown` até seus adapters existirem. |
| `DomEventData` | `{ nativeType: string; target: DomTargetDescriptor }` |
| `DomTargetDescriptor` | Descritor serializável de um `Element` (`tagName`, `id`, `className`, `selectorPath`) — nunca retém referência viva ao DOM. |
| `EventBus` | `ReturnType<typeof createEventBus>` |

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

10 testes (Rstest) em `src/tests/`: cobrem `createEventBus` (dispatch por type, wildcard, unsubscribe, evento inválido descartado) e `isDebugEvent` (aceite/rejeição por domínio, timestamp, tipos desconhecidos, valores primitivos).

---

## Estrutura

```
src/
  core/
    events/
      events.bus.ts      createEventBus
      events.schema.ts    isDebugEvent (type guards)
      events.types.ts     DebugEvent e tipos de domínio
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
