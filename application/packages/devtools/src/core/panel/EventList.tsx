import React from 'react';
import { Box } from '@mui/material';
import type { TimelineEntry } from '@henriquecosta/react-debug-machine-shared';
import { EventItem } from './EventItem';
import { TOKENS } from './tokens';

interface Props {
    events: readonly TimelineEntry[];
}

export function EventList({ events }: Props): React.ReactElement {
    return (
        <Box sx={{ flex: 1, overflowY: 'auto', fontFamily: TOKENS.fontFamily }}>
            {events.length === 0 ? (
                <Box sx={{ p: 2, color: '#546e7a', fontSize: 13, fontFamily: TOKENS.fontFamily }}>
                    No events captured.
                </Box>
            ) : (
                [...events].reverse().map((entry) => (
                    <EventItem key={entry.sequence} entry={entry} />
                ))
            )}
        </Box>
    );
}
