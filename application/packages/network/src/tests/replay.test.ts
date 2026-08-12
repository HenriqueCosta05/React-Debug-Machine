import { describe, expect, it, rstest } from '@rstest/core';
import type { NetworkEventData } from '@henriquecosta/react-debug-machine-shared';
import { replayNetworkEvent } from '../core/replay/replay';

describe('replayNetworkEvent', () => {
    it('reexecuta a request usando method + url capturados', async () => {
        const fetchMock = rstest.fn(async (): Promise<Response> => new Response('ok', { status: 200 }));
        const fakeTarget = { fetch: fetchMock as unknown as typeof fetch };
        const data: NetworkEventData = { phase: 'request', requestId: 'r1', method: 'POST', url: '/api/orders' };

        const result = await replayNetworkEvent(data, fakeTarget);

        expect(result).toEqual({ ok: true });
        expect(fetchMock).toHaveBeenCalledWith('/api/orders', { method: 'POST' });
    });

    it('recusa reproduzir fases response/error (não são inputs replayáveis)', async () => {
        const fetchMock = rstest.fn(async (): Promise<Response> => new Response());
        const fakeTarget = { fetch: fetchMock as unknown as typeof fetch };
        const data: NetworkEventData = {
            phase: 'response',
            requestId: 'r1',
            method: 'GET',
            url: '/api/orders',
            status: 200,
            ok: true,
            durationMs: 12,
        };

        const result = await replayNetworkEvent(data, fakeTarget);

        expect(result).toEqual({ ok: false, reason: 'not-replayable-phase' });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('reporta falha sem lançar quando o fetch reexecutado rejeita', async () => {
        const fetchMock = rstest.fn(async (): Promise<Response> => {
            throw new Error('network down');
        });
        const fakeTarget = { fetch: fetchMock as unknown as typeof fetch };
        const data: NetworkEventData = { phase: 'request', requestId: 'r1', method: 'GET', url: '/api/users' };

        const result = await replayNetworkEvent(data, fakeTarget);

        expect(result).toEqual({ ok: false, reason: 'network down' });
    });
});
