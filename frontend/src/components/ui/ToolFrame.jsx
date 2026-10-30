import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaCalculator, FaDroplet, FaCalendarDays, FaCarrot, FaScaleBalanced,
  FaEarthAmericas, FaChartLine,
} from 'react-icons/fa6';
import { FiArrowRight } from 'react-icons/fi';
import BackButton from './BackButton';
import Breadcrumbs from './Breadcrumbs';
import { Seo } from '../seo';
import { ROUTES } from '../../constants/routes';
import styles from './ToolFrame.module.css';

/**
 * One registry for every tool: used for the page banner (icon, accent colour)
 * and for the "More tools" strip at the foot of each tool page.
 */
export const TOOLS = {
  calculator: {
    path: ROUTES.calculator, name: 'BMI & calorie calculator', short: 'Daily calories, protein and meal ideas',
    icon: <FaCalculator />, color: '#7f9a5f',
  },
  savings: {
    path: ROUTES.savings, name: 'Impact per meal', short: 'Carbon, water and land saved by your meals',
    icon: <FaDroplet />, color: '#6f9a9a',
  },
  planner: {
    path: ROUTES.planner, name: 'Weekly meal planner', short: 'A week of meals and a grocery list',
    icon: <FaCalendarDays />, color: '#e3a36e',
  },
  seasonal: {
    path: ROUTES.seasonal, name: 'Seasonal produce', short: 'What is fresh in each Indian season',
    icon: <FaCarrot />, color: '#b07a4a',
  },
  compare: {
    path: ROUTES.compare, name: 'Vegan vs high-meat', short: 'Carbon, water and land side by side',
    icon: <FaScaleBalanced />, color: '#9d82ab',
  },
  worldMap: {
    path: ROUTES.worldMap, name: 'World map', short: 'Emissions and meat supply by country',
    icon: <FaEarthAmericas />, color: '#7f9a5f',
  },
  infographic: {
    path: ROUTES.infographic, name: 'The story of our food', short: 'A scroll-driven look at the evidence',
    icon: <FaChartLine />, color: '#e3a36e',
  },
};

/**
 * Shared frame for the tool pages: SEO, back button, breadcrumb, a banner with
 * the page's single H1, the tool itself, and links to the other tools.
 */
export default function ToolFrame({ tool, seoTitle, description, eyebrow, title, lead, frameRef, children }) {
  const meta = TOOLS[tool];
  const others = Object.entries(TOOLS).filter(([key]) => key !== tool);

  return (
    <section className={styles.page} ref={frameRef}>
      <Seo title={seoTitle || title} description={description} path={meta.path} />
      <BackButton />

      <div className={styles.wrap}>
        <div className={styles.crumbs}>
          <Breadcrumbs
            trail={[
              { name: 'Home', path: ROUTES.home },
              { name: meta.name, path: meta.path },
            ]}
          />
        </div>

        <motion.header
          className={styles.banner}
          style={{ '--accent': meta.color }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.watermark} aria-hidden="true">{meta.icon}</span>
          <div className={styles.bannerText}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1>{title}</h1>
            <p>{lead}</p>
          </div>
          <span className={styles.bannerIcon} aria-hidden="true">{meta.icon}</span>
        </motion.header>

        <div className={styles.content}>{children}</div>

        <nav className={styles.more} aria-label="More tools">
          <p className={styles.moreKicker}>Keep exploring</p>
          <h2 className={styles.moreTitle}>More tools</h2>
          <ul className={styles.moreGrid}>
            {others.map(([key, t]) => (
              <li key={key}>
                <Link to={t.path} className={styles.moreCard} style={{ '--accent': t.color }}>
                  <span className={styles.moreIcon} aria-hidden="true">{t.icon}</span>
                  <span className={styles.moreText}>
                    <strong>{t.name}</strong>
                    <span>{t.short}</span>
                  </span>
                  <FiArrowRight className={styles.moreArrow} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
