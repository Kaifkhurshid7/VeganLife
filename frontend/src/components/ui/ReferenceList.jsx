import { FiExternalLink } from 'react-icons/fi';
import styles from './ReferenceList.module.css';

/**
 * Renders a list of verified references/sources as external links.
 * Extracted from the original Nutrition section citation pattern.
 *
 * @param {Array} refs   Array of { org, title, link }
 * @param {string} title Heading label (default "Sources")
 * @param {boolean} compact Single-line org-only links (for stat cards)
 */
export default function ReferenceList({ refs, title = 'Sources', compact = false }) {
  if (!refs || !refs.length) return null;

  return (
    <div className={`${styles.references} ${compact ? styles.compact : ''}`}>
      {!compact && (
        <h4 className={styles.heading}>
          <FiExternalLink /> {title}
        </h4>
      )}
      <div className={styles.refList}>
        {refs.map((ref, idx) => (
          <a
            key={ref.title || `${ref.org}-${idx}`}
            href={ref.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.refLink}
          >
            {compact ? (
              <span className={styles.refOrgInline}>Source: {ref.org}</span>
            ) : (
              <>
                <span className={styles.refOrg}>{ref.org}</span>
                <span className={styles.refTitle}>{ref.title}</span>
              </>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
