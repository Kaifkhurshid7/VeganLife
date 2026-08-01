import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/ui/BackButton';
import styles from './SeasonalProduce.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PRODUCE_DATA = {
  Jan: { fruits: ['Oranges', 'Grapefruit', 'Kiwi', 'Pomegranate'], vegetables: ['Kale', 'Brussels Sprouts', 'Turnips', 'Leeks', 'Parsnips'], grains: ['Oats', 'Barley', 'Buckwheat'] },
  Feb: { fruits: ['Lemons', 'Blood Oranges', 'Pears', 'Tangerines'], vegetables: ['Cabbage', 'Cauliflower', 'Spinach', 'Beets', 'Celery'], grains: ['Quinoa', 'Millet', 'Brown Rice'] },
  Mar: { fruits: ['Strawberries', 'Pineapple', 'Mangoes', 'Avocados'], vegetables: ['Asparagus', 'Artichokes', 'Peas', 'Radishes', 'Lettuce'], grains: ['Farro', 'Amaranth', 'Spelt'] },
  Apr: { fruits: ['Strawberries', 'Apricots', 'Cherries', 'Rhubarb'], vegetables: ['Asparagus', 'Spring Onions', 'Watercress', 'Fennel', 'Arugula'], grains: ['Wheat Berries', 'Couscous', 'Bulgur'] },
  May: { fruits: ['Cherries', 'Strawberries', 'Lychees', 'Mulberries'], vegetables: ['Zucchini', 'Green Beans', 'Snap Peas', 'New Potatoes', 'Chard'], grains: ['Freekeh', 'Teff', 'Oats'] },
  Jun: { fruits: ['Peaches', 'Blueberries', 'Watermelon', 'Plums'], vegetables: ['Tomatoes', 'Corn', 'Cucumbers', 'Bell Peppers', 'Eggplant'], grains: ['Quinoa', 'Wild Rice', 'Millet'] },
  Jul: { fruits: ['Watermelon', 'Raspberries', 'Blackberries', 'Figs'], vegetables: ['Tomatoes', 'Okra', 'Summer Squash', 'Green Beans', 'Corn'], grains: ['Barley', 'Buckwheat', 'Amaranth'] },
  Aug: { fruits: ['Peaches', 'Nectarines', 'Grapes', 'Melons'], vegetables: ['Tomatoes', 'Peppers', 'Eggplant', 'Sweet Corn', 'Basil'], grains: ['Brown Rice', 'Farro', 'Spelt'] },
  Sep: { fruits: ['Apples', 'Pears', 'Grapes', 'Figs', 'Plums'], vegetables: ['Butternut Squash', 'Sweet Potatoes', 'Broccoli', 'Cauliflower', 'Kale'], grains: ['Oats', 'Quinoa', 'Wild Rice'] },
  Oct: { fruits: ['Apples', 'Cranberries', 'Persimmons', 'Pomegranates'], vegetables: ['Pumpkin', 'Sweet Potatoes', 'Brussels Sprouts', 'Turnips', 'Beets'], grains: ['Buckwheat', 'Millet', 'Barley'] },
  Nov: { fruits: ['Cranberries', 'Pears', 'Oranges', 'Dates'], vegetables: ['Squash', 'Parsnips', 'Kale', 'Leeks', 'Rutabaga'], grains: ['Amaranth', 'Teff', 'Brown Rice'] },
  Dec: { fruits: ['Oranges', 'Tangerines', 'Pomegranates', 'Kiwi'], vegetables: ['Brussels Sprouts', 'Turnips', 'Parsnips', 'Winter Squash', 'Collards'], grains: ['Oats', 'Quinoa', 'Farro'] },
};

const CATEGORY_COLORS = {
  fruits: 'var(--color-orange)',
  vegetables: 'var(--color-sage)',
  grains: 'var(--color-purple)',
};

export default function SeasonalProduce() {
  const currentMonth = new Date().getMonth();
  const [activeMonth, setActiveMonth] = useState(MONTHS[currentMonth]);
  const data = PRODUCE_DATA[activeMonth];

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className={styles.label}>Eat With the Seasons</span>
          <h1 className={styles.title}>Seasonal Produce Calendar</h1>
          <p className={styles.subtitle}>Discover what's fresh, local, and at peak nutrition each month.</p>
        </motion.div>

        <div className={styles.monthGrid}>
          {MONTHS.map((month, idx) => (
            <motion.button
              key={month}
              className={`${styles.monthBtn} ${activeMonth === month ? styles.monthBtnActive : ''}`}
              onClick={() => setActiveMonth(month)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
            >
              {month}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMonth}
            className={styles.produceGrid}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {Object.entries(data).map(([category, items], idx) => (
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
      </div>
    </section>
  );
}
