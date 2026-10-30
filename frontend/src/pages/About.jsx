import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBookOpen, FaCalculator, FaUsers, FaArrowRight } from 'react-icons/fa6';
import LearnLayout, { BlockHead } from './LearnLayout';
import { Callout } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { SITE } from '../constants/site';
import { IMG } from '../constants/images';
import { recipes } from '../data/recipes';
import { blogs } from '../data/blogs';
import styles from './Learn.module.css';

const PILLARS = [
  {
    icon: <FaBookOpen />,
    color: '#7f9a5f',
    title: 'Learn',
    text: 'Plain-language guides, articles and recipes on food, health and the environment, written for people who are curious rather than already convinced.',
    link: { to: ROUTES.whatIsVeganism, label: 'Start with the basics' },
  },
  {
    icon: <FaCalculator />,
    color: '#e3a36e',
    title: 'Explore',
    text: 'Interactive tools to estimate your calories, compare diets, plan a week of meals and see the footprint of what is on your plate.',
    link: { to: ROUTES.calculator, label: 'Try the tools' },
  },
  {
    icon: <FaUsers />,
    color: '#9d82ab',
    title: 'Connect',
    text: 'A moderated community where people at every stage can ask questions, share recipes and swap tips without judgement.',
    link: { to: ROUTES.community, label: 'Join the community' },
  },
];

const PRINCIPLES = [
  { title: 'Every statistic has a source', text: 'Figures link to a peer-reviewed study or an international agency wherever possible, and every article lists its references.' },
  { title: 'Estimates are labelled as estimates', text: 'Where numbers are rounded or illustrative, the page says so. We would rather be approximately right than precisely wrong.' },
  { title: 'Health content is educational', text: 'We give general information, never personal medical advice, and we say where a doctor or dietitian is the better person to ask.' },
  { title: 'Uncertainty is shown, not hidden', text: 'Some claims are strongly supported and some are not. We rate the evidence instead of presenting everything as settled.' },
];

const AUDIENCE = [
  'Students on a budget',
  'People curious about veganism',
  'Home cooks',
  'Athletes and gym-goers',
  'Families planning meals',
  'Anyone cutting their footprint',
];

export default function About() {
  const facts = [
    { label: 'Recipes', value: `${recipes.length} plant-based recipes` },
    { label: 'Articles', value: `${blogs.length} sourced articles` },
    { label: 'Tools', value: '7 interactive tools' },
    { label: 'Cost', value: 'Free to use' },
  ];

  return (
    <LearnLayout
      seoTitle="About Vegan Life"
      description={SITE.description}
      path={ROUTES.about}
      crumb="About"
      eyebrow="Organisation"
      title={`About ${SITE.name}`}
      lead={
        <>
          A community platform for learning what veganism means, exploring practical resources and{' '}
          <mark>connecting with people moving toward more compassionate, sustainable living</mark>.
        </>
      }
      actions={
        <>
          <Link to={ROUTES.getStarted} className="btn btn-primary">
            Get started <FaArrowRight aria-hidden="true" />
          </Link>
          <Link to={ROUTES.contact} className="btn btn-outline">Contact us</Link>
        </>
      }
      images={{
        main: { src: IMG.bVeganMyths, alt: 'A fresh green plant-based salad' },
        small: { src: IMG.iSesame, alt: 'A colourful salad with avocado' },
      }}
      chip={{ big: `${recipes.length}`, text: 'Plant-based recipes you can cook today' }}
      facts={facts}
    >
      {/* ═════════ what we do ═════════ */}
      <section className={styles.block}>
        <BlockHead
          kicker="What we do"
          title="Learn, explore, connect"
          lead="Three parts that work together: understand the ideas, try them out, and talk to people doing the same."
        />
        <div className={styles.threeUp}>
          {PILLARS.map((p, i) => (
            <motion.article
              key={p.title}
              className={styles.plateItem}
              style={{ '--accent': p.color }}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className={styles.plateIcon} aria-hidden="true">{p.icon}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <Link to={p.link.to} className={styles.cardLink}>
                {p.link.label} <FaArrowRight aria-hidden="true" />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ═════════ how we handle facts ═════════ */}
      <section className={styles.block}>
        <BlockHead
          kicker="Our standards"
          title="How we handle facts"
          lead={
            <>
              Food and health topics attract strong claims. These four rules keep the site{' '}
              <mark className={styles.mark}>honest about what is known and what is not</mark>.
            </>
          }
        />
        <ol className={styles.principles}>
          {PRINCIPLES.map((p, i) => (
            <motion.li
              key={p.title}
              className={styles.principle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
            >
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </motion.li>
          ))}
        </ol>
        <p style={{ marginTop: 'var(--space-md)' }}>
          Every reference is collected on the <Link to={ROUTES.sources} style={{ textDecoration: 'underline', color: 'inherit', fontWeight: 400 }}>sources page</Link>.
        </p>
      </section>

      {/* ═════════ who it's for ═════════ */}
      <section className={styles.block}>
        <BlockHead kicker="Who it is for" title="Made for real kitchens" />
        <ul className={styles.audience}>
          {AUDIENCE.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </section>

      <aside className={styles.cta}>
        <div>
          <h2>Spotted an error?</h2>
          <p>
            Tell us about a wrong figure, a broken link or a source we should add. Corrections make the site
            better for everyone.
          </p>
        </div>
        <div className={styles.ctaActions}>
          <Link to={ROUTES.contact} className="btn btn-primary">Contact us</Link>
          <Link to={ROUTES.sources} className="btn btn-outline">View sources</Link>
        </div>
      </aside>

      <Callout variant="note" title="Independent and educational">
        {SITE.name} is an independent educational platform. Nothing here is personal medical or dietary advice.
      </Callout>
    </LearnLayout>
  );
}
