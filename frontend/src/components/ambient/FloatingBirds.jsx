import { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './FloatingBirds.module.css';

function BirdSilhouette({ size = 16 }) {
  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 40 16" fill="none">
      <path
        d="M20 8C16 4 10 2 4 6C10 4 16 6 20 10C24 6 30 4 36 6C30 2 24 4 20 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function generateBird(index) {
  return {
    id: index,
    size: 12 + Math.random() * 14,
    startY: 5 + Math.random() * 25,
    duration: 25 + Math.random() * 20,
    delay: index * 4,
    opacity: 0.15 + Math.random() * 0.2,
  };
}

export default function FloatingBirds({ count = 4 }) {
  const birds = useMemo(
    () => Array.from({ length: count }, (_, i) => generateBird(i)),
    [count]
  );

  return (
    <div className={styles.container} aria-hidden="true">
      {birds.map((bird) => (
        <motion.div
          key={bird.id}
          className={styles.bird}
          style={{ top: `${bird.startY}%`, opacity: bird.opacity }}
          animate={{ x: ['-10vw', '110vw'] }}
          transition={{
            duration: bird.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: bird.delay,
          }}
        >
          <motion.div
            animate={{ y: [0, -3, 0, 2, 0], scaleY: [1, 0.8, 1, 0.85, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BirdSilhouette size={bird.size} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
