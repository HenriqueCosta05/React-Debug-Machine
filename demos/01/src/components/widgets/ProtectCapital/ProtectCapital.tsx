import styles from './ProtectCapital.module.css';

const LockIcon = () => (
  <svg className={styles.lockIcon} viewBox="0 0 80 100" fill="none">
    <rect x="10" y="42" width="60" height="52" rx="8" fill="#1a0a00" stroke="#333" strokeWidth="2" />
    <path d="M25 42V28a15 15 0 0 1 30 0v14" stroke="#555" strokeWidth="5" strokeLinecap="round" />
    <circle cx="40" cy="64" r="8" fill="#E00F04" />
    <rect x="37" y="64" width="6" height="12" rx="3" fill="#E00F04" />
    <rect x="8" y="48" width="12" height="40" rx="4" fill="rgba(0,0,0,0.3)" />
    <rect x="60" y="48" width="12" height="40" rx="4" fill="rgba(0,0,0,0.3)" />
    <circle cx="40" cy="22" r="4" fill="#666" />
    <circle cx="26" cy="38" r="3" fill="#444" />
    <circle cx="54" cy="38" r="3" fill="#444" />
  </svg>
);

export default function ProtectCapital() {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.badge}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#FCF746">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Protection level: Basic</span>
          <div className={styles.dots}>
            <span className={styles.dotActive} />
            <span className={styles.dotInactive} />
            <span className={styles.dotInactive} />
          </div>
        </div>
        <button className={styles.close}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.text}>
          <h3 className={styles.heading}>Protect your capital</h3>
          <p className={styles.desc}>Activate multi-layered account protection and institutional-grade encryption for all your transactions.</p>
          <button className={styles.cta}>
            Secure account
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
        <LockIcon />
      </div>
    </div>
  );
}
