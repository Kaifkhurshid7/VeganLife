import { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './Fireflies.module.css';

function generateFirefly(index) {
  return {
    id: index,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 3 + Math.random() * 4,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 5,
    glowDuration: 2 + Math.random() * 3,
  };
}

export default function Fireflies({ count = 12 }) {
  const particles = useMemo(
    () => Array.from({ length: count }, (_, i) => generateFirefly(i)),
    [count]
  );

  return (
    <div className={styles.container} aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={styles.firefly}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            x: [0, 20, -15, 10, -5, 0],
            y: [0, -15, 10, -20, 5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        >
          <motion.div
            className={styles.glow}
            animate={{ opacity: [0.2, 0.8, 0.3, 0.9, 0.2], scale: [0.8, 1.2, 0.9, 1.1, 0.8] }}
            transition={{
              duration: p.glowDuration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
