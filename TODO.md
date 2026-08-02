# TODO

Live backlog. Itens concluídos migram pra "Concluído" com check, não são removidos.

## Now

- [ ] M2 — `dom`: pacote está vazio (nenhum arquivo) — criar do zero: `package.json`, `tsconfig.json` (`lib: ["ES2022", "DOM"]`), `rslib.config.ts` (usar `shared` como referência de estrutura)
- [ ] M2 — `dom`: capture/ — listener em capture-phase no `document` (funciona antes do listener delegado do React em qualquer versão/root, e em apps não-React), serialização de target sem reter referência viva ao `Element`, publish no bus com timestamp via `performance.now()`
- [ ] M2 — `dom`: roots/registry.ts — root-awareness opt-in via `Element.contains()`, sem introspecção de fiber (fica fora de escopo, é trabalho do futuro adapter `state`)
- [ ] M2 — `dom`: replay/ — reconstrução de `Event` por tipo + `dispatchEvent`, limitações documentadas (isTrusted sempre false, selectorPath obsoleto falha graciosamente)
- [ ] M2 — `dom`: testes unit + jsdom com Rstest (E2E Playwright adiado — bloqueado por `application/demos/demo` estar vazio)
- [ ] M2 — Implementar adapter `network` (R-04: captura fetch/XHR, correlacionar request/response) — maior precedente técnico do projeto anterior (fiber hooks, network-hook.ts)
- [ ] docs: atualizar `docs/CONVENTIONS.md` §2.4 — pacote real é `dom` (não `dom-events` como documentado)
- [ ] docs: reconciliar padrão de nome de pacote npm — `CONVENTIONS.md` §2.3 diz `react-debugmachine-<pacote>`, mas `shared` publicado usa `react-debug-machine-shared` (com hífen extra); decidir um e alinhar os dois
- [ ] docs: `README.md` Quick start diz que `application/` "ainda não existe" — já existe, `shared` builda e testa com Rstest; atualizar Quick start
- [ ] docs/scope: `CONVENTIONS.md` §2.4 lista `shared` como dono de "schema de eventos, event bus, modelo de timeline/sessão" — timeline/sessão ainda não implementado nem rastreado como item próprio; decidir se entra no M1 (reabrir) ou se `devtools` (M6) monta a timeline direto a partir do bus, sem esse modelo em `shared`

## Concluído

- [x] M1 — infra: criar `pnpm-workspace.yaml` + `package.json` raiz em `application/` (pré-requisito pra linkar `dom` ↔ `shared` via `workspace:*`)
- [x] M1 — `shared`: substituir stub `EventBusEvents`/`EventBus` por bus real (`createEventBus()` com `publish`/`subscribe`/`subscribeAll`), removendo `EventBusType`/`originalFn`/`replayFn` (abstração prematura)
- [x] M1 — `shared`: tipar `DebugEvent.data` como union discriminada por `type`, começando por `DomEventData`/`DomTargetDescriptor` (R-01); demais domínios ficam `unknown` até seus adapters existirem
- [x] M1 — `shared`: validação de schema em runtime no ponto de `publish()` (type guards, sem lib nova), evento inválido é reportado e descartado, nunca lança
- [x] M1 — `shared`: decidir runner de teste — Rstest (par nativo do `rslib`/rspack já adotado no build), suíte cobrindo `createEventBus`/validação de schema (10 testes)

## Later / ideas

- [ ] M3 — Implementar adapter `state`: React state / Redux / TanStack, um adapter por lib (R-02: diff de estado antes/depois com origem identificada)
- [ ] M4 — Implementar adapter `console`: interceptação de console.* sem suprimir comportamento original (R-03; só captura, sem replay)
- [ ] M5 — Implementar adapter `types`: diagnostics do TS Language Service ligados ao componente/estado de origem (R-05; bloqueado até validação de viabilidade acima)
- [ ] M6 — Implementar painel `devtools` unificando os 5 domínios (DOM, estado, console, rede, tipos) com timeline scrubber
- [ ] Definir metas concretas de overhead de runtime e bundle size (PRD Q-02, antes do v1.0)
- [ ] Rodar benchmark de overhead da instrumentação desabilitada (RNF de performance do PRD, orçamento ainda a validar)

## Known issues
