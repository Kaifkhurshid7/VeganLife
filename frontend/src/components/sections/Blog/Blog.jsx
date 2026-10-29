import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiClock } from 'react-icons/fi';
import { SectionHeader, WaveDivider } from '../../ui';
import { blogs } from '../../../data/blogs';
import { ROUTES, buildPath } from '../../../constants/routes';
import styles from './Blog.module.css';

// Homepage front page: one lead story and three supporting ones. The ids are
// chosen so each photo actually matches its story; the full archive lives at
// /articles.
const FRONT_PAGE_IDS = [8, 14, 13, 4];

const byId = (id) => blogs.find((b) => b.id === id);

export default function Blog() {
  const [lead, ...rest] = FRONT_PAGE_IDS.map(byId).filter(Boolean);
  if (!lead) return null;

  return (
    <section id="blogs" className={styles.section}>
      <WaveDivider variant="blog" />

      <SectionHeader
        label="Daily Insights"
        title="Awareness & Stories"
        description="Stay informed on cutting-edge research, student budget lifestyle blue-prints, and physical wellness."
      />

      <div className={styles.paper}>
        <div className={styles.masthead} aria-hidden="true">
          <span>The Vegan Life Review</span>
          <span className={styles.mastheadMid}>Latest stories</span>
          <span>{blogs.length} articles</span>
        </div>

        <div className={styles.front}>
          {/* ————— lead story ————— */}
          <motion.article
            className={styles.lead}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
          >
            <Link to={buildPath.article(lead.id)} className={styles.leadLink}>
              <div className={styles.leadImg}>
                <img src={lead.image} alt="" loading="lazy" />
                <span className={styles.badge}>{lead.category}</span>
              </div>
              <div className={styles.leadBody}>
                <p className={styles.kicker}>Lead story</p>
                <h3 className={styles.leadTitle}>{lead.title}</h3>
                <p className={styles.leadSummary}>{lead.summary}</p>
                <p className={styles.byline}>
                  By <strong>{lead.author}</strong> · {lead.date} · <FiClock aria-hidden="true" /> {lead.readTime}
                </p>
                <span className={styles.more}>
                  Read the story <FiArrowUpRight aria-hidden="true" />
                </span>
              </div>
            </Link>
          </motion.article>

          {/* ————— supporting stories ————— */}
          <div className={styles.side}>
            {rest.map((post, idx) => (
              <motion.article
                key={post.id}
                className={styles.story}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
              >
                <Link to={buildPath.article(post.id)} className={styles.storyLink}>
                  <img src={post.image} alt="" className={styles.thumb} loading="lazy" />
                  <div>
                    <p className={styles.storyKicker}>{post.category}</p>
                    <h3 className={styles.storyTitle}>{post.title}</h3>
                    <p className={styles.storyMeta}>
                      {post.readTime} · {post.date}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <p>Looking for something specific? Every article lists its sources.</p>
          <Link to={ROUTES.articles} className="btn btn-primary">
            Browse all articles <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
