import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiUser, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { FaLeaf, FaSeedling, FaFire, FaDroplet } from 'react-icons/fa6';
import BackButton from '../components/ui/BackButton';
import { recipes } from '../data/recipes';
import styles from './RecipeDetail.module.css';

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
            <Link to="/planner" className={styles.plannerLink}>
              <FiCalendar /> Plan your week with this recipe
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
