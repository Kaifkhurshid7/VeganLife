import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa6';
import styles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <FaLeaf className={styles.leafIcon} />
            <FiAlertTriangle className={styles.icon} />
            <h2 className={styles.title}>Something went wrong</h2>
            <p className={styles.desc}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button className={styles.btn} onClick={() => window.location.reload()}>
              <FiRefreshCw /> Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
