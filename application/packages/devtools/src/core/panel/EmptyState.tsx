import React from 'react';
import { Box } from '@mui/material';
import { TOKENS } from './tokens';

interface EmptyStateProps {
    title: string;
    description: string;
}

// Compact empty state per DESIGN.md — must answer what's empty, why, and what to do next; no large illustrations.
export function EmptyState({ title, description }: EmptyStateProps): React.ReactElement {
    return (
        <Box sx={{ p: `${TOKENS.space4}px`, fontFamily: TOKENS.fontFamily }}>
            <Box
                sx={{
                    fontSize: TOKENS.fontSizeBodyCompact,
                    fontWeight: 700,
                    color: TOKENS.colorTextSecondary,
                    mb: `${TOKENS.space1}px`,
                }}
            >
                {title}
            </Box>
            <Box sx={{ fontSize: TOKENS.fontSizeMetadata, color: TOKENS.colorTextMuted, lineHeight: '16px' }}>
                {description}
            </Box>
        </Box>
    );
}
