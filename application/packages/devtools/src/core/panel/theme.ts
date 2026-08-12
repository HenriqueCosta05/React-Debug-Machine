// Token set mirrors docs/DESIGN.md "CSS custom properties" section 1:1 — keep in sync
// when the design doc changes. No hardcoded colors/spacing/radius/shadows/z-index

import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#0F3040',
            paper: '#143A4C',
        },
        primary: {
            main: '#464858',
        },
        secondary: {
            main: '#A56F63',
        },
        error: {
            main: '#FF5656',
        },
        warning: {
            main: '#FF8A6D',
        },
        info: {
            main: '#78A9D1',
        },
        success: {
            main: '#78B9B5',
        },
    },
    typography: {
        fontFamily:
            '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    shape: {
        borderRadius: 4,
    },
});

// MUI's theme typography has no monospace family — captured values (JSON, diffs,
// timestamps) need one, so it lives here alongside the other cross-cutting look constants.
export const MONO_FONT_FAMILY =
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

// Subtle backgrounds (e.g. diff add/remove rows) must derive from tokens rather
// than introduce new hardcoded colors — see DESIGN.md "Regras anti-pattern".
export function hexToRgba(hex: string, alpha: number): string {
    const clean = hex.replace('#', '');
    const value = parseInt(clean, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
