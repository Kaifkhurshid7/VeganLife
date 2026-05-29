import { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FaDroplet, FaCloud, FaEarthAmericas, FaTree } from 'react-icons/fa6';
import { SectionHeader } from '../../ui';
import { useCounter } from '../../../hooks';
import { impactStats, resourceComparisonData, weeklySavingsData } from '../../../data/statistics';
import styles from './Impact.module.css';

const ICON_MAP = {
  FaDroplet: <FaDroplet />,
  FaCloud: <FaCloud />,
  FaGlobeAmericas: <FaEarthAmericas />,
  FaTree: <FaTree />,
};

function StatCounter({ value }) {
  const { ref, count } = useCounter(value);
  return <span ref={ref}>{count}</span>;
}

const TOOLTIP_STYLE = {
  backgroundColor: 'var(--color-cream)',
  border: '1px solid var(--glass-border)',
  borderRadius: '12px',
  color: 'var(--color-earth)',
  fontFamily: 'var(--font-body)',
};

export default function Impact() {
  const [activeTab, setActiveTab] = useState('comparison');

  return (
    <section id="impact" className={styles.section}>
      <SectionHeader
        label="Ecology Tracker"
        title="Environmental Impact"
        description="Every plant-based dish is an act of restoration, accumulating savings in water, land, carbon emissions, and forests."
      />

      <div className={styles.statsGrid}>
        {impactStats.map((stat, idx) => (
          <motion.div
            key={stat.id}
            className="glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: idx * 0.1 }}
            style={{ textAlign: 'center' }}
          >
            <div className={styles.statIcon} style={{ color: stat.color }}>
              {ICON_MAP[stat.icon]}
            </div>
            <h3 className={styles.statValue}>
              <StatCounter value={stat.value} />
              <span className={styles.statUnit}>{stat.unit}</span>
            </h3>
            <h4 className={styles.statTitle}>{stat.title}</h4>
            <p className={styles.statDesc}>{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className={`glass-card ${styles.chartCard}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Ecological Savings Dashboard</h3>
            <p className={styles.chartSubtitle}>
              Compare global models or check your personal weekly accumulation graph.
            </p>
          </div>
          <div className={styles.tabGroup}>
            <button
              className={`${styles.tab} ${activeTab === 'comparison' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('comparison')}
            >
              Models Comparison
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'weekly' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('weekly')}
            >
              Weekly Vegan Progress
            </button>
          </div>
        </div>

        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'comparison' ? (
              <AreaChart data={resourceComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOmni" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-orange)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-orange)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-purple)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-purple)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVegan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sage)" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="var(--color-sage)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="var(--color-earth)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-earth)', fontSize: 12, fontWeight: 500 }} stroke="rgba(87,61,33,0.15)" />
                <YAxis tick={{ fill: 'var(--color-earth)', fontSize: 11 }} stroke="rgba(87,61,33,0.15)" />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area name="Omnivore Diet" type="monotone" dataKey="Omnivore" stroke="var(--color-orange)" fillOpacity={1} fill="url(#colorOmni)" strokeWidth={2} />
                <Area name="Vegetarian Diet" type="monotone" dataKey="Vegetarian" stroke="var(--color-purple)" fillOpacity={1} fill="url(#colorVeg)" strokeWidth={2} />
                <Area name="Vegan Diet" type="monotone" dataKey="Vegan" stroke="var(--color-sage)" fillOpacity={1} fill="url(#colorVegan)" strokeWidth={2.5} />
              </AreaChart>
            ) : (
              <AreaChart data={weeklySavingsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="var(--color-earth)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--color-earth)', fontSize: 12, fontWeight: 500 }} stroke="rgba(87,61,33,0.15)" />
                <YAxis tick={{ fill: 'var(--color-earth)', fontSize: 11 }} stroke="rgba(87,61,33,0.15)" />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area name="Water Saved (Liters)" type="monotone" dataKey="Water" stroke="#8884d8" fillOpacity={1} fill="url(#colorWater)" strokeWidth={2.5} />
                <Area name="CO2 Saved (Kilograms)" type="monotone" dataKey="CO2" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCO2)" strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}
