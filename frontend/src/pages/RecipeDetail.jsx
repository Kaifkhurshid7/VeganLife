import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiUser, FiDollarSign, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { FaLeaf, FaSeedling, FaFire, FaDroplet, FaWheatAwn, FaBacon } from 'react-icons/fa6';
import BackButton from '../components/ui/BackButton';
import { ReferenceList } from '../components/ui';
import { recipes } from '../data/recipes';
import styles from './RecipeDetail.module.css';

// Approximate daily reference intakes used to scale the nutrition bars.
const DAILY = { calories: 2200, protein: 92, carbs: 280, fat: 68, fiber: 42, iron: 22 };

const NUTRIENT_ICONS = {
  calories: <FaFire />,
  protein: <FaSeedling />,
  carbs: <FaWheatAwn />,
  fat: <FaBacon />,
  fiber: <FaLeaf />,
  iron: <FaDroplet />,
};

function MetaChip({ icon, label, value }) {
  return (
    <span className={styles.chip}>
      {icon} <span>{label}</span> <strong>{value}</strong>
    </span>
  );
}

export default function RecipeDetail() {
  const { id } = useParams();
  const recipe = recipes.find((r) => String(r.id) === String(id));

  if (!recipe) {
    return (
      <section className={styles.section}>
        <BackButton />
        <div className={styles.notFound}>
          <FaLeaf className={styles.notFoundIcon} />
          <h1>Recipe not found</h1>
          <p>This recipe may have been removed or the link is wrong.</p>
          <Link to="/" className={styles.homeLink}>Back to home</Link>
        </div>
      </section>
    );
  }

  const meta = [
    { icon: <FiClock />, label: 'Time', value: recipe.time },
    { icon: <FiUser />, label: 'Serves', value: recipe.serves },
    { icon: <FiDollarSign />, label: 'Cost', value: `₹${recipe.cost}` },
    { icon: <FaFire />, label: 'Calories', value: recipe.calories },
    { icon: <FaSeedling />, label: 'Protein', value: recipe.protein },
    { icon: <FaDroplet />, label: 'Fiber', value: recipe.fiber },
    { icon: <FiCalendar />, label: 'GI', value: recipe.glycemicIndex },
    { icon: <FaLeaf />, label: 'Digest', value: recipe.digestibility },
  ];

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.imageBox}>
            <img src={recipe.image} alt={recipe.title} className={styles.image} loading="eager" />
            <span className={styles.categoryBadge}>{recipe.category}</span>
            <span className={styles.difficultyBadge}>{recipe.difficulty}</span>
          </div>

          <div className={styles.head}>
            <h1 className={styles.title}>{recipe.title}</h1>
            <p className={styles.desc}>{recipe.desc}</p>

            <div className={styles.chips}>
              {meta.map((m) => (
                <MetaChip key={m.label} {...m} />
              ))}
            </div>

            {recipe.purpose?.length > 0 && (
              <div className={styles.purpose}>
                {recipe.purpose.map((p) => <span key={p} className={styles.purposeTag}>{p}</span>)}
              </div>
            )}
          </div>
        </motion.div>

        <div className={styles.body}>
          <motion.div
            className={`glass-card ${styles.ingredientsCard}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className={styles.cardTitle}>Ingredients</h2>
            <ul className={styles.ingredients}>
              {recipe.ingredients.map((ing, i) => (
                <li key={ing} className={styles.ingredient} style={{ animationDelay: `${i * 0.03}s` }}>
                  <span className={styles.bullet}>●</span> {ing}
                </li>
              ))}
            </ul>
          </motion.div>

          {recipe.nutrition && (
            <motion.div
              className={`glass-card ${styles.nutritionCard}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className={styles.cardTitle}>Nutrition per serving</h2>
              <div className={styles.nutritionGrid}>
                {Object.entries(recipe.nutrition).map(([key, val]) => {
                  const pct = Math.min(100, Math.round((val / DAILY[key]) * 100));
                  const unit = key === 'calories' ? ' kcal' : key === 'iron' ? ' mg' : ' g';
                  return (
                    <div key={key} className={styles.nutritionTile}>
                      <span className={styles.nutritionIcon}>{NUTRIENT_ICONS[key]}</span>
                      <div className={styles.nutritionInfo}>
                        <strong className={styles.nutritionValue}>{val}{unit}</strong>
                        <span className={styles.nutritionLabel}>{key}</span>
                        <div className={styles.nutritionTrack}>
                          <motion.div
                            className={styles.nutritionFill}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className={styles.nutritionNote}>Bars show % of a ~2200 kcal / 92g protein reference day.</p>
            </motion.div>
          )}

          <motion.div
            className={`glass-card ${styles.tagsCard}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <h2 className={styles.cardTitle}>Good to know</h2>
            <div className={styles.tags}>
              {recipe.tags.map((t) => <span key={t} className={styles.tag}>#{t.replace(/\s+/g, '')}</span>)}
            </div>

            {recipe.allergens?.length > 0 && (
              <div className={styles.allergens}>
                <span className={styles.allergenLabel}><FiCheckCircle /> Contains:</span>
                <div className={styles.tags}>
                  {recipe.allergens.map((a) => <span key={a} className={`${styles.tag} ${styles.allergenTag}`}>#{a}</span>)}
                </div>
              </div>
            )}

            {recipe.funFact && (
              <p className={styles.funFact}><FaSeedling className={styles.funFactIcon} /> {recipe.funFact}</p>
            )}

            <Link to="/planner" className={styles.plannerLink}>
              <FiCalendar /> Plan your week with this recipe
            </Link>
          </motion.div>

          {recipe.steps?.length > 0 && (
            <motion.div
              className={`glass-card ${styles.stepsCard}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className={styles.cardTitle}>How to make it</h2>
              <ol className={styles.steps}>
                {recipe.steps.map((s, i) => (
                  <li key={i} className={styles.step}>
                    <span className={styles.stepNum}>{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}

          {recipe.references?.length > 0 && (
            <motion.div
              className={`glass-card ${styles.refsCard}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <ReferenceList refs={recipe.references} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
