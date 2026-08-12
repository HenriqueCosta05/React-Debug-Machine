import { describe, expect, it, rstest } from '@rstest/core';
import type { ConsoleEventData } from '@henriquecosta/react-debug-machine-shared';
import type { ConsoleTarget } from '../core/types/console.types';
import { replayConsoleEvent } from '../core/replay/replay';

describe('replayConsoleEvent', () => {
    it('rechama console[level] com os args originais', () => {
        const logMock = rstest.fn();
        const fakeTarget = { log: logMock } as unknown as ConsoleTarget;
        const data: ConsoleEventData = { level: 'log', args: ['hello', 42] };

        const result = replayConsoleEvent(data, fakeTarget);

        expect(result).toEqual({ ok: true });
        expect(logMock).toHaveBeenCalledWith('hello', 42);
    });
});
