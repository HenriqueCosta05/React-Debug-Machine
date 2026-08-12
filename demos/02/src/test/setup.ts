// src/test/setup.ts — Vitest setup. MSW is the network for every test.
import '@testing-library/jest-dom/vitest';
import { server } from '@/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
