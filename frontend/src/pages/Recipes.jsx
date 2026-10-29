import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';
import LearnLayout from './LearnLayout';
import { recipes } from '../data/recipes';
import { ROUTES, buildPath } from '../constants/routes';
import styles from './Listing.module.css';

const TONES = {
  Breakfast: '#f0c987',
  Lunch: '#a6b48f',
  Dinner: '#c9b3dd',
  Snack: '#e3a36e',
  Snacks: '#e3a36e',
  Dessert: '#e6a8a0',
  Drinks: '#9fc3cf',
};

const LEVELS = { Easy: 1, Medium: 2, Hard: 3 };

function Dots({ level }) {
  const n = LEVELS[level] ?? 1;
  return (
    <span className={styles.dots} aria-hidden="true">
      {[1, 2, 3].map((i) => <i key={i} className={i <= n ? 'on' : ''} />)}
    </span>
  );
}

export default function Recipes() {
  const categories = useMemo(() => ['All', ...new Set(recipes.map((r) => r.category))], []);
  const [active, setActive] = useState('All');
  const visible = active === 'All' ? recipes : recipes.filter((r) => r.category === active);
  const count = (c) => (c === 'All' ? recipes.length : recipes.filter((r) => r.category === c).length);

  return (
    <LearnLayout
      seoTitle="Vegan Recipes: Budget-Friendly and High-Protein"
      description="Simple plant-based recipes with calories, protein and prep time, designed for students and busy weeknights."
      path={ROUTES.recipes}
      crumb="Recipes"
      eyebrow="Cook"
      title="Vegan recipes"
      ring="COOK • SHARE • ENJOY • "
      lead={
        <>
          Budget-friendly, protein-aware meals with <mark>the nutrition listed up front</mark>, so you know
          what is on the plate before you start cooking.
        </>
      }
      images={{
        main: { src: recipes[0]?.image, alt: recipes[0]?.title ?? '' },
        small: recipes[1]?.image ? { src: recipes[1].image, alt: recipes[1].title } : undefined,
      }}
      chip={{ big: recipes.length, text: 'tested everyday recipes' }}
      facts={[
        { label: 'Recipes', value: `${recipes.length} to cook` },
        { label: 'Meal types', value: `${categories.length - 1} categories` },
        { label: 'Listed up front', value: 'Time, calories, protein' },
        { label: 'Made for', value: 'Students and busy weeknights' },
      ]}
    >
      <div className={styles.shelf} role="group" aria-label="Filter by meal type">
        <span className={styles.shelfLabel}>Meal</span>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            className={`${styles.chip} ${active === c ? styles.chipOn : ''}`}
            onClick={() => setActive(c)}
          >
            {c} <small>{count(c)}</small>
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {visible.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
          >
            <Link to={buildPath.recipe(r.id)} className={styles.card} style={{ '--tone': TONES[r.category] }}>
              <div className={styles.media}>
                {r.image && <img src={r.image} alt="" loading="lazy" />}
                <span className={styles.ribbon}>{r.category}</span>
                {r.time && (
                  <span className={styles.timeBadge}>
                    <FiClock aria-hidden="true" /> {r.time}
                  </span>
                )}
              </div>
              <div className={styles.cardBody}>
                <h2>{r.title}</h2>
                <p>{r.desc}</p>
                <dl className={styles.stats}>
                  <div><dt>Energy</dt><dd>{r.calories}</dd></div>
                  <div><dt>Protein</dt><dd>{r.protein}</dd></div>
                  <div>
                    <dt>Level</dt>
                    <dd>{r.difficulty}</dd>
                    <Dots level={r.difficulty} />
                  </div>
                </dl>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </LearnLayout>
  );
}
