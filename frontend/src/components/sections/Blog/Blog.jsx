import { motion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { SectionHeader, WaveDivider } from '../../ui';
import { blogs } from '../../../data/blogs';
import styles from './Blog.module.css';

export default function Blog() {
  return (
    <section id="blogs" style={{ backgroundColor: 'var(--color-bg)' }}>
      <WaveDivider variant="blog" />

      <SectionHeader
        label="Daily Insights"
        title="Awareness & Stories"
        description="Stay informed on cutting-edge research, student budget lifestyle blue-prints, and physical wellness."
      />

      <div className={styles.grid}>
        {blogs.map((post, idx) => (
          <motion.article
            key={post.id}
            className={`glass-card ${styles.card}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.15 }}
          >
            <div className={styles.imageBox}>
              <span className={styles.categoryBadge}>{post.category}</span>
              <img src={post.image} alt={post.title} className={styles.image} loading="lazy" />
            </div>

            <div className={styles.body}>
              <div>
                <div className={styles.meta}>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                {post.author && (
                  <span className={styles.author}>
                    <span className={styles.avatar}>{post.author.charAt(0)}</span>
                    {post.author}
                  </span>
                )}
                <h3 className={styles.title}>{post.title}</h3>
                {post.summary && <p className={styles.summary}>“{post.summary}”</p>}
                <p className={styles.desc}>{post.desc}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className={styles.tagList}>
                    {post.tags.map((t) => <span key={t} className={styles.tag}>#{t.replace(/\s+/g, '')}</span>)}
                  </div>
                )}
              </div>

              {post.url ? (
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.readLink}
                >
                  <span>Read Full Article</span>
                  <FiArrowUpRight />
                </a>
              ) : (
                <div className={styles.readLink}>
                  <span>Read Full Article</span>
                  <FiArrowUpRight />
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
