import { FiAlertCircle, FiInbox, FiRefreshCw } from 'react-icons/fi';

/**
 * The one component for loading / empty / error states.
 *
 * Pages previously either showed nothing or leaked raw error text. This keeps
 * the three states visually consistent and — importantly — never renders a
 * server message: `error` variants show fixed, human copy and offer a retry.
 * Log the real error to the console instead of putting it on screen.
 *
 * @param {'loading'|'empty'|'error'} variant
 * @param {string} title  Short headline. Sensible defaults per variant.
 * @param {string} text   Supporting sentence.
 * @param {Function} onRetry  Renders a "Try again" button when provided.
 * @param {React.ReactNode} action  Extra CTA (e.g. a link back to the hub).
 */
const DEFAULTS = {
  loading: {
    title: 'Loading',
    text: 'One moment while we fetch this content.',
    icon: <FiRefreshCw className="state-icon" aria-hidden="true" />,
  },
  empty: {
    title: 'Nothing here yet',
    text: 'Check back soon for new content.',
    icon: <FiInbox className="state-icon" aria-hidden="true" />,
  },
  error: {
    title: "We couldn't load this content",
    text: 'Something went wrong on our side. Please try again in a moment.',
    icon: <FiAlertCircle className="state-icon" aria-hidden="true" />,
  },
};

export default function StateBlock({ variant = 'empty', title, text, onRetry, action }) {
  const preset = DEFAULTS[variant] || DEFAULTS.empty;

  return (
    <div
      className="state-block"
      // Errors interrupt; loading and empty announce politely.
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      {preset.icon}
      <p className="state-title">{title || preset.title}</p>
      <p className="state-text">{text || preset.text}</p>

      {(onRetry || action) && (
        <div className="state-actions">
          {onRetry && (
            <button type="button" className="btn btn-outline btn-sm" onClick={onRetry}>
              Try again
            </button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
