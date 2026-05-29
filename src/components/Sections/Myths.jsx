import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRotate } from 'react-icons/fa6';

export default function Myths() {
  const myths = [
    {
      id: 1,
      myth: "“Vegans can't get enough protein”",
      reality: "Completely False",
      fact: "Plant foods are loaded with clean, cholesterol-free proteins. 1 cup of cooked lentils has 18g of protein, and tempeh has 20g per 100g. Standard grains and beans provide all nine essential amino acids when combined throughout the day.",
      color: "var(--color-sage)"
    },
    {
      id: 2,
      myth: "“Plant-based eating is too expensive”",
      reality: "A Budget Myth",
      fact: "The core staples of a vegan diet—oats, rice, dry beans, lentils, sweet potatoes, and seasonal greens—are the cheapest food ingredients on Earth. Bulk cooking saves up to 40% on monthly food costs compared to buying meats and cheeses.",
      color: "var(--color-orange)"
    },
    {
      id: 3,
      myth: "“Vegans only eat boring salads”",
      reality: "Infinitely Diverse",
      fact: "The vegan catalog includes artisanal sweet potato tacos, high-protein plant burgers, rich coconut lentil curries, rich avocado pastas, and creamy fruit power shakes. It is an invitation to explore a world of rich spices, grains, and textures.",
      color: "var(--color-purple)"
    }
  ];

  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="myths" style={{ backgroundColor: 'var(--bg-color)' }}>
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
          Fact vs Fiction
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Vegan Myths Busted
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Let's separate cultural misconceptions from peer-reviewed nutritional and environmental science.
        </motion.p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          maxWidth: '1100px',
          margin: '0 auto'
        }}
      >
        {myths.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => toggleFlip(item.id)}
            style={{
              perspective: '1000px',
              height: '350px',
              cursor: 'pointer'
            }}
            className="myth-card-container"
          >
            <motion.div
              style={{
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}
              animate={{ rotateY: flippedCards[item.id] ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="myth-card-inner"
            >
              {/* Front Side */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '40px',
                  backgroundColor: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(87,61,33,0.04)'
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(87,61,33,0.06)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-earth)',
                    marginBottom: '20px',
                    letterSpacing: '1px'
                  }}
                >
                  Common Myth
                </div>

                <h3
                  style={{
                    fontSize: '1.9rem',
                    color: 'var(--color-earth)',
                    lineHeight: 1.3,
                    fontFamily: 'var(--font-headings)'
                  }}
                >
                  {item.myth}
                </h3>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    color: 'var(--color-earth)',
                    opacity: 0.7,
                    fontWeight: 700
                  }}
                >
                  <FaRotate /> Tap to Reveal Fact
                </div>
              </div>

              {/* Back Side */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '40px',
                  backgroundColor: 'var(--color-cream)',
                  border: `2px solid ${item.color}`,
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
                }}
              >
                <div
                  style={{
                    backgroundColor: item.color,
                    color: 'var(--color-cream)',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    marginBottom: '15px'
                  }}
                >
                  {item.reality}
                </div>

                <p
                  style={{
                    fontSize: '0.98rem',
                    color: 'var(--color-text-dark)',
                    lineHeight: 1.7,
                    opacity: 0.95
                  }}
                >
                  {item.fact}
                </p>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    fontSize: '0.75rem',
                    color: 'var(--color-earth)',
                    opacity: 0.6,
                    fontWeight: 700
                  }}
                >
                  Tap to Flip Back
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
