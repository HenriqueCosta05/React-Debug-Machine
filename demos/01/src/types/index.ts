export interface User {
  name: string;
  role: string;
}

export interface AssetBreakdown {
  name: string;
  percent: number;
  value: number;
  color: string;
}

export interface Portfolio {
  totalValue: number;
  changePercent: number;
  monthly: { label: string; value: number };
  sparkline: number[];
  breakdown: AssetBreakdown[];
  totalAssets: number;
}

export interface PerformancePoint {
  month: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  company: string;
  ticker: string;
  action: 'Buy' | 'Sell';
  amount: number;
  time: string;
  color: string;
}

export interface TopPickItem {
  id: string;
  name: string;
  ticker: string;
  color: string;
}

export interface HeatmapDay {
  date: string;
  level: number;
}

export interface DashboardData {
  user: User;
  marketSentiment: number;
  portfolio: Portfolio;
  performanceData: PerformancePoint[];
  tradingActivity: HeatmapDay[];
  lastActivity: ActivityItem[];
  topPicks: TopPickItem[];
}
