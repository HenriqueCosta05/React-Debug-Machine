import type { EventBus } from '@henriquecosta/react-debug-machine-shared';
import type { Store } from 'redux';

export function startReduxCapture(bus: EventBus, store: Store, label = 'store'): () => void {
    // Assume o contrato de imutabilidade do Redux: reducers retornam novo state,
    // então guardar a referência de `previousState` é seguro, sem cópia defensiva.
    let previousState = store.getState();

    const unsubscribe = store.subscribe(() => {
        const nextState = store.getState();
        bus.publish({
            type: 'state',
            timestamp: performance.now(),
            data: { origin: 'redux', label, before: previousState, after: nextState },
        });
        previousState = nextState;
    });

    return function stopReduxCapture(): void {
        unsubscribe();
    };
}
