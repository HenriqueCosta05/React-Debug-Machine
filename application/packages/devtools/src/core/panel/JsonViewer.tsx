import React, { useState } from 'react';
import { Box } from '@mui/material';
import { TOKENS } from './tokens';

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
    return (
        <Box
            component={inline ? 'span' : 'pre'}
            sx={{
                m: 0,
                display: inline ? 'inline' : 'block',
                fontFamily: TOKENS.fontFamilyMono,
                fontSize: TOKENS.fontSizeJson,
                lineHeight: '17px',
                color: TOKENS.colorText,
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
    if (value === null) return <JsonScalar text="null" color={TOKENS.colorTextMuted} />;
    if (value === undefined) return <JsonScalar text="undefined" color={TOKENS.colorTextMuted} />;

    if (typeof value === 'string') {
        return <JsonScalar text={JSON.stringify(value)} color={TOKENS.colorInfo} />;
    }
    if (typeof value === 'number') {
        return <JsonScalar text={String(value)} color={TOKENS.colorSuccess} tabular />;
    }
    if (typeof value === 'bigint') {
        return <JsonScalar text={`${String(value)}n`} color={TOKENS.colorSuccess} tabular />;
    }
    if (typeof value === 'boolean') {
        return <JsonScalar text={String(value)} color={TOKENS.colorSecondary} />;
    }
    if (typeof value === 'function') {
        return <JsonScalar text={`ƒ ${value.name || 'anonymous'}()`} color={TOKENS.colorTextMuted} />;
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

    return <JsonScalar text={String(value)} color={TOKENS.colorTextMuted} />;
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
    const [collapsed, setCollapsed] = useState(false);

    if (entries.length === 0) {
        return (
            <Box component="span" sx={{ color: TOKENS.colorTextSecondary }}>
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
                    color: TOKENS.colorTextSecondary,
                    background: 'transparent',
                    border: 'none',
                    p: 0,
                    cursor: 'pointer',
                    '&:hover': { color: TOKENS.colorText },
                    '&:focus-visible': {
                        outline: `${TOKENS.borderWidthFocus}px solid ${TOKENS.colorFocus}`,
                        outlineOffset: '1px',
                    },
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
                                <Box component="span" sx={{ color: TOKENS.colorTextSecondary }}>
                                    {JSON.stringify(entry.key)}:{' '}
                                </Box>
                            )}
                            <JsonNode value={entry.value} depth={depth + 1} />
                            {index < entries.length - 1 && (
                                <Box component="span" sx={{ color: TOKENS.colorTextMuted }}>,</Box>
                            )}
                        </Box>
                    ))}
                    <Box component="span" sx={{ color: TOKENS.colorTextSecondary }}>{closeBracket}</Box>
                </>
            )}
        </Box>
    );
}
