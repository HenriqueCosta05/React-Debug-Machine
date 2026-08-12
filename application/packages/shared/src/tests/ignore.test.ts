import { describe, expect, it } from '@rstest/core';
import { DEBUG_MACHINE_IGNORE_ATTRIBUTE, isDebugMachineIgnored } from '../core/ignore/ignore';

describe('isDebugMachineIgnored', () => {
    it('retorna false pra elemento fora de qualquer subárvore marcada', () => {
        document.body.innerHTML = '<button id="save">Save</button>';
        expect(isDebugMachineIgnored(document.getElementById('save')!)).toBe(false);
    });

    it('retorna true pro próprio elemento marcado', () => {
        document.body.innerHTML = `<button id="toggle" ${DEBUG_MACHINE_IGNORE_ATTRIBUTE}>Open</button>`;
        expect(isDebugMachineIgnored(document.getElementById('toggle')!)).toBe(true);
    });

    it('retorna true pra descendente de um elemento marcado', () => {
        document.body.innerHTML = `<div id="panel" ${DEBUG_MACHINE_IGNORE_ATTRIBUTE}><button id="clear">Clear</button></div>`;
        expect(isDebugMachineIgnored(document.getElementById('clear')!)).toBe(true);
    });
});
