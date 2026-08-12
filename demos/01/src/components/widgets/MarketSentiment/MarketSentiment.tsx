import { useDashboard } from '../../../hooks/useDashboard';
import styles from './MarketSentiment.module.css';

function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, sweepDeg: number) {
  const start = polarToXY(cx, cy, r, startDeg);
  const end = polarToXY(cx, cy, r, startDeg + sweepDeg);
  const largeArc = sweepDeg > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

interface GaugeProps {
  value: number;
}

function Gauge({ value }: GaugeProps) {
  const cx = 100, cy = 105, r = 72;
  const totalDeg = 270;
  const startDeg = 135;
  const fillDeg = (value / 100) * totalDeg;

  const trackPath = arcPath(cx, cy, r, startDeg, totalDeg);
  const fillPath = arcPath(cx, cy, r, startDeg, fillDeg);
  const dot = polarToXY(cx, cy, r, startDeg + fillDeg);

  return (
    <svg viewBox="0 0 200 175" className={styles.gauge}>
      <defs>
        <radialGradient id="gaugeBg" cx="50%" cy="50%" r="50%">
          <stop className={styles.gaugeBgStopStart} offset="0%" stopOpacity="0.06" />
          <stop className={styles.gaugeBgStopEnd} offset="100%" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={86} fill="url(#gaugeBg)" />

      {[...Array(36)].map((_, i) => {
        const angle = i * 10;
        const inner = polarToXY(cx, cy, 84, angle);
        const outer = polarToXY(cx, cy, 88, angle);
        return (
          <line key={i} className={styles.tick} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
            strokeWidth="1.5" />
        );
      })}

      <path d={trackPath} className={styles.gaugeTrack} fill="none" strokeWidth="10" strokeLinecap="round" />
      <path d={fillPath} className={styles.gaugeFill} fill="none" strokeWidth="10" strokeLinecap="round" />
      <circle cx={dot.x} cy={dot.y} r="7" className={styles.gaugeDot} />
      <circle cx={dot.x} cy={dot.y} r="3.5" className={styles.gaugeDotHole} />
    </svg>
  );
}

export default function MarketSentiment() {
  const { data, isLoading } = useDashboard();
  const value = data?.marketSentiment ?? 68;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Market sentiment</span>
        <span className={styles.value}>{isLoading ? '--' : value}<span className={styles.percent}>%</span></span>
      </div>
      <Gauge value={isLoading ? 0 : value} />
      <p className={styles.caption}>Market is leaning towards buying volume.</p>
    </div>
  );
}
