import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaEarthAmericas, FaArrowRight } from 'react-icons/fa6';
import { ROUTES } from '../../../constants/routes';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import styles from './PosterWall.module.css';

/*
  A brick wall with wheat-pasted posters. The slogans are values, not claims.
  The two poster-sized numbers are the only statistics, and each names its source
  (Poore & Nemecek, Science, 2018) and links to the page that explains it.
*/

/** One pasted sheet: slaps onto the wall when it scrolls into view. */
function Poster({ className = '', rot = 0, delay = 0, tape = 'top', children, style }) {
  const reduce = usePrefersReducedMotion();

  return (
    <motion.div
      className={`${styles.cell} ${className}`}
      style={{ '--rot': `${rot}deg`, ...style }}
      initial={reduce ? false : { opacity: 0, scale: 1.45, rotate: rot + 14, y: -50 }}
      whileInView={{ opacity: 1, scale: 1, rotate: rot, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 15, mass: 0.9, delay }}
    >
      <div className={styles.sheet}>
        {tape && <span className={`${styles.tape} ${styles[`tape_${tape}`]}`} aria-hidden="true" />}
        {children}
      </div>
    </motion.div>
  );
}

export default function PosterWall() {
  return (
    <section className={styles.wall} aria-labelledby="poster-wall-heading">
      {/* sprayed stencil behind everything */}
      <span className={styles.spray} aria-hidden="true">Grow kind</span>
      <h2 id="poster-wall-heading" className="sr-only">Slogans from the wall</h2>

      <div className={styles.board}>
        {/* ————— 1 · the big headline sheet ————— */}
        <Poster className={styles.p1} rot={-2.5} delay={0}>
          <p className={styles.notice}>Notice</p>
          <p className={styles.bigLine}>Eat plants.</p>
          <p className={`${styles.bigLine} ${styles.bigLineAlt}`}>Feel alive.</p>
          <FaLeaf className={styles.bigLeaf} aria-hidden="true" />
          <span className={styles.sticker} aria-hidden="true">
            <span>Grown</span>
            <strong>not made</strong>
          </span>
        </Poster>

        {/* ————— 2 · stencil ————— */}
        <Poster className={styles.p2} rot={2.2} delay={0.12} tape="corner">
          <FaEarthAmericas className={styles.globe} aria-hidden="true" />
          <p className={styles.stencil}>There is no planet B</p>
        </Poster>

        {/* ————— 3 · the poster-sized fact ————— */}
        <Poster className={styles.p3} rot={-1.4} delay={0.24} tape="both">
          <p className={styles.newsKicker}>Fact check</p>
          <p className={styles.newsNum}>~26%</p>
          <p className={styles.newsText}>of global greenhouse gas emissions come from the food system.</p>
          <p className={styles.newsSource}>Poore &amp; Nemecek, Science, 2018</p>
          <Link to={ROUTES.whyVeganism} className={styles.newsLink}>
            See the numbers <FaArrowRight aria-hidden="true" />
          </Link>
        </Poster>

        {/* ————— 4 · script ————— */}
        <Poster className={styles.p4} rot={1.6} delay={0.36}>
          <p className={styles.script}>Kinder plates, brighter tomorrow.</p>
        </Poster>

        {/* ————— 5 · second fact ————— */}
        <Poster className={styles.p5} rot={-2} delay={0.48} tape="corner">
          <p className={styles.newsKicker}>Did you know</p>
          <p className={styles.newsNum}>76%</p>
          <p className={styles.newsText}>less farmland needed if the whole world ate plant-based.</p>
          <p className={styles.newsSource}>Poore &amp; Nemecek, 2018</p>
        </Poster>

        {/* ————— 6 · call to action ————— */}
        <Poster className={styles.p6} rot={2.4} delay={0.6}>
          <p className={styles.callKicker}>This week</p>
          <p className={styles.callLine}>Meatless Monday? Make it every day.</p>
          <Link to={ROUTES.getStarted} className={styles.callBtn}>
            Start here <FaArrowRight aria-hidden="true" />
          </Link>
        </Poster>

        {/* ————— 7 · tally ————— */}
        <Poster className={styles.p7} rot={-2.8} delay={0.72} tape="top">
          <p className={styles.tallyTitle}>One meal at a time</p>
          <p className={styles.tally} aria-hidden="true">
            <span>|||<i /></span>
            <span>|||<i /></span>
            <span>||</span>
          </p>
        </Poster>

        {/* ————— 8 · banner strip ————— */}
        <Poster className={styles.p8} rot={-0.6} delay={0.84} tape={null}>
          <p className={styles.strip}>
            Plant-powered <i aria-hidden="true">✦</i> Student-friendly <i aria-hidden="true">✦</i> Budget-aware
          </p>
        </Poster>
      </div>

      {/* torn edge into the next section */}
      <svg className={styles.edge} viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,60 L0,22 C80,40 140,8 230,26 S380,46 470,24 S620,4 710,28 S880,48 960,22 S1110,6 1200,26 L1200,60 Z" />
      </svg>
    </section>
  );
}
