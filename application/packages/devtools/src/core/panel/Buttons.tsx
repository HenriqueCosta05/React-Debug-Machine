import React from 'react';
import { Box, useTheme } from '@mui/material';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

// Button primary: DESIGN.md "Buttons" — bg color-primary, border color-border-strong.
export function PrimaryButton({ children, ...rest }: ButtonProps): React.ReactElement {
    const theme = useTheme();
    return (
        <Box
            component="button"
            type="button"
            sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                border: `1px solid ${theme.palette.divider}`,
                '&:hover:not(:disabled)': { bgcolor: theme.palette.action.hover },
                '&:active:not(:disabled)': { bgcolor: theme.palette.action.selected, boxShadow: `inset 0 0 0 1px ${theme.palette.divider}` },
            }}
            {...rest}
        >
            {children}
        </Box>
    );
}

export function SecondaryButton({
    children,
    tone = 'default',
    ...rest
}: ButtonProps & { tone?: 'default' | 'error' }): React.ReactElement {
    const theme = useTheme();
    return (
        <Box
            component="button"
            type="button"
            sx={{
                bgcolor: 'transparent',
                color: theme.palette.getContrastText(theme.palette.background.paper),
                border: `1px solid ${tone === 'error' ? theme.palette.error.main : theme.palette.divider}`,
                '&:hover:not(:disabled)': { bgcolor: theme.palette.action.hover, color: tone === 'error' ? theme.palette.error.main : theme.palette.text.secondary },
                '&:active:not(:disabled)': { bgcolor: theme.palette.action.selected },
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

export function IconButtonToken({ label, tone = 'default', children, ...rest }: IconButtonProps): React.ReactElement {
    const theme = useTheme();
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
                color: tone === 'danger' ? theme.palette.error.main : theme.palette.text.secondary,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: `${theme.shape.borderRadius}px`,
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
            }}
            {...rest}
        >
            {children}
        </Box>
    );
}
