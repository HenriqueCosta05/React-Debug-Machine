import { describe, expect, it, rstest } from '@rstest/core';
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import { startDomCapture } from '../core/capture/capture';
import { createRootRegistry } from '../core/roots/registry';

function dispatchClick(target: Element): void {
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

describe('startDomCapture', () => {
    it('publica um evento dom no bus quando um clique ocorre no document', () => {
        document.body.innerHTML = '<button id="save">Save</button>';
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('dom', handler);

        const stop = startDomCapture(bus);
        dispatchClick(document.getElementById('save')!);
        stop();

        expect(handler).toHaveBeenCalledTimes(1);
        const [event] = handler.mock.calls[0];
        expect(event.type).toBe('dom');
        expect(event.data).toEqual({
            nativeType: 'click',
            target: { tagName: 'BUTTON', id: 'save', className: null, selectorPath: '#save' },
        });
        expect(typeof event.timestamp).toBe('number');
    });

    it('respeita rootRegistry: ignora eventos fora do root registrado', () => {
        document.body.innerHTML = '<div id="root"><button id="inside">in</button></div><button id="outside">out</button>';
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('dom', handler);
        const rootRegistry = createRootRegistry();
        rootRegistry.register(document.getElementById('root')!);

        const stop = startDomCapture(bus, { rootRegistry });
        dispatchClick(document.getElementById('outside')!);
        dispatchClick(document.getElementById('inside')!);
        stop();

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].data.target.id).toBe('inside');
    });

    it('stop() remove os listeners e nenhum evento novo é publicado', () => {
        document.body.innerHTML = '<button id="save">Save</button>';
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('dom', handler);

        const stop = startDomCapture(bus);
        stop();
        dispatchClick(document.getElementById('save')!);

        expect(handler).not.toHaveBeenCalled();
    });

    it('captura só os eventTypes configurados', () => {
        document.body.innerHTML = '<input id="field" />';
        const bus = createEventBus();
        const handler = rstest.fn();
        bus.subscribe('dom', handler);

        const stop = startDomCapture(bus, { eventTypes: ['focus'] });
        dispatchClick(document.getElementById('field')!);
        stop();

        expect(handler).not.toHaveBeenCalled();
    });
});
