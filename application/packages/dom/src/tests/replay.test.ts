import { describe, expect, it, rstest } from '@rstest/core';
import type { DomEventData } from '@henriquecosta/react-debug-machine-shared';
import { replayDomEvent } from '../core/replay/replay';

function domEventData(overrides: Partial<DomEventData> = {}): DomEventData {
    return {
        nativeType: 'click',
        target: { tagName: 'BUTTON', id: 'save', className: null, selectorPath: '#save' },
        ...overrides,
    };
}

describe('replayDomEvent', () => {
    it('resolve o target por id e despacha um MouseEvent pra tipos de mouse', () => {
        document.body.innerHTML = '<button id="save">Save</button>';
        const button = document.getElementById('save')!;
        const listener = rstest.fn();
        button.addEventListener('click', listener);

        const result = replayDomEvent(domEventData());

        expect(result).toEqual({ ok: true });
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
    });

    it('cai pro selectorPath via querySelector quando não há id', () => {
        document.body.innerHTML = '<div><input class="field" /></div>';
        const input = document.querySelector('input')!;
        const listener = rstest.fn();
        input.addEventListener('keydown', listener);

        const result = replayDomEvent(domEventData({
            nativeType: 'keydown',
            target: { tagName: 'INPUT', id: null, className: 'field', selectorPath: 'div > input' },
        }));

        expect(result).toEqual({ ok: true });
        expect(listener.mock.calls[0][0]).toBeInstanceOf(KeyboardEvent);
    });

    it('despacha FocusEvent pra focus/blur e Event genérico pros demais tipos', () => {
        document.body.innerHTML = '<input id="field" />';
        const input = document.getElementById('field')!;
        const focusListener = rstest.fn();
        const submitListener = rstest.fn();
        input.addEventListener('focus', focusListener);
        input.addEventListener('submit', submitListener);

        replayDomEvent(domEventData({ nativeType: 'focus', target: { tagName: 'INPUT', id: 'field', className: null, selectorPath: '#field' } }));
        replayDomEvent(domEventData({ nativeType: 'submit', target: { tagName: 'INPUT', id: 'field', className: null, selectorPath: '#field' } }));

        expect(focusListener.mock.calls[0][0]).toBeInstanceOf(FocusEvent);
        expect(submitListener.mock.calls[0][0]).not.toBeInstanceOf(FocusEvent);
        expect(submitListener.mock.calls[0][0]).not.toBeInstanceOf(MouseEvent);
    });

    it('retorna target-not-found quando nem id nem selectorPath resolvem, sem lançar', () => {
        document.body.innerHTML = '<div></div>';

        const result = replayDomEvent(domEventData({
            target: { tagName: 'BUTTON', id: 'missing', className: null, selectorPath: '#missing' },
        }));

        expect(result).toEqual({ ok: false, reason: 'target-not-found' });
    });

    it('falha graciosamente com selectorPath obsoleto/inválido, sem lançar', () => {
        document.body.innerHTML = '<div></div>';

        const result = replayDomEvent(domEventData({
            target: { tagName: 'BUTTON', id: null, className: null, selectorPath: ':::not-a-selector' },
        }));

        expect(result).toEqual({ ok: false, reason: 'target-not-found' });
    });
});
