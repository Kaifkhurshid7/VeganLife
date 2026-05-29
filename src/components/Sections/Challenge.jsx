import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFire, FaCircleCheck, FaStar } from 'react-icons/fa6';

export default function Challenge() {
  const [activeChallenge, setActiveChallenge] = useState('seven-day');
  
  // States for checklists
  const [sevenDayChecked, setSevenDayChecked] = useState(new Array(7).fill(false));
  const [mondayChecked, setMondayChecked] = useState(new Array(3).fill(false));
  const [oneMealChecked, setOneMealChecked] = useState(new Array(3).fill(false));

  const toggleCheck = (idx, list, setList) => {
    const updated = [...list];
    updated[idx] = !updated[idx];
    setList(updated);
  };

  // Calculating completion rates
  const getProgress = (list) => {
    const checkedCount = list.filter(Boolean).length;
    return Math.round((checkedCount / list.length) * 100);
  };

  const challengeData = {
    'seven-day': {
      title: "7-Day Vegan Challenge",
      desc: "Perfect for beginners. Commit to eating fully plant-based for one week and feel the transformation in your energy and mood.",
      badge: "Earth Champion",
      streak: 7,
      color: "var(--color-sage)",
      list: sevenDayChecked,
      setList: setSevenDayChecked,
      tasks: [
        "Day 1: Blend a fruit & hemp seed smoothie",
        "Day 2: Swap milk for fortified soy or almond milk",
        "Day 3: Prepare a black bean & sweet potato bowl",
        "Day 4: Order a plant-based option at the campus diner",
        "Day 5: Cook the slow-simmered creamy lentil curry",
        "Day 6: Check out our Nutrition Guide B12 facts",
        "Day 7: Pre-prep three healthy plant-based snacks"
      ]
    },
    'meatless': {
      title: "Meatless Mondays",
      desc: "Small steps, massive footprint impact. Replace meat on your plate every single Monday for three consecutive weeks.",
      badge: "Green Catalyst",
      streak: 3,
      color: "var(--color-orange)",
      list: mondayChecked,
      setList: setMondayChecked,
      tasks: [
        "Week 1 Monday: Cook zero-meat protein bowl",
        "Week 2 Monday: Swap standard taco beef for seasoned chickpeas",
        "Week 3 Monday: Enjoy three fully green meals today"
      ]
    },
    'one-green': {
      title: "One Green Meal Daily",
      desc: "Consistency is key. Commit to replacing just one standard meal each day with a vibrant, high-protein plant-based alternative.",
      badge: "Sustained Guard",
      streak: 3,
      color: "var(--color-purple)",
      list: oneMealChecked,
      setList: setOneMealChecked,
      tasks: [
        "Commit to a fully plant-based breakfast every day",
        "Prep raw fruits, seed crackers, & hummus as snacks",
        "Try plant-rich options for one week straight"
      ]
    }
  };

  const current = challengeData[activeChallenge];
  const progressPercent = getProgress(current.list);

  return (
    <section id="challenge" style={{ background: 'linear-gradient(to bottom, var(--bg-color) 0%, var(--color-clay) 100%)' }}>
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
          Activation
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Student Challenges
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.8, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Turn green consciousness into action. Choose your pace, track your daily checkmarks, and unlock sustainability badges.
        </motion.p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '40px',
          maxWidth: '1100px',
          margin: '0 auto'
        }}
        className="challenge-container"
      >
        <style>{`
          .challenge-container {
            grid-template-columns: 1fr !important;
          }
          @media (min-width: 992px) {
            .challenge-container {
              grid-template-columns: 1fr 1.8fr !important;
            }
          }
        `}</style>

        {/* Left Side: Challenge Selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.keys(challengeData).map((key) => {
            const item = challengeData[key];
            const active = activeChallenge === key;
            const itemPercent = getProgress(item.list);

            return (
              <motion.div
                key={key}
                onClick={() => setActiveChallenge(key)}
                className="glass-card"
                style={{
                  cursor: 'pointer',
                  borderColor: active ? item.color : 'var(--glass-border)',
                  borderWidth: active ? '2px' : '1px',
                  backgroundColor: active ? 'rgba(255,255,255,0.45)' : 'var(--glass-bg)',
                  padding: '24px'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-earth)', margin: 0 }}>
                    {item.title}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-orange)', fontSize: '0.9rem', fontWeight: 700 }}>
                    <FaFire /> {item.streak}
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', lineHeight: 1.5, opacity: 0.8, marginBottom: '12px' }}>
                  {item.desc.substring(0, 85)}...
                </p>

                {/* mini progress line */}
                <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(87,61,33,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${itemPercent}%`, height: '100%', backgroundColor: item.color, transition: 'width 0.4s ease' }} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: Active Checklist Dashboard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChallenge}
            className="glass-card"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.4 }}
            style={{
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '1.9rem', color: 'var(--color-earth)' }}>
                  {current.title}
                </h3>

                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: current.color, backgroundColor: 'rgba(255,255,255,0.4)', padding: '4px 12px', borderRadius: '30px', border: '1px solid var(--glass-border)' }}>
                  Streak: {current.streak} Days
                </span>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-light)', opacity: 0.9 }}>
                {current.desc}
              </p>
            </div>

            {/* Progress calculation with circle/horizontal view */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700 }}>
                <span>Challenge Completion</span>
                <span style={{ color: current.color }}>{progressPercent}%</span>
              </div>
              
              <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(87,61,33,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', backgroundColor: current.color }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
              {current.tasks.map((task, idx) => {
                const checked = current.list[idx];

                return (
                  <div
                    key={task}
                    onClick={() => toggleCheck(idx, current.list, current.setList)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '16px 20px',
                      backgroundColor: checked ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255,255,255,0.2)',
                      border: `1px solid ${checked ? current.color : 'var(--glass-border)'}`,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div style={{ fontSize: '1.4rem', color: checked ? current.color : 'rgba(87,61,33,0.25)', display: 'flex', flexShrink: 0 }}>
                      <FaCircleCheck />
                    </div>

                    <span
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 600,
                        color: checked ? 'var(--color-text-dark)' : 'var(--color-text-light)',
                        textDecoration: checked ? 'line-through' : 'none',
                        opacity: checked ? 0.6 : 1,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {task}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Completion Congratulatory Badge POP */}
            <AnimatePresence>
              {progressPercent === 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
                    backgroundColor: 'rgba(255,247,239,0.95)',
                    border: `2px dashed ${current.color}`,
                    borderRadius: '20px',
                    padding: '24px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '15px'
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                    style={{ fontSize: '2.4rem', color: 'var(--color-orange)' }}
                  >
                    <FaStar />
                  </motion.div>
                  
                  <h4 style={{ fontSize: '1.4rem', color: 'var(--color-earth)', margin: 0 }}>
                    Challenge Fully Accomplished!
                  </h4>
                  
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>
                    You have unlocked the highly esteemed <strong style={{ color: current.color }}>{current.badge}</strong> digital milestone! Keep up this incredible sustainability streak.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
