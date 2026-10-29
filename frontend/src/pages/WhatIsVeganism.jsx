import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCarrot, FaSeedling, FaWheatAwn, FaBowlFood, FaPills, FaArrowRight } from 'react-icons/fa6';
import { FiCheck, FiX, FiMinus } from 'react-icons/fi';
import LearnLayout, { BlockHead } from './LearnLayout';
import { Callout, ReferenceList } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { IMG } from '../constants/images';
import styles from './Learn.module.css';

const FACTS = [
  { label: 'Term coined', value: '1944, by The Vegan Society' },
  { label: 'Left off the plate', value: 'Meat, fish, dairy, eggs, honey' },
  { label: 'Why people choose it', value: 'Animals, environment, health' },
  { label: 'One nutrient to plan', value: 'Vitamin B12' },
];

const PLATE = [
  { icon: <FaCarrot />, color: '#e3a36e', title: 'Vegetables & fruit', text: 'Leafy greens, roots, berries and citrus supply vitamins, fibre and vitamin C.' },
  { icon: <FaSeedling />, color: '#7f9a5f', title: 'Legumes', text: 'Beans, lentils, chickpeas and peas: the protein and iron backbone of the diet.' },
  { icon: <FaWheatAwn />, color: '#b07a4a', title: 'Whole grains', text: 'Rice, millets, oats and whole wheat for steady energy and B vitamins.' },
  { icon: <FaBowlFood />, color: '#9d82ab', title: 'Nuts & seeds', text: 'Peanuts, almonds, flax, chia and sesame add healthy fats, zinc and omega-3.' },
  { icon: <FaPills />, color: '#6f9a9a', title: 'Fortified foods', text: 'Plant milks and cereals with added B12, calcium and vitamin D fill the gaps.' },
];

const COMPARE = [
  { item: 'Meat', veg: 'no', vegan: 'no' },
  { item: 'Fish and seafood', veg: 'no', vegan: 'no' },
  { item: 'Dairy (milk, curd, paneer, ghee)', veg: 'maybe', vegan: 'no' },
  { item: 'Eggs', veg: 'maybe', vegan: 'no' },
  { item: 'Honey', veg: 'maybe', vegan: 'no' },
  { item: 'Leather, wool, silk', veg: 'maybe', vegan: 'no' },
];

const STATE = {
  yes: { icon: <FiCheck />, label: 'Eaten', cls: styles.yes },
  no: { icon: <FiX />, label: 'Avoided', cls: styles.no },
  maybe: { icon: <FiMinus />, label: 'Often eaten', cls: styles.maybe },
};

const NUTRIENTS = [
  { name: 'Vitamin B12', note: 'Fortified foods or a supplement. Plants do not supply it reliably.', priority: true },
  { name: 'Iron', note: 'Lentils, chickpeas, spinach, sesame. Pair with vitamin C to absorb more.' },
  { name: 'Calcium', note: 'Calcium-set tofu, fortified plant milks, greens, sesame and ragi.' },
  { name: 'Vitamin D', note: 'Sunlight, fortified foods or a supplement, depending on where you live.' },
  { name: 'Iodine', note: 'Iodised salt is the simplest source. Check your own intake.' },
  { name: 'Zinc', note: 'Legumes, nuts, seeds and whole grains. Soaking and sprouting help.' },
  { name: 'Omega-3 (ALA)', note: 'Flax, chia and walnuts. Some people also choose an algae supplement.' },
];

const REFS = [
  { org: 'The Vegan Society', title: 'Definition of veganism', link: 'https://www.vegansociety.com/go-vegan/definition-veganism' },
  { org: 'Academy of Nutrition and Dietetics', title: 'Position paper: vegetarian diets', link: 'https://pubmed.ncbi.nlm.nih.gov/27886704/' },
  { org: 'NHS', title: 'The vegan diet', link: 'https://www.nhs.uk/live-well/eat-well/how-to-eat-a-balanced-diet/the-vegan-diet/' },
  { org: 'NIH Office of Dietary Supplements', title: 'Vitamin B12 fact sheet for consumers', link: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/' },
  { org: 'Harvard T.H. Chan School of Public Health', title: 'The Nutrition Source: vegetarian diet', link: 'https://nutritionsource.hsph.harvard.edu/healthy-weight/diet-reviews/vegetarian-diet/' },
];

export default function WhatIsVeganism() {
  return (
    <LearnLayout
      seoTitle="What Is Veganism? A Plain-English Guide"
      description="What veganism means, how it differs from vegetarianism, what vegans eat and avoid, which nutrients to plan for, and where to read more."
      path={ROUTES.whatIsVeganism}
      crumb="What is veganism?"
      eyebrow="Learn"
      title="What is veganism?"
      lead={
        <>
          Veganism is a way of living that seeks to avoid, as far as is practicable,{' '}
          <mark>the use of animals for food, clothing and other purposes</mark>. In everyday terms, it means
          eating plants and leaving out meat, fish, dairy, eggs and honey.
        </>
      }
      actions={
        <>
          <Link to={ROUTES.getStarted} className="btn btn-primary">
            How to get started <FaArrowRight aria-hidden="true" />
          </Link>
          <Link to={ROUTES.whyVeganism} className="btn btn-outline">Why people choose it</Link>
        </>
      }
      images={{
        main: { src: IMG.bPlantProtein, alt: 'A colourful plant-based bowl with avocado, chickpeas and sweet potato' },
        small: { src: IMG.gHostelMeals, alt: 'A vegetable and quinoa plate' },
      }}
      chip={{ big: '1944', text: 'The year the word “vegan” was coined' }}
      facts={FACTS}
    >
      {/* ═════════ what vegans eat ═════════ */}
      <section className={styles.block}>
        <BlockHead
          kicker="On the plate"
          title="What vegans eat"
          lead="A vegan diet is built from five food groups. Many people also check labels for less obvious animal ingredients such as gelatin, casein and some food colourings."
        />
        <div className={styles.plate}>
          {PLATE.map((g, i) => (
            <motion.article
              key={g.title}
              className={styles.plateItem}
              style={{ '--accent': g.color }}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <span className={styles.plateIcon} aria-hidden="true">{g.icon}</span>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ═════════ vegan vs vegetarian ═════════ */}
      <section className={styles.block}>
        <BlockHead
          kicker="Side by side"
          title="Vegan or vegetarian?"
          lead="Both leave out meat and fish. The difference is everything else that comes from animals."
        />
        <table className={styles.compare}>
          <caption>“Often eaten” means many vegetarians eat it, though some avoid it too.</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Vegetarian</th>
              <th scope="col">Vegan</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((row) => {
              const veg = STATE[row.veg];
              const vegan = STATE[row.vegan];
              return (
                <tr key={row.item}>
                  <th scope="row">{row.item}</th>
                  <td><span className={veg.cls}>{veg.icon} {veg.label}</span></td>
                  <td><span className={vegan.cls}>{vegan.icon} {vegan.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* ═════════ is it healthy ═════════ */}
      <section className={styles.block}>
        <BlockHead
          kicker="Health"
          title="Is it healthy?"
          lead={
            <>
              Dietetic associations say that <mark className={styles.mark}>well-planned vegan diets can be nutritionally
              adequate at all stages of life</mark>. “Well-planned” matters: seven nutrients deserve attention.
            </>
          }
        />
        <div className={styles.nutrients}>
          {NUTRIENTS.map((n, i) => (
            <motion.article
              key={n.name}
              className={styles.nutrient}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
            >
              <span className={`${styles.nutrientTag} ${n.priority ? styles.priority : ''}`}>
                {n.priority ? 'Always plan' : 'Check'}
              </span>
              <h3>{n.name}</h3>
              <p>{n.note}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ═════════ closing ═════════ */}
      <aside className={styles.cta}>
        <div>
          <h2>Ready to try it?</h2>
          <p>Start with meals you already eat, then build from there. There is no single correct pace.</p>
        </div>
        <div className={styles.ctaActions}>
          <Link to={ROUTES.getStarted} className="btn btn-primary">Get started</Link>
          <Link to={ROUTES.recipes} className="btn btn-outline">Browse recipes</Link>
        </div>
      </aside>

      <div className={styles.stack}>
        <Callout variant="note" title="General information">
          This page is educational and is not personal medical or dietary advice. If you have a health
          condition, are pregnant, or are planning for children, speak with a doctor or registered dietitian.
        </Callout>
        <ReferenceList panel title="Sources & further reading" refs={REFS} />
      </div>
    </LearnLayout>
  );
}
