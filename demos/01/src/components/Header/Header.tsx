import { useDashboard } from '../../hooks/useDashboard';
import styles from './Header.module.css';

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function Header() {
  const { data } = useDashboard();

  return (
    <header className={styles.header}>
      <div className={styles.user}>
        <div className={styles.avatar}>
          {data?.user.name.charAt(0) ?? 'D'}
        </div>
        <div className={styles.userInfo}>
          <span className={styles.name}>{data?.user.name ?? 'David Thomas'}</span>
          <span className={styles.role}>{data?.user.role ?? 'Investor'}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.addWidget}>
          Add widget
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button className={styles.iconBtn}><CalendarIcon /></button>
        <button className={styles.iconBtn}><BellIcon /></button>
        <button className={styles.iconBtn}><SearchIcon /></button>
      </div>
    </header>
  );
}
