import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import styles from './BackButton.module.css';

export default function BackButton() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 150, 200], [1, 1, 0]);
  const y = useTransform(scrollY, [0, 150, 200], [0, 0, -20]);
  const pointerEvents = useTransform(scrollY, (v) => (v > 180 ? 'none' : 'auto'));

  return (
    <motion.div style={{ opacity, y, pointerEvents }} className={styles.wrapper}>
      <Link to="/" className={styles.btn}>
        <FiArrowLeft />
        <span>Back</span>
      </Link>
    </motion.div>
  );
}
