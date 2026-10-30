import { useState } from 'react';
import { motion } from 'framer-motion';
import { ReferenceList, Callout } from '../components/ui';
import ToolFrame from '../components/ui/ToolFrame';
import styles from './WorldMap.module.css';
import { LAND_PATH, COUNTRY_PATHS, MAP_WIDTH, MAP_HEIGHT } from './worldPaths';

/*
  Approximate, rounded values for orientation only.
  co2   = fossil CO₂ emitted per person per year (tonnes), all sectors.
  meat  = meat supply per person per year (kg), FAO food balance data.
  Both change from year to year; see the sources below for current figures.
*/
const COUNTRY_DATA = [
  { id: 'us', name: 'United States', lat: 39, lon: -98, co2: 14.9, meat: 124, color: '#e3a36e' },
  { id: 'br', name: 'Brazil', lat: -10, lon: -52, co2: 2.3, meat: 100, color: '#a6b48f' },
  { id: 'in', name: 'India', lat: 22, lon: 79, co2: 2.0, meat: 5, color: '#9d82ab' },
  { id: 'cn', name: 'China', lat: 35, lon: 103, co2: 8.0, meat: 62, color: '#e3a36e' },
  { id: 'de', name: 'Germany', lat: 51, lon: 10, co2: 7.9, meat: 80, color: '#a6b48f' },
  { id: 'au', name: 'Australia', lat: -25, lon: 134, co2: 14.8, meat: 116, color: '#e3a36e' },
  { id: 'ng', name: 'Nigeria', lat: 9, lon: 8, co2: 0.6, meat: 7, color: '#9d82ab' },
  { id: 'uk', name: 'United Kingdom', lat: 54, lon: -2, co2: 4.7, meat: 80, color: '#a6b48f' },
  { id: 'jp', name: 'Japan', lat: 36, lon: 138, co2: 8.5, meat: 50, color: '#9d82ab' },
  { id: 'ke', name: 'Kenya', lat: 0.5, lon: 38, co2: 0.4, meat: 16, color: '#a6b48f' },
];

const REFS = [
  { org: 'Our World in Data', title: 'CO₂ emissions per capita', link: 'https://ourworldindata.org/co2-and-greenhouse-gas-emissions' },
  { org: 'Our World in Data', title: 'Meat supply per person', link: 'https://ourworldindata.org/meat-production' },
  { org: 'FAO', title: 'FAOSTAT food balances', link: 'https://www.fao.org/faostat/en/#data/FBS' },
  { org: 'Science (Poore & Nemecek, 2018)', title: 'Reducing food’s environmental impacts through producers and consumers', link: 'https://www.science.org/doi/10.1126/science.aaq0216' },
];

// Position a marker over the equirectangular map (latitude 84N to 58S, same projection as worldPaths.js)
const markerPos = (c) => ({ left: `${((c.lon + 180) / 360) * 100}%`, top: `${((84 - c.lat) / 142) * 100}%` });

export default function WorldMap() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const activeCountry = selected || hovered;
  const data = COUNTRY_DATA.find((c) => c.id === activeCountry);

  return (
    <ToolFrame tool="worldMap" seoTitle="Food and Climate Around the World: Interactive Map" description="Compare per-person carbon emissions and meat consumption across ten countries on an interactive map, with sources." eyebrow="Global perspective" title="Food and climate around the world" lead="Select a country to compare its carbon emissions with how much meat its people eat on average.">
      <div className={styles.container}>

        <div className={styles.mapLayout}>
          <motion.div
            className={styles.mapContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Real world outline (Natural Earth, public domain) */}
            <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className={styles.worldSvg} role="img" aria-label="World map">
              {[-60, -30, 0, 30, 60].map((lat) => {
                const y = ((84 - lat) / 142) * MAP_HEIGHT;
                return <line key={lat} x1="0" x2={MAP_WIDTH} y1={y} y2={y} className={styles.graticule} />;
              })}
              <motion.path
                d={LAND_PATH}
                className={styles.land}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              {COUNTRY_DATA.map((c) => (
                <path
                  key={c.id}
                  d={COUNTRY_PATHS[c.id]}
                  className={styles.country}
                  style={{ fill: c.color, opacity: activeCountry === c.id ? 0.85 : 0.35 }}
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
                style={markerPos(country)}
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
          what is eaten after waste. The map is drawn from Natural Earth public-domain data.
        </Callout>

        <ReferenceList panel title="Sources & further reading" refs={REFS} />
      </div>
    </ToolFrame>
  );
}
