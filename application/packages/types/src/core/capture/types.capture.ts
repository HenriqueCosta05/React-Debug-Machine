import type { EventBus, TypesEventData } from '@henriquecosta/react-debug-machine-shared';
import type { TypesCaptureTarget } from '../types/types.types';

/**
 * Custom DOM event name used to inject diagnostics from external tooling
 * (build plugins, tsc watchers, IDE extensions) into the debug session.
 * Dispatch via: window.dispatchEvent(new CustomEvent(DIAGNOSTIC_EVENT, { detail: diagnostic }))
 */
export const TYPES_DIAGNOSTIC_EVENT = 'react-debug-machine:typescript-diagnostic';

/**
 * Listens for TypeScript diagnostics dispatched on `target` and forwards
 * them to the event bus. Returns a cleanup function that removes the listener.
 *
 * Diagnostics arrive via a CustomEvent whose `detail` must conform to
 * TypesEventData. Invalid details are silently dropped by bus.publish's
 * schema validation.
 */
export function startTypesCapture(
    bus: EventBus,
    target: TypesCaptureTarget = window,
): () => void {
    function handleDiagnostic(event: Event): void {
        if (!(event instanceof CustomEvent)) return;
        bus.publish({
            type: 'typescript',
            timestamp: performance.now(),
            data: (event as CustomEvent<TypesEventData>).detail,
        });
    }

    target.addEventListener(TYPES_DIAGNOSTIC_EVENT, handleDiagnostic);
    return () => target.removeEventListener(TYPES_DIAGNOSTIC_EVENT, handleDiagnostic);
}

/**
 * Directly publishes a TypeScript diagnostic to the bus without going
 * through the DOM event. Use this for programmatic injection (e.g., from
 * a build plugin that runs in the same JS context).
 */
export function publishTypeDiagnostic(bus: EventBus, data: TypesEventData): void {
    bus.publish({
        type: 'typescript',
        timestamp: performance.now(),
        data,
    });
}
