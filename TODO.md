# TODO

Live backlog. Itens concluídos migram pra "Concluído" com check, não são removidos.

## Now

(all milestones complete)

## Concluído

- [x] M7 — Pacote `recorder`: `createRecorder(bus)` (janela start/stop, buffer próprio via `bus.subscribeAll`, não reusa `timeline`), `exportRecording`/`importRecording` (JSON, valida com `isDebugEvent`), `createPlayer` (agenda por delta de timestamp, despacha pro `ReplayerRegistry` por tipo, tipo sem replayer reporta em vez de lançar). Agnóstico de adapter (ADR-005). 11 testes
- [x] M7 — `shared`: `ReplayResult` movido de `dom` pra `shared`, contrato único reusado por `dom`/`network`/`console`/`state`/`types`/`recorder`
- [x] M7 — `network`: `replayNetworkEvent` reexecuta `fetch` real (`method`+`url`, sem body/headers) pra qualquer método capturado — decisão deliberada, risco de duplicar efeito colateral em não-GET documentado (ADR-006, RK-05 no PRD)
- [x] M7 — `console`: `replayConsoleEvent` rechama `console[level](...args)`
- [x] M7 — `state`: `createStateSetterRegistry` + `replayStateEvent`; `useDebugState`/`startTanstackCapture` registram setter/`setQueryData` por `label`; `redux` fica sem replayer por design (sem API pública de set state genérico)
- [x] M7 — `types`: `replayTypeDiagnostic` no-op `ok:true` (diagnóstico não é ação reversível)
- [x] M7 — `devtools`: hook `useRecorder(session, replayers)` + componente `RecorderControls` (Record/Stop/Play/Pause/Export/Import), confirmação obrigatória antes de reproduzir evento de rede não-GET
- [x] M6 — Implementar painel `devtools` unificando os 5 domínios (DOM, estado, console, rede, tipos) com UI overlay fixa na aplicação hospedeira; `DebugMachineDevtools` (React + MUI, tema isolado, toggle RDM, tab bar filtrada por tipo, EventList com diff colorido) + hook `useDebugMachine(session)`
- [x] M5 — Implementar adapter `types`: diagnostics do TS Language Service ligados ao componente/estado de origem (R-05; viabilidade ADR-002 resolvida: adapter funciona como receptor — ouve CustomEvent `react-debug-machine:typescript-diagnostic` despachado por tooling externo; `publishTypeDiagnostic(bus, data)` para injeção direta; sem rodar TS compiler no browser)
- [x] M4 — Implementar adapter `console`: interceptação de console.* sem suprimir comportamento original (R-03; só captura, sem replay)
- [x] M3 — `state`: diff por slice no adapter Redux via `sliceKeys` opcional (`startReduxCapture(bus, store, label, sliceKeys)`) — 1 evento por chave top-level que mudou (`Object.is`), sem `sliceKeys` mantém diff do state inteiro (compat). `action.type` continua fora de escopo: exigiria middleware/enhancer, o que contradiz a premissa do PRD R-02 ("sem exigir middleware específico") e o ADR-004 aceito; decisão confirmada com o usuário, não implementado
- [x] M2 — `dom`: teste E2E Playwright em navegador real — demo `InfinityUI` (`application/demos/InfinityUI`) ganhou dependência workspace de `dom`/`shared`, bootstrap dev-only `src/debug/timeMachine.ts` (cria `DebugSession`, registra root, `startDomCapture`, expõe `window.__timeMachine`) e `e2e/dom-capture.spec.ts`: clica em elemento real (ícone SVG dentro de `<button>`), confirma captura em capture-phase não interfere no handler React (carrinho abre) e que o evento `dom` chega na timeline com `selectorPath` correto
- [x] M3 — `state`: pacote criado do zero — `package.json` com `redux`/`@tanstack/query-core`/`react` como peerDependencies opcionais (`peerDependenciesMeta`), `tsconfig.json`/`rslib.config.ts`/`eslint.config.mts`/`rstest.config.ts` espelhando `network`
- [x] M3 — `state`: adapter Redux (`startReduxCapture`) — `store.subscribe` + diff antes/depois via `store.getState()`, label configurável (default `'store'`)
- [x] M3 — `state`: adapter TanStack Query (`startTanstackCapture`) — subscribe ao `QueryCache`, diff por `queryHash` (label = `queryKey` serializado), `before` `undefined` na 1ª transição
- [x] M3 — `state`: adapter React (`createUseDebugState`) — hook opt-in que envelopa `useState`, evita introspecção de fiber (ADR-004 em `CONVENTIONS.md`, mitiga RK-01)
- [x] M3 — `state`: testes (7: Rstest + jsdom, React testado via `react-dom/client` + `act`, sem dependência extra de testing-library)
- [x] docs/scope: decidido — `createTimeline`/`createDebugSession` implementados em `shared` agora (não adiado pro M6); `devtools` (M6) consome `timeline.getEvents()`/`getEventsByType()`, não guarda estado próprio; ADR-003 em `CONVENTIONS.md` §3.6
- [x] M1/M2 — `shared`: `createTimeline(bus)` (acumula `DebugEvent` em ordem com `sequence`, sem seek) e `createDebugSession()` (`Session` + bus + timeline próprios, sem singleton) — 11 testes novos (Rstest)
- [x] M3 — `shared`: `StateEventData` (`origin: 'react'|'redux'|'tanstack'`, `label`, `before`, `after`) + validação de schema em `isDebugEvent`, seguindo o padrão de `DomEventData`/`NetworkEventData`
- [x] M2 — `dom`: pacote criado do zero — `package.json`, `tsconfig.json` (`lib: ["ES2022", "DOM"]`), `rslib.config.ts` (mesma estrutura de `shared`)
- [x] M2 — `dom`: capture/ — listener em capture-phase no `document` (funciona antes do listener delegado do React em qualquer versão/root, e em apps não-React), serialização de target sem reter referência viva ao `Element`, publish no bus com timestamp via `performance.now()`
- [x] M2 — `dom`: roots/registry.ts — root-awareness opt-in via `Element.contains()`, sem introspecção de fiber
- [x] M2 — `dom`: replay/ — reconstrução de `Event` por tipo + `dispatchEvent`, limitações documentadas (isTrusted sempre false, selectorPath obsoleto falha graciosamente)
- [x] M2 — `dom`: testes unit + jsdom com Rstest (19 testes: target, registry, capture, replay)
- [x] M2 — Implementar adapter `network` (R-04: captura fetch/XHR, correlacionar request/response via `requestId`) — `shared` ganhou `NetworkEventData` (fases `request`/`response`/`error`) seguindo o mesmo padrão de `DomEventData`; 8 testes (Rstest + jsdom)
- [x] docs: atualizar `docs/CONVENTIONS.md` §2.4 — pacote real é `dom` (não `dom-events` como documentado)
- [x] docs: reconciliar padrão de nome de pacote npm — `CONVENTIONS.md` §2.3 atualizado pra `react-debug-machine-<pacote>`, alinhado ao que `shared`/`dom`/`network` já publicam
- [x] docs: `README.md` Quick start diz que `application/` "ainda não existe" — já existe, `shared`/`dom`/`network` buildam e testam com Rstest; Quick start atualizado
- [x] M1 — infra: criar `pnpm-workspace.yaml` + `package.json` raiz em `application/` (pré-requisito pra linkar `dom` ↔ `shared` via `workspace:*`)
- [x] M1 — `shared`: substituir stub `EventBusEvents`/`EventBus` por bus real (`createEventBus()` com `publish`/`subscribe`/`subscribeAll`), removendo `EventBusType`/`originalFn`/`replayFn` (abstração prematura)
- [x] M1 — `shared`: tipar `DebugEvent.data` como union discriminada por `type`, começando por `DomEventData`/`DomTargetDescriptor` (R-01); demais domínios ficam `unknown` até seus adapters existirem
- [x] M1 — `shared`: validação de schema em runtime no ponto de `publish()` (type guards, sem lib nova), evento inválido é reportado e descartado, nunca lança
- [x] M1 — `shared`: decidir runner de teste — Rstest (par nativo do `rslib`/rspack já adotado no build), suíte cobrindo `createEventBus`/validação de schema (10 testes)

## Later / ideas


## Known issues
