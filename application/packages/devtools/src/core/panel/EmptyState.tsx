import React from 'react';
import { Box, useTheme } from '@mui/material';

interface EmptyStateProps {
    title: string;
    description: string;
}

// Compact empty state per DESIGN.md — must answer what's empty, why, and what to do next; no large illustrations.
export function EmptyState({ title, description }: EmptyStateProps): React.ReactElement {
    const theme = useTheme();
    return (
        <Box sx={{ p: `${theme.spacing(2)}`, fontFamily: theme.typography.fontFamily }}>
            <Box
                sx={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.palette.text.secondary,
                    mb: `${theme.spacing(0.5)}`,
                }}
            >
                {title}
            </Box>
            <Box sx={{ fontSize: 11, color: theme.palette.text.disabled, lineHeight: '16px' }}>
                {description}
            </Box>
        </Box>
    );
}
