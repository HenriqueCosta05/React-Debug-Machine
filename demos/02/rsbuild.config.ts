// rsbuild.config.ts — alias MUST match tsconfig paths (@ -> ./src).
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { index: './src/main.tsx' },
    alias: { '@': './src' },
  },
  html: { template: './index.html' },
  server: {
    port: 3001,
    proxy: { '/api': 'http://localhost:8080' }, // same-origin /api in dev
  },
  output: { distPath: { root: 'dist' }, filenameHash: true },
});
