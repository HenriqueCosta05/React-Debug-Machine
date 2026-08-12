// src/services/api.ts — the SINGLE RTK Query api. All endpoints here.
// One createApi, one cache, one middleware. Tag-based invalidation.
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CreateTradeRequest, PortfolioSummary, Trade } from '@/@types/trade';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Trade', 'Portfolio'],
  endpoints: (build) => ({
    listTrades: build.query<Trade[], void>({
      query: () => 'trades',
      providesTags: (res) =>
        res
          ? [...res.map((t) => ({ type: 'Trade' as const, id: t.id })), 'Trade']
          : ['Trade'],
    }),
    getPortfolioSummary: build.query<PortfolioSummary, void>({
      query: () => 'portfolio/summary',
      providesTags: ['Portfolio'],
    }),
    createTrade: build.mutation<Trade, CreateTradeRequest>({
      query: (body) => ({ url: 'trades', method: 'POST', body }),
      invalidatesTags: ['Trade', 'Portfolio'],
    }),
  }),
});

export const { useListTradesQuery, useGetPortfolioSummaryQuery, useCreateTradeMutation } = api;
