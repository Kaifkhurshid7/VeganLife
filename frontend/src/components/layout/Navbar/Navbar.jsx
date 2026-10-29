import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiChevronDown, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa6';
import { useScrollPosition } from '../../../hooks';
import { PRIMARY_NAV } from '../../../constants/navigation';
import { ROUTES } from '../../../constants/routes';
import { SITE } from '../../../constants/site';
import { useAuth } from '../../../context/AuthContext';
import { useChat } from '../../../context/ChatContext';
import styles from './Navbar.module.css';

/**
 * A nav group that opens on hover *and* on click/keyboard.
 *
 * The previous version opened only on `onMouseEnter` of a plain <div>, so the
 * Explore menu was unreachable by keyboard and invisible to screen readers.
 * Now the trigger is a real button with aria-expanded/aria-controls, the panel
 * closes on Escape and on focus leaving the group, and hover is a convenience
 * layer on top rather than the only way in.
 */
function NavDropdown({ item, isActive }) {
  const [open, setOpen] = useState(false);
  const groupRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = `nav-panel-${item.name.toLowerCase().replace(/\s+/g, '-')}`;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };
    // Any click outside the group dismisses it, matching normal menu behaviour.
    const onPointerDown = (e) => {
      if (!groupRef.current?.contains(e.target)) close();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  return (
    <div
      className={styles.dropdown}
      ref={groupRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      // Tabbing out of the last item should close the panel.
      onBlur={(e) => {
        if (!groupRef.current?.contains(e.relatedTarget)) close();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.dropdownTrigger} ${isActive ? styles.navLinkActive : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {item.name}
        <FiChevronDown className={open ? styles.chevronOpen : undefined} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            className={styles.dropdownMenu}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <ul className={styles.dropdownList}>
              {item.children.map((child) => (
                <li key={child.href}>
                  <Link to={child.href} className={styles.dropdownItem} onClick={close}>
                    <span className={styles.dropdownItemName}>{child.name}</span>
                    {child.desc && <span className={styles.dropdownItemDesc}>{child.desc}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = useScrollPosition(40);
  const { user, logout, isAdmin } = useAuth();
  const { totalUnread } = useChat();
  const { pathname } = useLocation();
  const drawerRef = useRef(null);
  const toggleRef = useRef(null);

  const closeDrawer = useCallback(() => setIsOpen(false), []);

  // Close the drawer whenever the route changes — otherwise it stays open over
  // the new page after tapping a link.
  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  // Drawer is a modal surface: lock the page, trap focus, close on Escape,
  // and return focus to the toggle that opened it.
  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = drawerRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    // Focus the panel itself rather than its first link, so screen readers
    // announce the dialog before its contents.
    drawerRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
      else toggleRef.current?.focus();
    };
  }, [isOpen, closeDrawer]);

  /** True when the current URL sits inside a nav group, for aria-current styling. */
  const isGroupActive = (item) => {
    if (item.children) return item.children.some((c) => pathname.startsWith(c.href));
    return pathname === item.href;
  };

  const unreadLabel = totalUnread > 9 ? '9+' : String(totalUnread);

  return (
    <>
      <motion.nav
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        aria-label="Main navigation"
      >
        <Link to={ROUTES.home} className={styles.brand}>
          <FaLeaf className={styles.brandIcon} aria-hidden="true" />
          <span>{SITE.name}</span>
        </Link>

        <div className={styles.desktopMenu}>
          {PRIMARY_NAV.map((item) =>
            item.children ? (
              <NavDropdown key={item.name} item={item} isActive={isGroupActive(item)} />
            ) : (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {item.name}
              </NavLink>
            )
          )}

          {/* Unread chat count, announced rather than left as a bare number. */}
          {totalUnread > 0 && (
            <Link to={ROUTES.chat} className={styles.navLink}>
              Chat
              <span className={styles.unreadBadge}>
                {unreadLabel}
                <span className="sr-only"> unread messages</span>
              </span>
            </Link>
          )}

          {user ? (
            <div className={styles.userSection}>
              <Link to={`/profile/${user.username}`} className={styles.userBadge}>
                <span className={styles.userAvatar} aria-hidden="true">{user.name.charAt(0)}</span>
                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
              </Link>
              {isAdmin && <Link to={ROUTES.admin} className={styles.adminLink}>Admin</Link>}
              <Link to={ROUTES.editProfile} className={styles.logoutBtn} aria-label="Edit profile">
                <FiSettings aria-hidden="true" />
              </Link>
              <button type="button" className={styles.logoutBtn} onClick={logout} aria-label="Log out">
                <FiLogOut aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Link to={ROUTES.auth} className={`btn btn-primary ${styles.loginBtn}`}>
              <FiUser aria-hidden="true" /> Log in
            </Link>
          )}
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={styles.mobileToggle}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
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
            onClick={closeDrawer}
          >
            <motion.div
              id="mobile-nav-drawer"
              ref={drawerRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className={styles.drawer}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.drawerHeader}>
                <Link to={ROUTES.home} className={styles.brand} onClick={closeDrawer}>
                  <FaLeaf className={styles.brandIcon} aria-hidden="true" />
                  <span>{SITE.name}</span>
                </Link>
                <button type="button" className={styles.drawerClose} onClick={closeDrawer} aria-label="Close menu">
                  <FiX aria-hidden="true" />
                </button>
              </div>

              {user ? (
                <div className={styles.drawerUser}>
                  <div className={styles.drawerAvatar} aria-hidden="true">{user.name.charAt(0)}</div>
                  <div>
                    <span className={styles.drawerUserName}>{user.name}</span>
                    <span className={styles.drawerUserRole}>{isAdmin ? 'Admin' : 'Member'}</span>
                  </div>
                </div>
              ) : (
                <Link to={ROUTES.auth} className={`btn btn-primary ${styles.drawerAuthBtn}`} onClick={closeDrawer}>
                  <FiUser aria-hidden="true" /> Log in / Sign up
                </Link>
              )}

              {/*
                The drawer mirrors the desktop groups as plain labelled lists.
                Nested accordions would add taps without adding clarity on a
                menu this size.
              */}
              <nav aria-label="Site sections">
                {PRIMARY_NAV.map((item) => (
                  <div key={item.name} className={styles.drawerGroup}>
                    <span className={styles.drawerSection} id={`drawer-group-${item.name}`}>
                      {item.name}
                    </span>
                    <ul className={styles.drawerList} aria-labelledby={`drawer-group-${item.name}`}>
                      {(item.children ?? [item]).map((child) => (
                        <li key={child.href}>
                          <NavLink
                            to={child.href}
                            className={({ isActive }) =>
                              `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ''}`
                            }
                            onClick={closeDrawer}
                          >
                            {child.name}
                            {child.href === ROUTES.chat && totalUnread > 0 && (
                              <span className={styles.unreadBadge}>
                                {unreadLabel}
                                <span className="sr-only"> unread messages</span>
                              </span>
                            )}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>

              {user && (
                <div className={styles.drawerGroup}>
                  <span className={styles.drawerSection} id="drawer-group-account">Account</span>
                  <ul className={styles.drawerList} aria-labelledby="drawer-group-account">
                    <li>
                      <Link to={`/profile/${user.username}`} className={styles.drawerLink} onClick={closeDrawer}>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link to={ROUTES.editProfile} className={styles.drawerLink} onClick={closeDrawer}>
                        Edit Profile
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link to={ROUTES.admin} className={styles.drawerLink} onClick={closeDrawer}>
                          Admin Panel
                        </Link>
                      </li>
                    )}
                  </ul>
                  <button
                    type="button"
                    className={styles.drawerLogout}
                    onClick={() => {
                      logout();
                      closeDrawer();
                    }}
                  >
                    <FiLogOut aria-hidden="true" /> Log out
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
