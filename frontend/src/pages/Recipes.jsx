import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { recipes } from '../data/recipes';
import { ROUTES, buildPath } from '../constants/routes';
import styles from './ContentPage.module.css';

export default function Recipes() {
  const categories = useMemo(() => ['All', ...new Set(recipes.map((r) => r.category))], []);
  const [active, setActive] = useState('All');
  const visible = active === 'All' ? recipes : recipes.filter((r) => r.category === active);

  return (
    <ContentPage
      seoTitle="Vegan Recipes: Budget-Friendly and High-Protein"
      description="Simple plant-based recipes with calories, protein and prep time, designed for students and busy weeknights."
      path={ROUTES.recipes}
      crumb="Recipes"
      eyebrow="Cook"
      title="Vegan recipes"
      lead="Budget-friendly, protein-aware meals with the nutrition listed up front."
    >
      <div className={styles.filters} role="group" aria-label="Filter by meal type">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            className={`${styles.filter} ${active === c ? styles.filterActive : ''}`}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className={styles.cardGrid}>
        {visible.map((r) => (
          <Link key={r.id} to={buildPath.recipe(r.id)} className={styles.card}>
            {r.image && <img src={r.image} alt="" className={styles.cardImg} loading="lazy" />}
            <span className={styles.tag} style={{ alignSelf: 'flex-start' }}>{r.category}</span>
            <h2>{r.title}</h2>
            <p>{r.desc}</p>
            <div className={styles.meta}>
              <span>{r.time}</span>
              <span>{r.calories}</span>
              <span>{r.protein} protein</span>
              <span>{r.difficulty}</span>
            </div>
          </Link>
        ))}
      </div>
    </ContentPage>
  );
}
