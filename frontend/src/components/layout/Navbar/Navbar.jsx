import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiChevronDown, FiUser, FiLogOut } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa6';
import { useScrollPosition } from '../../../hooks';
import { NAV_LINKS, EXPLORE_LINKS } from '../../../constants';
import { useAuth } from '../../../context/AuthContext';
import styles from './Navbar.module.css';

function NavLink({ href, className, onClick, children }) {
  if (href.startsWith('/') && !href.includes('#')) {
    return <Link to={href} className={className} onClick={onClick}>{children}</Link>;
  }
  return <a href={href} className={className} onClick={onClick}>{children}</a>;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const isScrolled = useScrollPosition(40);
  const { user, logout, isAdmin } = useAuth();

  return (
    <>
      <motion.nav
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Link to="/" className={styles.brand}>
          <FaLeaf className={styles.brandIcon} />
          <span>Green Earth</span>
        </Link>

        <div className={styles.desktopMenu}>
          {NAV_LINKS.map((link) => (
            <NavLink key={link.name} href={link.href} className={styles.navLink}>
              {link.name}
            </NavLink>
          ))}

          <div
            className={styles.dropdown}
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button className={styles.dropdownTrigger}>
              Explore <FiChevronDown />
            </button>
            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  className={styles.dropdownMenu}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  {EXPLORE_LINKS.map((link) => (
                    <Link key={link.name} to={link.href} className={styles.dropdownItem} onClick={() => setExploreOpen(false)}>
                      <span className={styles.dropdownItemName}>{link.name}</span>
                      <span className={styles.dropdownItemDesc}>{link.desc}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth section */}
          {user ? (
            <div className={styles.userSection}>
              <Link to="/community" className={styles.userBadge}>
                <span className={styles.userAvatar}>{user.name.charAt(0)}</span>
                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className={styles.adminLink}>Admin</Link>
              )}
              <button className={styles.logoutBtn} onClick={logout} aria-label="Logout">
                <FiLogOut />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
              <FiUser style={{ marginRight: '4px' }} /> Login
            </Link>
          )}
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </motion.nav>

      {/* Mobile drawer */}
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
                <Link to="/" className={styles.brand} onClick={() => setIsOpen(false)}>
                  <FaLeaf className={styles.brandIcon} />
                  <span>Green Earth</span>
                </Link>
                <button className={styles.drawerClose} onClick={() => setIsOpen(false)} aria-label="Close menu">
                  <FiX />
                </button>
              </div>

              {/* User info in drawer */}
              {user ? (
                <div className={styles.drawerUser}>
                  <div className={styles.drawerAvatar}>{user.name.charAt(0)}</div>
                  <div>
                    <span className={styles.drawerUserName}>{user.name}</span>
                    <span className={styles.drawerUserRole}>{isAdmin ? 'Admin' : 'Member'}</span>
                  </div>
                </div>
              ) : (
                <Link to="/auth" className={`btn btn-primary ${styles.drawerAuthBtn}`} onClick={() => setIsOpen(false)}>
                  <FiUser /> Login / Sign Up
                </Link>
              )}

              <span className={styles.drawerSection}>Sections</span>
              {NAV_LINKS.map((link) => (
                <NavLink key={link.name} href={link.href} className={styles.drawerLink} onClick={() => setIsOpen(false)}>
                  {link.name}
                </NavLink>
              ))}

              <span className={styles.drawerSection}>Explore</span>
              {EXPLORE_LINKS.map((link) => (
                <Link key={link.name} to={link.href} className={styles.drawerLink} onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>
              ))}

              {user && (
                <>
                  <span className={styles.drawerSection}>Account</span>
                  <Link to="/community" className={styles.drawerLink} onClick={() => setIsOpen(false)}>Community</Link>
                  {isAdmin && <Link to="/admin" className={styles.drawerLink} onClick={() => setIsOpen(false)}>Admin Panel</Link>}
                  <button className={styles.drawerLogout} onClick={() => { logout(); setIsOpen(false); }}>
                    <FiLogOut /> Logout
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
