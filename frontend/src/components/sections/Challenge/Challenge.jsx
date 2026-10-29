import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaAward, FaRotateLeft, FaLock } from 'react-icons/fa6';
import { SectionHeader } from '../../ui';
import { Fireflies } from '../../ambient';
import { CHALLENGE_DATA } from './challengeData';
import styles from './Challenge.module.css';

// One accent per challenge, kept inside the site palette.
const PALETTE = ['#7f9a5f', '#e3a36e', '#9d82ab', '#6f9a9a', '#b07a4a'];

const RING_R = 34;
const RING_C = 2 * Math.PI * RING_R;

const percentOf = (list = []) =>
  list.length ? Math.round((list.filter(Boolean).length / list.length) * 100) : 0;

function Ring({ percent, color, size = 84 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 84 84" className={styles.ring} aria-hidden="true">
      <circle cx="42" cy="42" r={RING_R} className={styles.ringTrack} />
      <circle
        cx="42"
        cy="42"
        r={RING_R}
        className={styles.ringFill}
        stroke={color}
        strokeDasharray={RING_C}
        strokeDashoffset={RING_C * (1 - percent / 100)}
      />
    </svg>
  );
}

export default function Challenge() {
  const entries = useMemo(
    () => Object.entries(CHALLENGE_DATA).map(([key, data], i) => ({ key, ...data, color: PALETTE[i % PALETTE.length] })),
    []
  );

  const [activeKey, setActiveKey] = useState(entries[0].key);
  const [states, setStates] = useState(() =>
    Object.fromEntries(entries.map((e) => [e.key, new Array(e.tasks.length).fill(false)]))
  );

  const current = entries.find((e) => e.key === activeKey);
  const currentState = states[activeKey];
  const percent = percentOf(currentState);
  const done = currentState.filter(Boolean).length;
  const complete = percent === 100;

  const toggle = (idx) =>
    setStates((prev) => {
      const next = [...prev[activeKey]];
      next[idx] = !next[idx];
      return { ...prev, [activeKey]: next };
    });

  const reset = () =>
    setStates((prev) => ({ ...prev, [activeKey]: new Array(current.tasks.length).fill(false) }));

  return (
    <section id="challenge" className={styles.section}>
      <Fireflies count={6} />
      <SectionHeader
        label="Activation"
        title="Student Challenges"
        description="Turn green consciousness into action. Choose your pace, stamp each step as you complete it, and earn a badge at the end."
      />

      <div className={styles.layout}>
        {/* ————— challenge picker ————— */}
        <div className={styles.picker} role="radiogroup" aria-label="Choose a challenge">
          <p className={styles.pickerTitle}>{entries.length} challenges</p>
          <div className={styles.pickerList}>
            {entries.map((item) => {
              const p = percentOf(states[item.key]);
              const active = item.key === activeKey;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`${styles.pick} ${active ? styles.pickActive : ''}`}
                  style={{ '--accent': item.color }}
                  onClick={() => setActiveKey(item.key)}
                >
                  <span className={styles.pickDot} aria-hidden="true" />
                  <span className={styles.pickText}>
                    <span className={styles.pickName}>{item.title}</span>
                    <span className={styles.pickMeta}>{item.tasks.length} steps · {p}% done</span>
                  </span>
                  <span className={styles.pickBar} aria-hidden="true">
                    <span style={{ width: `${p}%` }} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ————— the passport ————— */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeKey}
            className={styles.passport}
            style={{ '--accent': current.color }}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.35 }}
          >
            <header className={styles.cover}>
              <div className={styles.coverText}>
                <p className={styles.kicker}>Green passport</p>
                <h3>{current.title}</h3>
                <p className={styles.desc}>{current.desc}</p>
              </div>
              <div className={styles.progress}>
                <Ring percent={percent} color="#f6ead6" />
                <span className={styles.progressNum}>{percent}<small>%</small></span>
              </div>
            </header>

            <p className={styles.count} role="status" aria-live="polite">
              <strong>{done}</strong> of {currentState.length} steps stamped
            </p>

            <ol className={styles.steps}>
              {current.tasks.map((task, idx) => {
                const checked = currentState[idx];
                return (
                  <li key={task}>
                    <button
                      type="button"
                      className={`${styles.step} ${checked ? styles.stepDone : ''}`}
                      aria-pressed={checked}
                      onClick={() => toggle(idx)}
                    >
                      <span className={styles.stampSlot} aria-hidden="true">
                        <span className={styles.slotNo}>{idx + 1}</span>
                        <AnimatePresence>
                          {checked && (
                            <motion.span
                              className={styles.stamped}
                              initial={{ scale: 2.4, opacity: 0, rotate: -40 }}
                              animate={{ scale: 1, opacity: 1, rotate: -10 }}
                              exit={{ scale: 0.6, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 420, damping: 16 }}
                            >
                              <FaLeaf />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className={styles.stepText}>{task}</span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <footer className={styles.foot}>
              <div className={`${styles.seal} ${complete ? styles.sealOn : ''}`}>
                <span className={styles.sealIcon} aria-hidden="true">
                  {complete ? <FaAward /> : <FaLock />}
                </span>
                <span>
                  <span className={styles.sealLabel}>{complete ? 'Badge unlocked' : 'Badge to earn'}</span>
                  <strong className={styles.sealName}>{current.badge}</strong>
                </span>
              </div>
              <button type="button" className={styles.reset} onClick={reset} disabled={done === 0}>
                <FaRotateLeft aria-hidden="true" /> Start over
              </button>
            </footer>

            <p className={styles.note}>Progress lives on this page only and resets when you reload.</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
