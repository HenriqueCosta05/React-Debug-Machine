import { describe, expect, it, rstest } from '@rstest/core';
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import type { DebugEvent, ConsoleEventData } from '@henriquecosta/react-debug-machine-shared';
import { startConsoleCapture } from '../core/capture/console.capture';
import type { ConsoleTarget } from '../core/types/console.types';

function makeTarget(): ConsoleTarget {
    return {
        log: rstest.fn(),
        warn: rstest.fn(),
        error: rstest.fn(),
        info: rstest.fn(),
        debug: rstest.fn(),
    };
}

function consoleData(events: DebugEvent[]): ConsoleEventData[] {
    return events.map((event) => {
        if (event.type !== 'console') throw new Error('expected console event');
        return event.data;
    });
}

describe('startConsoleCapture', () => {
    it('não suprime log — método original é chamado com os args corretos', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const originalLog = target.log;

        startConsoleCapture(bus, target);
        target.log('hello', 42);

        expect(originalLog).toHaveBeenCalledWith('hello', 42);
    });

    it('publica evento console com level=log e args corretos', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const received: DebugEvent[] = [];
        bus.subscribe('console', (e) => received.push(e));

        startConsoleCapture(bus, target);
        target.log('hello', 42);

        const [data] = consoleData(received);
        expect(data.level).toBe('log');
        expect(data.args).toEqual(['hello', 42]);
    });

    it.each(['warn', 'error', 'info', 'debug'] as const)(
        'captura %s sem suprimir o método original',
        (level) => {
            const bus = createEventBus();
            const target = makeTarget();
            const originalMethod = target[level];
            const received: DebugEvent[] = [];
            bus.subscribe('console', (e) => received.push(e));

            startConsoleCapture(bus, target);
            target[level]('msg', level);

            expect(originalMethod).toHaveBeenCalledWith('msg', level);
            const [data] = consoleData(received);
            expect(data.level).toBe(level);
            expect(data.args).toEqual(['msg', level]);
        }
    );

    it('múltiplos args são todos capturados no evento', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const received: DebugEvent[] = [];
        bus.subscribe('console', (e) => received.push(e));

        startConsoleCapture(bus, target);
        target.error('a', 'b', 'c', 42, true);

        const [data] = consoleData(received);
        expect(data.args).toEqual(['a', 'b', 'c', 42, true]);
    });

    it('evento tem timestamp do tipo number', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const received: DebugEvent[] = [];
        bus.subscribe('console', (e) => received.push(e));

        startConsoleCapture(bus, target);
        target.warn('test');

        expect(typeof received[0].timestamp).toBe('number');
    });

    it('stop() restaura todos os métodos originais', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const savedLog = target.log;
        const savedWarn = target.warn;
        const savedError = target.error;
        const savedInfo = target.info;
        const savedDebug = target.debug;

        const stop = startConsoleCapture(bus, target);
        expect(target.log).not.toBe(savedLog);
        stop();

        expect(target.log).toBe(savedLog);
        expect(target.warn).toBe(savedWarn);
        expect(target.error).toBe(savedError);
        expect(target.info).toBe(savedInfo);
        expect(target.debug).toBe(savedDebug);
    });

    it('após stop(), chamadas não publicam mais eventos no bus', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const received: DebugEvent[] = [];
        bus.subscribe('console', (e) => received.push(e));

        const stop = startConsoleCapture(bus, target);
        stop();
        target.log('ignored');

        expect(received).toHaveLength(0);
    });

    it('args são capturados como cópia rasa do array (push posterior não afeta evento)', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const received: DebugEvent[] = [];
        bus.subscribe('console', (e) => received.push(e));

        startConsoleCapture(bus, target);
        target.log('stable');
        const argsAtCapture = consoleData(received)[0].args;

        expect(argsAtCapture).toEqual(['stable']);
        expect(argsAtCapture).toHaveLength(1);
    });
});
