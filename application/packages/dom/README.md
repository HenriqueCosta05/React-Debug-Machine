# @henriquecosta/react-debug-machine-dom

> Adapter de captura e replay de eventos DOM do React Debug Machine.

**Status:** em desenvolvimento (M2 do [PRD](../../../docs/PRD.md) — capture/roots/replay concluídos; E2E Playwright adiado, ver [TODO.md](../../../TODO.md))

---

## Sobre

Escuta eventos nativos do DOM em capture-phase no `document`, serializa o alvo sem reter referência viva ao `Element` e publica no event bus do [`shared`](../shared/README.md) como `DebugEvent` do tipo `dom` (R-01 do PRD).

Capture-phase no `document` funciona antes do listener delegado do React (anexado no root container, um descendente do `document`) — cobre qualquer versão de React e também apps sem React.

---

## API

### `startDomCapture(bus, options?)`

```ts
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import { startDomCapture } from '@henriquecosta/react-debug-machine-dom';

const bus = createEventBus();
bus.subscribe('dom', (event) => console.log(event.data));

const stop = startDomCapture(bus);
// ...
stop(); // remove os listeners, reversível
```

| Opção | Descrição |
|---|---|
| `eventTypes` | Tipos nativos escutados. Padrão: `click`, `dblclick`, `input`, `change`, `submit`, `keydown`, `keyup`, `focus`, `blur`. |
| `documentRef` | `Document` alvo (útil pra testes/iframes). Padrão: `document`. |
| `rootRegistry` | `RootRegistry` opcional pra restringir captura a roots registrados. |

### `createRootRegistry()`

Root-awareness **opt-in** via `Element.contains()` — sem introspecção de fiber (fica pro futuro adapter `state`). Sem roots registrados, captura é irrestrita.

```ts
import { createRootRegistry, startDomCapture } from '@henriquecosta/react-debug-machine-dom';

const rootRegistry = createRootRegistry();
const unregister = rootRegistry.register(document.getElementById('app')!);

startDomCapture(bus, { rootRegistry });
```

### `replayDomEvent(data, documentRef?)`

Reconstrói o `Event` nativo (`MouseEvent`/`KeyboardEvent`/`FocusEvent`/`Event`) a partir de um `DomEventData` capturado e despacha no elemento resolvido por `id` ou `selectorPath`.

```ts
import { replayDomEvent } from '@henriquecosta/react-debug-machine-dom';

const result = replayDomEvent(capturedEvent.data);
// { ok: true } | { ok: false, reason: 'target-not-found' }
```

**Limitações documentadas:**
- `isTrusted` do evento reconstruído é sempre `false` — limitação do próprio DOM, não contornável a partir de script de página.
- `selectorPath` obsoleto (DOM mudou desde a captura) ou inválido falha graciosamente (`{ ok: false, reason: 'target-not-found' }`), nunca lança.

### `serializeTarget(element)`

Descritor serializável de um `Element` (`tagName`, `id`, `className`, `selectorPath`) — nunca retém referência viva ao DOM.

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

19 testes (Rstest + jsdom) em `src/tests/`: `target` (serialização, selectorPath), `registry` (root-awareness opt-in), `capture` (publish no bus, rootRegistry, stop(), eventTypes customizados), `replay` (reconstrução por tipo, fallback por selectorPath, falha graciosa).

---

## Estrutura

```text
src/
  core/
    capture/
      capture.ts          startDomCapture
      target.ts            serializeTarget
    roots/
      registry.ts           createRootRegistry
    replay/
      replay.ts              replayDomEvent
    types/                    CaptureOptions, RootRegistry, ReplayResult
    constants/                 tipos de evento nativos observados
    index.ts                    ponto único de exports do pacote
  tests/                        espelha src/core, não fica junto ao arquivo fonte
```

---

## Documentação relacionada

| Documento | Conteúdo |
|---|---|
| [docs/PRD.md](../../../docs/PRD.md) | Escopo do produto, marcos (M1–M6) |
| [docs/CONVENTIONS.md](../../../docs/CONVENTIONS.md) | Convenções de arquitetura e código do monorepo |
| [TODO.md](../../../TODO.md) | Backlog ativo, inclusive gaps deste pacote |
