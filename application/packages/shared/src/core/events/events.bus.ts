import { DebugEvent } from "./events.types";
import { isDebugEvent } from "./events.schema";

type EventHandler = (event: DebugEvent) => void;

function eventDataKey(event: DebugEvent, index: number): string {
    try {
        return `${event.type}-${JSON.stringify(event.data)}`;
    } catch {
        return `unserializable-${index}`;
    }
}

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

    function filterDuplicateEvents(events: readonly DebugEvent[]): DebugEvent[] {
        const seen = new Set<string>();
        return events.filter((event, index) => {
            const key = eventDataKey(event, index);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    function isDuplicateEvent(events: readonly DebugEvent[]): boolean {
        return filterDuplicateEvents(events).length !== events.length;
    }

    return { publish, subscribe, subscribeAll, isDuplicateEvent, filterDuplicateEvents };
}

export type EventBus = ReturnType<typeof createEventBus>;
