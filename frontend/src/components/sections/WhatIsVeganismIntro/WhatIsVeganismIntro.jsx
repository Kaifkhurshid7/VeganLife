import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaCodeBranch, FaRoute, FaArrowRight } from 'react-icons/fa6';
import { ROUTES } from '../../../constants/routes';
import { IMG } from '../../../constants/images';
import styles from './WhatIsVeganismIntro.module.css';

// The answers here mirror HOME_FAQ in pages/Home.jsx, because FAQPage structured
// data must only describe content that is visible on the page.
const POINTS = [
  {
    icon: <FaCodeBranch />,
    title: 'Vegan or vegetarian?',
    body: 'Vegetarian diets exclude meat and fish but often include dairy and eggs. A vegan diet excludes all animal-derived foods, and veganism commonly extends to clothing and household products.',
  },
  {
    icon: <FaRoute />,
    title: 'Do I have to go vegan all at once?',
    body: 'No. Many people move gradually, swapping a few meals a week and building up as they find foods they enjoy. There is no single correct pace, and partial changes still count.',
  },
];

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
        {/* ————— visual collage ————— */}
        <motion.div className={styles.visual} {...fadeUp(0)}>
          <div className={styles.mainImg}>
            <img src={IMG.bVeganMyths} alt="A colourful plant-based meal with fresh vegetables" loading="lazy" />
          </div>
          <div className={styles.smallImg}>
            <img src={IMG.rChickpeaQuinoaBowl} alt="A chickpea and quinoa bowl" loading="lazy" />
          </div>
          <motion.div
            className={styles.floatCard}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className={styles.floatNumber}>1944</span>
            <span className={styles.floatText}>The year the word “vegan” was coined</span>
          </motion.div>
          <span className={styles.blob} aria-hidden="true" />
        </motion.div>

        {/* ————— copy ————— */}
        <div className={styles.copy}>
          <motion.span className="eyebrow" {...fadeUp(0.05)}>Start here</motion.span>
          <motion.h2 id="what-is-veganism-heading" className={styles.heading} {...fadeUp(0.1)}>
            What is veganism?
          </motion.h2>

          <motion.p className={styles.definition} {...fadeUp(0.15)}>
            <FaLeaf className={styles.defIcon} aria-hidden="true" />
            A way of living that seeks to avoid, as far as is practicable, the use of animals for food,
            clothing and other purposes. In everyday terms that usually means eating plants rather than
            meat, fish, dairy, eggs and honey.
          </motion.p>

          <ul className={styles.points}>
            {POINTS.map((point, i) => (
              <motion.li key={point.title} className={styles.point} {...fadeUp(0.2 + i * 0.1)}>
                <span className={styles.pointIcon} aria-hidden="true">{point.icon}</span>
                <div>
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
