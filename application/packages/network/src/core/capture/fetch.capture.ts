import type { EventBus } from '@henriquecosta/react-debug-machine-shared';
import type { FetchTarget } from '../types/fetch.types';
import { createRequestId } from './request-id';

export function startFetchCapture(bus: EventBus, target: FetchTarget = globalThis): () => void {
    const originalFetch = target.fetch;

    target.fetch = async function patchedFetch(...args: Parameters<typeof fetch>): Promise<Response> {
        const requestId = createRequestId();
        const [input, init] = args;
        const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
        const url = input instanceof Request ? input.url : String(input);
        const startedAt = performance.now();

        bus.publish({
            type: 'network',
            timestamp: startedAt,
            data: { phase: 'request', requestId, method, url },
        });

        try {
            // .apply(target, args) preserva o `this` original (necessário pro fetch nativo
            // em alguns runtimes) sem alterar a identidade de `originalFetch`, que precisa
            // continuar === à função pré-patch pra restore funcionar.
            const response = await originalFetch.apply(target, args);
            bus.publish({
                type: 'network',
                timestamp: performance.now(),
                data: {
                    phase: 'response',
                    requestId,
                    method,
                    url,
                    status: response.status,
                    ok: response.ok,
                    durationMs: performance.now() - startedAt,
                },
            });
            return response;
        } catch (error) {
            bus.publish({
                type: 'network',
                timestamp: performance.now(),
                data: {
                    phase: 'error',
                    requestId,
                    method,
                    url,
                    durationMs: performance.now() - startedAt,
                    message: error instanceof Error ? error.message : String(error),
                },
            });
            throw error;
        }
    };

    return function stopFetchCapture(): void {
        target.fetch = originalFetch;
    };
}
