import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDroplet, FaCloud, FaTree, FaSeedling } from 'react-icons/fa6';
import BackButton from '../components/ui/BackButton';
import styles from './SavingsCalculator.module.css';

const MEALS = [
  { id: 'lentil-curry', name: 'Lentil Curry + Rice', category: 'Dinner', co2Saved: 3.2, waterSaved: 1800, landSaved: 12 },
  { id: 'tofu-stirfry', name: 'Tofu Stir-Fry', category: 'Dinner', co2Saved: 2.8, waterSaved: 1500, landSaved: 10 },
  { id: 'chickpea-bowl', name: 'Chickpea Buddha Bowl', category: 'Lunch', co2Saved: 2.5, waterSaved: 1200, landSaved: 9 },
  { id: 'oatmeal', name: 'Oatmeal + Hemp Seeds', category: 'Breakfast', co2Saved: 1.4, waterSaved: 600, landSaved: 4 },
  { id: 'avocado-toast', name: 'Avocado Toast + Microgreens', category: 'Breakfast', co2Saved: 1.1, waterSaved: 450, landSaved: 3 },
  { id: 'bean-tacos', name: 'Black Bean Tacos', category: 'Dinner', co2Saved: 2.9, waterSaved: 1400, landSaved: 11 },
  { id: 'smoothie', name: 'Green Power Smoothie', category: 'Snack', co2Saved: 0.8, waterSaved: 350, landSaved: 2 },
  { id: 'hummus-wrap', name: 'Hummus & Veggie Wrap', category: 'Lunch', co2Saved: 1.9, waterSaved: 900, landSaved: 6 },
  { id: 'pasta-pesto', name: 'Pasta with Walnut Pesto', category: 'Dinner', co2Saved: 2.2, waterSaved: 1100, landSaved: 8 },
  { id: 'chia-pudding', name: 'Chia Pudding + Berries', category: 'Breakfast', co2Saved: 1.0, waterSaved: 400, landSaved: 3 },
];

const EQUIVALENTS = {
  co2: { unit: 'kg CO₂', icon: <FaCloud />, perUnit: 'That equals {x} km not driven in a car', factor: 6 },
  water: { unit: 'liters', icon: <FaDroplet />, perUnit: 'That equals {x} showers saved', factor: 80 },
  land: { unit: 'sq.ft', icon: <FaTree />, perUnit: 'That equals {x} sq.ft of forest protected', factor: 1 },
};

export default function SavingsCalculator() {
  const [selected, setSelected] = useState([]);
  const [period, setPeriod] = useState('day');

  const toggleMeal = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };

  const multiplier = period === 'day' ? 1 : period === 'week' ? 7 : 30;

  const totals = selected.reduce(
    (acc, id) => {
      const meal = MEALS.find((m) => m.id === id);
      if (!meal) return acc;
      return {
        co2: acc.co2 + meal.co2Saved,
        water: acc.water + meal.waterSaved,
        land: acc.land + meal.landSaved,
      };
    },
    { co2: 0, water: 0, land: 0 }
  );

  const scaled = {
    co2: (totals.co2 * multiplier).toFixed(1),
    water: Math.round(totals.water * multiplier),
    land: Math.round(totals.land * multiplier),
  };

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className={styles.label}>Your Impact</span>
          <h1 className={styles.title}>Carbon & Water Savings</h1>
          <p className={styles.subtitle}>
            Select the vegan meals you eat and see how much you're saving compared to meat-based equivalents.
          </p>
        </motion.div>

        <div className={styles.layout}>
          <div className={styles.mealSelector}>
            <h3 className={styles.selectorTitle}><FaSeedling /> Select Your Meals</h3>
            <div className={styles.mealGrid}>
              {MEALS.map((meal) => {
                const isActive = selected.includes(meal.id);
                return (
                  <motion.button
                    key={meal.id}
                    className={`${styles.mealBtn} ${isActive ? styles.mealBtnActive : ''}`}
                    onClick={() => toggleMeal(meal.id)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={styles.mealName}>{meal.name}</span>
                    <span className={styles.mealCategory}>{meal.category}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className={styles.resultsPanel}>
            <div className={styles.periodToggle}>
              {['day', 'week', 'month'].map((p) => (
                <button
                  key={p}
                  className={`${styles.periodBtn} ${period === p ? styles.periodBtnActive : ''}`}
                  onClick={() => setPeriod(p)}
                >
                  Per {p}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selected.join('-')}-${period}`}
                className={styles.resultsGrid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`glass-card ${styles.statCard}`}>
                  <FaCloud className={styles.statIcon} style={{ color: 'var(--color-purple)' }} />
                  <span className={styles.statValue}>{scaled.co2}</span>
                  <span className={styles.statUnit}>kg CO₂ saved</span>
                  <p className={styles.statEquiv}>
                    ≈ {Math.round(scaled.co2 * 6)} km not driven
                  </p>
                </div>

                <div className={`glass-card ${styles.statCard}`}>
                  <FaDroplet className={styles.statIcon} style={{ color: 'var(--color-sage)' }} />
                  <span className={styles.statValue}>{scaled.water.toLocaleString()}</span>
                  <span className={styles.statUnit}>liters water saved</span>
                  <p className={styles.statEquiv}>
                    ≈ {Math.round(scaled.water / 80)} showers worth
                  </p>
                </div>

                <div className={`glass-card ${styles.statCard}`}>
                  <FaTree className={styles.statIcon} style={{ color: 'var(--color-orange)' }} />
                  <span className={styles.statValue}>{scaled.land}</span>
                  <span className={styles.statUnit}>sq.ft land preserved</span>
                  <p className={styles.statEquiv}>
                    ≈ {(scaled.land / 9).toFixed(1)} sq.m of forest
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {selected.length === 0 && (
              <p className={styles.emptyState}>Select meals on the left to see your environmental savings.</p>
            )}

            {selected.length > 0 && (
              <motion.div
                className={styles.summary}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p>
                  By choosing <strong>{selected.length} vegan meal{selected.length > 1 ? 's' : ''}</strong> per {period},
                  you prevent <strong>{scaled.co2} kg</strong> of CO₂ and save <strong>{scaled.water.toLocaleString()} liters</strong> of water
                  compared to meat-based alternatives.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
