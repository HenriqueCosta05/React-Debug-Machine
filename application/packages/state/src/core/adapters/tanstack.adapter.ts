import type { EventBus } from '@henriquecosta/react-debug-machine-shared';
import type { QueryCacheNotifyEvent, QueryClient } from '@tanstack/query-core';
import type { StateSetterRegistry } from '../registry/setter-registry';

export function startTanstackCapture(
    bus: EventBus,
    queryClient: QueryClient,
    registry?: StateSetterRegistry,
): () => void {
    // Assume que `query.state` é substituído (não mutado) a cada transição, como
    // o reducer interno do TanStack Query faz; guardar a referência é seguro.
    const previousStateByHash = new Map<string, unknown>();
    const unregisterFns: Array<() => void> = [];

    const unsubscribe = queryClient.getQueryCache().subscribe((event: QueryCacheNotifyEvent) => {
        const { query } = event;
        const hash = query.queryHash;
        const before = previousStateByHash.get(hash);
        const after = query.state;
        const label = JSON.stringify(query.queryKey);

        bus.publish({
            type: 'state',
            timestamp: performance.now(),
            data: { origin: 'tanstack', label, before, after },
        });

        previousStateByHash.set(hash, after);

        // setQueryData é a única escrita pública do TanStack Query pra forçar cache;
        // `after` é o QueryState inteiro, mas setQueryData só aceita o `data`.
        if (registry) {
            unregisterFns.push(
                registry.register(label, (next) => {
                    const nextData = (next as { data?: unknown } | undefined)?.data;
                    queryClient.setQueryData(query.queryKey, nextData);
                }),
            );
        }
    });

    return function stopTanstackCapture(): void {
        unsubscribe();
        previousStateByHash.clear();
        unregisterFns.forEach((unregister) => unregister());
    };
}
