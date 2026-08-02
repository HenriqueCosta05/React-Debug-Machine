export type ReplayResult =
    | { ok: true }
    | { ok: false; reason: 'target-not-found' };
