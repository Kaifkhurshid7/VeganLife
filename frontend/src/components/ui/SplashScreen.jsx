import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useSpring } from 'framer-motion';
import { FaLeaf, FaCarrot, FaAppleWhole, FaPepperHot, FaLemon, FaWheatAwn } from 'react-icons/fa6';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
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

/* Produce that drops into the harvest basket as loading progresses.
   `at` is the percent at which each item is "picked". */
const HARVEST = [
  { Icon: FaCarrot, label: 'Carrot', at: 18, color: '#e3a36e' },
  { Icon: FaLemon, label: 'Lemon', at: 36, color: '#d6b84a' },
  { Icon: FaPepperHot, label: 'Chilli', at: 54, color: '#b5523b' },
  { Icon: FaAppleWhole, label: 'Apple', at: 72, color: '#8aa060' },
  { Icon: FaWheatAwn, label: 'Grain', at: 90, color: '#b08a4f' },
];

/* Plain-language growth stages shown under the plant */
const STAGES = [
  { upTo: 20, text: 'Sowing seeds' },
  { upTo: 45, text: 'Sprouting' },
  { upTo: 70, text: 'Growing greens' },
  { upTo: 99, text: 'Ripening' },
  { upTo: 101, text: 'Ready to harvest' },
];

const clamp01 = (n) => Math.min(1, Math.max(0, n));
/* 0 → 1 across the [from, to] percent window */
const window01 = (p, from, to) => clamp01((p - from) / (to - from));

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
  const reduceMotion = usePrefersReducedMotion();
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

  /* Escape dismisses the intro — the same affordance the Skip button gives,
     for anyone already on the keyboard. */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onFinishRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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
      // Marked as a modal so assistive tech ignores the page rendered behind it
      // instead of reading both at once.
      role="dialog"
      aria-modal="true"
      aria-label="Vegan Life intro animation"
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
      <div className={styles.floating} hidden={reduceMotion}>
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
          role="progressbar"
          aria-label="Loading Vegan Life"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
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

          {/* the plant: every part is driven by the real progress value */}
          <motion.div
            className={styles.plantWrap}
            animate={done && !reduceMotion ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <svg className={styles.seedling} viewBox="0 0 120 120" aria-hidden>
              {/* sun rises as the plant matures */}
              <g
                className={styles.grow}
                style={{ transform: `scale(${window01(percent, 55, 75)})`, transformOrigin: '88px 22px', transformBox: 'view-box' }}
              >
                <circle cx="88" cy="22" r="18" fill="#e3a36e" opacity="0.18" />
                <circle cx="88" cy="22" r="11" fill="#e3a36e" />
              </g>

              {/* soil mound with a seed that is visible at the start */}
              <ellipse cx="60" cy="104" rx="40" ry="11" fill="#e1c6ab" />
              <ellipse cx="60" cy="103" rx="40" ry="11" fill="rgba(87,61,33,0.18)" />
              <ellipse cx="60" cy="99" rx="32" ry="6" fill="rgba(87,61,33,0.3)" />
              <ellipse
                cx="60"
                cy="98"
                rx="4.5"
                ry="3"
                fill="#8a6a3f"
                opacity={1 - window01(percent, 6, 16)}
              />

              {/* stem grows with progress */}
              <path
                d="M60 100 C 60 86, 60 72, 60 52"
                fill="none"
                stroke="#6d8252"
                strokeWidth="5"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - window01(percent, 8, 40)}
              />

              {/* left leaf */}
              <g
                className={styles.grow}
                style={{ transform: `scale(${window01(percent, 34, 52)})`, transformOrigin: '58px 72px', transformBox: 'view-box' }}
              >
                <path d="M58 72 C 46 64, 34 60, 26 62 C 30 52, 46 46, 58 52 Z" fill="#849b63" />
                <path d="M58 72 C 46 64, 34 60, 26 62" fill="none" stroke="#a6b48f" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* right leaf */}
              <g
                className={styles.grow}
                style={{ transform: `scale(${window01(percent, 42, 60)})`, transformOrigin: '62px 66px', transformBox: 'view-box' }}
              >
                <path d="M62 66 C 76 58, 88 54, 94 58 C 90 68, 76 76, 62 70 Z" fill="#849b63" />
                <path d="M62 66 C 76 58, 88 54, 94 58" fill="none" stroke="#a6b48f" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* crown leaves */}
              <g
                className={styles.grow}
                style={{ transform: `scale(${window01(percent, 50, 68)})`, transformOrigin: '60px 54px', transformBox: 'view-box' }}
              >
                <path d="M60 54 C 53 42, 51 32, 53 26 C 62 30, 67 41, 60 54 Z" fill="#6d8252" />
                <path d="M60 54 C 66 45, 72 40, 80 40 C 78 48, 70 54, 60 54 Z" fill="#7d9460" />
              </g>

              {/* fruit ripens at the end */}
              <g
                className={styles.grow}
                style={{ transform: `scale(${window01(percent, 82, 100)})`, transformOrigin: '38px 82px', transformBox: 'view-box' }}
              >
                <circle cx="38" cy="84" r="7" fill="#d9774a" />
                <path d="M34 78 C 36 76, 40 76, 42 78 C 40 80, 36 80, 34 78 Z" fill="#6d8252" />
                <circle cx="35.5" cy="82" r="1.6" fill="rgba(255,255,255,0.35)" />
              </g>
            </svg>
          </motion.div>
        </motion.div>

        {/*
          Brand wordmark. Intentionally a <p>, not an <h1>: the splash overlays a
          fully-rendered page, and a second H1 here would compete with the real
          page heading underneath it.
        */}
        <p className={styles.title} aria-label="Vegan Life">
          {'Vegan Life'.split('').map((ch, i) => (
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
        </p>

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
          <span className={styles.word}>{done ? 'Ready to harvest' : STAGES.find((st) => percent < st.upTo)?.text ?? LOADING_WORDS[wordIdx]}</span>
          <span className={styles.dots} aria-hidden>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
          <span className={styles.percent}>{Math.round(percent)}%</span>
        </div>

        {/* harvest basket: produce is "picked" as the plant grows */}
        <ul className={styles.harvest} aria-hidden>
          {HARVEST.map(({ Icon, label, at, color }) => {
            const picked = percent >= at;
            return (
              <li
                key={label}
                className={`${styles.harvestItem} ${picked ? styles.harvestPicked : ''}`}
                style={picked ? { color, borderColor: color } : undefined}
                title={label}
              >
                <Icon />
              </li>
            );
          })}
        </ul>

        {!done && <p className={styles.hint}>tap · click to grow faster</p>}

        {/*
          An explicit way out. Previously the only option was to wait ~3s with no
          indication that waiting was required. autoFocus puts the keyboard
          straight on it, since it's the one control here.
        */}
        <button
          type="button"
          className={styles.skipBtn}
          onClick={(e) => {
            e.stopPropagation();
            onFinishRef.current();
          }}
          autoFocus
        >
          Skip intro
        </button>
      </motion.div>

      {/* click bursts */}
      {bursts.map((b) => (
        <Burst key={b.id} x={b.x} y={b.y} />
      ))}

      {/* pointer trail */}
      <div className={styles.trail} aria-hidden hidden={reduceMotion}>
        {Array.from({ length: 6 }).map((_, i) => (
          <TrailLeaf key={i} mx={mx} my={my} i={i} />
        ))}
      </div>

      {/* papery grain */}
      <div className={styles.grain} aria-hidden />
    </motion.div>
  );
}
