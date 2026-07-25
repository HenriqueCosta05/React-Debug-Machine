export type DebugEvent = {
    type: 'dom' | 'network' | 'console' | 'state' | 'typescript' | 'custom';
    data: unknown;
    timestamp: number;
}

export type EventBusType = {
    origin: DebugEvent['type'];
    originalFn: (event: DebugEvent) => unknown;
    replayFn: (event: DebugEvent) => unknown;
}