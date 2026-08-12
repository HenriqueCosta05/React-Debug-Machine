import React from 'react';
import { Box, useTheme } from '@mui/material';

export type BadgeTone = 'error' | 'warning' | 'success' | 'info' | 'secondary';

interface BadgeProps {
    children: React.ReactNode;
    tone?: BadgeTone;
}

// Dimensions per DESIGN.md "Badges": 11px/700, 6px horizontal / 2px vertical padding, radius-sm.
export function Badge({ children, tone = 'info' }: BadgeProps): React.ReactElement {
    const theme = useTheme();
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-block',
                bgcolor: theme.palette[tone].main,
                color: theme.palette.getContrastText(theme.palette[tone].main),
                fontFamily: theme.typography.fontFamily,
                fontSize: 11,
                fontWeight: 700,
                lineHeight: '14px',
                px: '6px',
                py: '2px',
                borderRadius: `${theme.shape.borderRadius}px`,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                flexShrink: 0,
            }}
        >
            {children}
        </Box>
    );
}
