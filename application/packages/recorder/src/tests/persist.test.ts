import { describe, expect, it } from '@rstest/core';
import type { Recording } from '../core/types/recording.types';
import { exportRecording, importRecording } from '../core/persist/persist';

function sampleRecording(): Recording {
    return {
        id: 'rec-1',
        startedAt: 100,
        endedAt: 200,
        entries: [
            { type: 'console', timestamp: 101, data: { level: 'log', args: ['hi'] }, sequence: 1 },
        ],
    };
}

describe('exportRecording / importRecording', () => {
    it('round-trip: export -> import produz a mesma recording', () => {
        const recording = sampleRecording();

        const json = exportRecording(recording);
        const imported = importRecording(json);

        expect(imported).toEqual(recording);
    });

    it('rejeita JSON malformado', () => {
        expect(() => importRecording('{not json')).toThrow();
    });

    it('rejeita recording com shape inválido (campos faltando)', () => {
        expect(() => importRecording(JSON.stringify({ id: 'x' }))).toThrow();
    });

    it('rejeita entry cujo formato de evento não bate com nenhum tipo conhecido', () => {
        const broken = { id: 'rec-1', startedAt: 0, endedAt: 1, entries: [{ type: 'dom', timestamp: 1, data: {}, sequence: 1 }] };
        expect(() => importRecording(JSON.stringify(broken))).toThrow();
    });
});
