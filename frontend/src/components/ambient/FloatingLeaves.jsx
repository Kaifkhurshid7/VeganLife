import { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './FloatingLeaves.module.css';

const LEAF_PATHS = [
  'M10,0 C15,8 18,15 15,22 C12,28 8,30 5,28 C2,25 0,18 3,10 C5,5 8,2 10,0Z',
  'M8,0 C12,6 16,12 14,20 C12,26 8,28 5,25 C2,22 1,15 3,8 C5,3 7,1 8,0Z',
  'M12,0 C16,10 20,18 17,26 C14,32 9,34 6,30 C3,26 1,18 4,10 C7,4 10,1 12,0Z',
];

const LEAF_COLORS = ['#a6b48f', '#8fa67a', '#b4c49f', '#7a9466', '#c4b48f'];

function generateLeaf(index) {
  return {
    id: index,
    path: LEAF_PATHS[index % LEAF_PATHS.length],
    color: LEAF_COLORS[index % LEAF_COLORS.length],
    startX: Math.random() * 100,
    size: 14 + Math.random() * 12,
    duration: 12 + Math.random() * 10,
    delay: index * 2.5,
    rotateRange: 30 + Math.random() * 60,
    opacity: 0.3 + Math.random() * 0.35,
    swayAmount: 40 + Math.random() * 60,
  };
}

export default function FloatingLeaves({ count = 8 }) {
  const leaves = useMemo(
    () => Array.from({ length: count }, (_, i) => generateLeaf(i)),
    [count]
  );

  return (
    <div className={styles.container} aria-hidden="true">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className={styles.leaf}
          style={{ left: `${leaf.startX}%`, opacity: leaf.opacity }}
          animate={{
            y: ['-10%', '110vh'],
            x: [0, leaf.swayAmount, -leaf.swayAmount * 0.6, leaf.swayAmount * 0.8, 0],
            rotate: [0, leaf.rotateRange, -leaf.rotateRange * 0.5, leaf.rotateRange * 0.7, 0],
          }}
          transition={{
            y: { duration: leaf.duration, repeat: Infinity, ease: 'linear', delay: leaf.delay },
            x: { duration: leaf.duration * 0.8, repeat: Infinity, ease: 'easeInOut', delay: leaf.delay },
            rotate: { duration: leaf.duration * 0.6, repeat: Infinity, ease: 'easeInOut', delay: leaf.delay },
          }}
        >
          <svg width={leaf.size} height={leaf.size * 1.5} viewBox="0 0 20 32" fill="none">
            <path d={leaf.path} fill={leaf.color} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
