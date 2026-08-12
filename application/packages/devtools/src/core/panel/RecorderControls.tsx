import React, { useRef, useState } from 'react';
import { Box, Dialog, Stack, useTheme } from '@mui/material';
import type { NetworkEventData } from '@henriquecosta/react-debug-machine-shared';
import type { PlayerEventHandler, Recording, RecorderStatus } from '@henriquecosta/react-debug-machine-recorder';
import { PrimaryButton, SecondaryButton } from './Buttons';

export interface RecorderControlsProps {
    status: RecorderStatus;
    recording: Recording | null;
    isPlaying: boolean;
    onStart: () => void;
    onStop: () => void;
    onPlay: (onEvent?: PlayerEventHandler) => void;
    onPause: () => void;
    onExport: () => string | null;
    onImport: (json: string) => void;
}

// Réplica de rede não-GET reexecuta a request real (sem body/headers capturados) e
// pode duplicar um efeito colateral no backend hospedeiro — ver ADR-006 em
// docs/CONVENTIONS.md. Essa checagem só decide se mostra a confirmação; a decisão
// de reexecutar em si já foi tomada no adapter `network` (replayNetworkEvent).
function hasUnsafeNetworkReplay(recording: Recording): boolean {
    return recording.entries.some((entry) => {
        if (entry.type !== 'network') return false;
        const data = entry.data as NetworkEventData;
        return data.phase === 'request' && data.method !== 'GET';
    });
}

export function RecorderControls({
    status,
    recording,
    isPlaying,
    onStart,
    onStop,
    onPlay,
    onPause,
    onExport,
    onImport,
}: RecorderControlsProps): React.ReactElement {
    const theme = useTheme();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handlePlayClick(): void {
        if (recording && hasUnsafeNetworkReplay(recording)) {
            setConfirmOpen(true);
            return;
        }
        onPlay();
    }

    function handleExportClick(): void {
        const json = onExport();
        if (!json) return;
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `recording-${Date.now()}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        file.text().then(onImport);
    }

    return (
        <Stack direction="row" spacing={`${theme.spacing(1)}`} alignItems="center">
            {status === 'recording' ? (
                <SecondaryButton tone="error" onClick={onStop}>● Stop</SecondaryButton>
            ) : (
                <PrimaryButton onClick={onStart}>● Record</PrimaryButton>
            )}
            {recording && (
                <>
                    <SecondaryButton disabled={isPlaying} onClick={handlePlayClick}>▶ Play</SecondaryButton>
                    <SecondaryButton disabled={!isPlaying} onClick={onPause}>⏸ Pause</SecondaryButton>
                    <SecondaryButton onClick={handleExportClick}>Export</SecondaryButton>
                </>
            )}
            <SecondaryButton onClick={() => fileInputRef.current?.click()}>Import</SecondaryButton>
            <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleFileChange} />

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: `${theme.shape.borderRadius * 1.5}px`,
                            boxShadow: theme.shadows[4],
                            color: theme.palette.text.primary,
                            fontFamily: theme.typography.fontFamily,
                        },
                    },
                }}
            >
                <Box sx={{ p: `${theme.spacing(2)}`, display: 'flex', flexDirection: 'column', gap: `${theme.spacing(1.5)}` }}>
                    <Box sx={{ fontSize: 20, fontWeight: 700, color: theme.palette.text.primary }}>
                        Replay includes non-GET requests
                    </Box>
                    <Box sx={{ fontSize: 14, color: theme.palette.text.secondary, lineHeight: '18px' }}>
                        This recording replays at least one network request with a method other than GET.
                        Request bodies aren&apos;t captured, so replay resends only method + url — it can
                        duplicate a real side effect (e.g. a POST creating a second order) on the host
                        app&apos;s backend.
                    </Box>
                    <Stack direction="row" spacing={`${theme.spacing(1)}`} justifyContent="flex-end">
                        <SecondaryButton onClick={() => setConfirmOpen(false)}>Cancel</SecondaryButton>
                        <SecondaryButton
                            tone="error"
                            onClick={() => {
                                setConfirmOpen(false);
                                onPlay();
                            }}
                        >
                            Replay anyway
                        </SecondaryButton>
                    </Stack>
                </Box>
            </Dialog>
        </Stack>
    );
}
