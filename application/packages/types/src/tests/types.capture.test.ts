import { describe, expect, it } from '@rstest/core';
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import type { DebugEvent, TypesEventData } from '@henriquecosta/react-debug-machine-shared';
import { startTypesCapture, publishTypeDiagnostic, TYPES_DIAGNOSTIC_EVENT } from '../core/capture/types.capture';

function makeTarget() {
    const listeners = new Map<string, EventListenerOrEventListenerObject[]>();
    return {
        addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
            if (!listeners.has(type)) listeners.set(type, []);
            listeners.get(type)!.push(listener);
        },
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
            const list = listeners.get(type);
            if (!list) return;
            const idx = list.indexOf(listener);
            if (idx !== -1) list.splice(idx, 1);
        },
        dispatch(event: Event) {
            const list = listeners.get(event.type) ?? [];
            for (const l of list) {
                if (typeof l === 'function') l(event);
                else l.handleEvent(event);
            }
        },
        listenerCount(type: string): number {
            return listeners.get(type)?.length ?? 0;
        },
    };
}

const validDiagnostic: TypesEventData = {
    severity: 'error',
    code: 2345,
    message: "Argument of type 'string' is not assignable to parameter of type 'number'.",
    file: 'src/App.tsx',
    line: 42,
    column: 10,
};

describe('startTypesCapture', () => {
    it('publica evento typescript ao receber CustomEvent com detail válido', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const received: DebugEvent[] = [];
        bus.subscribe('typescript', (e) => received.push(e));

        startTypesCapture(bus, target);
        target.dispatch(new CustomEvent(TYPES_DIAGNOSTIC_EVENT, { detail: validDiagnostic }));

        expect(received).toHaveLength(1);
        expect(received[0].type).toBe('typescript');
        const data = received[0].data as TypesEventData;
        expect(data.severity).toBe('error');
        expect(data.code).toBe(2345);
        expect(data.message).toContain('string');
    });

    it('não publica evento se o detail for um diagnóstico inválido (schema falha)', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const received: DebugEvent[] = [];
        bus.subscribeAll((e) => received.push(e));

        startTypesCapture(bus, target);
        target.dispatch(new CustomEvent(TYPES_DIAGNOSTIC_EVENT, { detail: { broken: true } }));

        expect(received).toHaveLength(0);
    });

    it('ignora eventos que não são CustomEvent', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const received: DebugEvent[] = [];
        bus.subscribeAll((e) => received.push(e));

        startTypesCapture(bus, target);
        target.dispatch(new Event(TYPES_DIAGNOSTIC_EVENT));

        expect(received).toHaveLength(0);
    });

    it('cleanup remove o listener — eventos após stop() não são publicados', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const received: DebugEvent[] = [];
        bus.subscribe('typescript', (e) => received.push(e));

        const stop = startTypesCapture(bus, target);
        stop();
        target.dispatch(new CustomEvent(TYPES_DIAGNOSTIC_EVENT, { detail: validDiagnostic }));

        expect(received).toHaveLength(0);
    });

    it('cleanup remove exatamente um listener (não afeta outros)', () => {
        const target = makeTarget();
        const bus1 = createEventBus();
        const bus2 = createEventBus();
        const stop1 = startTypesCapture(bus1, target);
        startTypesCapture(bus2, target);

        expect(target.listenerCount(TYPES_DIAGNOSTIC_EVENT)).toBe(2);
        stop1();
        expect(target.listenerCount(TYPES_DIAGNOSTIC_EVENT)).toBe(1);
    });

    it('evento tem timestamp do tipo number', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const received: DebugEvent[] = [];
        bus.subscribe('typescript', (e) => received.push(e));

        startTypesCapture(bus, target);
        target.dispatch(new CustomEvent(TYPES_DIAGNOSTIC_EVENT, { detail: validDiagnostic }));

        expect(typeof received[0].timestamp).toBe('number');
    });

    it('captura diagnóstico sem campos opcionais (file/line/column ausentes)', () => {
        const bus = createEventBus();
        const target = makeTarget();
        const received: DebugEvent[] = [];
        bus.subscribe('typescript', (e) => received.push(e));

        const minimal: TypesEventData = { severity: 'warning', code: 6133, message: "'x' is declared but never used." };

        startTypesCapture(bus, target);
        target.dispatch(new CustomEvent(TYPES_DIAGNOSTIC_EVENT, { detail: minimal }));

        expect(received).toHaveLength(1);
        const data = received[0].data as TypesEventData;
        expect(data.file).toBeUndefined();
        expect(data.line).toBeUndefined();
    });
});

describe('publishTypeDiagnostic', () => {
    it('publica evento typescript diretamente no bus', () => {
        const bus = createEventBus();
        const received: DebugEvent[] = [];
        bus.subscribe('typescript', (e) => received.push(e));

        publishTypeDiagnostic(bus, validDiagnostic);

        expect(received).toHaveLength(1);
        expect((received[0].data as TypesEventData).code).toBe(2345);
    });

    it('suporta todas as severidades', () => {
        const severities = ['error', 'warning', 'suggestion', 'message'] as const;

        for (const severity of severities) {
            const bus = createEventBus();
            const received: DebugEvent[] = [];
            bus.subscribe('typescript', (e) => received.push(e));

            publishTypeDiagnostic(bus, { severity, code: 0, message: 'test' });

            expect(received).toHaveLength(1);
            expect((received[0].data as TypesEventData).severity).toBe(severity);
        }
    });
});
