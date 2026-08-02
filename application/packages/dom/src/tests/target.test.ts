import { describe, expect, it } from '@rstest/core';
import { serializeTarget } from '../core/capture/target';

describe('serializeTarget', () => {
    it('serializa tagName, id, className e selectorPath de um elemento simples', () => {
        document.body.innerHTML = '<button id="save" class="btn primary">Save</button>';
        const button = document.getElementById('save')!;

        expect(serializeTarget(button)).toEqual({
            tagName: 'BUTTON',
            id: 'save',
            className: 'btn primary',
            selectorPath: '#save',
        });
    });

    it('retorna className null quando o elemento não tem classe', () => {
        document.body.innerHTML = '<span></span>';
        const span = document.querySelector('span')!;

        expect(serializeTarget(span).className).toBeNull();
    });

    it('para de subir a árvore ao encontrar um ancestral com id', () => {
        document.body.innerHTML = '<div id="panel"><section><button>ok</button></section></div>';
        const button = document.querySelector('button')!;

        expect(serializeTarget(button).selectorPath).toBe('#panel > section > button');
    });

    it('usa nth-of-type quando há irmãos do mesmo tagName', () => {
        document.body.innerHTML = '<ul><li>a</li><li>b</li><li>c</li></ul>';
        const secondLi = document.querySelectorAll('li')[1] as Element;

        expect(serializeTarget(secondLi).selectorPath).toBe('html > body > ul > li:nth-of-type(2)');
    });

    it('não usa nth-of-type quando o elemento é filho único do seu tagName', () => {
        document.body.innerHTML = '<div><span>only</span><p>other</p></div>';
        const span = document.querySelector('span')!;

        expect(serializeTarget(span).selectorPath).toBe('html > body > div > span');
    });
});
