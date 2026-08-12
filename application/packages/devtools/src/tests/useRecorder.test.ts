import { describe, expect, it, rstest } from '@rstest/core';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { createDebugSession } from '@henriquecosta/react-debug-machine-shared';
import type { DebugSession } from '@henriquecosta/react-debug-machine-shared';
import type { ReplayerRegistry } from '@henriquecosta/react-debug-machine-recorder';
import { useRecorder, UseRecorderResult } from '../core/hooks/useRecorder';

function publishConsoleEvent(session: DebugSession, arg: string): void {
    session.bus.publish({ type: 'console', timestamp: performance.now(), data: { level: 'log', args: [arg] } });
}

function renderRecorder(session: DebugSession, replayers: ReplayerRegistry = {}) {
    let result: UseRecorderResult | null = null;
    function TestComponent(): null {
        result = useRecorder(session, replayers);
        return null;
    }
    const container = document.createElement('div');
    const root = createRoot(container);
    act(() => { root.render(createElement(TestComponent)); });
    return {
        get current() {
            if (!result) throw new Error('not rendered');
            return result;
        },
        unmount: () => act(() => root.unmount()),
    };
}

describe('useRecorder', () => {
    it('só acumula eventos entre start() e stop(), status reflete o ciclo', () => {
        const session = createDebugSession();
        const view = renderRecorder(session);

        expect(view.current.status).toBe('idle');

        act(() => { view.current.start(); });
        expect(view.current.status).toBe('recording');

        act(() => { publishConsoleEvent(session, 'during'); });

        act(() => { view.current.stop(); });
        expect(view.current.status).toBe('stopped');
        expect(view.current.recording?.entries).toHaveLength(1);

        session.end();
        view.unmount();
    });

    it('play() despacha pro replayer registrado, export/import faz round-trip', () => {
        const session = createDebugSession();
        const consoleReplayer = rstest.fn(() => ({ ok: true as const }));
        const view = renderRecorder(session, { console: consoleReplayer });

        act(() => { view.current.start(); });
        act(() => { publishConsoleEvent(session, 'hi'); });
        act(() => { view.current.stop(); });

        const json = view.current.exportJson();
        expect(json).toBeTruthy();

        act(() => { view.current.play(); });
        expect(view.current.isPlaying).toBe(true);

        act(() => { view.current.importJson(json as string); });
        expect(view.current.status).toBe('stopped');
        expect(view.current.recording?.entries).toHaveLength(1);

        session.end();
        view.unmount();
    });
});
