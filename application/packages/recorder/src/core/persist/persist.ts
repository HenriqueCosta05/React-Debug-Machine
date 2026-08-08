import { isDebugEvent } from '@henriquecosta/react-debug-machine-shared';
import type { Recording } from '../types/recording.types';

export function exportRecording(recording: Recording): string {
    return JSON.stringify(recording);
}

// Valida cada entry com isDebugEvent (já cobre o shape de todo tipo de evento, de
// `shared`) antes de aceitar: um JSON importado pode vir de outra sessão/versão,
// nunca é confiável sem checagem.
export function importRecording(json: string): Recording {
    let parsed: unknown;
    try {
        parsed = JSON.parse(json);
    } catch {
        throw new Error('[react-debug-machine] importRecording: JSON inválido');
    }

    if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('[react-debug-machine] importRecording: recording deve ser um objeto');
    }
    const value = parsed as Record<string, unknown>;
    if (
        typeof value.id !== 'string' ||
        typeof value.startedAt !== 'number' ||
        typeof value.endedAt !== 'number' ||
        !Array.isArray(value.entries)
    ) {
        throw new Error('[react-debug-machine] importRecording: shape de recording inválido');
    }

    for (const entry of value.entries) {
        if (!isDebugEvent(entry) || typeof (entry as { sequence?: unknown }).sequence !== 'number') {
            throw new Error('[react-debug-machine] importRecording: entry de timeline inválida');
        }
    }

    return value as unknown as Recording;
}
