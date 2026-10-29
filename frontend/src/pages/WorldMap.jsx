import { useState } from 'react';
import { motion } from 'framer-motion';
import BackButton from '../components/ui/BackButton';
import { PageHeader, ReferenceList, Callout } from '../components/ui';
import { Seo } from '../components/seo';
import { ROUTES } from '../constants/routes';
import styles from './WorldMap.module.css';

/*
  Approximate, rounded values for orientation only.
  co2   = fossil CO₂ emitted per person per year (tonnes), all sectors.
  meat  = meat supply per person per year (kg), FAO food balance data.
  Both change from year to year; see the sources below for current figures.
*/
const COUNTRY_DATA = [
  { id: 'us', name: 'United States', x: 22, y: 38, co2: 14.9, meat: 124, color: '#e3a36e' },
  { id: 'br', name: 'Brazil', x: 30, y: 62, co2: 2.3, meat: 100, color: '#a6b48f' },
  { id: 'in', name: 'India', x: 68, y: 45, co2: 2.0, meat: 5, color: '#9d82ab' },
  { id: 'cn', name: 'China', x: 75, y: 38, co2: 8.0, meat: 62, color: '#e3a36e' },
  { id: 'de', name: 'Germany', x: 50, y: 30, co2: 7.9, meat: 80, color: '#a6b48f' },
  { id: 'au', name: 'Australia', x: 82, y: 72, co2: 14.8, meat: 116, color: '#e3a36e' },
  { id: 'ng', name: 'Nigeria', x: 50, y: 52, co2: 0.6, meat: 7, color: '#9d82ab' },
  { id: 'uk', name: 'United Kingdom', x: 47, y: 28, co2: 4.7, meat: 80, color: '#a6b48f' },
  { id: 'jp', name: 'Japan', x: 84, y: 38, co2: 8.5, meat: 50, color: '#9d82ab' },
  { id: 'ke', name: 'Kenya', x: 57, y: 55, co2: 0.4, meat: 16, color: '#a6b48f' },
];

const REFS = [
  { org: 'Our World in Data', title: 'CO₂ emissions per capita', link: 'https://ourworldindata.org/co2-and-greenhouse-gas-emissions' },
  { org: 'Our World in Data', title: 'Meat supply per person', link: 'https://ourworldindata.org/meat-production' },
  { org: 'FAO', title: 'FAOSTAT food balances', link: 'https://www.fao.org/faostat/en/#data/FBS' },
  { org: 'Science (Poore & Nemecek, 2018)', title: 'Reducing food’s environmental impacts through producers and consumers', link: 'https://www.science.org/doi/10.1126/science.aaq0216' },
];

export default function WorldMap() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const activeCountry = selected || hovered;
  const data = COUNTRY_DATA.find((c) => c.id === activeCountry);

  return (
    <section className={styles.section}>
      <Seo
        title="Food and Climate Around the World: Interactive Map"
        description="Compare per-person carbon emissions and meat consumption across ten countries on an interactive map, with sources."
        path={ROUTES.worldMap}
      />
      <BackButton />
      <div className={styles.container}>
        <PageHeader
          align="center"
          eyebrow="Global perspective"
          title="Food and climate around the world"
          lead="Select a country to compare its carbon emissions with how much meat its people eat on average."
          trail={[
            { name: 'Home', path: ROUTES.home },
            { name: 'World map', path: ROUTES.worldMap },
          ]}
        />

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
              <motion.button
                type="button"
                aria-label={`${country.name}: ${country.co2} tonnes CO₂ and ${country.meat} kg meat per person per year`}
                aria-pressed={selected === country.id}
                key={country.id}
                className={`${styles.marker} ${activeCountry === country.id ? styles.markerActive : ''}`}
                style={{ left: `${country.x}%`, top: `${country.y}%` }}
                onMouseEnter={() => setHovered(country.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(country.id)}
                onBlur={() => setHovered(null)}
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
              </motion.button>
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
                    { value: data.co2, label: 'tonnes fossil CO₂ per person per year' },
                    { value: `${data.meat} kg`, label: 'meat supply per person per year' },
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
                  Globally, food causes about a quarter of greenhouse gas emissions, and animal products account for well over half of that.
                </p>
              </motion.div>
            ) : (
              <div className={styles.placeholder}>
                <p>Hover over or select a country marker to see its figures.</p>
              </div>
            )}
          </motion.div>
        </div>

        <Callout variant="note" title="About this data">
          Values are rounded national averages for orientation, not a measure of any individual’s food
          footprint. Emissions shown cover all sectors; meat supply is the amount available per person, not
          what is eaten after waste. The map outline is simplified.
        </Callout>

        <ReferenceList panel title="Sources & further reading" refs={REFS} />
      </div>
    </section>
  );
}
