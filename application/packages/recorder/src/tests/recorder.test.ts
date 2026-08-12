import { describe, expect, it } from '@rstest/core';
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import { createRecorder } from '../core/record/recorder';

describe('createRecorder', () => {
    it('captura só eventos publicados entre start() e stop()', () => {
        const bus = createEventBus();
        const recorder = createRecorder(bus);

        bus.publish({ type: 'console', timestamp: 1, data: { level: 'log', args: ['before'] } });
        recorder.start();
        bus.publish({ type: 'console', timestamp: 2, data: { level: 'log', args: ['during'] } });
        const recording = recorder.stop();
        bus.publish({ type: 'console', timestamp: 3, data: { level: 'log', args: ['after'] } });

        expect(recording.entries).toHaveLength(1);
        expect(recording.entries[0].data).toEqual({ level: 'log', args: ['during'] });
        expect(recording.entries[0].sequence).toBe(1);
    });

    it('start() enquanto já grava é no-op, não reinicia o buffer', () => {
        const bus = createEventBus();
        const recorder = createRecorder(bus);

        recorder.start();
        bus.publish({ type: 'console', timestamp: 1, data: { level: 'log', args: ['a'] } });
        recorder.start();
        bus.publish({ type: 'console', timestamp: 2, data: { level: 'log', args: ['b'] } });
        const recording = recorder.stop();

        expect(recording.entries).toHaveLength(2);
    });

    it('stop() sem gravação em andamento lança', () => {
        const bus = createEventBus();
        const recorder = createRecorder(bus);

        expect(() => recorder.stop()).toThrow();
    });

    it('getStatus() reflete idle -> recording -> stopped', () => {
        const bus = createEventBus();
        const recorder = createRecorder(bus);

        expect(recorder.getStatus()).toBe('idle');
        recorder.start();
        expect(recorder.getStatus()).toBe('recording');
        recorder.stop();
        expect(recorder.getStatus()).toBe('stopped');
    });
});
