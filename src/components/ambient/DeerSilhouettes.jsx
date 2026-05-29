import { motion } from 'framer-motion';
import styles from './DeerSilhouettes.module.css';

function DeerSVG({ flip = false }) {
  return (
    <svg
      width="60"
      height="50"
      viewBox="0 0 60 50"
      fill="currentColor"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path d="M25,48 L25,35 C25,32 27,30 28,28 L30,20 C30,18 29,16 28,15 L26,12 L24,8 L23,4 L24,2 M28,15 L30,12 L32,8 L33,4 L32,2 M30,20 L32,22 C34,24 36,26 36,30 L36,35 L36,48 M25,35 L28,35 M33,35 L36,35 M30,28 C31,28 32,27 32,26 C32,25 31,24 30,24 C29,24 28,25 28,26 C28,27 29,28 30,28Z" />
    </svg>
  );
}

export default function DeerSilhouettes() {
  return (
    <div className={styles.container} aria-hidden="true">
      <motion.div
        className={styles.deer}
        style={{ left: '8%', bottom: '15%' }}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <DeerSVG />
      </motion.div>

      <motion.div
        className={styles.deer}
        style={{ right: '12%', bottom: '20%' }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <motion.div
          animate={{ rotateZ: [0, 3, 0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <DeerSVG flip />
        </motion.div>
      </motion.div>
    </div>
  );
}
