import { describe, expect, it, rstest } from '@rstest/core';
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import type { DebugEvent, NetworkEventData } from '@henriquecosta/react-debug-machine-shared';
import { startFetchCapture } from '../core/capture/fetch.capture';

function networkData(events: DebugEvent[]): NetworkEventData[] {
    return events.map((event) => {
        if (event.type !== 'network') throw new Error('expected network event');
        return event.data;
    });
}

describe('startFetchCapture', () => {
    it('publica request e response correlacionados pelo mesmo requestId', async () => {
        const bus = createEventBus();
        const received: DebugEvent[] = [];
        bus.subscribe('network', (event) => received.push(event));
        const fetchMock = rstest.fn(async (): Promise<Response> => new Response('ok', { status: 200 }));
        const fakeTarget = { fetch: fetchMock as unknown as typeof fetch };

        const stop = startFetchCapture(bus, fakeTarget);
        await fakeTarget.fetch('/api/users', { method: 'GET' });
        stop();

        const [request, response] = networkData(received);
        expect(request.phase).toBe('request');
        expect(response.phase).toBe('response');
        expect(response.requestId).toBe(request.requestId);
        if (response.phase === 'response') {
            expect(response.status).toBe(200);
            expect(response.ok).toBe(true);
        }
    });

    it('publica fase error e relança o erro original quando o fetch rejeita', async () => {
        const bus = createEventBus();
        const received: DebugEvent[] = [];
        bus.subscribeAll((event) => received.push(event));
        const fetchMock = rstest.fn(async (): Promise<Response> => {
            throw new Error('network down');
        });
        const fakeTarget = { fetch: fetchMock as unknown as typeof fetch };

        startFetchCapture(bus, fakeTarget);

        await expect(fakeTarget.fetch('/api/users')).rejects.toThrow('network down');
        const [, errorPhase] = networkData(received);
        expect(errorPhase.phase).toBe('error');
        if (errorPhase.phase === 'error') {
            expect(errorPhase.message).toBe('network down');
        }
    });

    it('stop() restaura o fetch original', async () => {
        const originalFetch = rstest.fn(async (): Promise<Response> => new Response());
        const fakeTarget = { fetch: originalFetch as unknown as typeof fetch };
        const bus = createEventBus();

        const stop = startFetchCapture(bus, fakeTarget);
        expect(fakeTarget.fetch).not.toBe(originalFetch);
        stop();
        expect(fakeTarget.fetch).toBe(originalFetch);
    });
});
