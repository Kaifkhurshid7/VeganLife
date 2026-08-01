import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa6';
import { sectionHeaderVariants } from '../../utils/animation';
import styles from './SectionHeader.module.css';

export default function SectionHeader({ label, title, description }) {
  return (
    <div className="section-header">
      <motion.span className={styles.label} {...sectionHeaderVariants.label}>
        {label}
      </motion.span>
      <motion.h2 {...sectionHeaderVariants.title}>{title}</motion.h2>

      {/* Gradient underline that draws in + leaf flourish */}
      <motion.div
        className="accent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <span className="accent-bar" />
        <FaLeaf className={styles.accentLeaf} />
        <span className="accent-bar" style={{ transformOrigin: 'right center' }} />
      </motion.div>

      <motion.p {...sectionHeaderVariants.description}>{description}</motion.p>
    </div>
  );
}
