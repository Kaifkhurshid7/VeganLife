import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiSunrise, FiSun, FiMoon, FiCoffee } from 'react-icons/fi';
import BackButton from '../components/ui/BackButton';
import { SectionHeader } from '../components/ui';
import { weeklyMealPlans } from '../data/nutrition';
import { buildGroceryList } from '../utils/groceryList';
import styles from './Planner.module.css';

const MEAL_META = [
  { key: 'breakfast', label: 'Breakfast', icon: <FiSunrise />, emoji: '🌅' },
  { key: 'lunch', label: 'Lunch', icon: <FiSun />, emoji: '🍛' },
  { key: 'dinner', label: 'Dinner', icon: <FiMoon />, emoji: '🌙' },
  { key: 'snacks', label: 'Snacks', icon: <FiCoffee />, emoji: '🍿' },
];

export default function Planner() {
  const [planKey, setPlanKey] = useState('budget');
  const plan = weeklyMealPlans[planKey];
  const list = buildGroceryList(plan);

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <SectionHeader
          label="Weekly Meal Planner"
          title="Plan a week of delicious vegan meals"
          description="Pick a plan, browse the week, and grab an auto-generated grocery list. Every meal is student-friendly and budget-conscious."
        />

        {/* Plan toggle */}
        <div className={styles.toggle} role="tablist" aria-label="Choose a meal plan">
          {Object.entries(weeklyMealPlans).map(([key, p]) => (
            <button
              key={key}
              role="tab"
              aria-selected={planKey === key}
              className={`${styles.toggleBtn} ${planKey === key ? styles.toggleActive : ''}`}
              onClick={() => setPlanKey(key)}
            >
              {p.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={planKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* Plan summary */}
            <div className={styles.summary}>
              <div className={styles.summaryBadge}>Weekly budget: <strong>{plan.weeklyBudget}</strong></div>
              <p className={styles.summaryDesc}>{plan.description}</p>
            </div>

            {/* Week grid */}
            <div className={styles.week}>
              {plan.days.map((day, i) => (
                <motion.div
                  key={day.day}
                  className={`glass-card ${styles.dayCard}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <h3 className={styles.dayName}>{day.day}</h3>
                  <div className={styles.meals}>
                    {MEAL_META.map(({ key, label, icon, emoji }) => (
                      <div key={key} className={styles.meal}>
                        <span className={styles.mealLabel}>{icon} {label}</span>
                        <span className={styles.mealValue}>{day[key] || '—'}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Grocery list */}
            <div className={`glass-card ${styles.groceryCard}`}>
              <div className={styles.groceryHead}>
                <FiShoppingCart className={styles.groceryIcon} />
                <div>
                  <h2 className={styles.groceryTitle}>Your grocery list</h2>
                  <p className={styles.grocerySub}>
                    {list.ingredients.length} ingredients auto-picked from {plan.name.toLowerCase()}.
                  </p>
                </div>
              </div>

              <div className={styles.ingredients}>
                {list.ingredients.map((ing) => (
                  <div key={ing.text} className={styles.ingredientRow}>
                    <span className={styles.count}>{ing.count}×</span>
                    <span className={styles.ingredientText}>{ing.text}</span>
                  </div>
                ))}
              </div>

              {list.plainItems.length > 0 && (
                <>
                  <h3 className={styles.otherTitle}>Other items</h3>
                  <div className={styles.plain}>
                    {list.plainItems.map((item) => (
                      <span key={item} className={styles.plainChip}>{item}</span>
                    ))}
                  </div>
                </>
              )}

              <Link to="/community" className={styles.shopLink}>
                Looking for recipes? Browse the community feed
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
