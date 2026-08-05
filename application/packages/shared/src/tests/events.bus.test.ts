import { describe, expect, it, rstest } from '@rstest/core';
import { createEventBus } from '../core/events/events.bus';
import { DebugEvent } from '../core/events/events.types';

const consoleEvent: DebugEvent = { type: 'console', timestamp: 1, data: { level: 'log', args: ['log line'] } };
const networkEvent: DebugEvent = {
    type: 'network',
    timestamp: 2,
    data: { phase: 'response', requestId: 'r1', method: 'GET', url: '/api/users', status: 200, ok: true, durationMs: 12 },
};

describe('createEventBus', () => {
    it('entrega evento só pro subscriber do type correspondente', () => {
        const bus = createEventBus();
        const consoleHandler = rstest.fn();
        const networkHandler = rstest.fn();
        bus.subscribe('console', consoleHandler);
        bus.subscribe('network', networkHandler);

        bus.publish(consoleEvent);

        expect(consoleHandler).toHaveBeenCalledWith(consoleEvent);
        expect(networkHandler).not.toHaveBeenCalled();
    });

    it('subscribeAll recebe eventos de qualquer type', () => {
        const bus = createEventBus();
        const wildcardHandler = rstest.fn();
        bus.subscribeAll(wildcardHandler);

        bus.publish(consoleEvent);
        bus.publish(networkEvent);

        expect(wildcardHandler).toHaveBeenNthCalledWith(1, consoleEvent);
        expect(wildcardHandler).toHaveBeenNthCalledWith(2, networkEvent);
    });

    it('unsubscribe (retorno de subscribe) para de receber eventos', () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        const unsubscribe = bus.subscribe('console', handler);

        unsubscribe();
        bus.publish(consoleEvent);

        expect(handler).not.toHaveBeenCalled();
    });

    it('evento inválido é descartado e reportado, nunca lança', () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribeAll(handler);
        const errorSpy = rstest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => bus.publish({ type: 'dom', timestamp: 1, data: {} } as unknown as DebugEvent)).not.toThrow();

        expect(handler).not.toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
