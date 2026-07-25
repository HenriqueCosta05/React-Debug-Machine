import { defineConfig } from '@rslib/core';

export default defineConfig({
    source: {
        entry: {
            index: './src/core/index.ts',
        },
    },
    lib: [
        {
            format: 'esm',
            syntax: 'es2021',
            dts: true,
        },
    ],
});
