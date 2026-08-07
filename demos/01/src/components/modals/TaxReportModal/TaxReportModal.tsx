import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Modal from '../Modal';
import { requestTaxReport } from '../../../lib/api';
import styles from './TaxReportModal.module.css';

interface Props {
  onClose: () => void;
}

const YEARS = [2024, 2023, 2022, 2021];

export default function TaxReportModal({ onClose }: Props) {
  const [year, setYear] = useState(2024);
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: requestTaxReport,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ year, format });
  };

  return (
    <Modal title="Tax Report" onClose={onClose}>
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <p>Report ready</p>
          <span className={styles.successSub}>GET /api/tax-report captured in debug panel</span>
          <button className={styles.btnPrimary} onClick={onClose}>
            Download {format.toUpperCase()}
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Tax year</label>
            <div className={styles.years}>
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={styles.yearBtn}
                  data-active={year === y}
                  onClick={() => setYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Format</label>
            <div className={styles.formats}>
              <button
                type="button"
                className={styles.formatBtn}
                data-active={format === 'pdf'}
                onClick={() => setFormat('pdf')}
              >
                PDF
              </button>
              <button
                type="button"
                className={styles.formatBtn}
                data-active={format === 'csv'}
                onClick={() => setFormat('csv')}
              >
                CSV
              </button>
            </div>
          </div>

          {isError && (
            <p className={styles.error}>
              {error instanceof Error ? error.message : 'Generation failed — see debug panel'}
            </p>
          )}

          <button className={styles.btnPrimary} type="submit" disabled={isPending}>
            {isPending ? 'Generating…' : 'Generate Report'}
          </button>
        </form>
      )}
    </Modal>
  );
}
