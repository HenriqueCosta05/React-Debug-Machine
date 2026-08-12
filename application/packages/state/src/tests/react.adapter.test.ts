import { describe, expect, it, rstest } from '@rstest/core';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import { createUseDebugState, DebugStateSetter } from '../core/adapters/react.adapter';
import { createStateSetterRegistry } from '../core/registry/setter-registry';

describe('useDebugState', () => {
    it('publica before/after a cada update e se comporta como useState pro caller', () => {
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('state', handler);
        const useDebugState = createUseDebugState(bus);

        let setCount: DebugStateSetter<number> = () => {};
        let renderedValue = -1;
        function TestComponent(): null {
            const [count, setDebugCount] = useDebugState(0, 'count');
            renderedValue = count;
            setCount = setDebugCount;
            return null;
        }

        const container = document.createElement('div');
        const root = createRoot(container);
        act(() => {
            root.render(createElement(TestComponent));
        });
        expect(renderedValue).toBe(0);

        act(() => {
            setCount(1);
        });
        expect(renderedValue).toBe(1);
        expect(handler).toHaveBeenCalledWith(expect.objectContaining({
            type: 'state',
            data: { origin: 'react', label: 'count', before: 0, after: 1 },
        }));

        act(() => {
            setCount((prev) => prev + 1);
        });
        expect(renderedValue).toBe(2);
        expect(handler).toHaveBeenLastCalledWith(expect.objectContaining({
            data: { origin: 'react', label: 'count', before: 1, after: 2 },
        }));

        act(() => {
            root.unmount();
        });
    });

    it('com registry: registra o setter no mount e desregistra no unmount', () => {
        const bus = createEventBus();
        const registry = createStateSetterRegistry();
        const useDebugState = createUseDebugState(bus, registry);

        let renderedValue = -1;
        function TestComponent(): null {
            const [count] = useDebugState(0, 'count');
            renderedValue = count;
            return null;
        }

        const container = document.createElement('div');
        const root = createRoot(container);
        act(() => {
            root.render(createElement(TestComponent));
        });
        expect(renderedValue).toBe(0);
        expect(registry.get('count')).toBeDefined();

        act(() => {
            registry.get('count')?.(5);
        });
        expect(renderedValue).toBe(5);

        act(() => {
            root.unmount();
        });
        expect(registry.get('count')).toBeUndefined();
    });
});
