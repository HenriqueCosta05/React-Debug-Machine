import { useState } from 'react';
import { useDashboard } from '../../../hooks/useDashboard';
import type { PerformancePoint } from '../../../types';
import styles from './PortfolioPerformance.module.css';

const FILTERS = ['1D', '7D', '1M', '1Y', 'All'] as const;

function LineChart({ data }: { data: PerformancePoint[] }) {
  const W = 400, H = 110;
  const pad = { l: 4, r: 4, t: 20, b: 24 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;

  const vals = data.map(d => d.value);
  const min = Math.min(...vals) * 0.97;
  const max = Math.max(...vals) * 1.02;

  const toX = (i: number) => pad.l + (i / (data.length - 1)) * innerW;
  const toY = (v: number) => pad.t + innerH - ((v - min) / (max - min)) * innerH;

  const points = data.map((d, i) => `${toX(i).toFixed(1)},${toY(d.value).toFixed(1)}`).join(' ');

  const tooltipIdx = 7;
  const tx = toX(tooltipIdx);
  const ty = toY(data[tooltipIdx].value);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop className={styles.lineGradStart} offset="0%" stopOpacity="0.08" />
          <stop className={styles.lineGradEnd} offset="100%" stopOpacity="0" />
        </linearGradient>
      </defs>

      <polyline points={points} className={styles.line} fill="none" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />

      <line x1={tx} y1={pad.t - 10} x2={tx} y2={H - pad.b} className={styles.guide} strokeWidth="1" strokeDasharray="3 3" />
      <circle cx={tx} cy={ty} r="3.5" className={styles.dot} />
      <rect x={tx - 38} y={pad.t - 18} width="76" height="18" rx="9" className={styles.tooltip} />
      <text x={tx} y={pad.t - 5} textAnchor="middle" fontSize="9" className={styles.tooltipText} fontWeight="700">
        ${data[tooltipIdx].value.toLocaleString()}
      </text>

      {data.map((d, i) => (
        <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="9" className={styles.axisLabel}>
          {d.month}
        </text>
      ))}
    </svg>
  );
}

export default function PortfolioPerformance() {
  const { data, isLoading } = useDashboard();
  const [active, setActive] = useState<string>('1M');

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Portfolio performance</span>
        <div className={styles.filters}>
          {FILTERS.map(f => (
            <button key={f} className={`${styles.filter} ${active === f ? styles.filterActive : ''}`}
              onClick={() => setActive(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !data ? (
        <div className={styles.skeleton} />
      ) : (
        <LineChart data={data.performanceData} />
      )}
    </div>
  );
}
