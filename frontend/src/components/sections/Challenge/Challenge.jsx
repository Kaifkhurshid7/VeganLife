import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFire, FaCircleCheck, FaStar } from 'react-icons/fa6';
import { SectionHeader } from '../../ui';
import { Fireflies } from '../../ambient';
import { CHALLENGE_DATA } from './challengeData';
import styles from './Challenge.module.css';

function getProgress(list) {
  return Math.round((list.filter(Boolean).length / list.length) * 100);
}

export default function Challenge() {
  const [activeChallenge, setActiveChallenge] = useState('seven-day');
  
  // Initialize state for all challenges dynamically
  const [challengeStates, setChallengeStates] = useState(() => {
    const states = {};
    Object.entries(CHALLENGE_DATA).forEach(([key, data]) => {
      states[key] = new Array(data.tasks.length).fill(false);
    });
    return states;
  });

  const toggleCheck = (idx) => {
    setChallengeStates((prev) => {
      const updated = [...prev[activeChallenge]];
      updated[idx] = !updated[idx];
      return { ...prev, [activeChallenge]: updated };
    });
  };

  const current = CHALLENGE_DATA[activeChallenge];
  const currentState = challengeStates[activeChallenge] || [];
  const progressPercent = currentState.length > 0 ? getProgress(currentState) : 0;

  return (
    <section id="challenge" className={styles.section}>
      <Fireflies count={6} />
      <SectionHeader
        label="Activation"
        title="Student Challenges"
        description="Turn green consciousness into action. Choose your pace, track your daily checkmarks, and unlock sustainability badges."
      />

      <div className={styles.container}>
        <div className={styles.selectors}>
          {Object.entries(CHALLENGE_DATA).map(([key, item]) => {
            const isActive = activeChallenge === key;
            const itemPercent = challengeStates[key] ? getProgress(challengeStates[key]) : 0;

            return (
              <motion.div
                key={key}
                className={`glass-card ${styles.selectorCard}`}
                style={{
                  borderColor: isActive ? item.color : undefined,
                  borderWidth: isActive ? '2px' : undefined,
                  backgroundColor: isActive ? 'rgba(255,255,255,0.45)' : undefined,
                }}
                onClick={() => setActiveChallenge(key)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className={styles.selectorHeader}>
                  <h3>{item.title}</h3>
                  <div className={styles.streak}><FaFire /> {item.streak}</div>
                </div>
                <p className={styles.selectorDesc}>{item.desc.substring(0, 85)}...</p>
                <div className={styles.miniProgress}>
                  <div className={styles.miniProgressFill} style={{ width: `${itemPercent}%`, backgroundColor: item.color }} />
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={activeChallenge}
              className={`glass-card ${styles.dashboard}`}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.dashboardHeader}>
                <div className={styles.dashboardTitleRow}>
                  <h3>{current.title}</h3>
                  <span className={styles.streakBadge} style={{ color: current.color }}>
                    Streak: {current.streak} Days
                  </span>
                </div>
                <p>{current.desc}</p>
              </div>

              <div className={styles.progressSection}>
                <div className={styles.progressLabel}>
                  <span>Challenge Completion</span>
                  <span style={{ color: current.color }}>{progressPercent}%</span>
                </div>
                <div className={styles.progressTrack}>
                  <motion.div
                    className={styles.progressFill}
                    style={{ backgroundColor: current.color }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <div className={styles.checklist}>
                {current && current.tasks && current.tasks.map((task, idx) => {
                  const checked = currentState[idx];
                  return (
                    <div
                      key={task}
                      className={styles.checkItem}
                      style={{ borderColor: checked ? current.color : undefined, backgroundColor: checked ? 'rgba(255,255,255,0.45)' : undefined }}
                      onClick={() => toggleCheck(idx)}
                    >
                      <FaCircleCheck className={styles.checkIcon} style={{ color: checked ? current.color : 'rgba(87,61,33,0.25)' }} />
                      <span className={checked ? styles.checkedText : ''}>{task}</span>
                    </div>
                  );
                })}
              </div>

              <AnimatePresence>
                {progressPercent === 100 && (
                  <motion.div
                    className={styles.completionBadge}
                    style={{ borderColor: current.color }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                      className={styles.starIcon}
                    >
                      <FaStar />
                    </motion.div>
                    <h4>Challenge Fully Accomplished!</h4>
                    <p>
                      You have unlocked the highly esteemed <strong style={{ color: current.color }}>{current.badge}</strong> digital milestone!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
