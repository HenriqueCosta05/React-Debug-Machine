import React from 'react';
import { Box, Stack } from '@mui/material';
import { IconButtonToken, SecondaryButton } from './Buttons';
import { TOKENS } from './tokens';

interface Props {
    children?: React.ReactNode;
    onClear: () => void;
    onClose: () => void;
}

// Header responsibilities per DESIGN.md: brand identity, capture status,
// global controls, close — 40–48px tall.
export function Header({ children, onClear, onClose }: Props): React.ReactElement {
    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                height: 44,
                flexShrink: 0,
                px: `${TOKENS.space4}px`,
                gap: `${TOKENS.space3}px`,
                borderBottom: `1px solid ${TOKENS.colorBorder}`,
                bgcolor: TOKENS.colorBgElevated,
            }}
        >
            <Box
                sx={{
                    fontFamily: TOKENS.fontFamily,
                    fontSize: TOKENS.fontSizeAppTitle,
                    fontWeight: TOKENS.fontWeightAppTitle,
                    color: TOKENS.colorText,
                    flexShrink: 0,
                }}
            >
                React Debug Machine
            </Box>

            <Stack direction="row" alignItems="center" spacing={`${TOKENS.space1}px`} sx={{ flexShrink: 0 }}>
                <Box
                    aria-hidden
                    sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: TOKENS.colorSuccess, flexShrink: 0 }}
                />
                <Box
                    sx={{
                        fontFamily: TOKENS.fontFamily,
                        fontSize: TOKENS.fontSizeSmallLabel,
                        fontWeight: TOKENS.fontWeightSmallLabel,
                        color: TOKENS.colorTextSecondary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                    }}
                >
                    Capturing
                </Box>
            </Stack>

            <Box sx={{ flex: 1, minWidth: `${TOKENS.space4}px` }} />

            <Stack direction="row" alignItems="center" spacing={`${TOKENS.space2}px`} sx={{ flexShrink: 0 }}>
                {children}
                <SecondaryButton onClick={onClear}>Clear</SecondaryButton>
                <IconButtonToken label="Close panel" onClick={onClose}>
                    ×
                </IconButtonToken>
            </Stack>
        </Stack>
    );
}
