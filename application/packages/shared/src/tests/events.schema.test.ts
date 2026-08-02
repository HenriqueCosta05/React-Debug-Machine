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
        expect(isDebugEvent({ type: 'console', timestamp: 1, data: 'log line' })).toBe(true);
        expect(isDebugEvent({ type: 'typescript', timestamp: 1, data: { anything: true } })).toBe(true);
    });

    it('aceita evento state com origin/label/before/after', () => {
        expect(isDebugEvent({
            type: 'state',
            timestamp: 1,
            data: { origin: 'redux', label: 'todos', before: { count: 0 }, after: { count: 1 } },
        })).toBe(true);
    });

    it('rejeita evento state com origin desconhecida ou campos ausentes', () => {
        expect(isDebugEvent({ type: 'state', timestamp: 1, data: { origin: 'mobx', label: 'x', before: 1, after: 2 } })).toBe(false);
        expect(isDebugEvent({ type: 'state', timestamp: 1, data: { origin: 'redux', label: 'x' } })).toBe(false);
    });

    it('aceita evento network na fase request com requestId/method/url', () => {
        expect(isDebugEvent({
            type: 'network',
            timestamp: 1,
            data: { phase: 'request', requestId: 'r1', method: 'GET', url: '/api/users' },
        })).toBe(true);
    });

    it('aceita evento network na fase response com status/ok/durationMs', () => {
        expect(isDebugEvent({
            type: 'network',
            timestamp: 2,
            data: { phase: 'response', requestId: 'r1', method: 'GET', url: '/api/users', status: 200, ok: true, durationMs: 12.3 },
        })).toBe(true);
    });

    it('aceita evento network na fase error com message/durationMs', () => {
        expect(isDebugEvent({
            type: 'network',
            timestamp: 3,
            data: { phase: 'error', requestId: 'r1', method: 'GET', url: '/api/users', durationMs: 5, message: 'Failed to fetch' },
        })).toBe(true);
    });

    it('rejeita evento network sem os campos exigidos pela fase', () => {
        expect(isDebugEvent({ type: 'network', timestamp: 1, data: { phase: 'response', requestId: 'r1', method: 'GET', url: '/x' } })).toBe(false);
        expect(isDebugEvent({ type: 'network', timestamp: 1, data: { phase: 'unknown-phase', requestId: 'r1', method: 'GET', url: '/x' } })).toBe(false);
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
