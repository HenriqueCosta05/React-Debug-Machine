import React from 'react';
import { Box } from '@mui/material';
import type { TimelineEntry } from '@henriquecosta/react-debug-machine-shared';
import { EventItem } from './EventItem';
import { EmptyState } from './EmptyState';
import { TOKENS } from './tokens';

interface Props {
    events: readonly TimelineEntry[];
    selectedSequence: number | null;
    onSelect: (sequence: number) => void;
}

export function EventList({ events, selectedSequence, onSelect }: Props): React.ReactElement {
    return (
        <Box
            role="listbox"
            aria-label="Captured events"
            sx={{ flex: 1, overflowY: 'auto', fontFamily: TOKENS.fontFamily, minHeight: 0 }}
        >
            {events.length === 0 ? (
                <EmptyState
                    title="No events captured"
                    description="Start interacting with the application to inspect activity."
                />
            ) : (
                [...events]
                    .reverse()
                    .map((entry) => (
                        <EventItem
                            key={entry.sequence}
                            entry={entry}
                            selected={entry.sequence === selectedSequence}
                            onSelect={onSelect}
                        />
                    ))
            )}
        </Box>
    );
}
