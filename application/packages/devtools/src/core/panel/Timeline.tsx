import React from 'react';
import { Box, Tooltip } from '@mui/material';
import type { TimelineEntry } from '@henriquecosta/react-debug-machine-shared';
import { getEventColor, TYPE_LABEL } from './eventPresentation';
import { FOCUS_RING, REDUCED_MOTION, TOKENS, TRANSITION } from './tokens';

interface Props {
    events: readonly TimelineEntry[];
    selectedSequence: number | null;
    onSelect: (sequence: number) => void;
}

// Compact chronological strip (DESIGN.md "Timeline") — one tick per event,
// oldest first, colored by severity/type, selection mirrors the nav list.
export function Timeline({ events, selectedSequence, onSelect }: Props): React.ReactElement {
    return (
        <Box
            role="region"
            aria-label="Event timeline"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: `${TOKENS.space1}px`,
                height: 44,
                px: `${TOKENS.space3}px`,
                borderBottom: `1px solid ${TOKENS.colorBorder}`,
                bgcolor: TOKENS.colorBgSubtle,
                overflowX: 'auto',
                overflowY: 'hidden',
                flexShrink: 0,
                scrollbarWidth: 'thin',
            }}
        >
            {events.length === 0 ? (
                <Box
                    sx={{
                        color: TOKENS.colorTextMuted,
                        fontSize: TOKENS.fontSizeMetadata,
                        fontFamily: TOKENS.fontFamily,
                    }}
                >
                    No events on the timeline yet.
                </Box>
            ) : (
                events.map((entry) => {
                    const selected = entry.sequence === selectedSequence;
                    const color = getEventColor(entry);
                    return (
                        <Tooltip
                            key={entry.sequence}
                            title={`${TYPE_LABEL[entry.type]} · ${entry.timestamp.toFixed(2)}ms`}
                            enterDelay={300}
                            arrow
                        >
                            <Box
                                component="button"
                                type="button"
                                aria-label={`${TYPE_LABEL[entry.type]} event at ${entry.timestamp.toFixed(2)}ms`}
                                aria-selected={selected}
                                onClick={() => onSelect(entry.sequence)}
                                sx={{
                                    flexShrink: 0,
                                    width: 6,
                                    height: 24,
                                    p: 0,
                                    border: 'none',
                                    borderRadius: `${TOKENS.radiusSm}px`,
                                    bgcolor: color,
                                    opacity: selected ? 1 : TOKENS.opacityDivider,
                                    boxShadow: selected ? `0 0 0 1px ${TOKENS.colorSecondary}` : 'none',
                                    cursor: 'pointer',
                                    transition: TRANSITION,
                                    ...REDUCED_MOTION,
                                    '&:hover': { opacity: 1 },
                                    '&:focus-visible': FOCUS_RING,
                                }}
                            />
                        </Tooltip>
                    );
                })
            )}
        </Box>
    );
}
