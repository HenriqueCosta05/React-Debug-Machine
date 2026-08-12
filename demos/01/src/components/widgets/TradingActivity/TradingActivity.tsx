import { useDashboard } from '../../../hooks/useDashboard';
import type { HeatmapDay } from '../../../types';
import styles from './TradingActivity.module.css';

const LEVEL_COLORS = ['#1a1a1c', '#2d3a1e', '#3d5228', '#5a7a30', '#FCF746'];

const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

function Heatmap({ days }: { days: HeatmapDay[] }) {
  const cols = Math.ceil(days.length / 7);

  return (
    <div className={styles.heatmapWrap}>
      <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {days.map((d) => (
          <div
            key={d.date}
            className={styles.cell}
            style={{ background: LEVEL_COLORS[d.level] }}
            title={`${d.date}: level ${d.level}`}
          />
        ))}
      </div>
      <div className={styles.months}>
        {MONTHS.map(m => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}

export default function TradingActivity() {
  const { data, isLoading } = useDashboard();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Trading activity</span>
        <button className={styles.expand} aria-label="Expand">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>

      {isLoading || !data ? (
        <div className={styles.skeleton} />
      ) : (
        <Heatmap days={data.tradingActivity} />
      )}
    </div>
  );
}
