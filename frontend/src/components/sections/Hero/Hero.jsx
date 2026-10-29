import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf, FaSeedling, FaArrowRight, FaBookOpen, FaBowlFood, FaComments, FaEarthAmericas } from 'react-icons/fa6';
import { useMousePosition } from '../../../hooks';
import { ROUTES } from '../../../constants/routes';
import { IMG } from '../../../constants/images';
import { Butterflies, FloatingBirds, Fireflies } from '../../ambient';
import { recipes } from '../../../data/recipes';
import { blogs } from '../../../data/blogs';
import PosterWall from './PosterWall';
import styles from './Hero.module.css';

const QUICK = [
  { icon: <FaBookOpen />, label: 'Learn', to: ROUTES.getStarted },
  { icon: <FaBowlFood />, label: 'Cook', to: ROUTES.recipes },
  { icon: <FaComments />, label: 'Connect', to: ROUTES.community },
];

// Headline numbers come straight from the data so they can never drift from it.
const STATS = [
  { value: recipes.length, label: 'plant-based recipes' },
  { value: blogs.length, label: 'sourced articles' },
  { value: 7, label: 'free tools' },
];

/** Slap onto the wall: arrives big and tilted, then settles with a spring. */
const slap = (rot, delay) => ({
  initial: { opacity: 0, scale: 1.5, rotate: rot + 16, y: -40 },
  animate: { opacity: 1, scale: 1, rotate: rot, y: 0 },
  transition: { type: 'spring', stiffness: 240, damping: 14, delay },
});

const SLOGANS = ['Eat plants', 'No planet B', 'Grow kind', 'Share food', 'One meal at a time', 'Feel alive'];

const TICKER = ['Plants', 'Compassion', 'Planet', 'Community', 'Seasonal food', 'Everyday action'];

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: 'easeOut' },
});

export default function Hero() {
  const mouse = useMousePosition(35);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 80]);
  const archY = useTransform(scrollY, [0, 500], [0, -50]);
  const pillY = useTransform(scrollY, [0, 500], [0, -90]);

  return (
    <>
    <section className={styles.hero} id="hero">
      <div className={styles.aurora} aria-hidden="true" />

      {/* ambient nature layer */}
      <Butterflies count={4} />
      <FloatingBirds count={3} />
      <Fireflies count={8} />

      <motion.div className={`${styles.orb} ${styles.orbOrange}`} style={{ y: bgY }} aria-hidden="true" />
      <motion.div className={`${styles.orb} ${styles.orbLilac}`} style={{ y: bgY }} aria-hidden="true" />

      <div className={styles.grid}>
        {/* ————— message ————— */}
        <div className={styles.content}>
          <motion.span className={styles.tagline} {...slap(-1.6, 0.1)}>
            <i aria-hidden="true" /> A return to earth
          </motion.span>

          <h1 className={styles.title} aria-label="It's Natural">
            {['It’s', 'Natural'].map((word, i) => (
              <motion.span
                key={word}
                className={`${styles.titleWord} ${i === 1 ? styles.accent : ''}`}
                initial={{ opacity: 0, y: 70, rotateX: 90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.16, ease: 'easeOut' }}
                aria-hidden="true"
              >
                {word}
                {i === 1 && (
                  <svg className={styles.swoosh} viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="hero-swoosh" x1="0" x2="1">
                        <stop offset="0" stopColor="#a6b48f" />
                        <stop offset="0.55" stopColor="#e3a36e" />
                        <stop offset="1" stopColor="#9d82ab" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M4 11 C60 2, 120 16, 180 8 S270 6, 296 10"
                      fill="none"
                      stroke="url(#hero-swoosh)"
                      strokeWidth="7"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.1, delay: 1, ease: 'easeInOut' }}
                    />
                  </svg>
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p className={styles.subtitle} {...rise(0.55)}>
            Promoting sustainable living and conscious food choices for a healthier, more balanced planet.
          </motion.p>

          <motion.div className={styles.actions} {...rise(0.7)}>
            <a href="#why-vegan" className="btn btn-primary">
              Explore <FaArrowRight aria-hidden="true" />
            </a>
            <a href="#impact" className={`btn btn-secondary ${styles.btnGhost}`}>Learn more</a>
          </motion.div>

          <motion.nav className={styles.quick} aria-label="Start here" {...rise(0.85)}>
            <span>Start here</span>
            {QUICK.map((q) => (
              <Link key={q.label} to={q.to}>
                {q.icon} {q.label}
              </Link>
            ))}
          </motion.nav>

          <motion.dl className={styles.stats} {...rise(1)}>
            {STATS.map((st) => (
              <div key={st.label}>
                <dt>{st.label}</dt>
                <dd>{st.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ————— living collage ————— */}
        <motion.div
          className={styles.collage}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        >
          {/* brick wall behind the photos */}
          <div className={styles.wallPanel} aria-hidden="true" />

          <motion.figure
            className={styles.arch}
            style={{ y: archY, x: mouse.x * -0.4 }}
          >
            <img
              src={IMG.bPlantProtein}
              alt="A colourful plant-based bowl with avocado, chickpeas and sweet potato"
              fetchpriority="high"
            />
          </motion.figure>

          <motion.figure className={styles.circle} style={{ x: mouse.x * 0.5, y: mouse.y * 0.5 }}>
            <img src={IMG.rChickpeaQuinoaBowl} alt="A chickpea and quinoa bowl" />
          </motion.figure>

          <motion.figure className={styles.pill} style={{ y: pillY, x: mouse.x * 0.3 }}>
            <img src={IMG.gHostelMeals} alt="A vegetable and quinoa plate" loading="lazy" />
          </motion.figure>

          {/* ---------- pasted posters and stickers ---------- */}
          <motion.div className={`${styles.pasted} ${styles.posterA}`} {...slap(-7, 1.0)}>
            <span className={styles.tape} aria-hidden="true" />
            <span className={styles.posterKicker}>Notice</span>
            <strong>Eat plants.</strong>
            <strong className={styles.alt}>Feel alive.</strong>
          </motion.div>

          <motion.div className={`${styles.pasted} ${styles.posterB}`} {...slap(5, 1.25)}>
            <span className={`${styles.tape} ${styles.tapeCorner}`} aria-hidden="true" />
            <FaEarthAmericas aria-hidden="true" />
            <strong>No planet B</strong>
          </motion.div>

          <motion.div className={styles.sticker} {...slap(-12, 1.5)} aria-hidden="true">
            <span>Grown</span>
            <strong>not made</strong>
          </motion.div>

          {/* turning stamp */}
          <div className={styles.stamp} aria-hidden="true">
            <svg viewBox="0 0 120 120" className={styles.stampRing}>
              <defs>
                <path id="hero-stamp-path" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <text>
                <textPath href="#hero-stamp-path" textLength="270" lengthAdjust="spacing">
                  FRESH • SEASONAL • KIND •
                </textPath>
              </text>
            </svg>
            <FaLeaf className={styles.stampLeaf} />
          </div>

          <motion.div
            className={`${styles.glass} ${styles.glassA}`}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FaSeedling aria-hidden="true" />
            <span><strong>Plant-based</strong> recipes &amp; guides</span>
          </motion.div>

          <motion.div
            className={`${styles.glass} ${styles.glassB}`}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FaLeaf aria-hidden="true" />
            <span><strong>Student-friendly</strong> and budget-aware</span>
          </motion.div>
        </motion.div>
      </div>

      {/* two crossing ribbons riding on the wave: slogans behind, words in front */}
      <div className={styles.ribbons} aria-hidden="true">
        <div className={styles.ribbonBack}>
          <div className={`${styles.track} ${styles.trackRev}`}>
            {[0, 1].map((dup) => (
              <ul key={dup}>
                {SLOGANS.map((t) => (
                  <li key={t}>{t}<i>✦</i></li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className={styles.ribbon}>
          <div className={styles.track}>
            {[0, 1].map((dup) => (
              <ul key={dup}>
                {TICKER.map((t) => (
                  <li key={t}>{t}<FaLeaf /></li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.mountains} aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={styles.mountainBack}>
          <path d="M0,0 C150,90 350,10 600,70 C850,130 1050,40 1200,10 L1200,120 L0,120 Z" />
        </svg>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={styles.mountainFront}>
          <path d="M0,40 C200,110 450,10 700,80 C950,150 1100,50 1200,30 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>

    <PosterWall />
    </>
  );
}
