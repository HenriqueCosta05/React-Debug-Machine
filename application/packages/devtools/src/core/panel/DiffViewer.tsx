import React from 'react';
import { Box } from '@mui/material';
import { hexToRgba, TOKENS } from './tokens';
import { JsonViewer } from './JsonViewer';

interface DiffViewerProps {
    before: unknown;
    after: unknown;
}

// Communicates added / removed / changed / kept per DESIGN.md "Diff viewer" —
// never hides the previous value behind "...".
export function DiffViewer({ before, after }: DiffViewerProps): React.ReactElement {
    if (isPlainObject(before) && isPlainObject(after)) {
        const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${TOKENS.space1}px` }}>
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

const rowBase = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: `${TOKENS.space2}px`,
    px: `${TOKENS.space2}px`,
    py: `${TOKENS.space1}px`,
    borderRadius: `${TOKENS.radiusMd}px`,
    fontFamily: TOKENS.fontFamilyMono,
    fontSize: TOKENS.fontSizeJson,
    lineHeight: '17px',
} as const;

function DiffRow({
    kind,
    label,
    value,
}: {
    kind: 'added' | 'removed' | 'unchanged';
    label: string;
    value: unknown;
}): React.ReactElement {
    const style =
        kind === 'added'
            ? { bg: hexToRgba(TOKENS.colorDiffAdd, 0.12), border: TOKENS.colorDiffAdd, indicator: '+' }
            : kind === 'removed'
              ? { bg: hexToRgba(TOKENS.colorDiffRemove, 0.12), border: TOKENS.colorDiffRemove, indicator: '−' }
              : { bg: 'transparent', border: 'transparent', indicator: ' ' };

    return (
        <Box
            sx={{
                ...rowBase,
                bgcolor: style.bg,
                borderLeft: `2px solid ${style.border}`,
            }}
        >
            <Box component="span" sx={{ color: style.border, fontWeight: 700, width: 10, flexShrink: 0 }}>
                {style.indicator}
            </Box>
            <Box component="span" sx={{ color: TOKENS.colorTextSecondary, flexShrink: 0 }}>
                {label}:
            </Box>
            <Box sx={{ minWidth: 0, flex: 1, opacity: kind === 'unchanged' ? TOKENS.opacityDivider : 1 }}>
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
    return (
        <Box sx={{ ...rowBase, bgcolor: TOKENS.colorBgSubtle, borderLeft: `2px solid ${TOKENS.colorSecondary}` }}>
            <Box component="span" sx={{ color: TOKENS.colorSecondary, fontWeight: 700, width: 10, flexShrink: 0 }}>
                ~
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
                {label !== null && (
                    <Box component="span" sx={{ color: TOKENS.colorTextSecondary }}>
                        {label}:{' '}
                    </Box>
                )}
                <Box component="span" sx={{ color: TOKENS.colorDiffRemove }}>
                    <JsonViewer value={before} inline />
                </Box>
                <Box component="span" sx={{ color: TOKENS.colorTextMuted, px: '4px' }}>
                    →
                </Box>
                <Box component="span" sx={{ color: TOKENS.colorDiffAdd }}>
                    <JsonViewer value={after} inline />
                </Box>
            </Box>
        </Box>
    );
}
