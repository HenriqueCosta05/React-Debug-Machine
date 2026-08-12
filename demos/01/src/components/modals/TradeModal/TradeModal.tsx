import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../Modal';
import { submitTrade } from '../../../lib/api';
import styles from './TradeModal.module.css';

const TICKERS = ['AAPL', 'NKE', 'TSLA', 'GOOGL', 'META', 'BA', 'DIS', 'AMZN', 'MSFT'];

interface Props {
  defaultTicker?: string;
  onClose: () => void;
}

export default function TradeModal({ defaultTicker = 'AAPL', onClose }: Props) {
  const [ticker, setTicker] = useState(defaultTicker);
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');

  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: submitTrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      ticker,
      side,
      shares: parseFloat(shares),
      orderType,
      ...(orderType === 'limit' && limitPrice ? { limitPrice: parseFloat(limitPrice) } : {}),
    });
  };

  return (
    <Modal title="Place Order" onClose={onClose}>
      {isSuccess ? (
        <div className={styles.success}>
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4DB6AC"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          <p>Order submitted</p>
          <span className={styles.successSub}>Check the debug panel — network &amp; state captured</span>
          <button className={styles.btnPrimary} onClick={onClose}>
            Done
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Ticker</label>
            <select
              className={styles.select}
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            >
              {TICKERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Side</label>
            <div className={styles.toggle}>
              <button
                type="button"
                className={styles.toggleBtn}
                data-active={side === 'buy'}
                data-variant="buy"
                onClick={() => setSide('buy')}
              >
                Buy
              </button>
              <button
                type="button"
                className={styles.toggleBtn}
                data-active={side === 'sell'}
                data-variant="sell"
                onClick={() => setSide('sell')}
              >
                Sell
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Order type</label>
            <div className={styles.toggle}>
              <button
                type="button"
                className={styles.toggleBtn}
                data-active={orderType === 'market'}
                onClick={() => setOrderType('market')}
              >
                Market
              </button>
              <button
                type="button"
                className={styles.toggleBtn}
                data-active={orderType === 'limit'}
                onClick={() => setOrderType('limit')}
              >
                Limit
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Shares</label>
            <input
              className={styles.input}
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              required
            />
          </div>

          {orderType === 'limit' && (
            <div className={styles.field}>
              <label className={styles.label}>Limit price (USD)</label>
              <div className={styles.inputWrap}>
                <span className={styles.prefix}>$</span>
                <input
                  className={styles.input}
                  style={{ paddingLeft: 28 }}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {isError && (
            <p className={styles.error}>
              {error instanceof Error ? error.message : 'Order failed — see debug panel'}
            </p>
          )}

          <button
            className={side === 'buy' ? styles.btnBuy : styles.btnSell}
            type="submit"
            disabled={isPending}
          >
            {isPending ? 'Submitting…' : `${side === 'buy' ? 'Buy' : 'Sell'} ${ticker}`}
          </button>
        </form>
      )}
    </Modal>
  );
}
