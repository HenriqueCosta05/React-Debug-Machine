import type { ConsoleLevel } from '@henriquecosta/react-debug-machine-shared';

export type ConsoleTarget = {
    [K in ConsoleLevel]: (...args: unknown[]) => void;
};
