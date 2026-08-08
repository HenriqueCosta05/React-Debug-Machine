import type { ReplayResult } from '@henriquecosta/react-debug-machine-shared';
import type { StateSetterRegistry } from '../registry/setter-registry';

// Só `react` (useDebugState) e `tanstack` (setQueryData) têm uma API de escrita
// genérica o bastante pra reaplicar `after` de volta. `redux` não tem: não existe
// forma pública de forçar um state arbitrário sem um enhancer/reducer específico do
// app hospedeiro, então eventos `origin: 'redux'` nunca têm setter registrado —
// resultado esperado é 'no-setter-registered', não um bug.
export function replayStateEvent(label: string, after: unknown, registry: StateSetterRegistry): ReplayResult {
    const setter = registry.get(label);
    if (!setter) return { ok: false, reason: 'no-setter-registered' };
    setter(after);
    return { ok: true };
}
