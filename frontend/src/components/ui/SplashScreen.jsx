import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useSpring } from 'framer-motion';
import { FaLeaf, FaSun } from 'react-icons/fa6';
import styles from './SplashScreen.module.css';

/* ————— Loader copy (all vegan-minded) ————— */
const LOADING_WORDS = [
  'Sowing seeds',
  'Watering roots',
  'Growing greens',
  'Composting scraps',
  'Harvesting kindness',
];

const TAGLINES = [
  'Plant-powered living',
  'Kind to animals & the earth',
  'Growing a greener tomorrow',
  'Fresh · vibrant · vegan',
];

/* ————— Timing ————— */
const TOTAL_MS = 3100; // natural length of the loader
const BOOST_MS = 420; // how much a click/tap shaves off
const FLOURISH_MS = 650; // hold on the final "ready" beat

/* ————— Progress ring geometry ————— */
const RING_SIZE = 240;
const RING_R = 104;
const RING_C = 120;
const RING_STROKE = 6;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

const COLORS = {
  sage: '#849b63',
  orange: '#e3a36e',
  clay: '#e1c6ab',
  earth: '#573d21',
};

const PARTICLES = [
  { top: '12%', left: '12%', size: 18, dur: 9, delay: 0, sway: 18, color: 'sage' },
  { top: '18%', left: '80%', size: 14, dur: 11, delay: 1, sway: -16, color: 'orange' },
  { top: '70%', left: '9%', size: 22, dur: 10, delay: 2, sway: 20, color: 'clay' },
  { top: '76%', left: '79%', size: 16, dur: 12, delay: 0.5, sway: -14, color: 'sage' },
  { top: '8%', left: '54%', size: 12, dur: 8, delay: 2.4, sway: 12, color: 'orange' },
  { top: '58%', left: '5%', size: 15, dur: 10, delay: 1.6, sway: -18, color: 'earth' },
  { top: '54%', left: '91%', size: 13, dur: 9, delay: 3, sway: 16, color: 'sage' },
  { top: '36%', left: '3%', size: 11, dur: 8, delay: 0.8, sway: -12, color: 'orange' },
  { top: '84%', left: '46%', size: 14, dur: 11, delay: 2.1, sway: 14, color: 'clay' },
];

/* A leaf that trails the pointer with a gentle spring lag */
function TrailLeaf({ mx, my, i }) {
  const stiffness = 60 + i * 14;
  const x = useSpring(mx, { stiffness, damping: 22 });
  const y = useSpring(my, { stiffness, damping: 22 });
  return (
    <motion.div
      className={styles.trailLeaf}
      style={{ x, y, opacity: 0.5 - i * 0.06, fontSize: 12 - i * 1.4 }}
      aria-hidden
    >
      <FaLeaf />
    </motion.div>
  );
}

/* A little burst of petals released on click */
function Burst({ x, y }) {
  return (
    <div className={styles.burst} style={{ left: x, top: y }} aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        return (
          <motion.div
            key={i}
            className={styles.burstPetal}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
            animate={{
              x: dx * 46,
              y: dy * 46,
              opacity: 0,
              scale: 1.15,
              rotate: i % 2 ? 140 : -140,
            }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ fontSize: 12 }}
          >
            <FaLeaf />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function SplashScreen({ onFinish }) {
  const [percent, setPercent] = useState(0);
  const [done, setDone] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [tagIdx, setTagIdx] = useState(0);
  const [bursts, setBursts] = useState([]);
  const [pulseKey, setPulseKey] = useState(0);

  const endRef = useRef(0);
  const burstIdRef = useRef(0);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  /* shared pointer target for the trailing leaves */
  const mx = useSpring(-200, { stiffness: 55, damping: 20 });
  const my = useSpring(-200, { stiffness: 55, damping: 20 });

  /* Drive progress with a rAF loop so clicks can accelerate it */
  useEffect(() => {
    const start = performance.now();
    endRef.current = start + TOTAL_MS;
    let raf;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / (endRef.current - start));
      setPercent(t * 100);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
        setTimeout(() => onFinishRef.current(), FLOURISH_MS);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* cycling words + taglines */
  useEffect(() => {
    const word = setInterval(() => setWordIdx((i) => (i + 1) % LOADING_WORDS.length), 600);
    const tag = setInterval(() => setTagIdx((i) => (i + 1) % TAGLINES.length), 1500);
    return () => {
      clearInterval(word);
      clearInterval(tag);
    };
  }, []);

  const handlePointerMove = (e) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  const handleSplashClick = (e) => {
    if (done) return;
    endRef.current = Math.max(performance.now() + 700, endRef.current - BOOST_MS);

    const id = burstIdRef.current++;
    setBursts((b) => [...b, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setBursts((b) => b.filter((p) => p.id !== id)), 850);

    setPulseKey((k) => k + 1);
  };

  const leafDeg = (percent / 100) * 360;

  return (
    <motion.div
      className={styles.splash}
      onPointerMove={handlePointerMove}
      onClick={handleSplashClick}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* ambient soft blobs */}
      <motion.div
        className={`${styles.blob} ${styles.blobA}`}
        animate={{ x: [0, 42, 0], y: [0, -28, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`${styles.blob} ${styles.blobB}`}
        animate={{ x: [0, -34, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* drifting leaves */}
      <div className={styles.floating}>
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className={styles.floatingLeaf}
            style={{ top: p.top, left: p.left, color: COLORS[p.color], fontSize: p.size }}
            animate={{ y: [0, -52, 0], x: [0, p.sway, 0], rotate: [0, 34, 0] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            <FaLeaf />
          </motion.div>
        ))}
      </div>

      <motion.div
        className={styles.center}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* ring + seedling */}
        <motion.div
          key={pulseKey}
          className={styles.ringWrap}
          initial={{ scale: 0.86, opacity: 0 }}
          animate={{ scale: [1, 1.05, 1], opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <svg className={styles.ring} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} aria-hidden>
            <defs>
              <linearGradient id="splashRingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#849b63" />
                <stop offset="100%" stopColor="#e3a36e" />
              </linearGradient>
            </defs>
            <circle className={styles.ringTrack} cx={RING_C} cy={RING_C} r={RING_R} />
            <circle
              className={styles.ringProgress}
              cx={RING_C}
              cy={RING_C}
              r={RING_R}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
            />
          </svg>

          {/* leaf riding the ring tip */}
          <div className={styles.ringBadge} style={{ transform: `rotate(${leafDeg}deg)` }} aria-hidden>
            <FaLeaf className={styles.ringBadgeIcon} />
          </div>

          {/* the growing seedling */}
          <motion.div
            className={styles.plantWrap}
            animate={done ? { scale: [1, 1.14, 1], rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <svg className={styles.seedling} viewBox="0 0 120 120" aria-hidden>
              {/* soft sun */}
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ delay: 1.65, duration: 0.5, type: 'spring', stiffness: 120, damping: 12 }}
                style={{ transformOrigin: '86px 22px', transformBox: 'fill-box' }}
              >
                <circle cx="86" cy="22" r="12" fill="#e3a36e" />
              </motion.g>
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.65, duration: 0.6 }}
                style={{ transformOrigin: '86px 22px', transformBox: 'fill-box' }}
              >
                <circle cx="86" cy="22" r="18" fill="#e3a36e" opacity="0.18" />
              </motion.g>

              {/* soil mound */}
              <ellipse cx="60" cy="102" rx="40" ry="11" fill="#e1c6ab" />
              <ellipse cx="60" cy="101" rx="40" ry="11" fill="rgba(87,61,33,0.16)" />
              <ellipse cx="60" cy="97" rx="32" ry="6" fill="rgba(87,61,33,0.3)" />
              <circle cx="44" cy="99" r="2.4" fill="rgba(87,61,33,0.4)" />
              <circle cx="72" cy="101" r="1.8" fill="rgba(87,61,33,0.35)" />

              {/* stem grows up */}
              <motion.path
                d="M60 98 C 60 84, 60 70, 60 56"
                fill="none"
                stroke="#6d8252"
                strokeWidth="5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.35, ease: 'easeInOut' }}
              />

              {/* left leaf unfolds */}
              <motion.g
                initial={{ rotate: -120, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ delay: 1.05, duration: 0.5, type: 'spring', stiffness: 170, damping: 14 }}
                style={{ transformOrigin: '100% 100%', transformBox: 'fill-box' }}
              >
                <path
                  d="M58 70 C 46 62, 34 58, 26 60 C 30 50, 46 44, 58 50 Z"
                  fill="#849b63"
                />
                <path
                  d="M58 70 C 46 62, 34 58, 26 60"
                  fill="none"
                  stroke="#a6b48f"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.g>

              {/* right leaf unfolds */}
              <motion.g
                initial={{ rotate: 120, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5, type: 'spring', stiffness: 170, damping: 14 }}
                style={{ transformOrigin: '0% 100%', transformBox: 'fill-box' }}
              >
                <path
                  d="M62 64 C 76 56, 88 52, 94 56 C 90 66, 76 74, 62 68 Z"
                  fill="#849b63"
                />
                <path
                  d="M62 64 C 76 56, 88 52, 94 56"
                  fill="none"
                  stroke="#a6b48f"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.g>

              {/* crown leaf blooms */}
              <motion.g
                initial={{ rotate: -30, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ delay: 1.45, duration: 0.5, type: 'spring', stiffness: 150, damping: 13 }}
                style={{ transformOrigin: '50% 100%', transformBox: 'fill-box' }}
              >
                <path
                  d="M60 58 C 54 46, 52 36, 54 30 C 62 34, 66 44, 60 58 Z"
                  fill="#6d8252"
                />
              </motion.g>
            </svg>
          </motion.div>
        </motion.div>

        {/* title — letters stagger in */}
        <h1 className={styles.title} aria-label="Green Earth">
          {'Green Earth'.split('').map((ch, i) => (
            <motion.span
              key={i}
              className={styles.letter}
              initial={{ y: 26, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
          <motion.span
            className={styles.titleLeaf}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 220, damping: 12 }}
          >
            <FaLeaf />
          </motion.span>
        </h1>

        {/* cycling tagline */}
        <div className={styles.taglineWrap}>
          <AnimatePresence mode="wait">
            <motion.p
              key={tagIdx}
              className={styles.tagline}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {TAGLINES[tagIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* status row */}
        <div className={styles.status}>
          <span className={styles.word}>{done ? 'Ready to grow' : LOADING_WORDS[wordIdx]}</span>
          <span className={styles.dots} aria-hidden>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
          <span className={styles.percent}>{Math.round(percent)}%</span>
        </div>

        {!done && <p className={styles.hint}>tap · click to grow faster</p>}
      </motion.div>

      {/* click bursts */}
      {bursts.map((b) => (
        <Burst key={b.id} x={b.x} y={b.y} />
      ))}

      {/* pointer trail */}
      <div className={styles.trail} aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <TrailLeaf key={i} mx={mx} my={my} i={i} />
        ))}
      </div>

      {/* papery grain */}
      <div className={styles.grain} aria-hidden />
    </motion.div>
  );
}
