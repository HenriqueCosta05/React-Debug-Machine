import { describe, expect, it, rstest } from '@rstest/core';
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import type { DebugEvent, NetworkEventData } from '@henriquecosta/react-debug-machine-shared';
import { startXhrCapture } from '../core/capture/xhr.capture';

class FakeXMLHttpRequest extends EventTarget {
    status = 0;
    openCalls: unknown[][] = [];
    sendCalls: unknown[][] = [];

    open(...args: unknown[]): void {
        this.openCalls.push(args);
    }

    send(...args: unknown[]): void {
        this.sendCalls.push(args);
    }
}

const FakeXhrConstructor = FakeXMLHttpRequest as unknown as typeof XMLHttpRequest;

function networkData(events: DebugEvent[]): NetworkEventData[] {
    return events.map((event) => {
        if (event.type !== 'network') throw new Error('expected network event');
        return event.data;
    });
}

describe('startXhrCapture', () => {
    it('publica request no send() e response no loadend com status 2xx', () => {
        const bus = createEventBus();
        const received: DebugEvent[] = [];
        bus.subscribeAll((event) => received.push(event));

        const stop = startXhrCapture(bus, FakeXhrConstructor);
        const xhr = new FakeXMLHttpRequest();
        xhr.open('GET', '/api/users');
        xhr.send();
        xhr.status = 200;
        xhr.dispatchEvent(new Event('loadend'));
        stop();

        const [request, response] = networkData(received);
        expect(request.phase).toBe('request');
        expect(request.method).toBe('GET');
        expect(response.phase).toBe('response');
        expect(response.requestId).toBe(request.requestId);
        if (response.phase === 'response') {
            expect(response.status).toBe(200);
            expect(response.ok).toBe(true);
        }
    });

    it('publica fase error quando status permanece 0 no loadend (falha/abort)', () => {
        const bus = createEventBus();
        const received: DebugEvent[] = [];
        bus.subscribeAll((event) => received.push(event));

        const stop = startXhrCapture(bus, FakeXhrConstructor);
        const xhr = new FakeXMLHttpRequest();
        xhr.open('POST', '/api/users');
        xhr.send();
        xhr.dispatchEvent(new Event('loadend'));
        stop();

        const [, errorPhase] = networkData(received);
        expect(errorPhase.phase).toBe('error');
    });

    it('send() sem open() prévio não publica evento e ainda delega pro send original', () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribeAll(handler);

        const stop = startXhrCapture(bus, FakeXhrConstructor);
        const xhr = new FakeXMLHttpRequest();
        xhr.send();
        stop();

        expect(handler).not.toHaveBeenCalled();
        expect(xhr.sendCalls).toHaveLength(1);
    });

    it('stop() restaura open/send originais no prototype', () => {
        const bus = createEventBus();
        const originalOpen = FakeXhrConstructor.prototype.open;
        const originalSend = FakeXhrConstructor.prototype.send;

        const stop = startXhrCapture(bus, FakeXhrConstructor);
        expect(FakeXhrConstructor.prototype.open).not.toBe(originalOpen);

        stop();

        expect(FakeXhrConstructor.prototype.open).toBe(originalOpen);
        expect(FakeXhrConstructor.prototype.send).toBe(originalSend);
    });
});
