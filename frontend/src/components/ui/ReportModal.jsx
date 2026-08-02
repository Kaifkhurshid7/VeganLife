import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFlag } from 'react-icons/fi';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './Toast';
import styles from './ReportModal.module.css';

// Keep in sync with backend/src/constants/report.js
const REASONS = [
  'Spam or advertising',
  'Harassment or bullying',
  'Hate speech',
  'Inappropriate content',
  'Misinformation',
  'Impersonation',
  'Privacy violation',
  'Other',
];

export default function ReportModal({ targetType, targetId, onClose }) {
  const { user } = useAuth();
  const toast = useToast();
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!user) {
      toast.warning('Login to report');
      onClose();
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiFetch('/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, reason, details: details.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) toast.error('You already reported this');
        else toast.error(data.message || 'Failed to submit report');
      } else {
        toast.success('Report submitted — thanks for keeping the community healthy');
        onClose();
      }
    } catch {
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          initial={{ y: 24, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Report content"
        >
          <div className={styles.icon}><FiFlag /></div>
          <h3 className={styles.title}>Report this {targetType}</h3>
          <p className={styles.subtitle}>What's wrong with this {targetType}? Your report stays anonymous to the author.</p>

          <label className={styles.label} htmlFor="report-reason">Reason</label>
          <select
            id="report-reason"
            className={styles.select}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          <label className={styles.label} htmlFor="report-details">Additional details (optional)</label>
          <textarea
            id="report-details"
            className={styles.textarea}
            placeholder="Anything else moderators should know?"
            maxLength={500}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <span className={styles.counter}>{details.length}/500</span>

          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit report'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
