import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const mockRoutes: Record<string, () => object> = {
  'POST /api/trade': () => ({
    transactionId: `TXN-${Date.now()}`,
    status: 'filled',
    filledAt: new Date().toISOString(),
  }),
  'POST /api/deposit': () => ({
    depositId: `DEP-${Date.now()}`,
    eta: '1-2 business days',
    status: 'pending',
  }),
  'POST /api/withdraw': () => ({
    withdrawalId: `WD-${Date.now()}`,
    status: 'pending',
    estimatedArrival: '3-5 business days',
  }),
};

async function mockApiMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const { url, method } = req;

  if (url?.startsWith('/api/tax-report') && method === 'GET') {
    await wait(900);
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        downloadUrl: '#',
        pages: 42,
        generatedAt: new Date().toISOString(),
      }),
    );
    return;
  }

  const key = `${method} ${url?.split('?')[0]}`;
  const handler = mockRoutes[key];

  if (handler) {
    await wait(700);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(handler()));
    return;
  }

  next();
}

export default defineConfig({
  plugins: [pluginReact()],
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  dev: {
    setupMiddlewares: [
      (middlewares) => {
        middlewares.unshift(mockApiMiddleware);
      },
    ],
  },
});
