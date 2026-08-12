// src/mocks/handlers/index.ts — the ONE shared handler set (dev + tests).
import { tradesHandlers } from './trades';

export const handlers = [...tradesHandlers];
