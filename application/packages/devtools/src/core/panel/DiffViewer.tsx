import React from 'react';
import { Box, useTheme, type Theme } from '@mui/material';
import { hexToRgba, MONO_FONT_FAMILY } from './theme';
import { JsonViewer } from './JsonViewer';

interface DiffViewerProps {
    before: unknown;
    after: unknown;
}

// Communicates added / removed / changed / kept per DESIGN.md "Diff viewer" —
// never hides the previous value behind "...".
export function DiffViewer({ before, after }: DiffViewerProps): React.ReactElement {
    const theme = useTheme();

    if (isPlainObject(before) && isPlainObject(after)) {
        const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${theme.spacing(1)}` }}>
                {keys.map((key) => {
                    const hasBefore = Object.prototype.hasOwnProperty.call(before, key);
                    const hasAfter = Object.prototype.hasOwnProperty.call(after, key);
                    if (hasBefore && !hasAfter) {
                        return <DiffRow key={key} kind="removed" label={key} value={before[key]} />;
                    }
                    if (!hasBefore && hasAfter) {
                        return <DiffRow key={key} kind="added" label={key} value={after[key]} />;
                    }
                    if (jsonEqual(before[key], after[key])) {
                        return <DiffRow key={key} kind="unchanged" label={key} value={before[key]} />;
                    }
                    return <DiffChangedRow key={key} label={key} before={before[key]} after={after[key]} />;
                })}
            </Box>
        );
    }

    return <DiffChangedRow label={null} before={before} after={after} />;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function jsonEqual(a: unknown, b: unknown): boolean {
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    } catch {
        return a === b;
    }
}

function rowBaseSx(theme: Theme) {
    return {
        display: 'flex',
        alignItems: 'flex-start',
        gap: `${theme.spacing(1)}`,
        px: `${theme.spacing(1)}`,
        py: `${theme.spacing(0.5)}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        fontFamily: MONO_FONT_FAMILY,
        fontSize: 12,
        lineHeight: '17px',
    } as const;
}

function DiffRow({
    kind,
    label,
    value,
}: {
    kind: 'added' | 'removed' | 'unchanged';
    label: string;
    value: unknown;
}): React.ReactElement {
    const theme = useTheme();
    const style =
        kind === 'added'
            ? { bg: hexToRgba(theme.palette.success.main, 0.12), border: theme.palette.success.main, indicator: '+' }
            : kind === 'removed'
              ? { bg: hexToRgba(theme.palette.error.main, 0.12), border: theme.palette.error.main, indicator: '−' }
              : { bg: 'transparent', border: 'transparent', indicator: ' ' };

    return (
        <Box
            sx={{
                ...rowBaseSx(theme),
                bgcolor: style.bg,
                borderLeft: `2px solid ${style.border}`,
            }}
        >
            <Box component="span" sx={{ color: style.border, fontWeight: 700, width: 10, flexShrink: 0 }}>
                {style.indicator}
            </Box>
            <Box component="span" sx={{ color: theme.palette.text.secondary, flexShrink: 0 }}>
                {label}:
            </Box>
            <Box sx={{ minWidth: 0, flex: 1, opacity: kind === 'unchanged' ? 0.65 : 1 }}>
                <JsonViewer value={value} />
            </Box>
        </Box>
    );
}

function DiffChangedRow({
    label,
    before,
    after,
}: {
    label: string | null;
    before: unknown;
    after: unknown;
}): React.ReactElement {
    const theme = useTheme();
    return (
        <Box sx={{ ...rowBaseSx(theme), bgcolor: theme.palette.background.default, borderLeft: `2px solid ${theme.palette.secondary.main}` }}>
            <Box component="span" sx={{ color: theme.palette.secondary.main, fontWeight: 700, width: 10, flexShrink: 0 }}>
                ~
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
                {label !== null && (
                    <Box component="span" sx={{ color: theme.palette.text.secondary }}>
                        {label}:{' '}
                    </Box>
                )}
                <Box component="span" sx={{ color: theme.palette.error.main }}>
                    <JsonViewer value={before} inline />
                </Box>
                <Box component="span" sx={{ color: theme.palette.text.disabled, px: '4px' }}>
                    →
                </Box>
                <Box component="span" sx={{ color: theme.palette.success.main }}>
                    <JsonViewer value={after} inline />
                </Box>
            </Box>
        </Box>
    );
}
