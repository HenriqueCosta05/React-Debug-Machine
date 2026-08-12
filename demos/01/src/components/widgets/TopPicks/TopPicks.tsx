import { useState } from 'react';
import { useDashboard } from '../../../hooks/useDashboard';
import TradeModal from '../../modals/TradeModal/TradeModal';
import styles from './TopPicks.module.css';

export default function TopPicks() {
  const { data, isLoading } = useDashboard();
  const [offset, setOffset] = useState(0);
  const [tradeTicker, setTradeTicker] = useState<string | null>(null);
  const picks = data?.topPicks ?? [];
  const visible = picks.slice(offset, offset + 4);

  return (
    <>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.title}>Top picks</span>
          <div className={styles.controls}>
            <button className={styles.viewMore}>View more</button>
            <button
              className={styles.arrow}
              onClick={() => setOffset(Math.max(0, offset - 1))}
              aria-label="Prev"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className={styles.arrow}
              onClick={() => setOffset(Math.min(picks.length - 4, offset + 1))}
              aria-label="Next"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.picks}>
          {isLoading
            ? [1, 2, 3, 4].map((i) => <div key={i} className={styles.skeleton} />)
            : visible.map((pick) => (
                <button
                  key={pick.id}
                  className={styles.pick}
                  onClick={() => setTradeTicker(pick.ticker)}
                  title={`Trade ${pick.ticker}`}
                >
                  <div className={styles.logo} style={{ background: pick.color }}>
                    {pick.name.charAt(0)}
                  </div>
                  <span className={styles.ticker}>{pick.ticker}</span>
                </button>
              ))}
        </div>
      </div>

      {tradeTicker && (
        <TradeModal defaultTicker={tradeTicker} onClose={() => setTradeTicker(null)} />
      )}
    </>
  );
}
