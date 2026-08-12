import path from 'node:path';
import { defineConfig } from 'vitest/config';

const root = path.resolve(__dirname);

export default defineConfig({
  root,
  resolve: {
    alias: { '@': path.resolve(root, 'src') },
  },
  test: {
    root,
    environment: 'jsdom',
    globals: true,
    setupFiles: [path.resolve(root, 'src/test/setup.ts')],
  },
});
