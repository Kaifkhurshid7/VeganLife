import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookmark, FaClock, FaTag, FaCheckCircle } from 'react-icons/fa';
import { SectionHeader } from '../../ui';
import { nutritionCategories, studentVeganDiet } from '../../../data/nutrition';
import styles from './Nutrition.module.css';

const TAB_COLORS = {
  protein: 'var(--color-sage)',
  iron: 'var(--color-orange)',
  calcium: 'var(--color-purple)',
  b12: 'var(--color-earth)',
  fats: 'var(--color-earth)',
};

export default function Nutrition() {
  const [activeTab, setActiveTab] = useState('protein');
  const selectedCategory = nutritionCategories.find((cat) => cat.id === activeTab) || nutritionCategories[0];

  return (
    <section id="nutrition" style={{ backgroundColor: 'var(--color-bg)' }}>
      <SectionHeader
        label="Clean Energy"
        title="Nutrition Guide"
        description="Unlock absolute physical vitality with vibrant, fiber-dense, and highly bioavailable plant foods."
      />

      <div className={styles.layout}>
        <div className={styles.dashboard}>
          <div className={styles.tabs}>
            {nutritionCategories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.tabBtn} ${activeTab === cat.id ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="glass-card"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className={styles.panelTitle}>{selectedCategory.name}</h3>
              <p className={styles.panelDesc}>{selectedCategory.desc}</p>

              <div className={styles.progressList}>
                {selectedCategory.items.map((item, idx) => (
                  <div key={item.food} className={styles.progressItem}>
                    <div className={styles.progressLabel}>
                      <span>{item.food}</span>
                      <span className={styles.progressQuantity}>{item.quantity}</span>
                    </div>
                    <div className={styles.progressTrack}>
                      <motion.div
                        className={styles.progressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.pct, 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                        style={{ backgroundColor: TAB_COLORS[activeTab] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className={`glass-card ${styles.dietCard}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.dietHeader}>
            <div className={styles.dietBadge}>
              <FaBookmark style={{ color: 'var(--color-orange)' }} />
              <span>Featured Routine</span>
            </div>
            <h3 className={styles.dietTitle}>{studentVeganDiet.title}</h3>
            <div className={styles.dietMeta}>
              <span className={styles.metaTag}><FaTag /> {studentVeganDiet.calories}</span>
              <span className={styles.metaTag}><FaClock /> {studentVeganDiet.cost}</span>
            </div>
          </div>

          <div className={styles.highlights}>
            {studentVeganDiet.highlights.map((h) => (
              <div key={h} className={styles.highlightItem}>
                <FaCheckCircle style={{ color: 'var(--color-sage)', flexShrink: 0 }} />
                <span>{h}</span>
              </div>
            ))}
          </div>

          <hr className={styles.separator} />

          <div className={styles.schedule}>
            {studentVeganDiet.schedule.map((item) => (
              <div key={item.meal} className={styles.scheduleItem}>
                <div className={styles.scheduleHeader}>
                  <span className={styles.mealLabel}>{item.meal}</span>
                  <span className={styles.prepTime}>Prep: {item.prep}</span>
                </div>
                <h4 className={styles.mealTitle}>{item.title}</h4>
                <p className={styles.mealDetails}>{item.details}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
