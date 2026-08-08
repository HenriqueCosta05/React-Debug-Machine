import React from 'react';
import { Box } from '@mui/material';
import { TOKENS } from './tokens';

export type BadgeTone = 'error' | 'warn' | 'success' | 'info' | 'secondary' | 'neutral';

const TONE_COLORS: Record<BadgeTone, { bg: string; fg: string }> = {
    error: { bg: TOKENS.colorError, fg: TOKENS.colorBg },
    warn: { bg: TOKENS.colorWarn, fg: TOKENS.colorBg },
    success: { bg: TOKENS.colorSuccess, fg: TOKENS.colorBg },
    info: { bg: TOKENS.colorInfo, fg: TOKENS.colorBg },
    secondary: { bg: TOKENS.colorSecondary, fg: TOKENS.colorText },
    neutral: { bg: TOKENS.colorBgActive, fg: TOKENS.colorTextSecondary },
};

interface BadgeProps {
    children: React.ReactNode;
    tone?: BadgeTone;
}

// Dimensions per DESIGN.md "Badges": 11px/700, 6px horizontal / 2px vertical padding, radius-sm.
export function Badge({ children, tone = 'neutral' }: BadgeProps): React.ReactElement {
    const colors = TONE_COLORS[tone];
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-block',
                bgcolor: colors.bg,
                color: colors.fg,
                fontFamily: TOKENS.fontFamily,
                fontSize: 11,
                fontWeight: 700,
                lineHeight: '14px',
                px: '6px',
                py: '2px',
                borderRadius: `${TOKENS.radiusSm}px`,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                flexShrink: 0,
            }}
        >
            {children}
        </Box>
    );
}
