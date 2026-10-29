import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa6';
import LearnLayout, { BlockHead } from './LearnLayout';
import { Callout, ReferenceList } from '../components/ui';
import { ROUTES } from '../constants/routes';
import { IMG } from '../constants/images';
import styles from './Learn.module.css';

const FACTS = [
  { label: 'Food’s share of emissions', value: 'About a quarter' },
  { label: 'Cut to land use, if all went plant-based', value: 'About 76%' },
  { label: 'Vegetarian heart-disease risk', value: 'About 25% lower' },
  { label: 'Land animals slaughtered a year', value: 'Over 80 billion' },
];

/*
  `evidence` is how many of four segments to fill. It rates how well the claim is
  supported by research, not how much the claim matters: the animal-welfare
  reason is an ethical position, so it is deliberately shown as "not a
  scientific question" rather than scored.
*/
const PILLARS = [
  {
    kicker: 'Reason 1',
    title: 'Environment',
    color: '#7f9a5f',
    num: '~26%',
    numLabel: 'of global greenhouse gas emissions come from food',
    body: 'Animal products account for well over half of food’s emissions. A 2018 analysis of nearly 40,000 farms estimated that a global shift to plant-based diets could cut food-related land use by about three-quarters.',
    gauge: { level: 4, label: 'Strong', note: 'Many independent studies agree on the direction and rough size.' },
    link: { to: ROUTES.compare, label: 'See the comparison' },
  },
  {
    kicker: 'Reason 2',
    title: 'Health',
    color: '#e3a36e',
    num: '~25%',
    numLabel: 'lower heart-disease risk in vegetarians, 15% lower cancer risk in vegans',
    body: 'A 2017 meta-analysis linked vegetarian and vegan diets to better health outcomes. These are associations, and results depend on diet quality: chips and fizzy drinks are vegan too.',
    gauge: { level: 3, label: 'Moderate', note: 'Mostly observational studies, so they show links rather than proof.' },
    link: { to: ROUTES.calculator, label: 'Try the calculator' },
  },
  {
    kicker: 'Reason 3',
    title: 'Animals',
    color: '#9d82ab',
    num: '80bn+',
    numLabel: 'land animals are slaughtered for food every year',
    body: 'Many people go vegan because they do not want animals raised and killed for food. This is an ethical position rather than a scientific one, and it is the original motivation behind the movement.',
    gauge: { level: 0, label: 'Ethical', note: 'A matter of values, not something research can settle.' },
    link: { to: ROUTES.whatIsVeganism, label: 'What veganism means' },
  },
];

const REFS = [
  { org: 'Science (Poore & Nemecek, 2018)', title: 'Reducing food’s environmental impacts through producers and consumers', link: 'https://www.science.org/doi/10.1126/science.aaq0216' },
  { org: 'Our World in Data', title: 'Environmental impacts of food production', link: 'https://ourworldindata.org/environmental-impacts-of-food' },
  { org: 'Critical Reviews in Food Science and Nutrition', title: 'Vegetarian, vegan diets and multiple health outcomes (Dinu et al., 2017)', link: 'https://pubmed.ncbi.nlm.nih.gov/26853923/' },
  { org: 'FAO', title: 'Global Livestock Environmental Assessment Model', link: 'https://www.fao.org/gleam/results/en/' },
  { org: 'Our World in Data', title: 'How many animals are slaughtered each year?', link: 'https://ourworldindata.org/animal-slaughtered' },
  { org: 'The Vegan Society', title: 'Definition of veganism', link: 'https://www.vegansociety.com/go-vegan/definition-veganism' },
];

export default function WhyVeganism() {
  return (
    <LearnLayout
      seoTitle="Why Go Vegan? Environment, Health and Animals"
      description="The main reasons people choose veganism, with the research behind the environmental and health claims and an honest rating of how strong each one is."
      path={ROUTES.whyVeganism}
      crumb="Why veganism?"
      eyebrow="Learn"
      title="Why people choose veganism"
      lead={
        <>
          Three reasons come up again and again. Here is what the research says about each, and{' '}
          <mark>how strong the evidence really is</mark>.
        </>
      }
      actions={
        <>
          <Link to={ROUTES.getStarted} className="btn btn-primary">
            How to get started <FaArrowRight aria-hidden="true" />
          </Link>
          <Link to={ROUTES.infographic} className="btn btn-outline">See the story in charts</Link>
        </>
      }
      images={{
        main: { src: IMG.aEnvironment, alt: 'Sunlight through a green forest' },
        small: { src: IMG.aSustainability, alt: 'A field at sunrise' },
      }}
      chip={{ big: '76%', text: 'Less farmland needed if everyone ate plant-based' }}
      facts={FACTS}
    >
      <section className={styles.block}>
        <BlockHead
          kicker="Three reasons"
          title="Environment, health, animals"
          lead="Each card shows the headline number, the context and a rating of the evidence behind it."
        />
        <div className={styles.pillars}>
          {PILLARS.map((p, i) => (
            <motion.article
              key={p.title}
              className={styles.pillar}
              style={{ '--accent': p.color }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <header className={styles.pillarTop}>
                <p className={styles.pillarKicker}>{p.kicker}</p>
                <h3>{p.title}</h3>
                <span className={styles.pillarNum}>{p.num}</span>
                <span className={styles.pillarNumLabel}>{p.numLabel}</span>
              </header>

              <div className={styles.pillarBody}>
                <p>{p.body}</p>

                <div className={styles.gauge}>
                  <p className={styles.gaugeLabel}>
                    <span>Strength of evidence</span>
                    <strong>{p.gauge.label}</strong>
                  </p>
                  <div
                    className={styles.gaugeBar}
                    role="img"
                    aria-label={`Evidence strength: ${p.gauge.label}`}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <span key={n} className={n <= p.gauge.level ? styles.on : ''} />
                    ))}
                  </div>
                  <p className={styles.gaugeNote}>{p.gauge.note}</p>
                </div>

                <Link to={p.link.to} className={styles.pillarLink}>
                  {p.link.label} <FaArrowRight aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <aside className={styles.cta}>
        <div>
          <h2>Where it is less clear-cut</h2>
          <p>
            Averages hide a lot. A badly planned vegan diet can be low in key nutrients, and a thoughtful
            low-meat diet can have a smaller footprint than a processed vegan one. Use these figures to
            understand scale, not to judge anyone’s plate.
          </p>
        </div>
        <div className={styles.ctaActions}>
          <Link to={ROUTES.getStarted} className="btn btn-primary">Get started</Link>
          <Link to={ROUTES.sources} className="btn btn-outline">All our sources</Link>
        </div>
      </aside>

      <div className={styles.stack}>
        <Callout variant="note" title="General information">
          This page is educational. Health findings describe population-level associations and are not
          personal medical advice.
        </Callout>
        <ReferenceList panel title="Sources & further reading" refs={REFS} />
      </div>
    </LearnLayout>
  );
}
