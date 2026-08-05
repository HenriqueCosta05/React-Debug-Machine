import { ConsoleEventData, DebugEvent, DomEventData, DomTargetDescriptor, NetworkEventData, StateEventData } from "./events.types";

const EVENT_TYPES: ReadonlySet<DebugEvent['type']> = new Set([
    'dom', 'network', 'console', 'state', 'typescript', 'custom',
]);

const NETWORK_PHASES = new Set(['request', 'response', 'error']);
const STATE_ORIGINS = new Set(['react', 'redux', 'tanstack']);
const CONSOLE_LEVELS = new Set(['log', 'warn', 'error', 'info', 'debug']);

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

function isNetworkEventData(value: unknown): value is NetworkEventData {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    if (typeof v.phase !== 'string' || !NETWORK_PHASES.has(v.phase)) return false;
    if (typeof v.requestId !== 'string' || typeof v.method !== 'string' || typeof v.url !== 'string') return false;
    if (v.phase === 'response') return typeof v.status === 'number' && typeof v.ok === 'boolean' && typeof v.durationMs === 'number';
    if (v.phase === 'error') return typeof v.durationMs === 'number' && typeof v.message === 'string';
    return true;
}

function isStateEventData(value: unknown): value is StateEventData {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    return (
        typeof v.origin === 'string' && STATE_ORIGINS.has(v.origin) &&
        typeof v.label === 'string' &&
        'before' in v && 'after' in v
    );
}

function isConsoleEventData(value: unknown): value is ConsoleEventData {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    return typeof v.level === 'string' && CONSOLE_LEVELS.has(v.level) && Array.isArray(v.args);
}

export function isDebugEvent(value: unknown): value is DebugEvent {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    if (typeof v.timestamp !== 'number') return false;
    if (typeof v.type !== 'string' || !EVENT_TYPES.has(v.type as DebugEvent['type'])) return false;
    if (v.type === 'dom') return isDomEventData(v.data);
    if (v.type === 'network') return isNetworkEventData(v.data);
    if (v.type === 'state') return isStateEventData(v.data);
    if (v.type === 'console') return isConsoleEventData(v.data);
    return true;
}
