import type { DebugEvent, ReplayResult, TimelineEntry } from '@henriquecosta/react-debug-machine-shared';

export type RecorderStatus = 'idle' | 'recording' | 'stopped';

export type Recording = {
    id: string;
    startedAt: number;
    endedAt: number;
    entries: TimelineEntry[];
};

export type Replayer = (data: DebugEvent['data']) => ReplayResult | Promise<ReplayResult>;

export type ReplayerRegistry = Partial<Record<DebugEvent['type'], Replayer>>;
