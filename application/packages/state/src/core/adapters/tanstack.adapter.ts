import type { EventBus } from '@henriquecosta/react-debug-machine-shared';
import type { QueryCacheNotifyEvent, QueryClient } from '@tanstack/query-core';

export function startTanstackCapture(bus: EventBus, queryClient: QueryClient): () => void {
    // Assume que `query.state` é substituído (não mutado) a cada transição, como
    // o reducer interno do TanStack Query faz; guardar a referência é seguro.
    const previousStateByHash = new Map<string, unknown>();

    const unsubscribe = queryClient.getQueryCache().subscribe((event: QueryCacheNotifyEvent) => {
        const { query } = event;
        const hash = query.queryHash;
        const before = previousStateByHash.get(hash);
        const after = query.state;

        bus.publish({
            type: 'state',
            timestamp: performance.now(),
            data: { origin: 'tanstack', label: JSON.stringify(query.queryKey), before, after },
        });

        previousStateByHash.set(hash, after);
    });

    return function stopTanstackCapture(): void {
        unsubscribe();
        previousStateByHash.clear();
    };
}
