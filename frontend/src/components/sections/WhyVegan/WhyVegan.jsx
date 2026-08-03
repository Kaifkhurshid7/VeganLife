import { motion } from 'framer-motion';
import { FaEarthAmericas, FaHeartPulse, FaHandHoldingHeart, FaSeedling } from 'react-icons/fa6';
import { FiCheckCircle } from 'react-icons/fi';
import { SectionHeader, WaveDivider, ReferenceList } from '../../ui';
import { DeerSilhouettes, Fireflies } from '../../ambient';
import styles from './WhyVegan.module.css';
import { awarenessCards } from '../../../data/awarenessCards';

const ICON_MAP = {
  Globe: <FaEarthAmericas />,
  HeartPulse: <FaHeartPulse />,
  HandHeart: <FaHandHoldingHeart />,
  Leaf: <FaSeedling />,
  CloudSun: <FaSeedling />,
  Sprout: <FaSeedling />,
};

export default function WhyVegan() {
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section id="why-vegan" style={{ backgroundColor: 'var(--color-bg)' }}>
      <WaveDivider variant="default" />
      <DeerSilhouettes />
      <Fireflies count={8} />

      <SectionHeader
        label="Core Pillars"
        title="Why Veganism?"
        description="A single food choice can act as a catalyst, improving your personal well-being while initiating global ecological recovery."
      />

      <div className={styles.grid}>
        {awarenessCards.map((card, idx) => (
          <motion.div
            key={card.title}
            className={`glass-card glow-card ${styles.card}`}
            onMouseMove={handleMouseMove}
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: idx * 0.1 } },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ y: -12, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
          >
            {card.image && (
              <div className={styles.imageBox}>
                <img src={card.image} alt={card.title} className={styles.cardImage} loading="lazy" />
              </div>
            )}
            <div className={styles.cardBody}>
              <div
                className={`${styles.iconBox} animate-bob`}
                style={{ color: card.color, animationDelay: `${idx * -0.8}s` }}
              >
                {ICON_MAP[card.icon] || <FaSeedling />}
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.description}</p>

              {card.highlights && card.highlights.length > 0 && (
                <ul className={styles.highlights}>
                  {card.highlights.map((h) => (
                    <li key={h} className={styles.highlightItem}>
                      <FiCheckCircle className={styles.highlightIcon} style={{ color: card.color }} />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.cardExtras}>
                <small className={styles.stat}>{card.statistic}</small>
                <blockquote className={styles.quote}>{card.quote}</blockquote>
              </div>

              <ReferenceList refs={card.references} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
