import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa6';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Why Vegan', href: '#why-vegan' },
    { name: 'Impact', href: '#impact' },
    { name: 'Nutrition', href: '#nutrition' },
    { name: 'Recipes', href: '#recipes' },
    { name: 'Myths', href: '#myths' },
    { name: 'Challenge', href: '#challenge' },
    { name: 'Blogs', href: '#blogs' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: scrolled ? '15px 8%' : '25px 8%',
          backgroundColor: scrolled ? 'rgba(236, 224, 210, 0.75)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(87, 61, 33, 0.08)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Brand Logo */}
        <a 
          href="#" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            textDecoration: 'none', 
            fontSize: '1.8rem', 
            fontFamily: 'var(--font-headings)', 
            color: 'var(--color-earth)', 
            fontWeight: 700 
          }}
        >
          <FaLeaf style={{ color: 'var(--color-sage)', fontSize: '1.4rem' }} />
          <span>Green Earth</span>
        </a>

        {/* Desktop Links */}
        <div 
          style={{ 
            display: 'none', 
            alignItems: 'center', 
            gap: '35px' 
          }}
          className="desktop-menu"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                textDecoration: 'none',
                color: 'var(--color-earth)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                position: 'relative',
                padding: '4px 0',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.opacity = 0.7}
              onMouseLeave={(e) => e.target.style.opacity = 1}
            >
              {link.name}
            </a>
          ))}
          <a href="#challenge" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Join Challenge
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            background: 'none',
            border: 'none',
            color: 'var(--color-earth)',
            fontSize: '1.6rem',
            cursor: 'pointer',
            padding: '4px',
            zIndex: 1000
          }}
          className="mobile-toggle"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </motion.nav>

      {/* CSS overrides directly injected for desktop menu responsive toggling without Tailwind dependency */}
      <style>{`
        .desktop-menu {
          display: none !important;
        }
        .mobile-toggle {
          display: flex !important;
        }
        @media (min-width: 1024px) {
          .desktop-menu {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(58, 39, 19, 0.4)',
              backdropFilter: 'blur(10px)',
              zIndex: 998
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '80%',
                maxWidth: '360px',
                backgroundColor: 'var(--bg-color)',
                padding: '100px 40px 40px 40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    textDecoration: 'none',
                    color: 'var(--color-earth)',
                    fontFamily: 'var(--font-headings)',
                    fontSize: '1.6rem',
                    fontWeight: 500,
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(87,61,33,0.06)'
                  }}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#challenge" 
                onClick={() => setIsOpen(false)}
                className="btn btn-primary" 
                style={{ marginTop: '20px', padding: '14px 24px' }}
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
