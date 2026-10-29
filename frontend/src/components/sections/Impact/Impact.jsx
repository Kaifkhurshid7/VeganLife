import { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { FaDroplet, FaCloud, FaEarthAmericas, FaTree, FaWheatAwn, FaPaw } from 'react-icons/fa6';
import { FiBookOpen, FiX } from 'react-icons/fi';
import { SectionHeader, ReferenceList, Callout } from '../../ui';
import { useCounter } from '../../../hooks';
import { impactStats, resourceComparisonData, weeklySavingsData, chartReferences } from '../../../data/statistics';
import styles from './Impact.module.css';

const ICON_MAP = {
  FaDroplet: <FaDroplet />,
  FaCloud: <FaCloud />,
  FaGlobeAmericas: <FaEarthAmericas />,
  FaTree: <FaTree />,
  FaWheatAwn: <FaWheatAwn />,
  FaPaw: <FaPaw />,
};

/* Small data visual at the foot of each stat tile. Every tile reserves the
   same height for it, so the grid stays aligned whichever kind it shows. */
function Meter({ meter }) {
  if (!meter) return null;

  if (meter.type === 'note') {
    return <p className={styles.meterNote}>{meter.text}</p>;
  }

  if (meter.type === 'pair') {
    return (
      <div className={styles.meter}>
        <p className={styles.meterCaption}>{meter.caption}</p>
        {meter.rows.map((row, i) => (
          <div key={row.label} className={styles.pairRow}>
            <span className={styles.pairLabel}>{row.label}</span>
            <span className={styles.pairTrack}>
              <motion.span
                className={`${styles.pairBar} ${i === 0 ? styles.pairBarStrong : ''}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.max(row.pct, 3)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.15 }}
              />
            </span>
            <span className={styles.pairValue}>{row.display}</span>
          </div>
        ))}
      </div>
    );
  }

  if (meter.type === 'stack') {
    return (
      <div className={styles.meter}>
        <p className={styles.meterCaption}>{meter.caption}</p>
        <div className={styles.stackBar} role="img" aria-label={meter.segments.map((x) => `${x.label} ${x.pct}%`).join(', ')}>
          {meter.segments.map((seg, i) => (
            <motion.span
              key={seg.label}
              className={`${styles.stackSeg} ${styles[`seg${i}`]}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${seg.pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.12 }}
            />
          ))}
        </div>
        <ul className={styles.stackLegend}>
          {meter.segments.map((seg, i) => (
            <li key={seg.label}>
              <span className={`${styles.legendDot} ${styles[`seg${i}`]}`} aria-hidden="true" />
              {seg.label} {seg.pct}%
            </li>
          ))}
        </ul>
      </div>
    );
  }

  /* gauge: a segmented ten-block meter */
  const filled = Math.round(meter.pct / 10);
  return (
    <div className={styles.meter}>
      <p className={styles.meterCaption}>
        <strong>~{meter.pct}%</strong> {meter.caption}
      </p>
      <div className={styles.blocks} role="img" aria-label={`About ${meter.pct} percent`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.span
            key={i}
            className={`${styles.block} ${i < filled ? styles.blockOn : ''}`}
            initial={{ scale: 0.6, opacity: 0.4 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
          />
        ))}
      </div>
    </div>
  );
}

/* The printed face of a closed "book". It is rendered twice, once inside each
   half of the gatefold cover, so the artwork runs continuously across the
   seam. Both copies are decorative; the real content is on the inside page. */
function CoverArt({ stat, index }) {
  return (
    <div className={styles.coverArt} aria-hidden="true">
      <span className={styles.coverWatermark}>{ICON_MAP[stat.icon]}</span>
      <span className={styles.coverKicker}>
        <span className={styles.coverIndex}>{String(index + 1).padStart(2, '0')}</span>
        {stat.kicker}
      </span>
      <span className={styles.coverValue}>{stat.value}</span>
      <span className={styles.coverUnit}>{stat.unit}</span>
      <span className={styles.coverTitle}>{stat.title}</span>
      <span className={styles.coverHint}>
        <FiBookOpen /> Open
      </span>
    </div>
  );
}

function StatCounter({ value }) {
  const { ref, count } = useCounter(value);
  return <span ref={ref}>{count}</span>;
}

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--color-cream)',
  border: '1px solid var(--color-border-strong)',
  borderRadius: '12px',
  color: 'var(--color-earth)',
  fontFamily: 'var(--font-body)',
  boxShadow: '0 10px 24px rgba(87, 61, 33, 0.14)',
};

// Chart colours stay inside the site palette (sage / purple / orange / teal).
const C = {
  vegan: '#7f9a5f',
  vegetarian: '#9d82ab',
  meat: '#e3a36e',
  water: '#5f8f94',
  carbon: '#9d82ab',
  land: '#e3a36e',
};

const TABS = {
  comparison: {
    label: 'Diet comparison',
    title: 'How diets compare',
    blurb: 'Index where a high-meat diet equals 100. Lower is lighter on the planet.',
    takeaway: 'A vegan diet comes out at roughly 40% of a high-meat diet’s carbon footprint and a quarter of its farmland.',
  },
  weekly: {
    label: 'One week, vegan',
    title: 'A week of vegan days',
    blurb: 'A projection of what accumulates if every day looks like a typical vegan day.',
    takeaway: 'About 30 kg of CO₂e avoided in a week. Over a year, that adds up to roughly 1.6 tonnes.',
  },
};

export default function Impact() {
  const [activeTab, setActiveTab] = useState('comparison');
  const [openCards, setOpenCards] = useState({});
  const toggleCard = (id) => setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section id="impact" className={styles.section}>
      <SectionHeader
        label="Ecology Tracker"
        title="Environmental Impact"
        description="Every plant-based dish is an act of restoration, accumulating savings in water, land, carbon emissions, and forests."
      />

      <div className={styles.statsGrid}>
        {impactStats.map((stat, idx) => {
          const isOpen = Boolean(openCards[stat.id]);
          return (
            <motion.article
              key={stat.id}
              className={`${styles.book} ${isOpen ? styles.bookOpen : ''}`}
              style={{ '--accent': stat.color }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
            >
              {/* ————— inside page ————— */}
              <div className={styles.page}>
                <header className={styles.pageTop}>
                  <span className={styles.pageKicker}>
                    <span className={styles.pageIcon} aria-hidden="true">{ICON_MAP[stat.icon]}</span>
                    {stat.kicker}
                  </span>
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={() => toggleCard(stat.id)}
                    aria-label={`Close ${stat.title}`}
                    tabIndex={isOpen ? 0 : -1}
                  >
                    <FiX aria-hidden="true" />
                  </button>
                </header>

                <p className={styles.statValue}>
                  <StatCounter value={stat.value} />
                  <span className={styles.statUnit}>{stat.unit}</span>
                </p>
                <h3 className={styles.statTitle}>{stat.title}</h3>
                <p className={styles.statDesc}>{stat.desc}</p>

                <Meter meter={stat.meter} />

                <div className={styles.statSources}>
                  <ReferenceList refs={stat.references} compact />
                </div>
              </div>

              {/* ————— gatefold cover ————— */}
              <div className={`${styles.door} ${styles.doorLeft}`} aria-hidden="true">
                <CoverArt stat={stat} index={idx} />
              </div>
              <div className={`${styles.door} ${styles.doorRight}`} aria-hidden="true">
                <CoverArt stat={stat} index={idx} />
              </div>

              {/* tap / keyboard target while the book is closed */}
              <button
                type="button"
                className={styles.opener}
                onClick={() => toggleCard(stat.id)}
                aria-expanded={isOpen}
                aria-label={`Open: ${stat.title}`}
              />
            </motion.article>
          );
        })}
      </div>

      <p className={styles.statsNote}>
        Per-person figures are rounded, illustrative estimates for one year of plant-based eating
        compared with a typical meat-based diet. Global figures link to their source.
      </p>

      <motion.div
        className={styles.chartCard}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.chartHeader}>
          <div>
            <p className={styles.chartKicker}>Dashboard</p>
            <h3 className={styles.chartTitle}>{TABS[activeTab].title}</h3>
            <p className={styles.chartSubtitle}>{TABS[activeTab].blurb}</p>
          </div>
          <div className={styles.tabGroup} role="tablist" aria-label="Choose a chart">
            {Object.entries(TABS).map(([key, tab]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <p className={styles.takeaway}>
          <mark>{TABS[activeTab].takeaway}</mark>
        </p>

        <div className={styles.chartContainer} role="img" aria-label={TABS[activeTab].blurb}>
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'comparison' ? (
              <BarChart data={resourceComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} stroke="var(--color-earth)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-earth)', fontSize: 13, fontWeight: 600 }} stroke="rgba(87,61,33,0.2)" />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-earth)', fontSize: 11 }} stroke="rgba(87,61,33,0.2)" />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(87,61,33,0.05)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 12, fontSize: 13 }} />
                <Bar dataKey="Vegan" fill={C.vegan} radius={[6, 6, 0, 0]} />
                <Bar dataKey="Vegetarian" fill={C.vegetarian} radius={[6, 6, 0, 0]} />
                <Bar dataKey="High-meat" fill={C.meat} radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={weeklySavingsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.water} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={C.water} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.carbon} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={C.carbon} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gLand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.land} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={C.land} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="var(--color-earth)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--color-earth)', fontSize: 12, fontWeight: 600 }} stroke="rgba(87,61,33,0.2)" />
                <YAxis yAxisId="left" tick={{ fill: C.water, fontSize: 11 }} stroke="rgba(95,143,148,0.4)" />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--color-earth)', fontSize: 11 }} stroke="rgba(87,61,33,0.2)" />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 12, fontSize: 13 }} />
                <Area name="Water saved (L)" type="monotone" dataKey="Water" yAxisId="left" stroke={C.water} fill="url(#gWater)" strokeWidth={2.5} />
                <Area name="CO₂e avoided (kg)" type="monotone" dataKey="CO2" yAxisId="right" stroke={C.carbon} fill="url(#gCO2)" strokeWidth={2} />
                <Area name="Land spared (sq. ft)" type="monotone" dataKey="Land" yAxisId="right" stroke={C.land} fill="url(#gLand)" strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <Callout variant="note">
          {activeTab === 'comparison'
            ? 'Carbon values follow a UK study of about 55,000 people; land follows a global farm-level analysis. Water and the vegetarian land value are rounded estimates for scale.'
            : 'This is a projection, not a measurement of your own week. Water and land per day are rounded estimates; CO₂e is the difference between 7.2 and 2.9 kg per day.'}
        </Callout>
      </motion.div>

      <div className={styles.chartRefs}>
        <ReferenceList
          panel
          refs={activeTab === 'comparison' ? chartReferences.comparison : chartReferences.weekly}
          title="Data sources"
        />
      </div>
    </section>
  );
}
