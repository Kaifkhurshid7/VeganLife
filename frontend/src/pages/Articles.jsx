import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ContentPage from './ContentPage';
import { blogs } from '../data/blogs';
import { ROUTES, buildPath } from '../constants/routes';
import styles from './ContentPage.module.css';

export default function Articles() {
  const categories = useMemo(() => ['All', ...new Set(blogs.map((b) => b.category))], []);
  const [active, setActive] = useState('All');
  const visible = active === 'All' ? blogs : blogs.filter((b) => b.category === active);

  return (
    <ContentPage
      seoTitle="Articles on Plant-Based Living, Health and Sustainability"
      description="Sourced articles on nutrition, sustainability, sport and everyday plant-based living."
      path={ROUTES.articles}
      crumb="Articles"
      eyebrow="Read"
      title="Articles"
      lead="Short reads on food, health and the environment. Every article lists its sources."
    >
      <div className={styles.filters} role="group" aria-label="Filter by category">
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
        {visible.map((post) => (
          <Link key={post.id} to={buildPath.article(post.id)} className={styles.card}>
            {post.image && <img src={post.image} alt="" className={styles.cardImg} loading="lazy" />}
            <span className={styles.tag} style={{ alignSelf: 'flex-start' }}>{post.category}</span>
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
            <div className={styles.meta}>
              <span>{post.author}</span>
              <span>{post.readTime}</span>
              <span>{post.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </ContentPage>
  );
}
