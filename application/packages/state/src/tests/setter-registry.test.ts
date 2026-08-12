import { describe, expect, it, rstest } from '@rstest/core';
import { createStateSetterRegistry } from '../core/registry/setter-registry';

describe('createStateSetterRegistry', () => {
    it('register() disponibiliza o setter via get(), unregister via fn retornada', () => {
        const registry = createStateSetterRegistry();
        const setter = rstest.fn();

        const unregister = registry.register('count', setter);
        expect(registry.get('count')).toBe(setter);

        unregister();
        expect(registry.get('count')).toBeUndefined();
    });

    it('get() de label nunca registrado retorna undefined', () => {
        const registry = createStateSetterRegistry();
        expect(registry.get('missing')).toBeUndefined();
    });
});
