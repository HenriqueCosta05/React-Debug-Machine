// TradeStatusChip.style.ts — styled lives in a sibling *.style.ts (atomic design).
import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';
import type { TradeStatus } from '@/@types/trade';

// (rule) styling props in a SEPARATE exported interface — not inline on styled<>.
export interface TradeStatusChipStyleProps {
  status: TradeStatus;
}

const TONE: Record<TradeStatus, 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  filled: 'success',
  rejected: 'error',
};

// styled(MUI component) — never styled('span'); name => DOM class ".TradeStatusChip-root".
export const TradeStatusChipRoot = styled(Chip, {
  name: 'TradeStatusChip',
  slot: 'root',
  shouldForwardProp: (prop) => prop !== 'status',
})<TradeStatusChipStyleProps>(({ theme, status }) => ({
  fontWeight: 600,
  color: theme.palette[TONE[status]].main,
  backgroundColor: theme.palette[TONE[status]].light ?? theme.palette.background.paper,
}));
