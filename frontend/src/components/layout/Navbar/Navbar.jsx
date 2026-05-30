import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa6';
import { useScrollPosition } from '../../../hooks';
import { NAV_LINKS } from '../../../constants';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = useScrollPosition(40);

  return (
    <>
      <motion.nav
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <a href="#" className={styles.brand}>
          <FaLeaf className={styles.brandIcon} />
          <span>Green Earth</span>
        </a>

        <div className={styles.desktopMenu}>
          {NAV_LINKS.map((link) => (
            <a key={link.name} href={link.href} className={styles.navLink}>
              {link.name}
            </a>
          ))}
          <a href="#challenge" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Join Challenge
          </a>
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className={styles.drawer}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.drawerHeader}>
                <a href="#" className={styles.brand} onClick={() => setIsOpen(false)}>
                  <FaLeaf className={styles.brandIcon} />
                  <span>Green Earth</span>
                </a>
                <button
                  className={styles.drawerClose}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <FiX />
                </button>
              </div>

              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={styles.drawerLink}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#challenge"
                className="btn btn-primary"
                style={{ marginTop: '20px', padding: '14px 24px' }}
                onClick={() => setIsOpen(false)}
              >
                Join Challenge
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
