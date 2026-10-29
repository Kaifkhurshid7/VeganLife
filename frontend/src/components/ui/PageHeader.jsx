import Breadcrumbs from './Breadcrumbs';
import styles from './PageHeader.module.css';

/**
 * Standard top-of-page block for content routes: breadcrumb trail, eyebrow
 * label, the page's single H1, and an optional lead paragraph.
 *
 * Rendering the H1 here is deliberate — it guarantees exactly one per page and
 * keeps the heading hierarchy predictable, since section components below
 * consistently start at H2.
 */
export default function PageHeader({ eyebrow, title, lead, trail, align = 'left', children }) {
  return (
    <header className={`${styles.header} ${align === 'center' ? styles.center : ''}`}>
      {trail && <Breadcrumbs trail={trail} />}
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className={`t-h1 ${styles.title}`}>{title}</h1>
      {lead && <p className={`t-lead ${styles.lead}`}>{lead}</p>}
      {children && <div className={styles.extra}>{children}</div>}
    </header>
  );
}
