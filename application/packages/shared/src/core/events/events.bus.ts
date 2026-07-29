import { DebugEvent } from "./events.types";
import { isDebugEvent } from "./events.schema";

type EventHandler = (event: DebugEvent) => void;

export function createEventBus() {
    const listeners = new Map<DebugEvent['type'], Set<EventHandler>>();
    const wildcardListeners = new Set<EventHandler>();

    function publish(event: DebugEvent): void {
        if (!isDebugEvent(event)) {
            console.error('[react-debug-machine] invalid event dropped:', event);
            return;
        }
        listeners.get(event.type)?.forEach((handler) => handler(event));
        wildcardListeners.forEach((handler) => handler(event));
    }

    function subscribe(type: DebugEvent['type'], handler: EventHandler): () => void {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type)!.add(handler);
        return () => listeners.get(type)?.delete(handler);
    }

    function subscribeAll(handler: EventHandler): () => void {
        wildcardListeners.add(handler);
        return () => wildcardListeners.delete(handler);
    }

    return { publish, subscribe, subscribeAll };
}

export type EventBus = ReturnType<typeof createEventBus>;
