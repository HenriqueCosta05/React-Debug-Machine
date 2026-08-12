// src/@types/trade.ts — global types for the "trade" entity (new-feature step 1).
export type TradeSide = 'buy' | 'sell';
export type TradeStatus = 'pending' | 'filled' | 'rejected';

export type Trade = {
  id: string;
  symbol: string;
  side: TradeSide;
  status: TradeStatus;
  quantity: number;
  /** Price in integer minor units (cents). Format only at the view layer. */
  priceMinor: number;
  currency: string;
  createdAt: string;
};

export type CreateTradeRequest = {
  symbol: string;
  side: TradeSide;
  quantity: number;
  priceMinor: number;
};

export type PortfolioSummary = {
  totalValueMinor: number;
  currency: string;
  dayChangePct: number;
  openPositions: number;
};
