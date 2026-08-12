// src/mocks/browser.ts — dev worker. Started (gated) from main.tsx.
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
