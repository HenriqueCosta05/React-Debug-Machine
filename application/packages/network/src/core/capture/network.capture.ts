import type { EventBus } from '@henriquecosta/react-debug-machine-shared';
import { startFetchCapture } from './fetch.capture';
import { startXhrCapture } from './xhr.capture';

export function startNetworkCapture(bus: EventBus): () => void {
    const stopFetch = startFetchCapture(bus);
    const stopXhr = startXhrCapture(bus);

    return function stopNetworkCapture(): void {
        stopFetch();
        stopXhr();
    };
}
