import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiArrowLeft, FiArrowRight, FiClock, FiCalendar, FiShoppingBag } from 'react-icons/fi';
import { FaBookOpen, FaWallet, FaDumbbell, FaStopwatch, FaFire } from 'react-icons/fa6';
import { SectionHeader, WaveDivider } from '../../ui';
import { recipes } from '../../../data/recipes';
import { ROUTES, buildPath } from '../../../constants/routes';
import styles from './Meals.module.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MEAL_TYPES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const GOALS = [
  'High Protein', 'Budget Friendly', 'Quick Meals', 'Indian Meals',
  'Gym Meals', 'Hostel Friendly', 'Weight Gain', 'Weight Loss',
];

const num = (value) => parseFloat(String(value).replace(/[^\d.]/g, '')) || 0;
const average = (list) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0);

export default function Meals() {
  const [selected, setSelected] = useState('All');

  const filtered = useMemo(
    () =>
      selected === 'All'
        ? recipes
        : recipes.filter((r) => r.category === selected || (r.tags && r.tags.includes(selected))),
    [selected]
  );

  // Headline numbers are computed from the data so they can never drift from it.
  const summary = useMemo(
    () => [
      { icon: <FaBookOpen />, value: recipes.length, label: 'Plant-based recipes' },
      { icon: <FaWallet />, value: `₹${Math.round(average(recipes.map((r) => num(r.cost))))}`, label: 'Average cost' },
      { icon: <FaDumbbell />, value: `${Math.round(average(recipes.map((r) => num(r.protein))))}g`, label: 'Average protein' },
      { icon: <FaStopwatch />, value: recipes.filter((r) => num(r.time) <= 20).length, label: 'Ready in 20 min or less' },
    ],
    []
  );

  const chip = (label) => (
    <button
      key={label}
      type="button"
      aria-pressed={selected === label}
      className={`${styles.chip} ${selected === label ? styles.chipActive : ''}`}
      onClick={() => setSelected(label)}
    >
      {label}
    </button>
  );

  return (
    <section id="recipes" className={styles.section}>
      <WaveDivider variant="alt" />

      <SectionHeader
        label="Gourmet Simplicity"
        title="Student Friendly Meals"
        description="Quick, wallet-friendly, nutrient-packed creations that fit perfectly into your academic schedule."
      />

      {/* ————— at-a-glance numbers ————— */}
      <dl className={styles.summary}>
        {summary.map((item) => (
          <div key={item.label} className={styles.summaryItem}>
            <span className={styles.summaryIcon} aria-hidden="true">{item.icon}</span>
            <div>
              <dt className={styles.summaryLabel}>{item.label}</dt>
              <dd className={styles.summaryValue}>{item.value}</dd>
            </div>
          </div>
        ))}
      </dl>

      {/* ————— filters, grouped ————— */}
      <div className={styles.filterPanel}>
        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Meal type</p>
          <div className={styles.segment} role="group" aria-label="Meal type">
            {MEAL_TYPES.map(chip)}
          </div>
        </div>
        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>Goals and lifestyle</p>
          <div className={styles.chips} role="group" aria-label="Goals and lifestyle">
            {GOALS.map(chip)}
          </div>
        </div>
        <p className={styles.count} role="status" aria-live="polite">
          Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'recipe' : 'recipes'}
          {selected !== 'All' && <> for <mark>{selected}</mark></>}
        </p>
      </div>

      {/* ————— carousel ————— */}
      <div className={styles.carouselWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45 }}
          >
            {filtered.length === 0 ? (
              <p className={styles.empty}>No recipes match that filter yet. Try another one.</p>
            ) : (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={28}
                slidesPerView={1}
                navigation={{ prevEl: '.meals-prev', nextEl: '.meals-next' }}
                pagination={{ clickable: true, el: '.meals-pagination' }}
                autoplay={{ delay: 6000, disableOnInteraction: true, pauseOnMouseEnter: true }}
                breakpoints={{ 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}
                className={styles.swiper}
              >
                {filtered.map((recipe) => (
                  <SwiperSlide key={recipe.id} className={styles.slide}>
                    <Link to={buildPath.recipe(recipe.id)} className={styles.recipeCard}>
                      <div className={styles.imageBox}>
                        <img src={recipe.image} alt="" className={styles.recipeImg} loading="lazy" />
                        <span className={styles.categoryBadge}>{recipe.category}</span>
                        <span className={styles.timePill}><FiClock aria-hidden="true" /> {recipe.time}</span>
                      </div>

                      <div className={styles.cardBody}>
                        <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                        <p className={styles.recipeDesc}>{recipe.desc}</p>

                        <ul className={styles.nutrition} aria-label="Nutrition and cost">
                          <li>
                            <FaFire aria-hidden="true" />
                            <strong>{recipe.nutrition?.calories ?? recipe.calories}</strong>
                            <span>kcal</span>
                          </li>
                          <li>
                            <FaDumbbell aria-hidden="true" />
                            <strong>{recipe.protein}</strong>
                            <span>protein</span>
                          </li>
                          <li>
                            <FaWallet aria-hidden="true" />
                            <strong>₹{recipe.cost}</strong>
                            <span>est. cost</span>
                          </li>
                        </ul>

                        <div className={styles.tags}>
                          {recipe.ingredients.slice(0, 2).map((ing) => (
                            <span key={ing} className={styles.tag}>{ing}</span>
                          ))}
                        </div>

                        <span className={styles.cta}>
                          View recipe <FiArrowRight aria-hidden="true" />
                        </span>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </motion.div>
        </AnimatePresence>

        <button type="button" className={`meals-prev ${styles.navBtn} ${styles.navBtnPrev}`} aria-label="Previous recipes">
          <FiArrowLeft />
        </button>
        <button type="button" className={`meals-next ${styles.navBtn} ${styles.navBtnNext}`} aria-label="Next recipes">
          <FiArrowRight />
        </button>
        <div className={`meals-pagination ${styles.pagination}`} />
      </div>

      {/* ————— planner call to action ————— */}
      <motion.div
        className={styles.planner}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.plannerCopy}>
          <p className={styles.plannerKicker}>Plan ahead</p>
          <h3 className={styles.plannerTitle}>A week of meals, one grocery list</h3>
          <p className={styles.plannerText}>
            Pick a weekly plan and get an automatic shopping list, so the cooking is the only decision
            left on a busy day.
          </p>
        </div>
        <div className={styles.plannerActions}>
          <Link to={ROUTES.planner} className="btn btn-primary">
            <FiCalendar aria-hidden="true" /> Weekly meal planner
          </Link>
          <Link to={ROUTES.seasonal} className="btn btn-outline">
            <FiShoppingBag aria-hidden="true" /> Seasonal produce
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
