import React from 'react';
import { Box } from '@mui/material';
import type {
    TimelineEntry,
    DebugEvent,
    DomEventData,
    NetworkEventData,
    ConsoleEventData,
    StateEventData,
    TypesEventData,
} from '@henriquecosta/react-debug-machine-shared';
import { TOKENS } from './tokens';

const TYPE_COLORS: Record<DebugEvent['type'], string> = {
    dom: '#4A90D9',
    network: '#7B68EE',
    console: TOKENS.colorWarn,
    state: TOKENS.colorDiffAdd,
    typescript: TOKENS.colorError,
    custom: '#888',
};

interface Props {
    entry: TimelineEntry;
}

export function EventItem({ entry }: Props): React.ReactElement {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                px: '12px',
                py: '4px',
                borderBottom: '1px solid #1e2a33',
                fontSize: 13,
                fontFamily: TOKENS.fontFamily,
                color: '#c8d6df',
                '&:hover': { bgcolor: '#162535' },
            }}
        >
            <Box
                component="span"
                sx={{
                    color: '#546e7a',
                    minWidth: 72,
                    fontSize: 11,
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                }}
            >
                {entry.timestamp.toFixed(2)}ms
            </Box>
            <Box
                component="span"
                sx={{
                    bgcolor: TYPE_COLORS[entry.type],
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    px: '6px',
                    py: '1px',
                    borderRadius: '3px',
                    flexShrink: 0,
                    letterSpacing: '0.02em',
                }}
            >
                {entry.type}
            </Box>
            <Box
                component="span"
                sx={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                }}
            >
                {renderSummary(entry)}
            </Box>
        </Box>
    );
}

function renderSummary(entry: TimelineEntry): React.ReactNode {
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
                    <span style={{ color: d.ok ? TOKENS.colorDiffAdd : TOKENS.colorError }}>
                        {d.status}
                    </span>
                    {' '}{d.method} {d.url}{' '}
                    <span style={{ color: '#546e7a' }}>({d.durationMs.toFixed(0)}ms)</span>
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
            d.level === 'error' ? TOKENS.colorError :
            d.level === 'warn' ? TOKENS.colorWarn : '#c8d6df';
        return (
            <>
                <span style={{ color: levelColor }}>[{d.level}]</span>
                {' '}
                {typeof first === 'string' ? first : JSON.stringify(first)}
            </>
        );
    }

    if (entry.type === 'state') {
        const d = entry.data as StateEventData;
        return (
            <>
                <span style={{ color: '#7b96a8' }}>{d.origin}/{d.label}</span>
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
            d.severity === 'error' ? TOKENS.colorError :
            d.severity === 'warning' ? TOKENS.colorWarn : '#c8d6df';
        const loc = d.file
            ? ` ${d.file}${d.line !== undefined ? `:${d.line}` : ''}`
            : '';
        return (
            <>
                <span style={{ color: severityColor }}>TS{d.code}</span>
                {loc && <span style={{ color: '#546e7a' }}>{loc}</span>}
                {' '}{d.message}
            </>
        );
    }

    return JSON.stringify(entry.data);
}
