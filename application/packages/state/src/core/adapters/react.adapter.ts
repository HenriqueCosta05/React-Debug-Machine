import { useCallback, useState } from 'react';
import type { EventBus } from '@henriquecosta/react-debug-machine-shared';

export type DebugStateSetter<T> = (next: T | ((prev: T) => T)) => void;

// Envelopa useState em vez de introspeccionar fiber (ADR-004 em CONVENTIONS.md):
// internals do React não são API pública e mudam de shape entre versões (RK-01).
// Opt-in: a app hospedeira troca useState por useDebugState onde quiser visibilidade.
export function createUseDebugState(bus: EventBus) {
    return function useDebugState<T>(initialValue: T, label: string): [T, DebugStateSetter<T>] {
        const [value, setValue] = useState(initialValue);

        const setDebugValue = useCallback<DebugStateSetter<T>>((next) => {
            setValue((prev) => {
                const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
                bus.publish({
                    type: 'state',
                    timestamp: performance.now(),
                    data: { origin: 'react', label, before: prev, after: resolved },
                });
                return resolved;
            });
        }, [bus, label]);

        return [value, setDebugValue];
    };
}
