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

export type DebugEvent =
    | { type: 'dom'; data: DomEventData; timestamp: number }
    | { type: 'network'; data: unknown; timestamp: number }
    | { type: 'console'; data: unknown; timestamp: number }
    | { type: 'state'; data: unknown; timestamp: number }
    | { type: 'typescript'; data: unknown; timestamp: number }
    | { type: 'custom'; data: unknown; timestamp: number };
