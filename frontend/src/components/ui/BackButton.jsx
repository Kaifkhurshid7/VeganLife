import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import styles from './BackButton.module.css';

export default function BackButton() {
  return (
    <Link to="/" className={styles.btn}>
      <FiArrowLeft />
      <span>Back</span>
    </Link>
  );
}
