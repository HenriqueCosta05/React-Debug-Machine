import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import type { DebugEvent, DebugSession } from '@henriquecosta/react-debug-machine-shared';
import { useDebugMachine } from '../hooks/useDebugMachine';
import { EventList } from './EventList';
import { TOKENS } from './tokens';

type TabValue = DebugEvent['type'] | 'all';

const TABS: TabValue[] = ['all', 'dom', 'network', 'console', 'state', 'typescript'];

const panelTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: TOKENS.colorBg,
            paper: TOKENS.colorBg,
        },
        primary: { main: TOKENS.colorPrimary },
        secondary: { main: TOKENS.colorSecondary },
        error: { main: TOKENS.colorError },
        warning: { main: TOKENS.colorWarn },
    },
    typography: {
        fontFamily: TOKENS.fontFamily,
        body1: { fontSize: TOKENS.fontSizeBody, fontWeight: TOKENS.fontWeightBody },
    },
    components: {
        MuiTab: {
            styleOverrides: {
                root: { minHeight: 36, fontSize: 12, padding: '0 10px', textTransform: 'none' },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: { minHeight: 36 },
            },
        },
    },
});

export interface DebugMachineDevtoolsProps {
    session: DebugSession;
}

export function DebugMachineDevtools({ session }: DebugMachineDevtoolsProps): React.ReactElement {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<TabValue>('all');
    const { events, clear } = useDebugMachine(session);

    const filtered = tab === 'all' ? events : events.filter((e) => e.type === tab);

    function countFor(t: TabValue): number {
        return t === 'all' ? events.length : events.filter((e) => e.type === t).length;
    }

    return (
        <ThemeProvider theme={panelTheme}>
            {/* Toggle button — always visible, floats above the panel */}
            <Button
                variant="contained"
                onClick={() => setOpen((v) => !v)}
                sx={{
                    position: 'fixed',
                    bottom: open ? 308 : 16,
                    right: 16,
                    zIndex: 999999,
                    fontFamily: TOKENS.fontFamily,
                    fontSize: 12,
                    fontWeight: 700,
                    minWidth: 56,
                    height: 28,
                    bgcolor: TOKENS.colorPrimary,
                    color: '#fff',
                    borderRadius: '4px',
                    transition: 'bottom 0.15s ease',
                    '&:hover': { bgcolor: '#575a6e' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
            >
                RDM
            </Button>

            {/* Panel */}
            {open && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 300,
                        bgcolor: TOKENS.colorBg,
                        borderTop: `2px solid ${TOKENS.colorSecondary}`,
                        zIndex: 999998,
                        display: 'flex',
                        flexDirection: 'column',
                        fontFamily: TOKENS.fontFamily,
                        boxShadow: '0 -4px 24px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* Header */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                            px: 2,
                            py: 0.5,
                            borderBottom: `1px solid ${TOKENS.colorSecondary}`,
                            flexShrink: 0,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: 13,
                                color: '#e0ecf4',
                                flex: 1,
                                fontFamily: TOKENS.fontFamily,
                                letterSpacing: '0.03em',
                            }}
                        >
                            React Debug Machine
                        </Typography>
                        <Button
                            size="small"
                            onClick={clear}
                            sx={{
                                color: TOKENS.colorSecondary,
                                fontSize: 11,
                                minWidth: 0,
                                px: 1,
                                fontFamily: TOKENS.fontFamily,
                                '&:hover': { color: '#fff' },
                            }}
                        >
                            Clear
                        </Button>
                        <Button
                            size="small"
                            onClick={() => setOpen(false)}
                            sx={{
                                color: '#7b96a8',
                                fontSize: 14,
                                minWidth: 0,
                                px: 0.5,
                                ml: 0.5,
                                lineHeight: 1,
                                fontFamily: TOKENS.fontFamily,
                                '&:hover': { color: '#fff' },
                            }}
                        >
                            ×
                        </Button>
                    </Stack>

                    {/* Tab bar */}
                    <Tabs
                        value={tab}
                        onChange={(_, v: TabValue) => setTab(v)}
                        textColor="inherit"
                        TabIndicatorProps={{ style: { backgroundColor: TOKENS.colorDiffAdd, height: 2 } }}
                        sx={{
                            flexShrink: 0,
                            borderBottom: `1px solid #1e2a33`,
                            '& .MuiTab-root': { color: '#7b96a8' },
                            '& .Mui-selected': { color: '#e0ecf4' },
                        }}
                    >
                        {TABS.map((t) => (
                            <Tab
                                key={t}
                                value={t}
                                label={`${t} (${countFor(t)})`}
                            />
                        ))}
                    </Tabs>

                    {/* Event list */}
                    <EventList events={filtered} />
                </Box>
            )}
        </ThemeProvider>
    );
}
