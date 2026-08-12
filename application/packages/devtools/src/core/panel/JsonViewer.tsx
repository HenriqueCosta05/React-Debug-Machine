import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { MONO_FONT_FAMILY } from './theme';

interface JsonViewerProps {
    value: unknown;
    // When true, renders as an inline span (e.g. embedded in a diff row) instead
    // of a block-level <pre>.
    inline?: boolean;
}

// Renders captured values verbatim: no rounding, no truncation, no type coercion
// (42 stays a number, false stays a boolean). Collapse state is explicit — never
// hides data as a side effect of a default. See DESIGN.md "JSON viewer".
export function JsonViewer({ value, inline = false }: JsonViewerProps): React.ReactElement {
    const theme = useTheme();
    return (
        <Box
            component={inline ? 'span' : 'pre'}
            sx={{
                m: 0,
                display: inline ? 'inline' : 'block',
                fontFamily: MONO_FONT_FAMILY,
                fontSize: 12,
                lineHeight: '17px',
                color: theme.palette.text.primary,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowX: inline ? undefined : 'auto',
            }}
        >
            <JsonNode value={value} depth={0} />
        </Box>
    );
}

const INDENT_PX = 14;

interface Entry {
    key: string;
    value: unknown;
}

function JsonNode({ value, depth }: { value: unknown; depth: number }): React.ReactElement {
    const theme = useTheme();

    if (value === null) return <JsonScalar text="null" color={theme.palette.text.disabled} />;
    if (value === undefined) return <JsonScalar text="undefined" color={theme.palette.text.disabled} />;

    if (typeof value === 'string') {
        return <JsonScalar text={JSON.stringify(value)} color={theme.palette.info.main} />;
    }
    if (typeof value === 'number') {
        return <JsonScalar text={String(value)} color={theme.palette.success.main} tabular />;
    }
    if (typeof value === 'bigint') {
        return <JsonScalar text={`${String(value)}n`} color={theme.palette.success.main} tabular />;
    }
    if (typeof value === 'boolean') {
        return <JsonScalar text={String(value)} color={theme.palette.secondary.main} />;
    }
    if (typeof value === 'function') {
        return <JsonScalar text={`ƒ ${value.name || 'anonymous'}()`} color={theme.palette.text.disabled} />;
    }

    if (Array.isArray(value)) {
        return (
            <CollapsibleEntries
                openBracket="["
                closeBracket="]"
                entries={value.map((item, index) => ({ key: String(index), value: item }))}
                depth={depth}
                showKeys={false}
            />
        );
    }

    if (typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>).map(([key, v]) => ({ key, value: v }));
        return <CollapsibleEntries openBracket="{" closeBracket="}" entries={entries} depth={depth} showKeys />;
    }

    return <JsonScalar text={String(value)} color={theme.palette.text.disabled} />;
}

function JsonScalar({ text, color, tabular }: { text: string; color: string; tabular?: boolean }): React.ReactElement {
    return (
        <Box
            component="span"
            sx={{ color, fontVariantNumeric: tabular ? 'tabular-nums' : undefined }}
        >
            {text}
        </Box>
    );
}

function CollapsibleEntries({
    openBracket,
    closeBracket,
    entries,
    depth,
    showKeys,
}: {
    openBracket: string;
    closeBracket: string;
    entries: Entry[];
    depth: number;
    showKeys: boolean;
}): React.ReactElement {
    const theme = useTheme();
    const [collapsed, setCollapsed] = useState(false);

    if (entries.length === 0) {
        return (
            <Box component="span" sx={{ color: theme.palette.text.secondary }}>
                {openBracket}{closeBracket}
            </Box>
        );
    }

    return (
        <Box component="span">
            <Box
                component="button"
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                aria-expanded={!collapsed}
                aria-label={collapsed ? `Expand ${entries.length} items` : `Collapse ${entries.length} items`}
                sx={{
                    font: 'inherit',
                    color: theme.palette.text.secondary,
                    background: 'transparent',
                    border: 'none',
                    p: 0,
                    cursor: 'pointer',
                    '&:hover': { color: theme.palette.text.primary },
                }}
            >
                {openBracket}
                {collapsed ? `…${entries.length}${closeBracket}` : ''}
            </Box>
            {!collapsed && (
                <>
                    {entries.map((entry, index) => (
                        <Box key={entry.key} sx={{ pl: `${INDENT_PX}px` }}>
                            {showKeys && (
                                <Box component="span" sx={{ color: theme.palette.text.secondary }}>
                                    {JSON.stringify(entry.key)}:{' '}
                                </Box>
                            )}
                            <JsonNode value={entry.value} depth={depth + 1} />
                            {index < entries.length - 1 && (
                                <Box component="span" sx={{ color: theme.palette.text.disabled }}>,</Box>
                            )}
                        </Box>
                    ))}
                    <Box component="span" sx={{ color: theme.palette.text.secondary }}>{closeBracket}</Box>
                </>
            )}
        </Box>
    );
}
