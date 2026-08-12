import { useState, useEffect, useCallback } from 'react';
import type { DebugSession, TimelineEntry } from '@henriquecosta/react-debug-machine-shared';

export type UseDebugMachineResult = {
    events: readonly TimelineEntry[];
    clear: () => void;
};

export function useDebugMachine(session: DebugSession): UseDebugMachineResult {
    const [events, setEvents] = useState<readonly TimelineEntry[]>(() =>
        session.timeline.getEvents(),
    );

    useEffect(() => {
        setEvents([...session.timeline.getEvents()]);
        const unsubscribe = session.bus.subscribeAll(() => {
            setEvents([...session.timeline.getEvents()]);
        });
        return unsubscribe;
    }, [session]);

    const clear = useCallback(() => {
        session.timeline.clear();
        setEvents([]);
    }, [session]);

    return { events, clear };
}
