import { describe, expect, it, rstest } from '@rstest/core';
import { createStateSetterRegistry } from '../core/registry/setter-registry';
import { replayStateEvent } from '../core/replay/replay';

describe('replayStateEvent', () => {
    it('chama o setter registrado com o after e retorna ok:true', () => {
        const registry = createStateSetterRegistry();
        const setter = rstest.fn();
        registry.register('count', setter);

        const result = replayStateEvent('count', 42, registry);

        expect(result).toEqual({ ok: true });
        expect(setter).toHaveBeenCalledWith(42);
    });

    it('label sem setter registrado (ex.: origin redux) retorna no-setter-registered', () => {
        const registry = createStateSetterRegistry();

        const result = replayStateEvent('store', { a: 1 }, registry);

        expect(result).toEqual({ ok: false, reason: 'no-setter-registered' });
    });
});
