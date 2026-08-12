// SideChip.style.ts — styled lives in a sibling *.style.ts (atomic design).
import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';
import type { TradeSide } from '@/@types/trade';

// (rule) styling props in a SEPARATE exported interface — not inline on styled<>.
export interface SideChipStyleProps {
  side: TradeSide;
}

const TONE: Record<TradeSide, 'success' | 'error'> = {
  buy: 'success',
  sell: 'error',
};

// styled(MUI component) — never styled('span'); name => DOM class ".SideChip-root".
export const SideChipRoot = styled(Chip, {
  name: 'SideChip',
  slot: 'root',
  shouldForwardProp: (prop) => prop !== 'side',
})<SideChipStyleProps>(({ theme, side }) => ({
  fontWeight: 600,
  color: theme.palette[TONE[side]].main,
  backgroundColor: theme.palette[TONE[side]].light ?? theme.palette.background.paper,
}));
