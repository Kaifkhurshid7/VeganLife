import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookmark, FaClock, FaTag, FaCheckCircle } from 'react-icons/fa';
import { nutritionCategories, studentVeganDiet } from '../../data/nutrition';

export default function Nutrition() {
  const [activeTab, setActiveTab] = useState('protein');

  const selectedCategory = nutritionCategories.find((cat) => cat.id === activeTab) || nutritionCategories[0];

  return (
    <section id="nutrition" style={{ backgroundColor: 'var(--bg-color)' }}>
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
          Clean Energy
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Nutrition Guide
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Unlock absolute physical vitality with vibrant, fiber-dense, and highly bioavailable plant foods.
        </motion.p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
        className="nutrition-layout"
      >
        {/* Main interactive dashboard */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '30px'
          }}
          className="dashboard-grid"
        >
          {/* Tab buttons */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '10px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            className="tabs-container"
          >
            {nutritionCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                style={{
                  border: 'none',
                  background: activeTab === cat.id ? 'var(--color-earth)' : 'var(--glass-bg)',
                  color: activeTab === cat.id ? 'var(--color-cream)' : 'var(--color-earth)',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--glass-border)',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <style>{`
            .tabs-container::-webkit-scrollbar {
              display: none;
            }
            .nutrition-layout {
              grid-template-columns: 1fr !important;
            }
            @media (min-width: 1024px) {
              .nutrition-layout {
                grid-template-columns: 1.2fr 1fr !important;
              }
            }
          `}</style>

          {/* Tab content panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--color-earth)', marginBottom: '10px' }}>
                  {selectedCategory.name}
                </h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--color-text-light)', opacity: 0.9 }}>
                  {selectedCategory.desc}
                </p>
              </div>

              {/* Progress bar list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {selectedCategory.items.map((item, idx) => (
                  <div key={item.food} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 600 }}>
                      <span style={{ color: 'var(--color-earth)' }}>{item.food}</span>
                      <span style={{ opacity: 0.8 }}>{item.quantity}</span>
                    </div>

                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: 'rgba(87,61,33,0.06)',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(item.pct, 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                        style={{
                          height: '100%',
                          backgroundColor: activeTab === 'protein' ? 'var(--color-sage)' :
                                           activeTab === 'iron' ? 'var(--color-orange)' :
                                           activeTab === 'calcium' ? 'var(--color-purple)' :
                                           'var(--color-earth)',
                          borderRadius: '10px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Student Diet schedule card */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            border: '1.5px solid var(--color-sage)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            backgroundColor: 'rgba(166, 180, 143, 0.15)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FaBookmark style={{ color: 'var(--color-orange)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-earth)' }}>
                Featured Routine
              </span>
            </div>
            
            <h3 style={{ fontSize: '2rem', color: 'var(--color-earth)', marginBottom: '8px' }}>
              {studentVeganDiet.title}
            </h3>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--color-earth)', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--glass-bg)', padding: '4px 10px', borderRadius: '30px' }}>
                <FaTag style={{ fontSize: '0.8rem' }} /> {studentVeganDiet.calories}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--glass-bg)', padding: '4px 10px', borderRadius: '30px' }}>
                <FaClock style={{ fontSize: '0.8rem' }} /> {studentVeganDiet.cost}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {studentVeganDiet.highlights.map((h) => (
              <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                <FaCheckCircle style={{ color: 'var(--color-sage)', flexShrink: 0 }} />
                <span>{h}</span>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(87,61,33,0.1)' }} />

          {/* Daily Schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {studentVeganDiet.schedule.map((item) => (
              <div key={item.meal} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-orange)', letterSpacing: '1px' }}>
                    {item.meal}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-earth)', opacity: 0.7, fontWeight: 600 }}>
                    Prep: {item.prep}
                  </span>
                </div>
                
                <h4 style={{ fontSize: '1.15rem', color: 'var(--color-earth)', fontWeight: 700 }}>
                  {item.title}
                </h4>
                
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', opacity: 0.9, lineHeight: 1.6 }}>
                  {item.details}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
