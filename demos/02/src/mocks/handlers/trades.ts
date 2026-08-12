// src/mocks/handlers/trades.ts — MSW v2 handlers for the trades + portfolio endpoints.
// Same /api paths RTK Query produces; shapes match the Trade/PortfolioSummary types.
import { http, HttpResponse, delay } from 'msw';
import type { CreateTradeRequest, Trade } from '@/@types/trade';

const TRADES: Trade[] = [
  {
    id: '1',
    symbol: 'AAPL',
    side: 'buy',
    status: 'filled',
    quantity: 10,
    priceMinor: 18750,
    currency: 'USD',
    createdAt: '2026-08-05T14:12:00.000Z',
  },
  {
    id: '2',
    symbol: 'MSFT',
    side: 'sell',
    status: 'filled',
    quantity: 4,
    priceMinor: 41230,
    currency: 'USD',
    createdAt: '2026-08-06T09:45:00.000Z',
  },
  {
    id: '3',
    symbol: 'TSLA',
    side: 'buy',
    status: 'pending',
    quantity: 6,
    priceMinor: 24890,
    currency: 'USD',
    createdAt: '2026-08-07T16:03:00.000Z',
  },
];

let nextId = TRADES.length + 1;

export const tradesHandlers = [
  http.get('/api/trades', async () => {
    await delay(150);
    return HttpResponse.json([...TRADES].reverse());
  }),

  http.get('/api/portfolio/summary', async () => {
    await delay(150);
    const totalValueMinor = TRADES.filter((t) => t.status === 'filled').reduce(
      (sum, t) => sum + t.priceMinor * t.quantity * (t.side === 'sell' ? -1 : 1),
      0,
    );
    return HttpResponse.json({
      totalValueMinor: Math.max(totalValueMinor, 0),
      currency: 'USD',
      dayChangePct: 1.8,
      openPositions: TRADES.filter((t) => t.status !== 'rejected').length,
    });
  }),

  http.post('/api/trades', async ({ request }) => {
    const body = (await request.json()) as CreateTradeRequest;
    const created: Trade = {
      id: String(nextId++),
      status: 'pending',
      currency: 'USD',
      createdAt: new Date().toISOString(),
      ...body,
    };
    TRADES.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),
];
