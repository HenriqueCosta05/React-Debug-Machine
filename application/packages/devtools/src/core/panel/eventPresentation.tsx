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
import { TOKENS } from './tokens';
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
    console: 'neutral',
    state: 'success',
    typescript: 'neutral',
    custom: 'neutral',
};

// Badge tone leans on severity (error/warn) when the event carries one, so the
// same visual channel used for the row border also drives the category badge.
export function getBadgeTone(entry: TimelineEntry): BadgeTone {
    const severity = getEventSeverity(entry);
    if (severity === 'error') return 'error';
    if (severity === 'warn') return 'warn';
    return TYPE_TONE[entry.type];
}

const TYPE_COLOR: Record<DebugEvent['type'], string> = {
    dom: TOKENS.colorInfo,
    network: TOKENS.colorSecondary,
    console: TOKENS.colorTextSecondary,
    state: TOKENS.colorSuccess,
    typescript: TOKENS.colorTextSecondary,
    custom: TOKENS.colorTextMuted,
};

// Solid color for the timeline tick — same severity-first precedence as the badge tone.
export function getEventColor(entry: TimelineEntry): string {
    const severity = getEventSeverity(entry);
    if (severity === 'error') return TOKENS.colorError;
    if (severity === 'warn') return TOKENS.colorWarn;
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
                    <span style={{ color: d.ok ? TOKENS.colorSuccess : TOKENS.colorError }}>{d.status}</span>{' '}
                    {d.method} {d.url}{' '}
                    <span style={{ color: TOKENS.colorTextMuted }}>({d.durationMs.toFixed(0)}ms)</span>
                </>
            );
        }
        return (
            <span style={{ color: TOKENS.colorError }}>
                ✗ {d.method} {d.url} — {d.message}
            </span>
        );
    }

    if (entry.type === 'console') {
        const d = entry.data as ConsoleEventData;
        const first = d.args[0];
        const levelColor =
            d.level === 'error' ? TOKENS.colorError : d.level === 'warn' ? TOKENS.colorWarn : TOKENS.colorTextSecondary;
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
                <span style={{ color: TOKENS.colorTextMuted }}>{d.origin}/{d.label}</span>
                {': '}
                <span style={{ color: TOKENS.colorDiffRemove }}>{JSON.stringify(d.before)}</span>
                {' → '}
                <span style={{ color: TOKENS.colorDiffAdd }}>{JSON.stringify(d.after)}</span>
            </>
        );
    }

    if (entry.type === 'typescript') {
        const d = entry.data as TypesEventData;
        const severityColor =
            d.severity === 'error' ? TOKENS.colorError : d.severity === 'warning' ? TOKENS.colorWarn : TOKENS.colorTextSecondary;
        const loc = d.file ? ` ${d.file}${d.line !== undefined ? `:${d.line}` : ''}` : '';
        return (
            <>
                <span style={{ color: severityColor }}>TS{d.code}</span>
                {loc && <span style={{ color: TOKENS.colorTextMuted }}>{loc}</span>}
                {' '}{d.message}
            </>
        );
    }

    return JSON.stringify(entry.data);
}
