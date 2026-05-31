import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiCompass } from 'react-icons/fi';
import { FaLeaf, FaSeedling } from 'react-icons/fa6';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Floating decorative leaves */}
        <motion.div className={styles.floatLeaf1} animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity }}>
          <FaLeaf />
        </motion.div>
        <motion.div className={styles.floatLeaf2} animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity }}>
          <FaSeedling />
        </motion.div>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.code}>404</h1>
          <h2 className={styles.title}>Page Not Found</h2>
          <p className={styles.desc}>
            This path doesn't lead anywhere in our garden. Let's get you back to familiar ground.
          </p>

          <div className={styles.actions}>
            <Link to="/" className={styles.primaryBtn}><FiHome /> Back to Home</Link>
            <Link to="/community" className={styles.secondaryBtn}><FiCompass /> Community</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
