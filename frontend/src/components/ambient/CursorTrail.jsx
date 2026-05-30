import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CursorTrail.module.css';

const MAX_PARTICLES = 8;

export default function CursorTrail() {
  const [particles, setParticles] = useState([]);

  const handleMouseMove = useCallback((e) => {
    const newParticle = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      size: 4 + Math.random() * 6,
    };

    setParticles((prev) => [...prev.slice(-MAX_PARTICLES + 1), newParticle]);
  }, []);

  useEffect(() => {
    let throttleTimer = null;
    const throttledHandler = (e) => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        handleMouseMove(e);
      }, 80);
    };

    window.addEventListener('mousemove', throttledHandler);
    return () => window.removeEventListener('mousemove', throttledHandler);
  }, [handleMouseMove]);

  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 600);
    return () => clearTimeout(timer);
  }, [particles]);

  return (
    <div className={styles.container} aria-hidden="true">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className={styles.particle}
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3, y: 10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
