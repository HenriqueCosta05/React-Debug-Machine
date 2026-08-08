import { useCallback, useState } from 'react';
import type { DebugSession } from '@henriquecosta/react-debug-machine-shared';
import {
    createRecorder,
    createPlayer,
    exportRecording,
    importRecording,
} from '@henriquecosta/react-debug-machine-recorder';
import type {
    Player,
    PlayerEventHandler,
    Recording,
    RecorderStatus,
    ReplayerRegistry,
} from '@henriquecosta/react-debug-machine-recorder';

export type UseRecorderResult = {
    status: RecorderStatus;
    recording: Recording | null;
    isPlaying: boolean;
    start: () => void;
    stop: () => void;
    play: (onEvent?: PlayerEventHandler) => void;
    pause: () => void;
    exportJson: () => string | null;
    importJson: (json: string) => void;
};

// Fino em cima de createRecorder/createPlayer de `recorder` — mesma forma do
// useDebugMachine (hooks/useDebugMachine.ts) pra `timeline`: devtools só orquestra
// estado de UI, a lógica de gravação/replay fica no pacote.
export function useRecorder(session: DebugSession, replayers: ReplayerRegistry): UseRecorderResult {
    const [recorder] = useState(() => createRecorder(session.bus));
    const [status, setStatus] = useState<RecorderStatus>('idle');
    const [recording, setRecording] = useState<Recording | null>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const start = useCallback(() => {
        recorder.start();
        setStatus(recorder.getStatus());
        setRecording(null);
        setPlayer(null);
        setIsPlaying(false);
    }, [recorder]);

    const stop = useCallback(() => {
        const result = recorder.stop();
        setStatus(recorder.getStatus());
        setRecording(result);
        setPlayer(createPlayer(result, replayers));
    }, [recorder, replayers]);

    const play = useCallback(
        (onEvent?: PlayerEventHandler) => {
            if (!player) return;
            setIsPlaying(true);
            player.play(onEvent);
        },
        [player],
    );

    const pause = useCallback(() => {
        player?.pause();
        setIsPlaying(false);
    }, [player]);

    const exportJson = useCallback(() => (recording ? exportRecording(recording) : null), [recording]);

    const importJson = useCallback(
        (json: string) => {
            const imported = importRecording(json);
            setRecording(imported);
            setPlayer(createPlayer(imported, replayers));
            setStatus('stopped');
            setIsPlaying(false);
        },
        [replayers],
    );

    return { status, recording, isPlaying, start, stop, play, pause, exportJson, importJson };
}
