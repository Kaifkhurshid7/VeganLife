import { motion } from 'framer-motion';
import { sectionHeaderVariants } from '../../utils/animation';
import styles from './SectionHeader.module.css';

export default function SectionHeader({ label, title, description }) {
  return (
    <div className="section-header">
      <motion.span className={styles.label} {...sectionHeaderVariants.label}>
        {label}
      </motion.span>
      <motion.h2 {...sectionHeaderVariants.title}>{title}</motion.h2>
      <motion.p {...sectionHeaderVariants.description}>{description}</motion.p>
    </div>
  );
}
