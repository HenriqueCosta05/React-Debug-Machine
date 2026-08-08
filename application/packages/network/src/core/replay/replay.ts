import type { NetworkEventData, ReplayResult } from '@henriquecosta/react-debug-machine-shared';
import type { FetchTarget } from '../types/fetch.types';

// Corpo/headers não são capturados (fora do escopo do adapter `network` hoje), então o
// replay só consegue reconstruir method + url. Isso é reexecutado para qualquer método
// capturado, inclusive POST/PUT/DELETE: pode duplicar um efeito colateral real no backend
// da app hospedeira. Decisão deliberada — ver ADR-006 em docs/CONVENTIONS.md; a UI que
// consome isso (devtools) exige confirmação antes de reproduzir um evento não-GET.
export async function replayNetworkEvent(
    data: NetworkEventData,
    target: FetchTarget = globalThis,
): Promise<ReplayResult> {
    if (data.phase !== 'request') {
        return { ok: false, reason: 'not-replayable-phase' };
    }

    try {
        await target.fetch(data.url, { method: data.method });
        return { ok: true };
    } catch (error) {
        return { ok: false, reason: error instanceof Error ? error.message : String(error) };
    }
}
