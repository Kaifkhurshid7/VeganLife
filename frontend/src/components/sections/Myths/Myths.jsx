import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStamp, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { FiPlus } from 'react-icons/fi';
import { SectionHeader, ReferenceList } from '../../ui';
import { veganMythsDebunked } from '../../../data/nutrition';
import styles from './Myths.module.css';

const PALETTE = ['#7f9a5f', '#e3a36e', '#9d82ab', '#6f9a9a'];

const cards = veganMythsDebunked.map((m, i) => ({
  id: i,
  myth: m.myth,
  verdict: m.reality || 'Debunked',
  fact: m.truth,
  color: PALETTE[i % PALETTE.length],
}));

const mythsReferences = [
  { org: 'Academy of Nutrition and Dietetics', title: 'Position paper: vegetarian diets', link: 'https://pubmed.ncbi.nlm.nih.gov/27886704/' },
  { org: 'NIH Office of Dietary Supplements', title: 'Vitamin B12 fact sheet', link: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/' },
  { org: 'Harvard T.H. Chan School of Public Health', title: 'The Nutrition Source: protein', link: 'https://nutritionsource.hsph.harvard.edu/what-should-you-eat/protein/' },
  { org: 'Science (Poore & Nemecek, 2018)', title: 'Reducing food’s environmental impacts through producers and consumers', link: 'https://www.science.org/doi/10.1126/science.aaq0216' },
];

export default function Myths({ faq }) {
  const [revealed, setRevealed] = useState({});
  const count = useMemo(() => Object.values(revealed).filter(Boolean).length, [revealed]);
  const allOpen = count === cards.length;

  const toggle = (id) => setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleAll = () => {
    const next = {};
    cards.forEach((c) => { next[c.id] = !allOpen; });
    setRevealed(next);
  };

  return (
    <section id="myths" className={styles.section}>
      <SectionHeader
        label="Fact vs Fiction"
        title="Vegan Myths Busted"
        description="Let's separate cultural misconceptions from peer-reviewed nutritional and environmental science."
      />

      {/* progress through the case files */}
      <div className={styles.toolbar}>
        <div className={styles.meter} aria-hidden="true">
          <span className={styles.meterFill} style={{ width: `${(count / cards.length) * 100}%` }} />
        </div>
        <p className={styles.meterText} role="status" aria-live="polite">
          <strong>{count}</strong> of {cards.length} myths examined
        </p>
        <button type="button" className={styles.revealAll} onClick={toggleAll}>
          {allOpen ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
          {allOpen ? 'Hide all facts' : 'Reveal all facts'}
        </button>
      </div>

      <div className={styles.grid}>
        {cards.map((item, idx) => {
          const open = Boolean(revealed[item.id]);
          return (
            <article
              key={item.id}
              className={`${styles.file} ${open ? styles.fileOpen : ''}`}
              style={{ '--accent': item.color }}
            >
              <header className={styles.fileHead}>
                <span className={styles.caseNo}>Case {String(idx + 1).padStart(2, '0')}</span>
                <span className={styles.fileTab} aria-hidden="true" />
              </header>

              <p className={styles.mythLabel}>The myth</p>
              <h3 className={`${styles.myth} ${open ? styles.mythStruck : ''}`}>“{item.myth}”</h3>

              <button
                type="button"
                className={styles.reveal}
                aria-expanded={open}
                aria-controls={`myth-fact-${item.id}`}
                onClick={() => toggle(item.id)}
              >
                {open ? 'Hide the fact' : 'Check the fact'}
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`myth-fact-${item.id}`}
                    className={styles.factWrap}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className={styles.fact}>
                      <p className={styles.factLabel}>The fact</p>
                      <p className={styles.factText}>{item.fact}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {open && (
                  <motion.span
                    className={styles.stamp}
                    initial={{ opacity: 0, scale: 2.2, rotate: -22 }}
                    animate={{ opacity: 1, scale: 1, rotate: -9 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                    aria-hidden="true"
                  >
                    <FaStamp /> {item.verdict}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Verdict stays readable without opening, for screen readers and crawlers */}
              <span className="sr-only">Verdict: {item.verdict}</span>
            </article>
          );
        })}
      </div>

      {/* Visible FAQ: the homepage FAQPage structured data must describe on-page text */}
      {faq?.length > 0 && (
        <div className={styles.faq}>
          <p className={styles.faqKicker}>Quick answers</p>
          <h3 className={styles.faqTitle}>Questions people ask first</h3>
          {faq.map((item) => (
            <details key={item.question} className={styles.faqItem}>
              <summary>
                <span>{item.question}</span>
                <FiPlus aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      )}

      <div className={styles.refs}>
        <ReferenceList panel title="Sources & further reading" refs={mythsReferences} />
      </div>
    </section>
  );
}
