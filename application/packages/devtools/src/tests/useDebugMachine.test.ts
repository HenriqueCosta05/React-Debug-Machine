import { describe, expect, it } from '@rstest/core';
import { act, createElement, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createDebugSession } from '@henriquecosta/react-debug-machine-shared';
import type { DebugSession, TimelineEntry } from '@henriquecosta/react-debug-machine-shared';
import { useDebugMachine } from '../core/hooks/useDebugMachine';

function publishDomEvent(session: DebugSession): void {
    session.bus.publish({
        type: 'dom',
        timestamp: performance.now(),
        data: {
            nativeType: 'click',
            target: { tagName: 'BUTTON', id: null, className: null, selectorPath: 'button' },
        },
    });
}

describe('useDebugMachine', () => {
    it('devolve lista vazia para sessão nova', () => {
        const session = createDebugSession();
        let result: readonly TimelineEntry[] = [{ type: 'custom', data: 'sentinel', timestamp: 0, sequence: 99 }];

        function TestComponent(): null {
            result = useDebugMachine(session).events;
            return null;
        }

        const container = document.createElement('div');
        const root = createRoot(container);
        act(() => { root.render(createElement(TestComponent)); });

        expect(result).toHaveLength(0);
        session.end();
    });

    it('re-renderiza com novo evento quando bus publica', () => {
        const session = createDebugSession();
        let result: readonly TimelineEntry[] = [];

        function TestComponent(): null {
            result = useDebugMachine(session).events;
            return null;
        }

        const container = document.createElement('div');
        const root = createRoot(container);
        act(() => { root.render(createElement(TestComponent)); });
        expect(result).toHaveLength(0);

        act(() => { publishDomEvent(session); });

        expect(result).toHaveLength(1);
        expect(result[0].type).toBe('dom');
        session.end();
    });

    it('clear() esvazia os eventos e atualiza o estado', () => {
        const session = createDebugSession();
        let result: readonly TimelineEntry[] = [];
        let clearFn = () => {};

        function TestComponent(): null {
            const { events, clear } = useDebugMachine(session);
            result = events;
            clearFn = clear;
            return null;
        }

        const container = document.createElement('div');
        const root = createRoot(container);
        act(() => { root.render(createElement(TestComponent)); });

        act(() => {
            publishDomEvent(session);
            publishDomEvent(session);
        });
        expect(result).toHaveLength(2);

        act(() => { clearFn(); });

        expect(result).toHaveLength(0);
        session.end();
    });

    it('acumula eventos de tipos diferentes em ordem', () => {
        const session = createDebugSession();
        let result: readonly TimelineEntry[] = [];

        function TestComponent(): null {
            result = useDebugMachine(session).events;
            return null;
        }

        const container = document.createElement('div');
        const root = createRoot(container);
        act(() => { root.render(createElement(TestComponent)); });

        act(() => {
            session.bus.publish({ type: 'console', timestamp: 1, data: { level: 'log', args: ['hello'] } });
            session.bus.publish({ type: 'state', timestamp: 2, data: { origin: 'react', label: 'x', before: 0, after: 1 } });
        });

        expect(result).toHaveLength(2);
        expect(result[0].type).toBe('console');
        expect(result[1].type).toBe('state');
        session.end();
    });

    it('nova sessão passada como prop recarrega eventos corretamente', () => {
        const session1 = createDebugSession();
        const session2 = createDebugSession();

        act(() => { publishDomEvent(session1); });

        let currentSession = session1;
        let result: readonly TimelineEntry[] = [];
        let setSession: (s: DebugSession) => void = () => {};

        function TestComponent(): null {
            const [s, setS] = useState<DebugSession>(() => currentSession);
            setSession = setS;
            result = useDebugMachine(s).events;
            return null;
        }

        const container = document.createElement('div');
        const root = createRoot(container);
        act(() => { root.render(createElement(TestComponent)); });

        expect(result).toHaveLength(1);

        act(() => { setSession(session2); });

        expect(result).toHaveLength(0);
        session1.end();
        session2.end();
    });
});
