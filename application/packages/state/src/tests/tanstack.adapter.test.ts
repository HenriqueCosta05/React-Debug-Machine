import { describe, expect, it, rstest } from '@rstest/core';
import { QueryClient } from '@tanstack/query-core';
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import { startTanstackCapture } from '../core/adapters/tanstack.adapter';
import { createStateSetterRegistry } from '../core/registry/setter-registry';

describe('startTanstackCapture', () => {
    it('publica before undefined na primeira transição e after com os dados carregados', async () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('state', handler);
        const queryClient = new QueryClient();

        startTanstackCapture(bus, queryClient);
        await queryClient.fetchQuery({ queryKey: ['todos'], queryFn: () => Promise.resolve(['a']) });

        expect(handler).toHaveBeenCalled();
        const firstCall = handler.mock.calls[0]?.[0];
        expect(firstCall.data.origin).toBe('tanstack');
        expect(firstCall.data.label).toBe(JSON.stringify(['todos']));
        expect(firstCall.data.before).toBeUndefined();

        const lastCall = handler.mock.calls.at(-1)?.[0];
        expect(lastCall.data.after.data).toEqual(['a']);
    });

    it('segunda transição da mesma query usa o state anterior como before', async () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('state', handler);
        const queryClient = new QueryClient();

        startTanstackCapture(bus, queryClient);
        await queryClient.fetchQuery({ queryKey: ['todos'], queryFn: () => Promise.resolve(['a']) });
        await queryClient.fetchQuery({ queryKey: ['todos'], queryFn: () => Promise.resolve(['a', 'b']) });

        const lastCall = handler.mock.calls.at(-1)?.[0];
        expect(lastCall.data.before.data).toEqual(['a']);
        expect(lastCall.data.after.data).toEqual(['a', 'b']);
    });

    it('stop() cancela o subscribe: nova query não publica', async () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('state', handler);
        const queryClient = new QueryClient();

        const stop = startTanstackCapture(bus, queryClient);
        stop();
        await queryClient.fetchQuery({ queryKey: ['todos'], queryFn: () => Promise.resolve(['a']) });

        expect(handler).not.toHaveBeenCalled();
    });

    it('com registry: registra setter que reaplica data via setQueryData', async () => {
        const bus = createEventBus();
        const queryClient = new QueryClient();
        const registry = createStateSetterRegistry();

        startTanstackCapture(bus, queryClient, registry);
        await queryClient.fetchQuery({ queryKey: ['todos'], queryFn: () => Promise.resolve(['a']) });

        const label = JSON.stringify(['todos']);
        const setter = registry.get(label);
        expect(setter).toBeDefined();

        setter?.({ data: ['replayed'] });
        expect(queryClient.getQueryData(['todos'])).toEqual(['replayed']);
    });
});
