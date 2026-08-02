import { describe, expect, it } from '@rstest/core';
import { createEventBus } from '@henriquecosta/react-debug-machine-shared';
import { startNetworkCapture } from '../core/capture/network.capture';

describe('startNetworkCapture', () => {
    it('patcha fetch e XMLHttpRequest.prototype juntos, e stop() restaura os dois', () => {
        const bus = createEventBus();
        const originalFetch = globalThis.fetch;
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        const stop = startNetworkCapture(bus);

        expect(globalThis.fetch).not.toBe(originalFetch);
        expect(XMLHttpRequest.prototype.open).not.toBe(originalOpen);
        expect(XMLHttpRequest.prototype.send).not.toBe(originalSend);

        stop();

        expect(globalThis.fetch).toBe(originalFetch);
        expect(XMLHttpRequest.prototype.open).toBe(originalOpen);
        expect(XMLHttpRequest.prototype.send).toBe(originalSend);
    });
});
