import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Tab, Tabs, useTheme } from '@mui/material';
import type { DebugEvent, DebugSession, TimelineEntry } from '@henriquecosta/react-debug-machine-shared';
import { DEBUG_MACHINE_IGNORE_ATTRIBUTE } from '@henriquecosta/react-debug-machine-shared';
import type { ReplayerRegistry } from '@henriquecosta/react-debug-machine-recorder';
import { useDebugMachine } from '../hooks/useDebugMachine';
import { useRecorder } from '../hooks/useRecorder';
import { Header } from './Header';
import { Timeline } from './Timeline';
import { EventList } from './EventList';
import { Inspector } from './Inspector';
import { RecorderControls } from './RecorderControls';
import BuildIcon from '@mui/icons-material/Build';

type TabValue = DebugEvent['type'] | 'all';

const TABS: TabValue[] = ['all', 'dom', 'network', 'console', 'state', 'typescript'];
const PANEL_HEIGHT = 400;
const SAFE_GAP = 16;
const SAFE_GAP_RIGHT = 24;

export interface DebugMachineDevtoolsProps {
    session: DebugSession;
    replayers?: ReplayerRegistry;
}

export function DebugMachineDevtools({ session, replayers = {} }: DebugMachineDevtoolsProps): React.ReactElement {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<TabValue>('all');
    const [selectedSequence, setSelectedSequence] = useState<number | null>(null);
    const { events, clear } = useDebugMachine(session);
    const recorder = useRecorder(session, replayers);

    const filtered = tab === 'all' ? events : events.filter((e) => e.type === tab);
    const selectedEntry: TimelineEntry | null =
        selectedSequence === null ? null : (events.find((e) => e.sequence === selectedSequence) ?? null);

    function countFor(t: TabValue): number {
        return t === 'all' ? events.length : events.filter((e) => e.type === t).length;
    }

    function handleClear(): void {
        clear();
        setSelectedSequence(null);
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                component="button"
                type="button"
                {...{ [DEBUG_MACHINE_IGNORE_ATTRIBUTE]: '' }}
                aria-label={open ? 'Close React Debug Machine' : 'Open React Debug Machine'}
                aria-pressed={open}
                onClick={() => setOpen((v) => !v)}
                sx={{
                    position: 'fixed',
                    bottom: open ? `calc(${PANEL_HEIGHT}px + ${SAFE_GAP})` : SAFE_GAP,
                    right: SAFE_GAP_RIGHT,
                    zIndex: 9999,
                    width: 40,
                    height: 40,
                    p: 0,
                    border: 'none',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                }}
            >
                <Box
                    component="span"
                    sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: `${theme.shape.borderRadius}px`,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: open ? theme.palette.primary.main : theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.fontSize,
                        fontWeight: theme.typography.fontWeightMedium,
                        boxShadow: theme.shadows[1],
                    }}
                >
                    <BuildIcon />
                </Box>
            </Box>
        {/* Panel */}
            {open && (
                <Box
                    {...{ [DEBUG_MACHINE_IGNORE_ATTRIBUTE]: '' }}
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: PANEL_HEIGHT,
                        bgcolor: theme.palette.background.paper,
                        borderTop: `1px solid ${theme.palette.divider}`,
                        zIndex: theme.zIndex.modal,
                        display: 'flex',
                        flexDirection: 'column',
                        fontFamily: theme.typography.fontFamily,
                        boxShadow: theme.shadows[1],
                    }}
                >
                    <Header onClear={handleClear} onClose={() => setOpen(false)}>
                        <RecorderControls
                            status={recorder.status}
                            recording={recorder.recording}
                            isPlaying={recorder.isPlaying}
                            onStart={recorder.start}
                            onStop={recorder.stop}
                            onPlay={recorder.play}
                            onPause={recorder.pause}
                            onExport={recorder.exportJson}
                            onImport={recorder.importJson}
                        />
                    </Header>

                    {/* Filter row — DESIGN.md "filtros globais" under Header responsibilities. */}
                    <Tabs
                        value={tab}
                        onChange={(_, v: TabValue) => setTab(v)}
                        variant="scrollable"
                        scrollButtons={false}
                        sx={{
                            flexShrink: 0,
                            minHeight: 32,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            bgcolor: theme.palette.background.paper,
                            px: `${theme.spacing(2)}`,
                        }}
                    >
                        {TABS.map((t) => (
                            <Tab key={t} value={t} label={`${t.toUpperCase()} (${countFor(t)})`} />
                        ))}
                    </Tabs>

                    <Timeline events={events} selectedSequence={selectedSequence} onSelect={setSelectedSequence} />

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', minHeight: 0 }}>
                        <Box
                            sx={{
                                width: '38%',
                                minWidth: 240,
                                maxWidth: 420,
                                borderRight: `1px solid ${theme.palette.divider}`,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0,
                            }}
                        >
                            <EventList events={filtered} selectedSequence={selectedSequence} onSelect={setSelectedSequence} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0, bgcolor: theme.palette.background.paper, overflow: 'hidden' }}>
                            <Inspector entry={selectedEntry} />
                        </Box>
                    </Box>
                </Box>
            )}
        </ThemeProvider>
    );
}
