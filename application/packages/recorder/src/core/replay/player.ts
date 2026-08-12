import type { ReplayResult, TimelineEntry } from '@henriquecosta/react-debug-machine-shared';
import type { Recording, ReplayerRegistry } from '../types/recording.types';

export type PlayerEventHandler = (entry: TimelineEntry, result: ReplayResult) => void;

// Agenda cada entry por delta de timestamp relativo ao primeiro evento gravado
// (setTimeout chain) — sem replayer registrado pro tipo, reporta ao invés de
// lançar, mesma filosofia de "falha isolada" dos adapters.
export function createPlayer(recording: Recording, replayers: ReplayerRegistry) {
    let timers: ReturnType<typeof setTimeout>[] = [];
    let playing = false;

    function play(onEvent?: PlayerEventHandler): void {
        if (playing) return;
        playing = true;
        const baseTimestamp = recording.entries[0]?.timestamp ?? 0;

        timers = recording.entries.map((entry) =>
            setTimeout(() => {
                const replayer = replayers[entry.type];
                if (!replayer) {
                    onEvent?.(entry, { ok: false, reason: 'no-replayer-registered' });
                    return;
                }
                Promise.resolve(replayer(entry.data)).then((result) => onEvent?.(entry, result));
            }, entry.timestamp - baseTimestamp),
        );
    }

    function pause(): void {
        timers.forEach(clearTimeout);
        timers = [];
        playing = false;
    }

    function stop(): void {
        pause();
    }

    return { play, pause, stop };
}

export type Player = ReturnType<typeof createPlayer>;
