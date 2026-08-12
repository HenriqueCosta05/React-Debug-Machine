// Dashboard.style.ts — view-level styled containers (sibling *.style.ts).
import { styled } from '@mui/material/styles';
import { Box, Stack } from '@mui/material';

// Important container gets a debug name => ".DashboardView-root" in the DOM.
export const DashboardViewRoot = styled(Box, { name: 'DashboardView', slot: 'root' })(
  ({ theme }) => ({
    padding: theme.spacing(3),
    maxWidth: 960,
    marginInline: 'auto',
  }),
);

export const StatsRow = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBlockEnd: theme.spacing(4),
}));

export const TradeRow = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  paddingBlock: theme.spacing(1.25),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
