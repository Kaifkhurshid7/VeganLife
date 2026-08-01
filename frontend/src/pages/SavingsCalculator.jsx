import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDroplet, FaCloud, FaTree, FaSeedling, FaLeaf, FaChartLine } from 'react-icons/fa6';
import { FiCheck, FiInfo } from 'react-icons/fi';
import BackButton from '../components/ui/BackButton';
import styles from './SavingsCalculator.module.css';

const MEALS = [
  { id: 'lentil-curry', name: 'Lentil Curry + Brown Rice', category: 'Dinner', co2Saved: 3.2, waterSaved: 1800, landSaved: 12, calories: '580 kcal', protein: '22g' },
  { id: 'tofu-stirfry', name: 'Tofu Stir-Fry with Veggies', category: 'Dinner', co2Saved: 2.8, waterSaved: 1500, landSaved: 10, calories: '420 kcal', protein: '18g' },
  { id: 'chickpea-bowl', name: 'Chickpea Quinoa Buddha Bowl', category: 'Lunch', co2Saved: 2.5, waterSaved: 1200, landSaved: 9, calories: '510 kcal', protein: '19g' },
  { id: 'oatmeal', name: 'Oatmeal + Hemp Seeds + Berries', category: 'Breakfast', co2Saved: 1.4, waterSaved: 600, landSaved: 4, calories: '380 kcal', protein: '14g' },
  { id: 'avocado-toast', name: 'Avocado Toast + Microgreens', category: 'Breakfast', co2Saved: 1.1, waterSaved: 450, landSaved: 3, calories: '340 kcal', protein: '8g' },
  { id: 'bean-tacos', name: 'Black Bean & Sweet Potato Tacos', category: 'Dinner', co2Saved: 2.9, waterSaved: 1400, landSaved: 11, calories: '490 kcal', protein: '14g' },
  { id: 'smoothie', name: 'Green Power Smoothie', category: 'Snack', co2Saved: 0.8, waterSaved: 350, landSaved: 2, calories: '320 kcal', protein: '12g' },
  { id: 'hummus-wrap', name: 'Hummus & Roasted Veggie Wrap', category: 'Lunch', co2Saved: 1.9, waterSaved: 900, landSaved: 6, calories: '440 kcal', protein: '13g' },
  { id: 'pasta-pesto', name: 'Pasta with Walnut Pesto', category: 'Dinner', co2Saved: 2.2, waterSaved: 1100, landSaved: 8, calories: '560 kcal', protein: '16g' },
  { id: 'chia-pudding', name: 'Chia Pudding + Almond Butter', category: 'Breakfast', co2Saved: 1.0, waterSaved: 400, landSaved: 3, calories: '280 kcal', protein: '9g' },
];

const IMPACT_FACTS = [
  'Producing 1 kg of beef emits 27 kg of CO₂ — equivalent to driving 100 km.',
  'A single vegan day saves the same water as skipping 23 showers.',
  'If one person goes vegan for a year, they save 365 animals on average.',
  'Plant-based diets use 75% less land than meat-based diets globally.',
];

export default function SavingsCalculator() {
  const [selected, setSelected] = useState([]);
  const [period, setPeriod] = useState('week');

  const toggleMeal = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };

  const multiplier = period === 'day' ? 1 : period === 'week' ? 7 : 30;

  const totals = selected.reduce(
    (acc, id) => {
      const meal = MEALS.find((m) => m.id === id);
      if (!meal) return acc;
      return { co2: acc.co2 + meal.co2Saved, water: acc.water + meal.waterSaved, land: acc.land + meal.landSaved };
    },
    { co2: 0, water: 0, land: 0 }
  );

  const scaled = {
    co2: (totals.co2 * multiplier).toFixed(1),
    water: Math.round(totals.water * multiplier),
    land: Math.round(totals.land * multiplier),
  };

  const yearlyTrees = ((totals.co2 * 365) / 22).toFixed(0);

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className={styles.label}>Measure Your Impact</span>
          <h1 className={styles.title}>Carbon & Water Savings Calculator</h1>
          <p className={styles.subtitle}>
            Every plant-based meal you choose makes a measurable difference. Select your daily meals below
            and watch your environmental savings accumulate in real time.
          </p>
        </motion.div>

        {/* Info banner */}
        <motion.div
          className={styles.infoBanner}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FiInfo className={styles.infoIcon} />
          <p>
            Savings are calculated by comparing each vegan meal against its typical meat-based equivalent
            (e.g., lentil curry vs chicken curry). Data sourced from Oxford University's 2018 food sustainability study.
          </p>
        </motion.div>

        <div className={styles.layout}>
          {/* Meal selector */}
          <motion.div
            className={styles.mealSelector}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.selectorHeader}>
              <h3><FaSeedling /> Select Your Meals</h3>
              <span className={styles.selectedCount}>{selected.length} selected</span>
            </div>

            <div className={styles.mealGrid}>
              {MEALS.map((meal) => {
                const isActive = selected.includes(meal.id);
                return (
                  <motion.button
                    key={meal.id}
                    className={`${styles.mealBtn} ${isActive ? styles.mealBtnActive : ''}`}
                    onClick={() => toggleMeal(meal.id)}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className={styles.mealInfo}>
                      <span className={styles.mealName}>{meal.name}</span>
                      <span className={styles.mealMeta}>{meal.calories} · {meal.protein} protein</span>
                    </div>
                    <div className={styles.mealRight}>
                      <span className={styles.mealCategory}>{meal.category}</span>
                      {isActive && <FiCheck className={styles.checkMark} />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Results panel */}
          <div className={styles.resultsPanel}>
            <div className={styles.periodToggle}>
              <span className={styles.periodLabel}>View savings:</span>
              {['day', 'week', 'month'].map((p) => (
                <motion.button
                  key={p}
                  className={`${styles.periodBtn} ${period === p ? styles.periodBtnActive : ''}`}
                  onClick={() => setPeriod(p)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.94 }}
                >
                  Per {p}
                </motion.button>
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
                {[
                  {
                    icon: <FaCloud style={{ color: 'var(--color-purple)' }} />,
                    bg: 'rgba(157,130,171,0.12)',
                    value: scaled.co2,
                    unit: 'kg CO₂ saved',
                    equiv: <><FaChartLine /> ≈ {Math.round(scaled.co2 * 6)} km not driven</>,
                  },
                  {
                    icon: <FaDroplet style={{ color: 'var(--color-sage)' }} />,
                    bg: 'rgba(166,180,143,0.15)',
                    value: scaled.water.toLocaleString(),
                    unit: 'liters water saved',
                    equiv: <><FaDroplet /> ≈ {Math.round(scaled.water / 80)} showers worth</>,
                  },
                  {
                    icon: <FaTree style={{ color: 'var(--color-orange)' }} />,
                    bg: 'rgba(227,163,110,0.12)',
                    value: scaled.land,
                    unit: 'sq.ft land preserved',
                    equiv: <><FaLeaf /> ≈ {(scaled.land / 9).toFixed(1)} sq.m of forest</>,
                  },
                ].map((s, i) => (
                  <motion.div
                    key={s.unit}
                    className={`glass-card ${styles.statCard}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.09 }}
                    whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                  >
                    <div className={styles.statIconWrap} style={{ background: s.bg }}>{s.icon}</div>
                    <span className={styles.statValue}>{s.value}</span>
                    <span className={styles.statUnit}>{s.unit}</span>
                    <div className={styles.statEquiv}>{s.equiv}</div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {selected.length === 0 && (
              <div className={styles.emptyState}>
                <FaSeedling className={styles.emptyIcon} />
                <p>Select meals on the left to calculate your environmental savings.</p>
              </div>
            )}

            {selected.length > 0 && (
              <motion.div
                className={styles.summarySection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className={styles.summaryCard}>
                  <h4>Your Impact Summary</h4>
                  <p>
                    By choosing <strong>{selected.length} vegan meal{selected.length > 1 ? 's' : ''}</strong> per {period},
                    you prevent <strong>{scaled.co2} kg</strong> of CO₂ emissions and conserve <strong>{scaled.water.toLocaleString()} liters</strong> of
                    fresh water compared to standard meat-based alternatives.
                  </p>
                  {period === 'day' && (
                    <p className={styles.yearProjection}>
                      <FaLeaf /> Projected yearly: <strong>{(totals.co2 * 365).toFixed(0)} kg CO₂</strong> saved —
                      equivalent to planting <strong>{yearlyTrees} trees</strong>.
                    </p>
                  )}
                </div>

                <div className={styles.factCard}>
                  <h4><FiInfo /> Did You Know?</h4>
                  <p>{IMPACT_FACTS[selected.length % IMPACT_FACTS.length]}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
