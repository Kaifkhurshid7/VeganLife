import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCloud, FaDroplet, FaMountain, FaCow, FaTree, FaFish } from 'react-icons/fa6';
import BackButton from '../components/ui/BackButton';
import styles from './Compare.module.css';

const COMPARISONS = [
  { metric: 'CO₂ Emissions', unit: 'kg/year', vegan: 1500, omnivore: 3300, icon: <FaCloud /> },
  { metric: 'Water Usage', unit: 'liters/day', vegan: 1100, omnivore: 15000, icon: <FaDroplet /> },
  { metric: 'Land Use', unit: 'sq.m/year', vegan: 650, omnivore: 3200, icon: <FaMountain /> },
  { metric: 'Animals Saved', unit: 'per year', vegan: 365, omnivore: 0, icon: <FaCow /> },
  { metric: 'Deforestation', unit: 'sq.ft/year', vegan: 120, omnivore: 1800, icon: <FaTree /> },
  { metric: 'Ocean Dead Zones', unit: 'contribution %', vegan: 5, omnivore: 45, icon: <FaFish /> },
];

function ComparisonSlider({ data }) {
  const [position, setPosition] = useState(50);
  const veganWidth = position;
  const omnivoreWidth = 100 - position;

  const maxVal = Math.max(data.vegan, data.omnivore);
  const veganPercent = (data.vegan / maxVal) * 100;
  const omnivorePercent = (data.omnivore / maxVal) * 100;

  return (
    <div className={styles.comparisonCard}>
      <div className={styles.comparisonHeader}>
        <span className={styles.comparisonIcon}>{data.icon}</span>
        <h3>{data.metric}</h3>
      </div>

      <div className={styles.sliderContainer}>
        <input
          type="range"
          min="10"
          max="90"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className={styles.slider}
        />
        <div className={styles.barContainer}>
          <motion.div
            className={styles.barVegan}
            animate={{ width: `${veganPercent}%` }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className={styles.barOmnivore}
            animate={{ width: `${omnivorePercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className={styles.values}>
        <div className={styles.valueBlock}>
          <span className={styles.valueLabel}>Vegan</span>
          <span className={styles.valueNum} style={{ color: 'var(--color-sage)' }}>
            {data.vegan.toLocaleString()}
          </span>
          <span className={styles.valueUnit}>{data.unit}</span>
        </div>
        <div className={styles.valueDivider}>vs</div>
        <div className={styles.valueBlock}>
          <span className={styles.valueLabel}>Omnivore</span>
          <span className={styles.valueNum} style={{ color: 'var(--color-orange)' }}>
            {data.omnivore.toLocaleString()}
          </span>
          <span className={styles.valueUnit}>{data.unit}</span>
        </div>
      </div>

      {data.omnivore > 0 && (
        <p className={styles.saving}>
          Going vegan saves <strong>{Math.round(((data.omnivore - data.vegan) / data.omnivore) * 100)}%</strong> on {data.metric.toLowerCase()}
        </p>
      )}
    </div>
  );
}

export default function Compare() {
  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className={styles.label}>Side by Side</span>
          <h1 className={styles.title}>Vegan vs Omnivore</h1>
          <p className={styles.subtitle}>
            Drag the sliders to visualize the environmental difference between plant-based and conventional diets.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {COMPARISONS.map((comp, idx) => (
            <motion.div
              key={comp.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <ComparisonSlider data={comp} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
