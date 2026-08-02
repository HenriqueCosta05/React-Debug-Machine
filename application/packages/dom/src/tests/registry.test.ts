import { describe, expect, it } from '@rstest/core';
import { createRootRegistry } from '../core/roots/registry';

describe('createRootRegistry', () => {
    it('sem roots registrados, considera qualquer elemento dentro (opt-in desligado = irrestrito)', () => {
        document.body.innerHTML = '<div id="a"></div>';
        const registry = createRootRegistry();

        expect(registry.isWithinRegisteredRoot(document.getElementById('a')!)).toBe(true);
    });

    it('com um root registrado, só elementos contidos nele passam', () => {
        document.body.innerHTML = '<div id="root"><span id="inside"></span></div><p id="outside"></p>';
        const registry = createRootRegistry();
        registry.register(document.getElementById('root')!);

        expect(registry.isWithinRegisteredRoot(document.getElementById('inside')!)).toBe(true);
        expect(registry.isWithinRegisteredRoot(document.getElementById('outside')!)).toBe(false);
    });

    it('unregister (retorno de register) remove o root da lista', () => {
        document.body.innerHTML = '<div id="root"></div>';
        const registry = createRootRegistry();
        const unregister = registry.register(document.getElementById('root')!);

        unregister();

        expect(registry.getRoots()).toHaveLength(0);
    });

    it('remover o único root registrado volta ao comportamento irrestrito', () => {
        document.body.innerHTML = '<div id="root"></div><p id="outside"></p>';
        const registry = createRootRegistry();
        const unregister = registry.register(document.getElementById('root')!);

        unregister();

        expect(registry.isWithinRegisteredRoot(document.getElementById('outside')!)).toBe(true);
    });

    it('getRoots reflete os roots atualmente registrados', () => {
        document.body.innerHTML = '<div id="a"></div><div id="b"></div>';
        const registry = createRootRegistry();
        const a = document.getElementById('a')!;
        const b = document.getElementById('b')!;
        registry.register(a);
        registry.register(b);

        expect(registry.getRoots()).toEqual([a, b]);
    });
});
