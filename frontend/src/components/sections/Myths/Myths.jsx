import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRotate } from 'react-icons/fa6';
import { SectionHeader, ReferenceList } from '../../ui';
import { veganMythsDebunked } from '../../../data/nutrition';
import styles from './Myths.module.css';

const PALETTE = ['var(--color-sage)', 'var(--color-orange)', 'var(--color-purple)', 'var(--color-earth)'];

const cards = veganMythsDebunked.map((m, i) => ({
  id: i,
  myth: m.myth,
  reality: m.reality || 'Debunked',
  fact: m.truth,
  color: m.color || PALETTE[i % 4],
}));

const mythsReferences = [
  { org: 'Academy of Nutrition and Dietetics', title: 'Vegetarian Diets Position Paper', link: 'https://www.eatright.org/' },
  { org: 'NIH Office of Dietary Supplements', title: 'Vitamin B12 Fact Sheet', link: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/' },
  { org: 'Harvard Nutrition Source', title: 'Plant-Based Diet', link: 'https://nutritionsource.hsph.harvard.edu/' },
];

export default function Myths() {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="myths" style={{ backgroundColor: 'var(--color-bg)' }}>
      <SectionHeader
        label="Fact vs Fiction"
        title="Vegan Myths Busted"
        description="Let's separate cultural misconceptions from peer-reviewed nutritional and environmental science."
      />

      <div className={styles.grid}>
        {cards.map((item, idx) => (
          <div
            key={item.id}
            className={`${styles.cardContainer} animate-bob`}
            style={{ animationDelay: `${idx * -1.6}s`, animationDuration: '6s' }}
            onClick={() => toggleFlip(item.id)}
          >
            <motion.div
              className={styles.cardInner}
              animate={{ rotateY: flippedCards[item.id] ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <div className={styles.cardFront}>
                <span className={styles.mythBadge}>Common Myth</span>
                <h3 className={styles.mythText}>{item.myth}</h3>
                <div className={styles.flipHint}>
                  <FaRotate /> Tap to Reveal Fact
                </div>
              </div>

              <div className={styles.cardBack} style={{ borderColor: item.color }}>
                <span className={styles.realityBadge} style={{ backgroundColor: item.color }}>
                  {item.reality}
                </span>
                <p className={styles.factText}>{item.fact}</p>
                <div className={styles.flipHintBack}>Tap to Flip Back</div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <div className={styles.refs}>
        <ReferenceList refs={mythsReferences} />
      </div>
    </section>
  );
}
