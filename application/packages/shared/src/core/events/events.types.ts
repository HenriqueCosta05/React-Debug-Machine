export type DomTargetDescriptor = {
    tagName: string;
    id: string | null;
    className: string | null;
    selectorPath: string;
};

export type DomEventData = {
    nativeType: string;
    target: DomTargetDescriptor;
};

export type NetworkRequestPhase = {
    phase: 'request';
    requestId: string;
    method: string;
    url: string;
};

export type NetworkResponsePhase = {
    phase: 'response';
    requestId: string;
    method: string;
    url: string;
    status: number;
    ok: boolean;
    durationMs: number;
};

export type NetworkErrorPhase = {
    phase: 'error';
    requestId: string;
    method: string;
    url: string;
    durationMs: number;
    message: string;
};

export type NetworkEventData = NetworkRequestPhase | NetworkResponsePhase | NetworkErrorPhase;

export type DebugEvent =
    | { type: 'dom'; data: DomEventData; timestamp: number }
    | { type: 'network'; data: NetworkEventData; timestamp: number }
    | { type: 'console'; data: unknown; timestamp: number }
    | { type: 'state'; data: unknown; timestamp: number }
    | { type: 'typescript'; data: unknown; timestamp: number }
    | { type: 'custom'; data: unknown; timestamp: number };
