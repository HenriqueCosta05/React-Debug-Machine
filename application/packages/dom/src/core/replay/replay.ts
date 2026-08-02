import type { DomEventData } from '@henriquecosta/react-debug-machine-shared';
import type { ReplayResult } from '../types/replay.types';
import { FOCUS_EVENT_TYPES, KEYBOARD_EVENT_TYPES, MOUSE_EVENT_TYPES } from '../constants/events';

export function replayDomEvent(data: DomEventData, documentRef: Document = document): ReplayResult {
    const target = resolveTarget(data, documentRef);
    if (!target) return { ok: false, reason: 'target-not-found' };

    target.dispatchEvent(buildEvent(data.nativeType));
    return { ok: true };
}

function resolveTarget(data: DomEventData, documentRef: Document): Element | null {
    if (data.target.id) {
        const byId = documentRef.getElementById(data.target.id);
        if (byId) return byId;
    }
    try {
        return documentRef.querySelector(data.target.selectorPath);
    } catch {
        // selectorPath obsoleto (DOM mudou desde a captura) ou inválido: falha graciosamente.
        return null;
    }
}

function buildEvent(nativeType: string): Event {
    const base = { bubbles: true, cancelable: true };
    if (MOUSE_EVENT_TYPES.has(nativeType)) return new MouseEvent(nativeType, base);
    if (KEYBOARD_EVENT_TYPES.has(nativeType)) return new KeyboardEvent(nativeType, base);
    if (FOCUS_EVENT_TYPES.has(nativeType)) return new FocusEvent(nativeType, base);
    // Eventos construídos via `new Event(...)` nunca têm isTrusted true: limitação do
    // próprio DOM, não contornável a partir de script de página.
    return new Event(nativeType, base);
}
