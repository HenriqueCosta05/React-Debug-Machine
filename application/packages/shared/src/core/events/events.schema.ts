import { DebugEvent, DomEventData, DomTargetDescriptor } from "./events.types";

const EVENT_TYPES: ReadonlySet<DebugEvent['type']> = new Set([
    'dom', 'network', 'console', 'state', 'typescript', 'custom',
]);

function isDomTargetDescriptor(value: unknown): value is DomTargetDescriptor {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    return (
        typeof v.tagName === 'string' &&
        (typeof v.id === 'string' || v.id === null) &&
        (typeof v.className === 'string' || v.className === null) &&
        typeof v.selectorPath === 'string'
    );
}

function isDomEventData(value: unknown): value is DomEventData {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    return typeof v.nativeType === 'string' && isDomTargetDescriptor(v.target);
}

export function isDebugEvent(value: unknown): value is DebugEvent {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    if (typeof v.timestamp !== 'number') return false;
    if (typeof v.type !== 'string' || !EVENT_TYPES.has(v.type as DebugEvent['type'])) return false;
    if (v.type === 'dom') return isDomEventData(v.data);
    return true;
}
