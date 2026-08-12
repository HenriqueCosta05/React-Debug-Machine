import { defineConfig } from '@rstest/core';

export default defineConfig({
    testEnvironment: 'jsdom',
    setupFiles: ['./setupTests.js'],
    coverage: {
        provider: 'v8',
        reporters: ['text', 'lcov'],
        exclude: ['**/dist/**', '**/*.config.*'],
        thresholds: { statements: 80, branches: 75, functions: 80, lines: 80 },
    },
});
