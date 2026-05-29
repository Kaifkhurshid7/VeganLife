import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRotate } from 'react-icons/fa6';
import { SectionHeader } from '../../ui';
import styles from './Myths.module.css';

const MYTHS = [
  {
    id: 1,
    myth: '\u201CVegans can\u2019t get enough protein\u201D',
    reality: 'Completely False',
    fact: 'Plant foods are loaded with clean, cholesterol-free proteins. 1 cup of cooked lentils has 18g of protein, and tempeh has 20g per 100g. Standard grains and beans provide all nine essential amino acids when combined throughout the day.',
    color: 'var(--color-sage)',
  },
  {
    id: 2,
    myth: '\u201CPlant-based eating is too expensive\u201D',
    reality: 'A Budget Myth',
    fact: 'The core staples of a vegan diet\u2014oats, rice, dry beans, lentils, sweet potatoes, and seasonal greens\u2014are the cheapest food ingredients on Earth. Bulk cooking saves up to 40% on monthly food costs compared to buying meats and cheeses.',
    color: 'var(--color-orange)',
  },
  {
    id: 3,
    myth: '\u201CVegans only eat boring salads\u201D',
    reality: 'Infinitely Diverse',
    fact: 'The vegan catalog includes artisanal sweet potato tacos, high-protein plant burgers, rich coconut lentil curries, rich avocado pastas, and creamy fruit power shakes. It is an invitation to explore a world of rich spices, grains, and textures.',
    color: 'var(--color-purple)',
  },
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
        description="Let\u2019s separate cultural misconceptions from peer-reviewed nutritional and environmental science."
      />

      <div className={styles.grid}>
        {MYTHS.map((item) => (
          <div
            key={item.id}
            className={styles.cardContainer}
            onClick={() => toggleFlip(item.id)}
          >
            <motion.div
              className={styles.cardInner}
              animate={{ rotateY: flippedCards[item.id] ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {/* Front */}
              <div className={styles.cardFront}>
                <span className={styles.mythBadge}>Common Myth</span>
                <h3 className={styles.mythText}>{item.myth}</h3>
                <div className={styles.flipHint}>
                  <FaRotate /> Tap to Reveal Fact
                </div>
              </div>

              {/* Back */}
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
    </section>
  );
}
