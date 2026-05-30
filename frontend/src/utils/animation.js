/**
 * Shared Framer Motion animation variants for consistent entrance animations.
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
};

export const staggerContainer = (staggerDelay = 0.1) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: staggerDelay },
});

export const sectionHeaderVariants = {
  label: {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 0.8, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  },
  title: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 },
  },
  description: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 0.8, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, delay: 0.2 },
  },
};
