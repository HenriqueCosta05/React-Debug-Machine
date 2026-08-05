import type { EventBus, ConsoleLevel } from '@henriquecosta/react-debug-machine-shared';
import type { ConsoleTarget } from '../types/console.types';

const LEVELS: readonly ConsoleLevel[] = ['log', 'warn', 'error', 'info', 'debug'];

export function startConsoleCapture(bus: EventBus, target: ConsoleTarget = console as ConsoleTarget): () => void {
    const originals = new Map<ConsoleLevel, (...args: unknown[]) => void>();

    for (const level of LEVELS) {
        const original = target[level];
        originals.set(level, original);

        target[level] = (...args: unknown[]): void => {
            original.apply(target, args);
            bus.publish({
                type: 'console',
                timestamp: performance.now(),
                data: { level, args: [...args] },
            });
        };
    }

    return function stopConsoleCapture(): void {
        for (const level of LEVELS) {
            target[level] = originals.get(level)!;
        }
    };
}
