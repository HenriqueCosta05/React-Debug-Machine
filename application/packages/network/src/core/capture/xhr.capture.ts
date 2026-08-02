import type { EventBus } from '@henriquecosta/react-debug-machine-shared';
import type { XhrCaptureState } from '../types/xhr.types';
import { createRequestId } from './request-id';

const stateByXhr = new WeakMap<XMLHttpRequest, XhrCaptureState>();

type XhrOpen = (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    async: boolean,
    username?: string | null,
    password?: string | null,
) => void;

export function startXhrCapture(bus: EventBus, target: typeof XMLHttpRequest = XMLHttpRequest): () => void {
    const originalOpen = target.prototype.open;
    const originalSend = target.prototype.send;
    // TS não resolve overloads via .call()/.apply(); cast pra forma canônica de 5 args,
    // que é o único jeito que este adapter invoca `open`.
    const callOriginalOpen = originalOpen as unknown as XhrOpen;

    target.prototype.open = function patchedOpen(
        this: XMLHttpRequest,
        method: string,
        url: string | URL,
        async: boolean = true,
        username?: string | null,
        password?: string | null,
    ): void {
        stateByXhr.set(this, {
            requestId: createRequestId(),
            method: method.toUpperCase(),
            url: String(url),
            startedAt: 0,
        });
        callOriginalOpen.call(this, method, url, async, username, password);
    };

    target.prototype.send = function patchedSend(
        this: XMLHttpRequest,
        ...args: Parameters<XMLHttpRequest['send']>
    ): void {
        const state = stateByXhr.get(this);
        if (!state) {
            originalSend.apply(this, args);
            return;
        }

        state.startedAt = performance.now();
        bus.publish({
            type: 'network',
            timestamp: state.startedAt,
            data: { phase: 'request', requestId: state.requestId, method: state.method, url: state.url },
        });

        this.addEventListener('loadend', () => {
            const durationMs = performance.now() - state.startedAt;
            if (this.status === 0) {
                bus.publish({
                    type: 'network',
                    timestamp: performance.now(),
                    data: {
                        phase: 'error',
                        requestId: state.requestId,
                        method: state.method,
                        url: state.url,
                        durationMs,
                        message: 'request failed or was aborted',
                    },
                });
                return;
            }
            bus.publish({
                type: 'network',
                timestamp: performance.now(),
                data: {
                    phase: 'response',
                    requestId: state.requestId,
                    method: state.method,
                    url: state.url,
                    status: this.status,
                    ok: this.status >= 200 && this.status < 300,
                    durationMs,
                },
            });
        });

        originalSend.apply(this, args);
    };

    return function stopXhrCapture(): void {
        target.prototype.open = originalOpen;
        target.prototype.send = originalSend;
    };
}
