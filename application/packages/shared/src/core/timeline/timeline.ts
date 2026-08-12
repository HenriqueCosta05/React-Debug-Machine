import { EventBus } from '../events/events.bus';
import { DebugEvent } from '../events/events.types';
import { TimelineEntry } from './timeline.types';

export function createTimeline(bus: EventBus) {
    const entries: TimelineEntry[] = [];
    let sequence = 0;

    const unsubscribe = bus.subscribeAll((event) => {
        sequence += 1;
        entries.push({ ...event, sequence });
    });

    function getEvents(): readonly TimelineEntry[] {
        return bus.filterDuplicateEvents(entries) as TimelineEntry[];
    }

    function getEventsByType(type: DebugEvent['type']): readonly TimelineEntry[] {
        return bus.filterDuplicateEvents(entries.filter((entry) => entry.type === type)) as TimelineEntry[];
    }

    function clear(): void {
        entries.length = 0;
        sequence = 0;
    }

    function stop(): void {
        unsubscribe();
    }

    return { getEvents, getEventsByType, clear, stop };
}

export type Timeline = ReturnType<typeof createTimeline>;
