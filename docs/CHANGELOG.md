# Changelog

Todas as mudanças notáveis deste projeto são documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added

- `devtools`: painel unificado (M6, R-01–R-05). Componente `DebugMachineDevtools` — overlay fixo com toggle, tab bar filtrada por tipo de evento, `EventList`/`EventItem` com diff colorido. Hook `useDebugMachine(session)` expõe events/filter/clear para quem quiser UI própria. Tema MUI isolado (não vaza pra app hospedeira). 2 suítes de teste (Rstest).
- `types`: adapter receptor de diagnósticos TypeScript (M5, R-05, ADR-002 resolvido). `startTypesCapture(bus)` ouve `CustomEvent react-debug-machine:typescript-diagnostic` despachado por tooling externo (plugins de build, watchers, extensões de IDE). `publishTypeDiagnostic(bus, data)` para injeção direta. TS compiler nunca roda no browser. 1 suíte de teste (Rstest).
- `console`: adapter de interceptação de `console.*` (M4, R-03). Patcha `console.log/warn/error/debug` sem suprimir o comportamento original, correlaciona cada log com timestamp via `performance.now()`, totalmente reversível via `stop()`. Só captura; sem replay (por design). Testes (Rstest + jsdom).
- `state`: adapter de estado (M3, R-02). `startReduxCapture(bus, store, label?, sliceKeys?)` — subscribe + diff antes/depois via `getState()`; com `sliceKeys` emite 1 evento por chave top-level que mudou (`Object.is`), sem `sliceKeys` diffs o state inteiro. `startTanstackCapture(bus, queryClient)` — subscribe ao `QueryCache`, diff por `queryHash`. `createUseDebugState(bus)` — hook opt-in que envelopa `useState` (sem introspecção de fiber, ADR-004). 7 testes (Rstest + jsdom + `react-dom/client`).
- `shared`: `StateEventData` (`origin: 'react'|'redux'|'tanstack'`, `label`, `before`, `after`) + validação em `isDebugEvent`.
- `shared`: `createTimeline(bus)` (acumula `DebugEvent` em ordem com `sequence`, expõe `getEvents()`/`getEventsByType()`) e `createDebugSession()` (bus + timeline próprios, sem singleton). 11 testes (Rstest).
- infra: scripts de qualidade — lint, coverage, CodeQL, quality-gate (GitHub Actions). Scripts de publish (`publish.ps1`/`.sh`) e bootstrap (`bootstrap.ps1`/`.sh`).
- `dom`: teste E2E Playwright em navegador real (demo `InfinityUI`) — confirma que captura em capture-phase não interfere no handler React e que evento `dom` chega na timeline com `selectorPath` correto.
- `dom`: pacote novo — adapter de eventos DOM (R-01). `capture/` escuta em capture-phase no `document` (funciona antes do listener delegado do React, em qualquer versão/root, e em apps não-React) e serializa o target sem reter referência viva ao `Element`. `roots/registry.ts` dá root-awareness opt-in via `Element.contains()`, sem introspecção de fiber. `replay/` reconstrói o `Event` por tipo e despacha via `dispatchEvent` (limitações documentadas: `isTrusted` sempre `false`, `selectorPath` obsoleto falha graciosamente). 19 testes (Rstest + jsdom).
- `network`: pacote novo — adapter de rede (R-04). Patcha `fetch` e `XMLHttpRequest.prototype` (`open`/`send`), correlaciona request/response/erro pelo mesmo `requestId`, nunca lê o corpo da resposta (não interfere no app hospedeiro) e é totalmente reversível (`stop()` restaura os originais). 8 testes (Rstest + jsdom).
- `shared`: `NetworkEventData` — union discriminada por `phase` (`request`/`response`/`error`), seguindo o mesmo padrão de `DomEventData`; validado em `isDebugEvent`.
- `shared`: event bus real (`createEventBus()` com `publish`/`subscribe`/`subscribeAll`), substituindo o stub `EventBusEvents`/`EventBus`.
- `shared`: `DebugEvent.data` tipado como union discriminada por `type`, começando por `DomEventData`/`DomTargetDescriptor`; demais domínios seguem `unknown` até seus adapters existirem.
- `shared`: validação de schema em runtime no ponto de `publish()` — evento inválido é reportado (`console.error`) e descartado, nunca lança.
- infra: workspace `pnpm` (`pnpm-workspace.yaml` + `package.json` raiz) em `application/`, pré-requisito pra linkar pacotes via `workspace:*`.
- `shared`: suíte de testes com Rstest cobrindo `createEventBus` e validação de schema.

> Nota histórica: uma versão anterior deste projeto (`@henriquecosta/react-debugmachine`,
> "React Time Machine", recorder/player de DOM e rede) chegou a publicar as
> versões `1.0.0`–`1.0.2`. Todo o código dessa versão foi removido do
> repositório; não é tratada como histórico de versão real do produto atual
> ("React Debug Machine"), apenas como contexto de origem.

<!-- Reference links: aponte para as URLs de comparação do seu repositório. -->

[Unreleased]: https://github.com/HenriqueCosta05/TimeMachine/commits/release/2.0
