// SideChip.tsx — presentational atom. No store knowledge; all text via t().
import { useTranslation } from 'react-i18next';
import type { TradeSide } from '@/@types/trade';
import { SideChipRoot } from './SideChip.style';

export interface SideChipProps {
  side: TradeSide;
}

export function SideChip({ side }: SideChipProps) {
  const { t } = useTranslation('trades');
  return <SideChipRoot side={side} label={t(`side.${side}`)} size="small" />;
}
