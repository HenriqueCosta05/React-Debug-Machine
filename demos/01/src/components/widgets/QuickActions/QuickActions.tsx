import { useState } from 'react';
import TradeModal from '../../modals/TradeModal/TradeModal';
import WithdrawModal from '../../modals/WithdrawModal/WithdrawModal';
import TaxReportModal from '../../modals/TaxReportModal/TaxReportModal';
import styles from './QuickActions.module.css';

type ModalType = 'trade' | 'withdraw' | 'tax' | null;

const actions: { label: string; modal: ModalType; icon: React.ReactNode }[] = [
  {
    label: 'Exchange',
    modal: 'trade',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    label: 'Tax report',
    modal: 'tax',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: 'Withdraw',
    modal: 'withdraw',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    ),
  },
];

export default function QuickActions() {
  const [open, setOpen] = useState<ModalType>(null);

  return (
    <>
      <div className={styles.card}>
        <span className={styles.title}>Quick actions</span>
        <div className={styles.actions}>
          {actions.map(({ label, icon, modal }) => (
            <button key={label} className={styles.action} onClick={() => setOpen(modal)}>
              <span className={styles.iconWrap}>{icon}</span>
              <span className={styles.label}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {open === 'trade' && <TradeModal onClose={() => setOpen(null)} />}
      {open === 'withdraw' && <WithdrawModal onClose={() => setOpen(null)} />}
      {open === 'tax' && <TaxReportModal onClose={() => setOpen(null)} />}
    </>
  );
}
