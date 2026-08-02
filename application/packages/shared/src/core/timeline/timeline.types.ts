import { DebugEvent } from '../events/events.types';

export type TimelineEntry = DebugEvent & { sequence: number };
