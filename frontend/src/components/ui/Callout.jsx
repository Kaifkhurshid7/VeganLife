import { FiInfo, FiBookOpen } from 'react-icons/fi';

/**
 * Boxed note for context that shouldn't be skimmed past.
 *
 * Used mainly for the responsibility notes on health and environment content —
 * the reminder that pages give general educational information rather than
 * personal medical or dietary advice. Keeping it a component means that wording
 * stays consistent everywhere instead of being re-typed per page.
 *
 * @param {'info'|'note'} variant
 * @param {string} title Optional bold lead-in.
 */
export default function Callout({ variant = 'info', title, children }) {
  const Icon = variant === 'note' ? FiBookOpen : FiInfo;

  return (
    <aside className={`callout ${variant === 'note' ? 'callout--note' : ''}`}>
      <Icon className="callout-icon" aria-hidden="true" />
      <div>
        {title && <strong style={{ display: 'block', marginBottom: 4 }}>{title}</strong>}
        {children}
      </div>
    </aside>
  );
}
