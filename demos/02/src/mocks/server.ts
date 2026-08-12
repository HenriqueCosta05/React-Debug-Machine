// src/mocks/server.ts — node server for tests. Same handlers as the browser worker.
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
