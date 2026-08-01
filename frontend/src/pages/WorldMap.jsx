import { useState } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/ui/BackButton';
import styles from './WorldMap.module.css';

const COUNTRY_DATA = [
  { id: 'us', name: 'United States', x: 22, y: 38, co2: 16.1, water: 9800, land: 320, veganPop: '6%', color: '#e3a36e' },
  { id: 'br', name: 'Brazil', x: 30, y: 62, co2: 7.5, water: 7200, land: 450, veganPop: '14%', color: '#a6b48f' },
  { id: 'in', name: 'India', x: 68, y: 45, co2: 1.9, water: 3100, land: 80, veganPop: '9%', color: '#9d82ab' },
  { id: 'cn', name: 'China', x: 75, y: 38, co2: 8.0, water: 5600, land: 180, veganPop: '5%', color: '#e3a36e' },
  { id: 'de', name: 'Germany', x: 50, y: 30, co2: 8.9, water: 4200, land: 140, veganPop: '10%', color: '#a6b48f' },
  { id: 'au', name: 'Australia', x: 82, y: 72, co2: 15.4, water: 8900, land: 380, veganPop: '11%', color: '#e3a36e' },
  { id: 'ng', name: 'Nigeria', x: 50, y: 52, co2: 0.6, water: 1800, land: 45, veganPop: '3%', color: '#9d82ab' },
  { id: 'uk', name: 'United Kingdom', x: 47, y: 28, co2: 5.5, water: 3800, land: 120, veganPop: '13%', color: '#a6b48f' },
  { id: 'jp', name: 'Japan', x: 84, y: 38, co2: 9.0, water: 4500, land: 95, veganPop: '4%', color: '#9d82ab' },
  { id: 'ke', name: 'Kenya', x: 57, y: 55, co2: 0.4, water: 1200, land: 35, veganPop: '2%', color: '#a6b48f' },
];

export default function WorldMap() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const activeCountry = selected || hovered;
  const data = COUNTRY_DATA.find((c) => c.id === activeCountry);

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.label}>Global Perspective</span>
          <h1 className={styles.title}>Environmental Impact Map</h1>
          <p className={styles.subtitle}>
            Explore how food choices affect carbon emissions, water usage, and land consumption across nations.
          </p>
        </motion.div>

        <div className={styles.mapLayout}>
          <motion.div
            className={styles.mapContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Simplified world map background */}
            <svg viewBox="0 0 100 80" className={styles.worldSvg}>
              {[
                'M5,35 C8,30 15,28 20,30 C25,32 28,35 22,40 C18,44 25,50 28,55 C30,60 32,65 28,68 C24,70 20,65 18,60 C15,55 10,50 8,45 C6,40 4,38 5,35Z',
                'M42,20 C45,18 50,17 55,20 C58,22 60,25 58,30 C56,35 52,38 48,40 C44,42 42,38 43,34 C44,30 40,25 42,20Z',
                'M55,30 C60,28 68,30 75,32 C82,34 88,36 90,40 C92,44 88,48 82,46 C76,44 70,42 65,44 C60,46 55,42 54,38 C53,34 53,32 55,30Z',
                'M75,55 C78,52 82,54 85,58 C88,62 86,68 82,70 C78,72 75,68 76,64 C77,60 73,57 75,55Z',
              ].map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  fill="rgba(87,61,33,0.06)"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.12 }}
                />
              ))}
            </svg>

            {/* Country markers */}
            {COUNTRY_DATA.map((country) => (
              <motion.div
                key={country.id}
                className={`${styles.marker} ${activeCountry === country.id ? styles.markerActive : ''}`}
                style={{ left: `${country.x}%`, top: `${country.y}%` }}
                onMouseEnter={() => setHovered(country.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(selected === country.id ? null : country.id)}
                whileHover={{ scale: 1.4 }}
                animate={activeCountry === country.id ? { scale: [1, 1.3, 1.2] } : {}}
              >
                <div className={styles.markerDot} style={{ backgroundColor: country.color }} />
                <motion.div
                  className={styles.markerPulse}
                  style={{ borderColor: country.color }}
                  animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={`glass-card ${styles.infoPanel}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {data ? (
              <motion.div
                key={data.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className={styles.countryName}>{data.name}</h3>
                <div className={styles.stats}>
                  {[
                    { value: data.co2, label: 'CO₂ tons/capita/yr' },
                    { value: data.water.toLocaleString(), label: 'Liters water/day (food)' },
                    { value: data.land, label: 'Sq.ft land/day (food)' },
                    { value: data.veganPop, label: 'Vegan population' },
                  ].map((s, i) => (
                    <motion.div
                      key={s.label}
                      className={styles.stat}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                    >
                      <span className={styles.statValue}>{s.value}</span>
                      <span className={styles.statLabel}>{s.label}</span>
                    </motion.div>
                  ))}
                </div>
                <p className={styles.insight}>
                  If {data.name} shifted to plant-based diets, it could reduce food-related emissions by up to 70%.
                </p>
              </motion.div>
            ) : (
              <div className={styles.placeholder}>
                <p>Click or hover on a country marker to see its environmental food impact data.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
