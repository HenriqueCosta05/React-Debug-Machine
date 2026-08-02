# @henriquecosta/react-debug-machine-network

> Adapter de captura de rede (fetch + XHR) do React Debug Machine.

**Status:** em desenvolvimento (M2 do [PRD](../../../docs/PRD.md) — captura concluída; replay fora de escopo por ora, ver [TODO.md](../../../TODO.md))

---

## Sobre

Patcha `window.fetch` e `XMLHttpRequest.prototype` (`open`/`send`) pra observar requisição e resposta sem alterar o comportamento original: o corpo da resposta nunca é lido (evita interferir na app hospedeira) e qualquer erro/rejeição é relançado como veio (R-04 do PRD).

Cada chamada gera um `requestId` único que correlaciona suas fases (`request` → `response` ou `request` → `error`) no event bus do [`shared`](../shared/README.md), como `DebugEvent` do tipo `network`.

Patches são sempre reversíveis: a função retornada por cada `start*Capture` restaura o original.

---

## API

### `startNetworkCapture(bus)`

Liga captura de `fetch` e `XMLHttpRequest` juntas.

```ts
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import { startNetworkCapture } from '@henriquecosta/react-debug-machine-network';

const bus = createEventBus();
bus.subscribe('network', (event) => console.log(event.data));

const stop = startNetworkCapture(bus);
// ...
stop(); // restaura fetch e XMLHttpRequest.prototype originais
```

### `startFetchCapture(bus, target?)` / `startXhrCapture(bus, target?)`

Versões isoladas, caso só um dos dois mecanismos precise ser observado. `target` é injetável (usado nos testes pra evitar patchar os globais reais).

### Fases de `NetworkEventData` (definido em `shared`)

| Fase | Campos | Quando |
|---|---|---|
| `request` | `requestId`, `method`, `url` | Antes de disparar a chamada |
| `response` | + `status`, `ok`, `durationMs` | Resposta recebida (sucesso ou erro HTTP) |
| `error` | + `durationMs`, `message` | `fetch` rejeitou ou XHR terminou com `status === 0` (falha de rede/abort) |

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

8 testes (Rstest + jsdom) em `src/tests/`: `fetch.capture` (correlação request/response, fase error no reject, restore no stop), `xhr.capture` (correlação via `open`/`send`/`loadend`, status 0 vira error, `send()` sem `open()` prévio delega sem publicar, restore no stop), `network.capture` (fetch + XHR patchados e restaurados juntos).

---

## Estrutura

```text
src/
  core/
    capture/
      fetch.capture.ts       startFetchCapture
      xhr.capture.ts          startXhrCapture
      network.capture.ts       startNetworkCapture (compõe os dois)
      request-id.ts             createRequestId (privado, não exportado)
    types/                       FetchTarget, XhrCaptureState
    index.ts                      ponto único de exports do pacote
  tests/                          espelha src/core, não fica junto ao arquivo fonte
```

---

## Documentação relacionada

| Documento | Conteúdo |
|---|---|
| [docs/PRD.md](../../../docs/PRD.md) | Escopo do produto, marcos (M1–M6) |
| [docs/CONVENTIONS.md](../../../docs/CONVENTIONS.md) | Convenções de arquitetura e código do monorepo |
| [TODO.md](../../../TODO.md) | Backlog ativo, inclusive gaps deste pacote |
