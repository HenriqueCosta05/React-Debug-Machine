// views/Dashboard/Dashboard.tsx — container view. Demonstrates: RTK Query (two
// queries), StatCard molecule, SideChip/TradeStatusChip atoms, Intl formatting,
// all states handled, no native HTML, all text via t().
import { Button, Skeleton, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetPortfolioSummaryQuery, useListTradesQuery } from '@/services/api';
import { StatCard } from '@/components/StatCard/StatCard';
import { SideChip } from '@/components/SideChip/SideChip';
import { TradeStatusChip } from '@/components/TradeStatusChip/TradeStatusChip';
import { formatCurrency, formatDate, formatPercent } from '@/utils/format';
import { DashboardViewRoot, StatsRow, TradeRow } from './Dashboard.style';

export function Dashboard() {
  const { t } = useTranslation('dashboard');
  const summary = useGetPortfolioSummaryQuery();
  const trades = useListTradesQuery();

  return (
    <DashboardViewRoot>
      <Typography component="h1" variant="h4" gutterBottom>
        {t('title')}
      </Typography>

      <StatsRow>
        {summary.isLoading && (
          <>
            <Skeleton variant="rounded" width={200} height={88} />
            <Skeleton variant="rounded" width={200} height={88} />
            <Skeleton variant="rounded" width={200} height={88} />
          </>
        )}
        {summary.isError && (
          <Stack spacing={1} alignItems="flex-start">
            <Typography color="error">{t('states.error', { ns: 'common' })}</Typography>
            <Button onClick={() => summary.refetch()}>
              {t('actions.retry', { ns: 'common' })}
            </Button>
          </Stack>
        )}
        {summary.data && (
          <>
            <StatCard
              label={t('stats.totalValue')}
              value={formatCurrency(summary.data.totalValueMinor, summary.data.currency)}
            />
            <StatCard
              label={t('stats.dayChange')}
              value={formatPercent(summary.data.dayChangePct)}
              tone={summary.data.dayChangePct >= 0 ? 'positive' : 'negative'}
            />
            <StatCard
              label={t('stats.openPositions')}
              value={String(summary.data.openPositions)}
            />
          </>
        )}
      </StatsRow>

      <Typography component="h2" variant="h6" gutterBottom>
        {t('recentTrades.title')}
      </Typography>

      {trades.isLoading && <Skeleton variant="rounded" height={160} />}

      {trades.isError && (
        <Stack spacing={1} alignItems="flex-start">
          <Typography color="error">{t('states.error', { ns: 'common' })}</Typography>
          <Button onClick={() => trades.refetch()}>{t('actions.retry', { ns: 'common' })}</Button>
        </Stack>
      )}

      {trades.data && trades.data.length === 0 && (
        <Typography color="text.secondary">{t('states.empty', { ns: 'common' })}</Typography>
      )}

      {trades.data && trades.data.length > 0 && (
        <>
          <Typography color="text.secondary" gutterBottom>
            {t('recentTrades.count', { count: trades.data.length })}
          </Typography>
          {trades.data.map((trade) => (
            <TradeRow key={trade.id}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <SideChip side={trade.side} />
                <Typography fontWeight={600}>{trade.symbol}</Typography>
                <Typography color="text.secondary">
                  {trade.quantity} @ {formatCurrency(trade.priceMinor, trade.currency)}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography color="text.secondary">{formatDate(trade.createdAt)}</Typography>
                <TradeStatusChip status={trade.status} />
              </Stack>
            </TradeRow>
          ))}
        </>
      )}
    </DashboardViewRoot>
  );
}
