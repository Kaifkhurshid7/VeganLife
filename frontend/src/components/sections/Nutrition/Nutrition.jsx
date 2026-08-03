import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBookmark, FiClock, FiTag, FiCheckCircle, FiChevronDown, FiInfo, FiArrowRight, FiAward } from 'react-icons/fi';
import { FaSeedling, FaLeaf, FaQuoteLeft } from 'react-icons/fa6';
import { SectionHeader, ReferenceList } from '../../ui';
import { nutritionCategories, studentVeganDiet, trustIndicators, dailyMotivation } from '../../../data/nutrition';
import QuickGuides from './QuickGuides';
import styles from './Nutrition.module.css';

const TAB_COLORS = {
  protein: 'var(--color-sage)',
  iron: 'var(--color-orange)',
  calcium: 'var(--color-purple)',
  b12: 'var(--color-earth)',
};

export default function Nutrition() {
  const [activeTab, setActiveTab] = useState('protein');
  const [expandedItem, setExpandedItem] = useState(null);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const selectedCategory = nutritionCategories.find((cat) => cat.id === activeTab) || nutritionCategories[0];
  const diet = studentVeganDiet;

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % dailyMotivation.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="nutrition" style={{ backgroundColor: 'var(--color-bg)' }}>
      <SectionHeader
        label="Clean Energy"
        title="Nutrition Guide"
        description="Unlock absolute physical vitality with vibrant, fiber-dense, and highly bioavailable plant foods."
      />

      {/* Trust indicators + rotating motivation */}
      {trustIndicators && (
        <div className={styles.trustStrip}>
          <span className={styles.trustChip}><FiAward /> Research-backed</span>
          <span className={styles.trustChip}><FiCheckCircle /> Peer-reviewed sources</span>
          <span className={styles.trustChip}><FaLeaf /> Sourced per category</span>
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.p
          key={quoteIdx}
          className={styles.motivation}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
        >
          <FaQuoteLeft className={styles.motivationIcon} /> {dailyMotivation[quoteIdx]}
        </motion.p>
      </AnimatePresence>

      <div className={styles.layout}>
        <div className={styles.dashboard}>
          {/* Tabs */}
          <div className={styles.tabs}>
            {nutritionCategories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.tabBtn} ${activeTab === cat.id ? styles.tabBtnActive : ''}`}
                onClick={() => { setActiveTab(cat.id); setExpandedItem(null); }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Category Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="glass-card"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
            >
              {selectedCategory.image && (
                <div className={styles.categoryHero}>
                  <img src={selectedCategory.image} alt="" className={styles.categoryHeroImg} loading="lazy" />
                  <span className={styles.categoryHeroLabel}>{selectedCategory.name}</span>
                </div>
              )}

              <h3 className={styles.panelTitle}>{selectedCategory.name}</h3>
              <p className={styles.panelDesc}>{selectedCategory.desc}</p>

              {selectedCategory.whyItMatters && (
                <div className={styles.whyBox}>
                  <FiInfo className={styles.whyIcon} />
                  <p>{selectedCategory.whyItMatters}</p>
                </div>
              )}

              {/* Food items with progress bars */}
              <div className={styles.progressList}>
                {selectedCategory.items.map((item, idx) => (
                  <motion.div
                    key={item.food}
                    className={styles.progressItem}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.06 }}
                  >
                    <div
                      className={styles.progressHeader}
                      onClick={() => setExpandedItem(expandedItem === idx ? null : idx)}
                    >
                      {item.image && (
                        <img src={item.image} alt={item.food} className={styles.itemThumb} loading="lazy" />
                      )}
                      <div className={styles.progressLabel}>
                        <span className={styles.foodName}>{item.food}</span>
                        <span className={styles.foodQuantity}>{item.quantity}</span>
                      </div>
                      <div className={styles.progressMeta}>
                        {item.cost && <span className={styles.costBadge}>{item.cost}</span>}
                        {item.hostelFriendly && <span className={styles.hostelBadge}>Hostel-friendly</span>}
                        <FiChevronDown className={`${styles.expandIcon} ${expandedItem === idx ? styles.expandIconOpen : ''}`} />
                      </div>
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

                    {/* Expanded details */}
                    <AnimatePresence>
                      {expandedItem === idx && (
                        <motion.div
                          className={styles.expandedDetails}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.shortDesc && <p className={styles.shortDesc}>{item.shortDesc}</p>}

                          <div className={styles.detailGrid}>
                            {item.digestibility && <div className={styles.detailItem}><span className={styles.detailLabel}>Digestibility</span><span>{item.digestibility}</span></div>}
                            {item.energyRelease && <div className={styles.detailItem}><span className={styles.detailLabel}>Energy Release</span><span>{item.energyRelease}</span></div>}
                            {item.workoutSuitability && <div className={styles.detailItem}><span className={styles.detailLabel}>Workout Use</span><span>{item.workoutSuitability}</span></div>}
                            {item.shelfLife && <div className={styles.detailItem}><span className={styles.detailLabel}>Shelf Life</span><span>{item.shelfLife}</span></div>}
                            {item.budgetLevel && <div className={styles.detailItem}><span className={styles.detailLabel}>Budget</span><span>{item.budgetLevel}</span></div>}
                            {item.glycemicIndex && <div className={styles.detailItem}><span className={styles.detailLabel}>Glycemic Index</span><span>{item.glycemicIndex}</span></div>}
                            {item.satietyScore && <div className={styles.detailItem}><span className={styles.detailLabel}>Satiety</span><span>{item.satietyScore}/10</span></div>}
                          </div>

                          {item.bestPairings && (
                            <div className={styles.pairings}>
                              <span className={styles.detailLabel}>Best Pairings:</span>
                              <div className={styles.pairingTags}>
                                {item.bestPairings.map((p) => <span key={p} className={styles.pairingTag}>{p}</span>)}
                              </div>
                            </div>
                          )}

                          {item.studentNotes && (
                            <p className={styles.studentNote}><FaSeedling className={styles.noteIcon} /> {item.studentNotes}</p>
                          )}

                          {item.references && item.references.length > 0 && (
                            <ReferenceList refs={item.references} title="Item Sources" />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Meal Ideas */}
              {selectedCategory.mealIdeas && (
                <div className={styles.mealIdeas}>
                  <h4><FaLeaf /> Meal Ideas</h4>
                  <div className={styles.mealIdeaList}>
                    {selectedCategory.mealIdeas.map((idea) => (
                      <span key={idea} className={styles.mealIdeaTag}>{idea}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              <ReferenceList refs={selectedCategory.references} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Student Diet Card */}
        <motion.div
          className={`glass-card ${styles.dietCard}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {diet.image && (
            <div className={styles.dietHero}>
              <img src={diet.image} alt="" className={styles.dietHeroImg} loading="lazy" />
            </div>
          )}
          <div className={styles.dietHeader}>
            <div className={styles.dietBadge}>
              <FiBookmark style={{ color: 'var(--color-orange)' }} />
              <span>Student Routine</span>
            </div>
            <h3 className={styles.dietTitle}>{diet.title}</h3>
            <div className={styles.dietMeta}>
              <span className={styles.metaTag}><FiTag /> {diet.macros.calories}</span>
              <span className={styles.metaTag}><FiClock /> {diet.costEstimates.perDay}</span>
            </div>
          </div>

          <div className={styles.highlights}>
            <div className={styles.highlightItem}><FiCheckCircle style={{ color: 'var(--color-sage)', flexShrink: 0 }} /><span>Protein: {diet.macros.protein}</span></div>
            <div className={styles.highlightItem}><FiCheckCircle style={{ color: 'var(--color-sage)', flexShrink: 0 }} /><span>Iron: {diet.macros.iron}</span></div>
            <div className={styles.highlightItem}><FiCheckCircle style={{ color: 'var(--color-sage)', flexShrink: 0 }} /><span>{diet.macros.vitaminB12}</span></div>
          </div>

          <hr className={styles.separator} />

          <div className={styles.schedule}>
            {diet.timeline.map((item) => (
              <div key={item.section} className={styles.scheduleItem}>
                <div className={styles.scheduleHeader}>
                  <span className={styles.mealLabel}>{item.section}</span>
                  <span className={styles.prepTime}>{item.prep}</span>
                </div>
                <h4 className={styles.mealTitle}>{item.meal}</h4>
                <p className={styles.mealDetails}>{item.description.slice(0, 120)}...</p>
                <div className={styles.mealMeta}>
                  <span>{item.calories}</span>
                  <span>{item.protein} protein</span>
                  {item.price && <span>{item.price}</span>}
                </div>
              </div>
            ))}
          </div>

          <Link to="/planner" className={styles.planLink}>
            Plan a week <FiArrowRight />
          </Link>

          <ReferenceList refs={diet.references} />
        </motion.div>
      </div>

      {/* Quick Guides: surfaces the otherwise-unused datasets */}
      <QuickGuides />
    </section>
  );
}
