import type { EventBus } from '@henriquecosta/react-debug-machine-shared';
import type { Store } from 'redux';

/**
 * `sliceKeys` opcional: chaves top-level do state pra publicar 1 evento por slice
 * (`before`/`after` só daquela chave) em vez de 1 evento com o state inteiro.
 * Sem middleware/enhancer — só funciona pra state que já é um objeto plano
 * (ex.: `combineReducers`); quem sabe quais chaves são slices é o chamador,
 * o adapter não tem como inferir isso a partir da store (ADR-004).
 */
export function startReduxCapture(
    bus: EventBus,
    store: Store,
    label = 'store',
    sliceKeys?: readonly string[],
): () => void {
    // Assume o contrato de imutabilidade do Redux: reducers retornam novo state,
    // então guardar a referência de `previousState` é seguro, sem cópia defensiva.
    let previousState = store.getState();

    const unsubscribe = store.subscribe(() => {
        const nextState = store.getState();
        if (sliceKeys) {
            publishSliceDiff(bus, label, previousState, nextState, sliceKeys);
        } else {
            bus.publish({
                type: 'state',
                timestamp: performance.now(),
                data: { origin: 'redux', label, before: previousState, after: nextState },
            });
        }
        previousState = nextState;
    });

    return function stopReduxCapture(): void {
        unsubscribe();
    };
}

function publishSliceDiff(
    bus: EventBus,
    label: string,
    previousState: Record<string, unknown>,
    nextState: Record<string, unknown>,
    sliceKeys: readonly string[],
): void {
    for (const key of sliceKeys) {
        const before = previousState[key];
        const after = nextState[key];
        if (Object.is(before, after)) continue;
        bus.publish({
            type: 'state',
            timestamp: performance.now(),
            data: { origin: 'redux', label: `${label}.${key}`, before, after },
        });
    }
}
