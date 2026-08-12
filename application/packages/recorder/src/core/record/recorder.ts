import type { EventBus, TimelineEntry } from '@henriquecosta/react-debug-machine-shared';
import type { Recording, RecorderStatus } from '../types/recording.types';

function createRecordingId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `recording-${Date.now()}`;
}

// Grava só a janela entre start()/stop(): assina o bus diretamente em vez de reusar
// `timeline` (que acumula a sessão inteira sem fronteira), então não precisa saber
// nada sobre o histórico completo — cada `createRecorder` é sua própria janela.
export function createRecorder(bus: EventBus) {
    let status: RecorderStatus = 'idle';
    let entries: TimelineEntry[] = [];
    let sequence = 0;
    let startedAt = 0;
    let unsubscribe: (() => void) | null = null;

    function start(): void {
        if (status === 'recording') {
            console.warn('[react-debug-machine] recorder.start() ignorado: já está gravando');
            return;
        }
        entries = [];
        sequence = 0;
        startedAt = Date.now();
        status = 'recording';
        unsubscribe = bus.subscribeAll((event) => {
            sequence += 1;
            entries.push({ ...event, sequence });
        });
    }

    function stop(): Recording {
        if (status !== 'recording') {
            throw new Error('[react-debug-machine] recorder.stop() chamado sem gravação em andamento');
        }
        unsubscribe?.();
        unsubscribe = null;
        status = 'stopped';
        return {
            id: createRecordingId(),
            startedAt,
            endedAt: Date.now(),
            entries: bus.filterDuplicateEvents(entries) as TimelineEntry[],
        };
    }

    function getStatus(): RecorderStatus {
        return status;
    }

    return { start, stop, getStatus };
}

export type Recorder = ReturnType<typeof createRecorder>;
