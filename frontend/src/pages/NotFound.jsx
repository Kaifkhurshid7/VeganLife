import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa6';
import { Seo } from '../components/seo';
import { ROUTES } from '../constants/routes';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import styles from './NotFound.module.css';

// Where people most likely meant to go, as stickers on the wall.
const SIGNS = [
  { label: 'Home', to: ROUTES.home, tone: 'sage' },
  { label: 'Recipes', to: ROUTES.recipes, tone: 'orange' },
  { label: 'Articles', to: ROUTES.articles, tone: 'lilac' },
  { label: 'Tools', to: ROUTES.calculator, tone: 'sage' },
  { label: 'Community', to: ROUTES.community, tone: 'orange' },
];

function Sheet({ className = '', rot = 0, delay = 0, tape = true, children }) {
  const reduce = usePrefersReducedMotion();
  return (
    <motion.div
      className={`${styles.sheet} ${className}`}
      initial={reduce ? false : { opacity: 0, scale: 1.4, rotate: rot + 12, y: -40 }}
      animate={{ opacity: 1, scale: 1, rotate: rot, y: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 15, delay }}
    >
      {tape && <span className={styles.tape} aria-hidden="true" />}
      {children}
    </motion.div>
  );
}

export default function NotFound() {
  return (
    <section className={styles.section}>
      <Seo title="Page not found" description="That page does not exist." noindex />
      <span className={styles.spray} aria-hidden="true">Lost?</span>

      <div className={styles.board}>
        <Sheet className={styles.main} rot={-2} delay={0.1}>
          <p className={styles.notice}>Error 404</p>
          <h1 className={styles.code} aria-label="404">
            {['4', '0', '4'].map((d, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              >
                {d}
              </motion.span>
            ))}
          </h1>
          <p className={styles.headline}>This page got composted.</p>
          <p className={styles.desc}>
            The address you opened doesn’t lead anywhere in our garden. It may have moved, or the link may
            have a typo. Pick a path below instead.
          </p>
        </Sheet>

        <Sheet className={styles.note} rot={3} delay={0.3}>
          <p className={styles.script}>No planet B.<br />No page B either.</p>
        </Sheet>

        <nav className={styles.signs} aria-label="Where to go instead">
          <p className={styles.signsLabel}>Try one of these</p>
          <ul>
            {SIGNS.map((s, i) => (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, scale: 1.3, rotate: (i % 2 ? 8 : -8) + 10 }}
                animate={{ opacity: 1, scale: 1, rotate: i % 2 ? 3 : -3 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.5 + i * 0.1 }}
              >
                <Link to={s.to} className={`${styles.sign} ${styles[`tone_${s.tone}`]}`}>
                  {s.label} <FaArrowRight aria-hidden="true" />
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
