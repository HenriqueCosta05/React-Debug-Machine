import { useState } from 'react';
import { useDashboard } from '../../../hooks/useDashboard';
import type { AssetBreakdown } from '../../../types';
import DepositModal from '../../modals/DepositModal/DepositModal';
import styles from './MyPortfolio.module.css';

function Sparkline({ data }: { data: number[] }) {
  const W = 120, H = 36;
  const min = Math.min(...data), max = Math.max(...data);
  const toX = (i: number) => (i / (data.length - 1)) * W;
  const toY = (v: number) => H - ((v - min) / (max - min)) * H * 0.8 - H * 0.1;
  const pts = data.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className={styles.sparkline}>
      <polyline points={pts} fill="none" stroke="#EDEBEB" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={toX(data.length - 1)} cy={toY(data[data.length - 1])} r="3" fill="#EDEBEB" />
    </svg>
  );
}

function BreakdownBar({ items }: { items: AssetBreakdown[] }) {
  return (
    <div className={styles.bar}>
      {items.map(item => (
        <div key={item.name} className={styles.barSegment}
          style={{ width: `${item.percent}%`, background: item.color }} />
      ))}
    </div>
  );
}

export default function MyPortfolio() {
  const { data, isLoading } = useDashboard();
  const [depositOpen, setDepositOpen] = useState(false);
  const p = data?.portfolio;

  const fmt = (v: number) =>
    v.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

  return (
    <>
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.title}>My portfolio</span>
        <button className={styles.deposit} onClick={() => setDepositOpen(true)}>+ Deposit</button>
      </div>

      <div className={styles.valueRow}>
        <span className={styles.total}>{isLoading ? '—' : fmt(p?.totalValue ?? 0)}</span>
        {p && (
          <span className={styles.badge}>↑ +{p.changePercent}%</span>
        )}
      </div>

      {p && (
        <div className={styles.monthRow}>
          <div>
            <div className={styles.monthLabel}>{p.monthly.label}</div>
            <div className={styles.monthValue}>${p.monthly.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <Sparkline data={p.sparkline} />
        </div>
      )}

      {p && (
        <>
          <BreakdownBar items={p.breakdown} />

          <div className={styles.list}>
            {p.breakdown.map(item => (
              <div key={item.name} className={styles.listItem}>
                <div className={styles.listLeft}>
                  <span className={styles.dot} style={{ background: item.color }} />
                  <div>
                    <div className={styles.assetName}>{item.name}</div>
                    <div className={styles.assetPct}>{item.percent}%</div>
                  </div>
                </div>
                <span className={styles.assetValue}>{fmt(item.value)}</span>
              </div>
            ))}
          </div>

          <button className={styles.viewAll}>View all {p.totalAssets}</button>
        </>
      )}
    </div>
    {depositOpen && <DepositModal onClose={() => setDepositOpen(false)} />}
    </>
  );
}
