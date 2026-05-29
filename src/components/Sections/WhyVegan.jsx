import React from 'react';
import { motion } from 'framer-motion';
import { FaEarthAmericas, FaHeartPulse, FaHandHoldingHeart, FaSeedling } from 'react-icons/fa6';

export default function WhyVegan() {
  const cards = [
    {
      icon: <FaEarthAmericas />,
      title: "Environment",
      desc: "Animal farming accounts for 14.5% of global greenhouse emissions. A plant-based diet reduces your food's carbon footprint by up to 73% and helps combat the climate crisis.",
      color: "var(--color-sage)"
    },
    {
      icon: <FaHeartPulse />,
      title: "Health",
      desc: "Rich in complex fiber, antioxidants, and pure clean nutrients. Plant-based diets reduce the risk of cardiovascular illnesses, lower high blood pressure, and boost mental clarity.",
      color: "var(--color-orange)"
    },
    {
      icon: <FaHandHoldingHeart />,
      title: "Compassion",
      desc: "Every animal is a conscious, feeling being that experiences joy, fear, and pain. Choosing plant options helps build a kinder society, preventing animal farming suffering.",
      color: "var(--color-purple)"
    },
    {
      icon: <FaSeedling />,
      title: "Sustainability",
      desc: "We grow enough crops to feed 10 billion people, yet millions go hungry because 70% is fed to livestock. Vegan feeding is the most efficient, equitable resource model.",
      color: "var(--color-earth)"
    }
  ];

  // Mouse move handler to update card gradient coordinates (gives realistic glow)
  const handleMouseMove = (e, idx) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section id="why-vegan" style={{ backgroundColor: 'var(--bg-color)' }}>
      {/* Visual Organic Wave Border */}
      <div className="organic-divider divider-top">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
        </svg>
      </div>

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
          Core Pillars
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Why Veganism?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A single food choice can act as a catalyst, improving your personal well-being while initiating global ecological recovery.
        </motion.p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            className="glass-card glow-card"
            onMouseMove={(e) => handleMouseMove(e, idx)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '20px'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                color: card.color,
                boxShadow: '0 4px 12px rgba(87,61,33,0.06)'
              }}
            >
              {card.icon}
            </div>

            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-earth)' }}>
              {card.title}
            </h3>

            <p style={{ fontSize: '1rem', color: 'var(--color-text-light)', opacity: 0.9 }}>
              {card.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
