# TODO

Live backlog. Remove items when done — this is not a changelog.

## Now

- [X] Recriar o workspace pnpm em `application/` (packages/* + demos/*) do zero
- [ ] Decidir o scope npm definitivo para os pacotes (PRD Q-01) — bloqueia M1 (`shared`)
- [ ] Validar viabilidade técnica do TypeScript Language Service rodando no browser (PRD Q-03 / RK-02) — bloqueia M5 (`types`), maior risco técnico do PRD

## Next

- [ ] M1 — Implementar `shared`: schema de eventos (R-01 a R-05) + event bus (todo o resto depende disso)
- [ ] M2 — Implementar adapter `dom-events` (R-01: captura de eventos DOM/React com timestamp e alvo)
- [ ] M2 — Implementar adapter `network` (R-04: captura fetch/XHR, correlacionar request/response) — maior precedente técnico do projeto anterior (fiber hooks, network-hook.ts)

## Later / ideas

- [ ] M3 — Implementar adapter `state`: React state / Redux / TanStack, um adapter por lib (R-02: diff de estado antes/depois com origem identificada)
- [ ] M4 — Implementar adapter `console`: interceptação de console.* sem suprimir comportamento original (R-03; só captura, sem replay)
- [ ] M5 — Implementar adapter `types`: diagnostics do TS Language Service ligados ao componente/estado de origem (R-05; bloqueado até validação de viabilidade acima)
- [ ] M6 — Implementar painel `devtools` unificando os 5 domínios (DOM, estado, console, rede, tipos) com timeline scrubber
- [ ] Definir metas concretas de overhead de runtime e bundle size (PRD Q-02, antes do v1.0)
- [ ] Definir paleta de cores e tipografia definitivas do painel (docs/DESIGN.md tem vários tokens marcados "a definir")
- [ ] Rodar benchmark de overhead da instrumentação desabilitada (RNF de performance do PRD, orçamento ainda a validar)

## Known issues
