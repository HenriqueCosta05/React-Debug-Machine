import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Modal from '../Modal';
import { submitDeposit } from '../../../lib/api';
import styles from './DepositModal.module.css';

interface Props {
  onClose: () => void;
}

const METHODS: { value: 'bank' | 'card' | 'crypto'; label: string; sub: string }[] = [
  { value: 'bank', label: 'Bank Transfer', sub: 'ACH · 1-3 days' },
  { value: 'card', label: 'Debit Card', sub: 'Instant' },
  { value: 'crypto', label: 'Crypto', sub: 'Network fees apply' },
];

export default function DepositModal({ onClose }: Props) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'bank' | 'card' | 'crypto'>('bank');

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: submitDeposit,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ amount: parseFloat(amount), method });
  };

  const parsedAmount = parseFloat(amount) || 0;

  return (
    <Modal title="Deposit Funds" onClose={onClose}>
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
          <p>Deposit initiated</p>
          <span className={styles.successSub}>Check console capture — large deposits emit a warning</span>
          <button className={styles.btnPrimary} onClick={onClose}>
            Done
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Amount (USD)</label>
            <div className={styles.inputWrap}>
              <span className={styles.prefix}>$</span>
              <input
                className={styles.input}
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Payment method</label>
            <div className={styles.methods}>
              {METHODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={styles.methodBtn}
                  data-active={method === m.value}
                  onClick={() => setMethod(m.value)}
                >
                  <span className={styles.methodLabel}>{m.label}</span>
                  <span className={styles.methodSub}>{m.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {parsedAmount > 50_000 && (
            <p className={styles.warning}>
              Amounts over $50,000 trigger a compliance review — visible in the console capture
            </p>
          )}

          {isError && (
            <p className={styles.error}>
              {error instanceof Error ? error.message : 'Deposit failed — see debug panel'}
            </p>
          )}

          <button className={styles.btnPrimary} type="submit" disabled={isPending || !amount}>
            {isPending ? 'Processing…' : 'Deposit'}
          </button>
        </form>
      )}
    </Modal>
  );
}
