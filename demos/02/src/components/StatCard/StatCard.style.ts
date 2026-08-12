// StatCard.style.ts — styled lives in a sibling *.style.ts (atomic design).
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

// Important, reused surface -> debug name gives ".StatCardSurface-root" in the DOM.
export const StatCardSurface = styled(Paper, { name: 'StatCardSurface', slot: 'root' })(
  ({ theme }) => ({
    padding: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    flex: '1 1 200px',
  }),
);
