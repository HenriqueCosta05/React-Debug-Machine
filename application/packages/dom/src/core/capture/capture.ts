import type { EventBus } from '@henriquecosta/react-debug-machine-shared';
import { isDebugMachineIgnored } from '@henriquecosta/react-debug-machine-shared';
import type { CaptureOptions } from '../types/capture.types';
import { DEFAULT_EVENT_TYPES } from '../constants/events';
import { serializeTarget } from './target';

export function startDomCapture(bus: EventBus, options: CaptureOptions = {}): () => void {
    const documentRef = options.documentRef ?? document;
    const eventTypes = options.eventTypes ?? DEFAULT_EVENT_TYPES;
    const rootRegistry = options.rootRegistry;
    const cursorPosition = { x: 0, y: 0 };

    documentRef.addEventListener('mousemove', (event) => {
        cursorPosition.x = event.clientX;
        cursorPosition.y = event.clientY;
    });

    function handleEvent(nativeEvent: Event): void {
        const target = nativeEvent.target;
        if (!(target instanceof Element)) return;
        if (rootRegistry && !rootRegistry.isWithinRegisteredRoot(target)) return;
        if (isDebugMachineIgnored(target)) return;

        bus.publish({
            type: 'dom',
            timestamp: performance.now(),
            data: {
                nativeType: nativeEvent.type,
                target: serializeTarget(target)
            },
        });
    }

    // capture-phase no document dispara antes do listener delegado do React (anexado
    // no root container, um descendente do document), então funciona em qualquer
    // versão de React e também em apps sem React.
    eventTypes.forEach((eventType) => {
        documentRef.addEventListener(eventType, handleEvent, { capture: true });
    });

    return function stopDomCapture(): void {
        eventTypes.forEach((eventType) => {
            documentRef.removeEventListener(eventType, handleEvent, { capture: true });
        });
    };
}
