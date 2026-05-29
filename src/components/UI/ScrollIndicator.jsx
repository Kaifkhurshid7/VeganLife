import { motion, useScroll, useSpring } from 'framer-motion';
import styles from './ScrollIndicator.module.css';

export default function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return <motion.div className={styles.bar} style={{ scaleX }} />;
}
