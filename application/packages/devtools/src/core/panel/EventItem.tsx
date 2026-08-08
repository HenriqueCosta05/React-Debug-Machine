import React from 'react';
import { Box } from '@mui/material';
import type { TimelineEntry } from '@henriquecosta/react-debug-machine-shared';
import { Badge } from './Badge';
import { getEventSeverity } from './eventSeverity';
import { getBadgeTone, renderEventSummary, TYPE_LABEL } from './eventPresentation';
import { REDUCED_MOTION, TOKENS, TRANSITION } from './tokens';

interface Props {
    entry: TimelineEntry;
    selected: boolean;
    onSelect: (sequence: number) => void;
}

const SEVERITY_BORDER: Record<'error' | 'warn' | 'normal', string> = {
    error: TOKENS.colorError,
    warn: TOKENS.colorWarn,
    normal: 'transparent',
};

// Selection uses an inset outline (rather than a real border) so the 2px
// severity border-left indicator stays visible at the same time — both signals
// must remain readable together per DESIGN.md "color independence".
export function EventItem({ entry, selected, onSelect }: Props): React.ReactElement {
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
                gap: `${TOKENS.space2}px`,
                minHeight: 28,
                px: `${TOKENS.space2}px`,
                py: `${TOKENS.space1}px`,
                borderBottom: `1px solid ${TOKENS.colorBorder}`,
                borderLeft: `2px solid ${SEVERITY_BORDER[severity]}`,
                fontSize: TOKENS.fontSizeBodyCompact,
                fontFamily: TOKENS.fontFamily,
                color: TOKENS.colorTextSecondary,
                cursor: 'pointer',
                bgcolor: selected ? TOKENS.colorPrimary : 'transparent',
                boxShadow: selected ? `inset 0 0 0 1px ${TOKENS.colorSecondary}` : 'none',
                transition: TRANSITION,
                ...REDUCED_MOTION,
                '&:hover': { bgcolor: selected ? TOKENS.colorPrimary : TOKENS.colorBgHover },
                '&:focus-visible': {
                    outline: `${TOKENS.borderWidthFocus}px solid ${TOKENS.colorFocus}`,
                    outlineOffset: '-2px',
                },
            }}
        >
            <Box
                component="span"
                sx={{
                    color: TOKENS.colorTextMuted,
                    minWidth: 72,
                    fontSize: TOKENS.fontSizeMetadata,
                    fontFamily: TOKENS.fontFamilyMono,
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
                    color: selected ? TOKENS.colorText : TOKENS.colorTextSecondary,
                }}
            >
                {renderEventSummary(entry)}
            </Box>
            <Box
                component="span"
                sx={{
                    color: TOKENS.colorTextMuted,
                    fontFamily: TOKENS.fontFamilyMono,
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: TOKENS.fontSizeMetadata,
                    flexShrink: 0,
                }}
            >
                #{entry.sequence}
            </Box>
        </Box>
    );
}
