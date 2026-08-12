// NewTrade.style.ts — view-level styled containers (sibling *.style.ts).
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Important container gets a debug name => ".NewTradeView-root" in the DOM.
export const NewTradeViewRoot = styled(Box, { name: 'NewTradeView', slot: 'root' })(
  ({ theme }) => ({
    padding: theme.spacing(3),
    maxWidth: 480,
    marginInline: 'auto',
  }),
);
