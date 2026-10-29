import styles from './RouteFallback.module.css';

/**
 * Shown while a lazily-loaded route chunk downloads.
 *
 * Deliberately quiet: a full-page spinner on every navigation reads as "the site
 * is slow", so this is a skeleton shaped roughly like a content page. The
 * visible bones are hidden from assistive tech and a single polite status
 * message is announced instead.
 */
export default function RouteFallback() {
  return (
    <div className={`page ${styles.wrap}`}>
      <p className="sr-only" role="status" aria-live="polite">
        Loading page
      </p>

      <div className={styles.inner} aria-hidden="true">
        <div className="skeleton skeleton-text" style={{ width: '30%' }} />
        <div className="skeleton skeleton-title" style={{ width: '70%', height: '2.6rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '90%' }} />
        <div className="skeleton skeleton-text" style={{ width: '82%' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%' }} />
        <div className={styles.cards}>
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-image" />
        </div>
      </div>
    </div>
  );
}
