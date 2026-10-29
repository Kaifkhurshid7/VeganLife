import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiClock, FiCheckCircle, FiChevronDown, FiArrowRight, FiAward, FiZap,
} from 'react-icons/fi';
import { FaSeedling, FaLeaf, FaQuoteLeft, FaDumbbell, FaDroplet, FaPills, FaBone } from 'react-icons/fa6';
import { SectionHeader, ReferenceList } from '../../ui';
import { nutritionCategories, studentVeganDiet, dailyMotivation } from '../../../data/nutrition';
import { ROUTES } from '../../../constants/routes';
import QuickGuides from './QuickGuides';
import styles from './Nutrition.module.css';

const TAB_META = {
  protein: { color: '#7f9a5f', icon: <FaDumbbell />, short: 'Muscle and focus' },
  iron: { color: '#e3a36e', icon: <FaDroplet />, short: 'Energy and oxygen' },
  b12: { color: '#9d82ab', icon: <FaPills />, short: 'Nerves and blood' },
  calcium: { color: '#6f9a9a', icon: <FaBone />, short: 'Bones and teeth' },
};

/* "92 g (target for active students)" -> ["92", "g"] */
function splitValue(raw = '') {
  const m = String(raw).match(/^([\d.,]+)\s*([a-zA-Zµ]+)?/);
  return m ? [m[1], m[2] || ''] : [raw, ''];
}

const DETAIL_FIELDS = [
  ['digestibility', 'Digestibility'],
  ['energyRelease', 'Energy release'],
  ['workoutSuitability', 'Workout use'],
  ['shelfLife', 'Shelf life'],
  ['budgetLevel', 'Budget'],
  ['glycemicIndex', 'Glycemic index'],
];

export default function Nutrition() {
  const [activeTab, setActiveTab] = useState('protein');
  const [expandedItem, setExpandedItem] = useState(null);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const category = nutritionCategories.find((c) => c.id === activeTab) || nutritionCategories[0];
  const meta = TAB_META[category.id] || TAB_META.protein;
  const diet = studentVeganDiet;

  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % dailyMotivation.length), 7000);
    return () => clearInterval(t);
  }, []);

  const labelRows = [
    ['Protein', diet.macros.protein],
    ['Carbohydrate', diet.macros.carbs],
    ['Fat', diet.macros.fats],
    ['Fiber', diet.macros.fiber],
    ['Iron', diet.macros.iron],
    ['Calcium', diet.macros.calcium],
  ];
  const [kcal] = splitValue(diet.macros.calories);

  return (
    <section id="nutrition" className={styles.section}>
      <SectionHeader
        label="Clean Energy"
        title="Nutrition Guide"
        description="Unlock absolute physical vitality with vibrant, fiber-dense, and highly bioavailable plant foods."
      />

      <div className={styles.trustStrip}>
        <span className={styles.trustChip}><FiAward /> Research-backed</span>
        <span className={styles.trustChip}><FiCheckCircle /> Sources listed per category</span>
        <span className={styles.trustChip}><FaLeaf /> Built for students</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={quoteIdx}
          className={styles.motivation}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
        >
          <FaQuoteLeft className={styles.motivationIcon} aria-hidden="true" /> {dailyMotivation[quoteIdx]}
        </motion.p>
      </AnimatePresence>

      {/* ═════════ NUTRIENT EXPLORER ═════════ */}
      <div className={styles.explorer}>
        <div className={styles.nav} role="tablist" aria-label="Nutrients" aria-orientation="vertical">
          <p className={styles.navTitle}>Pick a nutrient</p>
          {nutritionCategories.map((cat) => {
            const m = TAB_META[cat.id] || TAB_META.protein;
            const active = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`${styles.navBtn} ${active ? styles.navBtnActive : ''}`}
                style={{ '--tab': m.color }}
                onClick={() => { setActiveTab(cat.id); setExpandedItem(null); }}
              >
                <span className={styles.navIcon} aria-hidden="true">{m.icon}</span>
                <span className={styles.navText}>
                  <span className={styles.navName}>{cat.name}</span>
                  <span className={styles.navSub}>{m.short} · {cat.items.length} sources</span>
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category.id}
            className={styles.panel}
            style={{ '--tab': meta.color }}
            role="tabpanel"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.35 }}
          >
            {/* hero banner */}
            <div className={styles.banner}>
              {category.image && <img src={category.image} alt="" className={styles.bannerImg} loading="lazy" />}
              <div className={styles.bannerText}>
                <span className={styles.bannerIcon} aria-hidden="true">{meta.icon}</span>
                <h3>{category.name}</h3>
                <p>{category.desc}</p>
              </div>
            </div>

            {category.whyItMatters && (
              <p className={styles.why}>
                <span className={styles.whyLabel}>Why it matters</span>
                <mark>{category.whyItMatters}</mark>
              </p>
            )}

            {/* ranked sources */}
            <h4 className={styles.subhead}>Top sources, ranked</h4>
            <ol className={styles.ranking}>
              {category.items.map((item, idx) => {
                const open = expandedItem === idx;
                return (
                  <li key={item.food} className={`${styles.rankItem} ${open ? styles.rankItemOpen : ''}`}>
                    <button
                      type="button"
                      className={styles.rankHead}
                      aria-expanded={open}
                      onClick={() => setExpandedItem(open ? null : idx)}
                    >
                      <span className={styles.rankNo}>{idx + 1}</span>
                      {item.image && <img src={item.image} alt="" className={styles.thumb} loading="lazy" />}
                      <span className={styles.rankMain}>
                        <span className={styles.foodName}>{item.food}</span>
                        <span className={styles.foodQty}>{item.quantity}</span>
                        <span className={styles.track}>
                          <motion.span
                            className={styles.fill}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(item.pct, 100)}%` }}
                            transition={{ duration: 0.9, ease: 'easeOut', delay: idx * 0.08 }}
                          />
                        </span>
                      </span>
                      <span className={styles.rankSide}>
                        {item.cost && <span className={styles.cost}>{item.cost}</span>}
                        {item.hostelFriendly && <span className={styles.hostel}>Hostel-friendly</span>}
                      </span>
                      <FiChevronDown className={styles.chev} aria-hidden="true" />
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          className={styles.details}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={styles.detailsInner}>
                            {item.shortDesc && <p className={styles.shortDesc}>{item.shortDesc}</p>}

                            <dl className={styles.facts}>
                              {DETAIL_FIELDS.filter(([k]) => item[k] !== undefined && item[k] !== '').map(([k, label]) => (
                                <div key={k}>
                                  <dt>{label}</dt>
                                  <dd>{item[k]}</dd>
                                </div>
                              ))}
                              {item.satietyScore && (
                                <div>
                                  <dt>Satiety</dt>
                                  <dd>{item.satietyScore}/10</dd>
                                </div>
                              )}
                            </dl>

                            {item.bestPairings && (
                              <div className={styles.pairings}>
                                <span className={styles.miniLabel}>Pairs well with</span>
                                {item.bestPairings.map((p) => <span key={p} className={styles.pill}>{p}</span>)}
                              </div>
                            )}

                            {item.studentNotes && (
                              <p className={styles.note}><FaSeedling aria-hidden="true" /> {item.studentNotes}</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ol>

            {/* did you know */}
            {category.scienceNotes?.length > 0 && (
              <div className={styles.science}>
                <h4 className={styles.subhead}><FiZap aria-hidden="true" /> Did you know?</h4>
                <ul>
                  {category.scienceNotes.map((note) => <li key={note}>{note}</li>)}
                </ul>
              </div>
            )}

            {category.mealIdeas && (
              <div className={styles.ideas}>
                <h4 className={styles.subhead}><FaLeaf aria-hidden="true" /> Meal ideas</h4>
                <div className={styles.pillRow}>
                  {category.mealIdeas.map((idea) => <span key={idea} className={styles.ideaPill}>{idea}</span>)}
                </div>
              </div>
            )}

            <ReferenceList panel title="Sources" refs={category.references} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ═════════ DAILY PLAN: LABEL + TIMELINE ═════════ */}
      <div className={styles.plan}>
        <motion.aside
          className={styles.label}
          aria-label="Example daily nutrition targets"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <p className={styles.labelKicker}>Daily Student Plan</p>
          <h3 className={styles.labelTitle}>Nutrition Facts</h3>
          <p className={styles.labelSub}>Example targets for an active student</p>
          <div className={styles.labelRule} />
          <div className={styles.labelCal}>
            <span>Calories</span>
            <strong>{kcal}</strong>
          </div>
          <div className={styles.labelRuleThin} />
          <ul className={styles.labelRows}>
            {labelRows.map(([name, raw]) => {
              const [n, unit] = splitValue(raw);
              return (
                <li key={name}>
                  <span>{name}</span>
                  <strong>{n}{unit && <small> {unit}</small>}</strong>
                </li>
              );
            })}
            <li>
              <span>Vitamin B12</span>
              <strong className={styles.labelWarn}>Supplement</strong>
            </li>
            <li>
              <span>Omega-3 (ALA)</span>
              <strong>{splitValue(diet.macros.omega3)[0]}<small> g</small></strong>
            </li>
          </ul>
          <div className={styles.labelRule} />
          <p className={styles.labelNote}>{diet.macros.notes}</p>

          <div className={styles.budget}>
            <p className={styles.budgetTitle}>Budget</p>
            <dl>
              <div><dt>Per day</dt><dd>{diet.costEstimates.perDay.split(' (')[0]}</dd></div>
              <div><dt>Per week</dt><dd>{diet.costEstimates.weeklyGrocery}</dd></div>
              <div><dt>Per month</dt><dd>{diet.costEstimates.monthlyBudget}</dd></div>
            </dl>
          </div>
        </motion.aside>

        <div className={styles.timelineWrap}>
          <p className={styles.kicker}>A day on the plate</p>
          <h3 className={styles.timelineTitle}>{diet.title}</h3>

          <ol className={styles.timeline}>
            {diet.timeline.map((item, i) => (
              <motion.li
                key={item.section}
                className={styles.step}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.05 }}
              >
                <span className={styles.dot} aria-hidden="true" />
                <div className={styles.stepCard}>
                  <div className={styles.stepTop}>
                    <span className={styles.stepTime}>{item.section}</span>
                    <span className={styles.stepPrep}><FiClock aria-hidden="true" /> {item.prep}</span>
                  </div>
                  <h4>{item.meal}</h4>
                  <p>{item.description}</p>
                  <div className={styles.stepChips}>
                    <span>{item.calories}</span>
                    <span>{item.protein} protein</span>
                    {item.price && <span>{item.price}</span>}
                  </div>
                  {item.benefits?.length > 0 && (
                    <ul className={styles.benefits}>
                      {item.benefits.map((b) => <li key={b}><FiCheckCircle aria-hidden="true" /> {b}</li>)}
                    </ul>
                  )}
                </div>
              </motion.li>
            ))}
          </ol>

          <div className={styles.planActions}>
            <Link to={ROUTES.planner} className="btn btn-primary">
              Plan a week <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ReferenceList panel title="Sources" refs={diet.references} />
        </div>
      </div>

      <QuickGuides />
    </section>
  );
}
