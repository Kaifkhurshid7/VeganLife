import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa6';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import LearnLayout, { BlockHead } from './LearnLayout';
import { Callout, ReferenceList } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { IMG } from '../constants/images';
import styles from './Learn.module.css';

const FACTS = [
  { label: 'Time to settle in', value: 'A few weeks, at your pace' },
  { label: 'Cost', value: 'Staples are among the cheapest foods' },
  { label: 'First step', value: 'Meals you already eat' },
  { label: 'Plan from day one', value: 'Vitamin B12' },
];

const STEPS = [
  { week: 'Step 1 · Look around', title: 'Start with what you already eat', body: 'Dal, rajma, chana, poha, idli and many vegetable curries are vegan already. Build on meals you know before hunting for substitutes.' },
  { week: 'Step 2 · Swap', title: 'Change one thing at a time', body: 'Replace one meal or one ingredient a week: plant milk in tea, oil instead of ghee, tofu instead of paneer. A gradual shift is easier to keep.' },
  { week: 'Step 3 · Cover the gaps', title: 'Plan the nutrients', body: 'Take or eat fortified sources of vitamin B12. Include legumes, nuts and seeds, leafy greens, and calcium-set tofu or fortified plant milk. Pair iron-rich foods with vitamin C.' },
  { week: 'Step 4 · Build a routine', title: 'Learn a few staple meals', body: 'Pick three or four meals you enjoy and can cook quickly. The meal planner and recipes have budget-friendly ideas to start from.' },
  { week: 'Step 5 · Relax', title: 'Read labels, not too anxiously', body: 'Look out for gelatin, casein, whey and honey. Perfection is not the point; most people improve over time.' },
];

const PANTRY = [
  { name: 'Lentils and dal', why: 'Cheap protein and iron, ready in 20 minutes' },
  { name: 'Chickpeas and rajma', why: 'Curries, salads and snacks from one tin or bag' },
  { name: 'Rice, oats or millets', why: 'The base for most meals' },
  { name: 'Tofu or soya chunks', why: 'Fast, high-protein and absorbs any spice' },
  { name: 'Peanuts and nuts', why: 'Healthy fats, zinc and a portable snack' },
  { name: 'Flax, chia or sesame', why: 'Omega-3 and calcium in small amounts' },
  { name: 'Fortified plant milk', why: 'For tea, oats and calcium (check the label)' },
  { name: 'A B12 source', why: 'Fortified foods or a supplement, every week' },
  { name: 'Spices and chutneys', why: 'Make simple food taste like a meal' },
  { name: 'Frozen vegetables', why: 'No waste and always on hand' },
];

const SWAPS = [
  { from: 'Milk', to: 'Fortified soy milk' },
  { from: 'Paneer', to: 'Tofu' },
  { from: 'Ghee', to: 'Vegetable oil' },
  { from: 'Curd', to: 'Soy or coconut curd' },
  { from: 'Egg bhurji', to: 'Besan or tofu bhurji' },
  { from: 'Honey', to: 'Jaggery or date syrup' },
];

const REFS = [
  { org: 'NIH Office of Dietary Supplements', title: 'Vitamin B12 fact sheet for consumers', link: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/' },
  { org: 'NHS', title: 'The vegan diet', link: 'https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/the-vegan-diet/' },
  { org: 'Academy of Nutrition and Dietetics', title: 'Position paper: vegetarian diets', link: 'https://pubmed.ncbi.nlm.nih.gov/27886704/' },
  { org: 'Harvard T.H. Chan School of Public Health', title: 'The Nutrition Source: protein', link: 'https://nutritionsource.hsph.harvard.edu/what-should-you-eat/protein/' },
];

export default function GetStarted() {
  const [stocked, setStocked] = useState({});
  const count = Object.values(stocked).filter(Boolean).length;
  const toggle = (name) => setStocked((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <LearnLayout
      seoTitle="How to Start a Vegan Diet: A Beginner’s Guide"
      description="A practical beginner’s guide to eating vegan: a five-step path, a starter pantry checklist and easy swaps for everyday foods."
      path={ROUTES.getStarted}
      crumb="Get started"
      eyebrow="Beginner’s guide"
      title="How to get started"
      lead={
        <>
          You do not need to change everything overnight. Follow five steps, stock a simple pantry, and{' '}
          <mark>swap one thing at a time</mark>.
        </>
      }
      actions={
        <>
          <Link to={ROUTES.recipes} className="btn btn-primary">
            Browse recipes <FaArrowRight aria-hidden="true" />
          </Link>
          <Link to={ROUTES.planner} className="btn btn-outline">Meal planner</Link>
        </>
      }
      images={{
        main: { src: IMG.bQuickMeals, alt: 'Layered salad jars with fresh vegetables' },
        small: { src: IMG.iPeanuts, alt: 'A fresh salad plate' },
      }}
      chip={{ big: '5', text: 'Simple steps. No need to do them all at once' }}
      facts={FACTS}
    >
      {/* ═════════ five-step path ═════════ */}
      <section className={styles.block}>
        <BlockHead kicker="The path" title="Five steps, your pace" />
        <ol className={styles.path}>
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              className={styles.pathStep}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: Math.min(i, 2) * 0.05 }}
            >
              <span className={styles.pathNode} aria-hidden="true">{i + 1}</span>
              <div className={styles.pathCard}>
                <p className={styles.pathWeek}>{s.week}</p>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ═════════ pantry checklist ═════════ */}
      <section className={styles.block}>
        <div className={styles.pantryWrap}>
          <div className={styles.pantryIntro}>
            <BlockHead
              kicker="Starter pantry"
              title="Stock ten staples"
              lead="Tap what you already have at home. Most of the list costs very little."
            />
            <div className={styles.meter}>
              <div className={styles.meterTop}>
                <span>Stocked</span>
                <strong>{count} / {PANTRY.length}</strong>
              </div>
              <div className={styles.meterTrack} aria-hidden="true">
                <span className={styles.meterFill} style={{ width: `${(count / PANTRY.length) * 100}%` }} />
              </div>
              <p className="sr-only" role="status" aria-live="polite">
                {count} of {PANTRY.length} staples stocked
              </p>
            </div>
          </div>

          <ul className={styles.pantry}>
            {PANTRY.map((item) => {
              const done = Boolean(stocked[item.name]);
              return (
                <li key={item.name}>
                  <button
                    type="button"
                    className={`${styles.pantryItem} ${done ? styles.pantryDone : ''}`}
                    aria-pressed={done}
                    onClick={() => toggle(item.name)}
                  >
                    <span className={styles.tick} aria-hidden="true"><FiCheck /></span>
                    <span>
                      <span className={styles.pantryName}>{item.name}</span>
                      <span className={styles.pantryWhy}>{item.why}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ═════════ easy swaps ═════════ */}
      <section className={styles.block}>
        <BlockHead
          kicker="Easy swaps"
          title="Instead of this, try that"
          lead="Small substitutions keep familiar flavours. Choose fortified versions where you can."
        />
        <div className={styles.swaps}>
          {SWAPS.map((s) => (
            <div key={s.from} className={styles.swap}>
              <span className={styles.swapFrom}>{s.from}</span>
              <FiArrowRight className={styles.swapArrow} aria-label="becomes" />
              <span className={styles.swapTo}>{s.to}</span>
            </div>
          ))}
        </div>
      </section>

      <aside className={styles.cta}>
        <div>
          <h2>Ready for your first week?</h2>
          <p>Pick a weekly plan and get an automatic grocery list, so the shopping is sorted too.</p>
        </div>
        <div className={styles.ctaActions}>
          <Link to={ROUTES.planner} className="btn btn-primary">Weekly meal planner</Link>
          <Link to={ROUTES.seasonal} className="btn btn-outline">Seasonal produce</Link>
        </div>
      </aside>

      <div className={styles.stack}>
        <Callout variant="info" title="Talk to a professional if needed">
          Pregnancy, childhood, chronic conditions and heavy training all change nutritional needs. A doctor or
          registered dietitian can tailor advice to you.
        </Callout>
        <ReferenceList panel title="Sources & further reading" refs={REFS} />
      </div>
    </LearnLayout>
  );
}
