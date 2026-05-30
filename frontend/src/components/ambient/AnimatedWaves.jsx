import { motion } from 'framer-motion';
import styles from './AnimatedWaves.module.css';

export default function AnimatedWaves() {
  return (
    <div className={styles.container} aria-hidden="true">
      <motion.svg
        className={styles.wave}
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        animate={{
          d: [
            'M0,40 C200,60 400,20 600,40 C800,60 1000,20 1200,40 L1200,80 L0,80Z',
            'M0,40 C200,20 400,60 600,40 C800,20 1000,60 1200,40 L1200,80 L0,80Z',
          ],
        }}
      >
        <motion.path
          fill="rgba(166,180,143,0.08)"
          animate={{
            d: [
              'M0,40 C200,60 400,20 600,40 C800,60 1000,20 1200,40 L1200,80 L0,80Z',
              'M0,40 C200,20 400,60 600,40 C800,20 1000,60 1200,40 L1200,80 L0,80Z',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>

      <motion.svg
        className={`${styles.wave} ${styles.waveSecond}`}
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
      >
        <motion.path
          fill="rgba(157,130,171,0.05)"
          animate={{
            d: [
              'M0,50 C300,30 500,60 700,45 C900,30 1100,55 1200,45 L1200,80 L0,80Z',
              'M0,45 C300,60 500,30 700,50 C900,65 1100,35 1200,50 L1200,80 L0,80Z',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </motion.svg>
    </div>
  );
}
