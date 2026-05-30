import { FaLeaf, FaInstagram, FaTwitter, FaYoutube, FaPinterest } from 'react-icons/fa6';
import { FOOTER_LINKS, SOCIAL_LINKS } from '../../../constants';
import styles from './Footer.module.css';

const SOCIAL_ICONS = {
  instagram: <FaInstagram />,
  twitter: <FaTwitter />,
  youtube: <FaYoutube />,
  pinterest: <FaPinterest />,
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.waveDivider}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79-22.2,103.59-32.17,158-29.45,70.36,3.53,136.46,28.81,200.63,55.22,84,34.56,168.17,65,257.5,60.67,84.18-4.12,163.53-29.62,236.42-66C932.32,27.18,1022.61,1.52,1108.62,11.23c29,3.27,57,11.43,84.4,24.12V0Z"
            fill="var(--color-clay)"
          />
        </svg>
      </div>

      <div className={styles.grid}>
        <div className={styles.brandBlock}>
          <div className={styles.brandTitle}>
            <FaLeaf className={styles.brandIcon} />
            <h2>Green Earth</h2>
          </div>
          <p className={styles.brandDesc}>
            A cinematic, non-profit student awareness movement dedicated to sustainable living,
            conscious nutrition, and restoring planetary health.
          </p>
          <div className={styles.socialRow}>
            {SOCIAL_LINKS.map((link) => (
              <a key={link.platform} href={link.href} className={styles.socialLink} aria-label={link.platform}>
                {SOCIAL_ICONS[link.platform]}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.navBlock}>
          <h3>Navigation</h3>
          <div className={styles.navGrid}>
            {FOOTER_LINKS.map((link) => (
              <a key={link.name} href={link.href} className={styles.footerLink}>
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.quoteBlock}>
          <h3>Green Promise</h3>
          <blockquote className={styles.quote}>
            "The greatest threat to our planet is the belief that someone else will save it."
            <cite>— Robert Swan OBE</cite>
          </blockquote>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.bottom}>
        <span>&copy; {currentYear} Green Earth Awareness. Built for the future.</span>
        <div className={styles.legalLinks}>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
