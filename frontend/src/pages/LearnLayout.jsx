import { motion } from 'framer-motion';
import BackButton from '../components/ui/BackButton';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Seo } from '../components/seo';
import { ROUTES } from '../constants/routes';
import styles from './Learn.module.css';

/**
 * Frame for the Learn pages: SEO, back button, breadcrumb trail and a hero with
 * the page's single H1, a photo collage and (optionally) a floating fact chip.
 *
 * `lead` is a node so a key phrase can be wrapped in <mark>. `facts` renders
 * the at-a-glance strip directly under the hero.
 */
export default function LearnLayout({
  seoTitle,
  description,
  path,
  crumb,
  eyebrow,
  title,
  lead,
  actions,
  images,
  chip,
  ring = 'PLANTS • COMPASSION • PLANET • ',
  facts,
  children,
}) {
  return (
    <section className={styles.page}>
      <Seo title={seoTitle || title} description={description} path={path} />
      <BackButton />

      <div className={styles.container}>
        <div className={styles.hero}>
          <div>
            <div className={styles.heroCrumbs}>
              <Breadcrumbs
                trail={[
                  { name: 'Home', path: ROUTES.home },
                  { name: crumb || title, path },
                ]}
              />
            </div>
            <span className="eyebrow">{eyebrow}</span>
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.heroLead}>{lead}</p>
            {actions && <div className={styles.heroActions}>{actions}</div>}
          </div>

          {images?.main && (
            <motion.div
              className={styles.dish}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              {/* slowly turning text ring */}
              <svg className={styles.dishRing} viewBox="0 0 400 400" aria-hidden="true">
                <defs>
                  <path id="dish-ring-path" d="M200,200 m-176,0 a176,176 0 1,1 352,0 a176,176 0 1,1 -352,0" />
                </defs>
                <text className={styles.dishRingText}>
                  <textPath href="#dish-ring-path" textLength="1105" lengthAdjust="spacing">
                    {ring.repeat(2)}
                  </textPath>
                </text>
              </svg>

              <div className={styles.dishPlate}>
                <div className={styles.dishInner}>
                  <img src={images.main.src} alt={images.main.alt} />
                </div>
              </div>

              {images.small && (
                <div className={styles.dishSide}>
                  <img src={images.small.src} alt={images.small.alt} />
                </div>
              )}

              {chip && (
                <motion.div
                  className={styles.dishSeal}
                  animate={{ rotate: [-6, 4, -6] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <strong>{chip.big}</strong>
                  <span>{chip.text}</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {facts && (
          <dl className={styles.glance}>
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {children}
      </div>
    </section>
  );
}

/** Section heading used throughout the Learn pages. */
export function BlockHead({ kicker, title, lead }) {
  return (
    <div className={styles.blockHead}>
      {kicker && <p className={styles.kicker}>{kicker}</p>}
      <h2 className={styles.blockTitle}>{title}</h2>
      {lead && <p className={styles.blockLead}>{lead}</p>}
    </div>
  );
}
