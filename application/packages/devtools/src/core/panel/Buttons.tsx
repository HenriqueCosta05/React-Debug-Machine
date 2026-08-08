import React from 'react';
import { Box } from '@mui/material';
import { FOCUS_RING, REDUCED_MOTION, TOKENS, TRANSITION } from './tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const baseSx = {
    fontFamily: TOKENS.fontFamily,
    fontSize: TOKENS.fontSizeSmallLabel,
    fontWeight: 700,
    height: 32,
    px: `${TOKENS.space3}px`,
    borderRadius: `${TOKENS.radiusMd}px`,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${TOKENS.space1}px`,
    whiteSpace: 'nowrap',
    transition: TRANSITION,
    ...REDUCED_MOTION,
    '&:focus-visible': FOCUS_RING,
    '&:disabled': {
        color: TOKENS.colorTextDisabled,
        borderColor: TOKENS.colorBorder,
        cursor: 'not-allowed',
    },
} as const;

// Button primary: DESIGN.md "Buttons" — bg color-primary, border color-border-strong.
export function PrimaryButton({ children, ...rest }: ButtonProps): React.ReactElement {
    return (
        <Box
            component="button"
            type="button"
            sx={{
                ...baseSx,
                bgcolor: TOKENS.colorPrimary,
                color: TOKENS.colorText,
                border: `1px solid ${TOKENS.colorBorderStrong}`,
                '&:hover:not(:disabled)': { bgcolor: TOKENS.colorBgActive },
                '&:active:not(:disabled)': { bgcolor: TOKENS.colorBgActive, boxShadow: `inset 0 0 0 1px ${TOKENS.colorBorderStrong}` },
            }}
            {...rest}
        >
            {children}
        </Box>
    );
}

// Button secondary: transparent bg, color-text-secondary, border color-border.
export function SecondaryButton({
    children,
    tone = 'default',
    ...rest
}: ButtonProps & { tone?: 'default' | 'error' }): React.ReactElement {
    const textColor = tone === 'error' ? TOKENS.colorError : TOKENS.colorTextSecondary;
    return (
        <Box
            component="button"
            type="button"
            sx={{
                ...baseSx,
                bgcolor: 'transparent',
                color: textColor,
                border: `1px solid ${tone === 'error' ? TOKENS.colorError : TOKENS.colorBorder}`,
                '&:hover:not(:disabled)': { bgcolor: TOKENS.colorBgHover, color: tone === 'error' ? TOKENS.colorError : TOKENS.colorText },
                '&:active:not(:disabled)': { bgcolor: TOKENS.colorBgActive },
            }}
            {...rest}
        >
            {children}
        </Box>
    );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    tone?: 'default' | 'danger';
    children: React.ReactNode;
}

// Icon button: DESIGN.md — visual glyph 16–20px inside a 40x40 clickable area;
// aria-label required since the icon alone isn't an accessible label.
export function IconButtonToken({ label, tone = 'default', children, ...rest }: IconButtonProps): React.ReactElement {
    return (
        <Box
            component="button"
            type="button"
            aria-label={label}
            title={label}
            sx={{
                width: 40,
                height: 40,
                minWidth: 40,
                p: 0,
                border: 'none',
                background: 'transparent',
                color: tone === 'danger' ? TOKENS.colorError : TOKENS.colorTextSecondary,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: `${TOKENS.radiusMd}px`,
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
                transition: TRANSITION,
                ...REDUCED_MOTION,
                '&:hover': { bgcolor: TOKENS.colorBgHover, color: TOKENS.colorText },
                '&:active': { bgcolor: TOKENS.colorBgActive },
                '&:focus-visible': FOCUS_RING,
                '&:disabled': { color: TOKENS.colorTextDisabled, cursor: 'not-allowed' },
            }}
            {...rest}
        >
            {children}
        </Box>
    );
}
