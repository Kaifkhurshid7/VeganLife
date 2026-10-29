import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaLeaf, FaInstagram, FaTwitter, FaYoutube, FaPinterest,
  FaShieldHalved, FaHeartPulse, FaScaleBalanced,
} from 'react-icons/fa6';
import { FiArrowUp, FiMail } from 'react-icons/fi';
import { FOOTER_NAV, LEGAL_NAV, ROUTES, SITE, CONTACT, LEGAL, activeSocialProfiles } from '../../../constants';
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion';
import styles from './Footer.module.css';

const SOCIAL_ICONS = {
  instagram: <FaInstagram />,
  twitter: <FaTwitter />,
  youtube: <FaYoutube />,
  pinterest: <FaPinterest />,
};

// Staggered scroll reveal for footer blocks
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const reduceMotion = usePrefersReducedMotion();
  const socials = activeSocialProfiles();
  const officer = LEGAL.grievanceOfficer;
  const officerEmail = officer.email || CONTACT.email;

  const toTop = () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });

  return (
    <footer className={styles.footer}>
      <div className={styles.accent} aria-hidden="true" />

      <div className={styles.inner}>
        {/* ————— quote band ————— */}
        <motion.figure className={styles.promise} {...reveal(0)}>
          <FaLeaf className={styles.promiseIcon} aria-hidden="true" />
          <blockquote>“The greatest threat to our planet is the belief that someone else will save it.”</blockquote>
          <figcaption>Robert Swan OBE</figcaption>
        </motion.figure>

        {/* ————— brand + link columns ————— */}
        <div className={styles.grid}>
          <motion.div className={styles.brand} {...reveal(0.05)}>
            <Link to={ROUTES.home} className={styles.logo} aria-label={`${SITE.name} home`}>
              <span className={styles.logoMark}><FaLeaf aria-hidden="true" /></span>
              <span className={styles.logoText}>{SITE.name}</span>
            </Link>
            <p className={styles.brandDesc}>{SITE.shortDescription}</p>

            {CONTACT.email && (
              <a href={`mailto:${CONTACT.email}`} className={styles.mail}>
                <FiMail aria-hidden="true" /> {CONTACT.email}
              </a>
            )}

            {socials.length > 0 && (
              <div className={styles.socialRow}>
                {socials.map((link) => (
                  <a
                    key={link.platform}
                    href={link.href}
                    className={styles.socialLink}
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {SOCIAL_ICONS[link.platform]}
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          <nav className={styles.columns} aria-label="Footer">
            {FOOTER_NAV.map((group, i) => (
              <motion.div key={group.heading} className={styles.column} {...reveal(0.1 + i * 0.05)}>
                <h3>{group.heading}</h3>
                <ul>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* ————— legal notices ————— */}
        <motion.section className={styles.notices} aria-label="Legal notices" {...reveal(0.1)}>
          <div className={styles.noticesHead}>
            <span>Legal notices</span>
          </div>
          <div className={styles.noticeGrid}>
            <article className={styles.notice}>
              <span className={styles.noticeIcon} aria-hidden="true"><FaShieldHalved /></span>
              <div>
                <h4>Your data, your rights</h4>
                <p>
                  We process personal data in line with India&rsquo;s Digital Personal Data Protection Act,
                  2023. You may access, correct or erase your data and withdraw consent.{' '}
                  <Link to={ROUTES.privacy}>Privacy Policy</Link>
                </p>
              </div>
            </article>

            <article className={styles.notice}>
              <span className={styles.noticeIcon} aria-hidden="true"><FaHeartPulse /></span>
              <div>
                <h4>Health disclaimer</h4>
                <p>
                  Content here is for education only and is not medical or dietary advice. Consult a
                  qualified professional before changing your diet.{' '}
                  <Link to={ROUTES.disclaimer}>Full disclaimer</Link>
                </p>
              </div>
            </article>

            <article className={styles.notice}>
              <span className={styles.noticeIcon} aria-hidden="true"><FaScaleBalanced /></span>
              <div>
                <h4>Grievance Officer</h4>
                <p>
                  {officer.name ? `${officer.name}. ` : ''}
                  {officerEmail ? `${officerEmail}. ` : ''}
                  Complaints are acknowledged within 24 hours.{' '}
                  <Link to={ROUTES.grievance}>How to complain</Link>
                </p>
              </div>
            </article>
          </div>
        </motion.section>

        {/* ————— bottom bar ————— */}
        <div className={styles.bottom}>
          <p className={styles.copy}>&copy; {currentYear} {SITE.legalName}. All rights reserved.</p>
          <ul className={styles.legalLinks}>
            {LEGAL_NAV.map((link) => (
              <li key={link.href}>
                <Link to={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
          <button type="button" className={styles.toTop} onClick={toTop}>
            Back to top <FiArrowUp aria-hidden="true" />
          </button>
        </div>

        <p className={styles.fineprint}>
          {SITE.name} is an independent educational platform. User posts reflect their authors&rsquo; views,
          and we act as an intermediary under the Information Technology Act, 2000. Nutrition and impact
          figures are estimates from published sources and are not a substitute for professional advice.
        </p>
      </div>
    </footer>
  );
}
