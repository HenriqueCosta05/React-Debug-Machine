// Token set mirrors docs/DESIGN.md "CSS custom properties" section 1:1 — keep in sync
// when the design doc changes. No hardcoded colors/spacing/radius/shadows/z-index
// should appear outside this file.
export const TOKENS = {
    // Colors
    colorBg: '#0F3040',
    colorPrimary: '#464858',
    colorSecondary: '#A56F63',
    colorError: '#FF5656',
    colorWarn: '#FF8A6D',
    colorDiffAdd: '#78B9B5',
    colorDiffRemove: '#AE445A',

    colorBgElevated: '#143A4C',
    colorBgSubtle: '#112F3E',
    colorBgHover: '#1A4355',
    colorBgActive: '#254B5B',

    colorBorder: '#315365',
    colorBorderStrong: '#4A6675',

    colorText: '#F2F5F6',
    colorTextSecondary: '#B8C5CA',
    colorTextMuted: '#7F949D',
    colorTextDisabled: '#526B75',

    colorFocus: '#78B9B5',
    colorSuccess: '#78B9B5',
    colorInfo: '#78A9D1',
    colorOverlay: 'rgba(0, 0, 0, 0.45)',

    // Opacity — for state layers, never for text carrying captured values.
    opacityHover: 0.08,
    opacityActive: 0.14,
    opacityDisabled: 0.45,
    opacityDivider: 0.65,

    // Typography
    fontFamily: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontFamilyMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',

    fontSizeAppTitle: 16,
    fontWeightAppTitle: 700,
    fontSizeHeading: 20,
    fontWeightHeading: 700,
    fontSizeSectionTitle: 14,
    fontWeightSectionTitle: 700,
    fontSizeBody: 14,
    fontWeightBody: 500,
    fontSizeBodyCompact: 13,
    fontWeightBodyCompact: 500,
    fontSizeSmallLabel: 12,
    fontWeightSmallLabel: 600,
    fontSizeMetadata: 11,
    fontWeightMetadata: 500,
    fontSizeJson: 12,
    fontWeightJson: 500,
    fontSizeToggleLabel: 12,
    fontWeightToggleLabel: 700,

    // Spacing — 4px base scale
    space1: 4,
    space2: 8,
    space3: 12,
    space4: 16,
    space5: 20,
    space6: 24,
    space8: 32,
    space10: 40,
    space12: 48,

    // Radius
    radiusNone: 0,
    radiusSm: 2,
    radiusMd: 4,
    radiusLg: 6,
    radiusXl: 8,
    radiusPill: 999,

    // Borders
    borderWidthDefault: 1,
    borderWidthStrong: 1,
    borderWidthFocus: 2,

    // Shadows
    shadowPanel: '0 8px 32px rgba(0, 0, 0, 0.32)',
    shadowPopover: '0 4px 16px rgba(0, 0, 0, 0.28)',
    shadowModal: '0 12px 48px rgba(0, 0, 0, 0.40)',

    // Transitions
    transitionDuration: '120ms',
    transitionEasing: 'ease-out',

    // Z-index
    zBase: 0,
    zSticky: 10,
    zDropdown: 100,
    zTooltip: 200,
    zModal: 300,
    zToggle: 400,
} as const;

export const TRANSITION = `background-color ${TOKENS.transitionDuration} ${TOKENS.transitionEasing}, border-color ${TOKENS.transitionDuration} ${TOKENS.transitionEasing}, color ${TOKENS.transitionDuration} ${TOKENS.transitionEasing}, opacity ${TOKENS.transitionDuration} ${TOKENS.transitionEasing}`;

export const REDUCED_MOTION = {
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
} as const;

export const FOCUS_RING = {
    outline: `${TOKENS.borderWidthFocus}px solid ${TOKENS.colorFocus}`,
    outlineOffset: '2px',
} as const;

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
