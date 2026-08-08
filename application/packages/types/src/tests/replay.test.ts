import { describe, expect, it } from '@rstest/core';
import { replayTypeDiagnostic } from '../core/replay/replay';

describe('replayTypeDiagnostic', () => {
    it('sempre retorna ok:true (diagnóstico não tem ação a repetir)', () => {
        expect(replayTypeDiagnostic()).toEqual({ ok: true });
    });
});
