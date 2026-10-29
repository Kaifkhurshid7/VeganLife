import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa6';
import { ROUTES } from '../../../constants/routes';
import styles from './JoinCommunity.module.css';

export default function JoinCommunity() {
  return (
    <section className={styles.section} aria-labelledby="join-heading">
      <motion.div
        className={styles.panel}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <FaLeaf className={styles.icon} aria-hidden="true" />
        <h2 id="join-heading">Join the conversation</h2>
        <p>
          Share recipes, ask questions and swap tips with people at every stage, from curious to
          long-time vegan.
        </p>
        <div className={styles.actions}>
          <Link to={ROUTES.community} className="btn btn-primary">Visit the community</Link>
          <Link to={ROUTES.auth} className="btn btn-outline">Create an account</Link>
        </div>
      </motion.div>
    </section>
  );
}
