import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa6';
import LearnLayout from './LearnLayout';
import { blogs } from '../data/blogs';
import { ROUTES, buildPath } from '../constants/routes';
import learn from './Learn.module.css';
import styles from './Listing.module.css';

// A tone per category so the grid reads at a glance. Unknown categories fall back
// to sage via the CSS default.
const TONES = {
  Nutrition: '#a6b48f',
  Sustainability: '#8fbf9a',
  Climate: '#9fc3cf',
  Fitness: '#e3a36e',
  'Student Life': '#c9b3dd',
  Recipes: '#f0c987',
  Awareness: '#e6a8a0',
  General: '#d8c7a8',
};

const initial = (name = '') => name.trim().charAt(0).toUpperCase() || '•';

export default function Articles() {
  const categories = useMemo(() => ['All', ...new Set(blogs.map((b) => b.category))], []);
  const [active, setActive] = useState('All');

  const [lead, ...rest] = blogs;
  const visible = active === 'All' ? rest : blogs.filter((b) => b.category === active);
  const showFeatured = active === 'All' && lead;
  const count = (c) => (c === 'All' ? blogs.length : blogs.filter((b) => b.category === c).length);

  return (
    <LearnLayout
      seoTitle="Articles on Plant-Based Living, Health and Sustainability"
      description="Sourced articles on nutrition, sustainability, sport and everyday plant-based living."
      path={ROUTES.articles}
      crumb="Articles"
      eyebrow="Read"
      title="Articles"
      ring="READ • QUESTION • VERIFY • "
      lead={
        <>
          Short reads on food, health and the environment. <mark>Every article lists its sources</mark>, so
          you can check the claims for yourself.
        </>
      }
      images={{
        main: { src: blogs[0]?.image, alt: '' },
        small: blogs[1]?.image ? { src: blogs[1].image, alt: '' } : undefined,
      }}
      chip={{ big: blogs.length, text: 'sourced articles to read' }}
      facts={[
        { label: 'Articles', value: `${blogs.length} and growing` },
        { label: 'Topics', value: `${categories.length - 1} categories` },
        { label: 'Sourcing', value: 'Citations on every piece' },
        { label: 'Advice', value: 'Educational, not medical' },
      ]}
    >
      <div className={styles.shelf} role="group" aria-label="Filter by category">
        <span className={styles.shelfLabel}>Topic</span>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            className={`${styles.chip} ${active === c ? styles.chipOn : ''}`}
            onClick={() => setActive(c)}
          >
            {c} <small>{count(c)}</small>
          </button>
        ))}
      </div>

      {showFeatured && (
        <Link to={buildPath.article(lead.id)} className={styles.featured}>
          <div
            className={styles.featuredImg}
            style={lead.image ? { backgroundImage: `url(${lead.image})` } : undefined}
            role="img"
            aria-label={lead.title}
          />
          <div className={styles.featuredBody}>
            <span className={styles.flag}>Latest · {lead.category}</span>
            <h2>{lead.title}</h2>
            <p>{lead.summary}</p>
            <span className={styles.readMore}>
              {lead.readTime} · Read article <FaArrowRight aria-hidden="true" />
            </span>
          </div>
        </Link>
      )}

      {visible.length === 0 ? (
        <p className={styles.empty}>No articles in this topic yet.</p>
      ) : (
        <div className={styles.grid}>
          {visible.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
            >
              <Link
                to={buildPath.article(post.id)}
                className={styles.card}
                style={{ '--tone': TONES[post.category] }}
              >
                <div className={styles.media}>
                  {post.image && <img src={post.image} alt="" loading="lazy" />}
                  <span className={styles.ribbon}>{post.category}</span>
                </div>
                <div className={styles.cardBody}>
                  <h2>{post.title}</h2>
                  <p>{post.summary}</p>
                  <div className={styles.byline}>
                    <span className={styles.avatar} aria-hidden="true">{initial(post.author)}</span>
                    <span className={styles.bylineText}>
                      <strong>{post.author}</strong>
                      <span>{[post.date, post.readTime].filter(Boolean).join(' · ')}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </LearnLayout>
  );
}
