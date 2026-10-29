import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import styles from './BackButton.module.css';

/**
 * Returns to the previous page.
 *
 * It sits in the page flow, below the fixed navbar, rather than floating over
 * it. A fixed button in the top-left corner shared a stacking level with the
 * navbar and was covered by it, so clicks never arrived.
 *
 * React Router stores the position in the session in `history.state.idx`: when
 * it is above 0 there is a previous entry inside the app to go back to. When
 * the page was opened directly (a shared link, a refresh in a new tab) there is
 * nothing to go back to, so it falls back to `fallback` instead of leaving the
 * site.
 */
export default function BackButton({ fallback = '/' }) {
  const navigate = useNavigate();

  const goBack = () => {
    const idx = window.history.state?.idx;
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.btn} onClick={goBack} aria-label="Go back to the previous page">
        <FiArrowLeft aria-hidden="true" />
        <span>Back</span>
      </button>
    </div>
  );
}
