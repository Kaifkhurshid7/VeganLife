import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa6';
import { ROUTES } from '../../../constants/routes';
import { IMG } from '../../../constants/images';
import styles from './WhatIsVeganismIntro.module.css';

// The answers here mirror HOME_FAQ in pages/Home.jsx, because FAQPage structured
// data must only describe content that is visible on the page. Both stay on
// screen at all times (no tabs/accordion) for the same reason.
const POINTS = [
  {
    title: 'Vegan or vegetarian?',
    body: 'Vegetarian diets exclude meat and fish but often include dairy and eggs. A vegan diet excludes all animal-derived foods, and veganism commonly extends to clothing and household products.',
  },
  {
    title: 'Do I have to go vegan all at once?',
    body: 'No. Many people move gradually, swapping a few meals a week and building up as they find foods they enjoy. There is no single correct pace, and partial changes still count.',
  },
];

const RING_TEXT = 'PLANTS • COMPASSION • PLANET • ';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
});

export default function WhatIsVeganismIntro() {
  return (
    <section className={styles.section} aria-labelledby="what-is-veganism-heading">
      <div className={styles.inner}>
        {/* ————— the plate ————— */}
        <motion.div
          className={styles.plateWrap}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          {/* slowly turning text ring */}
          <svg className={styles.ring} viewBox="0 0 400 400" aria-hidden="true">
            <defs>
              <path id="plate-ring-path" d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0" />
            </defs>
            <text className={styles.ringText}>
              <textPath href="#plate-ring-path" textLength="1105" lengthAdjust="spacing">
                {RING_TEXT.repeat(2)}
              </textPath>
            </text>
          </svg>

          <div className={styles.plate}>
            <div className={styles.plateInner}>
              <img src={IMG.bVeganMyths} alt="A colourful plant-based meal with fresh vegetables" loading="lazy" />
            </div>
          </div>

          <div className={styles.side}>
            <img src={IMG.rChickpeaQuinoaBowl} alt="A chickpea and quinoa bowl" loading="lazy" />
          </div>

          <motion.div
            className={styles.seal}
            animate={{ rotate: [-6, 4, -6] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className={styles.sealLabel}>Coined</span>
            <span className={styles.sealYear}>1944</span>
            <span className={styles.sealText}>the word “vegan”</span>
          </motion.div>
        </motion.div>

        {/* ————— the entry ————— */}
        <div className={styles.copy}>
          <motion.span className="eyebrow" {...fadeUp(0.05)}>Start here</motion.span>
          <motion.h2 id="what-is-veganism-heading" className={styles.heading} {...fadeUp(0.1)}>
            What is veganism?
          </motion.h2>

          <motion.article className={styles.entry} {...fadeUp(0.15)}>
            <header className={styles.entryHead}>
              <span className={styles.word}>vegan</span>
              <span className={styles.phonetic}>/ˈviːɡən/</span>
              <span className={styles.pos}>noun · adjective</span>
            </header>
            <p className={styles.definition}>
              <span className={styles.defNo}>1.</span>
              A way of living that seeks to avoid, as far as is practicable, the use of animals for food,
              clothing and other purposes. In everyday terms that usually means eating plants rather than
              meat, fish, dairy, eggs and honey.
            </p>
            <footer className={styles.etymology}>
              Word coined in 1944 · short for <em>non-dairy vegetarian</em>
            </footer>
          </motion.article>

          <ul className={styles.points}>
            {POINTS.map((point, i) => (
              <motion.li key={point.title} className={styles.ticket} {...fadeUp(0.2 + i * 0.1)}>
                <span className={styles.stub} aria-hidden="true">
                  <small>Q</small>
                  {i + 1}
                </span>
                <div className={styles.ticketBody}>
                  <h3>{point.title}</h3>
                  <p>{point.body}</p>
                </div>
              </motion.li>
            ))}
          </ul>

          <motion.div className={styles.actions} {...fadeUp(0.4)}>
            <Link to={ROUTES.whatIsVeganism} className="btn btn-primary">
              Read the full guide <FaArrowRight aria-hidden="true" />
            </Link>
            <Link to={ROUTES.getStarted} className="btn btn-outline">Get started</Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
