import type {
    ConsoleEventData,
    NetworkEventData,
    TimelineEntry,
    TypesEventData,
} from '@henriquecosta/react-debug-machine-shared';

export type EventSeverity = 'error' | 'warn' | 'normal';

// Drives the border-left indicator required by DESIGN.md so error/warning rows
// stay identifiable without relying on badge color alone (color independence rule).
export function getEventSeverity(entry: TimelineEntry): EventSeverity {
    if (entry.type === 'console') {
        const level = (entry.data as ConsoleEventData).level;
        if (level === 'error') return 'error';
        if (level === 'warn') return 'warn';
        return 'normal';
    }

    if (entry.type === 'network') {
        const data = entry.data as NetworkEventData;
        if (data.phase === 'error') return 'error';
        if (data.phase === 'response' && !data.ok) return 'error';
        return 'normal';
    }

    if (entry.type === 'typescript') {
        const severity = (entry.data as TypesEventData).severity;
        if (severity === 'error') return 'error';
        if (severity === 'warning') return 'warn';
        return 'normal';
    }

    return 'normal';
}
