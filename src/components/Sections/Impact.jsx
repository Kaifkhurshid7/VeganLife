import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FaDroplet, FaCloud, FaEarthAmericas, FaTree } from 'react-icons/fa6';
import { impactStats, resourceComparisonData, weeklySavingsData } from '../../data/statistics';

// Smooth counting component
function Counter({ value, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    
    // Parse numeric value
    const cleanVal = parseFloat(value.replace(/,/g, ''));
    if (isNaN(cleanVal)) {
      setCount(value);
      return;
    }

    let start = 0;
    const end = cleanVal;
    const increment = end / (duration * 60); // 60fps
    
    let timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(value); // Set final string with commas
      } else {
        setCount(Math.floor(start).toLocaleString());
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Impact() {
  const [activeChartTab, setActiveChartTab] = useState('comparison'); // 'comparison' or 'weekly'

  const iconMap = {
    FaDroplet: <FaDroplet />,
    FaCloud: <FaCloud />,
    FaGlobeAmericas: <FaEarthAmericas />,
    FaTree: <FaTree />
  };

  return (
    <section id="impact" style={{ background: 'linear-gradient(to bottom, var(--bg-color) 0%, var(--color-clay) 100%)' }}>
      <div className="section-header">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-block',
            fontSize: '0.95rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'var(--color-earth)',
            fontWeight: 700,
            marginBottom: '10px'
          }}
        >
          Ecology Tracker
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Environmental Impact
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Every plant-based dish is an act of restoration, accumulating savings in water, land, carbon emissions, and forests.
        </motion.p>
      </div>

      {/* Grid of Interactive counters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto 60px auto'
        }}
      >
        {impactStats.map((stat, idx) => (
          <motion.div
            key={stat.id}
            className="glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: idx * 0.1 }}
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '30px'
            }}
          >
            <div
              style={{
                fontSize: '2.2rem',
                color: stat.color,
                marginBottom: '5px'
              }}
            >
              {iconMap[stat.icon]}
            </div>

            <h3 style={{ fontSize: '3rem', margin: 0, fontFamily: 'var(--font-headings)' }}>
              <Counter value={stat.value} />
              <span style={{ fontSize: '1.2rem', marginLeft: '5px', fontWeight: 500, color: 'var(--color-earth)' }}>
                {stat.unit}
              </span>
            </h3>

            <h4 style={{ fontSize: '1.2rem', color: 'var(--color-earth)', opacity: 0.8 }}>
              {stat.title}
            </h4>

            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', opacity: 0.85 }}>
              {stat.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Interactive Chart Section */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '40px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '35px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-earth)' }}>
              Ecological Savings Dashboard
            </h3>
            <p style={{ fontSize: '0.95rem', opacity: 0.85 }}>
              Compare global models or check your personal weekly accumulation graph.
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'rgba(87, 61, 33, 0.08)',
              padding: '4px',
              borderRadius: '30px',
              border: '1px solid rgba(87,61,33,0.08)'
            }}
          >
            <button
              onClick={() => setActiveChartTab('comparison')}
              style={{
                background: activeChartTab === 'comparison' ? 'var(--color-earth)' : 'transparent',
                color: activeChartTab === 'comparison' ? 'var(--color-cream)' : 'var(--color-earth)',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Models Comparison
            </button>
            <button
              onClick={() => setActiveChartTab('weekly')}
              style={{
                background: activeChartTab === 'weekly' ? 'var(--color-earth)' : 'transparent',
                color: activeChartTab === 'weekly' ? 'var(--color-cream)' : 'var(--color-earth)',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Weekly Vegan Progress
            </button>
          </div>
        </div>

        {/* Recharts Area Chart container */}
        <div style={{ width: '100%', height: '320px', overflow: 'hidden' }}>
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'comparison' ? (
              <AreaChart
                data={resourceComparisonData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorOmni" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-orange)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-orange)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-purple)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-purple)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVegan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sage)" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="var(--color-sage)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="var(--color-earth)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-earth)', fontSize: 12, fontWeight: 500 }} stroke="rgba(87,61,33,0.15)" />
                <YAxis tick={{ fill: 'var(--color-earth)', fontSize: 11 }} stroke="rgba(87,61,33,0.15)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-cream)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    color: 'var(--color-earth)',
                    fontFamily: 'var(--font-body)'
                  }}
                />
                <Area name="Omnivore Diet" type="monotone" dataKey="Omnivore" stroke="var(--color-orange)" fillOpacity={1} fill="url(#colorOmni)" strokeWidth={2} />
                <Area name="Vegetarian Diet" type="monotone" dataKey="Vegetarian" stroke="var(--color-purple)" fillOpacity={1} fill="url(#colorVeg)" strokeWidth={2} />
                <Area name="Vegan Diet" type="monotone" dataKey="Vegan" stroke="var(--color-sage)" fillOpacity={1} fill="url(#colorVegan)" strokeWidth={2.5} />
              </AreaChart>
            ) : (
              <AreaChart
                data={weeklySavingsData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="var(--color-earth)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--color-earth)', fontSize: 12, fontWeight: 500 }} stroke="rgba(87,61,33,0.15)" />
                <YAxis tick={{ fill: 'var(--color-earth)', fontSize: 11 }} stroke="rgba(87,61,33,0.15)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-cream)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    color: 'var(--color-earth)',
                    fontFamily: 'var(--font-body)'
                  }}
                />
                <Area name="Water Saved (Liters)" type="monotone" dataKey="Water" stroke="#8884d8" fillOpacity={1} fill="url(#colorWater)" strokeWidth={2.5} />
                <Area name="CO₂ Saved (Kilograms)" type="monotone" dataKey="CO2" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCO2)" strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}
