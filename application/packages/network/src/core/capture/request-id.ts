let counter = 0;

export function createRequestId(): string {
    counter += 1;
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `net-${Date.now()}-${counter}`;
}
