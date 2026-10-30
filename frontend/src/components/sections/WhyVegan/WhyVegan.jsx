import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { FaEarthAmericas, FaHeartPulse, FaHandHoldingHeart, FaSeedling, FaLeaf, FaCloudSun } from 'react-icons/fa6';
import { FiCheck, FiExternalLink } from 'react-icons/fi';
import { SectionHeader, WaveDivider } from '../../ui';
import { DeerSilhouettes, Fireflies } from '../../ambient';
import styles from './WhyVegan.module.css';
import { awarenessCards } from '../../../data/awarenessCards';

const ICON_MAP = {
  Globe: <FaEarthAmericas />,
  HeartPulse: <FaHeartPulse />,
  HandHeart: <FaHandHoldingHeart />,
  Leaf: <FaLeaf />,
  CloudSun: <FaCloudSun />,
  Sprout: <FaSeedling />,
};

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wraps each phrase in `marks` with a highlighter-style <mark>. */
function Highlighted({ text, marks = [] }) {
  if (!marks.length) return text;
  const pattern = new RegExp(`(${marks.map(escapeRegExp).join('|')})`, 'g');
  return text.split(pattern).map((part, i) =>
    marks.includes(part) ? <mark key={i} className={styles.mark}>{part}</mark> : <Fragment key={i}>{part}</Fragment>
  );
}

export default function WhyVegan() {
  return (
    <section id="why-vegan" className={styles.section}>
      <WaveDivider variant="default" />
      <DeerSilhouettes />
      <Fireflies count={8} />

      <SectionHeader
        label="Core Pillars"
        title="Why Veganism?"
        description="A single food choice can act as a catalyst, improving your personal well-being while initiating global ecological recovery."
      />

      <div className={styles.paper}>
        <div className={styles.masthead} aria-hidden="true">
          <span>Six reasons</span>
          <span className={styles.mastheadMid}>Every one sourced</span>
          <span>Read · Check · Decide</span>
        </div>

        {awarenessCards.map((card, idx) => (
          <motion.article
            key={card.title}
            className={`${styles.article} ${idx % 2 ? styles.reverse : ''}`}
            style={{ '--accent': card.color }}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            {/* ————— photo ————— */}
            <figure className={styles.figure}>
              {card.image && <img src={card.image} alt="" className={styles.image} loading="lazy" />}
              <figcaption className={styles.caption}>
                <span className={styles.captionIcon} aria-hidden="true">{ICON_MAP[card.icon] || <FaSeedling />}</span>
                {card.title}
              </figcaption>
            </figure>

            {/* ————— story ————— */}
            <div className={styles.story}>
              <p className={styles.kicker}>
                <span className={styles.no}>No. {String(idx + 1).padStart(2, '0')}</span>
                {card.title}
              </p>
              <h3 className={styles.headline}>{card.headline || card.title}</h3>

              <p className={styles.lede}>
                <Highlighted text={card.description} marks={card.marks} />
              </p>

              <div className={styles.facts}>
                {card.stat && (
                  <div className={styles.stat}>
                    <span className={styles.figureNum}>{card.stat.figure}</span>
                    <span className={styles.figureLabel}>{card.stat.label}</span>
                  </div>
                )}
                {card.highlights?.length > 0 && (
                  <div className={styles.takeaways}>
                    <p className={styles.takeawaysTitle}>Key takeaways</p>
                    <ul>
                      {card.highlights.map((h) => (
                        <li key={h}>
                          <FiCheck aria-hidden="true" /> {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <blockquote className={styles.quote}>{card.quote}</blockquote>

              {card.references?.length > 0 && (
                <p className={styles.sources}>
                  <span className={styles.sourcesLabel}>Sources</span>
                  {card.references.map((ref, i) => (
                    <a key={`${ref.org}-${ref.title}`} href={ref.link} target="_blank" rel="noopener noreferrer">
                      <sup>{i + 1}</sup> {ref.org}: {ref.title}
                      <FiExternalLink aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
