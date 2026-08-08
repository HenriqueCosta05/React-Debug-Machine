import type { ReplayResult } from '@henriquecosta/react-debug-machine-shared';

// Um diagnóstico de tipo não é uma ação reversível/reexecutável (não é um evento que
// aconteceu na app hospedeira, é um resultado do compilador). Não há nada de fato pra
// "repetir" — a fn existe só por simetria de API com os outros adapters (mesma forma
// `(data) => ReplayResult` do ReplayerRegistry em `recorder`), sempre ok:true.
export function replayTypeDiagnostic(): ReplayResult {
    return { ok: true };
}
