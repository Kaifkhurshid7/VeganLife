import { motion } from 'framer-motion';
import styles from './PasswordStrength.module.css';

const LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
const COLORS = ['', '#c0392b', '#e3a36e', '#e3a36e', '#a6b48f', '#2ecc71'];

// 0–5 score used by both the Auth signup form and the profile change-password form.
export default function PasswordStrength({ password }) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const color = COLORS[score];

  return (
    <div className={styles.meter}>
      <div className={styles.bars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className={styles.bar}
            style={{ backgroundColor: i <= score ? color : 'rgba(87,61,33,0.1)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
      </div>
      <span className={styles.label} style={{ color }}>{LABELS[score]}</span>
    </div>
  );
}
