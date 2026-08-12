import React from 'react';
import { Box, useTheme } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type {
    ConsoleEventData,
    DomEventData,
    NetworkEventData,
    StateEventData,
    TimelineEntry,
    TypesEventData,
} from '@henriquecosta/react-debug-machine-shared';
import { Badge } from './Badge';
import { DiffViewer } from './DiffViewer';
import { EmptyState } from './EmptyState';
import { JsonViewer } from './JsonViewer';
import { getBadgeTone, TYPE_LABEL } from './eventPresentation';
import { MONO_FONT_FAMILY } from './theme';

interface Props {
    entry: TimelineEntry | null;
}

export function Inspector({ entry }: Props): React.ReactElement {
    const theme = useTheme();

    if (!entry) {
        return (
            <EmptyState
                title="No event selected"
                description="Select an event from the timeline or the list to inspect its full payload."
            />
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: `${theme.spacing(1)}`,
                    px: `${theme.spacing(1.5)}`,
                    py: `${theme.spacing(1)}`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    flexShrink: 0,
                }}
            >
                <Badge tone={getBadgeTone(entry)}>{TYPE_LABEL[entry.type]}</Badge>
                <Box
                    component="span"
                    sx={{
                        fontFamily: MONO_FONT_FAMILY,
                        fontSize: 11,
                        fontVariantNumeric: 'tabular-nums',
                        color: theme.palette.text.disabled,
                    }}
                >
                    {entry.timestamp.toFixed(2)}ms · #{entry.sequence}
                </Box>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: `${theme.spacing(1.5)}`, minHeight: 0 }}>
                <InspectorBody entry={entry} />
            </Box>
        </Box>
    );
}

function InspectorBody({ entry }: { entry: TimelineEntry }): React.ReactElement {
    const theme = useTheme();
    const gap = `${theme.spacing(1.5)}`;

    if (entry.type === 'dom') {
        const d = entry.data as DomEventData;
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap }}>
                <FieldRow label="Native type" value={d.nativeType} />
                <FieldRow label="Selector" value={d.target.selectorPath} mono />
                <Section title="Target">
                    <JsonViewer value={d.target} />
                </Section>
            </Box>
        );
    }

    if (entry.type === 'network') {
        const d = entry.data as NetworkEventData;
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap }}>
                <FieldRow label="Phase" value={d.phase} />
                <FieldRow label="Method" value={d.method} mono />
                <FieldRow label="URL" value={d.url} mono />
                {d.phase === 'response' && (
                    <>
                        <FieldRow label="Status" value={String(d.status)} tone={d.ok ? 'success' : 'error'} mono />
                        <FieldRow label="Duration" value={`${d.durationMs.toFixed(0)}ms`} mono />
                    </>
                )}
                {d.phase === 'error' && (
                    <>
                        <FieldRow label="Duration" value={`${d.durationMs.toFixed(0)}ms`} mono />
                        <FieldRow label="Message" value={d.message} tone="error" />
                    </>
                )}
                <Section title="Raw payload">
                    <JsonViewer value={d} />
                </Section>
            </Box>
        );
    }

    if (entry.type === 'console') {
        const d = entry.data as ConsoleEventData;
        const tone = d.level === 'error' ? 'error' : d.level === 'warn' ? 'warn' : undefined;
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap }}>
                <FieldRow label="Level" value={d.level} tone={tone} />
                <Section title={`Arguments (${d.args.length})`}>
                    <JsonViewer value={d.args} />
                </Section>
            </Box>
        );
    }

    if (entry.type === 'state') {
        const d = entry.data as StateEventData;
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap }}>
                <FieldRow label="Origin" value={d.origin} />
                <FieldRow label="Label" value={d.label} mono />
                <Section title="Diff">
                    <DiffViewer before={d.before} after={d.after} />
                </Section>
            </Box>
        );
    }

    if (entry.type === 'typescript') {
        const d = entry.data as TypesEventData;
        const tone = d.severity === 'error' ? 'error' : d.severity === 'warning' ? 'warn' : undefined;
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap }}>
                <FieldRow label="Severity" value={d.severity} tone={tone} />
                <FieldRow label="Code" value={`TS${d.code}`} mono />
                <FieldRow label="Message" value={d.message} />
                {d.file && (
                    <FieldRow
                        label="Location"
                        value={`${d.file}${d.line !== undefined ? `:${d.line}` : ''}${d.column !== undefined ? `:${d.column}` : ''}`}
                        mono
                    />
                )}
            </Box>
        );
    }

    return (
        <Section title="Data">
            <JsonViewer value={entry.data} />
        </Section>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }): React.ReactElement {
    const theme = useTheme();
    return (
        <Box>
            <Box
                sx={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: 12,
                    fontWeight: 600,
                    color: theme.palette.text.disabled,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    mb: `${theme.spacing(1)}`,
                }}
            >
                {title}
            </Box>
            <Box
                sx={{
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: `${theme.shape.borderRadius * 1.5}px`,
                    p: `${theme.spacing(1)}`,
                    overflowX: 'auto',
                }}
            >
                {children}
            </Box>
        </Box>
    );
}

function toneColorFor(theme: Theme, tone?: 'error' | 'warn' | 'success'): string {
    if (tone === 'error') return theme.palette.error.main;
    if (tone === 'warn') return theme.palette.warning.main;
    if (tone === 'success') return theme.palette.success.main;
    return theme.palette.text.primary;
}

function FieldRow({
    label,
    value,
    mono,
    tone,
}: {
    label: string;
    value: string;
    mono?: boolean;
    tone?: 'error' | 'warn' | 'success';
}): React.ReactElement {
    const theme = useTheme();
    const toneColor = toneColorFor(theme, tone);

    return (
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: `${theme.spacing(1)}`, minWidth: 0 }}>
            <Box
                component="span"
                sx={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: 12,
                    fontWeight: 600,
                    color: theme.palette.text.disabled,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    minWidth: 88,
                    flexShrink: 0,
                }}
            >
                {label}
            </Box>
            <Box
                component="span"
                sx={{
                    fontFamily: mono ? MONO_FONT_FAMILY : theme.typography.fontFamily,
                    fontSize: mono ? 12 : 13,
                    fontWeight: 500,
                    color: toneColor,
                    wordBreak: 'break-word',
                    minWidth: 0,
                }}
            >
                {value}
            </Box>
        </Box>
    );
}
