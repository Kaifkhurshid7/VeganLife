import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiArrowLeft, FiArrowRight, FiClock } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { GiBarbedCoil } from 'react-icons/gi';
import { SectionHeader, WaveDivider } from '../../ui';
import { recipes } from '../../../data/recipes';
import styles from './Meals.module.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CATEGORIES = [
  'All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks',
  'High Protein', 'Budget Friendly', 'Quick Meals', 'Indian Meals', 'Gym Meals', 'Hostel Friendly', 'Weight Gain', 'Weight Loss'
];

export default function Meals() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRecipes =
    selectedCategory === 'All'
      ? recipes
      : // match either category or tags
        recipes.filter((r) => r.category === selectedCategory || (r.tags && r.tags.includes(selectedCategory)));

  return (
    <section id="recipes" className={styles.section}>
      <WaveDivider variant="alt" />

      <SectionHeader
        label="Gourmet Simplicity"
        title="Student Friendly Meals"
        description="Quick, wallet-friendly, nutrient-packed creations that fit perfectly into your academic schedule."
      />

      <div className={styles.filters}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterBtnActive : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.carouselWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{ prevEl: '.meals-prev', nextEl: '.meals-next' }}
              pagination={{ clickable: true, el: '.meals-pagination' }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              style={{ paddingBottom: '60px' }}
            >
              {filteredRecipes.map((recipe) => (
                <SwiperSlide key={recipe.id}>
                  <Link to={`/recipes/${recipe.id}`} className={`glass-card ${styles.recipeCard}`}>
                    <div className={styles.imageBox}>
                      <span className={styles.categoryBadge}>{recipe.category}</span>
                      <img src={recipe.image} alt={recipe.title} className={styles.recipeImg} loading="lazy" />
                    </div>
                    <div className={styles.cardBody}>
                      <div>
                        <div className={styles.meta}>
                          <span><FiClock /> {recipe.time}</span>
                          <span><FaRupeeSign /> {recipe.cost}</span>
                          <span><GiBarbedCoil /> {recipe.protein}</span>
                        </div>
                        <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                        <p className={styles.recipeDesc}>{recipe.desc}</p>
                      </div>
                      <div className={styles.ingredients}>
                        {recipe.ingredients.slice(0, 3).map((ing) => (
                          <span key={ing} className={styles.ingredientTag}>{ing}</span>
                        ))}
                      </div>
                      <span className={styles.recipeCta}>View recipe →</span>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </AnimatePresence>

        <div className={`meals-prev ${styles.navBtn} ${styles.navBtnPrev}`}><FiArrowLeft /></div>
        <div className={`meals-next ${styles.navBtn} ${styles.navBtnNext}`}><FiArrowRight /></div>
        <div className={`meals-pagination ${styles.pagination}`} />
      </div>

      <div className={styles.plannerWrap}>
        <Link to="/planner" className={styles.plannerLink}>
          🗓️ Try the weekly meal planner + auto grocery list →
        </Link>
      </div>
    </section>
  );
}
