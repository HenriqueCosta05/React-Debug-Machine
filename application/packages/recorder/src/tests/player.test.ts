import { describe, expect, it, rstest } from '@rstest/core';
import type { Recording } from '../core/types/recording.types';
import { createPlayer } from '../core/replay/player';

function recordingWith(entries: Recording['entries']): Recording {
    return { id: 'rec-1', startedAt: entries[0]?.timestamp ?? 0, endedAt: 0, entries };
}

describe('createPlayer', () => {
    it('despacha cada entry pro replayer do seu tipo, respeitando o delta de timestamp', () => {
        rstest.useFakeTimers();
        const consoleReplayer = rstest.fn(() => ({ ok: true as const }));
        const recording = recordingWith([
            { type: 'console', timestamp: 0, data: { level: 'log', args: ['a'] }, sequence: 1 },
            { type: 'console', timestamp: 50, data: { level: 'log', args: ['b'] }, sequence: 2 },
        ]);
        const player = createPlayer(recording, { console: consoleReplayer });

        player.play();
        expect(consoleReplayer).not.toHaveBeenCalled();

        rstest.advanceTimersByTime(0);
        expect(consoleReplayer).toHaveBeenCalledTimes(1);

        rstest.advanceTimersByTime(50);
        expect(consoleReplayer).toHaveBeenCalledTimes(2);

        rstest.useRealTimers();
    });

    it('reporta no-replayer-registered sem lançar quando o tipo não tem replayer', () => {
        rstest.useFakeTimers();
        const onEvent = rstest.fn();
        const recording = recordingWith([
            { type: 'dom', timestamp: 0, data: { nativeType: 'click', target: { tagName: 'BUTTON', id: null, className: null, selectorPath: 'button' } }, sequence: 1 },
        ]);
        const player = createPlayer(recording, {});

        player.play(onEvent);
        rstest.advanceTimersByTime(0);

        expect(onEvent).toHaveBeenCalledWith(
            recording.entries[0],
            { ok: false, reason: 'no-replayer-registered' },
        );

        rstest.useRealTimers();
    });

    it('pause()/stop() cancela timers pendentes', () => {
        rstest.useFakeTimers();
        const consoleReplayer = rstest.fn(() => ({ ok: true as const }));
        const recording = recordingWith([
            { type: 'console', timestamp: 100, data: { level: 'log', args: ['a'] }, sequence: 1 },
        ]);
        const player = createPlayer(recording, { console: consoleReplayer });

        player.play();
        player.pause();
        rstest.advanceTimersByTime(200);

        expect(consoleReplayer).not.toHaveBeenCalled();
        rstest.useRealTimers();
    });
});
