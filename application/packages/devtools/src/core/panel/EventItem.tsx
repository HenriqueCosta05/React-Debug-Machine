import React from 'react';
import { Box, useTheme } from '@mui/material';
import type { TimelineEntry } from '@henriquecosta/react-debug-machine-shared';
import { Badge } from './Badge';
import { getEventSeverity } from './eventSeverity';
import { getBadgeTone, renderEventSummary, TYPE_LABEL } from './eventPresentation';
import { MONO_FONT_FAMILY } from './theme';
import type { Theme } from '@mui/material/styles';

interface Props {
    entry: TimelineEntry;
    selected: boolean;
    onSelect: (sequence: number) => void;
}

function severityBorder(theme: Theme, severity: 'error' | 'warn' | 'normal'): string {
    if (severity === 'error') return theme.palette.error.main;
    if (severity === 'warn') return theme.palette.warning.main;
    return 'transparent';
}

// Selection uses an inset outline (rather than a real border) so the 2px
// severity border-left indicator stays visible at the same time — both signals
// must remain readable together per DESIGN.md "color independence".
export function EventItem({ entry, selected, onSelect }: Props): React.ReactElement {
    const theme = useTheme();
    const severity = getEventSeverity(entry);

    return (
        <Box
            role="option"
            aria-selected={selected}
            tabIndex={0}
            onClick={() => onSelect(entry.sequence)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect(entry.sequence);
                }
            }}
            sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: `${theme.spacing(1)}`,
                minHeight: 28,
                px: `${theme.spacing(1)}`,
                py: `${theme.spacing(0.5)}`,
                borderBottom: `1px solid ${theme.palette.divider}`,
                borderLeft: `2px solid ${severityBorder(theme, severity)}`,
                fontSize: 13,
                fontFamily: theme.typography.fontFamily,
                color: theme.palette.text.secondary,
                cursor: 'pointer',
                bgcolor: selected ? theme.palette.primary.main : 'transparent',
                boxShadow: selected ? `inset 0 0 0 1px ${theme.palette.secondary.main}` : 'none',
                '&:hover': { bgcolor: selected ? theme.palette.primary.main : theme.palette.action.hover },
            }}
        >
            <Box
                component="span"
                sx={{
                    color: theme.palette.text.disabled,
                    minWidth: 72,
                    fontSize: 11,
                    fontFamily: MONO_FONT_FAMILY,
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                }}
            >
                {entry.timestamp.toFixed(2)}ms
            </Box>
            <Badge tone={getBadgeTone(entry)}>{TYPE_LABEL[entry.type]}</Badge>
            <Box
                component="span"
                sx={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minWidth: 0,
                    color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
                }}
            >
                {renderEventSummary(entry)}
            </Box>
            <Box
                component="span"
                sx={{
                    color: theme.palette.text.disabled,
                    fontFamily: MONO_FONT_FAMILY,
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: 11,
                    flexShrink: 0,
                }}
            >
                #{entry.sequence}
            </Box>
        </Box>
    );
}
