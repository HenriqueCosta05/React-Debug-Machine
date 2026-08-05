import { describe, expect, it } from '@rstest/core';
import { createEventBus } from '../core/events/events.bus';
import { createTimeline } from '../core/timeline/timeline';
import { DebugEvent } from '../core/events/events.types';

const consoleEvent: DebugEvent = { type: 'console', timestamp: 1, data: { level: 'log', args: ['log line'] } };
const domEvent: DebugEvent = {
    type: 'dom',
    timestamp: 2,
    data: { nativeType: 'click', target: { tagName: 'BUTTON', id: null, className: null, selectorPath: 'button' } },
};

describe('createTimeline', () => {
    it('registra eventos publicados no bus em ordem, com sequence crescente', () => {
        const bus = createEventBus();
        const timeline = createTimeline(bus);

        bus.publish(consoleEvent);
        bus.publish(domEvent);

        expect(timeline.getEvents()).toEqual([
            { ...consoleEvent, sequence: 1 },
            { ...domEvent, sequence: 2 },
        ]);
    });

    it('getEventsByType filtra só o domínio pedido', () => {
        const bus = createEventBus();
        const timeline = createTimeline(bus);

        bus.publish(consoleEvent);
        bus.publish(domEvent);

        expect(timeline.getEventsByType('dom')).toEqual([{ ...domEvent, sequence: 2 }]);
    });

    it('clear esvazia entries e reseta sequence', () => {
        const bus = createEventBus();
        const timeline = createTimeline(bus);
        bus.publish(consoleEvent);

        timeline.clear();
        bus.publish(domEvent);

        expect(timeline.getEvents()).toEqual([{ ...domEvent, sequence: 1 }]);
    });

    it('stop() para de registrar novos eventos', () => {
        const bus = createEventBus();
        const timeline = createTimeline(bus);
        bus.publish(consoleEvent);

        timeline.stop();
        bus.publish(domEvent);

        expect(timeline.getEvents()).toEqual([{ ...consoleEvent, sequence: 1 }]);
    });

    it('evento inválido descartado pelo bus não entra na timeline', () => {
        const bus = createEventBus();
        const timeline = createTimeline(bus);

        bus.publish({ type: 'dom', timestamp: 1, data: {} } as unknown as DebugEvent);

        expect(timeline.getEvents()).toEqual([]);
    });
});
