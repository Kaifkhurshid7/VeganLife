import { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../../hooks';
import styles from './Butterflies.module.css';

function generateButterfly(index) {
  const sizes = [28, 34, 40, 46, 32, 38];
  const colors = [
    ['#9d82ab', '#e3a36e'],
    ['#a6b48f', '#9d82ab'],
    ['#e3a36e', '#a6b48f'],
    ['#9d82ab', '#573d21'],
    ['#a6b48f', '#e3a36e'],
    ['#e3a36e', '#9d82ab'],
  ];
  return {
    id: index,
    size: sizes[index % sizes.length],
    colors: colors[index % colors.length],
    startX: 10 + Math.random() * 80,
    startY: 15 + Math.random() * 60,
    duration: 14 + Math.random() * 10,
    delay: index * 1.8,
    opacity: 0.35 + Math.random() * 0.3,
  };
}

function ButterflyShape({ size, colors, opacity }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ opacity }}>
      <path
        d="M32 30C28 20 12 16 8 28C6 34 16 42 32 50C48 42 58 34 56 28C52 16 36 20 32 30Z"
        fill={colors[0]}
        opacity="0.7"
      />
      <path
        d="M32 30C30 24 20 22 18 28C17 31 22 35 32 40C42 35 47 31 46 28C44 22 34 24 32 30Z"
        fill={colors[1]}
        opacity="0.5"
      />
    </svg>
  );
}

export default function Butterflies({ count = 5 }) {
  const containerRef = useRef(null);
  const mouse = useMousePosition(50);

  const butterflies = useMemo(
    () => Array.from({ length: count }, (_, i) => generateButterfly(i)),
    [count]
  );

  return (
    <div ref={containerRef} className={styles.container} aria-hidden="true">
      {butterflies.map((b) => (
        <motion.div
          key={b.id}
          className={styles.butterfly}
          style={{
            left: `${b.startX}%`,
            top: `${b.startY}%`,
            x: mouse.x * (0.3 + b.id * 0.1) * -1,
            y: mouse.y * (0.2 + b.id * 0.08) * -1,
          }}
          animate={{
            x: [0, 30, -20, 15, -10, 0],
            y: [0, -25, -40, -15, -30, 0],
            rotate: [0, 8, -5, 12, -8, 0],
            scale: [1, 0.95, 1.05, 0.98, 1.02, 1],
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: b.delay,
          }}
        >
          <motion.div
            animate={{ scaleY: [1, 0.7, 1, 0.75, 1] }}
            transition={{
              duration: 1.2 + b.id * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ButterflyShape size={b.size} colors={b.colors} opacity={b.opacity} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
