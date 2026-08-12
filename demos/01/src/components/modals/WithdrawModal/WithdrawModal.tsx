import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Modal from '../Modal';
import { submitWithdraw } from '../../../lib/api';
import styles from './WithdrawModal.module.css';

interface Props {
  onClose: () => void;
}

export default function WithdrawModal({ onClose }: Props) {
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: submitWithdraw,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ amount: parseFloat(amount), destination });
  };

  const parsedAmount = parseFloat(amount) || 0;

  return (
    <Modal title="Withdraw Funds" onClose={onClose}>
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
          <p>Withdrawal queued</p>
          <span className={styles.successSub}>Network request captured in debug panel</span>
          <button className={styles.btnDanger} onClick={onClose}>
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
            <label className={styles.label}>Destination</label>
            <input
              className={styles.input}
              style={{ paddingLeft: 12 }}
              type="text"
              placeholder="Bank account or wallet address"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          {parsedAmount > 10_000 && (
            <p className={styles.warning}>
              Amounts over $10,000 require additional verification — see console capture
            </p>
          )}

          {isError && (
            <p className={styles.error}>
              {error instanceof Error ? error.message : 'Withdrawal failed — see debug panel'}
            </p>
          )}

          <button
            className={styles.btnDanger}
            type="submit"
            disabled={isPending || !amount || !destination}
          >
            {isPending ? 'Processing…' : 'Withdraw'}
          </button>
        </form>
      )}
    </Modal>
  );
}
