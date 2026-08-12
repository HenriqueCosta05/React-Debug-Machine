import React from 'react';
import { Box, Stack, useTheme } from '@mui/material';
import { IconButtonToken, SecondaryButton } from './Buttons';

interface Props {
    children?: React.ReactNode;
    onClear: () => void;
    onClose: () => void;
}

// Header responsibilities per DESIGN.md: brand identity, capture status,
// global controls, close — 40–48px tall.
export function Header({ children, onClear, onClose }: Props): React.ReactElement {
    const theme = useTheme();
    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                height: 44,
                flexShrink: 0,
                px: `${theme.spacing(2)}`,
                gap: `${theme.spacing(1.5)}`,
                borderBottom: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
            }}
        >
            <Box
                sx={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: 16,
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    flexShrink: 0,
                }}
            >
                React Debug Machine
            </Box>

            <Stack direction="row" alignItems="center" spacing={`${theme.spacing(0.5)}`} sx={{ flexShrink: 0 }}>
                <Box
                    aria-hidden
                    sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.success.main, flexShrink: 0 }}
                />
                <Box
                    sx={{
                        fontFamily: theme.typography.fontFamily,
                        fontSize: 12,
                        fontWeight: 600,
                        color: theme.palette.text.secondary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                    }}
                >
                    Capturing
                </Box>
            </Stack>

            <Box sx={{ flex: 1, minWidth: `${theme.spacing(2)}` }} />

            <Stack direction="row" alignItems="center" spacing={`${theme.spacing(1)}`} sx={{ flexShrink: 0 }}>
                {children}
                <SecondaryButton onClick={onClear}>Clear</SecondaryButton>
                <IconButtonToken label="Close panel" onClick={onClose}>
                    ×
                </IconButtonToken>
            </Stack>
        </Stack>
    );
}
