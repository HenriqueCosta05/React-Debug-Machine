import { describe, expect, it } from '@rstest/core';
import { isDebugEvent } from '../core/events/events.schema';

describe('isDebugEvent', () => {
    it('aceita evento dom com target descriptor completo', () => {
        expect(isDebugEvent({
            type: 'dom',
            timestamp: 123,
            data: {
                nativeType: 'click',
                target: { tagName: 'BUTTON', id: null, className: 'btn', selectorPath: 'body > button' },
            },
        })).toBe(true);
    });

    it('rejeita evento dom sem target', () => {
        expect(isDebugEvent({
            type: 'dom',
            timestamp: 123,
            data: { nativeType: 'click' },
        })).toBe(false);
    });

    it('aceita domínios ainda não tipados (data unknown) desde que tenham type/timestamp válidos', () => {
        expect(isDebugEvent({ type: 'network', timestamp: 1, data: { anything: true } })).toBe(true);
        expect(isDebugEvent({ type: 'console', timestamp: 1, data: 'log line' })).toBe(true);
    });

    it('rejeita type desconhecido', () => {
        expect(isDebugEvent({ type: 'unknown-domain', timestamp: 1, data: {} })).toBe(false);
    });

    it('rejeita timestamp ausente ou não-numérico', () => {
        expect(isDebugEvent({ type: 'custom', data: {} })).toBe(false);
        expect(isDebugEvent({ type: 'custom', timestamp: '1', data: {} })).toBe(false);
    });

    it('rejeita valores primitivos e null', () => {
        expect(isDebugEvent(null)).toBe(false);
        expect(isDebugEvent('event')).toBe(false);
        expect(isDebugEvent(42)).toBe(false);
    });
});
