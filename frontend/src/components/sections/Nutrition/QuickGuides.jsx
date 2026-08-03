import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBrain, FaBookOpen, FaDumbbell, FaWeightScale, FaCookie, FaMugHot, FaClock,
  FaLightbulb, FaDroplet, FaShieldVirus, FaPuzzlePiece, FaCarrot, FaCalendarDays,
  FaLeaf, FaPills, FaPersonRunning, FaHeart, FaMicroscope, FaSeedling, FaXmark,
  FaBolt, FaClock as FaClockAlt, FaIndianRupeeSign, FaFire, FaSpa,
  FaPlateWheat,
} from 'react-icons/fa6';
import { ReferenceList } from '../../ui';
import { quickGuides } from '../../../data/quickGuides';
import styles from './QuickGuides.module.css';

const ICON_MAP = {
  FaBrain: <FaBrain />,
  FaBookOpen: <FaBookOpen />,
  FaDumbbell: <FaDumbbell />,
  FaWeightScale: <FaWeightScale />,
  FaCookie: <FaCookie />,
  FaMugHot: <FaMugHot />,
  FaClock: <FaClock />,
  FaLightbulb: <FaLightbulb />,
  FaDroplet: <FaDroplet />,
  FaShieldVirus: <FaShieldVirus />,
  FaPuzzlePiece: <FaPuzzlePiece />,
  FaCarrot: <FaCarrot />,
  FaCalendarDays: <FaCalendarDays />,
  FaLeaf: <FaLeaf />,
  FaPills: <FaPills />,
  FaPersonRunning: <FaPersonRunning />,
  FaHeart: <FaHeart />,
  FaMicroscope: <FaMicroscope />,
};

function ListRows({ items }) {
  return (
    <ul className={styles.rowList}>
      {items.map((item, i) => (
        <li key={i} className={styles.row}>
          <div className={styles.rowTop}>
            <span className={styles.rowTitle}>{item.name || item.myth}</span>
            {item.brainBoost && <span className={styles.chip}>Brain</span>}
            {item.hostelFriendly && <span className={styles.chip}>Hostel</span>}
          </div>
          <div className={styles.rowMeta}>
            {item.time && <span><FaClockAlt /> {item.time}</span>}
            {item.prep && <span><FaClockAlt /> {item.prep}</span>}
            {item.cost && <span><FaIndianRupeeSign /> {item.cost}</span>}
            {item.protein && <span><FaFire /> {item.protein}</span>}
            {item.calories && <span>{item.calories}</span>}
            {item.season && <span><FaSpa /> {item.season}</span>}
            {item.reality && <span className={styles.reality}>{item.reality}</span>}
          </div>
          <p className={styles.rowDesc}>{item.notes || item.reason || item.benefit || item.truth}</p>
        </li>
      ))}
    </ul>
  );
}

function GuideContent({ guide }) {
  const { renderType, data } = guide;
  if (!data) return null;

  if (renderType === 'cards') {
    return (
      <div className={styles.cardGrid}>
        {data.map((item, i) => (
          <div key={i} className={`glass-card ${styles.miniCard}`}>
            {item.image && <img src={item.image} alt={item.food} className={styles.miniImg} loading="lazy" />}
            <h5 className={styles.miniTitle}>{item.food}</h5>
            <div className={styles.miniChips}>
              {item.benefits && item.benefits.map((b) => <span key={b} className={styles.miniChip}>{b}</span>)}
            </div>
            <p className={styles.miniMeta}>{item.availability} · {item.budgetLevel}</p>
          </div>
        ))}
      </div>
    );
  }

  if (renderType === 'list') {
    return <ListRows items={data} />;
  }

  if (renderType === 'table') {
    return (
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nutrient</th><th>Importance</th><th>Dose</th><th>Form</th><th>Cost</th><th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s, i) => (
              <tr key={i}>
                <td><strong>{s.nutrient}</strong></td>
                <td>{s.importance}</td>
                <td>{s.dose}</td>
                <td>{s.form}</td>
                <td>{s.cost}</td>
                <td>{s.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (renderType === 'quotes') {
    return (
      <div className={styles.quoteGrid}>
        {data.map((a, i) => (
          <div key={i} className={`glass-card ${styles.quoteCard}`}>
            <p className={styles.quoteText}>“{a.quote}”</p>
            <div className={styles.quoteBy}>
              <strong>{a.name}</strong>
              <span>{a.sport} · {a.country}</span>
            </div>
            <small className={styles.quoteNote}>{a.note}</small>
          </div>
        ))}
      </div>
    );
  }

  if (renderType === 'tips') {
    return (
      <ol className={styles.tipList}>
        {data.map((tip, i) => (
          <li key={i} className={styles.tip}>{tip}</li>
        ))}
      </ol>
    );
  }

  if (renderType === 'stats') {
    return (
      <div className={styles.statsBox}>
        <div className={styles.statRow}>
          <div className={styles.statCol}>
            <h5>Per Day</h5>
            <ul>{Object.entries(data.perDayVegan || {}).map(([k, v]) => <li key={k}><strong>{v}</strong> {k.replace(/([A-Z])/g, ' $1').toLowerCase()}</li>)}</ul>
          </div>
          <div className={styles.statCol}>
            <h5>Per Year</h5>
            <ul>{Object.entries(data.perYearVegan || {}).map(([k, v]) => <li key={k}><strong>{v}</strong> {k.replace(/([A-Z])/g, ' $1').toLowerCase()}</li>)}</ul>
          </div>
        </div>
        <h5 className={styles.statSub}>Food comparisons</h5>
        <ul className={styles.compList}>
          {(data.comparisons || []).map((c, i) => (
            <li key={i}><strong>{c.activity}</strong> — {c.water} water · {c.co2} CO₂ · {c.land} land <em>{c.equivalent}</em></li>
          ))}
        </ul>
        <h5 className={styles.statSub}>Global context</h5>
        <ul className={styles.compList}>
          {Object.entries(data.globalStats || {}).map(([k, v]) => <li key={k}><strong>{k.replace(/([A-Z])/g, ' $1')}:</strong> {v}</li>)}
        </ul>
      </div>
    );
  }

  if (renderType === 'produce') {
    return (
      <div className={styles.produceList}>
        {Object.entries(data).map(([season, s]) => (
          <div key={season} className={styles.seasonBlock}>
            <h5 className={styles.seasonTitle}><FaCarrot /> {s.season}</h5>
            {['fruits', 'vegetables', 'grains'].map((cat) => s[cat]?.length > 0 && (
              <div key={cat} className={styles.seasonCat}>
                <span className={styles.seasonLabel}>{cat}</span>
                <div className={styles.seasonTags}>
                  {s[cat].map((item) => <span key={item} className={styles.seasonTag}>{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (renderType === 'plans') {
    return (
      <div className={styles.planList}>
        {Object.entries(data).map(([key, plan]) => (
          <div key={key} className={styles.planBlock}>
            <h5 className={styles.planTitle}><FaPlateWheat /> {plan.name}</h5>
            <p className={styles.planMeta}><FaIndianRupeeSign /> {plan.weeklyBudget} · {plan.description}</p>
            <ul className={styles.planDays}>
              {plan.days.map((d, i) => (
                <li key={i} className={styles.planDay}>
                  <strong>{d.day}</strong>
                  <span>B: {d.breakfast}</span><span>L: {d.lunch}</span><span>D: {d.dinner}</span><span>S: {d.snacks}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  // 'info' (trustIndicators object) fallback — render any object as key/value rows
  return (
    <ul className={styles.rowList}>
      {Object.entries(data).map(([k, v]) => (
        <li key={k} className={styles.row}>
          <div className={styles.rowTop}>
            <span className={styles.rowTitle}>{k.replace(/([A-Z])/g, ' $1')}</span>
            {typeof v === 'boolean' && <span className={styles.chip}>{v ? 'Yes' : 'No'}</span>}
          </div>
          <p className={styles.rowDesc}>{Array.isArray(v) ? v.join(' · ') : String(v)}</p>
        </li>
      ))}
    </ul>
  );
}

export default function QuickGuides() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setActive(null); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  return (
    <div className={styles.wrap}>
      <h3 className={styles.heading}>Quick Guides &amp; Resources</h3>
      <p className={styles.sub}>Deeper, referenced guides for every aspect of plant-based student life.</p>

      <div className={styles.grid}>
        {quickGuides.map((g, idx) => (
          <motion.button
            key={g.id}
            type="button"
            className={`glass-card ${styles.guideCard}`}
            onClick={() => setActive(g)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.04 }}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
          >
            <div className={styles.cardTop}>
              <img src={g.image} alt="" className={styles.cardImg} loading="lazy" />
              <span className={styles.iconChip} style={{ color: g.color }}>{ICON_MAP[g.icon] || <FaSeedling />}</span>
              <span className={styles.badge}>{g.badge}</span>
            </div>
            <h4 className={styles.cardTitle}>{g.title}</h4>
            <p className={styles.cardDesc}>{g.description}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className={styles.modalHeader}>
                <div className={styles.modalTitleWrap}>
                  <span className={styles.modalIcon} style={{ color: active.color }}>{ICON_MAP[active.icon] || <FaSeedling />}</span>
                  <div>
                    <h3 className={styles.modalTitle}>{active.title}</h3>
                    <p className={styles.modalDesc}>{active.description}</p>
                  </div>
                </div>
                <button className={styles.closeBtn} onClick={() => setActive(null)} aria-label="Close">
                  <FaXmark />
                </button>
              </div>

              <div className={styles.modalBody}>
                <GuideContent guide={active} />
              </div>

              <div className={styles.modalRefs}>
                <div className={styles.verifiedStrip}><FaBolt /> <span>Data checked against authoritative sources</span></div>
                <ReferenceList refs={active.references} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
