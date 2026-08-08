import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Tab, Tabs } from '@mui/material';
import type { DebugEvent, DebugSession, TimelineEntry } from '@henriquecosta/react-debug-machine-shared';
import type { ReplayerRegistry } from '@henriquecosta/react-debug-machine-recorder';
import { useDebugMachine } from '../hooks/useDebugMachine';
import { useRecorder } from '../hooks/useRecorder';
import { Header } from './Header';
import { Timeline } from './Timeline';
import { EventList } from './EventList';
import { Inspector } from './Inspector';
import { RecorderControls } from './RecorderControls';
import { FOCUS_RING, REDUCED_MOTION, TOKENS, TRANSITION } from './tokens';

type TabValue = DebugEvent['type'] | 'all';

const TABS: TabValue[] = ['all', 'dom', 'network', 'console', 'state', 'typescript'];

const PANEL_HEIGHT = 420;
const SAFE_GAP = `max(${TOKENS.space3}px, env(safe-area-inset-bottom))`;
const SAFE_GAP_RIGHT = `max(${TOKENS.space3}px, env(safe-area-inset-right))`;

const panelTheme = createTheme({
    palette: {
        mode: 'dark',
        background: { default: TOKENS.colorBg, paper: TOKENS.colorBgElevated },
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
                root: {
                    minHeight: 32,
                    fontSize: TOKENS.fontSizeSmallLabel,
                    fontWeight: TOKENS.fontWeightSmallLabel,
                    padding: `0 ${TOKENS.space3}px`,
                    textTransform: 'none',
                    color: TOKENS.colorTextMuted,
                    borderRadius: `${TOKENS.radiusMd}px ${TOKENS.radiusMd}px 0 0`,
                    fontFamily: TOKENS.fontFamily,
                    '&.Mui-selected': {
                        color: TOKENS.colorText,
                        backgroundColor: TOKENS.colorBgActive,
                    },
                    '&.Mui-focusVisible': FOCUS_RING,
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: { minHeight: 32 },
                indicator: { backgroundColor: TOKENS.colorFocus, height: 2 },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: TOKENS.colorBgElevated,
                    color: TOKENS.colorText,
                    border: `1px solid ${TOKENS.colorBorder}`,
                    borderRadius: `${TOKENS.radiusMd}px`,
                    boxShadow: TOKENS.shadowPopover,
                    fontFamily: TOKENS.fontFamily,
                    fontSize: TOKENS.fontSizeMetadata,
                    fontWeight: TOKENS.fontWeightMetadata,
                    padding: `${TOKENS.space1}px ${TOKENS.space2}px`,
                },
                arrow: { color: TOKENS.colorBgElevated },
            },
        },
    },
});

export interface DebugMachineDevtoolsProps {
    session: DebugSession;
    // Opcional: sem replayers a app hospedeira ainda grava/exporta/importa, só não
    // consegue reproduzir eventos de volta. Quem monta o registry sabe quais
    // adapters/replay fns está usando — devtools não conhece nenhum adapter direto.
    replayers?: ReplayerRegistry;
}

export function DebugMachineDevtools({ session, replayers = {} }: DebugMachineDevtoolsProps): React.ReactElement {
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
        <ThemeProvider theme={panelTheme}>
            {/* Toggle — DESIGN.md "Toggle do Devtools": 32x32 visual, 40x40 hit area, fixed, safe-area aware. */}
            <Box
                component="button"
                type="button"
                aria-label={open ? 'Close React Debug Machine' : 'Open React Debug Machine'}
                aria-pressed={open}
                onClick={() => setOpen((v) => !v)}
                sx={{
                    position: 'fixed',
                    bottom: open ? `calc(${PANEL_HEIGHT}px + ${SAFE_GAP})` : SAFE_GAP,
                    right: SAFE_GAP_RIGHT,
                    zIndex: TOKENS.zToggle,
                    width: 40,
                    height: 40,
                    p: 0,
                    border: 'none',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: TRANSITION,
                    ...REDUCED_MOTION,
                    '&:focus-visible > span': FOCUS_RING,
                    '&:hover > span': { borderColor: TOKENS.colorBorderStrong, backgroundColor: open ? TOKENS.colorBgActive : TOKENS.colorBgHover },
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
                        borderRadius: `${TOKENS.radiusMd}px`,
                        border: `1px solid ${TOKENS.colorBorderStrong}`,
                        bgcolor: open ? TOKENS.colorPrimary : TOKENS.colorBgElevated,
                        color: TOKENS.colorText,
                        fontFamily: TOKENS.fontFamily,
                        fontSize: TOKENS.fontSizeToggleLabel,
                        fontWeight: TOKENS.fontWeightToggleLabel,
                        boxShadow: TOKENS.shadowPopover,
                        transition: TRANSITION,
                        ...REDUCED_MOTION,
                    }}
                >
                    RDM
                </Box>
            </Box>

            {/* Panel */}
            {open && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: PANEL_HEIGHT,
                        bgcolor: TOKENS.colorBg,
                        borderTop: `1px solid ${TOKENS.colorBorderStrong}`,
                        zIndex: TOKENS.zToggle,
                        display: 'flex',
                        flexDirection: 'column',
                        fontFamily: TOKENS.fontFamily,
                        boxShadow: TOKENS.shadowPanel,
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
                            borderBottom: `1px solid ${TOKENS.colorBorder}`,
                            bgcolor: TOKENS.colorBgSubtle,
                            px: `${TOKENS.space2}px`,
                        }}
                    >
                        {TABS.map((t) => (
                            <Tab key={t} value={t} label={`${t.toUpperCase()} (${countFor(t)})`} />
                        ))}
                    </Tabs>

                    <Timeline events={events} selectedSequence={selectedSequence} onSelect={setSelectedSequence} />

                    {/* Main content — DESIGN.md layout: Navegação/eventos | Inspector/detalhes */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', minHeight: 0 }}>
                        <Box
                            sx={{
                                width: '38%',
                                minWidth: 240,
                                maxWidth: 420,
                                borderRight: `1px solid ${TOKENS.colorBorder}`,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0,
                            }}
                        >
                            <EventList events={filtered} selectedSequence={selectedSequence} onSelect={setSelectedSequence} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0, bgcolor: TOKENS.colorBgSubtle, overflow: 'hidden' }}>
                            <Inspector entry={selectedEntry} />
                        </Box>
                    </Box>
                </Box>
            )}
        </ThemeProvider>
    );
}
