import React from 'react';
import { Box } from '@mui/material';
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
import { TOKENS } from './tokens';

interface Props {
    entry: TimelineEntry | null;
}

export function Inspector({ entry }: Props): React.ReactElement {
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
                    gap: `${TOKENS.space2}px`,
                    px: `${TOKENS.space3}px`,
                    py: `${TOKENS.space2}px`,
                    borderBottom: `1px solid ${TOKENS.colorBorder}`,
                    flexShrink: 0,
                }}
            >
                <Badge tone={getBadgeTone(entry)}>{TYPE_LABEL[entry.type]}</Badge>
                <Box
                    component="span"
                    sx={{
                        fontFamily: TOKENS.fontFamilyMono,
                        fontSize: TOKENS.fontSizeMetadata,
                        fontVariantNumeric: 'tabular-nums',
                        color: TOKENS.colorTextMuted,
                    }}
                >
                    {entry.timestamp.toFixed(2)}ms · #{entry.sequence}
                </Box>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: `${TOKENS.space3}px`, minHeight: 0 }}>
                <InspectorBody entry={entry} />
            </Box>
        </Box>
    );
}

function InspectorBody({ entry }: { entry: TimelineEntry }): React.ReactElement {
    if (entry.type === 'dom') {
        const d = entry.data as DomEventData;
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${TOKENS.space3}px` }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${TOKENS.space3}px` }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${TOKENS.space3}px` }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${TOKENS.space3}px` }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${TOKENS.space3}px` }}>
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
    return (
        <Box>
            <Box
                sx={{
                    fontFamily: TOKENS.fontFamily,
                    fontSize: TOKENS.fontSizeSmallLabel,
                    fontWeight: TOKENS.fontWeightSmallLabel,
                    color: TOKENS.colorTextMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    mb: `${TOKENS.space2}px`,
                }}
            >
                {title}
            </Box>
            <Box
                sx={{
                    bgcolor: TOKENS.colorBgElevated,
                    border: `1px solid ${TOKENS.colorBorder}`,
                    borderRadius: `${TOKENS.radiusLg}px`,
                    p: `${TOKENS.space2}px`,
                    overflowX: 'auto',
                }}
            >
                {children}
            </Box>
        </Box>
    );
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
    const toneColor =
        tone === 'error' ? TOKENS.colorError : tone === 'warn' ? TOKENS.colorWarn : tone === 'success' ? TOKENS.colorSuccess : TOKENS.colorText;

    return (
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: `${TOKENS.space2}px`, minWidth: 0 }}>
            <Box
                component="span"
                sx={{
                    fontFamily: TOKENS.fontFamily,
                    fontSize: TOKENS.fontSizeSmallLabel,
                    fontWeight: TOKENS.fontWeightSmallLabel,
                    color: TOKENS.colorTextMuted,
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
                    fontFamily: mono ? TOKENS.fontFamilyMono : TOKENS.fontFamily,
                    fontSize: mono ? TOKENS.fontSizeJson : TOKENS.fontSizeBodyCompact,
                    fontWeight: TOKENS.fontWeightBodyCompact,
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
