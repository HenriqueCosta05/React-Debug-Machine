import { describe, expect, it } from '@rstest/core';
import { createDebugSession } from '../core/session/session';

describe('createDebugSession', () => {
    it('cria session com id único e startedAt', () => {
        const a = createDebugSession();
        const b = createDebugSession();

        expect(a.session.id).not.toBe(b.session.id);
        expect(typeof a.session.startedAt).toBe('number');
    });

    it('bus e timeline da sessão ficam ligados: publish reflete em getEvents', () => {
        const { bus, timeline } = createDebugSession();

        bus.publish({ type: 'console', timestamp: 1, data: 'log line' });

        expect(timeline.getEvents()).toHaveLength(1);
    });

    it('end() para a timeline de registrar novos eventos', () => {
        const { bus, timeline, end } = createDebugSession();

        end();
        bus.publish({ type: 'console', timestamp: 1, data: 'log line' });

        expect(timeline.getEvents()).toEqual([]);
    });

    it('duas sessões têm bus/timeline independentes', () => {
        const a = createDebugSession();
        const b = createDebugSession();

        a.bus.publish({ type: 'console', timestamp: 1, data: 'a' });

        expect(a.timeline.getEvents()).toHaveLength(1);
        expect(b.timeline.getEvents()).toHaveLength(0);
    });
});
