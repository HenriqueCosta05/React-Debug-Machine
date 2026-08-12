// StatCard.tsx — presentational molecule: a labelled stat tile for the dashboard.
import { Stack, Typography } from '@mui/material';
import { StatCardSurface } from './StatCard.style';

export interface StatCardProps {
  label: string;
  value: string;
  tone?: 'default' | 'positive' | 'negative';
}

const TONE_COLOR: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'text.primary',
  positive: 'success.main',
  negative: 'error.main',
};

export function StatCard({ label, value, tone = 'default' }: StatCardProps) {
  return (
    <StatCardSurface elevation={0} variant="outlined">
      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" color={TONE_COLOR[tone]}>
          {value}
        </Typography>
      </Stack>
    </StatCardSurface>
  );
}
