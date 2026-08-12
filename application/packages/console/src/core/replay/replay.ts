import type { ConsoleEventData, ReplayResult } from '@henriquecosta/react-debug-machine-shared';
import type { ConsoleTarget } from '../types/console.types';

export function replayConsoleEvent(
    data: ConsoleEventData,
    target: ConsoleTarget = console as ConsoleTarget,
): ReplayResult {
    target[data.level](...data.args);
    return { ok: true };
}
