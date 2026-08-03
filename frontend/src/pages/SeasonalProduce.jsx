import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/ui/BackButton';
import { ReferenceList } from '../components/ui';
import { seasonalProduceGuide } from '../data/nutrition';
import styles from './SeasonalProduce.module.css';

const SEASON_ORDER = ['summer', 'monsoon', 'winter'];
const SEASON_LABEL = { summer: 'Summer', monsoon: 'Monsoon', winter: 'Winter' };

// month index (0 = Jan) -> season key, matching the dataset's date ranges
const seasonOf = (m) => {
  if (m >= 2 && m <= 5) return 'summer';
  if (m >= 6 && m <= 8) return 'monsoon';
  return 'winter';
};

const CATEGORY_COLORS = {
  fruits: 'var(--color-orange)',
  vegetables: 'var(--color-sage)',
  grains: 'var(--color-purple)',
  tips: 'var(--color-earth)',
  recipes: 'var(--color-orange)',
};

export default function SeasonalProduce() {
  const [activeSeason, setActiveSeason] = useState(seasonOf(new Date().getMonth()));
  const season = seasonalProduceGuide[activeSeason];
  if (!season) return null;
  const data = season;

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className={styles.label}>Eat With the Seasons</span>
          <h1 className={styles.title}>Seasonal Produce Calendar</h1>
          <p className={styles.subtitle}>Discover what's fresh, local, and at peak nutrition in each Indian season.</p>
        </motion.div>

        {data.image && (
          <motion.div
            className={styles.hero}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img src={data.image} alt={data.season} className={styles.heroImg} loading="lazy" />
            <span className={styles.heroLabel}>{data.season}</span>
          </motion.div>
        )}

        <div className={styles.monthGrid}>
          {SEASON_ORDER.map((key, idx) => (
            <motion.button
              key={key}
              className={`${styles.monthBtn} ${activeSeason === key ? styles.monthBtnActive : ''}`}
              onClick={() => setActiveSeason(key)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
            >
              {SEASON_LABEL[key]}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSeason}
            className={styles.produceGrid}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {Object.entries(data).filter(([k]) => ['fruits', 'vegetables', 'grains', 'tips', 'recipes'].includes(k)).map(([category, items], idx) => (
              <motion.div
                key={category}
                className={`glass-card ${styles.categoryCard}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + idx * 0.1 }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
              >
                <h3 className={styles.categoryTitle} style={{ color: CATEGORY_COLORS[category] }}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <div className={styles.itemList}>
                  {items.map((item, iIdx) => (
                    <motion.span
                      key={item}
                      className={styles.item}
                      style={{ borderColor: CATEGORY_COLORS[category] }}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 + iIdx * 0.04 }}
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <ReferenceList refs={data.references} />
      </div>
    </section>
  );
}
