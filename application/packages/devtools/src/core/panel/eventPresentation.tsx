import React from 'react';
import type {
    ConsoleEventData,
    DebugEvent,
    DomEventData,
    NetworkEventData,
    StateEventData,
    TimelineEntry,
    TypesEventData,
} from '@henriquecosta/react-debug-machine-shared';
import type { BadgeTone } from './Badge';
import { theme } from './theme';
import { getEventSeverity } from './eventSeverity';

export const TYPE_LABEL: Record<DebugEvent['type'], string> = {
    dom: 'DOM',
    network: 'NETWORK',
    console: 'CONSOLE',
    state: 'STATE',
    typescript: 'TYPES',
    custom: 'CUSTOM',
};

const TYPE_TONE: Record<DebugEvent['type'], BadgeTone> = {
    dom: 'info',
    network: 'secondary',
    console: 'secondary',
    state: 'success',
    typescript: 'secondary',
    custom: 'secondary',
};

// Badge tone leans on severity (error/warn) when the event carries one, so the
// same visual channel used for the row border also drives the category badge.
export function getBadgeTone(entry: TimelineEntry): BadgeTone {
    const severity = getEventSeverity(entry);
    if (severity === 'error') return 'error';
    if (severity === 'warn') return 'warning';
    return TYPE_TONE[entry.type];
}

const TYPE_COLOR: Record<DebugEvent['type'], string> = {
    dom: theme.palette.info.main,
    network: theme.palette.secondary.main,
    console: theme.palette.text.secondary,
    state: theme.palette.success.main,
    typescript: theme.palette.text.secondary,
    custom: theme.palette.text.disabled,
};

// Solid color for the timeline tick — same severity-first precedence as the badge tone.
export function getEventColor(entry: TimelineEntry): string {
    const severity = getEventSeverity(entry);
    if (severity === 'error') return theme.palette.error.main;
    if (severity === 'warn') return theme.palette.warning.main;
    return TYPE_COLOR[entry.type];
}

export function renderEventSummary(entry: TimelineEntry): React.ReactNode {
    if (entry.type === 'dom') {
        const d = entry.data as DomEventData;
        return `${d.nativeType} on ${d.target.selectorPath}`;
    }

    if (entry.type === 'network') {
        const d = entry.data as NetworkEventData;
        if (d.phase === 'request') return `→ ${d.method} ${d.url}`;
        if (d.phase === 'response') {
            return (
                <>
                    <span style={{ color: d.ok ? theme.palette.success.main : theme.palette.error.main }}>{d.status}</span>{' '}
                    {d.method} {d.url}{' '}
                    <span style={{ color: theme.palette.text.disabled }}>({d.durationMs.toFixed(0)}ms)</span>
                </>
            );
        }
        return (
            <span style={{ color: theme.palette.error.main }}>
                ✗ {d.method} {d.url} — {d.message}
            </span>
        );
    }

    if (entry.type === 'console') {
        const d = entry.data as ConsoleEventData;
        const first = d.args[0];
        const levelColor =
            d.level === 'error' ? theme.palette.error.main : d.level === 'warn' ? theme.palette.warning.main : theme.palette.text.secondary;
        return (
            <>
                <span style={{ color: levelColor }}>[{d.level}]</span>{' '}
                {typeof first === 'string' ? first : JSON.stringify(first)}
            </>
        );
    }

    if (entry.type === 'state') {
        const d = entry.data as StateEventData;
        return (
            <>
                <span style={{ color: theme.palette.text.disabled }}>{d.origin}/{d.label}</span>
                {': '}
                <span style={{ color: theme.palette.error.main }}>{JSON.stringify(d.before)}</span>
                {' → '}
                <span style={{ color: theme.palette.success.main }}>{JSON.stringify(d.after)}</span>
            </>
        );
    }

    if (entry.type === 'typescript') {
        const d = entry.data as TypesEventData;
        const severityColor =
            d.severity === 'error' ? theme.palette.error.main : d.severity === 'warning' ? theme.palette.warning.main : theme.palette.text.secondary;
        const loc = d.file ? ` ${d.file}${d.line !== undefined ? `:${d.line}` : ''}` : '';
        return (
            <>
                <span style={{ color: severityColor }}>TS{d.code}</span>
                {loc && <span style={{ color: theme.palette.text.disabled }}>{loc}</span>}
                {' '}{d.message}
            </>
        );
    }

    return JSON.stringify(entry.data);
}
