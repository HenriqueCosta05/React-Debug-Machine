import React, { useRef, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
} from '@mui/material';
import type { NetworkEventData } from '@henriquecosta/react-debug-machine-shared';
import type { PlayerEventHandler, Recording, RecorderStatus } from '@henriquecosta/react-debug-machine-recorder';
import { TOKENS } from './tokens';

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

const buttonSx = {
    color: TOKENS.colorSecondary,
    fontSize: 11,
    minWidth: 0,
    px: 1,
    fontFamily: TOKENS.fontFamily,
    '&:hover': { color: '#fff' },
} as const;

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
        <Stack direction="row" spacing={0.5} alignItems="center">
            {status === 'recording' ? (
                <Button size="small" onClick={onStop} sx={{ ...buttonSx, color: TOKENS.colorError }}>
                    ● Stop
                </Button>
            ) : (
                <Button size="small" onClick={onStart} sx={buttonSx}>
                    ● Record
                </Button>
            )}
            {recording && (
                <>
                    <Button size="small" disabled={isPlaying} onClick={handlePlayClick} sx={buttonSx}>
                        ▶ Play
                    </Button>
                    <Button size="small" disabled={!isPlaying} onClick={onPause} sx={buttonSx}>
                        ⏸ Pause
                    </Button>
                    <Button size="small" onClick={handleExportClick} sx={buttonSx}>
                        Export
                    </Button>
                </>
            )}
            <Button size="small" onClick={() => fileInputRef.current?.click()} sx={buttonSx}>
                Import
            </Button>
            <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleFileChange} />

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Replay includes non-GET requests</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This recording replays at least one network request with a method other than GET.
                        Request bodies aren&apos;t captured, so replay resends only method + url — it can
                        duplicate a real side effect (e.g. a POST creating a second order) on the host
                        app&apos;s backend.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button
                        color="error"
                        onClick={() => {
                            setConfirmOpen(false);
                            onPlay();
                        }}
                    >
                        Replay anyway
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
