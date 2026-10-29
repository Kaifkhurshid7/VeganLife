import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks';

/**
 * Shared route enter/exit animation.
 *
 * Under reduced-motion the slide is dropped and only a short opacity fade
 * remains — enough to signal that the page changed without any movement.
 */
export default function PageTransition({ children }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
