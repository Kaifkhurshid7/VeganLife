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
  const diet = studentVeganDiet;

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
                      <span className={styles.progressQuantity}>{item.quantity || item.protein || item.cost || ''}</span>
                    </div>
                    <div className={styles.progressTrack}>
                      <motion.div
                        className={styles.progressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.pct || 60, 100)}%` }}
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
              <span>Student Routine</span>
            </div>
            <h3 className={styles.dietTitle}>{diet.title}</h3>
            <div className={styles.dietMeta}>
              <span className={styles.metaTag}><FaTag /> {diet.macros.calories}</span>
              <span className={styles.metaTag}><FaClock /> {diet.costEstimates.perDay}</span>
            </div>
          </div>

          <div className={styles.highlights}>
            <div className={styles.highlightItem}><FaCheckCircle style={{ color: 'var(--color-sage)', flexShrink: 0 }} /><span>Balanced macros for study performance</span></div>
            <div className={styles.highlightItem}><FaCheckCircle style={{ color: 'var(--color-sage)', flexShrink: 0 }} /><span>Budget-friendly weekly plans</span></div>
            <div className={styles.highlightItem}><FaCheckCircle style={{ color: 'var(--color-sage)', flexShrink: 0 }} /><span>Fortified B12 recommended</span></div>
          </div>

          <hr className={styles.separator} />

          <div className={styles.schedule}>
            {diet.timeline.map((item) => (
              <div key={item.section} className={styles.scheduleItem}>
                <div className={styles.scheduleHeader}>
                  <span className={styles.mealLabel}>{item.section}</span>
                  <span className={styles.prepTime}>Prep: {item.prep}</span>
                </div>
                <h4 className={styles.mealTitle}>{item.meal}</h4>
                <p className={styles.mealDetails}>{item.description}</p>
                <div className={styles.mealMeta}>
                  <span>{item.calories} • {item.protein} protein • {item.price} </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
