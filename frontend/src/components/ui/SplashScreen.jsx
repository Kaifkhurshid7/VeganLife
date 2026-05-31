import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa6';
import styles from './SplashScreen.module.css';

export default function SplashScreen() {
  return (
    <motion.div
      className={styles.splash}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={styles.content}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FaLeaf className={styles.icon} />
        </motion.div>
        <h1 className={styles.title}>Green Earth</h1>
        <div className={styles.loader}>
          <motion.div
            className={styles.loaderBar}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
