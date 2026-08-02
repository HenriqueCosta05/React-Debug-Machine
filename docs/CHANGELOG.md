# Changelog

Todas as mudanças notáveis deste projeto são documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added

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
