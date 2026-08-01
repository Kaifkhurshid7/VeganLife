import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa6';
import { useMousePosition } from '../../../hooks';
import { Butterflies, FloatingBirds, Fireflies } from '../../ambient';
import styles from './Hero.module.css';

export default function Hero() {
  const containerRef = useRef(null);
  const mouse = useMousePosition(35);

  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 500], [0, 160]);
  const bgY = useTransform(scrollY, [0, 500], [0, 80]);
  const leafY = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section ref={containerRef} className={styles.hero} id="hero">
      {/* Aurora gradient overlay */}
      <div className={styles.aurora} aria-hidden="true" />

      {/* Ambient nature animations */}
      <Butterflies count={5} />
      <FloatingBirds count={4} />
      <Fireflies count={10} />

      <motion.div className={`${styles.orb} ${styles.orbOrange}`} style={{ y: bgY }} />
      <motion.div className={`${styles.orb} ${styles.orbGreen}`} style={{ y: bgY }} />

      <motion.svg
        viewBox="0 0 100 100"
        className={`${styles.leaf} ${styles.leafLeft} animate-float`}
        style={{ y: leafY, x: mouse.x * -0.5 }}
      >
        <path d="M50,0 C65,30 90,40 100,60 C90,80 75,90 50,100 C25,90 10,80 0,60 C10,40 35,30 50,0 Z" />
      </motion.svg>

      <motion.svg
        viewBox="0 0 100 100"
        className={`${styles.leaf} ${styles.leafRight} animate-float-slow`}
        style={{ y: leafY, x: mouse.x * 0.4 }}
      >
        <path d="M50,0 C65,35 90,45 100,65 C90,85 75,95 50,100 C25,95 10,85 0,65 C10,45 35,35 50,0 Z" />
      </motion.svg>

      {/* Drifting petals */}
      <motion.svg
        viewBox="0 0 24 24"
        className={`${styles.petal} ${styles.petalOne}`}
        animate={{ y: [0, -16, 0], rotate: [0, 24, -16, 0] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
      >
        <circle cx="12" cy="12" r="7" fill="#e3a36e" opacity="0.5" />
      </motion.svg>
      <motion.svg
        viewBox="0 0 24 24"
        className={`${styles.petal} ${styles.petalTwo}`}
        animate={{ y: [0, -20, 0], rotate: [0, -20, 18, 0] }}
        transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
      >
        <circle cx="12" cy="12" r="7" fill="#9d82ab" opacity="0.4" />
      </motion.svg>

      <motion.div
        className={`${styles.butterfly} animate-butterfly`}
        style={{ x: mouse.x * 0.8, y: mouse.y * 0.8 }}
      >
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M32 30C28 20 12 16 8 28C6 34 16 42 32 50C48 42 58 34 56 28C52 16 36 20 32 30Z" fill="#9d82ab" opacity="0.65" />
          <path d="M32 30C30 24 20 22 18 28C17 31 22 35 32 40C42 35 47 31 46 28C44 22 34 24 32 30Z" fill="#e3a36e" opacity="0.5" />
        </svg>
      </motion.div>

      <motion.div
        className={styles.content}
        style={{ x: mouse.x * 0.3, y: mouse.y * 0.3 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <span className={styles.tagline}>A Return To Earth</span>
        <motion.h1 className={styles.title} aria-label="It's Natural">
          {['It’s', 'Natural'].map((word, i) => (
            <motion.span
              key={i}
              className={styles.titleWord}
              initial={{ opacity: 0, y: 70, rotateX: 90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.9, delay: 0.25 + i * 0.16, ease: 'easeOut' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
        <p className={styles.subtitle}>
          Promoting sustainable living and conscious food choices for a healthier, more balanced planet.
        </p>
        <div className={styles.actions}>
          <a href="#why-vegan" className="btn btn-primary">Explore</a>
          <a href="#impact" className={`btn btn-secondary ${styles.btnLight}`}>Learn More</a>
        </div>
      </motion.div>

      <motion.div
        className={styles.mountains}
        animate={{ x: [0, -24, 0] }}
        transition={{ repeat: Infinity, duration: 24, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={styles.mountainBack}>
          <path d="M0,0 C150,90 350,10 600,70 C850,130 1050,40 1200,10 L1200,120 L0,120 Z" />
        </svg>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={styles.mountainFront}>
          <path d="M0,40 C200,110 450,10 700,80 C950,150 1100,50 1200,30 L1200,120 L0,120 Z" />
        </svg>
      </motion.div>

      <motion.a
        href="#why-vegan"
        className={styles.scrollCta}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      >
        <span>Scroll</span>
        <FaArrowDown />
      </motion.a>
    </section>
  );
}
