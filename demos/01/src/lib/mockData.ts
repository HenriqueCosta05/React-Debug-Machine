import type { DashboardData, HeatmapDay } from '../types';

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function generateHeatmap(): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const start = new Date('2023-09-01');
  for (let i = 0; i < 154; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({ date: d.toISOString().split('T')[0], level: Math.floor(Math.random() * 5) });
  }
  return days;
}

export async function fetchDashboardData(): Promise<DashboardData> {
  await delay(500);
  return {
    user: { name: 'David Thomas', role: 'Investor' },
    marketSentiment: 68,
    portfolio: {
      totalValue: 249196,
      changePercent: 17.9,
      monthly: { label: 'February 2024', value: 59394.3 },
      sparkline: [48000, 52000, 47000, 58000, 54000, 62000, 59394],
      breakdown: [
        { name: 'Stocks', percent: 32, value: 78097, color: '#E57373' },
        { name: 'Crypto', percent: 25, value: 44580.55, color: '#FCF746' },
        { name: 'Funds', percent: 17, value: 29891.12, color: '#7986CB' },
        { name: 'Other', percent: 26, value: 96627.33, color: '#4DB6AC' },
      ],
      totalAssets: 26,
    },
    performanceData: [
      { month: 'Apr', value: 52000 },
      { month: 'May', value: 60000 },
      { month: 'Jun', value: 54000 },
      { month: 'Jul', value: 63000 },
      { month: 'Aug', value: 57000 },
      { month: 'Oct', value: 67000 },
      { month: 'Nov', value: 55000 },
      { month: 'Dec', value: 59850 },
      { month: 'Jan', value: 56000 },
    ],
    tradingActivity: generateHeatmap(),
    lastActivity: [
      { id: '1', company: 'Boeing Co', ticker: 'BA', action: 'Buy', amount: -2090, time: '22:35', color: '#1565C0' },
      { id: '2', company: 'Walt Disney', ticker: 'DIS', action: 'Buy', amount: -1500, time: '21:10', color: '#6A1B9A' },
      { id: '3', company: 'Apple Inc', ticker: 'AAPL', action: 'Sell', amount: 3200, time: '18:45', color: '#1B5E20' },
    ],
    topPicks: [
      { id: '1', name: 'Apple', ticker: 'AAPL', color: '#25A84A' },
      { id: '2', name: 'Nike', ticker: 'NKE', color: '#3F51B5' },
      { id: '3', name: 'Tesla', ticker: 'TSLA', color: '#E53935' },
      { id: '4', name: 'Google', ticker: 'GOOGL', color: '#FF6F00' },
      { id: '5', name: 'Meta', ticker: 'META', color: '#1565C0' },
    ],
  };
}
