import React from 'react';
import { Box, Tooltip, useTheme } from '@mui/material';
import type { TimelineEntry } from '@henriquecosta/react-debug-machine-shared';
import { getEventColor, TYPE_LABEL } from './eventPresentation';

interface Props {
    events: readonly TimelineEntry[];
    selectedSequence: number | null;
    onSelect: (sequence: number) => void;
}

// Compact chronological strip (DESIGN.md "Timeline") — one tick per event,
// oldest first, colored by severity/type, selection mirrors the nav list.
export function Timeline({ events, selectedSequence, onSelect }: Props): React.ReactElement {
    const theme = useTheme();
    return (
        <Box
            role="region"
            aria-label="Event timeline"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: `${theme.spacing(0.5)}`,
                height: 44,
                px: `${theme.spacing(1.5)}`,
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.default,
                overflowX: 'auto',
                overflowY: 'hidden',
                flexShrink: 0,
                scrollbarWidth: 'thin',
            }}
        >
            {events.length === 0 ? (
                <Box
                    sx={{
                        color: theme.palette.text.disabled,
                        fontSize: 11,
                        fontFamily: theme.typography.fontFamily,
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
                                    borderRadius: `${theme.shape.borderRadius / 2}px`,
                                    bgcolor: color,
                                    opacity: selected ? 1 : 0.65,
                                    boxShadow: selected ? `0 0 0 1px ${theme.palette.secondary.main}` : 'none',
                                    cursor: 'pointer',
                                    '&:hover': { opacity: 1 },
                                }}
                            />
                        </Tooltip>
                    );
                })
            )}
        </Box>
    );
}
