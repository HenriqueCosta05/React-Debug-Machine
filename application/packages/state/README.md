# @henriquecosta/react-debug-machine-state

> Adapter de captura de estado (React, Redux, TanStack Query) do React Debug Machine.

**Status:** em desenvolvimento (M3 do [PRD](../../../docs/PRD.md) — os 3 adapters cobrem R-02; sem replay, só captura com diff, ver [TODO.md](../../../TODO.md))

---

## Sobre

Um adapter por lib, cada um isolado e opcional (nenhum importa o outro). Todos publicam `StateEventData` (definido em [`shared`](../shared/README.md)) no event bus como `DebugEvent` do tipo `state`, com `origin` identificando a lib de origem e `before`/`after` como snapshot do state.

`redux` e `tanstack` usam a API pública de subscribe/getState de cada lib — sem middleware, sem enhancer, sem alterar como a app hospedeira cria seu store/client. `react` **não introspecciona fiber** (ver ADR-004 em [`CONVENTIONS.md`](../../../docs/CONVENTIONS.md) §3.6): internals do React não são API pública e o shape muda entre versões (RK-01 do PRD). Em vez disso, expõe um hook opt-in (`useDebugState`) que envelopa `useState` — a app hospedeira troca o hook onde quiser visibilidade.

Cada `start*Capture` é reversível: a função retornada cancela o subscribe.

---

## API

### `startReduxCapture(bus, store, label?, sliceKeys?)`

```ts
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import { startReduxCapture } from '@henriquecosta/react-debug-machine-state';

const bus = createEventBus();
bus.subscribe('state', (event) => console.log(event.data));

const stop = startReduxCapture(bus, store, 'root'); // label default: 'store'
// ...
stop(); // cancela o subscribe do store
```

Publica a cada `dispatch` que muda o state (`store.subscribe`), com `before`/`after` sendo o state inteiro da store por padrão.

Passando `sliceKeys` (chaves top-level de um state `combineReducers`), publica 1 evento por chave que mudou em vez de 1 evento com o state inteiro — `label` vira `<label>.<chave>` e `before`/`after` são só aquela chave. Chave que não mudou (`Object.is`) não publica nada. O adapter não infere as chaves sozinho (não há como saber, a partir da `Store`, quais chaves vieram de `combineReducers` vs. de um reducer único que devolve um objeto — ver ADR-004): quem sabe é o chamador.

```ts
const stop = startReduxCapture(bus, store, 'root', ['counter', 'user']);
// dispatch que só muda `counter` publica 1 evento: label 'root.counter'
```

### `startTanstackCapture(bus, queryClient)`

```ts
import { startTanstackCapture } from '@henriquecosta/react-debug-machine-state';

const stop = startTanstackCapture(bus, queryClient);
// ...
stop(); // cancela o subscribe do QueryCache e limpa o histórico interno
```

Assina `queryClient.getQueryCache()`. Publica a cada transição de qualquer query, com `label` sendo `JSON.stringify(queryKey)` e `before`/`after` sendo `query.state` (o objeto de estado interno do TanStack Query: `data`, `status`, `dataUpdatedAt` etc.). Na primeira transição de uma query, `before` é `undefined`.

### `createUseDebugState(bus)`

```ts
import { createUseDebugState } from '@henriquecosta/react-debug-machine-state';

const useDebugState = createUseDebugState(bus);

function Counter() {
  const [count, setCount] = useDebugState(0, 'count'); // troca de useState(0)
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

Retorna um hook com a mesma assinatura de `useState` (+ `label` obrigatório pra identificar o campo no painel). Cada chamada do setter publica `before`/`after` no bus antes de atualizar o state do componente.

### Limitações conhecidas

| Adapter | Limitação |
|---|---|
| `redux` | Diff por slice é opt-in via `sliceKeys` (chamador declara as chaves, adapter não infere); sem `sliceKeys`, diff é do state inteiro. Não captura o `type` da action em nenhum dos dois modos (exigiria middleware/enhancer, contradiz a premissa do PRD R-02 de não exigir middleware — fora de escopo) |
| `tanstack` | `before`/`after` são o `query.state` interno (inclui `status`, `fetchStatus` etc.), não só `data` |
| `react` | Opt-in: só captura state trocado por `useDebugState`; não enxerga `useState`/`useReducer` que a app não migrar |

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

9 testes (Rstest + jsdom) em `src/tests/`: `redux.adapter` (diff before/after no dispatch, label default, restore no stop, diff por slice via `sliceKeys` — só publica a chave que mudou, nada se nenhuma mudou), `tanstack.adapter` (before undefined na 1ª transição, before = state anterior na 2ª, restore no stop), `react.adapter` (`useDebugState` publica before/after e se comporta como `useState`, via `react-dom/client` + `act` em jsdom).

---

## Estrutura

```text
src/
  core/
    adapters/
      redux.adapter.ts       startReduxCapture
      tanstack.adapter.ts    startTanstackCapture
      react.adapter.ts       createUseDebugState
    index.ts                 ponto único de exports do pacote
  tests/                     espelha src/core, não fica junto ao arquivo fonte
```

---

## Peer dependencies

`react`, `redux` e `@tanstack/query-core` são peer dependencies opcionais — instale só a(s) que for usar. Nenhum adapter importa o outro.

---

## Documentação relacionada

| Documento | Conteúdo |
|---|---|
| [docs/PRD.md](../../../docs/PRD.md) | Escopo do produto, marcos (M1–M6) |
| [docs/CONVENTIONS.md](../../../docs/CONVENTIONS.md) | Convenções de arquitetura e código do monorepo, ADR-004 (por que `react` não usa fiber) |
| [TODO.md](../../../TODO.md) | Backlog ativo, inclusive gaps deste pacote |
