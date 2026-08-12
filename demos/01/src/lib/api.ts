export interface TradePayload {
  ticker: string;
  side: 'buy' | 'sell';
  shares: number;
  orderType: 'market' | 'limit';
  limitPrice?: number;
}

export interface DepositPayload {
  amount: number;
  method: 'bank' | 'card' | 'crypto';
}

export interface WithdrawPayload {
  amount: number;
  destination: string;
}

export interface TaxReportPayload {
  year: number;
  format: 'pdf' | 'csv';
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function submitTrade(payload: TradePayload) {
  console.log('[Trade] Submitting order', payload);
  const result = await post<{ transactionId: string; status: string; filledAt: string }>(
    '/api/trade',
    payload,
  );
  console.log('[Trade] Order confirmed', result);
  return result;
}

export async function submitDeposit(payload: DepositPayload) {
  if (payload.amount > 50_000) {
    console.warn('[Deposit] Large amount flagged for compliance review', { amount: payload.amount });
  }
  console.log('[Deposit] Processing', payload);
  const result = await post<{ depositId: string; eta: string; status: string }>(
    '/api/deposit',
    payload,
  );
  console.log('[Deposit] Confirmed', result);
  return result;
}

export async function submitWithdraw(payload: WithdrawPayload) {
  console.log('[Withdraw] Initiating withdrawal', payload);
  if (payload.amount > 10_000) {
    console.warn('[Withdraw] Amount exceeds $10k — additional verification required');
  }
  const result = await post<{ withdrawalId: string; status: string; estimatedArrival: string }>(
    '/api/withdraw',
    payload,
  );
  console.log('[Withdraw] Withdrawal queued', result);
  return result;
}

export async function requestTaxReport(payload: TaxReportPayload) {
  console.log('[TaxReport] Generating report', payload);
  const result = await get<{ downloadUrl: string; pages: number; generatedAt: string }>(
    `/api/tax-report?year=${payload.year}&format=${payload.format}`,
  );
  console.log('[TaxReport] Report ready', result);
  return result;
}
