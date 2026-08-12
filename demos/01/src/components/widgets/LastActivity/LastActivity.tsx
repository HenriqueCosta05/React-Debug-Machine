import { useDashboard } from '../../../hooks/useDashboard';
import styles from './LastActivity.module.css';

export default function LastActivity() {
  const { data, isLoading } = useDashboard();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Last activity</span>
        <button className={styles.viewAll}>
          View all
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className={styles.list}>
        {isLoading || !data
          ? [1, 2].map(i => <div key={i} className={styles.skeleton} />)
          : data.lastActivity.map(item => (
            <div key={item.id} className={styles.item}>
              <div className={styles.logo} style={{ background: item.color }}>
                {item.company.charAt(0)}
              </div>
              <div className={styles.info}>
                <div className={styles.company}>{item.company} <span className={styles.ticker}>{item.ticker}</span></div>
                <div className={styles.action} data-action={item.action}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    {item.action === 'Buy'
                      ? <polyline points="18 15 12 9 6 15" />
                      : <polyline points="6 9 12 15 18 9" />}
                  </svg>
                  {item.action}
                </div>
              </div>
              <div className={styles.right}>
                <span className={styles.amount} data-neg={item.amount < 0}>
                  {item.amount < 0 ? '-' : '+'}${Math.abs(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className={styles.time}>{item.time}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
