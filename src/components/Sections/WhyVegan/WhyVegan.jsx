import { motion } from 'framer-motion';
import { FaEarthAmericas, FaHeartPulse, FaHandHoldingHeart, FaSeedling } from 'react-icons/fa6';
import { SectionHeader, WaveDivider } from '../../ui';
import { DeerSilhouettes, Fireflies } from '../../ambient';
import styles from './WhyVegan.module.css';

const PILLARS = [
  {
    icon: <FaEarthAmericas />,
    title: 'Environment',
    desc: "Animal farming accounts for 14.5% of global greenhouse emissions. A plant-based diet reduces your food's carbon footprint by up to 73% and helps combat the climate crisis.",
    color: 'var(--color-sage)',
  },
  {
    icon: <FaHeartPulse />,
    title: 'Health',
    desc: 'Rich in complex fiber, antioxidants, and pure clean nutrients. Plant-based diets reduce the risk of cardiovascular illnesses, lower high blood pressure, and boost mental clarity.',
    color: 'var(--color-orange)',
  },
  {
    icon: <FaHandHoldingHeart />,
    title: 'Compassion',
    desc: 'Every animal is a conscious, feeling being that experiences joy, fear, and pain. Choosing plant options helps build a kinder society, preventing animal farming suffering.',
    color: 'var(--color-purple)',
  },
  {
    icon: <FaSeedling />,
    title: 'Sustainability',
    desc: 'We grow enough crops to feed 10 billion people, yet millions go hungry because 70% is fed to livestock. Vegan feeding is the most efficient, equitable resource model.',
    color: 'var(--color-earth)',
  },
];

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
        {PILLARS.map((pillar, idx) => (
          <motion.div
            key={pillar.title}
            className="glass-card glow-card"
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
          >
            <div className={styles.iconBox} style={{ color: pillar.color }}>
              {pillar.icon}
            </div>
            <h3 className={styles.cardTitle}>{pillar.title}</h3>
            <p className={styles.cardDesc}>{pillar.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
