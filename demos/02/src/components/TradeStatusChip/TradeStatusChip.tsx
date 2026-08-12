// TradeStatusChip.tsx — presentational atom. No store knowledge; all text via t().
import { useTranslation } from 'react-i18next';
import type { TradeStatus } from '@/@types/trade';
import { TradeStatusChipRoot } from './TradeStatusChip.style';

export interface TradeStatusChipProps {
  status: TradeStatus;
}

export function TradeStatusChip({ status }: TradeStatusChipProps) {
  const { t } = useTranslation('trades');
  return <TradeStatusChipRoot status={status} label={t(`status.${status}`)} size="small" />;
}
