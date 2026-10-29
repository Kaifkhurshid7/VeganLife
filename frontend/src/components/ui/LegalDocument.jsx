import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaScaleBalanced } from 'react-icons/fa6';
import { FiPrinter, FiArrowRight } from 'react-icons/fi';
import { LEGAL, LEGAL_NAV, SITE } from '../../constants';
import styles from './LegalDocument.module.css';

/**
 * A legal instrument: formal header block, numbered clauses, a sticky contents
 * panel and a printable layout.
 *
 * Pages pass `sections` as `{ id, title, body }` so the structure (numbering,
 * anchors, contents list) is identical across every policy and a clause can be
 * cited as "Privacy Policy, clause 7".
 */
export default function LegalDocument({ sections, current }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  const doc = LEGAL_NAV.find((l) => l.href === current);
  const others = LEGAL_NAV.filter((l) => l.href !== current);
  const operator = LEGAL.operatorName || SITE.legalName;

  // Highlight the clause currently being read in the contents panel.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className={styles.layout}>
      {/* ————— contents ————— */}
      <aside className={styles.aside}>
        <details className={styles.toc} open>
          <summary>Contents</summary>
          <ol>
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={activeId === s.id ? styles.tocActive : ''}
                  aria-current={activeId === s.id ? 'true' : undefined}
                >
                  <span className={styles.tocNo}>{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </details>

        <button type="button" className={styles.print} onClick={() => window.print()}>
          <FiPrinter aria-hidden="true" /> Print or save as PDF
        </button>
      </aside>

      {/* ————— the instrument ————— */}
      <article className={styles.paper}>
        <header className={styles.head}>
          <span className={styles.seal} aria-hidden="true"><FaScaleBalanced /></span>
          <div>
            <p className={styles.notice}>Legal notice</p>
            <p className={styles.docName}>{doc?.name ?? 'Legal document'}</p>
            <p className={styles.issuer}>Issued by <strong>{operator}</strong></p>
          </div>
        </header>

        <dl className={styles.meta}>
          <div><dt>Effective date</dt><dd>{LEGAL.effectiveDate}</dd></div>
          <div><dt>Last updated</dt><dd>{LEGAL.lastUpdated}</dd></div>
          <div><dt>Governing law</dt><dd>Laws of {LEGAL.jurisdiction}</dd></div>
          <div><dt>Clauses</dt><dd>{sections.length}</dd></div>
        </dl>

        <p className={styles.readFirst}>
          <strong>Please read this document carefully.</strong> It describes your rights and obligations when
          you use {SITE.name}. If anything is unclear, contact us before you continue.
        </p>

        <div className={styles.body}>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className={styles.clause}>
              <span className={styles.clauseNo} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.clauseBody}>
                <h2>
                  <span className="sr-only">Clause {i + 1}: </span>
                  {s.title}
                </h2>
                {s.body}
              </div>
            </section>
          ))}
        </div>

        <footer className={styles.end}>
          <span aria-hidden="true">❦</span>
          <p>
            End of {doc?.name ?? 'document'} · Effective {LEGAL.effectiveDate}
          </p>
        </footer>
      </article>

      {/* ————— related documents ————— */}
      <nav className={styles.related} aria-label="Other legal documents">
        <p className={styles.relatedTitle}>Related documents</p>
        <div className={styles.relatedGrid}>
          {others.map((l) => (
            <Link key={l.href} to={l.href} className={styles.relatedCard}>
              <span>{l.name}</span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
